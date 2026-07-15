import { useEffect, useState } from "react";

import { getDashboardAnalytics } from "../API/analyticsAPI";

import TotalRevenueCard from "../../components/TotalRevenueCard";
import TotalExpensesCard from "../../components/TotalExpensesCard";
import NetProfitCard from "../../components/NetProfitCard";
import TotalOrdersCard from "../../components/TotalOrdersCard";

import RevenueForecastingChart from "../../components/RevenueForecastingChart";

import DateRangeFilter from "../../components/DateRangeFilter";
import BranchFilter from "../../components/BranchFilter";
import PeriodToggle from "../../components/PeriodToggle";

const Analytics = () => {
  /**
   * ==============================================
   * PAGE STATE
   * ==============================================
   */

  const [analytics, setAnalytics] = useState(null);

  const [loading, setLoading] = useState(true);

  const [startDate, setStartDate] = useState("");

  const [endDate, setEndDate] = useState("");

  const [branchId, setBranchId] = useState("");

  const [period, setPeriod] = useState("monthly");

  /**
   * ==============================================
   * LOAD ANALYTICS
   * ==============================================
   */

  const loadAnalytics = async () => {
    try {
      setLoading(true);

      const data = await getDashboardAnalytics({
        startDate,
        endDate,
        branchId,
        period,
      });

      setAnalytics(data);
    } catch (error) {
      console.error("Failed to load analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * ==============================================
   * LOAD / RELOAD ANALYTICS
   * ==============================================
   */

  useEffect(() => {
    loadAnalytics();
  }, [startDate, endDate, branchId, period]);

  /**
   * ==============================================
   * LOADING
   * ==============================================
   */

  if (loading) {
    return <p>Loading...</p>;
  }

  /**
   * ==============================================
   * EMPTY STATE
   * ==============================================
   */

  if (!analytics) {
    return <p>No analytics available.</p>;
  }

  /**
   * ==============================================
   * PAGE
   * ==============================================
   */

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold">Analytics Dashboard</h1>

      {/* ==========================================
          FILTERS
      ========================================== */}

      <div className="flex flex-wrap gap-4">
        <DateRangeFilter
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
        />

        <BranchFilter selectedBranch={branchId} onBranchChange={setBranchId} />

        <PeriodToggle selectedPeriod={period} onPeriodChange={setPeriod} />
      </div>

      {/* ==========================================
          KPI CARDS
      ========================================== */}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <TotalRevenueCard value={analytics.totalRevenue} />

        <TotalExpensesCard value={analytics.totalExpenses} />

        <NetProfitCard value={analytics.netProfit} />

        <TotalOrdersCard value={analytics.totalOrders} />
      </div>

      {/* ==========================================
          CHARTS
      ========================================== */}

      <div className="grid gap-6 lg:grid-cols-2">
        <RevenueForecastingChart
          title="Revenue Analytics"
          data={analytics.revenueDataset}
        />

        <RevenueForecastingChart
          title="Expense Analytics"
          data={analytics.expenseDataset}
        />
      </div>
    </div>
  );
};

export default Analytics;
