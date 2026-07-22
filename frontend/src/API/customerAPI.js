// frontend/src/API/customerAPI.js

import axios from "axios";

const customerAPI = axios.create({
  baseURL: "http://localhost:3000/api",

  headers: {
    "Content-Type": "application/json",
  },
});

// ==============================================
// GET ALL CUSTOMERS
// ==============================================

export const getCustomers = async () => {
  const response = await customerAPI.get("/customers");

  return response.data.data || [];
};

// ==============================================
// CREATE CUSTOMER
// ==============================================

export const createCustomer = async (customerData) => {
  const response = await customerAPI.post("/customers", customerData);

  return response.data;
};

// ==============================================
// UPDATE CUSTOMER
// ==============================================

export const updateCustomer = async (id, customerData) => {
  const response = await customerAPI.patch(`/customers/${id}`, customerData);

  return response.data;
};

// ==============================================
// DELETE CUSTOMER
// ==============================================

export const deleteCustomer = async (id) => {
  const response = await customerAPI.delete(`/customers/${id}`);

  return response.data;
};

export default customerAPI;
