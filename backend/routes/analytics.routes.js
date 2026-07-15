import express from "express";

import { getDashboardAnalyticsController } from "../controllers/AnalyticsController.js";

const router = express.Router();

/**
 * Dashboard Analytics
 */
router.get("/dashboard", getDashboardAnalyticsController);

export default router;
