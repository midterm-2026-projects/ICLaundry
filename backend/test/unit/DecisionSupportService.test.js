import { beforeEach, describe, expect, it, vi } from "vitest";

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
  getInventoryItems: vi.fn(),

  getInventoryUsageLogs: vi.fn(),

  getInventoryRestocks: vi.fn(),
}));

import { getOrders } from "../../models/OrderModel.js";

import { getPayments } from "../../models/PaymentModel.js";

import {
  getInventoryItems,
  getInventoryUsageLogs,
  getInventoryRestocks,
} from "../../models/InventoryModel.js";

import { getDecisionSupport } from "../../services/DecisionSupportService.js";

describe("Decision Support Service Unit Test", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  /**
   * ==============================================
   * REVENUE FORECAST
   * ==============================================
   */

  describe("Revenue Forecast Generation", () => {
    it("should generate revenue forecast from historical payment records", async () => {
      /**
       * Real user scenario:
       *
       * Business owner opens
       * Revenue Forecast dashboard.
       *
       * System analyzes
       * payment history
       * and predicts
       * next month's revenue.
       */

      getOrders.mockResolvedValue([]);

      getInventoryItems.mockResolvedValue([]);

      getInventoryUsageLogs.mockResolvedValue([]);

      getInventoryRestocks.mockResolvedValue([]);

      getPayments.mockResolvedValue([
        {
          id: "1",

          amount: 1000,

          payment_date: "2026-05-01",
        },

        {
          id: "2",

          amount: 1200,

          payment_date: "2026-06-01",
        },

        {
          id: "3",

          amount: 1500,

          payment_date: "2026-07-01",
        },
      ]);

      // Act

      const result = await getDecisionSupport();

      // Assert

      expect(result.revenueForecast).toBeDefined();

      expect(Array.isArray(result.revenueForecast)).toBe(true);

      expect(result.revenueForecast.length).toBeGreaterThan(0);

      expect(result.revenueForecast.at(-1).type).toBe("Forecast");
    });

    it("should calculate a forecast value greater than zero when historical payments exist", async () => {
      getOrders.mockResolvedValue([]);

      getInventoryItems.mockResolvedValue([]);

      getInventoryUsageLogs.mockResolvedValue([]);

      getInventoryRestocks.mockResolvedValue([]);

      getPayments.mockResolvedValue([
        {
          amount: 1000,

          payment_date: "2026-05-01",
        },

        {
          amount: 2000,

          payment_date: "2026-06-01",
        },

        {
          amount: 3000,

          payment_date: "2026-07-01",
        },
      ]);

      const result = await getDecisionSupport();

      const forecast = result.revenueForecast.find(
        (item) => item.type === "Forecast",
      );

      expect(forecast.forecast).toBeGreaterThan(0);
    });

    it("should generate historical revenue records before the forecast record", async () => {
      getOrders.mockResolvedValue([]);

      getInventoryItems.mockResolvedValue([]);

      getInventoryUsageLogs.mockResolvedValue([]);

      getInventoryRestocks.mockResolvedValue([]);

      getPayments.mockResolvedValue([
        {
          amount: 1000,

          payment_date: "2026-06-01",
        },

        {
          amount: 1500,

          payment_date: "2026-07-01",
        },
      ]);

      const result = await getDecisionSupport();

      const historical = result.revenueForecast.filter(
        (item) => item.type === "Historical",
      );

      expect(historical.length).toBe(2);
    });

    it("should return an empty revenue forecast when there are no payment records", async () => {
      getOrders.mockResolvedValue([]);

      getPayments.mockResolvedValue([]);

      getInventoryItems.mockResolvedValue([]);

      getInventoryUsageLogs.mockResolvedValue([]);

      getInventoryRestocks.mockResolvedValue([]);

      const result = await getDecisionSupport();

      expect(result.revenueForecast).toEqual([]);
    });
  });

  /**
   * ==============================================
   * INVENTORY FORECAST
   * ==============================================
   */

  describe("Inventory Forecast Generation", () => {
    it("should generate inventory forecast from inventory usage history", async () => {
      /**
       * Real user scenario:
       *
       * Inventory manager opens
       * Inventory Forecast.
       *
       * System analyzes
       * inventory usage and
       * predicts remaining stock.
       */

      getOrders.mockResolvedValue([]);

      getPayments.mockResolvedValue([]);

      getInventoryItems.mockResolvedValue([
        {
          id: "1",
          name: "Detergent",
          current_stock: 50,
          minimum_stock: 10,
        },
      ]);

      getInventoryUsageLogs.mockResolvedValue([
        {
          item_id: "1",
          quantity_used: 5,
        },
        {
          item_id: "1",
          quantity_used: 3,
        },
      ]);

      getInventoryRestocks.mockResolvedValue([
        {
          item_id: "1",
          quantity_added: 10,
        },
      ]);

      // Act

      const result = await getDecisionSupport();

      // Assert

      expect(result.inventoryForecast).toBeDefined();

      expect(Array.isArray(result.inventoryForecast)).toBe(true);

      expect(result.inventoryForecast).toHaveLength(1);

      expect(result.inventoryForecast[0]).toHaveProperty("predictedStock");
    });

    it("should calculate predicted inventory stock", async () => {
      getOrders.mockResolvedValue([]);

      getPayments.mockResolvedValue([]);

      getInventoryItems.mockResolvedValue([
        {
          id: "1",
          name: "Detergent",
          current_stock: 40,
          minimum_stock: 10,
        },
      ]);

      getInventoryUsageLogs.mockResolvedValue([
        {
          item_id: "1",
          quantity_used: 5,
        },
      ]);

      getInventoryRestocks.mockResolvedValue([
        {
          item_id: "1",
          quantity_added: 15,
        },
      ]);

      const result = await getDecisionSupport();

      expect(result.inventoryForecast[0].predictedStock).toBeGreaterThan(0);
    });

    it("should generate inventory forecast for multiple inventory items", async () => {
      getOrders.mockResolvedValue([]);

      getPayments.mockResolvedValue([]);

      getInventoryItems.mockResolvedValue([
        {
          id: "1",
          name: "Detergent",
          current_stock: 50,
          minimum_stock: 10,
        },
        {
          id: "2",
          name: "Fabric Conditioner",
          current_stock: 30,
          minimum_stock: 5,
        },
      ]);

      getInventoryUsageLogs.mockResolvedValue([]);

      getInventoryRestocks.mockResolvedValue([]);

      const result = await getDecisionSupport();

      expect(result.inventoryForecast).toHaveLength(2);
    });

    it("should return an empty inventory forecast when there are no inventory items", async () => {
      getOrders.mockResolvedValue([]);

      getPayments.mockResolvedValue([]);

      getInventoryItems.mockResolvedValue([]);

      getInventoryUsageLogs.mockResolvedValue([]);

      getInventoryRestocks.mockResolvedValue([]);

      const result = await getDecisionSupport();

      expect(result.inventoryForecast).toEqual([]);
    });
  });

  /**
   * ==============================================
   * REVENUE TREND ANALYSIS
   * ==============================================
   */

  describe("Revenue Trend Analysis", () => {
    it("should analyze revenue growth trend", async () => {
      getOrders.mockResolvedValue([]);

      getInventoryItems.mockResolvedValue([]);

      getInventoryUsageLogs.mockResolvedValue([]);

      getInventoryRestocks.mockResolvedValue([]);

      getPayments.mockResolvedValue([
        {
          amount: 1000,
          payment_date: "2026-05-01",
        },
        {
          amount: 1500,
          payment_date: "2026-06-01",
        },
        {
          amount: 2000,
          payment_date: "2026-07-01",
        },
      ]);

      const result = await getDecisionSupport();

      expect(result.revenueTrend).toBeDefined();

      expect(result.revenueTrend).toHaveProperty("trend");

      expect(result.revenueTrend).toHaveProperty("growthRate");

      expect(result.revenueTrend).toHaveProperty("score");
    });

    it("should classify revenue trend correctly", async () => {
      getOrders.mockResolvedValue([]);

      getInventoryItems.mockResolvedValue([]);

      getInventoryUsageLogs.mockResolvedValue([]);

      getInventoryRestocks.mockResolvedValue([]);

      getPayments.mockResolvedValue([
        {
          amount: 500,
          payment_date: "2026-05-01",
        },
        {
          amount: 1000,
          payment_date: "2026-06-01",
        },
        {
          amount: 2000,
          payment_date: "2026-07-01",
        },
      ]);

      const result = await getDecisionSupport();

      expect([
        "Excellent Growth",
        "Growing",
        "Slight Growth",
        "Stable",
        "Slight Decline",
        "Declining",
      ]).toContain(result.revenueTrend.trend);
    });
  });

  /**
   * ==============================================
   * INVENTORY FORECAST
   * ==============================================
   */

  describe("Inventory Forecast Generation", () => {
    it("should generate inventory forecast from inventory usage history", async () => {
      /**
       * Real user scenario:
       *
       * Inventory manager opens
       * Inventory Forecast.
       *
       * System analyzes
       * inventory usage and
       * predicts remaining stock.
       */

      getOrders.mockResolvedValue([]);

      getPayments.mockResolvedValue([]);

      getInventoryItems.mockResolvedValue([
        {
          id: "1",
          name: "Detergent",
          current_stock: 50,
          minimum_stock: 10,
        },
      ]);

      getInventoryUsageLogs.mockResolvedValue([
        {
          item_id: "1",
          quantity_used: 5,
        },
        {
          item_id: "1",
          quantity_used: 3,
        },
      ]);

      getInventoryRestocks.mockResolvedValue([
        {
          item_id: "1",
          quantity_added: 10,
        },
      ]);

      // Act

      const result = await getDecisionSupport();

      // Assert

      expect(result.inventoryForecast).toBeDefined();

      expect(Array.isArray(result.inventoryForecast)).toBe(true);

      expect(result.inventoryForecast).toHaveLength(1);

      expect(result.inventoryForecast[0]).toHaveProperty("predictedStock");
    });

    it("should calculate predicted inventory stock", async () => {
      getOrders.mockResolvedValue([]);

      getPayments.mockResolvedValue([]);

      getInventoryItems.mockResolvedValue([
        {
          id: "1",
          name: "Detergent",
          current_stock: 40,
          minimum_stock: 10,
        },
      ]);

      getInventoryUsageLogs.mockResolvedValue([
        {
          item_id: "1",
          quantity_used: 5,
        },
      ]);

      getInventoryRestocks.mockResolvedValue([
        {
          item_id: "1",
          quantity_added: 15,
        },
      ]);

      const result = await getDecisionSupport();

      expect(result.inventoryForecast[0].predictedStock).toBeGreaterThan(0);
    });

    it("should generate inventory forecast for multiple inventory items", async () => {
      getOrders.mockResolvedValue([]);

      getPayments.mockResolvedValue([]);

      getInventoryItems.mockResolvedValue([
        {
          id: "1",
          name: "Detergent",
          current_stock: 50,
          minimum_stock: 10,
        },
        {
          id: "2",
          name: "Fabric Conditioner",
          current_stock: 30,
          minimum_stock: 5,
        },
      ]);

      getInventoryUsageLogs.mockResolvedValue([]);

      getInventoryRestocks.mockResolvedValue([]);

      const result = await getDecisionSupport();

      expect(result.inventoryForecast).toHaveLength(2);
    });

    it("should return an empty inventory forecast when there are no inventory items", async () => {
      getOrders.mockResolvedValue([]);

      getPayments.mockResolvedValue([]);

      getInventoryItems.mockResolvedValue([]);

      getInventoryUsageLogs.mockResolvedValue([]);

      getInventoryRestocks.mockResolvedValue([]);

      const result = await getDecisionSupport();

      expect(result.inventoryForecast).toEqual([]);
    });
  });

  /**
   * ==============================================
   * REVENUE TREND ANALYSIS
   * ==============================================
   */

  describe("Revenue Trend Analysis", () => {
    it("should analyze revenue growth trend", async () => {
      getOrders.mockResolvedValue([]);

      getInventoryItems.mockResolvedValue([]);

      getInventoryUsageLogs.mockResolvedValue([]);

      getInventoryRestocks.mockResolvedValue([]);

      getPayments.mockResolvedValue([
        {
          amount: 1000,
          payment_date: "2026-05-01",
        },
        {
          amount: 1500,
          payment_date: "2026-06-01",
        },
        {
          amount: 2000,
          payment_date: "2026-07-01",
        },
      ]);

      const result = await getDecisionSupport();

      expect(result.revenueTrend).toBeDefined();

      expect(result.revenueTrend).toHaveProperty("trend");

      expect(result.revenueTrend).toHaveProperty("growthRate");

      expect(result.revenueTrend).toHaveProperty("score");
    });

    it("should classify revenue trend correctly", async () => {
      getOrders.mockResolvedValue([]);

      getInventoryItems.mockResolvedValue([]);

      getInventoryUsageLogs.mockResolvedValue([]);

      getInventoryRestocks.mockResolvedValue([]);

      getPayments.mockResolvedValue([
        {
          amount: 500,
          payment_date: "2026-05-01",
        },
        {
          amount: 1000,
          payment_date: "2026-06-01",
        },
        {
          amount: 2000,
          payment_date: "2026-07-01",
        },
      ]);

      const result = await getDecisionSupport();

      expect([
        "Excellent Growth",
        "Growing",
        "Slight Growth",
        "Stable",
        "Slight Decline",
        "Declining",
      ]).toContain(result.revenueTrend.trend);
    });
  });

  /**
   * ==============================================
   * DASHBOARD SUMMARY
   * ==============================================
   */

  describe("Dashboard Summary", () => {
    it("should generate dashboard summary information", async () => {
      /**
       * Real user scenario:
       *
       * Owner opens the DSS dashboard.
       *
       * Dashboard displays
       * summary statistics.
       */

      // Arrange

      getOrders.mockResolvedValue([
        {
          id: "1",
        },
        {
          id: "2",
        },
      ]);

      getPayments.mockResolvedValue([
        {
          amount: 1000,
          payment_date: "2026-07-01",
        },
      ]);

      getInventoryItems.mockResolvedValue([
        {
          id: "1",
          name: "Detergent",
          current_stock: 20,
          minimum_stock: 10,
        },
      ]);

      getInventoryUsageLogs.mockResolvedValue([]);

      getInventoryRestocks.mockResolvedValue([]);

      // Act

      const result = await getDecisionSupport();

      // Assert

      expect(result.summary).toBeDefined();

      expect(result.summary).toHaveProperty("generatedAt");

      expect(result.summary).toHaveProperty("revenueTrend");

      expect(result.summary).toHaveProperty("growthRate");

      expect(result.summary).toHaveProperty("recommendationCount");

      expect(result.summary).toHaveProperty("alertCount");

      expect(result.summary).toHaveProperty("hasCriticalAlerts");
    });

    it("should generate dashboard statistics", async () => {
      getOrders.mockResolvedValue([{ id: "1" }, { id: "2" }, { id: "3" }]);

      getPayments.mockResolvedValue([
        {
          amount: 1000,
          payment_date: "2026-07-01",
        },
      ]);

      getInventoryItems.mockResolvedValue([
        {
          id: "1",
          name: "Detergent",
          current_stock: 20,
          minimum_stock: 10,
        },
      ]);

      getInventoryUsageLogs.mockResolvedValue([]);

      getInventoryRestocks.mockResolvedValue([]);

      const result = await getDecisionSupport();

      expect(result.statistics).toEqual({
        totalOrders: 3,
        totalPayments: 1,
        totalInventoryItems: 1,
      });
    });
  });

  /**
   * ==============================================
   * EMPTY DATA HANDLING
   * ==============================================
   */

  describe("Empty Decision Support Data", () => {
    it("should return empty datasets when no business records exist", async () => {
      /**
       * Real user scenario:
       *
       * New branch has no
       * transactions yet.
       */

      // Arrange

      getOrders.mockResolvedValue([]);

      getPayments.mockResolvedValue([]);

      getInventoryItems.mockResolvedValue([]);

      getInventoryUsageLogs.mockResolvedValue([]);

      getInventoryRestocks.mockResolvedValue([]);

      // Act

      const result = await getDecisionSupport();

      // Assert

      expect(result.revenueForecast).toEqual([]);

      expect(result.inventoryForecast).toEqual([]);

      expect(result.inventoryTrend).toEqual([]);

      expect(result.recommendations).toBeDefined();

      expect(result.alerts).toBeDefined();

      expect(result.statistics).toEqual({
        totalOrders: 0,
        totalPayments: 0,
        totalInventoryItems: 0,
      });
    });
  });

  /**
   * ==============================================
   * ERROR HANDLING
   * ==============================================
   */

  describe("Decision Support Error Handling", () => {
    it("should throw an error when orders cannot be retrieved", async () => {
      getOrders.mockRejectedValue(new Error("Order database error"));

      await expect(getDecisionSupport()).rejects.toThrow(
        "Order database error",
      );
    });

    it("should throw an error when payments cannot be retrieved", async () => {
      getOrders.mockResolvedValue([]);

      getPayments.mockRejectedValue(new Error("Payment database error"));

      await expect(getDecisionSupport()).rejects.toThrow(
        "Payment database error",
      );
    });

    it("should throw an error when inventory items cannot be retrieved", async () => {
      getOrders.mockResolvedValue([]);

      getPayments.mockResolvedValue([]);

      getInventoryItems.mockRejectedValue(
        new Error("Inventory database error"),
      );

      await expect(getDecisionSupport()).rejects.toThrow(
        "Inventory database error",
      );
    });

    it("should throw an error when inventory usage logs cannot be retrieved", async () => {
      getOrders.mockResolvedValue([]);

      getPayments.mockResolvedValue([]);

      getInventoryItems.mockResolvedValue([]);

      getInventoryUsageLogs.mockRejectedValue(
        new Error("Inventory usage log error"),
      );

      await expect(getDecisionSupport()).rejects.toThrow(
        "Inventory usage log error",
      );
    });

    it("should throw an error when inventory restocks cannot be retrieved", async () => {
      getOrders.mockResolvedValue([]);

      getPayments.mockResolvedValue([]);

      getInventoryItems.mockResolvedValue([]);

      getInventoryUsageLogs.mockResolvedValue([]);

      getInventoryRestocks.mockRejectedValue(
        new Error("Inventory restock error"),
      );

      await expect(getDecisionSupport()).rejects.toThrow(
        "Inventory restock error",
      );
    });
  });
});
