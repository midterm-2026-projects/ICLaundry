// backend/models/StaffModel.js

import { supabase } from "../config/db.js";

/**
 * ==============================================
 * STAFF MODEL
 * Handles all database operations for staff.
 * ==============================================
 */

/**
 * Get all staff
 */
export const getStaff = async () => {
  const { data, error } = await supabase
    .from("staff")
    .select("*")
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

/**
 * Get staff by ID
 */
export const getStaffById = async (id) => {
  const { data, error } = await supabase
    .from("staff")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

/**
 * Get staff by email
 */
export const getStaffByEmail = async (email) => {
  const { data, error } = await supabase
    .from("staff")
    .select("*")
    .eq("email", email)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

/**
 * Create a new staff member
 */
export const createStaff = async (staffData) => {
  const { data, error } = await supabase
    .from("staff")
    .insert(staffData)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

/**
 * Update staff information
 */
export const updateStaff = async (id, updates) => {
  const { data, error } = await supabase
    .from("staff")
    .update(updates)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

/**
 * Delete a staff member
 */
export const deleteStaff = async (id) => {
  const { error } = await supabase.from("staff").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  return true;
};

/**
 * Get staff by branch
 */
export const getStaffByBranch = async (branchId) => {
  const { data, error } = await supabase
    .from("staff")
    .select("*")
    .eq("branch_id", branchId)
    .order("full_name", {
      ascending: true,
    });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

/**
 * Get staff by role
 */
export const getStaffByRole = async (role) => {
  const { data, error } = await supabase
    .from("staff")
    .select("*")
    .eq("role", role)
    .order("full_name", {
      ascending: true,
    });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export default {
  getStaff,

  getStaffById,

  getStaffByEmail,

  createStaff,

  updateStaff,

  deleteStaff,

  getStaffByBranch,

  getStaffByRole,
};
