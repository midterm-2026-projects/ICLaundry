import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom";
import RevenueForecastingChart from "../components/RevenueForecastingChart";

describe("RevenueForecastingChart", () => {
  it("renders provided title", () => {
    // Arrange
    const mockData = [
      {
        id: 1,
        label: "Actual Revenue",
        value: "₱50,000",
      },
    ];

    // Act
    render(
      <RevenueForecastingChart
        title="Revenue Forecast"
        data={mockData}
      />
    );

    // Assert
    expect(
      screen.getByText("Revenue Forecast")
    ).toBeInTheDocument();
  });

  it("renders chart data when data is provided", () => {
    // Arrange
    const mockData = [
      {
        id: 1,
        label: "Actual Revenue",
        value: "₱50,000",
      },
      {
        id: 2,
        label: "Forecast Revenue",
        value: "₱60,000",
      },
    ];

    // Act
    render(
      <RevenueForecastingChart
        title="Revenue Forecast"
        data={mockData}
      />
    );

    // Assert
    expect(
      screen.getByText(
        "Actual Revenue: ₱50,000"
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Forecast Revenue: ₱60,000"
      )
    ).toBeInTheDocument();
  });

  it("renders no data message when data is empty", () => {
    // Arrange
    const mockData = [];

    // Act
    render(
      <RevenueForecastingChart
        title="Revenue Forecast"
        data={mockData}
      />
    );

    // Assert
    expect(
      screen.getByText(
        "No forecast data available"
      )
    ).toBeInTheDocument();
  });

  it("renders no data message when data is not provided", () => {
    // Act
    render(
      <RevenueForecastingChart
        title="Revenue Forecast"
      />
    );

    // Assert
    expect(
      screen.getByText(
        "No forecast data available"
      )
    ).toBeInTheDocument();
  });

  it("renders default title when title is not provided", () => {
    // Arrange
    const mockData = [
      {
        id: 1,
        label: "Actual Revenue",
        value: "₱50,000",
      },
    ];

    // Act
    render(
      <RevenueForecastingChart
        data={mockData}
      />
    );

    // Assert
    expect(
      screen.getByText(
        "Revenue Forecast"
      )
    ).toBeInTheDocument();
  });

  it("renders chart data when only one data point exists", () => {
    // Arrange
    const mockData = [
      {
        id: 1,
        label: "Actual Revenue",
        value: "₱50,000",
      },
    ];

    // Act
    render(
      <RevenueForecastingChart
        title="Revenue Forecast"
        data={mockData}
      />
    );

    // Assert
    expect(
      screen.getByText(
        "Actual Revenue: ₱50,000"
      )
    ).toBeInTheDocument();
  });
});