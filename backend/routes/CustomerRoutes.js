// backend/routes/CustomerRoutes.js

import express from "express";

import {
  createCustomerController,
  getCustomersController,
  updateCustomerController,
  deleteCustomerController,
} from "../controllers/CustomerController.js";

const router = express.Router();

/**
 * ==============================================
 * GET ALL CUSTOMERS
 * ==============================================
 */
router.get("/", getCustomersController);

/**
 * ==============================================
 * CREATE CUSTOMER
 * ==============================================
 */
router.post("/", createCustomerController);

/**
 * ==============================================
 * UPDATE CUSTOMER
 * ==============================================
 */
router.patch("/:id", updateCustomerController);

/**
 * ==============================================
 * DELETE CUSTOMER
 * ==============================================
 */
router.delete("/:id", deleteCustomerController);

export default router;
