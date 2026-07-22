// backend/services/CustomerService.js

import {
  insertCustomer,
  getCustomers,
  updateCustomer,
  deleteCustomer,
} from "../models/CustomerModel.js";

/**
 * ==============================================
 * VALIDATION
 * ==============================================
 */

const validateCustomer = (customer) => {
  if (!customer.name || customer.name.trim() === "") {
    throw new Error("Customer name is required");
  }

  if (!customer.phone || customer.phone.trim() === "") {
    throw new Error("Phone number is required");
  }

  if (!customer.email || customer.email.trim() === "") {
    throw new Error("Email is required");
  }
};

const validateCustomerId = (id) => {
  if (
    id === undefined ||
    id === null ||
    (typeof id === "string" && id.trim() === "")
  ) {
    throw new Error("Customer ID is required");
  }
};

/**
 * ==============================================
 * CREATE CUSTOMER
 * ==============================================
 */
export const createCustomer = async (customer) => {
  validateCustomer(customer);

  return await insertCustomer(customer);
};

/**
 * ==============================================
 * READ CUSTOMERS
 * ==============================================
 */
export const readCustomers = async () => {
  return await getCustomers();
};

/**
 * ==============================================
 * UPDATE CUSTOMER
 * ==============================================
 */
export const editCustomer = async (id, customer) => {
  validateCustomerId(id);

  validateCustomer(customer);

  const updatedCustomer = await updateCustomer(id, customer);

  if (!updatedCustomer) {
    throw new Error("Customer not found");
  }

  return updatedCustomer;
};

/**
 * ==============================================
 * DELETE CUSTOMER
 * ==============================================
 */
export const removeCustomer = async (id) => {
  validateCustomerId(id);

  const deleted = await deleteCustomer(id);

  if (!deleted) {
    throw new Error("Customer not found");
  }

  return "Customer deleted successfully";
};
