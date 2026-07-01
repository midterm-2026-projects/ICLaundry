import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import SuggestionsAlerts from "../components/SuggestionsAlerts";
import { mockAlerts } from "./mocks/alertMock";

describe("SuggestionsAlerts", () => {
  it("should render the Suggestions & Alerts panel", () => {
    // Arrange
    const props = {
      alerts: mockAlerts,
    };

    // Act
    render(<SuggestionsAlerts {...props} />);

    // Assert
    expect(screen.getByTestId("suggestions-alerts-panel")).toBeInTheDocument();
  });

  it("should display the section header", () => {
    // Arrange
    const props = {
      alerts: mockAlerts,
    };

    // Act
    render(<SuggestionsAlerts {...props} />);

    // Assert
    expect(screen.getByText("Suggestions & Alerts")).toBeInTheDocument();
  });

  it("should display the correct alert counter", () => {
    // Arrange
    const props = {
      alerts: mockAlerts,
    };

    // Act
    render(<SuggestionsAlerts {...props} />);

    // Assert
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("should render all alert items", () => {
    // Arrange
    const props = {
      alerts: mockAlerts,
    };

    // Act
    render(<SuggestionsAlerts {...props} />);

    // Assert
    expect(screen.getAllByTestId("alert-item")).toHaveLength(3);
  });

  it("should display an empty state when there are no alerts", () => {
    // Arrange
    const props = {
      alerts: [],
    };

    // Act
    render(<SuggestionsAlerts {...props} />);

    // Assert
    expect(screen.getByTestId("empty-state")).toBeInTheDocument();
    expect(screen.getByText("No alerts at this time.")).toBeInTheDocument();
  });
});