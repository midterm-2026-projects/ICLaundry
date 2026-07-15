// backend/test/API/PaymentApi.test.js

import { describe, it, expect } from "vitest";
import request from "supertest";

import app from "../../app.js";

/**
 * ==============================================
 * TEST HELPERS
 * ==============================================
 */

const getOrders = async () => {
  const response = await request(app).get("/api/orders");

  expect(response.status).toBe(200);

  return response.body.data;
};

const getUnpaidOrder = async () => {
  const orders = await getOrders();

  return orders.find(
    (order) => order.payment_status?.toLowerCase() === "unpaid",
  );
};

const getPartialOrder = async () => {
  const orders = await getOrders();

  return orders.find(
    (order) => order.payment_status?.toLowerCase() === "partial",
  );
};

const getUnpaidOrPartialOrder = async () => {
  const orders = await getOrders();

  return orders.find((order) =>
    ["unpaid", "partial"].includes(order.payment_status?.toLowerCase()),
  );
};

const getPaidOrder = async () => {
  const orders = await getOrders();

  return orders.find((order) => order.payment_status?.toLowerCase() === "paid");
};

describe("Payment API Integration Test", () => {
  /**
   * ==============================================
   * INITIAL PAYMENT
   * ==============================================
   */

  describe("POST /api/payments/initial", () => {
    it("should allow customer to create initial downpayment", async () => {
      const order = await getUnpaidOrder();

      expect(order).toBeDefined();

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
        const order = await getUnpaidOrder();

        expect(order).toBeDefined();

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
      const order = await getUnpaidOrder();

      expect(order).toBeDefined();

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
      const order = await getUnpaidOrder();

      expect(order).toBeDefined();

      const downpayment = Number(order.total_price) * 0.5;

      await request(app).post("/api/payments/initial").send({
        order_id: order.id,

        amount: downpayment,

        payment_method: "cash",
      });

      const updatedOrder = await request(app).get(`/api/orders/${order.id}`);

      const remainingBalance =
        Number(updatedOrder.body.data.total_price) -
        Number(updatedOrder.body.data.amount_paid);

      const response = await request(app).post("/api/payments/complete").send({
        order_id: order.id,

        amount: remainingBalance,

        payment_method: "cash",
      });

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
      const order = await getUnpaidOrPartialOrder();

      expect(order).toBeDefined();

      const response = await request(app).post("/api/payments/complete").send({
        order_id: order.id,

        amount: -500,

        payment_method: "cash",
      });

      expect(response.status).toBe(400);

      expect(response.body.success).toBe(false);
    });

    it("should prevent customer from overpaying order", async () => {
      const order = await getUnpaidOrPartialOrder();

      expect(order).toBeDefined();

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
      const paidOrder = await getPaidOrder();

      expect(paidOrder).toBeDefined();

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
        const order = await getUnpaidOrder();

        expect(order).toBeDefined();

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
