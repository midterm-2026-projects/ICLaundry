// backend/controllers/OrderStatusController.js

import { updateOrderStatusService } from "../services/OrderStatusService.js";

/**
 * ==============================================
 * ORDER STATUS CONTROLLER
 * Handles updating order progress.
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
