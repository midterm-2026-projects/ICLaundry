const AddonsSelector = ({
  addons,
  onSelectAddon,
}) => {
  return (
    <>
      <h3>Add-ons</h3>

      {addons.length > 0 ? (
        addons.map((addon) => (
          <div key={addon.id}>
            <span>{addon.name}</span>

            <span>
              Stock: {addon.stock}
            </span>

            <button
              type="button"
              onClick={() =>
                onSelectAddon(addon)
              }
              disabled={addon.stock === 0}
            >
              Add
            </button>
          </div>
        ))
      ) : (
        <p>No add-ons available</p>
      )}
    </>
  );
};

export default AddonsSelector;