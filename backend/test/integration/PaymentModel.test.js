import { describe, it, expect } from "vitest";

import {
  createPayment,
  getPayments,
  getPaymentById,
  updatePayment,
  deletePayment,
} from "../../models/PaymentModel.js";

import { getOrders } from "../../models/OrderModel.js";

describe("Payment Model Integration Test", () => {
  describe("Create Payment", () => {
    it("should create a payment record", async () => {
      // Arrange
      const orders = await getOrders();

      expect(orders.length).toBeGreaterThan(0);

      const payment = {
        order_id: orders[0].id,
        amount: 100,
        payment_method: "cash",
        payment_status: "partial",
      };

      // Act
      const result = await createPayment(payment);

      // Assert
      expect(result).toBeDefined();
      expect(result.order_id).toBe(payment.order_id);
      expect(Number(result.amount)).toBe(100);
    });
  });

  describe("Get Payments", () => {
    it("should retrieve all payments", async () => {
      // Arrange

      // Act
      const result = await getPayments();

      // Assert
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("Get Payment By ID", () => {
    it("should retrieve a payment by id", async () => {
      // Arrange
      const payments = await getPayments();

      expect(payments.length).toBeGreaterThan(0);

      // Act
      const result = await getPaymentById(payments[0].id);

      // Assert
      expect(result.id).toBe(payments[0].id);
    });
  });

  describe("Update Payment", () => {
    it("should update an existing payment", async () => {
      // Arrange
      const payments = await getPayments();

      expect(payments.length).toBeGreaterThan(0);

      // Act
      const result = await updatePayment(payments[0].id, {
        notes: "Updated during integration test",
      });

      // Assert
      expect(result.notes).toBe("Updated during integration test");
    });
  });

  describe("Delete Payment", () => {
    it("should delete a payment", async () => {
      // Arrange
      const orders = await getOrders();

      const payment = await createPayment({
        order_id: orders[0].id,
        amount: 50,
        payment_method: "cash",
        payment_status: "partial",
      });

      // Act
      const result = await deletePayment(payment.id);

      // Assert
      expect(result).toBe(true);
    });
  });
});
