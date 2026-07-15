// backend/models/BranchModel.js

import { supabase } from "../config/db.js";

/**
 * ==============================================
 * BRANCH MODEL
 * Handles all database operations for branches.
 * ==============================================
 */

/**
 * Get all branches
 */
export const getBranches = async () => {
  const { data, error } = await supabase
    .from("branches")
    .select("*")
    .order("branch_name", {
      ascending: true,
    });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

/**
 * Get branch by ID
 */
export const getBranchById = async (id) => {
  const { data, error } = await supabase
    .from("branches")
    .select("*")
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  if (!data || data.length === 0) {
    return null;
  }

  return data[0];
};

/**
 * Get branch by name
 */
export const getBranchByName = async (branchName) => {
  const { data, error } = await supabase
    .from("branches")
    .select("*")
    .eq("branch_name", branchName);

  if (error) {
    throw new Error(error.message);
  }

  if (!data || data.length === 0) {
    return null;
  }

  return data[0];
};

/**
 * Create a new branch
 */
export const createBranch = async (branchData) => {
  const { data, error } = await supabase
    .from("branches")
    .insert(branchData)
    .select();

  if (error) {
    throw new Error(error.message);
  }

  return data[0];
};

/**
 * Update an existing branch
 */
export const updateBranch = async (id, updates) => {
  const { data, error } = await supabase
    .from("branches")
    .update(updates)
    .eq("id", id)
    .select();

  if (error) {
    throw new Error(error.message);
  }

  if (!data || data.length === 0) {
    return null;
  }

  return data[0];
};

/**
 * Delete a branch
 */
export const deleteBranch = async (id) => {
  const { error } = await supabase.from("branches").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  return true;
};

export default {
  getBranches,

  getBranchById,

  getBranchByName,

  createBranch,

  updateBranch,

  deleteBranch,
};
