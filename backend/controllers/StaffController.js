// backend/controllers/StaffController.js

import {
  readStaff,
  readStaffById,
  addStaff,
  editStaff,
  removeStaff,
  readStaffByRole,
  readStaffByBranch,
} from "../services/StaffService.js";

/**
 * ==============================================
 * STAFF CONTROLLER
 * ==============================================
 */

/**
 * Get all staff
 */
export const getStaffController = async (req, res) => {
  try {
    const staff = await readStaff();

    return res.status(200).json({
      success: true,
      data: staff,
    });
  } catch (error) {
    console.error("\n========== GET STAFF ERROR ==========");
    console.error(error);
    console.error("=====================================\n");

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get staff by ID
 */
export const getStaffByIdController = async (req, res) => {
  try {
    console.log("\n========== GET STAFF BY ID ==========");
    console.log("Requested ID:", req.params.id);

    const staff = await readStaffById(req.params.id);

    console.log("Returned Staff:", staff);
    console.log("=====================================\n");

    return res.status(200).json({
      success: true,
      data: staff,
    });
  } catch (error) {
    console.error("\n========== GET STAFF BY ID ERROR ==========");
    console.error(error);
    console.error("Message:", error.message);
    console.error("===========================================\n");

    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Create staff
 */
export const createStaffController = async (req, res) => {
  try {
    console.log("\n========== CREATE STAFF ==========");
    console.log("Payload:");
    console.log(req.body);

    const staff = await addStaff(req.body);

    console.log("Created Staff:");
    console.log(staff);
    console.log("==================================\n");

    return res.status(201).json({
      success: true,
      message: "Staff created successfully",
      data: staff,
    });
  } catch (error) {
    console.error("\n========== CREATE STAFF ERROR ==========");
    console.error(error);
    console.error("Message:", error.message);
    console.error("Payload:", req.body);
    console.error("========================================\n");

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Update staff
 */
export const updateStaffController = async (req, res) => {
  try {
    const staff = await editStaff(req.params.id, req.body);

    return res.status(200).json({
      success: true,
      message: "Staff updated successfully",
      data: staff,
    });
  } catch (error) {
    console.error("\n========== UPDATE STAFF ERROR ==========");
    console.error(error);
    console.error("========================================\n");

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Delete staff
 */
export const deleteStaffController = async (req, res) => {
  try {
    const message = await removeStaff(req.params.id);

    return res.status(200).json({
      success: true,
      message,
    });
  } catch (error) {
    console.error("\n========== DELETE STAFF ERROR ==========");
    console.error(error);
    console.error("========================================\n");

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get staff by role
 */
export const getStaffByRoleController = async (req, res) => {
  try {
    const staff = await readStaffByRole(req.params.role);

    return res.status(200).json({
      success: true,
      data: staff,
    });
  } catch (error) {
    console.error("\n========== GET STAFF BY ROLE ERROR ==========");
    console.error(error);
    console.error("=============================================\n");

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get staff by branch
 */
export const getStaffByBranchController = async (req, res) => {
  try {
    const staff = await readStaffByBranch(req.params.branchId);

    return res.status(200).json({
      success: true,
      data: staff,
    });
  } catch (error) {
    console.error("\n========== GET STAFF BY BRANCH ERROR ==========");
    console.error(error);
    console.error("================================================\n");

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
