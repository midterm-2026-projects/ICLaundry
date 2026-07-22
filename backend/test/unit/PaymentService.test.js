// backend/test/unit/PaymentService.test.js

import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  createInitialPayment,
  completePayment,
} from "../../services/PaymentService.js";

vi.mock("../../models/OrderModel.js", () => {
  let orders = [
    {
      id: 1,
      total_price: 1000,
      amount_paid: 0,
      payment_status: "unpaid",
      payment_method: null,
    },
    {
      id: 2,
      total_price: 500,
      amount_paid: 250,
      payment_status: "partial",
      payment_method: "cash",
    },
    {
      id: 3,
      total_price: 800,
      amount_paid: 800,
      payment_status: "paid",
      payment_method: "gcash",
    },
  ];

  const resetOrders = () => {
    orders = [
      {
        id: 1,
        total_price: 1000,
        amount_paid: 0,
        payment_status: "unpaid",
        payment_method: null,
      },
      {
        id: 2,
        total_price: 500,
        amount_paid: 250,
        payment_status: "partial",
        payment_method: "cash",
      },
      {
        id: 3,
        total_price: 800,
        amount_paid: 800,
        payment_status: "paid",
        payment_method: "gcash",
      },
    ];
  };

  return {
    resetOrders,

    getOrderById: vi.fn((id) => {
      return orders.find((o) => o.id === Number(id)) || null;
    }),

    updateOrderPayment: vi.fn((id, amountPaid, paymentStatus, paymentMethod) => {
      const order = orders.find((o) => o.id === Number(id));

      if (!order) return null;

      order.amount_paid = amountPaid;
      order.payment_status = paymentStatus;
      order.payment_method = paymentMethod;

      return order;
    }),
  };
});

vi.mock("../../models/PaymentModel.js", () => {
  let payments = [];

  const resetPayments = () => {
    payments = [];
  };

  return {
    resetPayments,

    createPayment: vi.fn((paymentData) => {
      const newPayment = {
        id: payments.length + 1,
        ...paymentData,
      };

      payments.push(newPayment);

      return newPayment;
    }),

    getPaymentsByOrderId: vi.fn((orderId) => {
      return payments.filter((p) => p.order_id === Number(orderId));
    }),

    deletePayment: vi.fn((id) => {
      const index = payments.findIndex((p) => p.id === Number(id));

      if (index === -1) return false;

      payments.splice(index, 1);

      return true;
    }),
  };
});

import * as orderModel from "../../models/OrderModel.js";
import * as paymentModel from "../../models/PaymentModel.js";

describe("Payment Service", () => {
  beforeEach(() => {
    orderModel.resetOrders();
    paymentModel.resetPayments();
    vi.clearAllMocks();
  });

  /**
   * ==============================================
   * INITIAL PAYMENT
   * ==============================================
   */

  describe("Initial Payment", () => {
    it("should accept valid customer downpayment", async () => {
      const payment = await createInitialPayment({
        order_id: 1,
        amount: 500,
        payment_method: "cash",
      });

      expect(payment).toBeDefined();
      expect(payment.order_id).toBe(1);
      expect(payment.amount).toBe(500);
      expect(payment.payment_method).toBe("cash");
    });

    it("should reject payment below required downpayment", async () => {
      await expect(
        createInitialPayment({
          order_id: 1,
          amount: 100,
          payment_method: "cash",
        }),
      ).rejects.toThrow(/Minimum downpayment/i);
    });

    it.each([0, -100, -1])(
      "should reject invalid payment amount %s",
      async (amount) => {
        await expect(
          createInitialPayment({
            order_id: 1,
            amount,
            payment_method: "cash",
          }),
        ).rejects.toThrow(/Invalid payment amount/i);
      },
    );

    it.each(["", null, "invalid"])(
      "should reject invalid payment method %s",
      async (payment_method) => {
        await expect(
          createInitialPayment({
            order_id: 1,
            amount: 500,
            payment_method,
          }),
        ).rejects.toThrow(/Invalid payment method/i);
      },
    );

    it("should reject payment for non-existing order", async () => {
      await expect(
        createInitialPayment({
          order_id: 999999,
          amount: 500,
          payment_method: "cash",
        }),
      ).rejects.toThrow(/Order not found/i);
    });

    it("should reject initial payment if payments already exist for the order", async () => {
      await createInitialPayment({
        order_id: 1,
        amount: 500,
        payment_method: "cash",
      });

      await expect(
        createInitialPayment({
          order_id: 1,
          amount: 500,
          payment_method: "cash",
        }),
      ).rejects.toThrow(/Initial payment already exists/i);
    });

    it("should reject initial payment if order is already paid", async () => {
      await expect(
        createInitialPayment({
          order_id: 3,
          amount: 400,
          payment_method: "cash",
        }),
      ).rejects.toThrow(/Initial payment already exists/i);
    });
  });

  /**
   * ==============================================
   * COMPLETE PAYMENT
   * ==============================================
   */

  describe("Complete Payment", () => {
    it("should complete remaining customer balance", async () => {
      const result = await completePayment({
        order_id: 1,
        amount: 1000,
        payment_method: "cash",
      });

      expect(result.paymentStatus).toBe("paid");
      expect(result.totalPaid).toBe(1000);
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
      await expect(
        completePayment({
          order_id: 2,
          amount: 500,
          payment_method: "cash",
        }),
      ).rejects.toThrow(/Payment exceeds remaining balance/i);
    });

    it.each([0, -100])(
      "should reject invalid completion amount %s",
      async (amount) => {
        await expect(
          completePayment({
            order_id: 1,
            amount,
            payment_method: "cash",
          }),
        ).rejects.toThrow(/Invalid payment amount/i);
      },
    );

    it("should prevent completing already paid order", async () => {
      await expect(
        completePayment({
          order_id: 3,
          amount: 100,
          payment_method: "cash",
        }),
      ).rejects.toThrow(/Payment exceeds remaining balance/i);
    });

    it("should calculate partial status when underpaying", async () => {
      const result = await completePayment({
        order_id: 1,
        amount: 400,
        payment_method: "gcash",
      });

      expect(result.paymentStatus).toBe("partial");
      expect(result.totalPaid).toBe(400);
    });
  });
});
