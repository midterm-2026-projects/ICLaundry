const isEmpty = (value) => {
  return value === undefined || value === null || String(value).trim() === "";
};

const isValidNumber = (value) => {
  if (isEmpty(value)) {
    return false;
  }

  return Number.isFinite(Number(value));
};

const isNonNegativeNumber = (value) => {
  return isValidNumber(value) && Number(value) >= 0;
};

/**
 * Validate inventory item form data.
 *
 * Expected frontend fields:
 * - itemName
 * - category
 * - branch
 * - quantity
 * - unit
 * - minimumStock
 * - costPerUnit
 * - usagePerLoad
 */
export const validateInventoryItem = (formData = {}) => {
  const errors = {};

  const itemName = String(formData.itemName ?? "").trim();

  const category = String(formData.category ?? "").trim();

  const branch = String(formData.branch ?? "").trim();

  const unit = String(formData.unit ?? "").trim();

  if (!itemName) {
    errors.itemName = "Item name is required.";
  } else if (itemName.length < 2) {
    errors.itemName = "Item name must contain at least 2 characters.";
  } else if (itemName.length > 100) {
    errors.itemName = "Item name must not exceed 100 characters.";
  }

  if (!category) {
    errors.category = "Category is required.";
  }

  if (!branch) {
    errors.branch = "Branch is required.";
  }

  if (!unit) {
    errors.unit = "Unit is required.";
  }

  if (isEmpty(formData.quantity)) {
    errors.quantity = "Current stock is required.";
  } else if (!isValidNumber(formData.quantity)) {
    errors.quantity = "Current stock must be a valid number.";
  } else if (Number(formData.quantity) < 0) {
    errors.quantity = "Current stock cannot be negative.";
  }

  if (isEmpty(formData.minimumStock)) {
    errors.minimumStock = "Minimum stock is required.";
  } else if (!isValidNumber(formData.minimumStock)) {
    errors.minimumStock = "Minimum stock must be a valid number.";
  } else if (Number(formData.minimumStock) < 0) {
    errors.minimumStock = "Minimum stock cannot be negative.";
  }

  if (isEmpty(formData.costPerUnit)) {
    errors.costPerUnit = "Cost per unit is required.";
  } else if (!isValidNumber(formData.costPerUnit)) {
    errors.costPerUnit = "Cost per unit must be a valid number.";
  } else if (Number(formData.costPerUnit) < 0) {
    errors.costPerUnit = "Cost per unit cannot be negative.";
  }

  if (isEmpty(formData.usagePerLoad)) {
    errors.usagePerLoad = "Usage per load is required.";
  } else if (!isValidNumber(formData.usagePerLoad)) {
    errors.usagePerLoad = "Usage per load must be a valid number.";
  } else if (Number(formData.usagePerLoad) <= 0) {
    errors.usagePerLoad = "Usage per load must be greater than zero.";
  }

  return {
    isValid: Object.keys(errors).length === 0,

    errors,
  };
};

/**
 * Validate restock form data.
 *
 * Expected fields:
 * - quantity
 * - notes
 */
export const validateRestock = (formData = {}) => {
  const errors = {};

  if (isEmpty(formData.quantity)) {
    errors.quantity = "Restock quantity is required.";
  } else if (!isValidNumber(formData.quantity)) {
    errors.quantity = "Restock quantity must be a valid number.";
  } else if (Number(formData.quantity) <= 0) {
    errors.quantity = "Restock quantity must be greater than zero.";
  }

  const notes = String(formData.notes ?? "").trim();

  if (notes.length > 500) {
    errors.notes = "Notes must not exceed 500 characters.";
  }

  return {
    isValid: Object.keys(errors).length === 0,

    errors,
  };
};

/**
 * Convert form values into clean frontend values
 * before passing them to the API layer.
 */
export const sanitizeInventoryItem = (formData = {}) => {
  return {
    itemName: String(formData.itemName ?? "").trim(),

    category: String(formData.category ?? "").trim(),

    branch: String(formData.branch ?? "").trim(),

    quantity: Number(formData.quantity ?? 0),

    unit: String(formData.unit ?? "").trim(),

    minimumStock: Number(formData.minimumStock ?? 0),

    costPerUnit: Number(formData.costPerUnit ?? 0),

    usagePerLoad: Number(formData.usagePerLoad ?? 0),
  };
};

/**
 * Convert restock values into clean values
 * before passing them to the API layer.
 */
export const sanitizeRestock = (formData = {}) => {
  return {
    quantity: Number(formData.quantity ?? 0),

    notes: String(formData.notes ?? "").trim(),
  };
};

/**
 * Return the first available validation message.
 */
export const getFirstError = (errors = {}) => {
  const firstError = Object.values(errors)[0];

  return firstError || "Please check the form fields.";
};

/**
 * Backward-compatible default validator.
 */
const validateInventoryForm = (formData = {}) => {
  return validateInventoryItem(formData);
};

export { isEmpty, isValidNumber, isNonNegativeNumber };

export default validateInventoryForm;
