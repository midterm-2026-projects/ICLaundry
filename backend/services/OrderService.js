// backend/services/OrderService.js

import {
  insertOrder,
  getOrders,
  updateOrder,
  getOrderById,
  updateOrderStatus,
  RecentOrder,
} from "../models/OrderModel.js";

// ==============================================
// VALIDATION HELPERS
// ==============================================

const validateOrder = (order) => {
  if (!order.customer_id) {
    throw new Error("Customer ID is required");
  }

  if (!order.weight_kg || Number(order.weight_kg) <= 0) {
    throw new Error("Weight is required");
  }

  if (!order.payment_method || order.payment_method.trim() === "") {
    throw new Error("Payment method is required");
  }

  if (
    order.amount_paid === undefined ||
    order.amount_paid === null ||
    Number(order.amount_paid) < 0
  ) {
    throw new Error("Amount paid is required");
  }
};

const validateOrderId = (id) => {
  if (!id) {
    throw new Error("Order ID is required");
  }
};

// ==============================================
// BASIC CRUD FUNCTIONS
// ==============================================

/**
 * Create a new order
 */
export const createOrder = (order) => {
  validateOrder(order);

  insertOrder(order);

  return "Order created successfully";
};

/**
 * Get all orders
 */
export const readOrders = () => {
  return getOrders();
};

/**
 * Update existing order
 */
export const editOrder = (id, updatedFields) => {
  validateOrderId(id);

  const existingOrder = getOrders().find((order) => order.id === Number(id));

  if (!existingOrder) {
    throw new Error("Order not found");
  }

  const mergedOrder = {
    ...existingOrder,
    ...updatedFields,
  };

  validateOrder(mergedOrder);

  updateOrder(id, updatedFields);

  return "Order updated successfully";
};

// ==============================================
// ANALYTICS FUNCTIONS
// ==============================================

export const getAnalytics = (period) => {
  const validPeriods = ["weekly", "monthly", "yearly"];

  if (!validPeriods.includes(period)) {
    throw new Error("Unknown analytics period");
  }

  const ordersData = getOrders();

  const currentYear = new Date().getFullYear();

  let labels;

  if (period === "weekly") {
    labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  } else if (period === "monthly") {
    labels = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
  } else {
    labels = Array.from({ length: 5 }, (_, i) => String(currentYear - 4 + i));
  }

  const orders = Array(labels.length).fill(0);

  const revenue = Array(labels.length).fill(0);

  ordersData
    .filter((order) => order.status?.toLowerCase() === "released")
    .forEach((order) => {
      const date = new Date(order.orderDate || order.createdAt);

      let index = -1;

      if (period === "weekly") {
        const day = date.getDay();

        index = day === 0 ? 6 : day - 1;
      } else if (period === "monthly") {
        index = date.getMonth();
      } else {
        index = labels.indexOf(String(date.getFullYear()));
      }

      if (index >= 0 && index < labels.length) {
        orders[index] += 1;

        revenue[index] += Number(order.totalAmount || order.amount || 0);
      }
    });

  return {
    labels,
    orders,
    revenue,
  };
};

export const getWeeklyAnalytics = () => getAnalytics("weekly");

export const getMonthlyAnalytics = () => getAnalytics("monthly");

export const getYearlyAnalytics = () => getAnalytics("yearly");

// ==============================================
// RECENT ORDERS FUNCTIONS
// ==============================================

const recentOrdersDB = [
  {
    orderId: "4J-20240610-1021",
    customer: "Richelle Ann Roxas",
    status: "Pending",
    waitingTime: "Waiting start",
    amount: "₱200",
  },

  // keep your existing recentOrdersDB data here
];

export const getPaginatedOrders = async (page = 1, limit = 10) => {
  const startIndex = (page - 1) * limit;

  const paginatedData = recentOrdersDB.slice(startIndex, startIndex + limit);

  return {
    data: paginatedData,

    totalItems: recentOrdersDB.length,

    currentPage: Number(page),

    itemsPerPage: Number(limit),

    totalPages: Math.ceil(recentOrdersDB.length / limit),
  };
};

export const getOrderByIdService = async (orderId) => {
  return recentOrdersDB.find((order) => order.orderId === orderId) || null;
};

export const addOrder = async (orderData) => {
  const newOrder = new RecentOrder(orderData);

  newOrder.validate();

  recentOrdersDB.unshift(newOrder);

  return newOrder;
};

// ==============================================
// ORDER STATUS MANAGEMENT
// ==============================================

const STATUS_FLOW = [
  "pending",

  "washing",

  "drying",

  "folding",

  "ready",

  "released",
];

/**
 * Update Order Status
 */
export const updateOrderStatusService = async (orderId, newStatus) => {
  const order = await getOrderById(orderId);

  if (!order) {
    throw new Error("Order not found.");
  }

  const currentStatus = order.status.toLowerCase();

  const requestedStatus = newStatus.toLowerCase();

  if (!STATUS_FLOW.includes(requestedStatus)) {
    throw new Error("Invalid order status.");
  }

  if (
    requestedStatus === "released" &&
    order.payment_status.toLowerCase() !== "paid"
  ) {
    throw new Error("Order cannot be released until payment is completed.");
  }

  const currentIndex = STATUS_FLOW.indexOf(currentStatus);

  const nextIndex = STATUS_FLOW.indexOf(requestedStatus);

  if (nextIndex === currentIndex) {
    throw new Error("Order is already in this status.");
  }

  if (nextIndex < currentIndex) {
    throw new Error("Order status cannot move backwards.");
  }

  if (nextIndex > currentIndex + 1) {
    throw new Error("Order status cannot skip workflow steps.");
  }

  const updatedOrder = await updateOrderStatus(orderId, requestedStatus);

  return updatedOrder;
};

// ==============================================
// DEFAULT EXPORT
// ==============================================

export default {
  createOrder,

  readOrders,

  editOrder,

  getAnalytics,

  getWeeklyAnalytics,

  getMonthlyAnalytics,

  getYearlyAnalytics,

  getPaginatedOrders,

  getOrderByIdService,

  addOrder,

  updateOrderStatusService,
};
