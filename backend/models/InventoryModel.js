// backend/models/InventoryModel.js

import { supabase } from "../config/db.js";

const INVENTORY_SELECT = "*, inventory_categories(name)";

const includeCategoryName = (item) => {
  if (!item) return item;

  const { inventory_categories: category, ...inventoryItem } = item;

  return { ...inventoryItem, category: category?.name ?? "" };
};

/**
 * ==============================================
 * INVENTORY ITEM MODEL
 * Handles all database operations for inventory items.
 * ==============================================
 */

/**
 * Get all inventory items
 */
export const getInventoryItems = async () => {
  const { data, error } = await supabase
    .from("inventory_items")
    .select(INVENTORY_SELECT)
    .order("name", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data.map(includeCategoryName);
};

/**
 * Get inventory item by ID
 */
export const getInventoryItemById = async (id) => {
  const { data, error } = await supabase
    .from("inventory_items")
    .select(INVENTORY_SELECT)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return includeCategoryName(data);
};

/**
 * Get inventory item by name
 */
export const getInventoryItemByName = async (name) => {
  const { data, error } = await supabase
    .from("inventory_items")
    .select("*")
    .eq("name", name)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const getInventoryCategoryByName = async (name) => {
  const { data, error } = await supabase
    .from("inventory_categories")
    .select("id, name")
    .ilike("name", name)
    .maybeSingle();

  if (error) throw new Error(error.message);

  return data;
};

/**
 * Get inventory items by branch
 */
export const getInventoryItemsByBranch = async (branch) => {
  const { data, error } = await supabase
    .from("inventory_items")
    .select(INVENTORY_SELECT)
    .eq("branch", branch)
    .order("name", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data.map(includeCategoryName);
};

/**
 * Create inventory item
 */
export const insertInventoryItem = async (item) => {
  const { data, error } = await supabase
    .from("inventory_items")
    .insert(item)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

/**
 * Update inventory item
 */
export const updateInventoryItem = async (id, updates) => {
  const { data, error } = await supabase
    .from("inventory_items")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

/**
 * Delete inventory item
 */
export const deleteInventoryItem = async (id) => {
  const { error } = await supabase
    .from("inventory_items")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  return true;
};

/**
 * ==============================================
 * INVENTORY RESTOCK MODEL
 * ==============================================
 */

/**
 * Get all inventory restocks
 */
export const getInventoryRestocks = async () => {
  const { data, error } = await supabase
    .from("inventory_restocks")
    .select(
      `
      *,
      inventory_items (
        id,
        name,
        unit,
        branch,
        cost_per_unit
      )
    `,
    )
    .order("restocked_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

/**
 * Get restocks by inventory item
 */
export const getInventoryRestocksByItem = async (itemId) => {
  const { data, error } = await supabase
    .from("inventory_restocks")
    .select("*")
    .eq("item_id", itemId)
    .order("restocked_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

/**
 * Insert inventory restock
 */
export const insertInventoryRestock = async (inventoryRestock) => {
  const restockRecord = {
    item_id: inventoryRestock.item_id,
    quantity_added: inventoryRestock.quantity_added,
  };

  const { data, error } = await supabase
    .from("inventory_restocks")
    .insert(restockRecord)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

/**
 * Increase inventory stock
 */
export const updateInventoryStock = async (itemId, quantityAdded) => {
  const item = await getInventoryItemById(itemId);

  if (!item) {
    throw new Error("Inventory item not found.");
  }

  const newStock = Number(item.current_stock) + Number(quantityAdded);

  const { data, error } = await supabase
    .from("inventory_items")
    .update({
      current_stock: newStock,
    })
    .eq("id", itemId)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

/**
 * ==============================================
 * INVENTORY USAGE LOG MODEL
 * ==============================================
 */

/**
 * Get all usage logs
 */
export const getInventoryUsageLogs = async () => {
  const { data, error } = await supabase
    .from("inventory_usage_log")
    .select(
      `
      *,
      inventory_items (
        id,
        name,
        unit,
        branch
      ),
      orders (
        id,
        order_number
      )
    `,
    )
    .order("logged_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

/**
 * Get usage logs by inventory item
 */
export const getInventoryUsageLogsByItem = async (itemId) => {
  const { data, error } = await supabase
    .from("inventory_usage_log")
    .select("*")
    .eq("item_id", itemId)
    .order("logged_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

/**
 * Get usage logs by order
 */
export const getInventoryUsageLogsByOrder = async (orderId) => {
  const { data, error } = await supabase
    .from("inventory_usage_log")
    .select("*")
    .eq("order_id", orderId)
    .order("logged_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

/**
 * Create inventory usage log
 */
export const insertInventoryUsageLog = async (usageLog) => {
  const { data, error } = await supabase
    .from("inventory_usage_log")
    .insert(usageLog)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export default {
  getInventoryItems,

  getInventoryItemById,

  getInventoryItemByName,

  getInventoryCategoryByName,

  getInventoryItemsByBranch,

  insertInventoryItem,

  updateInventoryItem,

  deleteInventoryItem,

  getInventoryRestocks,

  getInventoryRestocksByItem,

  insertInventoryRestock,

  updateInventoryStock,

  getInventoryUsageLogs,

  getInventoryUsageLogsByItem,

  getInventoryUsageLogsByOrder,

  insertInventoryUsageLog,
};
