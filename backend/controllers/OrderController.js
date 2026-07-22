// backend/controllers/OrderController.js

import {
  createOrderService,
  readOrders,
  editOrder,
  deleteOrderService,
  updateOrderStatusService,
} from "../services/OrderService.js";

import { getOrderById } from "../models/OrderModel.js";

/**
 * ==============================================
 * ORDER CONTROLLER
 * ==============================================
 */

/**
 * Get all orders
 */
export const getOrdersController = async (req, res) => {
  try {
    const orders = await readOrders();

    return res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get order by ID
 */
export const getOrderByIdController = async (req, res) => {
  try {
    const order = await getOrderById(req.params.id);

    return res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Create Order
 */
export const createOrderController = async (req, res) => {
  try {
    const order = await createOrderService(req.body);

    return res.status(201).json({
      success: true,
      data: order,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Update Order
 */
export const updateOrderController = async (req, res) => {
  try {
    const updatedOrder = await editOrder(req.params.id, req.body);

    return res.status(200).json({
      success: true,
      data: updatedOrder,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Delete Order
 */
export const deleteOrderController = async (req, res) => {
  try {
    const result = await deleteOrderService(req.params.id);

    return res.status(200).json({
      success: true,
      message: result,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * ==============================================
 * ORDER STATUS MANAGEMENT
 * ==============================================
 */

/**
 * Update Order Status
 */
export const updateOrderStatusController = async (req, res) => {
  try {
    const { id } = req.params;

    const { status } = req.body;

    const updatedOrder = await updateOrderStatusService(id, status);

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully.",
      data: updatedOrder,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
