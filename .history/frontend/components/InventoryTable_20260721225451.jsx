import { Edit, PackagePlus, Trash2 } from "lucide-react";

import InventoryActionButton from "./InventoryActionButton";

const getStockStatus = (quantity, minimumStock) => {
  const currentQuantity = Number(quantity) || 0;

  const minimum = Number(minimumStock) || 0;

  if (currentQuantity <= 0) {
    return {
      label: "Out of Stock",
      className: "inventory-status inventory-status-out",
    };
  }

  if (currentQuantity <= minimum) {
    return {
      label: "Low Stock",
      className: "inventory-status inventory-status-low",
    };
  }

  return {
    label: "In Stock",
    className: "inventory-status inventory-status-available",
  };
};

const formatCurrency = (value) => {
  const amount = Number(value) || 0;

  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
  }).format(amount);
};

function InventoryTable({
  inventory = [],
  onEdit,
  onDelete,
  onRestock,
  disabled = false,
}) {
  if (!Array.isArray(inventory) || inventory.length === 0) {
    return (
      <div className="inventory-empty-state">
        <h3>No inventory items found</h3>

        <p>
          Add a new inventory item or adjust your search and branch filters.
        </p>
      </div>
    );
  }

  return (
    <table className="inventory-table">
      <thead>
        <tr>
          <th>Item Name</th>
          <th>Category</th>
          <th>Branch</th>
          <th>Current Stock</th>
          <th>Minimum Stock</th>
          <th>Cost Per Unit</th>
          <th>Usage Per Load</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        {inventory.map((item) => {
          const stockStatus = getStockStatus(item.quantity, item.minimumStock);

          return (
            <tr key={item.id}>
              <td>
                <div className="inventory-item-name">
                  <strong>{item.itemName || "Unnamed Item"}</strong>

                  <span>ID: {item.id || "N/A"}</span>
                </div>
              </td>

              <td>{item.category || "N/A"}</td>

              <td>{item.branch || "N/A"}</td>

              <td>
                <strong>{Number(item.quantity) || 0}</strong> {item.unit || ""}
              </td>

              <td>
                {Number(item.minimumStock) || 0} {item.unit || ""}
              </td>

              <td>{formatCurrency(item.costPerUnit)}</td>

              <td>
                {Number(item.usagePerLoad) || 0} {item.unit || ""}
              </td>

              <td>
                <span className={stockStatus.className}>
                  {stockStatus.label}
                </span>
              </td>

              <td>
                <div className="inventory-actions">
                  <InventoryActionButton
                    type="button"
                    title={`Restock ${item.itemName}`}
                    ariaLabel={`Restock ${item.itemName}`}
                    className="inventory-action-restock"
                    disabled={disabled}
                    onClick={() => onRestock?.(item)}
                  >
                    <PackagePlus size={17} aria-hidden="true" />
                  </InventoryActionButton>

                  <InventoryActionButton
                    type="button"
                    title={`Edit ${item.itemName}`}
                    ariaLabel={`Edit ${item.itemName}`}
                    className="inventory-action-edit"
                    disabled={disabled}
                    onClick={() => onEdit?.(item)}
                  >
                    <Edit size={17} aria-hidden="true" />
                  </InventoryActionButton>

                  <InventoryActionButton
                    type="button"
                    title={`Delete ${item.itemName}`}
                    ariaLabel={`Delete ${item.itemName}`}
                    className="inventory-action-delete"
                    disabled={disabled}
                    onClick={() => onDelete?.(item)}
                  >
                    <Trash2 size={17} aria-hidden="true" />
                  </InventoryActionButton>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default InventoryTable;
