import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../models/AnalyticsModel.js", () => ({
  getTransactions: vi.fn(),
  getPayments: vi.fn(),
  getExpenses: vi.fn(),
}));

import {
  getTransactions,
  getPayments,
  getExpenses,
} from "../../models/AnalyticsModel.js";

import { getDashboardAnalytics } from "../../services/AnalyticsService.js";

describe("Analytics Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  /**
   * ==============================================
   * DASHBOARD ANALYTICS GENERATION
   * ==============================================
   */

  describe("Generate Dashboard Analytics", () => {
    it("should generate analytics for admin dashboard", async () => {
      /**
       * Real user scenario:
       *
       * Admin opens dashboard.
       * System calculates revenue,
       * expenses, profit,
       * and order statistics.
       */

      getTransactions.mockResolvedValue([
        {
          id: "1",
          branch_id: "1",
          created_at: "2026-07-14",
        },
        {
          id: "2",
          branch_id: "1",
          created_at: "2026-07-14",
        },
      ]);

      getPayments.mockResolvedValue([
        {
          id: "1",
          amount: 1000,
          branch_id: "1",
          payment_date: "2026-07-14",
        },
        {
          id: "2",
          amount: 500,
          branch_id: "1",
          payment_date: "2026-07-14",
        },
      ]);

      getExpenses.mockResolvedValue([
        {
          id: "1",
          total_cost: 400,
          branch_id: "1",
          created_at: "2026-07-14",
        },
      ]);

      const analytics = await getDashboardAnalytics();

      expect(analytics.totalRevenue).toBe(1500);

      expect(analytics.totalExpenses).toBe(400);

      expect(analytics.netProfit).toBe(1100);

      expect(analytics.totalOrders).toBe(2);

      expect(analytics.revenueDataset).toHaveLength(2);

      expect(analytics.expenseDataset).toHaveLength(1);
    });
  });

  /**
   * ==============================================
   * MULTI BRANCH ANALYTICS
   * ==============================================
   */

  describe("Multi Branch Analytics", () => {
    it("should calculate analytics across multiple branches", async () => {
      /**
       * Real user scenario:
       *
       * Owner views overall business performance
       * from different laundry branches.
       */

      getTransactions.mockResolvedValue([
        {
          id: "1",
          branch_id: "main",
        },
        {
          id: "2",
          branch_id: "balayan",
        },
        {
          id: "3",
          branch_id: "nasugbu",
        },
      ]);

      getPayments.mockResolvedValue([
        {
          amount: 2000,
          branch_id: "main",
        },
        {
          amount: 3000,
          branch_id: "balayan",
        },
      ]);

      getExpenses.mockResolvedValue([
        {
          total_cost: 1000,
          branch_id: "main",
        },
      ]);

      const analytics = await getDashboardAnalytics();

      expect(analytics.totalRevenue).toBe(5000);

      expect(analytics.totalExpenses).toBe(1000);

      expect(analytics.netProfit).toBe(4000);

      expect(analytics.totalOrders).toBe(3);
    });
  });

  /**
   * ==============================================
   * EMPTY DATA HANDLING
   * ==============================================
   */

  describe("Empty Analytics Data", () => {
    it("should return zero values when business has no records", async () => {
      /**
       * Real user scenario:
       *
       * New laundry branch has no transactions yet.
       */

      getTransactions.mockResolvedValue([]);

      getPayments.mockResolvedValue([]);

      getExpenses.mockResolvedValue([]);

      const analytics = await getDashboardAnalytics();

      expect(analytics.totalRevenue).toBe(0);

      expect(analytics.totalExpenses).toBe(0);

      expect(analytics.netProfit).toBe(0);

      expect(analytics.totalOrders).toBe(0);

      expect(analytics.revenueDataset).toHaveLength(0);

      expect(analytics.expenseDataset).toHaveLength(0);
    });
  });

  /**
   * ==============================================
   * ERROR HANDLING
   * ==============================================
   */

  describe("Analytics Service Error Handling", () => {
    it("should throw error when transaction retrieval fails", async () => {
      /**
       * Real user scenario:
       *
       * Database transaction table is unavailable.
       */

      getTransactions.mockRejectedValue(
        new Error("Transaction database error"),
      );

      await expect(getDashboardAnalytics()).rejects.toThrow(
        "Transaction database error",
      );
    });

    it("should throw error when payment retrieval fails", async () => {
      /**
       * Real user scenario:
       *
       * Payment records cannot be loaded
       * while generating dashboard analytics.
       */

      getTransactions.mockResolvedValue([]);

      getPayments.mockRejectedValue(new Error("Payment database error"));

      await expect(getDashboardAnalytics()).rejects.toThrow(
        "Payment database error",
      );
    });

    it("should throw error when expense retrieval fails", async () => {
      /**
       * Real user scenario:
       *
       * Expense records cannot be loaded
       * while calculating business profit.
       */

      getTransactions.mockResolvedValue([]);

      getPayments.mockResolvedValue([]);

      getExpenses.mockRejectedValue(new Error("Expense database error"));

      await expect(getDashboardAnalytics()).rejects.toThrow(
        "Expense database error",
      );
    });
  });
});
