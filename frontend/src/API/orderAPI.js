// frontend/src/API/orderAPI.js

import axios from "axios";

const API_URL = "http://localhost:3000/api";

/**
 * Get Order
 */
export const getOrderById = async (orderId) => {
  const response = await axios.get(`${API_URL}/orders/${orderId}`);

  return response.data.data;
};

/**
 * Update Order Status
 */
export const updateOrderStatus = async (orderId, status) => {
  const response = await axios.patch(`${API_URL}/orders/${orderId}/status`, {
    status,
  });

  return response.data.data;
};
