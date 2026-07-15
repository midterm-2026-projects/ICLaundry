import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";

import Analytics from "../../src/pages/Analytics";

vi.mock("../../src/API/analyticsAPI", () => ({
  getDashboardAnalytics: vi.fn(),
}));

import { getDashboardAnalytics } from "../../src/API/analyticsAPI";

describe("Analytics Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    /**
     * Default successful backend response
     */
    getDashboardAnalytics.mockResolvedValue({
      totalRevenue: 50000,

      totalExpenses: 20000,

      netProfit: 30000,

      totalOrders: 120,

      revenueDataset: [
        {
          id: 1,
          label: "January",
          value: 5000,
        },
      ],

      expenseDataset: [
        {
          id: 1,
          label: "January",
          value: 2000,
        },
      ],
    });
  });

  /**
   * ==============================================
   * INITIAL RENDERING
   * ==============================================
   */

  describe("Initial Rendering", () => {
    it("should display loading while admin dashboard retrieves analytics", () => {
      /**
       * Real user scenario:
       *
       * Admin opens analytics page.
       * Data is still loading from backend.
       */

      getDashboardAnalytics.mockImplementation(() => new Promise(() => {}));

      render(<Analytics />);

      expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    it("should request analytics data from backend", async () => {
      /**
       * Real user scenario:
       *
       * Dashboard automatically requests
       * analytics data after opening.
       */

      render(<Analytics />);

      await waitFor(() => {
        expect(getDashboardAnalytics).toHaveBeenCalledTimes(1);
      });
    });

    it("should display dashboard KPI information", async () => {
      /**
       * Real user scenario:
       *
       * Admin views revenue,
       * expenses,
       * profit,
       * and orders.
       */

      render(<Analytics />);

      await waitFor(() => {
        expect(screen.getByText("50000")).toBeInTheDocument();

        expect(screen.getByText("20000")).toBeInTheDocument();

        expect(screen.getByText("30000")).toBeInTheDocument();

        expect(screen.getByText("120")).toBeInTheDocument();
      });
    });

    it("should display revenue analytics section", async () => {
      render(<Analytics />);

      await waitFor(() => {
        expect(
          screen.getByRole("heading", {
            name: /revenue analytics/i,
          }),
        ).toBeInTheDocument();
      });
    });

    it("should display expense analytics section", async () => {
      render(<Analytics />);

      await waitFor(() => {
        expect(
          screen.getByRole("heading", {
            name: /expense analytics/i,
          }),
        ).toBeInTheDocument();
      });
    });

    it("should render date range filters", async () => {
      render(<Analytics />);

      await waitFor(() => {
        expect(screen.getByLabelText(/start date/i)).toBeInTheDocument();

        expect(screen.getByLabelText(/end date/i)).toBeInTheDocument();
      });
    });

    it("should render branch filter", async () => {
      render(<Analytics />);

      await waitFor(() => {
        expect(screen.getByDisplayValue(/all branches/i)).toBeInTheDocument();
      });
    });

    it("should render analytics period controls", async () => {
      render(<Analytics />);

      await waitFor(() => {
        expect(
          screen.getByRole("button", {
            name: /weekly/i,
          }),
        ).toBeInTheDocument();

        expect(
          screen.getByRole("button", {
            name: /monthly/i,
          }),
        ).toBeInTheDocument();

        expect(
          screen.getByRole("button", {
            name: /yearly/i,
          }),
        ).toBeInTheDocument();
      });
    });
  });

  /**
   * ==============================================
   * ERROR HANDLING
   * ==============================================
   */

  describe("Analytics API Error Handling", () => {
    it("should show fallback message when backend service is unavailable", async () => {
      /**
       * Real user scenario:
       *
       * Admin opens dashboard,
       * but analytics backend is down.
       *
       * Application should not crash.
       */

      getDashboardAnalytics.mockRejectedValue(
        new Error("Analytics service unavailable"),
      );

      render(<Analytics />);

      await waitFor(() => {
        expect(screen.getByText(/no analytics available/i)).toBeInTheDocument();
      });
    });

    it("should handle server error response", async () => {
      /**
       * Real user scenario:
       *
       * Server returns an error.
       * Dashboard displays safe fallback.
       */

      getDashboardAnalytics.mockRejectedValue(new Error("Server error"));

      render(<Analytics />);

      await waitFor(() => {
        expect(screen.getByText(/no analytics available/i)).toBeInTheDocument();
      });
    });

    it("should handle network failure", async () => {
      /**
       * Real user scenario:
       *
       * Internet connection fails
       * while loading analytics.
       */

      getDashboardAnalytics.mockRejectedValue(new Error("Network failed"));

      render(<Analytics />);

      await waitFor(() => {
        expect(screen.getByText(/no analytics available/i)).toBeInTheDocument();
      });
    });
  });

  /**
   * ==============================================
   * EMPTY DATA HANDLING
   * ==============================================
   */

  describe("Empty Analytics Data", () => {
    it("should handle empty analytics response", async () => {
      /**
       * Real user scenario:
       *
       * New business has no transactions yet.
       */

      getDashboardAnalytics.mockResolvedValue(null);

      render(<Analytics />);

      await waitFor(() => {
        expect(screen.getByText(/no analytics available/i)).toBeInTheDocument();
      });
    });

    it("should prevent dashboard crash when datasets are empty", async () => {
      /**
       * Real user scenario:
       *
       * New laundry business has no transactions yet.
       * Admin opens analytics dashboard.
       * System should display empty KPI values instead of crashing.
       */

      getDashboardAnalytics.mockResolvedValue({
        totalRevenue: 0,

        totalExpenses: 0,

        netProfit: 0,

        totalOrders: 0,

        revenueDataset: [],

        expenseDataset: [],
      });

      render(<Analytics />);

      await waitFor(() => {
        expect(screen.getByText("Total Revenue")).toBeInTheDocument();

        expect(screen.getByText("Total Expenses")).toBeInTheDocument();

        expect(screen.getByText("Net Profit")).toBeInTheDocument();

        expect(screen.getByText("Total Orders")).toBeInTheDocument();

        expect(screen.getAllByText("0")).toHaveLength(4);
      });
    });
  });
});
