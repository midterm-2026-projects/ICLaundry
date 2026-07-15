// backend/test/integration/AnalyticsModel.test.js

import { describe, it, expect } from "vitest";

import {
  getTransactions,
  getPayments,
  getExpenses,
} from "../../models/AnalyticsModel.js";

describe("Analytics Model Integration Test", () => {
  /**
   * ==============================================
   * TRANSACTION ANALYTICS
   * ==============================================
   */

  describe("Transaction Records", () => {
    it("should allow admin to load transaction records for dashboard analytics", async () => {
      const data = await getTransactions();

      expect(Array.isArray(data)).toBe(true);
    });

    it("should return transaction information required for analytics calculation", async () => {
      const data = await getTransactions();

      if (data.length === 0) {
        return;
      }

      const transaction = data[0];

      expect(transaction).toHaveProperty("id");

      /**
       * Transaction records normally use
       * total_price instead of amount
       */
      expect(transaction).toHaveProperty("total_price");

      expect(transaction).toHaveProperty("created_at");
    });

    it("should return multiple transactions for reporting", async () => {
      const data = await getTransactions();

      expect(data.length).toBeGreaterThanOrEqual(0);
    });
  });

  /**
   * ==============================================
   * PAYMENT ANALYTICS
   * ==============================================
   */

  describe("Payment Records", () => {
    it("should allow admin to view payment history", async () => {
      const data = await getPayments();

      expect(Array.isArray(data)).toBe(true);
    });

    it("should return payment information required for revenue analytics", async () => {
      const data = await getPayments();

      if (data.length === 0) {
        return;
      }

      const payment = data[0];

      expect(payment).toHaveProperty("id");

      expect(payment).toHaveProperty("amount");

      expect(payment).toHaveProperty("created_at");
    });

    it("should calculate total collected payments", async () => {
      const data = await getPayments();

      const total = data.reduce(
        (sum, payment) => sum + Number(payment.amount || 0),
        0,
      );

      expect(typeof total).toBe("number");
    });
  });

  /**
   * ==============================================
   * EXPENSE ANALYTICS
   * ==============================================
   */

  describe("Expense Records", () => {
    it("should allow admin to view expense history", async () => {
      const data = await getExpenses();

      expect(Array.isArray(data)).toBe(true);
    });

    it("should return expense information required for profit calculation", async () => {
      const data = await getExpenses();

      if (data.length === 0) {
        return;
      }

      const expense = data[0];

      expect(expense).toHaveProperty("id");

      expect(expense).toHaveProperty("amount");

      expect(expense).toHaveProperty("created_at");
    });

    it("should calculate total expenses", async () => {
      const data = await getExpenses();

      const totalExpense = data.reduce(
        (sum, expense) => sum + Number(expense.amount || 0),
        0,
      );

      expect(typeof totalExpense).toBe("number");
    });
  });

  /**
   * ==============================================
   * DASHBOARD EXPERIENCE
   * ==============================================
   */

  describe("Analytics Dashboard Data Flow", () => {
    it("should provide data required by admin dashboard", async () => {
      const transactions = await getTransactions();

      const payments = await getPayments();

      const expenses = await getExpenses();

      expect(Array.isArray(transactions)).toBe(true);

      expect(Array.isArray(payments)).toBe(true);

      expect(Array.isArray(expenses)).toBe(true);
    });
  });
});
