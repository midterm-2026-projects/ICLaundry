// backend/services/PaymentService.js

import { createPayment, getPaymentsByOrderId } from "../models/PaymentModel.js";

import { getOrderById, updateOrderPayment } from "../models/OrderModel.js";

/**
 * =====================================================
 * PAYMENT SERVICE
 * Handles payment workflow.
 * =====================================================
 */

const validatePaymentAmount = (amount) => {
  if (amount === undefined || amount === null || Number(amount) <= 0) {
    throw new Error("Invalid payment amount.");
  }
};

const validatePaymentMethod = (payment_method) => {
  const allowedMethods = ["cash", "gcash", "card"];

  if (
    !payment_method ||
    !allowedMethods.includes(payment_method.toLowerCase())
  ) {
    throw new Error("Invalid payment method.");
  }
};

/**
 * =====================================================
 * CREATE INITIAL PAYMENT
 * Requires minimum 50% downpayment.
 * =====================================================
 */

export const createInitialPayment = async ({
  order_id,
  amount,
  payment_method,
}) => {
  const order = await getOrderById(order_id);

  if (!order) {
    throw new Error("Order not found.");
  }

  validatePaymentAmount(amount);

  validatePaymentMethod(payment_method);

  const totalPrice = Number(order.total_price);

  const minimumDownpayment = totalPrice * 0.5;

  if (Number(amount) < minimumDownpayment) {
    throw new Error(`Minimum downpayment is ₱${minimumDownpayment}.`);
  }

  /**
   * Prevent duplicate initial payment
   */

  if (order.payment_status && order.payment_status.toLowerCase() !== "unpaid") {
    throw new Error("Initial payment already completed.");
  }

  const payment = await createPayment({
    order_id,

    amount,

    payment_method,
  });

  const paymentStatus = Number(amount) >= totalPrice ? "paid" : "partial";

  await updateOrderPayment(
    order_id,
    Number(amount),
    paymentStatus,
    payment_method,
  );

  return payment;
};

/**
 * =====================================================
 * COMPLETE PAYMENT
 * Pay remaining balance.
 * =====================================================
 */

export const completePayment = async ({ order_id, amount, payment_method }) => {
  const order = await getOrderById(order_id);

  if (!order) {
    throw new Error("Order not found.");
  }

  validatePaymentAmount(amount);

  validatePaymentMethod(payment_method);

  /**
   * Prevent duplicate completion
   */

  if (order.payment_status && order.payment_status.toLowerCase() === "paid") {
    throw new Error("Order is already fully paid.");
  }

  const totalPrice = Number(order.total_price);

  const currentPaid = Number(order.amount_paid || 0);

  const remainingBalance = totalPrice - currentPaid;

  /**
   * Prevent overpayment
   */

  if (Number(amount) > remainingBalance) {
    throw new Error("Payment exceeds remaining balance.");
  }

  await createPayment({
    order_id,

    amount,

    payment_method,
  });

  const payments = await getPaymentsByOrderId(order_id);

  const totalPaid = payments.reduce(
    (sum, payment) => sum + Number(payment.amount),
    0,
  );

  const paymentStatus = totalPaid >= totalPrice ? "paid" : "partial";

  await updateOrderPayment(order_id, totalPaid, paymentStatus, payment_method);

  return {
    totalPaid,

    paymentStatus,
  };
};
