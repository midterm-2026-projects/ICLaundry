import express from "express";
import {
  initialPayment,
  completePayment
} from "../controllers/PaymentController.js";

const router = express.Router();
router.post("/initial", initialPayment);
router.post("/complete", completePayment);
export default router;