import { useState, useEffect } from "react";
import InventoryItemForm from "./InventoryItemForm";
import InventoryActionButton from "./InventoryActionButton";
import { validateInventoryForm } from "./InventoryValidation";

const EditItemModal = ({
  isOpen,
  item,
  onClose,
  onUpdateItem,
}) => {
  const [formData, setFormData] = useState({
    itemName: "",
    category: "",
    quantity: "",
    unit: "pcs",
    minimumStock: "",
  });

  const [error, setError] = useState("");

  useEffect(() => {
    if (item) {
      setFormData({
        itemName: item.itemName || "",
        category: item.category || "",
        quantity: item.quantity || "",
        unit: item.unit || "pcs",
        minimumStock: item.minimumStock || "",
      });
    }
  }, [item]);

  if (!isOpen) {
    return null;
  }

  const handleUpdate = () => {
    const validationError =
      validateInventoryForm(formData);

    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");

    if (onUpdateItem) {
      onUpdateItem(formData);
    }

    if (onClose) {
      onClose();
    }
  };

  return (
    <div>
      <h2>Edit Item</h2>

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
          label="Update Item"
          onClick={handleUpdate}
        />

        <InventoryActionButton
          label="Cancel"
          onClick={onClose}
        />
      </div>
    </div>
  );
};

export default EditItemModal;