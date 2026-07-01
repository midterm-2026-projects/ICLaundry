import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import Pagination from "../components/Pagination";

describe("Pagination", () => {
  it("should display current page and total pages", () => {
    // Arrange
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPrevious={vi.fn()}
        onNext={vi.fn()}
      />
    );

    // Act
    const pageInfo =
      screen.getByText(
        "Page 1 of 5"
      );

    // Assert
    expect(pageInfo)
      .toBeInTheDocument();
  });

  it("should display Previous button", () => {
    // Arrange
    render(
      <Pagination
        currentPage={2}
        totalPages={5}
        onPrevious={vi.fn()}
        onNext={vi.fn()}
      />
    );

    // Act
    const button =
      screen.getByRole(
        "button",
        {
          name: /previous/i,
        }
      );

    // Assert
    expect(button)
      .toBeInTheDocument();
  });

  it("should display Next button", () => {
    // Arrange
    render(
      <Pagination
        currentPage={2}
        totalPages={5}
        onPrevious={vi.fn()}
        onNext={vi.fn()}
      />
    );

    // Act
    const button =
      screen.getByRole(
        "button",
        {
          name: /next/i,
        }
      );

    // Assert
    expect(button)
      .toBeInTheDocument();
  });

  it("should call onPrevious when Previous button is clicked", async () => {
    // Arrange
    const user =
      userEvent.setup();

    const handlePrevious =
      vi.fn();

    render(
      <Pagination
        currentPage={2}
        totalPages={5}
        onPrevious={
          handlePrevious
        }
        onNext={vi.fn()}
      />
    );

    const button =
      screen.getByRole(
        "button",
        {
          name: /previous/i,
        }
      );

    // Act
    await user.click(
      button
    );

    // Assert
    expect(
      handlePrevious
    ).toHaveBeenCalled();
  });

  it("should call onNext when Next button is clicked", async () => {
    // Arrange
    const user =
      userEvent.setup();

    const handleNext =
      vi.fn();

    render(
      <Pagination
        currentPage={2}
        totalPages={5}
        onPrevious={vi.fn()}
        onNext={handleNext}
      />
    );

    const button =
      screen.getByRole(
        "button",
        {
          name: /next/i,
        }
      );

    // Act
    await user.click(
      button
    );

    // Assert
    expect(handleNext)
      .toHaveBeenCalled();
  });

  it("should disable Previous button on first page", () => {
    // Arrange
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPrevious={vi.fn()}
        onNext={vi.fn()}
      />
    );

    // Act
    const button =
      screen.getByRole(
        "button",
        {
          name: /previous/i,
        }
      );

    // Assert
    expect(button)
      .toBeDisabled();
  });

  it("should disable Next button on last page", () => {
    // Arrange
    render(
      <Pagination
        currentPage={5}
        totalPages={5}
        onPrevious={vi.fn()}
        onNext={vi.fn()}
      />
    );

    // Act
    const button =
      screen.getByRole(
        "button",
        {
          name: /next/i,
        }
      );

    // Assert
    expect(button)
      .toBeDisabled();
  });

  it("should display single page correctly", () => {
    // Arrange
    render(
      <Pagination
        currentPage={1}
        totalPages={1}
        onPrevious={vi.fn()}
        onNext={vi.fn()}
      />
    );

    // Act
    const pageInfo =
      screen.getByText(
        "Page 1 of 1"
      );

    // Assert
    expect(pageInfo)
      .toBeInTheDocument();
  });
});