import { render, screen } from "@testing-library/react";
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

describe("Default Props", () => {
  it("should render with default recommendations when no prop is passed", () => {
    render(<DecisionSupportOverview />);
    expect(screen.getAllByTestId("recommendation-item").length).toBeGreaterThan(0);
  });
});

describe("DecisionSupportOverview Panel", () => {
  it("should display the panel container correctly", () => {
    render(<DecisionSupportOverview recommendations={mockRecommendations} />);
    expect(screen.getByTestId("decision-support-panel")).toBeTruthy();
  });
  it("should display the section header label", () => {
    render(<DecisionSupportOverview recommendations={mockRecommendations} />);
    expect(screen.getByText("Decision Support Overview")).toBeTruthy();
  });
  it("should display the Predictions button", () => {
    render(<DecisionSupportOverview recommendations={mockRecommendations} />);
    expect(screen.getByTestId("predictions-button")).toBeTruthy();
  });
});

describe("Recommendation Items", () => {
  it("should render all recommendation items", () => {
    render(<DecisionSupportOverview recommendations={mockRecommendations} />);
    expect(screen.getAllByTestId("recommendation-item")).toHaveLength(3);
  });
  it("should display predicted revenue", () => {
    render(<DecisionSupportOverview recommendations={mockRecommendations} />);
    expect(screen.getByText("Predicted Revenue:")).toBeTruthy();
    expect(screen.getByText("₱171")).toBeTruthy();
    expect(screen.getByText("Next Month")).toBeTruthy();
  });
  it("should display restock alerts", () => {
    render(<DecisionSupportOverview recommendations={mockRecommendations} />);
    expect(screen.getByText("ariel powder")).toBeTruthy();
    expect(screen.getByText("bleach powder")).toBeTruthy();
    expect(screen.getByText("0 days")).toBeTruthy();
    expect(screen.getByText("2 days")).toBeTruthy();
  });
  it("should display reorder details", () => {
    render(<DecisionSupportOverview recommendations={mockRecommendations} />);
    expect(screen.getByText("Reorder ~521 pcs")).toBeTruthy();
    expect(screen.getByText("Reorder ~1110 pcs")).toBeTruthy();
  });
});

describe("Buttons", () => {
  it("should render restock buttons", () => {
    render(<DecisionSupportOverview recommendations={mockRecommendations} />);
    expect(screen.getAllByTestId("restock-button")).toHaveLength(2);
  });
});

describe("Styles", () => {
  it("should apply revenue background color", () => {
    render(<DecisionSupportOverview recommendations={mockRecommendations} />);
    const items = screen.getAllByTestId("recommendation-item");
    expect(items[0].style.backgroundColor).toBe("rgb(236, 253, 245)");
  });
  it("should apply restock background color", () => {
    render(<DecisionSupportOverview recommendations={mockRecommendations} />);
    const items = screen.getAllByTestId("recommendation-item");
    expect(items[1].style.backgroundColor).toBe("rgb(255, 251, 235)");
  });
});
