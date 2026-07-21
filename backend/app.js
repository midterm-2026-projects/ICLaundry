// backend/app.js

import express from "express";
import cors from "cors";

import orderRoutes from "./routes/OrderRoutes.js";
import paymentRoutes from "./routes/PaymentRoutes.js";
import staffRoutes from "./routes/StaffRoutes.js";
import branchRoutes from "./routes/BranchRoutes.js";
import analyticsRoutes from "./routes/AnalyticsRoutes.js";
import decisionSupportRoutes from "./routes/DecisionSupportRoutes.js";

const app = express();

/**
 * ==============================================
 * GLOBAL MIDDLEWARE
 * ==============================================
 */

app.use(cors());

app.use(express.json());

/**
 * ==============================================
 * API ROUTES
 * ==============================================
 */

app.use("/api/orders", orderRoutes);

app.use("/api/payments", paymentRoutes);

app.use("/api/staff", staffRoutes);

app.use("/api/branches", branchRoutes);

app.use("/api/analytics", analyticsRoutes);

app.use("/api/decision-support", decisionSupportRoutes);

/**
 * ==============================================
 * NOT FOUND HANDLER
 * ==============================================
 */

app.use((req, res) => {
  return res.status(404).json({
    success: false,
    message: "Endpoint not found",
  });
});

export default app;
