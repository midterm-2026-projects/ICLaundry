// backend/controllers/BranchController.js

import {
  readBranches,
  readBranch,
  addBranch,
  editBranch,
  removeBranch,
} from "../services/BranchService.js";

/**
 * ==============================================
 * BRANCH CONTROLLER
 * ==============================================
 */

/**
 * Get all branches
 */
export const getBranchesController = async (req, res) => {
  try {
    const branches = await readBranches();

    return res.status(200).json({
      success: true,
      data: branches,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get branch by ID
 */
export const getBranchByIdController = async (req, res) => {
  try {
    const branch = await readBranch(req.params.id);

    return res.status(200).json({
      success: true,
      data: branch,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Create branch
 */
export const createBranchController = async (req, res) => {
  try {
    const branch = await addBranch(req.body);

    return res.status(201).json({
      success: true,
      message: "Branch created successfully",
      data: branch,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Update branch
 */
export const updateBranchController = async (req, res) => {
  try {
    const branch = await editBranch(req.params.id, req.body);

    return res.status(200).json({
      success: true,
      message: "Branch updated successfully",
      data: branch,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Delete branch
 */
export const deleteBranchController = async (req, res) => {
  try {
    const message = await removeBranch(req.params.id);

    return res.status(200).json({
      success: true,
      message,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
