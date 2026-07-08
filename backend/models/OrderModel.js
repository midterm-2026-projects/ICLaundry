// backend/models/OrderModel.js

// ==============================================
// IN-MEMORY STORAGE & HELPERS (for unit testing)
// ==============================================
let orders = [];

/**
 * Create a new order in in-memory storage
 * @param {object} order - Order data to insert
 * @returns {object} Newly created order with auto-generated ID
 */
export const insertOrder = (order) => {
  const newOrder = {
    id: orders.length + 1,
    ...order,
  };
  orders.push(newOrder);
  return newOrder;
};

/**
 * Get all orders from in-memory storage
 * @returns {Array} List of all orders
 */
export const getOrders = () => {
  return orders;
};

/**
 * Update an existing order by numeric ID
 * @param {number|string} id - ID of order to update
 * @param {object} updatedOrder - Fields to update
 * @returns {object|null} Updated order, or null if not found
 */
export const updateOrder = (id, updatedOrder) => {
  const orderIndex = orders.findIndex(
    (order) => order.id === Number(id)
  );
  if (orderIndex === -1) return null;
  orders[orderIndex] = { ...orders[orderIndex], ...updatedOrder };
  return orders[orderIndex];
};

/**
 * Reset or seed in-memory storage (for test setup/teardown)
 * @param {Array} newOrders - Optional initial orders to set
 */
export const resetOrders = (newOrders = []) => {
  orders = [...newOrders];
};

// ==============================================
// RECENT ORDER DATA MODEL
// Matches exactly the columns in your frontend table
// ==============================================
export class RecentOrder {
  constructor(data) {
    this.orderId = data.orderId;       // ORDER #
    this.customer = data.customer;     // CUSTOMER
    this.status = data.status;         // STATUS: Pending / Folding / Ready / Released
    this.waitingTime = data.waitingTime || null; // TIME LEFT
    this.amount = data.amount;         // AMOUNT
    this.createdAt = data.createdAt || new Date();
  }

  /**
   * Validate required fields and allowed status values
   * @returns {boolean} True if valid
   * @throws {Error} If any field is invalid or missing
   */
  validate() {
    const validStatuses = ["Pending", "Folding", "Ready", "Released"];
    
    if (!this.orderId) throw new Error("Order ID is required");
    if (!this.customer) throw new Error("Customer name is required");
    if (!validStatuses.includes(this.status)) throw new Error(`Status must be one of: ${validStatuses.join(", ")}`);
    if (!this.amount) throw new Error("Order amount is required");
    
    return true;
  }
}

// Default export for backward compatibility
export default RecentOrder;