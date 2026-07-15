// backend/test/unit/PaymentService.test.js

import { describe, it, expect, beforeEach } from "vitest";

import {
  createInitialPayment,
  completePayment,
} from "../../services/PaymentService.js";

import { getOrders, updateOrder } from "../../models/OrderModel.js";

describe("Payment Service", () => {
  beforeEach(async () => {
    const orders = await getOrders();

    if (orders.length > 0) {
      await updateOrder(orders[0].id, {
        amount_paid: 0,
        payment_status: "unpaid",
      });
    }
  });

  /**
   * ==============================================
   * INITIAL PAYMENT
   * ==============================================
   */

  describe("Initial Payment", () => {
    it("should accept valid customer downpayment", async () => {
      const orders = await getOrders();

      expect(orders.length).toBeGreaterThan(0);

      const order = orders[0];

      const payment = await createInitialPayment({
        order_id: order.id,
        amount: Number(order.total_price) * 0.5,
        payment_method: "cash",
      });

      expect(payment).toBeDefined();
    });

    it("should reject payment below required downpayment", async () => {
      const orders = await getOrders();

      const order = orders[0];

      await expect(
        createInitialPayment({
          order_id: order.id,
          amount: Number(order.total_price) * 0.1,
          payment_method: "cash",
        }),
      ).rejects.toThrow();
    });

    it.each([0, -100, -1])(
      "should reject invalid payment amount %s",
      async (amount) => {
        const orders = await getOrders();

        const order = orders[0];

        await expect(
          createInitialPayment({
            order_id: order.id,
            amount,
            payment_method: "cash",
          }),
        ).rejects.toThrow();
      },
    );

    it.each(["", null, "invalid"])(
      "should reject invalid payment method %s",
      async (payment_method) => {
        const orders = await getOrders();

        const order = orders[0];

        await expect(
          createInitialPayment({
            order_id: order.id,
            amount: Number(order.total_price) * 0.5,
            payment_method,
          }),
        ).rejects.toThrow();
      },
    );

    it("should reject payment for non-existing order", async () => {
      await expect(
        createInitialPayment({
          order_id: "999999",
          amount: 500,
          payment_method: "cash",
        }),
      ).rejects.toThrow();
    });

    it("should prevent duplicate initial payment", async () => {
      const orders = await getOrders();

      const order = orders[0];

      await createInitialPayment({
        order_id: order.id,
        amount: Number(order.total_price) * 0.5,
        payment_method: "cash",
      });

      await expect(
        createInitialPayment({
          order_id: order.id,
          amount: Number(order.total_price) * 0.5,
          payment_method: "cash",
        }),
      ).rejects.toThrow();
    });
  });

  /**
   * ==============================================
   * COMPLETE PAYMENT
   * ==============================================
   */

  describe("Complete Payment", () => {
    it("should complete remaining customer balance", async () => {
      const orders = await getOrders();

      const order = orders[0];

      const remaining = Number(order.total_price) - Number(order.amount_paid);

      const result = await completePayment({
        order_id: order.id,
        amount: remaining,
        payment_method: "cash",
      });

      expect(result.paymentStatus).toBe("paid");
    });

    it("should reject completing payment with missing order id", async () => {
      await expect(
        completePayment({
          amount: 500,
          payment_method: "cash",
        }),
      ).rejects.toThrow();
    });

    it("should prevent customer from paying more than remaining balance", async () => {
      const orders = await getOrders();

      const order = orders[0];

      const remaining = Number(order.total_price) - Number(order.amount_paid);

      await expect(
        completePayment({
          order_id: order.id,
          amount: remaining + 1000,
          payment_method: "cash",
        }),
      ).rejects.toThrow();
    });

    it.each([0, -100])(
      "should reject invalid completion amount %s",
      async (amount) => {
        const orders = await getOrders();

        const order = orders[0];

        await expect(
          completePayment({
            order_id: order.id,
            amount,
            payment_method: "cash",
          }),
        ).rejects.toThrow();
      },
    );

    it("should prevent completing already paid order", async () => {
      const orders = await getOrders();

      const order = orders[0];

      await completePayment({
        order_id: order.id,
        amount: Number(order.total_price),
        payment_method: "cash",
      });

      await expect(
        completePayment({
          order_id: order.id,
          amount: 100,
          payment_method: "cash",
        }),
      ).rejects.toThrow();
    });
  });
});
