import { useEffect, useState } from "react";

import InventoryActionButton from "./InventoryActionButton";

import {
  getFirstError,
  sanitizeRestock,
  validateRestock,
} from "./InventoryValidation";

const defaultFormData = {
  quantity: "",
  notes: "",
};

const RestockModal = ({
  isOpen,
  item,
  onClose,
  onSubmitRestock,
  isSubmitting = false,
}) => {
  const [formData, setFormData] = useState(defaultFormData);

  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setFormData(defaultFormData);

      setError("");
    }
  }, [isOpen, item]);

  if (!isOpen) {
    return null;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  const handleSubmit = async () => {
    const validation = validateRestock(formData);

    if (!validation.isValid) {
      setError(getFirstError(validation.errors));

      return;
    }

    try {
      setError("");

      await onSubmitRestock?.(sanitizeRestock(formData));

      setFormData(defaultFormData);
    } catch (requestError) {
      setError(
        requestError?.message || "Unable to restock the inventory item.",
      );
    }
  };

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget && !isSubmitting) {
      onClose?.();
    }
  };

  const currentStock = Number(item?.quantity) || 0;

  const restockQuantity = Number(formData.quantity) || 0;

  const projectedStock = currentStock + restockQuantity;

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
        aria-labelledby="restock-inventory-title"
      >
        <div className="inventory-modal-header">
          <div>
            <h2 id="restock-inventory-title">Restock Item</h2>

            <p>
              Add stock to{" "}
              <strong>{item?.itemName || "the selected item"}</strong>.
            </p>
          </div>

          <button
            type="button"
            className="inventory-modal-close"
            aria-label="Close restock modal"
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

        <div className="inventory-restock-summary">
          <div>
            <span>Current Stock</span>

            <strong>
              {currentStock} {item?.unit || ""}
            </strong>
          </div>

          <div>
            <span>Projected Stock</span>

            <strong>
              {projectedStock} {item?.unit || ""}
            </strong>
          </div>
        </div>

        <div className="inventory-form-group">
          <label htmlFor="restockQuantity">Restock Quantity</label>

          <input
            id="restockQuantity"
            name="quantity"
            type="number"
            min="0.01"
            step="0.01"
            placeholder="Enter quantity"
            value={formData.quantity}
            onChange={handleChange}
            disabled={isSubmitting}
            required
          />
        </div>

        <div className="inventory-form-group">
          <label htmlFor="restockNotes">Restock Notes</label>

          <textarea
            id="restockNotes"
            name="notes"
            rows="4"
            maxLength="500"
            placeholder="Enter supplier, reference number, or other notes"
            value={formData.notes}
            onChange={handleChange}
            disabled={isSubmitting}
          />

          <small className="inventory-form-helper">
            {formData.notes.length}
            /500 characters
          </small>
        </div>

        <div className="inventory-modal-actions">
          <InventoryActionButton
            label={isSubmitting ? "Submitting..." : "Submit Restock"}
            onClick={handleSubmit}
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

export default RestockModal;
