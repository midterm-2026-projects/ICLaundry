import { describe, it, expect, vi, beforeEach } from "vitest";

/**
 * ==============================================
 * MOCK MODELS
 * ==============================================
 */

vi.mock("../../models/OrderModel.js", () => ({
  getOrders: vi.fn(),
}));

vi.mock("../../models/PaymentModel.js", () => ({
  getPayments: vi.fn(),
}));

vi.mock("../../models/InventoryModel.js", () => ({
  getInventoryRestocks: vi.fn(),
}));

import { getOrders } from "../../models/OrderModel.js";

import { getPayments } from "../../models/PaymentModel.js";

import { getInventoryRestocks } from "../../models/InventoryModel.js";

import { getDashboardAnalytics } from "../../services/AnalyticsService.js";

describe("Analytics Service Unit Test", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    getInventoryRestocks.mockResolvedValue([]);
  });

  /**
   * ==============================================
   * DASHBOARD GENERATION
   * ==============================================
   */

  describe("Generate Dashboard Analytics", () => {
    it("should calculate dashboard KPI values", async () => {
      /**
       * Real user scenario:
       *
       * Admin opens analytics dashboard.
       *
       * System calculates:
       * - revenue
       * - profit
       * - orders
       */

      getOrders.mockResolvedValue([
        {
          id: "order-1",
          branch_id: "branch-1",
          created_at: "2026-07-15",
        },

        {
          id: "order-2",
          branch_id: "branch-1",
          created_at: "2026-07-15",
        },
      ]);

      getPayments.mockResolvedValue([
        {
          id: "payment-1",
          amount: 1000,
          branch_id: "branch-1",
          payment_date: "2026-07-15",
        },

        {
          id: "payment-2",
          amount: 500,
          branch_id: "branch-1",
          payment_date: "2026-07-15",
        },
      ]);

      const result = await getDashboardAnalytics();

      expect(result.totalRevenue).toBe(1500);

      expect(result.totalExpenses).toBe(0);

      expect(result.netProfit).toBe(1500);

      expect(result.totalOrders).toBe(2);

      // Payments in the same month are grouped into one chart point.
      expect(result.revenueDataset).toHaveLength(1);

      expect(result.expenseDataset).toHaveLength(0);
    });
  });

  /**
   * ==============================================
   * BRANCH FILTERING
   * ==============================================
   */

  describe("Branch Analytics Filtering", () => {
    it("should return analytics for selected branch", async () => {
      /**
       * Real user scenario:
       *
       * Owner selects
       * Balayan branch.
       */

      getOrders.mockResolvedValue([
        {
          id: "1",
          branch_id: "balayan",
        },

        {
          id: "2",
          branch_id: "main",
        },
      ]);

      getPayments.mockResolvedValue([
        {
          id: "1",
          branch_id: "balayan",
          amount: 3000,
        },

        {
          id: "2",
          branch_id: "main",
          amount: 2000,
        },
      ]);

      const result = await getDashboardAnalytics({
        branchId: "balayan",
      });

      expect(result.totalOrders).toBe(1);

      expect(result.totalRevenue).toBe(3000);
    });
  });

  /**
   * ==============================================
   * DATE FILTERING
   * ==============================================
   */

  describe("Date Range Analytics", () => {
    it("should filter analytics using selected dates", async () => {
      getOrders.mockResolvedValue([
        {
          id: "1",
          created_at: "2026-07-01",
        },

        {
          id: "2",
          created_at: "2026-08-01",
        },
      ]);

      getPayments.mockResolvedValue([
        {
          id: "1",
          amount: 1000,
          payment_date: "2026-07-01",
        },

        {
          id: "2",
          amount: 2000,
          payment_date: "2026-08-01",
        },
      ]);

      const result = await getDashboardAnalytics({
        startDate: "2026-07-01",

        endDate: "2026-07-31",
      });

      expect(result.totalOrders).toBe(1);

      expect(result.totalRevenue).toBe(1000);
    });
  });

  /**
   * ==============================================
   * EMPTY DATA HANDLING
   * ==============================================
   */

  describe("Empty Analytics Data", () => {
    it("should return zero values when no business records exist", async () => {
      /**
       * Real user scenario:
       *
       * New branch has no customers yet.
       */

      getOrders.mockResolvedValue([]);

      getPayments.mockResolvedValue([]);

      const result = await getDashboardAnalytics();

      expect(result.totalRevenue).toBe(0);

      expect(result.totalExpenses).toBe(0);

      expect(result.netProfit).toBe(0);

      expect(result.totalOrders).toBe(0);

      expect(result.revenueDataset).toHaveLength(0);
    });
  });

  describe("Period Aggregation", () => {
    beforeEach(() => {
      getOrders.mockResolvedValue([]);
      getPayments.mockResolvedValue([
        { id: "p1", amount: 100, payment_date: "2025-12-31T10:00:00Z" },
        { id: "p2", amount: 200, payment_date: "2026-01-05T10:00:00Z" },
        { id: "p3", amount: 300, payment_date: "2026-02-10T10:00:00Z" },
      ]);
    });

    it("groups weekly analytics by individual day", async () => {
      const result = await getDashboardAnalytics({ period: "weekly" });
      expect(result.revenueDataset).toHaveLength(3);
      expect(result.revenueDataset[1].label).toMatch(/Mon|Jan/);
    });

    it("groups monthly analytics by calendar month", async () => {
      const result = await getDashboardAnalytics({ period: "monthly" });
      expect(result.revenueDataset.map((item) => item.id)).toEqual([
        "2025-12",
        "2026-01",
        "2026-02",
      ]);
    });

    it("groups yearly analytics by calendar year", async () => {
      const result = await getDashboardAnalytics({ period: "yearly" });
      expect(result.revenueDataset).toHaveLength(2);
      expect(result.revenueDataset[1]).toMatchObject({ label: "2026", value: 500 });
    });

    it("rejects unsupported periods", async () => {
      await expect(getDashboardAnalytics({ period: "daily" })).rejects.toThrow(
        "Period must be weekly, monthly, or yearly",
      );
    });
  });

  /**
   * ==============================================
   * ERROR HANDLING
   * ==============================================
   */

  describe("Analytics Error Handling", () => {
    it("should throw error when orders cannot be retrieved", async () => {
      getOrders.mockRejectedValue(new Error("Order database error"));

      await expect(getDashboardAnalytics()).rejects.toThrow(
        "Order database error",
      );
    });

    it("should throw error when payments cannot be retrieved", async () => {
      getOrders.mockResolvedValue([]);

      getPayments.mockRejectedValue(new Error("Payment database error"));

      await expect(getDashboardAnalytics()).rejects.toThrow(
        "Payment database error",
      );
    });
  });
});
