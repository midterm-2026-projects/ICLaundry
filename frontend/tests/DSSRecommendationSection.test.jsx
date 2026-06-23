import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import DSSRecommendationSection from "../components/DSSRecommendationSection";

describe("DSSRecommendationSection", () => {
  const recommendations = [
    "Increase marketing budget",
    "Reduce operating expenses",
    "Focus on top-performing products",
  ];

  it("should render DSS Recommendations heading", () => {
    // Arrange
    render(
      <DSSRecommendationSection
        recommendation="Increase marketing budget"
      />
    );

    // Assert
    expect(
      screen.getByText("DSS Recommendations")
    ).toBeInTheDocument();
  });

  it.each(recommendations)(
    "should render recommendation: %s",
    (recommendation) => {
      // Arrange
      render(
        <DSSRecommendationSection
          recommendation={recommendation}
        />
      );

      // Assert
      expect(
        screen.getByText(recommendation)
      ).toBeInTheDocument();
    }
  );

  it("should display default message when no recommendation is provided", () => {
    // Arrange
    render(<DSSRecommendationSection />);

    // Assert
    expect(
      screen.getByText(
        "No recommendations available"
      )
    ).toBeInTheDocument();
  });

  it("should display default message when recommendation is undefined", () => {
    // Arrange
    render(
      <DSSRecommendationSection
        recommendation={undefined}
      />
    );

    // Assert
    expect(
      screen.getByText(
        "No recommendations available"
      )
    ).toBeInTheDocument();
  });

  it("should render empty recommendation when an empty string is provided", () => {
    // Arrange
    render(
      <DSSRecommendationSection
        recommendation=""
      />
    );

    // Assert
    expect(
      screen.getByText(
        "DSS Recommendations"
      )
    ).toBeInTheDocument();

    expect(
      screen.queryByText(
        "No recommendations available"
      )
    ).not.toBeInTheDocument();
  });
});