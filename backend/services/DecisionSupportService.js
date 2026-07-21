// backend/services/DecisionSupportService.js

import { getOrders } from "../models/OrderModel.js";
import { getPayments } from "../models/PaymentModel.js";

import {
  getInventoryItems,
  getInventoryRestocks,
  getInventoryUsageLogs,
} from "../models/InventoryModel.js";

/**
 * ==============================================
 * DECISION SUPPORT SERVICE
 * Rule-Based Forecasting and Decision Support
 * ==============================================
 */

/**
 * ==============================================
 * DATE HELPERS
 * ==============================================
 */

const MONTH_NAMES = [
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

const isValidDate = (date) => {
  const parsedDate = new Date(date);

  return !Number.isNaN(parsedDate.getTime());
};

const getYearMonthKey = (date) => {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }

  const year = parsedDate.getFullYear();

  const month = String(parsedDate.getMonth() + 1).padStart(2, "0");

  return `${year}-${month}`;
};

const getMonthLabel = (yearMonth) => {
  if (typeof yearMonth !== "string" || !yearMonth.includes("-")) {
    return "Unknown Period";
  }

  const [year, month] = yearMonth.split("-");

  const monthIndex = Number(month) - 1;

  if (monthIndex < 0 || monthIndex >= MONTH_NAMES.length) {
    return "Unknown Period";
  }

  return `${MONTH_NAMES[monthIndex]} ${year}`;
};

const getNextMonthKey = (yearMonth = null) => {
  let date;

  if (yearMonth) {
    date = new Date(`${yearMonth}-01T00:00:00`);
  } else {
    date = new Date();
    date.setDate(1);
  }

  if (Number.isNaN(date.getTime())) {
    date = new Date();
    date.setDate(1);
  }

  date.setMonth(date.getMonth() + 1);

  return getYearMonthKey(date);
};

/**
 * ==============================================
 * DATA NORMALIZATION
 * ==============================================
 */

const normalizeRows = (result) => {
  if (!result) {
    return [];
  }

  /*
   * mysql2 can return:
   *
   * [rows, fields]
   */
  if (Array.isArray(result) && Array.isArray(result[0])) {
    return result[0];
  }

  /*
   * Some models may return:
   *
   * {
   *   rows: [...]
   * }
   */
  if (typeof result === "object" && Array.isArray(result.rows)) {
    return result.rows;
  }

  return Array.isArray(result) ? result : [];
};

/**
 * ==============================================
 * MATHEMATICAL HELPERS
 * ==============================================
 */

const toNumber = (value) => {
  const number = Number(value);

  return Number.isFinite(number) ? number : 0;
};

const round = (value) => {
  return Number(toNumber(value).toFixed(2));
};

const calculateAverage = (values) => {
  const numericValues = values
    .map(toNumber)
    .filter((value) => Number.isFinite(value));

  if (numericValues.length === 0) {
    return 0;
  }

  const total = numericValues.reduce((sum, value) => sum + value, 0);

  return total / numericValues.length;
};

const calculateGrowthRate = (previous, current) => {
  const previousValue = toNumber(previous);
  const currentValue = toNumber(current);

  if (previousValue === 0) {
    return 0;
  }

  return (currentValue - previousValue) / previousValue;
};

/**
 * ==============================================
 * REVENUE DATASET
 * ==============================================
 */

const buildRevenueDataset = (payments) => {
  const monthlyRevenue = {};

  payments.forEach((payment) => {
    const paymentDate =
      payment.payment_date ?? payment.created_at ?? payment.date;

    if (!paymentDate || !isValidDate(paymentDate)) {
      return;
    }

    const key = getYearMonthKey(paymentDate);

    if (!key) {
      return;
    }

    monthlyRevenue[key] = (monthlyRevenue[key] ?? 0) + toNumber(payment.amount);
  });

  return Object.entries(monthlyRevenue)
    .sort(([firstMonth], [secondMonth]) =>
      firstMonth.localeCompare(secondMonth),
    )
    .map(([month, revenue]) => ({
      month,
      label: getMonthLabel(month),
      revenue: round(revenue),
    }));
};

/**
 * ==============================================
 * REVENUE FORECAST
 * ==============================================
 */

const generateRevenueForecast = (revenueDataset) => {
  /*
   * No historical payments means there is
   * not enough data to create a forecast.
   */
  if (!Array.isArray(revenueDataset) || revenueDataset.length === 0) {
    return [];
  }

  const revenues = revenueDataset.map((item) => toNumber(item.revenue));

  const movingAverage = calculateAverage(revenues);

  const previousRevenue =
    revenues.length >= 2 ? revenues[revenues.length - 2] : movingAverage;

  const currentRevenue =
    revenues.length >= 1 ? revenues[revenues.length - 1] : movingAverage;

  const growthRate = calculateGrowthRate(previousRevenue, currentRevenue);

  const forecastRevenue = movingAverage * (1 + growthRate);

  const forecast = revenueDataset.map((item) => ({
    period: item.label,
    actual: round(item.revenue),
    forecast: null,
    growthRate: null,
    type: "Historical",
  }));

  const latestMonth = revenueDataset[revenueDataset.length - 1].month;

  const forecastKey = getNextMonthKey(latestMonth);

  forecast.push({
    period: getMonthLabel(forecastKey),
    actual: null,
    forecast: round(Math.max(0, forecastRevenue)),
    growthRate: round(growthRate * 100),
    type: "Forecast",
  });

  return forecast;
};

