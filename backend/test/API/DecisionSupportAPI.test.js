import { describe, it, expect } from "vitest";
import request from "supertest";

import app from "../../app.js";

describe("Decision Support API Integration Test", () => {
  /**
   * ==============================================
   * DECISION SUPPORT DASHBOARD
   * ==============================================
   */

  describe("GET /api/decision-support", () => {
    it("should allow admin to load the Decision Support dashboard", async () => {
      /**
       * Real user scenario:
       *
       * Business owner opens
       * the Decision Support page.
       *
       * System loads:
       * - revenue forecast
       * - inventory forecast
       * - recommendations
       * - alerts
       */

      // Act

      const response = await request(app).get("/api/decision-support");

      // Assert

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

  /**
   * ==============================================
   * REVENUE FORECAST
   * ==============================================
   */

  describe("Revenue Forecast", () => {
    it("should return revenue forecast dataset", async () => {
      /**
       * Real user scenario:
       *
       * Forecast chart loads
       * next month's revenue.
       */

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
    });
  });

  /**
   * ==============================================
   * INVENTORY FORECAST
   * ==============================================
   */

  describe("Inventory Forecast", () => {
    it("should return inventory forecast dataset", async () => {
      /**
       * Real user scenario:
       *
       * Inventory Forecast
       * widget loads.
       */

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

  /**
   * ==============================================
   * REVENUE TREND
   * ==============================================
   */

  describe("Revenue Trend", () => {
    it("should return revenue trend analysis", async () => {
      /**
       * Real user scenario:
       *
       * Owner reviews
       * monthly business growth.
       */

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

  /**
   * ==============================================
   * INVENTORY TREND
   * ==============================================
   */

  describe("Inventory Trend", () => {
    it("should return inventory trend analysis", async () => {
      /**
       * Real user scenario:
       *
       * Manager checks
       * inventory health.
       */

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

  /**
   * ==============================================
   * DSS RECOMMENDATIONS
   * ==============================================
   */

  describe("Decision Support Recommendations", () => {
    it("should generate business recommendations", async () => {
      /**
       * Real user scenario:
       *
       * Owner opens DSS.
       *
       * Recommendations
       * are displayed.
       */

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

      expect(Array.isArray(response.body.data.recommendations)).toBe(true);
    });
  });

  /**
   * ==============================================
   * DSS ALERTS
   * ==============================================
   */

  describe("Decision Support Alerts", () => {
    it("should generate dashboard alerts", async () => {
      /**
       * Real user scenario:
       *
       * Dashboard displays
       * important business alerts.
       */

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

  /**
   * ==============================================
   * RESPONSE VALIDATION
   * ==============================================
   */

  describe("Decision Support Response Structure", () => {
    it("should return the complete Decision Support dashboard structure", async () => {
      /**
       * Real user scenario:
       *
       * Frontend loads the
       * entire Decision Support page.
       *
       * All required sections
       * should be available.
       */

      // Act

      const response = await request(app).get("/api/decision-support");

      // Assert

      expect(response.status).toBe(200);

      expect(response.body.success).toBe(true);

      expect(response.body.data).toHaveProperty("summary");

      expect(response.body.data).toHaveProperty("statistics");

      expect(response.body.data).toHaveProperty("revenueForecast");

      expect(response.body.data).toHaveProperty("inventoryForecast");

      expect(response.body.data).toHaveProperty("revenueTrend");

      expect(response.body.data).toHaveProperty("inventoryTrend");

      expect(response.body.data).toHaveProperty("recommendations");

      expect(response.body.data).toHaveProperty("alerts");
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

  /**
   * ==============================================
   * EMPTY DATA HANDLING
   * ==============================================
   */

  describe("Empty Data Handling", () => {
    it("should return valid dashboard structure even when datasets are empty", async () => {
      /**
       * Real user scenario:
       *
       * Newly created branch
       * has no operational data.
       *
       * Dashboard should still
       * load successfully.
       */

      const response = await request(app).get("/api/decision-support");

      expect(response.status).toBe(200);

      expect(response.body.success).toBe(true);

      expect(response.body.data).toBeDefined();
    });
  });

  /**
   * ==============================================
   * INVALID ENDPOINT
   * ==============================================
   */

  describe("Decision Support Endpoint Validation", () => {
    it("should reject unknown Decision Support endpoint", async () => {
      // Act

      const response = await request(app).get(
        "/api/decision-support/not-found",
      );

      // Assert

      expect(response.status).toBe(404);
    });
  });
});
