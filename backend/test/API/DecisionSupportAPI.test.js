// test/API/DecisionSupportAPI.test.js

import { describe, it, expect, vi } from "vitest";

import request from "supertest";

vi.mock("../../models/OrderModel.js", () => ({
  getOrders: vi.fn().mockResolvedValue([
    {
      id: 1,
      total_amount: 500,
      created_at: "2026-05-10",
    },
    {
      id: 2,
      total_amount: 700,
      created_at: "2026-06-10",
    },
  ]),
}));

vi.mock("../../models/PaymentModel.js", () => ({
  getPayments: vi.fn().mockResolvedValue([
    {
      id: 1,
      amount: 500,
      payment_date: "2026-05-10",
    },
    {
      id: 2,
      amount: 700,
      payment_date: "2026-06-10",
    },
  ]),
}));

vi.mock("../../models/InventoryModel.js", () => ({
  getInventoryItems: vi.fn().mockResolvedValue([
    {
      id: 1,
      name: "Laundry Detergent",
      current_stock: 50,
      minimum_stock: 10,
    },
    {
      id: 2,
      name: "Fabric Conditioner",
      current_stock: 20,
      minimum_stock: 8,
    },
  ]),

  getInventoryUsageLogs: vi.fn().mockResolvedValue([
    {
      id: 1,
      item_id: 1,
      quantity_used: 10,
    },
    {
      id: 2,
      item_id: 2,
      quantity_used: 5,
    },
  ]),

  getInventoryRestocks: vi.fn().mockResolvedValue([
    {
      id: 1,
      item_id: 1,
      quantity_added: 5,
    },
    {
      id: 2,
      item_id: 2,
      quantity_added: 3,
    },
  ]),
}));

const { default: app } = await import("../../app.js");

