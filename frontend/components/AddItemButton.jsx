const AddItemButton = ({
  onAddItem,
  disabled = false,
}) => {
  return (
    <button
      type="button"
      onClick={onAddItem}
      disabled={disabled}
    >
      Add Item
    </button>
  );
};

export default AddItemButton;