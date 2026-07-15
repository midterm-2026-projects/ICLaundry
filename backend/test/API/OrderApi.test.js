import { describe, it, expect } from "vitest";
import request from "supertest";

import app from "../../app.js";

describe("Order API Integration Test", () => {
  /**
   * ==============================================
   * GET ALL ORDERS
   * ==============================================
   */

  describe("GET /api/orders", () => {
    it("should allow staff/customer to view all available orders", async () => {
      const response = await request(app).get("/api/orders");

      expect(response.status).toBe(200);

      expect(response.body).toHaveProperty("success");
      expect(response.body.success).toBe(true);

      expect(response.body).toHaveProperty("data");

      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it("should return order information needed by frontend order table", async () => {
      const response = await request(app).get("/api/orders");

      const order = response.body.data[0];

      expect(order).toHaveProperty("id");
      expect(order).toHaveProperty("status");
    });

    it("should handle empty orders list", async () => {
      const response = await request(app).get("/api/orders");

      expect(response.status).toBe(200);

      expect(response.body.data).toBeDefined();
    });
  });

  /**
   * ==============================================
   * GET ORDER BY ID
   * ==============================================
   */

  describe("GET /api/orders/:id", () => {
    it("should allow customer/staff to view specific order details", async () => {
      const orders = await request(app).get("/api/orders");

      const order = orders.body.data[0];

      const response = await request(app).get(`/api/orders/${order.id}`);

      expect(response.status).toBe(200);

      expect(response.body.success).toBe(true);

      expect(response.body.data.id).toBe(order.id);
    });

    it.each(["999999", "abc", "-1", "000000"])(
      "should reject invalid order id %s",
      async (id) => {
        const response = await request(app).get(`/api/orders/${id}`);

        expect([400, 404]).toContain(response.status);

        expect(response.body.success).toBe(false);
      },
    );
  });

  /**
   * ==============================================
   * ORDER STATUS WORKFLOW
   * ==============================================
   */

  describe("PATCH /api/orders/:id/status", () => {
    const workflow = [
      "pending",
      "washing",
      "drying",
      "folding",
      "ready",
      "released",
    ];

    it.each([
      ["pending", "washing"],
      ["washing", "drying"],
      ["drying", "folding"],
      ["folding", "ready"],
    ])(
      "should allow valid workflow transition %s -> %s",
      async (current, next) => {
        const orders = await request(app).get("/api/orders");

        const order = orders.body.data.find(
          (item) => item.status.toLowerCase() === current,
        );

        if (!order) return;

        const response = await request(app)
          .patch(`/api/orders/${order.id}/status`)
          .send({
            status: next,
          });

        expect(response.status).toBe(200);

        expect(response.body.success).toBe(true);

        expect(response.body.data.status.toLowerCase()).toBe(next);
      },
    );

    it("should prevent staff from skipping workflow stages", async () => {
      const orders = await request(app).get("/api/orders");

      const order = orders.body.data.find(
        (item) => item.status.toLowerCase() === "pending",
      );

      if (!order) return;

      const response = await request(app)
        .patch(`/api/orders/${order.id}/status`)
        .send({
          status: "ready",
        });

      expect(response.status).toBe(400);

      expect(response.body.success).toBe(false);
    });

    it("should prevent staff from moving order backwards", async () => {
      const orders = await request(app).get("/api/orders");

      const order = orders.body.data.find(
        (item) => item.status.toLowerCase() === "washing",
      );

      if (!order) return;

      const response = await request(app)
        .patch(`/api/orders/${order.id}/status`)
        .send({
          status: "pending",
        });

      expect(response.status).toBe(400);

      expect(response.body.success).toBe(false);
    });

    it.each([
      {},
      { status: "" },
      { status: null },
      { status: 123 },
      { status: "unknown" },
    ])("should reject invalid status input %#", async (payload) => {
      const orders = await request(app).get("/api/orders");

      const order = orders.body.data[0];

      const response = await request(app)
        .patch(`/api/orders/${order.id}/status`)
        .send(payload);

      expect(response.status).toBe(400);

      expect(response.body.success).toBe(false);
    });

    it("should prevent updating released orders", async () => {
      const orders = await request(app).get("/api/orders");

      const order = orders.body.data.find(
        (item) => item.status.toLowerCase() === "released",
      );

      if (!order) return;

      const response = await request(app)
        .patch(`/api/orders/${order.id}/status`)
        .send({
          status: "released",
        });

      expect(response.status).toBe(400);
    });
  });

  /**
   * ==============================================
   * PAYMENT BUSINESS RULE
   * ==============================================
   */

  describe("Payment validation during order workflow", () => {
    it("should prevent releasing order when customer has unpaid balance", async () => {
      const orders = await request(app).get("/api/orders");

      const order = orders.body.data.find(
        (item) =>
          item.payment_status && item.payment_status.toLowerCase() !== "paid",
      );

      if (!order) return;

      const response = await request(app)
        .patch(`/api/orders/${order.id}/status`)
        .send({
          status: "released",
        });

      expect(response.status).toBe(400);

      expect(response.body.message).toMatch(/payment/i);
    });

    it("should allow releasing fully paid completed order", async () => {
      const orders = await request(app).get("/api/orders");

      const order = orders.body.data.find(
        (item) =>
          item.payment_status &&
          item.payment_status.toLowerCase() === "paid" &&
          item.status.toLowerCase() === "ready",
      );

      if (!order) return;

      const response = await request(app)
        .patch(`/api/orders/${order.id}/status`)
        .send({
          status: "released",
        });

      expect(response.status).toBe(200);

      expect(response.body.success).toBe(true);
    });
  });
});
