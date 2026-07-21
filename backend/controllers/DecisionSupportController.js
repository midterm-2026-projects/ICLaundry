// backend/controllers/DecisionSupportController.js

import { getDecisionSupport } from "../services/DecisionSupportService.js";

/**
 * ==============================================
 * DECISION SUPPORT CONTROLLER
 * Handles Forecasting and DSS requests.
 * ==============================================
 */

/**
 * ==============================================
 * GET DECISION SUPPORT DASHBOARD
 * ==============================================
 */

export const getDecisionSupportDashboard = async (req, res) => {
  try {
    const dashboard = await getDecisionSupport();

    return res.status(200).json({
      success: true,

      data: dashboard,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,

      message:
        error.message || "Failed to generate Decision Support dashboard.",
    });
  }
};

export default {
  getDecisionSupportDashboard,
};
