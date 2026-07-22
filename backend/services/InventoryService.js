import {
  insertInventoryItem,
  getInventoryItems,
  getInventoryItemById,
  getInventoryItemsByBranch,
  getInventoryCategoryByName,
  updateInventoryItem,
  deleteInventoryItem,
  insertInventoryRestock,
  getInventoryRestocks,
  updateInventoryStock,
  insertInventoryUsageLog,
  getInventoryUsageLogs,
} from "../models/InventoryModel.js";

// -------------------------------------
// Inventory Validation
// -------------------------------------

const validateInventoryItem = (item) => {
  if (!item.name || item.name.trim() === "") {
    throw new Error("Item name is required");
  }

  if (!item.branch || item.branch.trim() === "") {
    throw new Error("Branch is required");
  }

  if (!item.unit || item.unit.trim() === "") {
    throw new Error("Unit is required");
  }

  if (
    item.current_stock === "" ||
    item.current_stock === null ||
    item.current_stock === undefined
  ) {
    throw new Error("Current stock is required");
  }

  if (Number(item.current_stock) < 0) {
    throw new Error("Current stock cannot be negative");
  }

  if (
    item.minimum_stock !== "" &&
    item.minimum_stock !== null &&
    item.minimum_stock !== undefined &&
    Number(item.minimum_stock) < 0
  ) {
    throw new Error("Minimum stock cannot be negative");
  }

  if (
    item.cost_per_unit !== "" &&
    item.cost_per_unit !== null &&
    item.cost_per_unit !== undefined &&
    Number(item.cost_per_unit) < 0
  ) {
    throw new Error("Cost per unit cannot be negative");
  }

  if (
    item.usage_per_load !== "" &&
    item.usage_per_load !== null &&
    item.usage_per_load !== undefined &&
    Number(item.usage_per_load) < 0
  ) {
    throw new Error("Usage per load cannot be negative");
  }
};

const validateInventoryId = (id) => {
  if (!id) {
    throw new Error("Inventory ID is required");
  }
};

const toInventoryDatabasePayload = async (item) => {
  const { category, ...payload } = item;

  if (!category || String(category).trim() === "") {
    throw new Error("Category is required");
  }

  const categoryRecord = await getInventoryCategoryByName(
    String(category).trim(),
  );

  if (!categoryRecord) {
    throw new Error(`Inventory category "${category}" does not exist`);
  }

  return { ...payload, category_id: categoryRecord.id };
};

// -------------------------------------
// Restock Validation
// -------------------------------------

const validateInventoryRestock = (inventoryRestock) => {
  if (!inventoryRestock.item_id) {
    throw new Error("Inventory Item ID is required");
  }

  if (
    inventoryRestock.quantity_added === undefined ||
    inventoryRestock.quantity_added === null ||
    Number(inventoryRestock.quantity_added) <= 0
  ) {
    throw new Error("Restock quantity is required");
  }
};

// -------------------------------------
// Inventory CRUD
// -------------------------------------

export const createInventoryItem = async (item) => {
  validateInventoryItem(item);

  const payload = await toInventoryDatabasePayload(item);

  return insertInventoryItem(payload);
};

export const readInventoryItems = async () => {
  return getInventoryItems();
};

export const readInventoryItem = async (id) => {
  validateInventoryId(id);

  const inventoryItem = await getInventoryItemById(id);

  if (!inventoryItem) {
    throw new Error("Inventory item not found");
  }

  return inventoryItem;
};

export const readInventoryItemsByBranch = async (branch) => {
  if (!branch || String(branch).trim() === "") {
    throw new Error("Branch is required");
  }

  return getInventoryItemsByBranch(branch);
};

export const editInventoryItem = async (id, item) => {
  validateInventoryId(id);

  validateInventoryItem(item);

  const payload = await toInventoryDatabasePayload(item);

  const updatedItem = await updateInventoryItem(id, payload);

  if (!updatedItem) {
    throw new Error("Inventory item not found");
  }

  return updatedItem;
};

export const removeInventoryItem = async (id) => {
  validateInventoryId(id);

  const deletedItem = await deleteInventoryItem(id);

  if (!deletedItem) {
    throw new Error("Inventory item not found");
  }

  return "Inventory item deleted successfully";
};

// -------------------------------------
// Inventory Restock
// -------------------------------------

export const createInventoryRestock = async (inventoryRestock) => {
  validateInventoryRestock(inventoryRestock);

  const restock = await insertInventoryRestock(inventoryRestock);

  await updateInventoryStock(
    inventoryRestock.item_id,
    inventoryRestock.quantity_added,
  );

  return restock;
};

export const readInventoryRestocks = async () => {
  return getInventoryRestocks();
};

// -------------------------------------
// Inventory Usage
// -------------------------------------

export const createInventoryUsageLog = async (usageLog) => {
  if (!usageLog.item_id) {
    throw new Error("Inventory Item ID is required");
  }

  if (
    usageLog.quantity_used === undefined ||
    usageLog.quantity_used === null ||
    Number(usageLog.quantity_used) <= 0
  ) {
    throw new Error("Usage quantity must be greater than zero");
  }

  return insertInventoryUsageLog(usageLog);
};

export const readInventoryUsageLogs = async () => {
  return getInventoryUsageLogs();
};

// -------------------------------------
// Stock Monitoring
// -------------------------------------

export const checkStockStatus = async (itemId) => {
  validateInventoryId(itemId);

  const inventoryItem = await getInventoryItemById(itemId);

  if (!inventoryItem) {
    throw new Error("Inventory item not found");
  }

  if (Number(inventoryItem.current_stock) === 0) {
    return "Out of Stock";
  }

  if (
    Number(inventoryItem.current_stock) <= Number(inventoryItem.minimum_stock)
  ) {
    return "Low Stock";
  }

  return "In Stock";
};
