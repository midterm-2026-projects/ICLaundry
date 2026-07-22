import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const inventoryClient = axios.create({
  baseURL: `${API_BASE_URL}/inventory`,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Extract the useful data from different API response formats.
 */
const getResponseData = (response) => {
  if (Array.isArray(response?.data)) {
    return response.data;
  }

  if (response?.data?.data !== undefined) {
    return response.data.data;
  }

  return response?.data;
};

/**
 * Convert backend inventory fields into frontend fields.
 *
 * Backend:
 * name
 * current_stock
 * minimum_stock
 * cost_per_unit
 * usage_per_load
 *
 * Frontend:
 * itemName
 * quantity
 * minimumStock
 * costPerUnit
 * usagePerLoad
 */
export const normalizeInventoryItem = (item = {}) => {
  return {
    id: item.id,

    itemName: item.name ?? "",

    category: item.category ?? "",

    branch: item.branch ?? "",

    quantity: Number(item.current_stock ?? 0),

    unit: item.unit ?? "pcs",

    minimumStock: Number(item.minimum_stock ?? 0),

    costPerUnit: Number(item.cost_per_unit ?? 0),

    usagePerLoad: Number(item.usage_per_load ?? 0),

    createdAt: item.created_at ?? null,

    updatedAt: item.updated_at ?? null,
  };
};

/**
 * Convert frontend inventory fields into backend fields.
 */
export const toInventoryPayload = (formData = {}) => {
  return {
    name: String(formData.itemName ?? "").trim(),

    category: String(formData.category ?? "").trim(),

    branch: String(formData.branch ?? "").trim(),

    current_stock: Number(formData.quantity ?? 0),

    unit: String(formData.unit ?? "").trim(),

    minimum_stock: Number(formData.minimumStock ?? 0),

    cost_per_unit: Number(formData.costPerUnit ?? 0),

    usage_per_load: Number(formData.usagePerLoad ?? 0),
  };
};

/**
 * Get all inventory items.
 *
 * When a branch is selected, this uses:
 * GET /api/inventory/branch/:branch
 *
 * Otherwise:
 * GET /api/inventory
 */
export const fetchInventoryItems = async ({ branch = "All Branches" } = {}) => {
  const endpoint =
    branch && branch !== "All Branches"
      ? `/branch/${encodeURIComponent(branch)}`
      : "/";

  const response = await inventoryClient.get(endpoint);

  const data = getResponseData(response);

  if (!Array.isArray(data)) {
    return [];
  }

  return data.map(normalizeInventoryItem);
};

/**
 * Get one inventory item by ID.
 *
 * GET /api/inventory/:id
 */
export const fetchInventoryItemById = async (id) => {
  if (!id) {
    throw new Error("Inventory item ID is required.");
  }

  const response = await inventoryClient.get(`/${id}`);

  const data = getResponseData(response);

  if (!data) {
    return null;
  }

  return normalizeInventoryItem(data);
};

/**
 * Create a new inventory item.
 *
 * POST /api/inventory
 */
export const createInventoryItem = async (formData) => {
  const payload = toInventoryPayload(formData);

  const response = await inventoryClient.post("/", payload);

  return getResponseData(response);
};

/**
 * Update an existing inventory item.
 *
 * PUT /api/inventory/:id
 */
export const updateInventoryItem = async (id, formData) => {
  if (!id) {
    throw new Error("Inventory item ID is required.");
  }

  const payload = toInventoryPayload(formData);

  const response = await inventoryClient.put(`/${id}`, payload);

  return getResponseData(response);
};

/**
 * Delete an inventory item.
 *
 * DELETE /api/inventory/:id
 */
export const deleteInventoryItem = async (id) => {
  if (!id) {
    throw new Error("Inventory item ID is required.");
  }

  const response = await inventoryClient.delete(`/${id}`);

  return response.data;
};

/**
 * Create a restocking transaction.
 *
 * POST /api/inventory/restocks
 */
export const createInventoryRestock = async ({
  itemId,
  quantity,
  notes = "",
}) => {
  if (!itemId) {
    throw new Error("Inventory item ID is required.");
  }

  const response = await inventoryClient.post("/restocks", {
    item_id: itemId,

    quantity_added: Number(quantity),

    notes: String(notes ?? "").trim(),
  });

  return getResponseData(response);
};

/**
 * Get all inventory restocking transactions.
 *
 * GET /api/inventory/restocks/all
 */
export const fetchInventoryRestocks = async () => {
  const response = await inventoryClient.get("/restocks/all");

  const data = getResponseData(response);

  return Array.isArray(data) ? data : [];
};

/**
 * Get inventory usage logs.
 *
 * GET /api/inventory/usage/all
 */
export const fetchInventoryUsageLogs = async () => {
  const response = await inventoryClient.get("/usage/all");

  const data = getResponseData(response);

  return Array.isArray(data) ? data : [];
};

/**
 * Record inventory usage.
 *
 * POST /api/inventory/usage
 */
export const createInventoryUsageLog = async ({
  itemId,
  orderId,
  quantityUsed,
}) => {
  if (!itemId) {
    throw new Error("Inventory item ID is required.");
  }

  const response = await inventoryClient.post("/usage", {
    item_id: itemId,

    order_id: orderId || null,

    quantity_used: Number(quantityUsed),
  });

  return getResponseData(response);
};

/**
 * Get the current stock status of an item.
 *
 * GET /api/inventory/status/:id
 */
export const fetchInventoryStockStatus = async (id) => {
  if (!id) {
    throw new Error("Inventory item ID is required.");
  }

  const response = await inventoryClient.get(`/status/${id}`);

  return response.data;
};

export default {
  fetchInventoryItems,
  fetchInventoryItemById,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
  createInventoryRestock,
  fetchInventoryRestocks,
  fetchInventoryUsageLogs,
  createInventoryUsageLog,
  fetchInventoryStockStatus,
  normalizeInventoryItem,
  toInventoryPayload,
};
