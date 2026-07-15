// backend/controllers/AnalyticsController.js

import { getDashboardAnalytics } from "../services/AnalyticsService.js";

/**
 * ==============================================
 * ANALYTICS CONTROLLER
 * ==============================================
 */

/**
 * Dashboard Analytics
 */
export const getDashboardAnalyticsController = async (req, res) => {
  try {
    const { startDate, endDate, branchId } = req.query;

    const analytics = await getDashboardAnalytics({
      startDate,
      endDate,
      branchId,
    });

    return res.status(200).json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export default {
  getDashboardAnalyticsController,
};
