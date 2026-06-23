import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import DSSInsightsCard from "../components/DSSInsightsCard";

describe("DSSInsightsCard", () => {
  const insights = [
    "Revenue increased by 15%",
    "Expenses decreased by 5%",
    "Net profit is trending upward",
  ];

  it("should render DSS Insights heading", () => {
    // Arrange
    render(
      <DSSInsightsCard
        insight="Revenue increased by 15%"
      />
    );

    // Assert
    expect(
      screen.getByText("DSS Insights")
    ).toBeInTheDocument();
  });

  it.each(insights)(
    "should render insight: %s",
    (insight) => {
      // Arrange
      render(
        <DSSInsightsCard
          insight={insight}
        />
      );

      // Assert
      expect(
        screen.getByText(insight)
      ).toBeInTheDocument();
    }
  );

  it("should display default message when no insight is provided", () => {
    // Arrange
    render(<DSSInsightsCard />);

    // Assert
    expect(
      screen.getByText(
        "No insights available"
      )
    ).toBeInTheDocument();
  });

  it("should display default message when insight is undefined", () => {
    // Arrange
    render(
      <DSSInsightsCard
        insight={undefined}
      />
    );

    // Assert
    expect(
      screen.getByText(
        "No insights available"
      )
    ).toBeInTheDocument();
  });

  it("should render empty insight when an empty string is provided", () => {
    // Arrange
    render(
      <DSSInsightsCard
        insight=""
      />
    );

    // Assert
    expect(
      screen.getByText("DSS Insights")
    ).toBeInTheDocument();

    expect(
      screen.queryByText(
        "No insights available"
      )
    ).not.toBeInTheDocument();
  });
});