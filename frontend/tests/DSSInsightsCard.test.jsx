import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import DSSInsightsCard from "../components/DSSInsightsCard";

describe("DSSInsightsCard", () => {
  const insights = [
    "Revenue increased by 15%",
    "Expenses decreased by 5%",
    "Net profit is trending upward",
  ];

  it.each(insights)(
    "should render insight: %s",
    (insight) => {
      render(
        <DSSInsightsCard
          insight={insight}
        />
      );

      expect(
        screen.getByText(insight)
      ).toBeInTheDocument();
    }
  );
});