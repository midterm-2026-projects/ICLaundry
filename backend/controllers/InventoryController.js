// backend/controllers/InventoryController.js

import {
  createInventoryItem,
  readInventoryItems,
  readInventoryItem,
  readInventoryItemsByBranch,
  editInventoryItem,
  removeInventoryItem,
  createInventoryRestock,
  readInventoryRestocks,
  createInventoryUsageLog,
  readInventoryUsageLogs,
  checkStockStatus,
} from "../services/InventoryService.js";

/**
 * =====================================================
 * INVENTORY CONTROLLER
 * Handles HTTP requests for Inventory Module.
 * =====================================================
 */

/**
 * ==============================================
 * GET ALL INVENTORY ITEMS
 * ==============================================
 */
export const getInventory = async (req, res) => {
  try {
    const inventory = await readInventoryItems();

    return res.status(200).json(inventory);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

/**
 * ==============================================
 * GET INVENTORY ITEM BY ID
 * ==============================================
 */
export const getInventoryById = async (req, res) => {
  try {
    const inventory = await readInventoryItem(req.params.id);

    return res.status(200).json(inventory);
  } catch (error) {
    return res.status(404).json({
      message: error.message,
    });
  }
};

/**
 * ==============================================
 * GET INVENTORY ITEMS BY BRANCH
 * ==============================================
 */
export const getInventoryByBranch = async (req, res) => {
  try {
    const inventory = await readInventoryItemsByBranch(req.params.branch);

    return res.status(200).json(inventory);
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

/**
 * ==============================================
 * CREATE INVENTORY ITEM
 * ==============================================
 */
export const addInventory = async (req, res) => {
  try {
    const inventory = await createInventoryItem(req.body);

    return res.status(201).json({
      message: "Inventory item created successfully.",
      data: inventory,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

/**
 * ==============================================
 * UPDATE INVENTORY ITEM
 * ==============================================
 */
export const updateInventory = async (req, res) => {
  try {
    const inventory = await editInventoryItem(req.params.id, req.body);

    return res.status(200).json({
      message: "Inventory item updated successfully.",
      data: inventory,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

/**
 * ==============================================
 * DELETE INVENTORY ITEM
 * ==============================================
 */
export const deleteInventory = async (req, res) => {
  try {
    const message = await removeInventoryItem(req.params.id);

    return res.status(200).json({
      message,
    });
  } catch (error) {
    return res.status(404).json({
      message: error.message,
    });
  }
};

/**
 * ==============================================
 * CREATE INVENTORY RESTOCK
 * ==============================================
 */
export const addInventoryRestock = async (req, res) => {
  try {
    const restock = await createInventoryRestock(req.body);

    return res.status(201).json({
      message: "Inventory restocked successfully.",
      data: restock,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

/**
 * ==============================================
 * GET INVENTORY RESTOCKS
 * ==============================================
 */
export const getInventoryRestocksController = async (req, res) => {
  try {
    const restocks = await readInventoryRestocks();

    return res.status(200).json(restocks);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

/**
 * ==============================================
 * CREATE INVENTORY USAGE LOG
 * ==============================================
 */
export const addInventoryUsageLog = async (req, res) => {
  try {
    const usage = await createInventoryUsageLog(req.body);

    return res.status(201).json({
      message: "Inventory usage recorded successfully.",
      data: usage,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

/**
 * ==============================================
 * GET INVENTORY USAGE LOGS
 * ==============================================
 */
export const getInventoryUsageLogsController = async (req, res) => {
  try {
    const usageLogs = await readInventoryUsageLogs();

    return res.status(200).json(usageLogs);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

/**
 * ==============================================
 * GET INVENTORY STOCK STATUS
 * ==============================================
 */
export const getInventoryStockStatus = async (req, res) => {
  try {
    const status = await checkStockStatus(req.params.id);

    return res.status(200).json({
      status,
    });
  } catch (error) {
    return res.status(404).json({
      message: error.message,
    });
  }
};

export default {
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
};
