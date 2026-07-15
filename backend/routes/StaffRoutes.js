// backend/routes/StaffRoutes.js

import express from "express";

import {
  getStaffController,
  getStaffByIdController,
  createStaffController,
  updateStaffController,
  deleteStaffController,
  getStaffByRoleController,
  getStaffByBranchController,
} from "../controllers/StaffController.js";

const router = express.Router();

/**
 * ==============================================
 * STAFF ROUTES
 * ==============================================
 */

/**
 * GET /api/staff
 */
router.get("/", getStaffController);

/**
 * GET /api/staff/role/:role
 */
router.get("/role/:role", getStaffByRoleController);

/**
 * GET /api/staff/branch/:branchId
 */
router.get("/branch/:branchId", getStaffByBranchController);

/**
 * GET /api/staff/:id
 */
router.get("/:id", getStaffByIdController);

/**
 * POST /api/staff
 */
router.post("/", createStaffController);

/**
 * PUT /api/staff/:id
 */
router.put("/:id", updateStaffController);

/**
 * DELETE /api/staff/:id
 */
router.delete("/:id", deleteStaffController);

export default router;
