// backend/routes/OrderRoutes.js

import express from "express";

import {
  createOrderController,
  getOrdersController,
  getOrderByIdController,
  updateOrderController,
  deleteOrderController,
  updateOrderStatusController,
} from "../controllers/OrderController.js";

const router = express.Router();

/**
 * GET ALL ORDERS
 * GET /api/orders
 */
router.get("/", getOrdersController);

/**
 * CREATE ORDER
 * POST /api/orders
 */
/**
 * CREATE ORDER
 * POST /api/orders
 */
router.post("/", createOrderController);

/**
 * GET ORDER BY ID
 * GET /api/orders/:id
 */
router.get("/:id", getOrderByIdController);

/**
 * UPDATE ORDER
 * PATCH /api/orders/:id
 */
router.patch("/:id", updateOrderController);

/**
 * DELETE ORDER
 * DELETE /api/orders/:id
 */
router.delete("/:id", deleteOrderController);

/**
 * UPDATE STATUS
 * PATCH /api/orders/:id/status
 */
router.patch("/:id/status", updateOrderStatusController);

export default router;
