import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import CategoryColumn from "../components/CategoryColumn";

describe("CategoryColumn", () => {
  it("should display category", () => {
    // Arrange
    render(
      <CategoryColumn
        category="Detergent"
      />
    );

    // Act
    const result =
      screen.getByText(
        "Detergent"
      );

    // Assert
    expect(result)
      .toBeInTheDocument();
  });

  it("should display chemical category", () => {
    // Arrange
    render(
      <CategoryColumn
        category="Chemical"
      />
    );

    // Act
    const result =
      screen.getByText(
        "Chemical"
      );

    // Assert
    expect(result)
      .toBeInTheDocument();
  });
});