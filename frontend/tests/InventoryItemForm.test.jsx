import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  describe,
  it,
  expect,
  vi,
} from "vitest";

import InventoryItemForm from "../components/InventoryItemForm";

describe("InventoryItemForm", () => {
  it("should render all inventory fields", () => {
    render(
      <InventoryItemForm
        onFormChange={vi.fn()}
      />
    );

    expect(
      screen.getByLabelText(/item name/i)
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText(/category/i)
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText(/quantity/i)
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText(/unit/i)
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText(/minimum stock/i)
    ).toBeInTheDocument();
  });

  it("should update item name and call onFormChange with the updated form", async () => {
    // Arrange
    const user = userEvent.setup();

    const handleChange = vi.fn();

    render(
      <InventoryItemForm
        onFormChange={handleChange}
      />
    );

    const itemName =
      screen.getByLabelText(
        /item name/i
      );

    // Act
    await user.type(
      itemName,
      "Downy"
    );

    // Assert
    expect(itemName).toHaveValue(
      "Downy"
    );

    expect(handleChange)
      .toHaveBeenLastCalledWith({
        itemName: "Downy",
        category: "",
        quantity: "",
        unit: "pcs",
        minimumStock: "",
      });
  });

  it("should update category and call onFormChange with the updated form", async () => {
    // Arrange
    const user = userEvent.setup();

    const handleChange = vi.fn();

    render(
      <InventoryItemForm
        onFormChange={handleChange}
      />
    );

    const category =
      screen.getByLabelText(
        /category/i
      );

    // Act
    await user.selectOptions(
      category,
      "Detergent"
    );

    // Assert
    expect(category).toHaveValue(
      "Detergent"
    );

    expect(handleChange)
      .toHaveBeenLastCalledWith({
        itemName: "",
        category: "Detergent",
        quantity: "",
        unit: "pcs",
        minimumStock: "",
      });
  });

  it("should update quantity and call onFormChange with the updated form", async () => {
    // Arrange
    const user = userEvent.setup();

    const handleChange = vi.fn();

    render(
      <InventoryItemForm
        onFormChange={handleChange}
      />
    );

    const quantity =
      screen.getByLabelText(
        /quantity/i
      );

    // Act
    await user.type(
      quantity,
      "25"
    );

    // Assert
    expect(quantity).toHaveValue(
      25
    );

    expect(handleChange)
      .toHaveBeenLastCalledWith({
        itemName: "",
        category: "",
        quantity: "25",
        unit: "pcs",
        minimumStock: "",
      });
  });

  it("should update unit and call onFormChange with the updated form", async () => {
    // Arrange
    const user = userEvent.setup();

    const handleChange = vi.fn();

    render(
      <InventoryItemForm
        onFormChange={handleChange}
      />
    );

    const unit =
      screen.getByLabelText(
        /unit/i
      );

    // Act
    await user.selectOptions(
      unit,
      "kg"
    );

    // Assert
    expect(unit).toHaveValue(
      "kg"
    );

    expect(handleChange)
      .toHaveBeenLastCalledWith({
        itemName: "",
        category: "",
        quantity: "",
        unit: "kg",
        minimumStock: "",
      });
  });

  it("should update minimum stock and call onFormChange with the updated form", async () => {
    // Arrange
    const user = userEvent.setup();

    const handleChange = vi.fn();

    render(
      <InventoryItemForm
        onFormChange={handleChange}
      />
    );

    const minimumStock =
      screen.getByLabelText(
        /minimum stock/i
      );

    // Act
    await user.type(
      minimumStock,
      "10"
    );

    // Assert
    expect(minimumStock)
      .toHaveValue(10);

    expect(handleChange)
      .toHaveBeenLastCalledWith({
        itemName: "",
        category: "",
        quantity: "",
        unit: "pcs",
        minimumStock: "10",
      });
  });

  it("should update multiple fields and return the complete form object", async () => {
    // Arrange
    const user = userEvent.setup();

    const handleChange = vi.fn();

    render(
      <InventoryItemForm
        onFormChange={handleChange}
      />
    );

    // Act
    await user.type(
      screen.getByLabelText(
        /item name/i
      ),
      "Ariel Powder"
    );

    await user.selectOptions(
      screen.getByLabelText(
        /category/i
      ),
      "Detergent"
    );

    await user.type(
      screen.getByLabelText(
        /quantity/i
      ),
      "50"
    );

    await user.selectOptions(
      screen.getByLabelText(
        /unit/i
      ),
      "kg"
    );

    await user.type(
      screen.getByLabelText(
        /minimum stock/i
      ),
      "15"
    );

    // Assert
    expect(handleChange)
      .toHaveBeenLastCalledWith({
        itemName: "Ariel Powder",
        category: "Detergent",
        quantity: "50",
        unit: "kg",
        minimumStock: "15",
      });
  });
});