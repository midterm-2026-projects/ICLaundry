// backend/routes/InventoryRoutes.js

import express from "express";

import {
  getInventory,
  getInventoryById,
  getInventoryByBranch,
  addInventory,
  updateInventory,
  deleteInventory,
  addInventoryRestock,
  getInventoryRestocksController,
  addInventoryUsageLog,
  getInventoryUsageLogsController,
  getInventoryStockStatus,
} from "../controllers/InventoryController.js";

const router = express.Router();

/**
 * =====================================================
 * INVENTORY ITEM ROUTES
 * =====================================================
 */

/**
 * GET /api/inventory
 * Get all inventory items
 */
router.get("/", getInventory);

/**
 * GET /api/inventory/:id
 * Get inventory item by ID
 */
router.get("/:id", getInventoryById);

/**
 * GET /api/inventory/branch/:branch
 * Get inventory items by branch
 */
router.get("/branch/:branch", getInventoryByBranch);

/**
 * POST /api/inventory
 * Create inventory item
 */
router.post("/", addInventory);

/**
 * PUT /api/inventory/:id
 * Update inventory item
 */
router.put("/:id", updateInventory);

/**
 * DELETE /api/inventory/:id
 * Delete inventory item
 */
router.delete("/:id", deleteInventory);

/**
 * =====================================================
 * INVENTORY RESTOCK ROUTES
 * =====================================================
 */

/**
 * GET /api/inventory/restocks
 * Get all inventory restocks
 */
router.get("/restocks/all", getInventoryRestocksController);

/**
 * POST /api/inventory/restocks
 * Create inventory restock
 */
router.post("/restocks", addInventoryRestock);

/**
 * =====================================================
 * INVENTORY USAGE LOG ROUTES
 * =====================================================
 */

/**
 * GET /api/inventory/usage
 * Get inventory usage logs
 */
router.get("/usage/all", getInventoryUsageLogsController);

/**
 * POST /api/inventory/usage
 * Record inventory usage
 */
router.post("/usage", addInventoryUsageLog);

/**
 * =====================================================
 * STOCK STATUS
 * =====================================================
 */

/**
 * GET /api/inventory/status/:id
 * Get inventory stock status
 */
router.get("/status/:id", getInventoryStockStatus);

export default router;
