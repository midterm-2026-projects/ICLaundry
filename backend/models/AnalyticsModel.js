import { supabase } from "../config/db.js";

/**
 * ==============================================
 * ANALYTICS MODEL
 * Handles database retrieval only.
 * ==============================================
 */

/**
 * Retrieve transaction records.
 */
export const getTransactions = async () => {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", {
      ascending: true,
    });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
};

/**
 * Retrieve payment records.
 */
export const getPayments = async () => {
  const { data, error } = await supabase
    .from("payments")
    .select("*")
    .order("payment_date", {
      ascending: true,
    });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
};

/**
 * Retrieve expense records.
 *
 * Temporary implementation:
 * The project currently has no expenses/inventory table.
 * Reuse payment records until an Expense module
 * is implemented in a future sprint.
 */
export const getExpenses = async () => {
  const { data, error } = await supabase
    .from("payments")
    .select("*")
    .order("payment_date", {
      ascending: true,
    });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
};

export default {
  getTransactions,
  getPayments,
  getExpenses,
};
