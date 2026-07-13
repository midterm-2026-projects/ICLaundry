// backend/services/PaymentService.js

import { createPayment, getPaymentsByOrderId } from "../models/PaymentModel.js";

import { getOrderById, updateOrderPayment } from "../models/OrderModel.js";

/**
 * =====================================================
 * PAYMENT SERVICE
 * Handles payment workflow.
 * =====================================================
 */

/**
 * Create the initial payment when an order is created.
 * Requires at least 50% downpayment.
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

  const totalPrice = Number(order.total_price);

  const minimumDownpayment = totalPrice * 0.5;

  if (Number(amount) < minimumDownpayment) {
    throw new Error(`Minimum downpayment is ₱${minimumDownpayment}.`);
  }

  // Save payment record
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
 * Complete the remaining balance before releasing the order.
 */
export const completePayment = async ({ order_id, amount, payment_method }) => {
  const order = await getOrderById(order_id);

  if (!order) {
    throw new Error("Order not found.");
  }

  // Save payment record
  await createPayment({
    order_id,
    amount,
    payment_method,
  });

  // Retrieve all payment records
  const payments = await getPaymentsByOrderId(order_id);

  const totalPaid = payments.reduce(
    (sum, payment) => sum + Number(payment.amount),
    0,
  );

  const totalPrice = Number(order.total_price);

  const paymentStatus = totalPaid >= totalPrice ? "paid" : "partial";

  await updateOrderPayment(order_id, totalPaid, paymentStatus, payment_method);

  return {
    totalPaid,
    paymentStatus,
  };
};
