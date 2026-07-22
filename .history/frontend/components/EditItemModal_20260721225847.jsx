import { useEffect, useState } from "react";

import InventoryItemForm from "./InventoryItemForm";
import InventoryActionButton from "./InventoryActionButton";

import {
  getFirstError,
  sanitizeInventoryItem,
  validateInventoryItem,
} from "./InventoryValidation";

const defaultFormData = {
  itemName: "",
  category: "",
  branch: "",
  quantity: "",
  unit: "pcs",
  minimumStock: "",
  costPerUnit: "",
  usagePerLoad: "",
};

const EditItemModal = ({
  isOpen,
  item,
  onClose,
  onUpdateItem,
  isSubmitting = false,
}) => {
  const [formData, setFormData] = useState(defaultFormData);

  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen || !item) {
      return;
    }

    setFormData({
      itemName: item.itemName ?? "",

      category: item.category ?? "",

      branch: item.branch ?? "",

      quantity: item.quantity ?? "",

      unit: item.unit || "pcs",

      minimumStock: item.minimumStock ?? "",

      costPerUnit: item.costPerUnit ?? "",

      usagePerLoad: item.usagePerLoad ?? "",
    });

    setError("");
  }, [isOpen, item]);

  if (!isOpen) {
    return null;
  }

  const handleUpdate = async () => {
    const validation = validateInventoryItem(formData);

    if (!validation.isValid) {
      setError(getFirstError(validation.errors));

      return;
    }

    try {
      setError("");

      await onUpdateItem?.(sanitizeInventoryItem(formData));
    } catch (requestError) {
      setError(requestError?.message || "Unable to update the inventory item.");
    }
  };

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget && !isSubmitting) {
      onClose?.();
    }
  };

  return (
    <div
      className="inventory-modal-overlay"
      role="presentation"
      onMouseDown={handleOverlayClick}
    >
      <div
        className="inventory-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-inventory-title"
      >
        <div className="inventory-modal-header">
          <div>
            <h2 id="edit-inventory-title">Edit Inventory Item</h2>

            <p>Update the item details and stock configuration.</p>
          </div>

          <button
            type="button"
            className="inventory-modal-close"
            aria-label="Close edit inventory modal"
            onClick={onClose}
            disabled={isSubmitting}
          >
            ×
          </button>
        </div>

        {error && (
          <div className="inventory-modal-error" role="alert">
            {error}
          </div>
        )}

        <InventoryItemForm
          initialData={formData}
          onFormChange={setFormData}
          disabled={isSubmitting}
        />

        <div className="inventory-modal-actions">
          <InventoryActionButton
            label={isSubmitting ? "Updating..." : "Update Item"}
            onClick={handleUpdate}
            disabled={isSubmitting}
          />

          <InventoryActionButton
            label="Cancel"
            onClick={onClose}
            disabled={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
};

export default EditItemModal;
