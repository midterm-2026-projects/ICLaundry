import { useState } from "react";

import InventoryItemForm from "./InventoryItemForm";
import InventoryActionButton from "./InventoryActionButton";

import {
  validateInventoryItem,
  sanitizeInventoryItem,
  getFirstError,
} from "./InventoryValidation";

const initialForm = {
  itemName: "",
  category: "",
  branch: "",
  quantity: "",
  unit: "pcs",
  minimumStock: "",
  costPerUnit: "",
  usagePerLoad: "",
};

const AddItemModal = ({
  isOpen,
  onClose,
  onSaveItem,
  isSubmitting = false,
}) => {
  const [formData, setFormData] = useState(initialForm);

  const [error, setError] = useState("");

  if (!isOpen) {
    return null;
  }

  const handleSave = async () => {
    const validation = validateInventoryItem(formData);

    if (!validation.isValid) {
      setError(getFirstError(validation.errors));

      return;
    }

    try {
      setError("");

      await onSaveItem?.(sanitizeInventoryItem(formData));

      setFormData(initialForm);
    } catch (requestError) {
      setError(requestError.message || "Unable to save inventory item.");
    }
  };

  return (
    <div className="inventory-modal-overlay">
      <div className="inventory-modal">
        <h2>Add Inventory Item</h2>

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
            label={isSubmitting ? "Saving..." : "Save Item"}
            onClick={handleSave}
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

export default AddItemModal;
