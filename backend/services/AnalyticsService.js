// backend/services/AnalyticsService.js

import {
  getTransactions,
  getPayments,
  getExpenses,
} from "../models/AnalyticsModel.js";

/**
 * ==============================================
 * ANALYTICS SERVICE
 * Handles all dashboard business logic.
 * ==============================================
 */

/**
 * Filter records by date range.
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
 * Filter records by branch.
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

/**
 * Calculate Total Revenue.
 */
const calculateRevenue = (payments) => {
  return payments.reduce(
    (total, payment) => total + Number(payment.amount || 0),
    0,
  );
};

/**
 * Calculate Total Expenses.
 *
 * Supports:
 * - total_cost (future Expense module)
 * - amount (temporary Payments source)
 */
const calculateExpenses = (expenses) => {
  return expenses.reduce(
    (total, expense) =>
      total + Number(expense.total_cost ?? expense.amount ?? 0),
    0,
  );
};

/**
 * Calculate Net Profit.
 */
const calculateNetProfit = (revenue, expenses) => {
  return revenue - expenses;
};

/**
 * Calculate Total Orders.
 */
const calculateTotalOrders = (transactions) => {
  return transactions.length;
};

/**
 * ==============================================
 * DATASET GENERATION
 * ==============================================
 */

/**
 * Revenue Dataset.
 */
const generateRevenueDataset = (payments) => {
  return payments.map((payment) => ({
    id: payment.id,
    label: payment.payment_date ?? payment.created_at,
    value: Number(payment.amount || 0),
  }));
};

/**
 * Expense Dataset.
 *
 * Supports:
 * - total_cost (future Expense module)
 * - amount (temporary Payments source)
 */
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
  let transactions = await getTransactions();

  let payments = await getPayments();

  let expenses = await getExpenses();

  /**
   * Apply date filters.
   */

  transactions = filterByDateRange(
    transactions,
    startDate,
    endDate,
    "created_at",
  );

  payments = filterByDateRange(payments, startDate, endDate, "payment_date");

  expenses = filterByDateRange(
    expenses,
    startDate,
    endDate,
    expenses.length > 0 && "payment_date" in expenses[0]
      ? "payment_date"
      : "created_at",
  );

  /**
   * Apply branch filters.
   */

  transactions = filterByBranch(transactions, branchId);

  payments = filterByBranch(payments, branchId);

  expenses = filterByBranch(expenses, branchId);

  /**
   * Calculate KPIs.
   */

  const totalRevenue = calculateRevenue(payments);

  const totalExpenses = calculateExpenses(expenses);

  const netProfit = calculateNetProfit(totalRevenue, totalExpenses);

  const totalOrders = calculateTotalOrders(transactions);

  /**
   * Return analytics.
   */

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
