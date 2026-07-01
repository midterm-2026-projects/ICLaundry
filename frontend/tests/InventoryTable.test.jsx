import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  describe,
  it,
  expect,
  vi,
} from "vitest";
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

  it("should render inventory table", () => {
    render(
      <InventoryTable
        inventory={
          mockInventory
        }
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />
    );

    expect(
      screen.getByRole("table")
    ).toBeInTheDocument();
  });

  it("should render all table headers", () => {
    render(
      <InventoryTable
        inventory={
          mockInventory
        }
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />
    );

    expect(
      screen.getByText(
        "Item Name"
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Category"
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Quantity"
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText("Unit")
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Status"
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Actions"
      )
    ).toBeInTheDocument();
  });

  it("should display all inventory data", () => {
    render(
      <InventoryTable
        inventory={
          mockInventory
        }
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />
    );

    expect(
      screen.getByText(
        "Ariel Detergent"
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Downy"
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Detergent"
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Fabric Conditioner"
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText("25")
    ).toBeInTheDocument();

    expect(
      screen.getByText("5")
    ).toBeInTheDocument();

    expect(
      screen.getByText("kg")
    ).toBeInTheDocument();

    expect(
      screen.getByText("L")
    ).toBeInTheDocument();
  });

  it("should display stock status badges", () => {
    render(
      <InventoryTable
        inventory={
          mockInventory
        }
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />
    );

    expect(
      screen.getByText("OK")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Low")
    ).toBeInTheDocument();
  });

  it("should display Edit buttons", () => {
    render(
      <InventoryTable
        inventory={
          mockInventory
        }
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />
    );

    expect(
      screen.getAllByRole(
        "button",
        {
          name: /edit/i,
        }
      )
    ).toHaveLength(2);
  });

  it("should display Delete buttons", () => {
    render(
      <InventoryTable
        inventory={
          mockInventory
        }
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />
    );

    expect(
      screen.getAllByRole(
        "button",
        {
          name: /delete/i,
        }
      )
    ).toHaveLength(2);
  });

  it("should call onEdit with selected item", async () => {
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

    await user.click(
      buttons[0]
    );

    expect(handleEdit)
      .toHaveBeenCalledWith(
        mockInventory[0]
      );
  });

  it("should call onDelete with selected item", async () => {
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

    await user.click(
      buttons[1]
    );

    expect(handleDelete)
      .toHaveBeenCalledWith(
        mockInventory[1]
      );
  });

  it("should display empty state when inventory is empty", () => {
    render(
      <InventoryTable
        inventory={[]}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />
    );

    expect(
      screen.getByText(
        "No inventory records found"
      )
    ).toBeInTheDocument();
  });
});