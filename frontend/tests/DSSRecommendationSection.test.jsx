import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import DSSRecommendationSection from "../components/DSSRecommendationSection";

describe("DSSRecommendationSection", () => {
  const recommendations = [
    "Increase marketing budget",
    "Reduce operating expenses",
    "Focus on top-performing products",
  ];

  it.each(recommendations)(
    "should render recommendation: %s",
    (recommendation) => {
      render(
        <DSSRecommendationSection
          recommendation={recommendation}
        />
      );

      expect(
        screen.getByText(recommendation)
      ).toBeInTheDocument();
    }
  );
});