// backend/models/PaymentModel.js

import { supabase } from "../config/db.js";

/**
 * ==============================================
 * PAYMENT MODEL
 * Handles all database operations for payments.
 * ==============================================
 */

/**
 * Get all payments
 */
export const getPayments = async () => {
  const { data, error } = await supabase
    .from("payments")
    .select("*")
    .order("payment_date", { ascending: false });

  if (error) throw new Error(error.message);

  return data;
};

/**
 * Get payment by ID
 */
export const getPaymentById = async (id) => {
  const { data, error } = await supabase
    .from("payments")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);

  return data;
};

/**
 * Get all payments for a specific order
 */
export const getPaymentsByOrderId = async (orderId) => {
  const { data, error } = await supabase
    .from("payments")
    .select("*")
    .eq("order_id", orderId)
    .order("payment_date", { ascending: true });

  if (error) throw new Error(error.message);

  return data;
};

/**
 * Create a new payment
 */
export const createPayment = async (paymentData) => {
  const { data, error } = await supabase

    .from("payments")

    .insert(paymentData)

    .select();

  if (error) {
    throw new Error(error.message);
  }

  return data?.[0];
};

/**
 * Update payment
 */
export const updatePayment = async (id, updates) => {
  const { data, error } = await supabase
    .from("payments")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);

  return data;
};

/**
 * Delete payment
 */
export const deletePayment = async (id) => {
  const { error } = await supabase.from("payments").delete().eq("id", id);

  if (error) throw new Error(error.message);

  return true;
};
