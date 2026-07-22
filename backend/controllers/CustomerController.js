// backend/controllers/CustomerController.js

import {
  createCustomer,
  readCustomers,
  editCustomer,
  removeCustomer,
} from "../services/CustomerService.js";

/**
 * ==============================================
 * CREATE CUSTOMER
 * ==============================================
 */
export const createCustomerController = async (req, res) => {
  try {
    const customer = await createCustomer(req.body);

    return res.status(201).json({
      success: true,
      data: customer,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * ==============================================
 * GET ALL CUSTOMERS
 * ==============================================
 */
export const getCustomersController = async (req, res) => {
  try {
    const customers = await readCustomers();

    return res.status(200).json({
      success: true,
      data: customers,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * ==============================================
 * UPDATE CUSTOMER
 * ==============================================
 */
export const updateCustomerController = async (req, res) => {
  try {
    const customer = await editCustomer(req.params.id, req.body);

    return res.status(200).json({
      success: true,
      data: customer,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * ==============================================
 * DELETE CUSTOMER
 * ==============================================
 */
export const deleteCustomerController = async (req, res) => {
  try {
    const message = await removeCustomer(req.params.id);

    return res.status(200).json({
      success: true,
      message,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
