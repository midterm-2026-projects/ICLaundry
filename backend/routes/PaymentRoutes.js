import express from "express";

import {
  createInitialPaymentController,
  completePaymentController,
} from "../controllers/PaymentController.js";

const router = express.Router();

/**
 * Initial payment (minimum 50%)
 */
router.post("/initial", createInitialPaymentController);

/**
 * Remaining payment
 */
router.post("/complete", completePaymentController);

export default router;
