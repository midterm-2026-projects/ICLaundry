import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import TimeLeftDisplay from "../components/TimeLeftDisplay";

describe("TimeLeftDisplay", () => {
  it("should display remaining time", () => {
    // Arrange
    render(<TimeLeftDisplay timeLeft="2 hrs" />);

    // Act
    const result = screen.getByText("2 hrs");

    // Assert
    expect(result).toBeInTheDocument();
  });

  it("should display days remaining", () => {
    // Arrange
    render(<TimeLeftDisplay timeLeft="1 day" />);

    // Act
    const result = screen.getByText("1 day");

    // Assert
    expect(result).toBeInTheDocument();
  });

  it("should display completed status", () => {
    // Arrange
    render(<TimeLeftDisplay timeLeft="Completed" />);

    // Act
    const result = screen.getByText("Completed");

    // Assert
    expect(result).toBeInTheDocument();
  });
});