/**
 * ==============================================
 * INVENTORY FORECAST
 * ==============================================
 */

const generateInventoryForecast = (inventoryItems, usageLogs, restocks) => {
  return inventoryItems.map((item) => {
    const itemId = item.id ?? item.item_id;

    const usage = usageLogs.filter(
      (log) => String(log.item_id) === String(itemId),
    );

    const restockHistory = restocks.filter(
      (restock) => String(restock.item_id) === String(itemId),
    );

    const averageUsage = calculateAverage(
      usage.map((log) => log.quantity_used ?? log.quantity ?? 0),
    );

    const averageRestock = calculateAverage(
      restockHistory.map(
        (restock) => restock.quantity_added ?? restock.quantity ?? 0,
      ),
    );

    const currentStock = toNumber(
      item.current_stock ?? item.quantity ?? item.stock,
    );

    const minimumStock = toNumber(
      item.minimum_stock ?? item.min_stock ?? item.reorder_level,
    );

    const predictedStock = currentStock - averageUsage + averageRestock;

    return {
      itemId,
      itemName: item.name ?? item.item_name ?? "Unknown Item",
      currentStock: round(currentStock),
      minimumStock: round(minimumStock),
      averageUsage: round(averageUsage),
      averageRestock: round(averageRestock),
      predictedStock: round(Math.max(0, predictedStock)),
    };
  });
};

/**
 * ==============================================
 * REVENUE TREND ANALYSIS
 * ==============================================
 */

const analyzeRevenueTrend = (revenueForecast) => {
  if (!Array.isArray(revenueForecast) || revenueForecast.length === 0) {
    return {
      trend: "Stable",
      growthRate: 0,
      score: 0,
    };
  }

  const forecast = revenueForecast.find((item) => item.type === "Forecast");

  if (!forecast) {
    return {
      trend: "Stable",
      growthRate: 0,
      score: 0,
    };
  }

  const growthRate = toNumber(forecast.growthRate);

  let trend = "Stable";
  let score = 0;

  if (growthRate >= 20) {
    trend = "Excellent Growth";
    score = 5;
  } else if (growthRate >= 10) {
    trend = "Growing";
    score = 4;
  } else if (growthRate > 0) {
    trend = "Slight Growth";
    score = 3;
  } else if (growthRate <= -20) {
    trend = "Declining";
    score = 1;
  } else if (growthRate < 0) {
    trend = "Slight Decline";
    score = 2;
  }

  return {
    trend,
    growthRate: round(growthRate),
    score,
  };
};

/**
 * ==============================================
 * INVENTORY TREND ANALYSIS
 * ==============================================
 */

const analyzeInventoryTrend = (inventoryForecast) => {
  return inventoryForecast.map((item) => {
    let trend = "Healthy";
    let score = 5;

    if (item.predictedStock <= 0) {
      trend = "Out of Stock";
      score = 1;
    } else if (item.predictedStock <= item.minimumStock) {
      trend = "Low Stock";
      score = 2;
    } else if (item.predictedStock <= item.minimumStock * 2) {
      trend = "Monitoring";
      score = 3;
    } else if (item.averageUsage === 0) {
      trend = "No Usage";
      score = 4;
    }

    return {
      ...item,
      trend,
      score,
    };
  });
};

/**
 * ==============================================
 * DSS RECOMMENDATION ENGINE
 * ==============================================
 */

