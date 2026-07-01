import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import AIInsights from "../components/AIInsights";

const mockInsights = [
  {
    id: 1,
    type: "operational",
    title: "Operational Recommendation",
    description: "Focus on fulfilling active orders and ensuring items ready for pickup are promptly communicated to customers.",
  },
  {
    id: 2,
    type: "inventory",
    title: "Inventory Recommendation",
    description: "Test",
  },
  {
    id: 3,
    type: "revenue",
    title: "Revenue Improvement Idea",
    description: "Test",
  },
];

describe("AIInsights Default Props", () => {
  it("should render with default insights when no prop is passed", () => {
    render(<AIInsights />);

    const items = screen.getAllByTestId("insight-item");

    expect(items.length).toBeGreaterThan(0);
  });
});

describe("AIInsights Panel", () => {
  it("should display the panel container correctly", () => {
    render(<AIInsights insights={mockInsights} />);

    expect(screen.getByTestId("ai-insights-panel")).toBeTruthy();
  });

  it("should display the section header label", () => {
    render(<AIInsights insights={mockInsights} />);

    expect(screen.getByText("AI Insights")).toBeTruthy();
  });

  it("should display the model badge", () => {
    render(<AIInsights insights={mockInsights} />);

    expect(screen.getByTestId("model-badge")).toBeTruthy();
    expect(screen.getByText("Gemini-2.5-Flash-Lite")).toBeTruthy();
  });
});

describe("AIInsights Styles", () => {
  it("should apply correct background color for operational type", () => {
    render(<AIInsights insights={mockInsights} />);

    const items = screen.getAllByTestId("insight-item");

    expect(items[0].style.backgroundColor).toBe("rgb(238, 242, 255)");
  });

  it("should apply correct background color for inventory type", () => {
    render(<AIInsights insights={mockInsights} />);

    const items = screen.getAllByTestId("insight-item");

    expect(items[1].style.backgroundColor).toBe("rgb(255, 251, 235)");
  });

  it("should apply correct background color for revenue type", () => {
    render(<AIInsights insights={mockInsights} />);

    const items = screen.getAllByTestId("insight-item");

    expect(items[2].style.backgroundColor).toBe("rgb(236, 253, 245)");
  });
});