const BASE_URL = "http://localhost:3000/api/analytics";

/**
 * ==============================================
 * ANALYTICS API
 * ==============================================
 */

/**
 * Retrieve Dashboard Analytics
 */
export const getDashboardAnalytics = async ({
  startDate = "",
  endDate = "",
  branchId = "",
  period = "",
} = {}) => {
  const params = new URLSearchParams();

  if (startDate) {
    params.append("startDate", startDate);
  }

  if (endDate) {
    params.append("endDate", endDate);
  }

  if (branchId) {
    params.append("branchId", branchId);
  }

  if (period) {
    params.append("period", period);
  }

  const response = await fetch(`${BASE_URL}/dashboard?${params.toString()}`);

  if (!response.ok) {
    throw new Error("Failed to retrieve dashboard analytics.");
  }

  const result = await response.json();

  return result.data;
};

export default {
  getDashboardAnalytics,
};
