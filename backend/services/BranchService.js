// backend/services/BranchService.js

import {
  getBranches,
  getBranchById,
  getBranchByName,
  createBranch,
  updateBranch,
  deleteBranch,
} from "../models/BranchModel.js";

/**
 * =====================================================
 * BRANCH SERVICE
 * Handles branch business logic and validation.
 * =====================================================
 */

/**
 * ==============================================
 * GET ALL BRANCHES
 * ==============================================
 */
export const readBranches = async () => {
  return await getBranches();
};

/**
 * ==============================================
 * GET BRANCH BY ID
 * ==============================================
 */
export const readBranch = async (id) => {
  if (!id) {
    throw new Error("Branch ID is required");
  }

  const branch = await getBranchById(id);

  if (!branch) {
    throw new Error("Branch not found");
  }

  return branch;
};

/**
 * ==============================================
 * CREATE BRANCH
 * ==============================================
 */
export const addBranch = async (data) => {
  const { branch_name, address, status } = data;

  if (!branch_name || branch_name.trim() === "") {
    throw new Error("Branch name is required");
  }

  const allowedStatus = ["active", "inactive"];

  if (status && !allowedStatus.includes(status)) {
    throw new Error("Invalid branch status");
  }

  const existingBranch = await getBranchByName(branch_name);

  if (existingBranch) {
    throw new Error("Branch already exists");
  }

  return await createBranch({
    branch_name,

    address,

    status: status || "active",
  });
};

/**
 * ==============================================
 * UPDATE BRANCH
 * ==============================================
 */
export const editBranch = async (id, data) => {
  if (!id) {
    throw new Error("Branch ID is required");
  }

  if (!data || Object.keys(data).length === 0) {
    throw new Error("Update data is required");
  }

  const branch = await getBranchById(id);

  if (!branch) {
    throw new Error("Branch not found");
  }

  if (data.status) {
    const allowedStatus = ["active", "inactive"];

    if (!allowedStatus.includes(data.status)) {
      throw new Error("Invalid branch status");
    }
  }

  if (data.branch_name) {
    const duplicate = await getBranchByName(data.branch_name);

    if (duplicate && duplicate.id !== id) {
      throw new Error("Branch already exists");
    }
  }

  return await updateBranch(id, data);
};

/**
 * ==============================================
 * DELETE BRANCH
 * ==============================================
 */
export const removeBranch = async (id) => {
  if (!id) {
    throw new Error("Branch ID is required");
  }

  const branch = await getBranchById(id);

  if (!branch) {
    throw new Error("Branch not found");
  }

  await deleteBranch(id);

  return "Branch deleted successfully";
};
