import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import StatusTracker from "../components/StatusTracker";

describe("StatusTracker", () => {
  it("should display order status heading", () => {
    // Arrange
    render(<StatusTracker currentStatus="Pending" />);

    // Act
    const heading = screen.getByText("Order Status");

    // Assert
    expect(heading).toBeInTheDocument();
  });

  it("should display current status", () => {
    // Arrange
    render(<StatusTracker currentStatus="Washing" />);

    // Act
    const status = screen.getAllByText("Washing");

    // Assert
    expect(status).toHaveLength(2);
  });

  it("should display order progress heading", () => {
    // Arrange
    render(<StatusTracker currentStatus="Pending" />);

    // Act
    const heading = screen.getByText("Order Progress");

    // Assert
    expect(heading).toBeInTheDocument();
  });

  it("should display all workflow statuses", () => {
    // Arrange
    render(<StatusTracker currentStatus="Pending" />);

    // Act
    const steps = screen.getAllByRole("listitem");

    // Assert
    expect(steps).toHaveLength(6);
  });

 it("should highlight current status", () => {
  // Arrange
  render(<StatusTracker currentStatus="Drying" />);

  // Act
  const statuses = screen.getAllByText("Drying");

  // Assert
  expect(statuses).toHaveLength(2);

  expect(statuses[1]).toHaveStyle({
    fontWeight: "bold",
  });
});
});