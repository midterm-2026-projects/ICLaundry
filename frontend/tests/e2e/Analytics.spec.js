import { expect, test } from "@playwright/test";

const dashboardData = (url) => {
  const period = url.searchParams.get("period") || "weekly";
  const branchFiltered = url.searchParams.get("branchId") === "branch-main";
  const dateFiltered = Boolean(url.searchParams.get("startDate") || url.searchParams.get("endDate"));
  const labels = {
    weekly: ["Mon, Jul 6", "Tue, Jul 7"],
    monthly: ["Jun 2026", "Jul 2026"],
    yearly: ["2025", "2026"],
  }[period];
  const periodRevenue = { weekly: 8500, monthly: 28500, yearly: 148500 }[period];
  const totalRevenue = dateFiltered ? 1200 : branchFiltered ? 3200 : periodRevenue;
  const totalExpenses = dateFiltered ? 300 : branchFiltered ? 900 : 2100;

  return {
    totalRevenue,
    totalExpenses,
    netProfit: totalRevenue - totalExpenses,
    totalOrders: dateFiltered ? 3 : branchFiltered ? 8 : 21,
    period,
    revenueDataset: labels.map((label, index) => ({ id: `${period}-${index}`, label, value: totalRevenue / labels.length })),
    expenseDataset: labels.map((label, index) => ({ id: `${period}-${index}`, label, value: totalExpenses / labels.length })),
  };
};

const dssData = {
  summary: { revenueTrend: "Growing", growthRate: 12.5, recommendationCount: 2, alertCount: 1 },
  revenueForecast: [
    { period: "Jul 2026", actual: 8500, forecast: null, type: "Historical" },
    { period: "Aug 2026", actual: null, forecast: 9560, type: "Forecast" },
  ],
  recommendations: [
    { priority: "Medium", category: "Revenue", title: "Maintain Current Strategy", description: "Revenue continues to increase." },
    { priority: "High", category: "Inventory", title: "Prepare Restocking", description: "Detergent is approaching minimum stock." },
  ],
  alerts: [
    { severity: "Warning", category: "Inventory", title: "Detergent Low Stock", description: "Detergent is predicted to reach its minimum stock level." },
  ],
};

const installAnalyticsAPI = async (page, requests, { empty = false, fail = false } = {}) => {
  await page.route("**/api/branches**", (route) => route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ success: true, data: [{ id: "branch-main", branch_name: "Main Branch" }] }) }));
  await page.route("**/api/analytics/dashboard**", async (route) => {
    const url = new URL(route.request().url());
    requests.push(url);
    if (fail) return route.fulfill({ status: 500, contentType: "application/json", body: JSON.stringify({ success: false, message: "Analytics service unavailable" }) });
    const data = empty ? { totalRevenue: 0, totalExpenses: 0, netProfit: 0, totalOrders: 0, period: url.searchParams.get("period"), revenueDataset: [], expenseDataset: [] } : dashboardData(url);
    return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ success: true, data }) });
  });
  await page.route("**/api/decision-support**", (route) => route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ success: true, data: empty ? { summary: { revenueTrend: "Stable" }, revenueForecast: [], recommendations: [], alerts: [] } : dssData }) }));
};

const openAnalytics = async (page) => {
  await page.goto("/");
  await page.getByRole("button", { name: /^analytics$/i }).click();
  await expect(page).toHaveURL(/\/analytics$/);
  await expect(page.getByRole("heading", { name: "Analytics Dashboard" })).toBeVisible();
};

