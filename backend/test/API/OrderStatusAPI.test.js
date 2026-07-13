import { describe, it, expect } from "vitest";
import request from "supertest";

import app from "../../app.js";

describe("Order Status API Integration Test", () => {
  describe("PATCH /api/orders/:id/status", () => {
    it("should update an existing order status", async () => {
      // Retrieve all existing orders
      const ordersResponse = await request(app).get("/api/orders");

      expect(ordersResponse.status).toBe(200);
      expect(ordersResponse.body.success).toBe(true);
      expect(Array.isArray(ordersResponse.body.data)).toBe(true);
      expect(ordersResponse.body.data.length).toBeGreaterThan(0);

      // Use the first available order
      const order = ordersResponse.body.data[0];

      expect(order).toBeDefined();

      const statusFlow = [
        "pending",
        "washing",
        "drying",
        "folding",
        "ready",
        "released",
      ];

      const currentStatus = order.status.toLowerCase();
      const currentIndex = statusFlow.indexOf(currentStatus);

      // Skip test if already released because there is no next step
      expect(currentIndex).toBeLessThan(statusFlow.length - 1);

      const nextStatus = statusFlow[currentIndex + 1];

      const response = await request(app)
        .patch(`/api/orders/${order.id}/status`)
        .send({
          status: nextStatus,
        });

      if (response.status !== 200) {
        console.log(response.body);
      }

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.status.toLowerCase()).toBe(nextStatus);
    });
  });
});
