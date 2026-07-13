import { getOrderById, updateOrderStatus } from "../models/OrderModel.js";

/**
 * ==============================================
 * ORDER STATUS SERVICE
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

  /**
   * Cannot release unless fully paid.
   * Check this FIRST before workflow validation.
   */
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
