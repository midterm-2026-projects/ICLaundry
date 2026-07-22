import { getOrders } from "../models/OrderModel.js";
import { getPayments } from "../models/PaymentModel.js";
import { getInventoryRestocks } from "../models/InventoryModel.js";

const toNumber = (value) => Number.isFinite(Number(value)) ? Number(value) : 0;

const dateWithinRange = (value, startDate, endDate) => {
  if (!startDate && !endDate) return true;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return false;
  if (startDate && date < new Date(`${startDate}T00:00:00`)) return false;
  if (endDate && date > new Date(`${endDate}T23:59:59.999`)) return false;
  return true;
};

const periodKey = (value, period) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  if (period === "yearly") return String(date.getFullYear());
  if (period === "weekly") return date.toISOString().slice(0, 10);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
};

const periodLabel = (key, period) => {
  if (period === "yearly") return key;
  if (period === "weekly") return new Date(`${key}T00:00:00`).toLocaleDateString("en-PH", { weekday: "short", month: "short", day: "numeric" });
  const [year, month] = key.split("-");
  return new Date(Number(year), Number(month) - 1).toLocaleDateString("en-PH", { month: "short", year: "numeric" });
};

const aggregateDataset = (records, { dateField, value, period }) => {
  const totals = new Map();
  records.forEach((record) => {
    const key = periodKey(record[dateField], period);
    if (key) totals.set(key, (totals.get(key) || 0) + value(record));
  });
  return [...totals.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([key, amount]) => ({ id: key, label: periodLabel(key, period), value: Number(amount.toFixed(2)) }));
};

export const getDashboardAnalytics = async ({ startDate = "", endDate = "", branchId = "", period = "monthly" } = {}) => {
  if (startDate && endDate && new Date(startDate) > new Date(endDate)) throw new Error("Start date cannot be after end date");
  if (!["weekly", "monthly", "yearly"].includes(period)) throw new Error("Period must be weekly, monthly, or yearly");

  const [allOrders, allPayments, allRestocks] = await Promise.all([getOrders(), getPayments(), getInventoryRestocks()]);
  const orders = (allOrders || []).filter((order) => (!branchId || String(order.branch_id) === String(branchId)) && dateWithinRange(order.created_at, startDate, endDate));
  const eligibleOrderIds = new Set(orders.map((order) => String(order.id)));
  const payments = (allPayments || []).filter((payment) => (!branchId || eligibleOrderIds.has(String(payment.order_id)) || String(payment.branch_id) === String(branchId)) && dateWithinRange(payment.payment_date ?? payment.created_at, startDate, endDate));
  const expenses = (allRestocks || []).filter((restock) => dateWithinRange(restock.restocked_at ?? restock.created_at, startDate, endDate)).map((restock) => ({ ...restock, expense: toNumber(restock.quantity_added) * toNumber(restock.inventory_items?.cost_per_unit) }));

  const totalRevenue = payments.reduce((sum, payment) => sum + toNumber(payment.amount), 0);
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.expense, 0);

  return {
    totalRevenue: Number(totalRevenue.toFixed(2)), totalExpenses: Number(totalExpenses.toFixed(2)),
    netProfit: Number((totalRevenue - totalExpenses).toFixed(2)), totalOrders: orders.length, period,
    revenueDataset: aggregateDataset(payments, { dateField: "payment_date", value: (item) => toNumber(item.amount), period }),
    expenseDataset: aggregateDataset(expenses, { dateField: "restocked_at", value: (item) => item.expense, period }),
  };
};

export default { getDashboardAnalytics };
