// backend/routes/DecisionSupportRoutes.js

import express from "express";

import { getDecisionSupportDashboard } from "../controllers/DecisionSupportController.js";

const router = express.Router();

/**
 * ==============================================
 * DECISION SUPPORT ROUTES
 * ==============================================
 */

/**
 * GET
 * /api/decision-support
 */

router.get("/", getDecisionSupportDashboard);

export default router;
