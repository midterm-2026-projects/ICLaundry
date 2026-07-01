import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import PriceBreakdownCard from "../components/PriceBreakdownCard";

describe("PriceBreakdownCard", () => {
  it("should display price breakdown heading", () => {
    // Arrange
    render(
      <PriceBreakdownCard
        laundryCost={200}
        totalAmount={350}
      />
    );

    // Act
    const heading = screen.getByText("Price Breakdown");

    // Assert
    expect(heading).toBeInTheDocument();
  });

  it("should display laundry cost", () => {
    // Arrange
    render(
      <PriceBreakdownCard
        laundryCost={200}
        totalAmount={350}
      />
    );

    // Act
    const value = screen.getByText("₱200");

    // Assert
    expect(value).toBeInTheDocument();
  });

  it("should display total amount", () => {
    // Arrange
    render(
      <PriceBreakdownCard
        laundryCost={200}
        totalAmount={350}
      />
    );

    // Act
    const value = screen.getByText("₱350");

    // Assert
    expect(value).toBeInTheDocument();
  });

  it("should display zero values", () => {
    // Arrange
    render(
      <PriceBreakdownCard
        laundryCost={0}
        totalAmount={0}
      />
    );

    // Act
    const values = screen.getAllByText("₱0");

    // Assert
    expect(values).toHaveLength(2);
  });
});