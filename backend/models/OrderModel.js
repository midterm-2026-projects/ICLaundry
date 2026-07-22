// backend/models/OrderModel.js

import { supabase } from "../config/db.js";

/**
 * ==============================================
 * ORDER MODEL
 * Handles database operations only.
 * ==============================================
 */

/**
 * GET ALL ORDERS
 */
export const getOrders = async () => {
  const { data, error } = await supabase

    .from("orders")

    .select(
      `
      *,
      customers (
        id,
        name,
        phone,
        email
      )
      `,
    )

    .order("created_at", {
      ascending: false,
    });

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
};

/**
 * GET ORDER BY ID
 */
export const getOrderById = async (id) => {
  const { data, error } = await supabase

    .from("orders")

    .select(
      `
      *,
      customers (
        id,
        name,
        phone,
        email
      )
      `,
    )

    .eq("id", id)

    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

/**
 * CREATE ORDER
 */
export const createOrder = async (orderData) => {
  const { data, error } = await supabase

    .from("orders")

    .insert(orderData)

    .select(
      `
      *,
      customers (
        id,
        name,
        phone,
        email
      )
      `,
    )

    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

/**
 * UPDATE ORDER
 */
export const updateOrder = async (id, updates) => {
  const { data, error } = await supabase

    .from("orders")

    .update(updates)

    .eq("id", id)

    .select(
      `
      *,
      customers (
        id,
        name,
        phone,
        email
      )
      `,
    )

    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

/**
 * UPDATE ORDER STATUS
 */
export const updateOrderStatus = async (id, status) => {
  return await updateOrder(id, {
    status,
  });
};

/**
 * UPDATE PAYMENT INFORMATION
 */
/**
 * UPDATE PAYMENT INFORMATION
 */
export const updateOrderPayment = async (
  id,
  amountPaid,
  paymentStatus,
  paymentMethod = null,
) => {
  return await updateOrder(
    id,

    {
      amount_paid: Number(amountPaid || 0),

      payment_status: paymentStatus,

      payment_method: paymentMethod,
    },
  );
};

/**
 * DELETE ORDER
 */
export const deleteOrder = async (id) => {
  const { error } = await supabase

    .from("orders")

    .delete()

    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  return true;
};