test.describe("Analytics Workflow System Testing", () => {
  test("generates KPIs, comparison chart, forecast, recommendations, and alerts", async ({ page }) => {
    await installAnalyticsAPI(page, []);
    await openAnalytics(page);

    const kpis = page.getByRole("region", { name: "KPI analytics" });
    await expect(kpis).toContainText("₱8,500.00");
    await expect(kpis).toContainText("₱2,100.00");
    await expect(kpis).toContainText("₱6,400.00");
    await expect(kpis).toContainText("21");
    await expect(page.getByRole("region", { name: "Revenue and Expense Trend" })).toBeVisible();
    await expect(page.getByRole("region", { name: "Historical and Forecast Revenue" })).toContainText("Aug 2026");
    await expect(page.getByText("Maintain Current Strategy")).toBeVisible();
    await expect(page.getByText("Detergent Low Stock")).toBeVisible();
    await expect(page.getByText("Deterministic Analysis")).toBeVisible();
  });

  test("switches through weekly, monthly, and yearly aggregation", async ({ page }) => {
    const requests = [];
    await installAnalyticsAPI(page, requests);
    await openAnalytics(page);
    const chart = page.getByRole("region", { name: "Revenue and Expense Trend" });

    await expect(page.getByRole("button", { name: "Weekly" })).toHaveClass(/active/);
    await expect(chart).toContainText("Daily breakdown");
    await expect(chart).toContainText("Mon, Jul 6");

    await page.getByRole("button", { name: "Monthly" }).click();
    await expect(page.getByRole("button", { name: "Monthly" })).toHaveClass(/active/);
    await expect(chart).toContainText("Monthly breakdown");
    await expect(chart).toContainText("Jun 2026");
    await expect(page.getByRole("region", { name: "KPI analytics" })).toContainText("28,500");

    await page.getByRole("button", { name: "Yearly" }).click();
    await expect(page.getByRole("button", { name: "Yearly" })).toHaveClass(/active/);
    await expect(chart).toContainText("Annual breakdown");
    await expect(chart).toContainText("2025");
    await expect(page.getByRole("region", { name: "KPI analytics" })).toContainText("148,500");

    await page.getByRole("button", { name: "Weekly" }).click();
    await expect(chart).toContainText("Tue, Jul 7");
    expect(requests.some((url) => url.searchParams.get("period") === "weekly")).toBeTruthy();
    expect(requests.some((url) => url.searchParams.get("period") === "monthly")).toBeTruthy();
    expect(requests.some((url) => url.searchParams.get("period") === "yearly")).toBeTruthy();
  });

  test("applies branch and date filters, resets filters, and refreshes", async ({ page }) => {
    const requests = [];
    await installAnalyticsAPI(page, requests);
    await openAnalytics(page);
    const kpis = page.getByRole("region", { name: "KPI analytics" });

    await page.getByLabel("Branch").selectOption("branch-main");
    await expect(kpis).toContainText("₱3,200.00");

    await page.getByLabel("Start Date").fill("2026-07-01");
    await page.getByLabel("End Date").fill("2026-07-15");
    await expect(kpis).toContainText("₱1,200.00");
    await expect(page.getByLabel("End Date")).toHaveAttribute("min", "2026-07-01");

    await page.getByRole("button", { name: "Reset filters" }).click();
    await expect(page.getByLabel("Branch")).toHaveValue("");
    await expect(page.getByLabel("Start Date")).toHaveValue("");
    await expect(page.getByLabel("End Date")).toHaveValue("");
    await expect(page.getByRole("button", { name: "Weekly" })).toHaveClass(/active/);
    await expect(kpis).toContainText("₱8,500.00");

    const beforeRefresh = requests.length;
    await page.getByRole("button", { name: "Refresh" }).click();
    await expect.poll(() => requests.length).toBeGreaterThan(beforeRefresh);
  });

  test("renders safe empty states", async ({ page }) => {
    await installAnalyticsAPI(page, [], { empty: true });
    await openAnalytics(page);
    await expect(page.getByRole("region", { name: "KPI analytics" })).toContainText("₱0.00");
    await expect(page.getByText("No revenue or expense data for the selected filters.")).toBeVisible();
    await expect(page.getByText("No recommendations for the selected filters.")).toBeVisible();
    await expect(page.getByText("No active alerts for the selected filters.")).toBeVisible();
  });

  test("shows a retryable backend error", async ({ page }) => {
    await installAnalyticsAPI(page, [], { fail: true });
    await openAnalytics(page);
    await expect(page.getByRole("alert")).toContainText("Analytics service unavailable");
    await expect(page.getByRole("button", { name: "Try again" })).toBeVisible();
  });
});
