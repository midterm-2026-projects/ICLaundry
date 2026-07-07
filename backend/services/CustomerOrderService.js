import {
  insertCustomerOrder,
  getCustomerOrders,
  updateCustomerOrder,
} from "../models/CustomerOrderModel.js";

const validateCustomerOrder = (customerOrder) => {

  if (!customerOrder.customer_id) {
    throw new Error("Customer ID is required");
  }

  if (
    !customerOrder.weight_kg ||
    Number(customerOrder.weight_kg) <= 0
  ) {
    throw new Error("Weight is required");
  }

  if (
    !customerOrder.payment_method ||
    customerOrder.payment_method.trim() === ""
  ) {
    throw new Error("Payment method is required");
  }

  if (
    customerOrder.amount_paid === undefined ||
    customerOrder.amount_paid === null ||
    Number(customerOrder.amount_paid) < 0
  ) {
    throw new Error("Amount paid is required");
  }

};

const validateCustomerOrderId = (id) => {

  if (!id) {
    throw new Error("Customer Order ID is required");
  }

};

// Create Customer Order
export const createCustomerOrder = (customerOrder) => {

  validateCustomerOrder(customerOrder);

  insertCustomerOrder(customerOrder);

  return "Customer Order created successfully";

};

// Read Customer Orders
export const readCustomerOrders = () => {

  return getCustomerOrders();

};

// Update Customer Order
export const editCustomerOrder = (id, customerOrder) => {

  validateCustomerOrderId(id);

  validateCustomerOrder(customerOrder);

  const updatedCustomerOrder = updateCustomerOrder(
    id,
    customerOrder
  );

  if (!updatedCustomerOrder) {
    throw new Error("Customer Order not found");
  }

  return "Customer Order updated successfully";

};