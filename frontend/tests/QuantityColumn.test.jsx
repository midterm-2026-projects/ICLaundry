import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import QuantityColumn from "../components/QuantityColumn";

describe("QuantityColumn", () => {
  it("should display quantity", () => {
    // Arrange
    render(
      <QuantityColumn
        quantity={50}
      />
    );

    // Act
    const result =
      screen.getByText("50");

    // Assert
    expect(result)
      .toBeInTheDocument();
  });

  it("should display zero quantity", () => {
    // Arrange
    render(
      <QuantityColumn
        quantity={0}
      />
    );

    // Act
    const result =
      screen.getByText("0");

    // Assert
    expect(result)
      .toBeInTheDocument();
  });
});