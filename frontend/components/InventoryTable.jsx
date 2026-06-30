import ItemNameColumn from "./ItemNameColumn";
import CategoryColumn from "./CategoryColumn";
import QuantityColumn from "./QuantityColumn";
import UnitColumn from "./UnitColumn";
import StockStatusBadge from "./StockStatusBadge";
import ActionsColumn from "./ActionsColumn";

const InventoryTable = ({
  inventory,
  onEdit,
  onDelete,
}) => {
  return (
    <>
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
            inventory.map((item) => (
              <tr key={item.id}>
                <td>
                  <ItemNameColumn
                    itemName={
                      item.itemName
                    }
                  />
                </td>

                <td>
                  <CategoryColumn
                    category={
                      item.category
                    }
                  />
                </td>

                <td>
                  <QuantityColumn
                    quantity={
                      item.quantity
                    }
                  />
                </td>

                <td>
                  <UnitColumn
                    unit={item.unit}
                  />
                </td>

                <td>
                  <StockStatusBadge
                    quantity={
                      item.quantity
                    }
                    minimumStock={
                      item.minimumStock
                    }
                  />
                </td>

                <td>
                  <ActionsColumn
                    onEdit={() =>
                      onEdit(item)
                    }
                    onDelete={() =>
                      onDelete(item)
                    }
                  />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">
                No inventory records
                found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
};

export default InventoryTable;