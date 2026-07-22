import { useCallback, useEffect, useRef, useState } from "react";
import { BarChart3, RefreshCw, Sparkles } from "lucide-react";

import { getAnalyticsBranches, getDashboardAnalytics, getDecisionSupportAnalytics } from "../API/analyticsAPI";
import TotalRevenueCard from "../../components/TotalRevenueCard";
import TotalExpensesCard from "../../components/TotalExpensesCard";
import NetProfitCard from "../../components/NetProfitCard";
import TotalOrdersCard from "../../components/TotalOrdersCard";
import RevenueForecastingChart from "../../components/RevenueForecastingChart";
import RevenueExpenseTrendChart from "../../components/RevenueExpenseTrendChart";
import DateRangeFilter from "../../components/DateRangeFilter";
import BranchFilter from "../../components/BranchFilter";
import PeriodToggle from "../../components/PeriodToggle";
import DSSRecommendationSection from "../../components/DSSRecommendationSection";
import DSSAlertsSection from "../../components/DSSAlertsSection";

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [decisionSupport, setDecisionSupport] = useState(null);
  const [branches, setBranches] = useState([]);
  const [filters, setFilters] = useState({ startDate: "", endDate: "", branchId: "", period: "weekly" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const latestRequest = useRef(0);

  const loadAnalytics = useCallback(async () => {
    const requestId = ++latestRequest.current;
    try {
      setLoading(true); setError("");
      const [dashboard, dss, branchRecords] = await Promise.all([
        getDashboardAnalytics(filters), getDecisionSupportAnalytics(filters), getAnalyticsBranches(),
      ]);
      if (requestId !== latestRequest.current) return;
      setAnalytics(dashboard); setDecisionSupport(dss); setBranches(Array.isArray(branchRecords) ? branchRecords : []);
    } catch (requestError) {
      if (requestId === latestRequest.current) setError(requestError.message);
    }
    finally {
      if (requestId === latestRequest.current) setLoading(false);
    }
  }, [filters]);

  useEffect(() => { loadAnalytics(); }, [loadAnalytics]);
  const updateFilter = (name) => (value) => setFilters((current) => ({ ...current, [name]: value }));
  const resetFilters = () => setFilters({ startDate: "", endDate: "", branchId: "", period: "weekly" });

  return (
    <main className="analytics-page">
      <div className="analytics-shell">
        <header className="analytics-header">
          <div><span className="analytics-eyebrow"><BarChart3 size={15} /> Business intelligence</span><h1>Analytics Dashboard</h1><p>Monitor financial performance, forecasts, and decision-support insights.</p></div>
          <button type="button" className="btn btn-secondary" onClick={loadAnalytics} disabled={loading}><RefreshCw size={17} /> Refresh</button>
        </header>

        <section className="analytics-filter-card" aria-label="Dashboard filters">
          <DateRangeFilter startDate={filters.startDate} endDate={filters.endDate} onStartDateChange={updateFilter("startDate")} onEndDateChange={updateFilter("endDate")} />
          <BranchFilter selectedBranch={filters.branchId} onBranchChange={updateFilter("branchId")} branches={branches} />
          <PeriodToggle selectedPeriod={filters.period} onPeriodChange={updateFilter("period")} />
          <button type="button" className="analytics-reset-button" onClick={resetFilters}>Reset filters</button>
        </section>

        {error && <div role="alert" className="analytics-error">{error}<button type="button" onClick={loadAnalytics}>Try again</button></div>}
        {loading && !analytics ? <div className="analytics-loading">Generating analytics...</div> : analytics && <>
          <section className="analytics-kpi-grid" aria-label="KPI analytics">
            <TotalRevenueCard value={analytics.totalRevenue} /><TotalExpensesCard value={analytics.totalExpenses} /><NetProfitCard value={analytics.netProfit} /><TotalOrdersCard value={analytics.totalOrders} />
          </section>
          <section className="analytics-chart-grid">
            <RevenueExpenseTrendChart period={analytics.period || filters.period} revenue={analytics.revenueDataset} expenses={analytics.expenseDataset} />
            <section className="analytics-forecast-section">
              <header><div><span><Sparkles size={17} /></span><div><h2>Revenue Forecasting</h2><p>Predictive Analytics · Moving Average Forecast</p></div></div><strong>{decisionSupport?.summary?.revenueTrend || "Stable"}</strong></header>
              <RevenueForecastingChart title="Historical and Forecast Revenue" data={decisionSupport?.revenueForecast || []} valueKey="forecast" tone="purple" />
            </section>
          </section>
          <section className="analytics-insights-panel">
            <header><div><Sparkles size={19} /><div><h2>Rule-Based DSS Insights</h2><p>Operational and financial recommendations generated from validated business rules</p></div></div><span>Deterministic Analysis</span></header>
            <div className="analytics-dss-grid"><DSSRecommendationSection recommendations={decisionSupport?.recommendations || []} /><DSSAlertsSection alerts={decisionSupport?.alerts || []} /></div>
          </section>
        </>}
      </div>
    </main>
  );
};

export default Analytics;