const generateRecommendations = (revenueTrend, inventoryTrend) => {
  const recommendations = [];

  switch (revenueTrend.trend) {
    case "Excellent Growth":
      recommendations.push({
        priority: "Low",
        category: "Revenue",
        title: "Expand Business Operations",
        description:
          "Revenue growth is excellent. Consider expanding marketing, staffing, or branch capacity.",
      });
      break;

    case "Growing":
      recommendations.push({
        priority: "Medium",
        category: "Revenue",
        title: "Maintain Current Strategy",
        description:
          "Revenue continues to increase. Maintain pricing strategy and monitor customer demand.",
      });
      break;

    case "Slight Growth":
      recommendations.push({
        priority: "Low",
        category: "Revenue",
        title: "Increase Customer Acquisition",
        description:
          "Revenue is improving gradually. Promotional campaigns may accelerate growth.",
      });
      break;

    case "Slight Decline":
      recommendations.push({
        priority: "Medium",
        category: "Revenue",
        title: "Review Sales Performance",
        description:
          "Revenue has started to decline. Evaluate promotions, pricing, and customer retention.",
      });
      break;

    case "Declining":
      recommendations.push({
        priority: "High",
        category: "Revenue",
        title: "Immediate Revenue Recovery Plan",
        description:
          "Revenue has significantly declined. Immediate business intervention is recommended.",
      });
      break;

    default:
      recommendations.push({
        priority: "Low",
        category: "Revenue",
        title: "Maintain Business Performance",
        description:
          "Revenue remains stable. Continue monitoring monthly performance.",
      });
      break;
  }

  inventoryTrend.forEach((item) => {
    switch (item.trend) {
      case "Out of Stock":
        recommendations.push({
          priority: "Critical",
          category: "Inventory",
          title: `Restock ${item.itemName}`,
          description: `${item.itemName} has no forecasted stock remaining. Purchase inventory immediately.`,
        });
        break;

      case "Low Stock":
        recommendations.push({
          priority: "High",
          category: "Inventory",
          title: `Prepare Restocking for ${item.itemName}`,
          description: `${item.itemName} is predicted to reach the minimum stock level soon.`,
        });
        break;

      case "Monitoring":
        recommendations.push({
          priority: "Medium",
          category: "Inventory",
          title: `Monitor ${item.itemName}`,
          description: `${item.itemName} inventory is still sufficient but should be monitored regularly.`,
        });
        break;

      case "No Usage":
        recommendations.push({
          priority: "Low",
          category: "Inventory",
          title: "Review Inventory Usage",
          description: `${item.itemName} has no recorded usage. Verify whether inventory logging is complete.`,
        });
        break;

      default:
        break;
    }
  });

  const priorityOrder = {
    Critical: 1,
    High: 2,
    Medium: 3,
    Low: 4,
  };

  recommendations.sort(
    (first, second) =>
      (priorityOrder[first.priority] ?? 999) -
      (priorityOrder[second.priority] ?? 999),
  );

  return recommendations;
};

/**
 * ==============================================
 * DSS ALERT ENGINE
 * ==============================================
 */

const generateAlerts = (revenueTrend, inventoryTrend) => {
  const alerts = [];

  switch (revenueTrend.trend) {
    case "Declining":
      alerts.push({
        severity: "Critical",
        category: "Revenue",
        title: "Revenue Decline Detected",
        description:
          "Revenue has significantly decreased compared to previous periods.",
      });
      break;

    case "Slight Decline":
      alerts.push({
        severity: "Warning",
        category: "Revenue",
        title: "Revenue Trend is Decreasing",
        description:
          "Revenue has started to decline. Continue monitoring sales performance.",
      });
      break;

    default:
      break;
  }

  inventoryTrend.forEach((item) => {
    switch (item.trend) {
      case "Out of Stock":
        alerts.push({
          severity: "Critical",
          category: "Inventory",
          title: `${item.itemName} Out of Stock`,
          description: `${item.itemName} has no forecasted remaining stock.`,
        });
        break;

      case "Low Stock":
        alerts.push({
          severity: "Warning",
          category: "Inventory",
          title: `${item.itemName} Low Stock`,
          description: `${item.itemName} is predicted to reach its minimum stock level.`,
        });
        break;

      default:
        break;
    }
  });

  return alerts;
};

/**
 * ==============================================
 * DASHBOARD SUMMARY
 * ==============================================
 */

const generateSummary = (revenueTrend, recommendations, alerts) => {
  return {
    generatedAt: new Date().toISOString(),
    revenueTrend: revenueTrend.trend,
    growthRate: toNumber(revenueTrend.growthRate),
    recommendationCount: recommendations.length,
    alertCount: alerts.length,
    hasCriticalAlerts: alerts.some(
      (alert) => String(alert.severity).toLowerCase() === "critical",
    ),
  };
};

/**
 * ==============================================
 * MAIN DECISION SUPPORT SERVICE
 * ==============================================
 */

export const getDecisionSupport = async () => {
  const [
    ordersResult,
    paymentsResult,
    inventoryItemsResult,
    usageLogsResult,
    restocksResult,
  ] = await Promise.all([
    getOrders(),
    getPayments(),
    getInventoryItems(),
    getInventoryUsageLogs(),
    getInventoryRestocks(),
  ]);

  const orders = normalizeRows(ordersResult);

  const payments = normalizeRows(paymentsResult);

  const inventoryItems = normalizeRows(inventoryItemsResult);

  const usageLogs = normalizeRows(usageLogsResult);

  const restocks = normalizeRows(restocksResult);

  const revenueDataset = buildRevenueDataset(payments);

  const revenueForecast = generateRevenueForecast(revenueDataset);

  const inventoryForecast = generateInventoryForecast(
    inventoryItems,
    usageLogs,
    restocks,
  );

  const revenueTrend = analyzeRevenueTrend(revenueForecast);

  const inventoryTrend = analyzeInventoryTrend(inventoryForecast);

  const recommendations = generateRecommendations(revenueTrend, inventoryTrend);

  const alerts = generateAlerts(revenueTrend, inventoryTrend);

  const summary = generateSummary(revenueTrend, recommendations, alerts);

  return {
    summary,

    statistics: {
      totalOrders: orders.length,
      totalPayments: payments.length,
      totalInventoryItems: inventoryItems.length,
    },

    revenueForecast,
    inventoryForecast,
    revenueTrend,
    inventoryTrend,
    recommendations,
    alerts,
  };
};

export default {
  getDecisionSupport,
};
