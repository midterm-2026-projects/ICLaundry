import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import UnitColumn from "../components/UnitColumn";

describe("UnitColumn", () => {
  it("should display kilogram unit", () => {
    // Arrange
    render(
      <UnitColumn
        unit="kg"
      />
    );

    // Act
    const result =
      screen.getByText("kg");

    // Assert
    expect(result)
      .toBeInTheDocument();
  });

  it("should display liter unit", () => {
    // Arrange
    render(
      <UnitColumn
        unit="L"
      />
    );

    // Act
    const result =
      screen.getByText("L");

    // Assert
    expect(result)
      .toBeInTheDocument();
  });
});