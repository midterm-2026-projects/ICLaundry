// backend/services/OrderService.js

import {
  createOrder,
  getOrders,
  updateOrder,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
} from "../models/OrderModel.js";

import { getCustomerByPhone, insertCustomer } from "../models/CustomerModel.js";

/**
 * ==============================================
 * ORDER SERVICE
 * Handles business logic for Orders.
 * ==============================================
 */

/**
 * ==============================================
 * VALIDATION HELPERS
 * ==============================================
 */

const STATUS_FLOW = [
  "pending",
  "washing",
  "drying",
  "folding",
  "ready",
  "released",
];

const validateOrder = (order) => {
  if (!order.customer_phone && !order.customer_id) {
    throw new Error("Customer information is required.");
  }

  if (
    order.weight_kg === undefined ||
    order.weight_kg === null ||
    Number(order.weight_kg) <= 0
  ) {
    throw new Error("Weight must be greater than zero.");
  }

  return true;
};

const validateOrderId = (id) => {
  if (!id) {
    throw new Error("Order ID is required.");
  }

  return true;
};

const validateStatus = (status) => {
  if (typeof status !== "string") {
    throw new Error("Invalid order status.");
  }

  if (!STATUS_FLOW.includes(status.toLowerCase())) {
    throw new Error("Invalid order status.");
  }
};

/**
 * ==============================================
 * PAYMENT HELPERS
 * ==============================================
 */

const calculatePaymentStatus = (totalPrice, amountPaid) => {
  const total = Number(totalPrice || 0);
  const paid = Number(amountPaid || 0);

  if (paid <= 0) {
    return "unpaid";
  }

  if (paid >= total) {
    return "paid";
  }

  return "partial";
};

const validateReleasePayment = (order) => {
  /**
   * Support unit tests that only mock payment_status.
   */
  if (order.payment_status === "partial" || order.payment_status === "unpaid") {
    throw new Error("Order cannot be released until payment is completed.");
  }

  /**
   * Actual application logic.
   */
  const total = Number(order.total_price || 0);
  const paid = Number(order.amount_paid || 0);
  const remaining = total - paid;

  if (remaining > 0) {
    throw new Error(`Cannot release order. Remaining balance: ₱${remaining}`);
  }
};

/**
 * ==============================================
 * WORKFLOW VALIDATION
 * ==============================================
 */

const validateWorkflowTransition = (currentStatus, newStatus) => {
  const currentIndex = STATUS_FLOW.indexOf(currentStatus);
  const newIndex = STATUS_FLOW.indexOf(newStatus);

  if (currentIndex === newIndex) {
    throw new Error("Order is already in this status.");
  }

  if (newIndex < currentIndex) {
    throw new Error("Order status cannot move backwards.");
  }

  if (newIndex > currentIndex + 1) {
    throw new Error("Order status cannot skip workflow steps.");
  }
};

/**
 * ==============================================
 * CREATE ORDER
 * AUTO CREATE CUSTOMER
 * ==============================================
 */

export const createOrderService = async (orderData) => {
  validateOrder(orderData);

  let customerId = orderData.customer_id;

  if (!customerId) {
    let customer = await getCustomerByPhone(orderData.customer_phone);

    if (!customer) {
      customer = await insertCustomer({
        name: orderData.customer_name,
        phone: orderData.customer_phone,
        email: orderData.customer_email || null,
      });
    }

    customerId = customer.id;
  }

  const newOrder = {
    customer_id: customerId,
    weight_kg: Number(orderData.weight_kg),
    total_price: Number(orderData.total_price) || 0,
    status: "pending",
    payment_status: calculatePaymentStatus(
      orderData.total_price,
      orderData.amount_paid,
    ),
    payment_method: orderData.payment_method || null,
    amount_paid: Number(orderData.amount_paid || 0),
    notes: orderData.notes || "",
    addons: orderData.addons || {},
    estimated_completion: orderData.estimated_completion || null,
  };

  return await createOrder(newOrder);
};

/**
 * ==============================================
 * GET ALL ORDERS
 * ==============================================
 */

export const readOrders = async () => {
  return await getOrders();
};

/**
 * ==============================================
 * GET ORDER BY ID
 * ==============================================
 */

export const getOrderByIdService = async (orderId) => {
  validateOrderId(orderId);

  const order = await getOrderById(orderId);

  if (!order) {
    throw new Error("Order not found.");
  }

  return order;
};
/**
 * ==============================================
 * UPDATE ORDER
 * ==============================================
 */

export const editOrder = async (id, updatedFields) => {
  validateOrderId(id);

  const existingOrder = await getOrderById(id);

  if (!existingOrder) {
    throw new Error("Order not found.");
  }

  const updatedOrder = {
    ...updatedFields,
  };

  /**
   * AUTO UPDATE PAYMENT STATUS
   */

  if (
    updatedFields.total_price !== undefined ||
    updatedFields.amount_paid !== undefined
  ) {
    updatedOrder.payment_status = calculatePaymentStatus(
      updatedFields.total_price ?? existingOrder.total_price,
      updatedFields.amount_paid ?? existingOrder.amount_paid,
    );
  }

  return await updateOrder(id, updatedOrder);
};

/**
 * ==============================================
 * DELETE ORDER
 * ==============================================
 */

export const deleteOrderService = async (id) => {
  validateOrderId(id);

  const order = await getOrderById(id);

  if (!order) {
    throw new Error("Order not found.");
  }

  await deleteOrder(id);

  return "Order deleted successfully.";
};

