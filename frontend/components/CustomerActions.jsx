export default function CustomerActions({
  setShowModal,
  setEditing,
  onDelete,
}) {
  const handleAddCustomer = () => {
    setEditing(false);
    setShowModal(true);
  };

  const handleEditCustomer = () => {
    setEditing(true);
    setShowModal(true);
  };

  const handleDeleteCustomer = () => {
    onDelete?.();
  };

  return (
    <>
      <button
        onClick={handleAddCustomer}
      >
        Add Customer
      </button>

      <button
        onClick={handleEditCustomer}
      >
        Edit Customer
      </button>

      <button
        onClick={handleDeleteCustomer}
      >
        Delete
      </button>
    </>
  );
}