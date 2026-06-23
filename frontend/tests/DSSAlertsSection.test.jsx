import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import DSSAlertsSection from "../components/DSSAlertsSection";

describe("DSSAlertsSection", () => {
  const alerts = [
    "Revenue dropped below target",
    "Expenses exceeded threshold",
    "Order volume decreased this week",
  ];

  it.each(alerts)(
    "should render alert: %s",
    (alert) => {
      render(
        <DSSAlertsSection
          alert={alert}
        />
      );

      expect(
        screen.getByText(alert)
      ).toBeInTheDocument();
    }
  );
});