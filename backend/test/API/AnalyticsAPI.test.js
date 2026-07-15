import { describe, it, expect } from "vitest";
import request from "supertest";

import app from "../../app.js";

describe("Analytics API Integration Test", () => {
  /**
   * ==============================================
   * DASHBOARD ANALYTICS
   * ==============================================
   */

  describe("GET /api/analytics/dashboard", () => {
    it("should allow admin to load dashboard analytics", async () => {
      /**
       * Real user scenario:
       *
       * Admin opens dashboard.
       *
       * System loads:
       * - revenue
       * - expenses
       * - profit
       * - order count
       */

      const response = await request(app).get("/api/analytics/dashboard");

      expect(response.status).toBe(200);

      expect(response.body.success).toBe(true);

      expect(response.body.data).toBeDefined();

      expect(response.body.data).toHaveProperty("totalRevenue");

      expect(response.body.data).toHaveProperty("totalExpenses");

      expect(response.body.data).toHaveProperty("netProfit");

      expect(response.body.data).toHaveProperty("totalOrders");
    });

    it("should return chart datasets for dashboard visualization", async () => {
      const response = await request(app).get("/api/analytics/dashboard");

      expect(response.status).toBe(200);

      expect(Array.isArray(response.body.data.revenueDataset)).toBe(true);

      expect(Array.isArray(response.body.data.expenseDataset)).toBe(true);
    });
  });

  /**
   * ==============================================
   * DATE FILTERING
   * ==============================================
   */

  describe("Dashboard Date Filtering", () => {
    it("should allow admin to filter analytics by date range", async () => {
      /**
       * Real user scenario:
       *
       * Admin selects:
       *
       * July 1 - July 15
       *
       * Dashboard refreshes.
       */

      const response = await request(app)
        .get("/api/analytics/dashboard")
        .query({
          startDate: "2026-07-01",

          endDate: "2026-07-15",
        });

      expect(response.status).toBe(200);

      expect(response.body.success).toBe(true);

      expect(response.body.data).toBeDefined();
    });

    it("should handle empty date filters", async () => {
      const response = await request(app)
        .get("/api/analytics/dashboard")
        .query({
          startDate: "",
          endDate: "",
        });

      expect(response.status).toBe(200);

      expect(response.body.success).toBe(true);
    });
  });

  /**
   * ==============================================
   * BRANCH FILTERING
   * ==============================================
   */

  describe("Dashboard Branch Filtering", () => {
    it("should allow admin to view specific branch analytics", async () => {
      /**
       * Real user scenario:
       *
       * Owner selects one branch
       * to review performance.
       */

      const response = await request(app)
        .get("/api/analytics/dashboard")
        .query({
          branchId: "1",
        });

      expect(response.status).toBe(200);

      expect(response.body.success).toBe(true);

      expect(response.body.data).toBeDefined();
    });

    it("should return empty analytics for branch without records", async () => {
      const response = await request(app)
        .get("/api/analytics/dashboard")
        .query({
          branchId: "999999",
        });

      expect(response.status).toBe(200);

      expect(response.body.success).toBe(true);

      expect(response.body.data.totalRevenue).toBe(0);

      expect(response.body.data.totalOrders).toBe(0);
    });
  });

  /**
   * ==============================================
   * RESPONSE VALIDATION
   * ==============================================
   */

  describe("Analytics Response Structure", () => {
    it("should return numeric KPI values", async () => {
      const response = await request(app).get("/api/analytics/dashboard");

      const analytics = response.body.data;

      expect(typeof analytics.totalRevenue).toBe("number");

      expect(typeof analytics.totalExpenses).toBe("number");

      expect(typeof analytics.netProfit).toBe("number");

      expect(typeof analytics.totalOrders).toBe("number");
    });

    it("should reject unknown analytics endpoint", async () => {
      const response = await request(app).get("/api/analytics/not-found");

      expect(response.status).toBe(404);
    });
  });
});
