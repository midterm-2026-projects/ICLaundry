import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import InventoryTable from "../components/InventoryTable";

describe("InventoryTable", () => {
  const mockInventory = [
    {
      id: 1,
      itemName:
        "Ariel Detergent",
      category:
        "Detergent",
      quantity: 25,
      minimumStock: 10,
      unit: "kg",
    },
    {
      id: 2,
      itemName: "Downy",
      category:
        "Fabric Conditioner",
      quantity: 5,
      minimumStock: 10,
      unit: "L",
    },
  ];

  it("should display inventory table", () => {
    // Arrange
    render(
      <InventoryTable
        inventory={
          mockInventory
        }
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />
    );

    // Act
    const table =
      screen.getByRole(
        "table"
      );

    // Assert
    expect(table)
      .toBeInTheDocument();
  });

  it("should display table headers", () => {
    // Arrange
    render(
      <InventoryTable
        inventory={
          mockInventory
        }
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />
    );

    // Act
    const item =
      screen.getByText(
        "Item Name"
      );

    const category =
      screen.getByText(
        "Category"
      );

    const quantity =
      screen.getByText(
        "Quantity"
      );

    const unit =
      screen.getByText(
        "Unit"
      );

    const status =
      screen.getByText(
        "Status"
      );

    const actions =
      screen.getByText(
        "Actions"
      );

    // Assert
    expect(item)
      .toBeInTheDocument();

    expect(category)
      .toBeInTheDocument();

    expect(quantity)
      .toBeInTheDocument();

    expect(unit)
      .toBeInTheDocument();

    expect(status)
      .toBeInTheDocument();

    expect(actions)
      .toBeInTheDocument();
  });

  it("should display inventory records", () => {
    // Arrange
    render(
      <InventoryTable
        inventory={
          mockInventory
        }
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />
    );

    // Act
    const detergent =
      screen.getByText(
        "Ariel Detergent"
      );

    const downy =
      screen.getByText(
        "Downy"
      );

    // Assert
    expect(detergent)
      .toBeInTheDocument();

    expect(downy)
      .toBeInTheDocument();
  });

  it("should display stock status badges", () => {
    // Arrange
    render(
      <InventoryTable
        inventory={
          mockInventory
        }
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />
    );

    // Act
    const ok =
      screen.getByText("OK");

    const low =
      screen.getByText("Low");

    // Assert
    expect(ok)
      .toBeInTheDocument();

    expect(low)
      .toBeInTheDocument();
  });

  it("should display Edit buttons", () => {
    // Arrange
    render(
      <InventoryTable
        inventory={
          mockInventory
        }
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />
    );

    // Act
    const buttons =
      screen.getAllByRole(
        "button",
        {
          name: /edit/i,
        }
      );

    // Assert
    expect(buttons)
      .toHaveLength(2);
  });

  it("should display Delete buttons", () => {
    // Arrange
    render(
      <InventoryTable
        inventory={
          mockInventory
        }
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />
    );

    // Act
    const buttons =
      screen.getAllByRole(
        "button",
        {
          name: /delete/i,
        }
      );

    // Assert
    expect(buttons)
      .toHaveLength(2);
  });

  it("should call onEdit when Edit button is clicked", async () => {
    // Arrange
    const user =
      userEvent.setup();

    const handleEdit =
      vi.fn();

    render(
      <InventoryTable
        inventory={
          mockInventory
        }
        onEdit={handleEdit}
        onDelete={vi.fn()}
      />
    );

    const buttons =
      screen.getAllByRole(
        "button",
        {
          name: /edit/i,
        }
      );

    // Act
    await user.click(
      buttons[0]
    );

    // Assert
    expect(handleEdit)
      .toHaveBeenCalledWith(
        mockInventory[0]
      );
  });

  it("should call onDelete when Delete button is clicked", async () => {
    // Arrange
    const user =
      userEvent.setup();

    const handleDelete =
      vi.fn();

    render(
      <InventoryTable
        inventory={
          mockInventory
        }
        onEdit={vi.fn()}
        onDelete={
          handleDelete
        }
      />
    );

    const buttons =
      screen.getAllByRole(
        "button",
        {
          name: /delete/i,
        }
      );

    // Act
    await user.click(
      buttons[1]
    );

    // Assert
    expect(handleDelete)
      .toHaveBeenCalledWith(
        mockInventory[1]
      );
  });

  it("should display empty state when inventory is empty", () => {
    // Arrange
    render(
      <InventoryTable
        inventory={[]}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />
    );

    // Act
    const message =
      screen.getByText(
        "No inventory records found"
      );

    // Assert
    expect(message)
      .toBeInTheDocument();
  });
});