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
  const { full_name, email, phone, role, position, branch_id } = data || {};

  if (!full_name || full_name.trim() === "") {
    throw new Error("Full name is required");
  }

  const normalizedEmail = String(email || "").trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    throw new Error("Invalid email address");
  }

  const allowedRoles = ["admin", "staff"];

  if (!allowedRoles.includes(role)) {
    throw new Error("Role must be one of: admin, staff");
  }

  const existingStaff = await getStaffByEmail(normalizedEmail);

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
    full_name: full_name.trim(),

    email: normalizedEmail,

    phone: String(phone || "").trim() || null,

    role,

    position: String(position || "").trim() || null,

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

  const updates = { ...data };
  if (Object.hasOwn(updates, "full_name")) {
    updates.full_name = String(updates.full_name || "").trim();
    if (!updates.full_name) throw new Error("Full name is required");
  }
  if (Object.hasOwn(updates, "role") && !["admin", "staff"].includes(updates.role)) {
    throw new Error("Role must be one of: admin, staff");
  }
  if (Object.hasOwn(updates, "email")) {
    updates.email = String(updates.email || "").trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(updates.email)) throw new Error("Invalid email address");
    const existing = await getStaffByEmail(updates.email);

    if (existing && existing.id !== id) {
      throw new Error("Email already exists");
    }
  }

  if (updates.branch_id) {
    const branch = await getBranchById(updates.branch_id);

    if (!branch) {
      throw new Error("Branch not found");
    }
  }

  if (Object.hasOwn(updates, "phone")) updates.phone = String(updates.phone || "").trim() || null;
  if (Object.hasOwn(updates, "position")) updates.position = String(updates.position || "").trim() || null;
  if (updates.branch_id === "") updates.branch_id = null;
  return await updateStaff(id, updates);
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
