import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import ItemNameColumn from "../components/ItemNameColumn";

describe("ItemNameColumn", () => {
  it("should display item name", () => {
    // Arrange
    render(
      <ItemNameColumn
        itemName="Ariel Detergent"
      />
    );

    // Act
    const result =
      screen.getByText(
        "Ariel Detergent"
      );

    // Assert
    expect(result)
      .toBeInTheDocument();
  });

  it("should display fabric conditioner item", () => {
    // Arrange
    render(
      <ItemNameColumn
        itemName="Downy"
      />
    );

    // Act
    const result =
      screen.getByText("Downy");

    // Assert
    expect(result)
      .toBeInTheDocument();
  });
});