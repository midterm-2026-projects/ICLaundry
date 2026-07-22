// backend/models/CustomerModel.js

import { supabase } from "../config/db.js";

/**
 * ==============================================
 * CUSTOMER MODEL
 * Handles all database operations for customers.
 * ==============================================
 */

/**
 * ==============================================
 * GET ALL CUSTOMERS
 * ==============================================
 */
export const getCustomers = async () => {
  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
};

/**
 * ==============================================
 * GET CUSTOMER BY PHONE
 * ==============================================
 */
export const getCustomerByPhone = async (phone) => {
  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .eq("phone", phone)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

/**
 * ==============================================
 * CREATE CUSTOMER
 * ==============================================
 */
export const insertCustomer = async (customer) => {
  const { data, error } = await supabase
    .from("customers")
    .insert({
      name: customer.name,
      phone: customer.phone,
      email: customer.email || null,
      address: customer.address || null,
      notes: customer.notes || null,
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

/**
 * ==============================================
 * UPDATE CUSTOMER
 * ==============================================
 */
export const updateCustomer = async (id, customer) => {
  const { data, error } = await supabase
    .from("customers")
    .update({
      name: customer.name,
      phone: customer.phone,
      email: customer.email || null,
      address: customer.address || null,
      notes: customer.notes || null,
    })
    .eq("id", id)
    .select()
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

/**
 * ==============================================
 * DELETE CUSTOMER
 * ==============================================
 */
export const deleteCustomer = async (id) => {
  const { data, error } = await supabase
    .from("customers")
    .delete()
    .eq("id", id)
    .select();

  if (error) {
    throw new Error(error.message);
  }

  return data.length > 0;
};
