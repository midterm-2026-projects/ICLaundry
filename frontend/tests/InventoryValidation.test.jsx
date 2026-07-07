import {
  describe,
  it,
  expect,
} from "vitest";

import {
  validateInventoryForm,
} from "../components/InventoryValidation";

describe("InventoryValidation", () => {
  it("should require item name", () => {
    const result = validateInventoryForm({
      itemName: "",
      category: "Detergent",
      quantity: 10,
      unit: "kg",
      minimumStock: 5,
    });

    expect(result).toBe(
      "Item Name is required"
    );
  });

  it("should require category", () => {
    const result = validateInventoryForm({
      itemName: "Ariel Powder",
      category: "",
      quantity: 10,
      unit: "kg",
      minimumStock: 5,
    });

    expect(result).toBe(
      "Category is required"
    );
  });

  it("should require quantity", () => {
    const result = validateInventoryForm({
      itemName: "Ariel Powder",
      category: "Detergent",
      quantity: "",
      unit: "kg",
      minimumStock: 5,
    });

    expect(result).toBe(
      "Quantity is required"
    );
  });

  it("should reject negative quantity", () => {
    const result = validateInventoryForm({
      itemName: "Ariel Powder",
      category: "Detergent",
      quantity: -1,
      unit: "kg",
      minimumStock: 5,
    });

    expect(result).toBe(
      "Quantity cannot be negative"
    );
  });

  it("should require unit", () => {
    const result = validateInventoryForm({
      itemName: "Ariel Powder",
      category: "Detergent",
      quantity: 10,
      unit: "",
      minimumStock: 5,
    });

    expect(result).toBe(
      "Unit is required"
    );
  });

  it("should require minimum stock", () => {
    const result = validateInventoryForm({
      itemName: "Ariel Powder",
      category: "Detergent",
      quantity: 10,
      unit: "kg",
      minimumStock: "",
    });

    expect(result).toBe(
      "Minimum Stock is required"
    );
  });

  it("should reject negative minimum stock", () => {
    const result = validateInventoryForm({
      itemName: "Ariel Powder",
      category: "Detergent",
      quantity: 10,
      unit: "kg",
      minimumStock: -5,
    });

    expect(result).toBe(
      "Minimum Stock cannot be negative"
    );
  });

  it("should return an empty string when all fields are valid", () => {
    const result = validateInventoryForm({
      itemName: "Ariel Powder",
      category: "Detergent",
      quantity: 20,
      unit: "kg",
      minimumStock: 5,
    });

    expect(result).toBe("");
  });
});