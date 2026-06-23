import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import RevenueForecastingChart from "../components/RevenueForecastingChart";

describe("RevenueForecastingChart", () => {
  const chartData = [
    {
      title: "Revenue Forecast",
      legend: "Actual Revenue",
    },
    {
      title: "Revenue Forecast",
      legend: "Forecast Revenue",
    },
  ];

  it.each(chartData)(
    "should render $legend",
    ({ title, legend }) => {
      render(
        <RevenueForecastingChart
          title={title}
        />
      );

      expect(
        screen.getByText(legend)
      ).toBeInTheDocument();
    }
  );
});