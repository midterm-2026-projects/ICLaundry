// backend/services/orderAnalyticsService.js
import Order from "../models/OrderModel.js";

export const getAnalytics = async (period) => {
  const validPeriods = ["weekly", "monthly", "yearly"];
  if (!validPeriods.includes(period)) {
    throw new Error("Unknown analytics period");
  }

  let groupBy, labels;
  const now = new Date();

  if (period === "weekly") {
    labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    groupBy = { $dayOfWeek: "$orderDate" };
  } else if (period === "monthly") {
    labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    groupBy = { $month: "$orderDate" };
  } else {
    labels = Array.from({ length: 5 }, (_, i) => `${now.getFullYear() - 4 + i}`);
    groupBy = { $year: "$orderDate" };
  }

  const results = await Order.aggregate([
    { $match: { status: "completed" } },
    {
      $group: {
        _id: groupBy,
        count: { $sum: 1 },
        total: { $sum: "$totalAmount" }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  // Ihanda ang output na tugma sa frontend
  const orders = Array(labels.length).fill(0);
  const revenue = Array(labels.length).fill(0);

  results.forEach(item => {
    let index;
    if (period === "weekly") {
      index = item._id - 1; // Convert Sunday=1 → index 0
      if (index === 0) index = 6; // Ilipat ang Linggo sa huli
      else index -= 1;
    } else if (period === "monthly") {
      index = item._id - 1;
    } else {
      index = labels.indexOf(String(item._id));
    }
    if (index >= 0 && index < labels.length) {
      orders[index] = item.count;
      revenue[index] = item.total;
    }
  });

  return { labels, orders, revenue };
};

export const getWeeklyAnalytics = () => getAnalytics("weekly");
export const getMonthlyAnalytics = () => getAnalytics("monthly");
export const getYearlyAnalytics = () => getAnalytics("yearly");