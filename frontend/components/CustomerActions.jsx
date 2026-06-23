export default function CustomerActions({
  setShowModal,
  setEditing,
}) {
  return (
    <>
      <button
        onClick={() => {
          setEditing(false);
          setShowModal(true);
        }}
      >
        Add Customer
      </button>

      <button
        onClick={() => {
          setEditing(true);
          setShowModal(true);
        }}
      >
        Edit Customer
      </button>

      <button>Delete</button>
    </>
  );
}