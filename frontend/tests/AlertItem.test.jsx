import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import AlertItem from "../components/AlertItem";

const mockAlert = {
  id: 1,
  type: "critical",
  title: "Out of Stock",
  description: "Out of stock description",
  actionLabel: "Restock Now",
};

describe("AlertItem", () => {
  it("should render the alert title and description correctly", () => {
    // Arrange
    const props = {
      alert: mockAlert,
      onDismiss: vi.fn(),
      onAction: vi.fn(),
      isLast: false,
    };

    // Act
    render(<AlertItem {...props} />);

    // Assert
    expect(screen.getByText("Out of Stock")).toBeInTheDocument();
    expect(screen.getByText("Out of stock description")).toBeInTheDocument();
  });

  it("should render the action button", () => {
    // Arrange
    const props = {
      alert: mockAlert,
      onDismiss: vi.fn(),
      onAction: vi.fn(),
      isLast: false,
    };

    // Act
    render(<AlertItem {...props} />);

    // Assert
    expect(screen.getByTestId("action-button")).toBeInTheDocument();
  });

  it("should render the dismiss button", () => {
    // Arrange
    const props = {
      alert: mockAlert,
      onDismiss: vi.fn(),
      onAction: vi.fn(),
      isLast: false,
    };

    // Act
    render(<AlertItem {...props} />);

    // Assert
    expect(screen.getByTestId("dismiss-button")).toBeInTheDocument();
  });

  it("should render the correct alert icon", () => {
    // Arrange
    const props = {
      alert: mockAlert,
      onDismiss: vi.fn(),
      onAction: vi.fn(),
      isLast: false,
    };

    // Act
    render(<AlertItem {...props} />);

    // Assert
    expect(screen.getByTestId("alert-dot-critical")).toBeInTheDocument();
  });

  it("should add a bottom border when the alert is not the last item", () => {
    // Arrange
    const props = {
      alert: mockAlert,
      onDismiss: vi.fn(),
      onAction: vi.fn(),
      isLast: false,
    };

    // Act
    render(<AlertItem {...props} />);

    // Assert
    expect(screen.getByTestId("alert-item").className).toContain("border-b");
  });

  it("should remove the bottom border when the alert is the last item", () => {
    // Arrange
    const props = {
      alert: mockAlert,
      onDismiss: vi.fn(),
      onAction: vi.fn(),
      isLast: true,
    };

    // Act
    render(<AlertItem {...props} />);

    // Assert
    expect(screen.getByTestId("alert-item").className).not.toContain("border-b");
  });

  it("should apply the correct background class for a critical alert", () => {
    // Arrange
    const props = {
      alert: mockAlert,
      onDismiss: vi.fn(),
      onAction: vi.fn(),
      isLast: false,
    };

    // Act
    render(<AlertItem {...props} />);

    // Assert
    expect(screen.getByTestId("alert-item").className).toContain("bg-red-50");
  });
});