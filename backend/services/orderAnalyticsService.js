// backend/services/orderAnalyticsService.js

import { getOrders } from "../models/OrderModel.js";

export const getAnalytics = (period) => {
  const validPeriods = [
    "weekly",
    "monthly",
    "yearly",
  ];

  if (!validPeriods.includes(period)) {
    throw new Error(
      "Unknown analytics period"
    );
  }

  const analyticsOrders =
    getOrders();

  let labels;

  const currentYear =
    new Date().getFullYear();

  if (period === "weekly") {
    labels = [
      "Mon",
      "Tue",
      "Wed",
      "Thu",
      "Fri",
      "Sat",
      "Sun",
    ];
  } else if (period === "monthly") {
    labels = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
  } else {
    labels = Array.from(
      { length: 5 },
      (_, index) =>
        String(currentYear - 4 + index)
    );
  }

  const orders =
    Array(labels.length).fill(0);

  const revenue =
    Array(labels.length).fill(0);

  analyticsOrders
    .filter(
      (order) =>
        order.status.toLowerCase() ===
        "completed"
    )
    .forEach((order) => {
      const orderDate = new Date(
        order.orderDate
      );

      let index = -1;

      if (period === "weekly") {
        const day =
          orderDate.getDay();

        index =
          day === 0
            ? 6
            : day - 1;
      } else if (
        period === "monthly"
      ) {
        index =
          orderDate.getMonth();
      } else {
        index =
          labels.indexOf(
            String(
              orderDate.getFullYear()
            )
          );
      }

      if (
        index >= 0 &&
        index < labels.length
      ) {
        orders[index] += 1;

        revenue[index] +=
          Number(
            order.totalAmount
          );
      }
    });

  return {
    labels,
    orders,
    revenue,
  };
};

export const getWeeklyAnalytics =
  () =>
    getAnalytics("weekly");

export const getMonthlyAnalytics =
  () =>
    getAnalytics("monthly");

export const getYearlyAnalytics =
  () =>
    getAnalytics("yearly");