import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom";
import TotalRevenueCard from "../components/TotalRevenueCard";

describe("TotalRevenueCard", () => {
  it("renders provided revenue value", () => {
    // Arrange
    const value = "₱50,000";

    // Act
    render(
      <TotalRevenueCard value={value} />
    );

    // Assert
    expect(
      screen.getByText("Total Revenue")
    ).toBeInTheDocument();

    expect(
      screen.getByText(value)
    ).toBeInTheDocument();
  });

  it("renders another revenue value", () => {
    // Arrange
    const value = "₱100,000";

    // Act
    render(
      <TotalRevenueCard value={value} />
    );

    // Assert
    expect(
      screen.getByText(value)
    ).toBeInTheDocument();
  });

  it("renders large revenue value", () => {
    // Arrange
    const value = "₱150,000";

    // Act
    render(
      <TotalRevenueCard value={value} />
    );

    // Assert
    expect(
      screen.getByText(value)
    ).toBeInTheDocument();
  });

  it("renders default value when value is not provided", () => {
    // Act
    render(<TotalRevenueCard />);

    // Assert
    expect(
      screen.getByText("₱0")
    ).toBeInTheDocument();
  });

  it("renders default value when value is undefined", () => {
    // Act
    render(
      <TotalRevenueCard
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
      <TotalRevenueCard value="" />
    );

    // Assert
    expect(
      screen.getByText("Total Revenue")
    ).toBeInTheDocument();
  });
});