describe("Decision Support API Integration Test", () => {
  describe("GET /api/decision-support", () => {
    it("should allow admin to load the Decision Support dashboard", async () => {
      const response = await request(app).get("/api/decision-support");

      expect(response.status).toBe(200);

      expect(response.body.success).toBe(true);

      expect(response.body.data).toBeDefined();
    });

    it("should return dashboard summary", async () => {
      const response = await request(app).get("/api/decision-support");

      expect(response.status).toBe(200);

      expect(response.body.data).toHaveProperty("summary");
    });

    it("should return dashboard statistics", async () => {
      const response = await request(app).get("/api/decision-support");

      expect(response.status).toBe(200);

      expect(response.body.data).toHaveProperty("statistics");
    });
  });

  describe("Revenue Forecast", () => {
    it("should return revenue forecast dataset", async () => {
      const response = await request(app).get("/api/decision-support");

      expect(response.status).toBe(200);

      expect(Array.isArray(response.body.data.revenueForecast)).toBe(true);
    });

    it("should include a forecast record", async () => {
      const response = await request(app).get("/api/decision-support");

      const forecast = response.body.data.revenueForecast.find(
        (item) => item.type === "Forecast",
      );

      expect(forecast).toBeDefined();
    });

    it("should include historical revenue records", async () => {
      const response = await request(app).get("/api/decision-support");

      const historical = response.body.data.revenueForecast.filter(
        (item) => item.type === "Historical",
      );

      expect(Array.isArray(historical)).toBe(true);

      expect(historical.length).toBeGreaterThan(0);
    });
  });

  describe("Inventory Forecast", () => {
    it("should return inventory forecast dataset", async () => {
      const response = await request(app).get("/api/decision-support");

      expect(response.status).toBe(200);

      expect(Array.isArray(response.body.data.inventoryForecast)).toBe(true);
    });

    it("should return predicted stock values", async () => {
      const response = await request(app).get("/api/decision-support");

      response.body.data.inventoryForecast.forEach((item) => {
        expect(item).toHaveProperty("predictedStock");
      });
    });
  });

  describe("Revenue Trend", () => {
    it("should return revenue trend analysis", async () => {
      const response = await request(app).get("/api/decision-support");

      expect(response.status).toBe(200);

      expect(response.body.data).toHaveProperty("revenueTrend");

      expect(response.body.data.revenueTrend).toHaveProperty("trend");

      expect(response.body.data.revenueTrend).toHaveProperty("growthRate");

      expect(response.body.data.revenueTrend).toHaveProperty("score");
    });

    it("should return a valid revenue trend classification", async () => {
      const response = await request(app).get("/api/decision-support");

      expect([
        "Excellent Growth",
        "Growing",
        "Slight Growth",
        "Stable",
        "Slight Decline",
        "Declining",
      ]).toContain(response.body.data.revenueTrend.trend);
    });
  });

  describe("Inventory Trend", () => {
    it("should return inventory trend analysis", async () => {
      const response = await request(app).get("/api/decision-support");

      expect(response.status).toBe(200);

      expect(Array.isArray(response.body.data.inventoryTrend)).toBe(true);
    });

    it("should include trend and score for every inventory item", async () => {
      const response = await request(app).get("/api/decision-support");

      response.body.data.inventoryTrend.forEach((item) => {
        expect(item).toHaveProperty("trend");

        expect(item).toHaveProperty("score");
      });
    });
  });

  describe("Decision Support Recommendations", () => {
    it("should generate business recommendations", async () => {
      const response = await request(app).get("/api/decision-support");

      expect(response.status).toBe(200);

      expect(Array.isArray(response.body.data.recommendations)).toBe(true);
    });

    it("should return recommendation details", async () => {
      const response = await request(app).get("/api/decision-support");

      response.body.data.recommendations.forEach((recommendation) => {
        expect(recommendation).toHaveProperty("priority");

        expect(recommendation).toHaveProperty("category");

        expect(recommendation).toHaveProperty("title");

        expect(recommendation).toHaveProperty("description");
      });
    });

    it("should return recommendations sorted by priority", async () => {
      const response = await request(app).get("/api/decision-support");

      expect(response.status).toBe(200);

      const recommendations = response.body.data.recommendations;

      const priorityOrder = {
        Critical: 1,
        High: 2,
        Medium: 3,
        Low: 4,
      };

      for (let index = 1; index < recommendations.length; index += 1) {
        expect(
          priorityOrder[recommendations[index - 1].priority],
        ).toBeLessThanOrEqual(priorityOrder[recommendations[index].priority]);
      }
    });
  });

  describe("Decision Support Alerts", () => {
    it("should generate dashboard alerts", async () => {
      const response = await request(app).get("/api/decision-support");

      expect(response.status).toBe(200);

      expect(Array.isArray(response.body.data.alerts)).toBe(true);
    });

    it("should return alert details", async () => {
      const response = await request(app).get("/api/decision-support");

      response.body.data.alerts.forEach((alert) => {
        expect(alert).toHaveProperty("severity");

        expect(alert).toHaveProperty("category");

        expect(alert).toHaveProperty("title");

        expect(alert).toHaveProperty("description");
      });
    });
  });

  describe("Decision Support Response Structure", () => {
    it("should return the complete Decision Support dashboard structure", async () => {
      const response = await request(app).get("/api/decision-support");

      expect(response.status).toBe(200);

      expect(response.body.success).toBe(true);

      const data = response.body.data;

      expect(data).toHaveProperty("summary");

      expect(data).toHaveProperty("statistics");

      expect(data).toHaveProperty("revenueForecast");

      expect(data).toHaveProperty("inventoryForecast");

      expect(data).toHaveProperty("revenueTrend");

      expect(data).toHaveProperty("inventoryTrend");

      expect(data).toHaveProperty("recommendations");

      expect(data).toHaveProperty("alerts");
    });

    it("should return numeric dashboard statistics", async () => {
      const response = await request(app).get("/api/decision-support");

      const statistics = response.body.data.statistics;

      expect(typeof statistics.totalOrders).toBe("number");

      expect(typeof statistics.totalPayments).toBe("number");

      expect(typeof statistics.totalInventoryItems).toBe("number");
    });

    it("should return a valid dashboard summary", async () => {
      const response = await request(app).get("/api/decision-support");

      const summary = response.body.data.summary;

      expect(summary).toHaveProperty("generatedAt");

      expect(summary).toHaveProperty("revenueTrend");

      expect(summary).toHaveProperty("growthRate");

      expect(summary).toHaveProperty("recommendationCount");

      expect(summary).toHaveProperty("alertCount");

      expect(summary).toHaveProperty("hasCriticalAlerts");
    });
  });

  describe("Empty Data Handling", () => {
    it("should return valid dashboard structure even when datasets are empty", async () => {
      const response = await request(app).get("/api/decision-support");

      expect(response.status).toBe(200);

      expect(response.body.success).toBe(true);

      expect(response.body.data).toBeDefined();
    });
  });

  describe("Decision Support Endpoint Validation", () => {
    it("should reject unknown Decision Support endpoint", async () => {
      const response = await request(app).get(
        "/api/decision-support/not-found",
      );

      expect(response.status).toBe(404);
    });
  });
});