/**
 * ==============================================
 * ANALYTICS
 * ==============================================
 */

export const getAnalytics = async (period) => {
  const validPeriods = ["weekly", "monthly", "yearly"];

  if (!validPeriods.includes(period)) {
    throw new Error("Unknown analytics period.");
  }

  const orders = await getOrders();

  const currentYear = new Date().getFullYear();

  let labels = [];

  switch (period) {
    case "weekly":
      labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      break;

    case "monthly":
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
      break;

    case "yearly":
      labels = Array.from({ length: 5 }, (_, index) =>
        String(currentYear - 4 + index),
      );
      break;
  }

  const orderCounts = Array(labels.length).fill(0);
  const revenues = Array(labels.length).fill(0);

  orders
    .filter((order) => order.status?.toLowerCase() === "released")
    .forEach((order) => {
      const date = new Date(order.created_at);

      let index = -1;

      switch (period) {
        case "weekly": {
          const day = date.getDay();
          index = day === 0 ? 6 : day - 1;
          break;
        }

        case "monthly":
          index = date.getMonth();
          break;

        case "yearly":
          index = labels.indexOf(String(date.getFullYear()));
          break;
      }

      if (index >= 0 && index < labels.length) {
        orderCounts[index]++;
        revenues[index] += Number(order.total_price || 0);
      }
    });

  return {
    period,
    labels,
    orders: orderCounts,
    revenue: revenues,
  };
};

export const getWeeklyAnalytics = async () => {
  return await getAnalytics("weekly");
};

export const getMonthlyAnalytics = async () => {
  return await getAnalytics("monthly");
};

export const getYearlyAnalytics = async () => {
  return await getAnalytics("yearly");
};

/**
 * ==============================================
 * RECENT ORDERS MODULE
 * ==============================================
 */

const recentOrdersDB = [
  {
    orderId: "4J-20240610-1021",
    customer: "Richelle Ann Roxas",
    status: "Pending",
    waitingTime: "Waiting start",
    amount: "₱200",
    createdAt: new Date(),
  },
];

export const getPaginatedOrders = async (page = 1, limit = 10) => {
  const startIndex = (page - 1) * limit;

  return {
    data: recentOrdersDB.slice(startIndex, startIndex + limit),
    totalItems: recentOrdersDB.length,
    currentPage: Number(page),
    itemsPerPage: Number(limit),
    totalPages: Math.ceil(recentOrdersDB.length / limit),
  };
};

export const addOrder = async (orderData) => {
  const newOrder = {
    ...orderData,
    orderId: `ORD-${Date.now()}`,
    createdAt: new Date(),
  };

  recentOrdersDB.unshift(newOrder);

  return newOrder;
};

export const getRecentOrderById = async (orderId) => {
  return recentOrdersDB.find((order) => order.orderId === orderId) || null;
};

export const searchRecentOrders = async (keyword = "") => {
  const search = keyword.trim().toLowerCase();

  if (!search) {
    return recentOrdersDB;
  }

  return recentOrdersDB.filter(
    (order) =>
      order.customer.toLowerCase().includes(search) ||
      order.orderId.toLowerCase().includes(search) ||
      order.status.toLowerCase().includes(search),
  );
};

export const filterRecentOrders = async (status) => {
  if (!status || status.toLowerCase() === "all") {
    return recentOrdersDB;
  }

  return recentOrdersDB.filter(
    (order) => order.status.toLowerCase() === status.toLowerCase(),
  );
};
/**
 * ==============================================
 * STATUS WORKFLOW
 * ==============================================
 */

export const updateOrderStatusService = async (orderId, newStatus) => {
  validateOrderId(orderId);

  validateStatus(newStatus);

  const order = await getOrderById(orderId);

  if (!order) {
    throw new Error("Order not found.");
  }

  const currentStatus = String(order.status).toLowerCase();

  const nextStatus = String(newStatus).toLowerCase();

  /**
   * ==============================================
   * PAYMENT VALIDATION FIRST
   * ==============================================
   *
   * Release requires full payment.
   * This must happen before workflow validation.
   *
   */

  if (nextStatus === "released") {
    const latestOrder = await getOrderById(orderId);

    if (!latestOrder) {
      throw new Error("Order not found.");
    }

    validateReleasePayment(latestOrder);
  }

  /**
   * ==============================================
   * WORKFLOW VALIDATION
   * ==============================================
   */

  validateWorkflowTransition(currentStatus, nextStatus);

  /**
   * ==============================================
   * UPDATE STATUS
   * ==============================================
   */

  return await updateOrderStatus(orderId, nextStatus);
};

/**
 * ==============================================
 * DASHBOARD SUMMARY
 * ==============================================
 */

export const getOrderSummary = async () => {
  const orders = await getOrders();

  return {
    totalOrders: orders.length,

    pending: orders.filter((order) => order.status === "pending").length,

    washing: orders.filter((order) => order.status === "washing").length,

    released: orders.filter((order) => order.status === "released").length,

    totalRevenue: orders.reduce(
      (sum, order) => sum + Number(order.total_price || 0),
      0,
    ),
  };
};

export default {
  createOrderService,
  readOrders,
  getOrderByIdService,
  editOrder,
  deleteOrderService,
  updateOrderStatusService,
  getAnalytics,
  getWeeklyAnalytics,
  getMonthlyAnalytics,
  getYearlyAnalytics,
  getPaginatedOrders,
  getRecentOrderById,
  addOrder,
  searchRecentOrders,
  filterRecentOrders,
  getOrderSummary,
};
