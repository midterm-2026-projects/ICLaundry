import { useState } from "react";
import InventoryItemForm from "./InventoryItemForm";
import InventoryActionButton from "./InventoryActionButton";
import { validateInventoryForm } from "./InventoryValidation";

const AddItemModal = ({
  isOpen,
  onClose,
  onSaveItem,
}) => {
  const [formData, setFormData] = useState({
    itemName: "",
    category: "",
    quantity: "",
    unit: "pcs",
    minimumStock: "",
  });

  const [error, setError] = useState("");

  if (!isOpen) {
    return null;
  }

  const handleSave = () => {
    const validationError =
      validateInventoryForm(formData);

    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");

    if (onSaveItem) {
      onSaveItem(formData);
    }

    if (onClose) {
      onClose();
    }
  };

  return (
    <div>
      <h2>Add Item</h2>

      {error && (
        <p role="alert">
          {error}
        </p>
      )}

      <InventoryItemForm
        initialData={formData}
        onFormChange={setFormData}
      />

      <div
        style={{
          marginTop: "16px",
          display: "flex",
          gap: "10px",
        }}
      >
        <InventoryActionButton
          label="Save Item"
          onClick={handleSave}
        />

        <InventoryActionButton
          label="Cancel"
          onClick={onClose}
        />
      </div>
    </div>
  );
};

export default AddItemModal;