// backend/routes/DecisionSupportRoutes.js

import express from "express";

import { getDecisionSupportDashboardController } from "../controllers/DecisionSupportController.js";

const router = express.Router();

router.get("/", getDecisionSupportDashboardController);

export default router;
