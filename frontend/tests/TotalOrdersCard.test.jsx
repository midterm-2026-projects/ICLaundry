import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom";
import TotalOrdersCard from "../components/TotalOrdersCard";

describe("TotalOrdersCard", () => {
  it("renders provided order value", () => {
    // Arrange
    const value = 10;

    // Act
    render(
      <TotalOrdersCard value={value} />
    );

    // Assert
    expect(
      screen.getByText("Total Orders")
    ).toBeInTheDocument();

    expect(
      screen.getByText("10")
    ).toBeInTheDocument();
  });

  it("renders another order value", () => {
    // Arrange
    const value = 50;

    // Act
    render(
      <TotalOrdersCard value={value} />
    );

    // Assert
    expect(
      screen.getByText("50")
    ).toBeInTheDocument();
  });

  it("renders large order value", () => {
    // Arrange
    const value = 100;

    // Act
    render(
      <TotalOrdersCard value={value} />
    );

    // Assert
    expect(
      screen.getByText("100")
    ).toBeInTheDocument();
  });

  it("renders default value when value is not provided", () => {
    // Act
    render(<TotalOrdersCard />);

    // Assert
    expect(
      screen.getByText("0")
    ).toBeInTheDocument();
  });

  it("renders default value when value is undefined", () => {
    // Act
    render(
      <TotalOrdersCard
        value={undefined}
      />
    );

    // Assert
    expect(
      screen.getByText("0")
    ).toBeInTheDocument();
  });

  it("renders empty value when empty string is provided", () => {
    // Act
    render(
      <TotalOrdersCard value="" />
    );

    // Assert
    expect(
      screen.getByText("Total Orders")
    ).toBeInTheDocument();
  });
});