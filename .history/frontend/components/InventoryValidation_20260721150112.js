export const validateInventoryForm = ({
  itemName,
  category,
  quantity,
  unit,
  minimumStock,
}) => {
  if (!itemName?.trim()) {
    return "Item Name is required";
  }

  if (!category?.trim()) {
    return "Category is required";
  }

  if (
    quantity === "" ||
    quantity === null ||
    quantity === undefined
  ) {
    return "Quantity is required";
  }

  if (Number(quantity) < 0) {
    return "Quantity cannot be negative";
  }

  if (!unit?.trim()) {
    return "Unit is required";
  }

  if (
    minimumStock === "" ||
    minimumStock === null ||
    minimumStock === undefined
  ) {
    return "Minimum Stock is required";
  }

  if (Number(minimumStock) < 0) {
    return "Minimum Stock cannot be negative";
  }

  return "";
};