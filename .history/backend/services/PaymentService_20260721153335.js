// backend/services/PaymentService.js

import { createPayment } from "../models/PaymentModel.js";

import { getOrderById, updateOrderPayment } from "../models/OrderModel.js";

/**
 * =====================================================
 * PAYMENT SERVICE
 * Handles payment workflow.
 * =====================================================
 */

/**
 * =====================================================
 * VALIDATION
 * =====================================================
 */

const validatePaymentAmount = (amount) => {
  if (amount === undefined || amount === null || Number(amount) <= 0) {
    throw new Error("Invalid payment amount.");
  }
};

const validatePaymentMethod = (payment_method) => {
  const allowedMethods = ["cash", "gcash", "bank_transfer", "card"];

  if (
    !payment_method ||
    !allowedMethods.includes(payment_method.toLowerCase())
  ) {
    throw new Error("Invalid payment method.");
  }
};

const calculatePaymentStatus = (total, paid) => {
  const totalPrice = Number(total || 0);

  const amountPaid = Number(paid || 0);

  if (amountPaid <= 0) {
    return "unpaid";
  }

  if (amountPaid >= totalPrice) {
    return "paid";
  }

  return "partial";
};

/**
 * =====================================================
 * CREATE INITIAL PAYMENT
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

  const totalPrice = Number(order.total_price || 0);

  const paymentAmount = Number(amount);

  const minimumDownpayment = totalPrice * 0.5;

  if (paymentAmount < minimumDownpayment) {
    throw new Error(`Minimum downpayment is ₱${minimumDownpayment}.`);
  }

  const payment = await createPayment({
    order_id,

    amount: paymentAmount,

    payment_method,
  });

  await updateOrderPayment(
    order_id,

    paymentAmount,

    calculatePaymentStatus(
      totalPrice,

      paymentAmount,
    ),

    payment_method,
  );

  return payment;
};

/**
 * =====================================================
 * COMPLETE PAYMENT
 * =====================================================
 */

export const completePayment = async ({ order_id, amount, payment_method }) => {
  const order = await getOrderById(order_id);

  if (!order) {
    throw new Error("Order not found.");
  }

  validatePaymentAmount(amount);

  validatePaymentMethod(payment_method);

  const totalPrice = Number(order.total_price || 0);

  const previousPaid = Number(order.amount_paid || 0);

  const paymentAmount = Number(amount);

  const totalAfterPayment = previousPaid + paymentAmount;

  const remainingBalance = totalPrice - previousPaid;

  if (paymentAmount > remainingBalance) {
    throw new Error("Payment exceeds remaining balance.");
  }

  await createPayment({
    order_id,

    amount: paymentAmount,

    payment_method,
  });

  await updateOrderPayment(
    order_id,

    totalAfterPayment,

    calculatePaymentStatus(
      totalPrice,

      totalAfterPayment,
    ),

    payment_method,
  );

  return {
    totalPaid: totalAfterPayment,

    paymentStatus: calculatePaymentStatus(
      totalPrice,

      totalAfterPayment,
    ),
  };
};
