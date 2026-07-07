import {
  insertCustomer,
  getCustomers,
  updateCustomer,
  deleteCustomer,
} from "../models/CustomerModel.js";

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

  if (!id) {
    throw new Error("Customer ID is required");
  }

};

// Create Customer
export const createCustomer = (customer) => {

  validateCustomer(customer);

  insertCustomer(customer);

  return "Customer created successfully";

};

// Read Customers
export const readCustomers = () => {

  return getCustomers();

};

// Update Customer
export const editCustomer = (id, customer) => {

  validateCustomerId(id);

  validateCustomer(customer);

  const updatedCustomer = updateCustomer(id, customer);

  if (!updatedCustomer) {
    throw new Error("Customer not found");
  }

  return "Customer updated successfully";

};

// Delete Customer
export const removeCustomer = (id) => {

  validateCustomerId(id);

  const deletedCustomer = deleteCustomer(id);

  if (!deletedCustomer) {
    throw new Error("Customer not found");
  }

  return "Customer deleted successfully";

};