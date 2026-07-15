// backend/models/OrderModel.js

import { supabase } from "../config/db.js";

/**
 * ==============================================
 * ORDER MODEL
 * Handles all database operations for orders.
 * ==============================================
 */

/**
 * Get all orders
 */
export const getOrders = async () => {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return data;
};

/**
 * Get order by ID
 */
export const getOrderById = async (id) => {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);

  return data;
};

/**
 * Get order by Order Number
 */
export const getOrderByNumber = async (orderNumber) => {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("order_number", orderNumber)
    .single();

  if (error) throw new Error(error.message);

  return data;
};

/**
 * Get orders by status
 */
export const getOrdersByStatus = async (status) => {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("status", status)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return data;
};

/**
 * Create a new order
 */
export const createOrder = async (orderData) => {
  const { data, error } = await supabase
    .from("orders")
    .insert(orderData)
    .select()
    .single();

  if (error) throw new Error(error.message);

  return data;
};

/**
 * Update an order
 */
export const updateOrder = async (id, updates) => {
  const { data, error } = await supabase
    .from("orders")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);

  return data;
};

/**
 * Update only the order status
 */
export const updateOrderStatus = async (id, status) => {
  return updateOrder(id, { status });
};

/**
 * Update payment information of an order
 */
export const updateOrderPayment = async (
  id,
  amountPaid,
  paymentStatus,
  paymentMethod = null,
) => {
  const updates = {
    amount_paid: amountPaid,
    payment_status: paymentStatus,
  };

  if (paymentMethod) {
    updates.payment_method = paymentMethod;
  }

  return updateOrder(id, updates);
};

/**
 * Delete an order
 */
export const deleteOrder = async (id) => {
  const { error } = await supabase.from("orders").delete().eq("id", id);

  if (error) throw new Error(error.message);

  return true;
};

/**
 * ==============================================
 * RECENT ORDER MODEL
 * Used by the Recent Orders module.
 * ==============================================
 */
export class RecentOrder {
  constructor(data) {
    this.orderId = data.orderId;
    this.customer = data.customer;
    this.status = data.status;
    this.waitingTime = data.waitingTime || null;
    this.amount = data.amount;
    this.createdAt = data.createdAt || new Date();
  }

  /**
   * Validate required fields
   */
  validate() {
    const validStatuses = [
      "Pending",
      "Washing",
      "Drying",
      "Folding",
      "Ready",
      "Released",
      "Cancelled",
    ];

    if (!this.orderId) {
      throw new Error("Order ID is required");
    }

    if (!this.customer) {
      throw new Error("Customer name is required");
    }

    if (!validStatuses.includes(this.status)) {
      throw new Error(`Status must be one of: ${validStatuses.join(", ")}`);
    }

    if (!this.amount) {
      throw new Error("Order amount is required");
    }

    return true;
  }
}

export default RecentOrder;
