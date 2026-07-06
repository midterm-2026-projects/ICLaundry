import { insertCustomer } from "../models/CustomerModel.js";
import { validateCustomer } from "../validation/CustomerValidation.js";

export const createCustomer = (customer) => {

  validateCustomer(customer);

  insertCustomer(customer);

  return "Customer created successfully";

};