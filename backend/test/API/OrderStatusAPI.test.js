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

      // Find an order that is still in "pending" status
      const order = ordersResponse.body.data.find(
        (item) => item.status?.toLowerCase() === "pending",
      );

      expect(order).toBeDefined();

      // Update status to washing
      const response = await request(app)
        .patch(`/api/orders/${order.id}/status`)
        .send({
          status: "washing",
        });

      if (response.status !== 200) {
        console.log(response.body);
      }

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.status).toBe("washing");
    });
  });
});
