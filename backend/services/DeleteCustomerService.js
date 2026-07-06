import { deleteCustomer } from "../models/CustomerModel.js";
import { validateCustomerId } from "../validation/CustomerValidation.js";

export const removeCustomer = (id) => {

  validateCustomerId(id);

  const deletedCustomer = deleteCustomer(id);

  if (!deletedCustomer) {
    throw new Error("Customer not found");
  }

  return "Customer deleted successfully";

};