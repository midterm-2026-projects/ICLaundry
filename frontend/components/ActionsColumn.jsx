const ActionsColumn = ({
  onEdit,
  onDelete,
}) => {
  return (
    <>
      <button
        onClick={onEdit}
      >
        Edit
      </button>

      <button
        onClick={onDelete}
      >
        Delete
      </button>
    </>
  );
};

export default ActionsColumn;