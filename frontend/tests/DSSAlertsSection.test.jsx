import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import DSSAlertsSection from "../components/DSSAlertsSection";

describe("DSSAlertsSection", () => {
  const alerts = [
    "Revenue dropped below target",
    "Expenses exceeded threshold",
    "Order volume decreased this week",
  ];

  it("should render DSS Alerts heading", () => {
    // Arrange
    render(
      <DSSAlertsSection
        alert="Revenue dropped below target"
      />
    );

    // Assert
    expect(
      screen.getByText("DSS Alerts")
    ).toBeInTheDocument();
  });

  it.each(alerts)(
    "should render alert: %s",
    (alert) => {
      // Arrange
      render(
        <DSSAlertsSection
          alert={alert}
        />
      );

      // Assert
      expect(
        screen.getByText(alert)
      ).toBeInTheDocument();
    }
  );

  it("should display default message when no alert is provided", () => {
    // Arrange
    render(<DSSAlertsSection />);

    // Assert
    expect(
      screen.getByText(
        "No alerts available"
      )
    ).toBeInTheDocument();
  });

  it("should display default message when alert is undefined", () => {
    // Arrange
    render(
      <DSSAlertsSection
        alert={undefined}
      />
    );

    // Assert
    expect(
      screen.getByText(
        "No alerts available"
      )
    ).toBeInTheDocument();
  });

  it("should render empty alert when an empty string is provided", () => {
    // Arrange
    render(
      <DSSAlertsSection
        alert=""
      />
    );

    // Assert
    expect(
      screen.getByText("DSS Alerts")
    ).toBeInTheDocument();

    expect(
      screen.queryByText(
        "No alerts available"
      )
    ).not.toBeInTheDocument();
  });
});