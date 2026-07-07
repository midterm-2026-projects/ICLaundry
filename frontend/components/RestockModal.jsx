import { useState } from "react";
import InventoryActionButton from "./InventoryActionButton";

const RestockModal = ({
  isOpen,
  onClose,
  onSubmitRestock,
}) => {
  const [quantity, setQuantity] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) {
    return null;
  }

  const handleSubmit = () => {
    if (!quantity || Number(quantity) <= 0) {
      setError(
        "Restock Quantity is required"
      );
      return;
    }

    setError("");

    if (onSubmitRestock) {
      onSubmitRestock({
        quantity: Number(quantity),
        notes,
      });
    }

    if (onClose) {
      onClose();
    }

    setQuantity("");
    setNotes("");
  };

  return (
    <div>
      <h2>Restock Item</h2>

      {error && (
        <p role="alert">
          {error}
        </p>
      )}

      <div>
        <label htmlFor="restockQuantity">
          Restock Quantity
        </label>

        <input
          id="restockQuantity"
          type="number"
          placeholder="Enter quantity"
          value={quantity}
          onChange={(e) =>
            setQuantity(e.target.value)
          }
        />
      </div>

      <div>
        <label htmlFor="restockNotes">
          Restock Notes
        </label>

        <textarea
          id="restockNotes"
          placeholder="Enter notes"
          value={notes}
          onChange={(e) =>
            setNotes(e.target.value)
          }
        />
      </div>

      <div
        style={{
          marginTop: "16px",
          display: "flex",
          gap: "10px",
        }}
      >
        <InventoryActionButton
          label="Submit Restock"
          onClick={handleSubmit}
        />

        <InventoryActionButton
          label="Cancel"
          onClick={onClose}
        />
      </div>
    </div>
  );
};

export default RestockModal;