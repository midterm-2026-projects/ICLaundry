// backend/services/OrderService.js

import {
  insertOrder,
  getOrders,
  updateOrder,
} from "../models/OrderModel.js";
import { RecentOrder } from "../models/OrderModel.js";

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

/** Create a new order */
export const createOrder = (order) => {
  validateOrder(order);
  insertOrder(order);
  return "Order created successfully";
};

/** Get all orders */
export const readOrders = () => {
  return getOrders();
};

/** Update an existing order */
export const editOrder = (id, updatedFields) => {
  validateOrderId(id);

  // Find existing order
  const existingOrder = getOrders().find(
    (order) => order.id === Number(id)
  );

  if (!existingOrder) {
    throw new Error("Order not found");
  }

  // Merge existing order with updated fields
  const mergedOrder = {
    ...existingOrder,
    ...updatedFields,
  };

  // Validate the complete order
  validateOrder(mergedOrder);

  // Update only the changed fields
  updateOrder(id, updatedFields);

  return "Order updated successfully";
};

// ==============================================
// ANALYTICS FUNCTIONS
// ==============================================

/** Get order & revenue analytics by period: weekly / monthly / yearly */
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
    labels = Array.from(
      { length: 5 },
      (_, i) => String(currentYear - 4 + i)
    );
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

/** Shortcut: Get weekly analytics */
export const getWeeklyAnalytics = () => getAnalytics("weekly");

/** Shortcut: Get monthly analytics */
export const getMonthlyAnalytics = () => getAnalytics("monthly");

/** Shortcut: Get yearly analytics */
export const getYearlyAnalytics = () => getAnalytics("yearly");

// ==============================================
// RECENT ORDERS FUNCTIONS
// ==============================================

// Mock sample data matching your frontend
const recentOrdersDB = [
  {
    orderId: "4J-20240610-1021",
    customer: "Richelle Ann Roxas",
    status: "Pending",
    waitingTime: "Waiting start",
    amount: "₱200",
  },
  {
    orderId: "4J-20250115-7788",
    customer: "Richelle Ann Roxas",
    status: "Folding",
    waitingTime: "Waiting start",
    amount: "₱360",
  },
  {
    orderId: "4J-20260425-3509",
    customer: "Richelle Ann Roxas",
    status: "Folding",
    waitingTime: "Waiting start",
    amount: "₱340",
  },
  {
    orderId: "4J-20260426-3203",
    customer: "Erica Vidal",
    status: "Ready",
    waitingTime: "Waiting start",
    amount: "₱220",
  },
  {
    orderId: "4J-20260516-4796",
    customer: "Erica Vidal",
    status: "Pending",
    waitingTime: "Waiting start",
    amount: "₱200",
  },
  {
    orderId: "4J-20260516-2127",
    customer: "Erica Vidal",
    status: "Ready",
    waitingTime: "Waiting start",
    amount: "₱260",
  },
  {
    orderId: "4J-20240922-3344",
    customer: "Richelle Ann Roxas",
    status: "Released",
    waitingTime: null,
    amount: "₱480",
  },
  {
    orderId: "4J-20260501-1888",
    customer: "Reynan Estobo",
    status: "Released",
    waitingTime: null,
    amount: "₱320",
  },
  {
    orderId: "4J-20260501-8987",
    customer: "Reynan Estobo",
    status: "Released",
    waitingTime: null,
    amount: "₱380",
  },
  {
    orderId: "4J-20260502-3955",
    customer: "Reynan Estobo",
    status: "Released",
    waitingTime: null,
    amount: "₱340",
  },
  {
    orderId: "4J-20260503-1111",
    customer: "Richelle Ann Roxas",
    status: "Pending",
    waitingTime: "Waiting start",
    amount: "₱280",
  },
  {
    orderId: "4J-20260504-2222",
    customer: "Reynan Estobo",
    status: "Ready",
    waitingTime: "Waiting start",
    amount: "₱300",
  },
];

/** Get paginated recent orders */
export const getPaginatedOrders = async (page = 1, limit = 10) => {
  const startIndex = (page - 1) * limit;

  const paginatedData = recentOrdersDB.slice(
    startIndex,
    startIndex + limit
  );

  return {
    data: paginatedData,
    totalItems: recentOrdersDB.length,
    currentPage: Number(page),
    itemsPerPage: Number(limit),
    totalPages: Math.ceil(recentOrdersDB.length / limit),
  };
};

/** Get single recent order by ID */
export const getOrderById = async (orderId) => {
  return (
    recentOrdersDB.find((order) => order.orderId === orderId) || null
  );
};

/** Create and add a new recent order */
export const addOrder = async (orderData) => {
  const newOrder = new RecentOrder(orderData);
  newOrder.validate();

  recentOrdersDB.unshift(newOrder);

  return newOrder;
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
  getOrderById,
  addOrder,
};