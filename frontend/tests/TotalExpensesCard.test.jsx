import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom";
import TotalExpensesCard from "../components/TotalExpensesCard";

describe("TotalExpensesCard", () => {
  it("renders provided expense value", () => {
    // Arrange
    const value = "₱10,000";

    // Act
    render(
      <TotalExpensesCard value={value} />
    );

    // Assert
    expect(
      screen.getByText("Total Expenses")
    ).toBeInTheDocument();

    expect(
      screen.getByText(value)
    ).toBeInTheDocument();
  });

  it("renders another expense value", () => {
    // Arrange
    const value = "₱25,000";

    // Act
    render(
      <TotalExpensesCard value={value} />
    );

    // Assert
    expect(
      screen.getByText(value)
    ).toBeInTheDocument();
  });

  it("renders large expense value", () => {
    // Arrange
    const value = "₱40,000";

    // Act
    render(
      <TotalExpensesCard value={value} />
    );

    // Assert
    expect(
      screen.getByText(value)
    ).toBeInTheDocument();
  });

  it("renders default value when value is not provided", () => {
    // Act
    render(<TotalExpensesCard />);

    // Assert
    expect(
      screen.getByText("₱0")
    ).toBeInTheDocument();
  });

  it("renders default value when value is undefined", () => {
    // Act
    render(
      <TotalExpensesCard
        value={undefined}
      />
    );

    // Assert
    expect(
      screen.getByText("₱0")
    ).toBeInTheDocument();
  });

  it("renders empty value when empty string is provided", () => {
    // Act
    render(
      <TotalExpensesCard value="" />
    );

    // Assert
    expect(
      screen.getByText("Total Expenses")
    ).toBeInTheDocument();
  });
});