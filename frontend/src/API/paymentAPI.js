import axios from "axios";

const API_URL = "http://localhost:3000/api";

export const getOrderById = async (orderId) => {
  const response = await axios.get(`${API_URL}/orders/${orderId}`);
  return response.data.data;
};

export const createInitialPayment = async (paymentData) => {
  const response = await axios.post(`${API_URL}/payments/initial`, paymentData);

  return response.data.data;
};

export const completePayment = async (paymentData) => {
  const response = await axios.post(
    `${API_URL}/payments/complete`,
    paymentData,
  );

  return response.data.data;
};
