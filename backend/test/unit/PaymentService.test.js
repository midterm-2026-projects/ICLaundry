// backend/test/unit/PaymentService.test.js

import { describe, it, expect } from "vitest";

import {
  createInitialPayment,
  completePayment,
} from "../../services/PaymentService.js";

import { getOrders, updateOrder } from "../../models/OrderModel.js";

describe("Payment Service", () => {
  describe("Initial Payment", () => {
    it("should accept a valid downpayment", async () => {
      // Arrange
      const orders = await getOrders();

      expect(orders.length).toBeGreaterThan(0);

      const order = orders[0];

      await updateOrder(order.id, {
        amount_paid: 0,
        payment_status: "unpaid",
      });

      // Act
      const payment = await createInitialPayment({
        order_id: order.id,
        amount: Number(order.total_price) * 0.5,
        payment_method: "cash",
      });

      // Assert
      expect(payment).toBeDefined();
    });
  });

  describe("Complete Payment", () => {
    it("should complete the remaining balance", async () => {
      // Arrange
      const orders = await getOrders();

      const order = orders[0];

      const remaining = Number(order.total_price) - Number(order.amount_paid);

      // Act
      const result = await completePayment({
        order_id: order.id,
        amount: remaining,
        payment_method: "cash",
      });

      // Assert
      expect(result.paymentStatus).toBe("paid");
    });
  });
});
