import { describe, it, expect } from "vitest";
import request from "supertest";

import app from "../../app.js";

describe("Order API Integration Test", () => {
  describe("GET /api/orders", () => {
    it("should return all orders", async () => {
      const response = await request(app).get("/api/orders");

      expect(response.status).toBe(200);

      expect(response.body.success).toBe(true);

      expect(Array.isArray(response.body.data)).toBe(true);

      expect(response.body.data.length).toBeGreaterThan(0);
    });
  });

  describe("GET /api/orders/:id", () => {
    it("should return an existing order", async () => {
      // Retrieve all orders first
      const ordersResponse = await request(app).get("/api/orders");

      expect(ordersResponse.status).toBe(200);

      expect(ordersResponse.body.data.length).toBeGreaterThan(0);

      // Use the first order returned
      const order = ordersResponse.body.data[0];

      const response = await request(app).get(`/api/orders/${order.id}`);

      expect(response.status).toBe(200);

      expect(response.body.success).toBe(true);

      expect(response.body.data.id).toBe(order.id);
    });
  });
});
