const InventoryTable = ({
  inventory,
  onEdit,
  onDelete,
}) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Item Name</th>
          <th>Category</th>
          <th>Quantity</th>
          <th>Unit</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        {inventory.length > 0 ? (
          inventory.map((item) => {
            const isLow =
              item.quantity <=
              item.minimumStock;

            return (
              <tr key={item.id}>
                <td>
                  <span>
                    {item.itemName}
                  </span>
                </td>

                <td>
                  <span>
                    {item.category}
                  </span>
                </td>

                <td>
                  <span>
                    {item.quantity}
                  </span>
                </td>

                <td>
                  <span>
                    {item.unit}
                  </span>
                </td>

                <td>
                  <span>
                    {isLow
                      ? "Low"
                      : "OK"}
                  </span>
                </td>

                <td>
                  <button
                    onClick={() =>
                      onEdit(item)
                    }
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      onDelete(item)
                    }
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })
        ) : (
          <tr>
            <td colSpan={6}>
              No inventory records
              found
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default InventoryTable;