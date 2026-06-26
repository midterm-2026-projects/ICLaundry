import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom";
import NetProfitCard from "../components/NetProfitCard";

describe("NetProfitCard", () => {
  it("renders provided net profit value", () => {
    // Arrange
    const value = "₱20,000";

    // Act
    render(
      <NetProfitCard value={value} />
    );

    // Assert
    expect(
      screen.getByText("Net Profit")
    ).toBeInTheDocument();

    expect(
      screen.getByText(value)
    ).toBeInTheDocument();
  });

  it("renders another provided net profit value", () => {
    // Arrange
    const value = "₱35,000";

    // Act
    render(
      <NetProfitCard value={value} />
    );

    // Assert
    expect(
      screen.getByText("Net Profit")
    ).toBeInTheDocument();

    expect(
      screen.getByText(value)
    ).toBeInTheDocument();
  });

  it("renders large net profit value", () => {
    // Arrange
    const value = "₱80,000";

    // Act
    render(
      <NetProfitCard value={value} />
    );

    // Assert
    expect(
      screen.getByText("Net Profit")
    ).toBeInTheDocument();

    expect(
      screen.getByText(value)
    ).toBeInTheDocument();
  });

  it("renders default value when value is not provided", () => {
    // Act
    render(<NetProfitCard />);

    // Assert
    expect(
      screen.getByText("Net Profit")
    ).toBeInTheDocument();

    expect(
      screen.getByText("₱0")
    ).toBeInTheDocument();
  });

  it("renders default value when value is undefined", () => {
    // Act
    render(
      <NetProfitCard
        value={undefined}
      />
    );

    // Assert
    expect(
      screen.getByText("Net Profit")
    ).toBeInTheDocument();

    expect(
      screen.getByText("₱0")
    ).toBeInTheDocument();
  });

  it("renders empty value when empty string is provided", () => {
    // Act
    render(
      <NetProfitCard value="" />
    );

    // Assert
    expect(
      screen.getByText("Net Profit")
    ).toBeInTheDocument();
  });
});