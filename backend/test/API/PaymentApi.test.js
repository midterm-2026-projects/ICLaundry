import { describe, it, expect } from "vitest";
import request from "supertest";

import app from "../../app.js";

describe("Payment API Integration Test", () => {
  /**
   * ==============================================
   * INITIAL PAYMENT
   * ==============================================
   */

  describe("POST /api/payments/initial", () => {
    it("should allow customer to create initial downpayment", async () => {
      const ordersResponse = await request(app).get("/api/orders");

      expect(ordersResponse.status).toBe(200);

      const order = ordersResponse.body.data[0];

      const minimumDownpayment = Number(order.total_price) * 0.5;

      const response = await request(app).post("/api/payments/initial").send({
        order_id: order.id,
        amount: minimumDownpayment,
        payment_method: "cash",
      });

      if (response.status !== 201) {
        console.log(response.body);
      }

      expect(response.status).toBe(201);

      expect(response.body.success).toBe(true);

      expect(response.body.data).toBeDefined();
    });

    it.each([
      {},
      {
        amount: 100,
        payment_method: "cash",
      },
      {
        order_id: null,
        amount: 100,
        payment_method: "cash",
      },
    ])(
      "should reject incomplete initial payment information %#",
      async (payload) => {
        const response = await request(app)
          .post("/api/payments/initial")
          .send(payload);

        expect(response.status).toBe(400);

        expect(response.body.success).toBe(false);
      },
    );

    it("should reject payment for non-existing order", async () => {
      const response = await request(app).post("/api/payments/initial").send({
        order_id: "999999",
        amount: 500,
        payment_method: "cash",
      });

      expect([400, 404]).toContain(response.status);

      expect(response.body.success).toBe(false);
    });

    it.each([0, -100, -1])(
      "should reject invalid payment amount %s",
      async (amount) => {
        const ordersResponse = await request(app).get("/api/orders");

        const order = ordersResponse.body.data[0];

        const response = await request(app).post("/api/payments/initial").send({
          order_id: order.id,
          amount,
          payment_method: "cash",
        });

        expect(response.status).toBe(400);

        expect(response.body.success).toBe(false);
      },
    );

    it("should prevent customer from paying below required downpayment", async () => {
      const ordersResponse = await request(app).get("/api/orders");

      const order = ordersResponse.body.data[0];

      const response = await request(app)
        .post("/api/payments/initial")
        .send({
          order_id: order.id,
          amount: Number(order.total_price) * 0.1,
          payment_method: "cash",
        });

      expect(response.status).toBe(400);

      expect(response.body.success).toBe(false);
    });
  });

  /**
   * ==============================================
   * COMPLETE PAYMENT
   * ==============================================
   */

  describe("POST /api/payments/complete", () => {
    it("should allow customer to complete remaining payment", async () => {
      const ordersResponse = await request(app).get("/api/orders");

      const order = ordersResponse.body.data[0];

      const remainingBalance =
        Number(order.total_price) - Number(order.amount_paid);

      const response = await request(app).post("/api/payments/complete").send({
        order_id: order.id,
        amount: remainingBalance,
        payment_method: "cash",
      });

      if (response.status !== 200) {
        console.log(response.body);
      }

      expect(response.status).toBe(200);

      expect(response.body.success).toBe(true);

      expect(response.body.data.paymentStatus).toBe("paid");
    });

    it("should reject completing payment without order id", async () => {
      const response = await request(app).post("/api/payments/complete").send({
        amount: 500,
        payment_method: "cash",
      });

      expect(response.status).toBe(400);

      expect(response.body.success).toBe(false);
    });

    it("should reject completing payment with invalid amount", async () => {
      const ordersResponse = await request(app).get("/api/orders");

      const order = ordersResponse.body.data[0];

      const response = await request(app).post("/api/payments/complete").send({
        order_id: order.id,
        amount: -500,
        payment_method: "cash",
      });

      expect(response.status).toBe(400);

      expect(response.body.success).toBe(false);
    });

    it("should prevent customer from overpaying order", async () => {
      const ordersResponse = await request(app).get("/api/orders");

      const order = ordersResponse.body.data[0];

      const response = await request(app)
        .post("/api/payments/complete")
        .send({
          order_id: order.id,
          amount: Number(order.total_price) + 1000,
          payment_method: "cash",
        });

      expect(response.status).toBe(400);

      expect(response.body.success).toBe(false);
    });

    it("should prevent paying an already completed order", async () => {
      const ordersResponse = await request(app).get("/api/orders");

      const paidOrder = ordersResponse.body.data.find(
        (order) =>
          order.payment_status && order.payment_status.toLowerCase() === "paid",
      );

      if (!paidOrder) return;

      const response = await request(app).post("/api/payments/complete").send({
        order_id: paidOrder.id,
        amount: 500,
        payment_method: "cash",
      });

      expect(response.status).toBe(400);

      expect(response.body.success).toBe(false);
    });
  });

  /**
   * ==============================================
   * PAYMENT METHOD VALIDATION
   * ==============================================
   */

  describe("Payment method validation", () => {
    it.each(["", null, "invalid_method"])(
      "should reject invalid payment method %s",
      async (payment_method) => {
        const ordersResponse = await request(app).get("/api/orders");

        const order = ordersResponse.body.data[0];

        const response = await request(app).post("/api/payments/initial").send({
          order_id: order.id,
          amount: 500,
          payment_method,
        });

        expect(response.status).toBe(400);

        expect(response.body.success).toBe(false);
      },
    );
  });
});
