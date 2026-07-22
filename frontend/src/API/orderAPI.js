// frontend/src/API/orderAPI.js

import axios from "axios";

const orderAPI = axios.create({
  baseURL: "http://localhost:3000/api",

  headers: {
    "Content-Type": "application/json",
  },
});

// ==============================================
// GET ALL ORDERS
// ==============================================

export const getOrders = async () => {
  const response = await orderAPI.get("/orders");

  return response.data.data || [];
};

// ==============================================
// CREATE ORDER
// ==============================================

export const createOrder = async (orderData) => {
  const response = await orderAPI.post(
    "/orders",

    orderData,
  );

  return response.data;
};

// ==============================================
// UPDATE ORDER
// ==============================================

export const updateOrder = async (
  id,

  orderData,
) => {
  const response = await orderAPI.patch(
    `/orders/${id}`,

    orderData,
  );

  return response.data;
};

// ==============================================
// DELETE ORDER
// ==============================================

export const deleteOrder = async (id) => {
  const response = await orderAPI.delete(`/orders/${id}`);

  return response.data;
};

// ==============================================
// UPDATE ORDER STATUS
// ==============================================

export const updateOrderStatus = async (
  id,

  status,
) => {
  const response = await orderAPI.patch(
    `/orders/${id}/status`,

    {
      status,
    },
  );

  return response.data;
};

export default orderAPI;
