// backend/controllers/DecisionSupportController.js

import { getDecisionSupport } from "../services/DecisionSupportService.js";

export const getDecisionSupportDashboardController = async (req, res) => {
  try {
    const data = await getDecisionSupport();

    return res.status(200).json({
      success: true,
      message: "Decision Support dashboard retrieved successfully",
      data,
    });
  } catch (error) {
    console.error("DECISION SUPPORT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to retrieve Decision Support dashboard",
    });
  }
};

export default {
  getDecisionSupportDashboardController,
};
