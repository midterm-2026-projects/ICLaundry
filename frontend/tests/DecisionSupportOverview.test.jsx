import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import DecisionSupportOverview from "../components/DecisionSupportOverview";

const mockRecommendations = [
  {
    id: 1,
    type: "revenue",
    label: "Predicted Revenue:",
    highlight: "₱171",
    suffix: "Next Month",
  },
  {
    id: 2,
    type: "restock",
    label: "Restock Alert:",
    highlight: "ariel powder",
    suffix: "will run out in",
    days: "0 days",
    detail: "Reorder ~521 pcs",
    actionLabel: "Restock",
  },
  {
    id: 3,
    type: "restock",
    label: "Restock Alert:",
    highlight: "bleach powder",
    suffix: "will run out in",
    days: "2 days",
    detail: "Reorder ~1110 pcs",
    actionLabel: "Restock",
  },
];

describe("DecisionSupportOverview", () => {
  it("should display the panel container correctly", () => {
    // Arrange
    const recommendations = mockRecommendations;

    // Act
    render(<DecisionSupportOverview recommendations={recommendations} />);

    // Assert
    expect(screen.getByTestId("decision-support-panel")).toBeTruthy();
  });

  it("should display the section header label", () => {
    // Arrange
    const recommendations = mockRecommendations;

    // Act
    render(<DecisionSupportOverview recommendations={recommendations} />);

    // Assert
    expect(screen.getByText("Decision Support Overview")).toBeTruthy();
  });

  it("should display the Predictions button", () => {
    // Arrange
    const recommendations = mockRecommendations;

    // Act
    render(<DecisionSupportOverview recommendations={recommendations} />);

    // Assert
    expect(screen.getByTestId("predictions-button")).toBeTruthy();
  });

  it("should render all recommendation items", () => {
    // Arrange
    const recommendations = mockRecommendations;

    // Act
    render(<DecisionSupportOverview recommendations={recommendations} />);

    // Assert
    const items = screen.getAllByTestId("recommendation-item");
    expect(items.length).toEqual(3);
  });

  it("should display predicted revenue with correct value", () => {
    // Arrange
    const recommendations = mockRecommendations;

    // Act
    render(<DecisionSupportOverview recommendations={recommendations} />);

    // Assert
    expect(screen.getByText("Predicted Revenue:")).toBeTruthy();
    expect(screen.getByText("₱171")).toBeTruthy();
    expect(screen.getByText("Next Month")).toBeTruthy();
  });

  it("should display restock alert details correctly", () => {
    // Arrange
    const recommendations = mockRecommendations;

    // Act
    render(<DecisionSupportOverview recommendations={recommendations} />);

    // Assert
    expect(screen.getByText("ariel powder")).toBeTruthy();
    expect(screen.getByText("bleach powder")).toBeTruthy();
    expect(screen.getByText("0 days")).toBeTruthy();
    expect(screen.getByText("2 days")).toBeTruthy();
  });

  it("should render restock buttons for restock-type recommendations", () => {
    // Arrange
    const recommendations = mockRecommendations;

    // Act
    render(<DecisionSupportOverview recommendations={recommendations} />);

    // Assert
    const buttons = screen.getAllByTestId("restock-button");
    expect(buttons.length).toEqual(2);
  });

  it("should apply correct background color for revenue type", () => {
    // Arrange
    const recommendations = mockRecommendations;

    // Act
    render(<DecisionSupportOverview recommendations={recommendations} />);

    // Assert
    const items = screen.getAllByTestId("recommendation-item");
    expect(items[0].style.backgroundColor).toBe("rgb(236, 253, 245)");
  });

  it("should apply correct background color for restock type", () => {
    // Arrange
    const recommendations = mockRecommendations;

    // Act
    render(<DecisionSupportOverview recommendations={recommendations} />);

    // Assert
    const items = screen.getAllByTestId("recommendation-item");
    expect(items[1].style.backgroundColor).toBe("rgb(255, 251, 235)");
    expect(items[2].style.backgroundColor).toBe("rgb(255, 251, 235)");
  });

  it("should render with default recommendations when no prop is passed", () => {
    // Arrange

    // Act
    render(<DecisionSupportOverview />);

    // Assert
    const items = screen.getAllByTestId("recommendation-item");
    expect(items.length).toBeGreaterThan(0);
  });

  it("should display reorder details for restock items", () => {
    // Arrange
    const recommendations = mockRecommendations;

    // Act
    render(<DecisionSupportOverview recommendations={recommendations} />);

    // Assert
    expect(screen.getByText("Reorder ~521 pcs")).toBeTruthy();
    expect(screen.getByText("Reorder ~1110 pcs")).toBeTruthy();
  });
});