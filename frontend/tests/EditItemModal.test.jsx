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
    // Arrange
    render(
      <EditItemModal
        isOpen={false}
        item={mockItem}
        onClose={vi.fn()}
        onUpdateItem={vi.fn()}
      />
    );

    // Act
    const modal = screen.queryByText(
      /edit item/i
    );

    // Assert
    expect(modal)
      .not.toBeInTheDocument();
  });

  it("should render when opened", () => {
    // Arrange
    render(
      <EditItemModal
        isOpen={true}
        item={mockItem}
        onClose={vi.fn()}
        onUpdateItem={vi.fn()}
      />
    );

    // Act
    const heading =
      screen.getByRole("heading", {
        name: /edit item/i,
      });

    // Assert
    expect(heading)
      .toBeInTheDocument();
  });

  it("should display existing inventory information", () => {
  // Arrange
  render(
    <EditItemModal
      isOpen={true}
      item={mockItem}
      onClose={vi.fn()}
      onUpdateItem={vi.fn()}
    />
  );

  // Assert
  expect(
    screen.getByDisplayValue(
      "Ariel Powder"
    )
  ).toBeInTheDocument();

  expect(
    screen.getByLabelText(/category/i)
  ).toHaveValue("Detergent");

  expect(
    screen.getByDisplayValue("20")
  ).toBeInTheDocument();

  expect(
    screen.getByLabelText(/unit/i)
  ).toHaveValue("kg");

  expect(
    screen.getByDisplayValue("5")
  ).toBeInTheDocument();
});

  it("should display Update Item button", () => {
    // Arrange
    render(
      <EditItemModal
        isOpen={true}
        item={mockItem}
        onClose={vi.fn()}
        onUpdateItem={vi.fn()}
      />
    );

    // Assert
    expect(
      screen.getByRole("button", {
        name: /update item/i,
      })
    ).toBeInTheDocument();
  });

  it("should display Cancel button", () => {
    // Arrange
    render(
      <EditItemModal
        isOpen={true}
        item={mockItem}
        onClose={vi.fn()}
        onUpdateItem={vi.fn()}
      />
    );

    // Assert
    expect(
      screen.getByRole("button", {
        name: /cancel/i,
      })
    ).toBeInTheDocument();
  });

  it("should update quantity and call onUpdateItem with updated item", async () => {
    // Arrange
    const user =
      userEvent.setup();

    const handleUpdate =
      vi.fn();

    render(
      <EditItemModal
        isOpen={true}
        item={mockItem}
        onClose={vi.fn()}
        onUpdateItem={
          handleUpdate
        }
      />
    );

    const quantity =
      screen.getByDisplayValue(
        "20"
      );

    const updateButton =
      screen.getByRole(
        "button",
        {
          name: /update item/i,
        }
      );

    // Act
    await user.clear(
      quantity
    );

    await user.type(
      quantity,
      "30"
    );

    await user.click(
      updateButton
    );

    // Assert
    expect(handleUpdate)
      .toHaveBeenCalledWith({
        itemName:
          "Ariel Powder",
        category:
          "Detergent",
        quantity: "30",
        unit: "kg",
        minimumStock: "5",
      });
  });

  it("should update item name and call onUpdateItem with updated item", async () => {
    // Arrange
    const user =
      userEvent.setup();

    const handleUpdate =
      vi.fn();

    render(
      <EditItemModal
        isOpen={true}
        item={mockItem}
        onClose={vi.fn()}
        onUpdateItem={
          handleUpdate
        }
      />
    );

    const itemName =
      screen.getByDisplayValue(
        "Ariel Powder"
      );

    // Act
    await user.clear(
      itemName
    );

    await user.type(
      itemName,
      "Downy"
    );

    await user.click(
      screen.getByRole(
        "button",
        {
          name:
            /update item/i,
        }
      )
    );

    // Assert
    expect(handleUpdate)
      .toHaveBeenCalledWith({
        itemName: "Downy",
        category:
          "Detergent",
        quantity: "20",
        unit: "kg",
        minimumStock: "5",
      });
  });

  it("should show validation error when item name is empty", async () => {
    // Arrange
    const user =
      userEvent.setup();

    render(
      <EditItemModal
        isOpen={true}
        item={mockItem}
        onClose={vi.fn()}
        onUpdateItem={vi.fn()}
      />
    );

    const itemName =
      screen.getByDisplayValue(
        "Ariel Powder"
      );

    // Act
    await user.clear(
      itemName
    );

    await user.click(
      screen.getByRole(
        "button",
        {
          name:
            /update item/i,
        }
      )
    );

    // Assert
    expect(
      screen.getByRole(
        "alert"
      )
    ).toHaveTextContent(
      "Item Name is required"
    );
  });

  it("should call onClose when Cancel button is clicked", async () => {
  // Arrange
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

  const cancelButton =
    screen.getByRole("button", {
      name: /cancel/i,
    });

  // Act
  await user.click(cancelButton);

  // Assert
  expect(handleClose)
    .toHaveBeenCalledTimes(1);

  expect(handleClose)
    .toHaveBeenCalledWith(
      expect.any(Object)
    );
});
});