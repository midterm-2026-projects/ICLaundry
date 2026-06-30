import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import StockStatusBadge from "../components/StockStatusBadge";

describe("StockStatusBadge", () => {
  it("should display Low badge when stock is below minimum", () => {
    // Arrange
    render(
      <StockStatusBadge
        quantity={5}
        minimumStock={10}
      />
    );

    // Act
    const badge =
      screen.getByText("Low");

    // Assert
    expect(badge)
      .toBeInTheDocument();
  });

  it("should display Low badge when stock equals minimum", () => {
    // Arrange
    render(
      <StockStatusBadge
        quantity={10}
        minimumStock={10}
      />
    );

    // Act
    const badge =
      screen.getByText("Low");

    // Assert
    expect(badge)
      .toBeInTheDocument();
  });

  it("should display OK badge when stock is above minimum", () => {
    // Arrange
    render(
      <StockStatusBadge
        quantity={25}
        minimumStock={10}
      />
    );

    // Act
    const badge =
      screen.getByText("OK");

    // Assert
    expect(badge)
      .toBeInTheDocument();
  });

  it("should display only one stock status", () => {
    // Arrange
    render(
      <StockStatusBadge
        quantity={20}
        minimumStock={10}
      />
    );

    // Act
    const badge =
      screen.getByText("OK");

    // Assert
    expect(badge)
      .toBeInTheDocument();
  });
});