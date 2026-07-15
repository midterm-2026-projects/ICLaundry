// backend/routes/BranchRoutes.js

import express from "express";

import {
  getBranchesController,
  getBranchByIdController,
  createBranchController,
  updateBranchController,
  deleteBranchController,
} from "../controllers/BranchController.js";

const router = express.Router();

/**
 * ==============================================
 * BRANCH ROUTES
 * ==============================================
 */

/**
 * GET /api/branches
 */
router.get("/", getBranchesController);

/**
 * GET /api/branches/:id
 */
router.get("/:id", getBranchByIdController);

/**
 * POST /api/branches
 */
router.post("/", createBranchController);

/**
 * PUT /api/branches/:id
 */
router.put("/:id", updateBranchController);

/**
 * DELETE /api/branches/:id
 */
router.delete("/:id", deleteBranchController);

export default router;
