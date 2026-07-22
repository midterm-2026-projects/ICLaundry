import { Plus } from "lucide-react";

const AddItemButton = ({ onAddItem, disabled = false }) => {
  return (
    <button
      type="button"
      className="inventory-add-button"
      onClick={onAddItem}
      disabled={disabled}
      aria-label="Add Inventory Item"
    >
      <Plus size={18} aria-hidden="true" />

      <span>Add Item</span>
    </button>
  );
};

export default AddItemButton;
