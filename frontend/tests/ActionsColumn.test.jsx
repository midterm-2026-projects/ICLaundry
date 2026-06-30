import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import ActionsColumn from "../components/ActionsColumn";

describe("ActionsColumn", () => {
  it("should display Edit button", () => {
    // Arrange
    render(
      <ActionsColumn
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />
    );

    // Act
    const button =
      screen.getByRole(
        "button",
        {
          name: /edit/i,
        }
      );

    // Assert
    expect(button)
      .toBeInTheDocument();
  });

  it("should display Delete button", () => {
    // Arrange
    render(
      <ActionsColumn
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />
    );

    // Act
    const button =
      screen.getByRole(
        "button",
        {
          name: /delete/i,
        }
      );

    // Assert
    expect(button)
      .toBeInTheDocument();
  });

  it("should call onEdit when Edit button is clicked", async () => {
    // Arrange
    const user =
      userEvent.setup();

    const handleEdit =
      vi.fn();

    render(
      <ActionsColumn
        onEdit={handleEdit}
        onDelete={vi.fn()}
      />
    );

    const button =
      screen.getByRole(
        "button",
        {
          name: /edit/i,
        }
      );

    // Act
    await user.click(
      button
    );

    // Assert
    expect(handleEdit)
      .toHaveBeenCalled();
  });

  it("should call onDelete when Delete button is clicked", async () => {
    // Arrange
    const user =
      userEvent.setup();

    const handleDelete =
      vi.fn();

    render(
      <ActionsColumn
        onEdit={vi.fn()}
        onDelete={
          handleDelete
        }
      />
    );

    const button =
      screen.getByRole(
        "button",
        {
          name: /delete/i,
        }
      );

    // Act
    await user.click(
      button
    );

    // Assert
    expect(handleDelete)
      .toHaveBeenCalled();
  });
});