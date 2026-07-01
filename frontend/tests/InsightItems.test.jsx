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
    description: "Address the 2 low stock items immediately to prevent potential order delays.",
  },
  {
    id: 3,
    type: "revenue",
    title: "Revenue Improvement Idea",
    description: "Leverage the predicted low workload and the peak day of Saturday to offer a special weekend promotion.",
  },
];

describe("AIInsights Items", () => {
  it("should render all three insight items", () => {
    render(<AIInsights insights={mockInsights} />);

    expect(screen.getAllByTestId("insight-item")).toHaveLength(3);
  });

  it("should display Operational Recommendation", () => {
    render(<AIInsights insights={mockInsights} />);

    expect(screen.getByText("Operational Recommendation")).toBeTruthy();
  });

  it("should display Inventory Recommendation", () => {
    render(<AIInsights insights={mockInsights} />);

    expect(screen.getByText("Inventory Recommendation")).toBeTruthy();
  });

  it("should display Revenue Improvement Idea", () => {
    render(<AIInsights insights={mockInsights} />);

    expect(screen.getByText("Revenue Improvement Idea")).toBeTruthy();
  });

  it("should display all descriptions", () => {
    render(<AIInsights insights={mockInsights} />);

    expect(screen.getByText(/Focus on fulfilling active orders/)).toBeTruthy();
    expect(screen.getByText(/Address the 2 low stock items/)).toBeTruthy();
    expect(screen.getByText(/Leverage the predicted low workload/)).toBeTruthy();
  });
});