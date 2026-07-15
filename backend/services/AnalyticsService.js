// backend/services/AnalyticsService.js

import { getOrders } from "../models/OrderModel.js";

import { getPayments } from "../models/PaymentModel.js";

/**
 * ==============================================
 * ANALYTICS SERVICE
 * Handles dashboard business logic.
 * ==============================================
 */

/**
 * Filter records by date range
 */
const filterByDateRange = (
  records,
  startDate,
  endDate,
  dateField = "created_at",
) => {
  if (!startDate && !endDate) {
    return records;
  }

  return records.filter((record) => {
    const recordDate = new Date(record[dateField]);

    if (startDate && recordDate < new Date(startDate)) {
      return false;
    }

    if (endDate && recordDate > new Date(endDate)) {
      return false;
    }

    return true;
  });
};

/**
 * Filter by branch
 */
const filterByBranch = (records, branchId) => {
  if (!branchId) {
    return records;
  }

  return records.filter((record) => record.branch_id === branchId);
};

/**
 * ==============================================
 * KPI CALCULATIONS
 * ==============================================
 */

const calculateRevenue = (payments) => {
  return payments.reduce(
    (total, payment) => total + Number(payment.amount || 0),

    0,
  );
};

const calculateExpenses = (expenses) => {
  return expenses.reduce(
    (total, expense) =>
      total + Number(expense.total_cost ?? expense.amount ?? 0),

    0,
  );
};

const calculateNetProfit = (revenue, expenses) => {
  return revenue - expenses;
};

const calculateTotalOrders = (orders) => {
  return orders.length;
};

/**
 * ==============================================
 * DATASET GENERATION
 * ==============================================
 */

const generateRevenueDataset = (payments) => {
  return payments.map((payment) => ({
    id: payment.id,

    label: payment.payment_date ?? payment.created_at,

    value: Number(payment.amount || 0),
  }));
};

const generateExpenseDataset = (expenses) => {
  return expenses.map((expense) => ({
    id: expense.id,

    label: expense.created_at ?? expense.payment_date,

    value: Number(expense.total_cost ?? expense.amount ?? 0),
  }));
};

/**
 * ==============================================
 * DASHBOARD ANALYTICS
 * ==============================================
 */

export const getDashboardAnalytics = async ({
  startDate = "",
  endDate = "",
  branchId = "",
} = {}) => {
  let orders = await getOrders();

  let payments = await getPayments();

  /**
   * Expenses are currently unavailable.
   * Future expense module can be connected here.
   */
  let expenses = [];

  /**
   * Date filtering
   */

  orders = filterByDateRange(orders, startDate, endDate, "created_at");

  payments = filterByDateRange(payments, startDate, endDate, "payment_date");

  /**
   * Branch filtering
   */

  orders = filterByBranch(orders, branchId);

  payments = filterByBranch(payments, branchId);

  /**
   * Calculate dashboard values
   */

  const totalRevenue = calculateRevenue(payments);

  const totalExpenses = calculateExpenses(expenses);

  const netProfit = calculateNetProfit(totalRevenue, totalExpenses);

  const totalOrders = calculateTotalOrders(orders);

  return {
    totalRevenue,

    totalExpenses,

    netProfit,

    totalOrders,

    revenueDataset: generateRevenueDataset(payments),

    expenseDataset: generateExpenseDataset(expenses),
  };
};

export default {
  getDashboardAnalytics,
};
