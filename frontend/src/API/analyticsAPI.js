const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const requestJson = async (path, params = {}) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => { if (value) query.set(key, value); });
  const response = await fetch(`${API_BASE_URL}${path}${query.size ? `?${query}` : ""}`);
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.message || "Unable to load analytics data.");
  return result.data;
};

export const getDashboardAnalytics = (filters = {}) => requestJson("/analytics/dashboard", filters);
export const getDecisionSupportAnalytics = (filters = {}) => requestJson("/decision-support", filters);
export const getAnalyticsBranches = () => requestJson("/branches");

export default { getDashboardAnalytics, getDecisionSupportAnalytics, getAnalyticsBranches };
