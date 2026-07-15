// backend/services/StaffService.js

import {
  getStaff,
  getStaffById,
  getStaffByEmail,
  createStaff,
  updateStaff,
  deleteStaff,
  getStaffByRole,
  getStaffByBranch,
} from "../models/StaffModel.js";

import { getBranchById } from "../models/BranchModel.js";

/**
 * =====================================================
 * STAFF SERVICE
 * Handles staff business logic and validation.
 * =====================================================
 */

/**
 * ==============================================
 * GET ALL STAFF
 * ==============================================
 */
export const readStaff = async () => {
  return await getStaff();
};

/**
 * ==============================================
 * GET STAFF BY ID
 * ==============================================
 */
export const readStaffById = async (id) => {
  if (!id) {
    throw new Error("Staff ID is required");
  }

  const staff = await getStaffById(id);

  if (!staff) {
    throw new Error("Staff not found");
  }

  return staff;
};

/**
 * ==============================================
 * CREATE STAFF
 * ==============================================
 */
export const addStaff = async (data) => {
  const { full_name, email, phone, role, position, branch_id } = data;

  if (!full_name || full_name.trim() === "") {
    throw new Error("Full name is required");
  }

  if (!email || !email.includes("@")) {
    throw new Error("Invalid email address");
  }

  const allowedRoles = ["admin", "staff"];

  if (!allowedRoles.includes(role)) {
    throw new Error("Role must be one of: admin, staff");
  }

  const existingStaff = await getStaffByEmail(email);

  if (existingStaff) {
    throw new Error("Email already exists");
  }

  if (branch_id) {
    const branch = await getBranchById(branch_id);

    if (!branch) {
      throw new Error("Branch not found");
    }
  }

  return await createStaff({
    full_name,

    email,

    phone,

    role,

    position,

    branch_id,
  });
};

/**
 * ==============================================
 * UPDATE STAFF
 * ==============================================
 */
export const editStaff = async (id, data) => {
  if (!id) {
    throw new Error("Staff ID is required");
  }

  if (!data || Object.keys(data).length === 0) {
    throw new Error("Update data is required");
  }

  const staff = await getStaffById(id);

  if (!staff) {
    throw new Error("Staff not found");
  }

  if (data.email) {
    const existing = await getStaffByEmail(data.email);

    if (existing && existing.id !== id) {
      throw new Error("Email already exists");
    }
  }

  if (data.branch_id) {
    const branch = await getBranchById(data.branch_id);

    if (!branch) {
      throw new Error("Branch not found");
    }
  }

  return await updateStaff(id, data);
};

/**
 * ==============================================
 * DELETE STAFF
 * ==============================================
 */
export const removeStaff = async (id) => {
  if (!id) {
    throw new Error("Staff ID is required");
  }

  const staff = await getStaffById(id);

  if (!staff) {
    throw new Error("Staff not found");
  }

  await deleteStaff(id);

  return "Staff deleted successfully";
};

/**
 * ==============================================
 * GET STAFF BY ROLE
 * ==============================================
 */
export const readStaffByRole = async (role) => {
  const allowedRoles = ["admin", "staff"];

  if (!allowedRoles.includes(role)) {
    throw new Error("Invalid staff role");
  }

  return await getStaffByRole(role);
};

/**
 * ==============================================
 * GET STAFF BY BRANCH
 * ==============================================
 */
export const readStaffByBranch = async (branch_id) => {
  if (!branch_id) {
    throw new Error("Branch ID is required");
  }

  const branch = await getBranchById(branch_id);

  if (!branch) {
    throw new Error("Branch not found");
  }

  return await getStaffByBranch(branch_id);
};
