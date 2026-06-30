import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import SuggestionsAlerts from "../components/SuggestionsAlerts";

const mockAlerts = [
  {
    id: 1,
    type: "critical",
    title: "Out of Stock",
    description:
      "Drip-dry concentrate — 1 unit has been out of stock since yesterday.",
    actionLabel: "Restock Now",
  },
  {
    id: 2,
    type: "warning",
    title: "Restock Needed",
    description:
      "Washing detergent (Powder) at 3% stock (40 units). Consider restocking soon.",
    actionLabel: "Restock Now",
  },
  {
    id: 3,
    type: "info",
    title: "3 Orders Ready for Pickup",
    description:
      "Send email notifications to customers about their completed laundry.",
    actionLabel: "Send Notifications",
  },
];

describe("SuggestionsAlerts", () => {
  it("should create and display the Suggestions & Alerts section container properly", () => {
    // Arrange
    const props = { alerts: mockAlerts };

    // Act
    render(<SuggestionsAlerts {...props} />);

    // Assert
    expect(screen.getByTestId("suggestions-alerts-panel")).toBeTruthy();
  });

  it("should display the section header and label accurately", () => {
    // Arrange
    const props = { alerts: mockAlerts };

    // Act
    render(<SuggestionsAlerts {...props} />);

    // Assert
    expect(screen.getByText("Suggestions & Alerts")).toBeTruthy();
  });

  it("should show color-coded alert categories: Red (Critical), Yellow (Warning), Blue (Info)", () => {
    // Arrange
    const props = { alerts: mockAlerts };

    // Act
    render(<SuggestionsAlerts {...props} />);

    // Assert
    expect(screen.getByTestId("alert-dot-critical")).toBeTruthy();
    expect(screen.getByTestId("alert-dot-warning")).toBeTruthy();
    expect(screen.getByTestId("alert-dot-info")).toBeTruthy();
  });

  it("should render alert item components with message text and action buttons correctly", () => {
    // Arrange
    const props = { alerts: mockAlerts };

    // Act
    render(<SuggestionsAlerts {...props} />);
    const alertItems = screen.getAllByTestId("alert-item");

    // Assert
    expect(alertItems).toHaveLength(3);
  });

  it("should display alert titles and descriptions", () => {
    // Arrange
    const props = { alerts: mockAlerts };

    // Act
    render(<SuggestionsAlerts {...props} />);

    // Assert
    expect(screen.getByText("Out of Stock")).toBeTruthy();
    expect(screen.getByText("Restock Needed")).toBeTruthy();
    expect(screen.getByText("3 Orders Ready for Pickup")).toBeTruthy();
  });

  it("should add horizontal divider lines between each alert item", () => {
    // Arrange
    const props = { alerts: mockAlerts };

    // Act
    render(<SuggestionsAlerts {...props} />);
    const alertItems = screen.getAllByTestId("alert-item");

    // Assert
    alertItems.slice(0, -1).forEach((item) => {
      expect(item.className).toContain("border-b");
    });
  });

  it("should apply correct background colors to match the design", () => {
    // Arrange
    const props = { alerts: mockAlerts };

    // Act
    render(<SuggestionsAlerts {...props} />);
    const alertItems = screen.getAllByTestId("alert-item");

    // Assert
    expect(alertItems[0].className).toContain("bg-red-50");
    expect(alertItems[1].className).toContain("bg-yellow-50");
    expect(alertItems[2].className).toContain("bg-blue-50");
  });
});