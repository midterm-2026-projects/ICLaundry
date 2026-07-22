// frontend/src/API/paymentAPI.js

import axios from "axios";

const API_URL = "http://localhost:3000/api";

const handleError = (error) => {
  if (error.response && error.response.data) {
    throw new Error(error.response.data.message || "Payment request failed.");
  }

  throw new Error(error.message || "Something went wrong.");
};

/**
 * ==============================================
 * CREATE INITIAL PAYMENT
 * ==============================================
 */

export const createInitialPayment = async (paymentData) => {
  try {
    const response = await axios.post(
      `${API_URL}/payments/initial`,

      paymentData,
    );

    return response.data.data;
  } catch (error) {
    handleError(error);
  }
};

/**
 * ==============================================
 * COMPLETE PAYMENT
 * ==============================================
 */

export const completePayment = async (paymentData) => {
  try {
    const response = await axios.post(
      `${API_URL}/payments/complete`,

      paymentData,
    );

    return response.data.data;
  } catch (error) {
    handleError(error);
  }
};
