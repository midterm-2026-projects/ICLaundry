import express from "express";

import {
  getOrdersController,
  getOrderByIdController,
  updateOrderController,
  updateOrderStatusController,
} from "../controllers/OrderController.js";

const router = express.Router();

/**
 * GET /api/orders
 */
router.get("/", getOrdersController);

/**
 * GET /api/orders/:id
 */
router.get("/:id", getOrderByIdController);

/**
 * PATCH /api/orders/:id
 */
router.patch("/:id", updateOrderController);

/**
 * Update Order Status
 */
router.patch("/:id/status", updateOrderStatusController);

export default router;
