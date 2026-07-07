import {
  insertInventoryItem,
  getInventoryItems,
  updateInventoryItem,
  deleteInventoryItem,
} from "../models/InventoryModel.js";

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

// Create Inventory Item
export const createInventoryItem = (item) => {

  validateInventoryItem(item);

  insertInventoryItem(item);

  return "Inventory item created successfully";

};

// Read Inventory Items
export const readInventoryItems = () => {

  return getInventoryItems();

};

// Update Inventory Item
export const editInventoryItem = (id, item) => {

  validateInventoryId(id);

  validateInventoryItem(item);

  const updatedItem = updateInventoryItem(id, item);

  if (!updatedItem) {
    throw new Error("Inventory item not found");
  }

  return "Inventory item updated successfully";

};

// Delete Inventory Item
export const removeInventoryItem = (id) => {

  validateInventoryId(id);

  const deletedItem = deleteInventoryItem(id);

  if (!deletedItem) {
    throw new Error("Inventory item not found");
  }

  return "Inventory item deleted successfully";

};