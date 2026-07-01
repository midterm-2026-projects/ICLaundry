import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  describe,
  it,
  expect,
  vi,
} from "vitest";

import EditItemModal from "../components/EditItemModal";

const mockItem = {
  itemName: "Ariel Powder",
  category: "Detergent",
  quantity: "20",
  unit: "kg",
  minimumStock: "5",
};

describe("EditItemModal", () => {
  it("should not render when closed", () => {
    render(
      <EditItemModal
        isOpen={false}
        item={mockItem}
        onClose={vi.fn()}
        onUpdateItem={vi.fn()}
      />
    );

    expect(
      screen.queryByText(/edit item/i)
    ).not.toBeInTheDocument();
  });

  it("should render when opened", () => {
    render(
      <EditItemModal
        isOpen={true}
        item={mockItem}
        onClose={vi.fn()}
        onUpdateItem={vi.fn()}
      />
    );

    expect(
      screen.getByRole("heading", {
        name: /edit item/i,
      })
    ).toBeInTheDocument();
  });

  it("should preload existing item values", () => {
    render(
      <EditItemModal
        isOpen={true}
        item={mockItem}
        onClose={vi.fn()}
        onUpdateItem={vi.fn()}
      />
    );

    expect(
      screen.getByLabelText(/item name/i)
    ).toHaveValue("Ariel Powder");

    expect(
      screen.getByLabelText(/category/i)
    ).toHaveValue("Detergent");

    expect(
      screen.getByLabelText(/^quantity$/i)
    ).toHaveValue(20);

    expect(
      screen.getByLabelText(/unit/i)
    ).toHaveValue("kg");

    expect(
      screen.getByLabelText(
        /minimum stock/i
      )
    ).toHaveValue(5);
  });

  it("should display Update Item button", () => {
    render(
      <EditItemModal
        isOpen={true}
        item={mockItem}
        onClose={vi.fn()}
        onUpdateItem={vi.fn()}
      />
    );

    expect(
      screen.getByRole("button", {
        name: /update item/i,
      })
    ).toBeInTheDocument();
  });

  it("should display Cancel button", () => {
    render(
      <EditItemModal
        isOpen={true}
        item={mockItem}
        onClose={vi.fn()}
        onUpdateItem={vi.fn()}
      />
    );

    expect(
      screen.getByRole("button", {
        name: /cancel/i,
      })
    ).toBeInTheDocument();
  });

  it("should update the item when valid", async () => {
    const user = userEvent.setup();

    const handleUpdate = vi.fn();

    render(
      <EditItemModal
        isOpen={true}
        item={mockItem}
        onClose={vi.fn()}
        onUpdateItem={handleUpdate}
      />
    );

    const quantity =
      screen.getByLabelText(
        /^quantity$/i
      );

    await user.clear(quantity);
    await user.type(quantity, "30");

    await user.click(
      screen.getByRole("button", {
        name: /update item/i,
      })
    );

    expect(handleUpdate).toHaveBeenCalledTimes(1);

    expect(handleUpdate).toHaveBeenCalledWith({
      itemName: "Ariel Powder",
      category: "Detergent",
      quantity: "30",
      unit: "kg",
      minimumStock: "5",
    });
  });

  it("should show validation message when item name is empty", async () => {
    const user = userEvent.setup();

    render(
      <EditItemModal
        isOpen={true}
        item={mockItem}
        onClose={vi.fn()}
        onUpdateItem={vi.fn()}
      />
    );

    const itemName =
      screen.getByLabelText(
        /item name/i
      );

    await user.clear(itemName);

    await user.click(
      screen.getByRole("button", {
        name: /update item/i,
      })
    );

    expect(
      screen.getByRole("alert")
    ).toHaveTextContent(
      "Item Name is required"
    );
  });

  it("should call onClose when Cancel is clicked", async () => {
    const user = userEvent.setup();

    const handleClose = vi.fn();

    render(
      <EditItemModal
        isOpen={true}
        item={mockItem}
        onClose={handleClose}
        onUpdateItem={vi.fn()}
      />
    );

    await user.click(
      screen.getByRole("button", {
        name: /cancel/i,
      })
    );

    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});