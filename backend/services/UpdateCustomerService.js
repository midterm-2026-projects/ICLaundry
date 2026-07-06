import { updateCustomer } from "../models/CustomerModel.js";
import {
  validateCustomer,
  validateCustomerId,
} from "../validation/CustomerValidation.js";

export const editCustomer = (id, customer) => {

  validateCustomerId(id);

  validateCustomer(customer);

  const updatedCustomer = updateCustomer(id, customer);

  if (!updatedCustomer) {
    throw new Error("Customer not found");
  }

  return "Customer updated successfully";

};