// backend/routes/AnalyticsRoutes.js

import express from "express";

import { getDashboardAnalyticsController } from "../controllers/AnalyticsController.js";

const router = express.Router();

/**
 * ==============================================
 * ANALYTICS ROUTES
 * ==============================================
 */

/**
 * GET DASHBOARD ANALYTICS
 *
 * Example:
 * GET /api/analytics/dashboard
 *
 * Optional filters:
 * ?startDate=2026-07-01
 * ?endDate=2026-07-31
 * ?branchId=branch-id
 */
router.get("/dashboard", getDashboardAnalyticsController);

export default router;
