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

const getYearMonthKey = (date) => {
  const d = new Date(date);

  const year = d.getFullYear();

  const month = String(d.getMonth() + 1).padStart(2, "0");

  return `${year}-${month}`;
};

const getMonthLabel = (yearMonth) => {
  const [year, month] = yearMonth.split("-");

  return `${MONTH_NAMES[Number(month) - 1]} ${year}`;
};

/**
 * ==============================================
 * MATHEMATICAL HELPERS
 * ==============================================
 */

const round = (value) => Number(Number(value).toFixed(2));

const calculateAverage = (values) => {
  if (!values.length) {
    return 0;
  }

  return values.reduce((sum, value) => sum + value, 0) / values.length;
};

const calculateGrowthRate = (previous, current) => {
  if (previous === 0) {
    return 0;
  }

  return (current - previous) / previous;
};

/**
 * ==============================================
 * REVENUE DATASET
 * ==============================================
 */

const buildRevenueDataset = (payments) => {
  const monthlyRevenue = {};

  payments.forEach((payment) => {
    const key = getYearMonthKey(payment.payment_date);

    monthlyRevenue[key] =
      (monthlyRevenue[key] ?? 0) + Number(payment.amount || 0);
  });

  return Object.entries(monthlyRevenue)
    .sort(([a], [b]) => a.localeCompare(b))
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
  if (!revenueDataset.length) {
    return [];
  }

  const revenues = revenueDataset.map((item) => item.revenue);

  const movingAverage = calculateAverage(revenues);

  const previousRevenue =
    revenues.length >= 2 ? revenues[revenues.length - 2] : movingAverage;

  const currentRevenue =
    revenues.length >= 1 ? revenues[revenues.length - 1] : movingAverage;

  const growthRate = calculateGrowthRate(previousRevenue, currentRevenue);

  const forecastRevenue = movingAverage * (1 + growthRate);

  const forecast = revenueDataset.map((item) => ({
    period: item.label,

    actual: item.revenue,

    forecast: null,

    type: "Historical",
  }));

  const latestMonth = revenueDataset[revenueDataset.length - 1].month;

  const latestDate = new Date(`${latestMonth}-01`);

  latestDate.setMonth(latestDate.getMonth() + 1);

  const forecastKey = getYearMonthKey(latestDate);

  forecast.push({
    period: getMonthLabel(forecastKey),

    actual: null,

    forecast: round(forecastRevenue),

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
    const usage = usageLogs.filter((log) => log.item_id === item.id);

    const restockHistory = restocks.filter(
      (restock) => restock.item_id === item.id,
    );

    const averageUsage = calculateAverage(
      usage.map((log) => Number(log.quantity_used)),
    );

    const averageRestock = calculateAverage(
      restockHistory.map((restock) => Number(restock.quantity_added)),
    );

    const predictedStock =
      Number(item.current_stock) - averageUsage + averageRestock;

    return {
      itemId: item.id,

      itemName: item.name,

      currentStock: round(item.current_stock),

      minimumStock: round(item.minimum_stock),

      averageUsage: round(averageUsage),

      averageRestock: round(averageRestock),

      predictedStock: round(predictedStock < 0 ? 0 : predictedStock),
    };
  });
};

/**
 * ==============================================
 * REVENUE TREND ANALYSIS
 * ==============================================
 */

const analyzeRevenueTrend = (revenueForecast) => {
  if (!revenueForecast.length) {
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

  const growthRate = Number(forecast.growthRate ?? 0);

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

    growthRate,

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

  /**
   * Revenue Recommendations
   */

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
  }

  /**
   * Inventory Recommendations
   */

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

          title: `Review Inventory Usage`,

          description: `${item.itemName} has no recorded usage. Verify whether inventory logging is complete.`,
        });

        break;

      default:
        break;
    }
  });

  /**
   * Sort by Priority
   */

  const priorityOrder = {
    Critical: 1,
    High: 2,
    Medium: 3,
    Low: 4,
  };

  recommendations.sort(
    (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority],
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

  /**
   * Revenue Alerts
   */

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

  /**
   * Inventory Alerts
   */

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
    generatedAt: new Date(),

    revenueTrend: revenueTrend.trend,

    growthRate: revenueTrend.growthRate,

    recommendationCount: recommendations.length,

    alertCount: alerts.length,

    hasCriticalAlerts: alerts.some((alert) => alert.severity === "Critical"),
  };
};

/**
 * ==============================================
 * MAIN DECISION SUPPORT SERVICE
 * ==============================================
 */

export const getDecisionSupport = async () => {
  /**
   * Retrieve data directly from models
   */

  const [orders, payments, inventoryItems, usageLogs, restocks] =
    await Promise.all([
      getOrders(),

      getPayments(),

      getInventoryItems(),

      getInventoryUsageLogs(),

      getInventoryRestocks(),
    ]);

  /**
   * Revenue Forecast
   */

  const revenueDataset = buildRevenueDataset(payments);

  const revenueForecast = generateRevenueForecast(revenueDataset);

  /**
   * Inventory Forecast
   */

  const inventoryForecast = generateInventoryForecast(
    inventoryItems,
    usageLogs,
    restocks,
  );

  /**
   * Trend Analysis
   */

  const revenueTrend = analyzeRevenueTrend(revenueForecast);

  const inventoryTrend = analyzeInventoryTrend(inventoryForecast);

  /**
   * Decision Support
   */

  const recommendations = generateRecommendations(revenueTrend, inventoryTrend);

  const alerts = generateAlerts(revenueTrend, inventoryTrend);

  /**
   * Summary
   */

  const summary = generateSummary(revenueTrend, recommendations, alerts);

  /**
   * Dashboard Response
   */

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
