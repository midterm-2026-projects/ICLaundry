import { useState, useEffect } from "react";

const defaultFormData = {
  itemName: "",
  category: "",
  quantity: "",
  unit: "pcs",
  minimumStock: "",
};

const InventoryItemForm = ({
  initialData,
  onFormChange,
}) => {
  const [formData, setFormData] = useState({
    ...defaultFormData,
    ...(initialData || {}),
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...defaultFormData,
        ...initialData,
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    const updatedForm = {
      ...formData,
      [name]: value,
    };

    setFormData(updatedForm);

    onFormChange?.(updatedForm);
  };

  return (
    <>
      <div>
        <label htmlFor="itemName">
          Item Name
        </label>

        <input
          id="itemName"
          name="itemName"
          type="text"
          placeholder="Enter item name"
          value={formData.itemName}
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="category">
          Category
        </label>

        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
        >
          <option value="">
            Select Category
          </option>

          <option value="Detergent">
            Detergent
          </option>

          <option value="Fabric Conditioner">
            Fabric Conditioner
          </option>

          <option value="Chemical">
            Chemical
          </option>
        </select>
      </div>

      <div>
        <label htmlFor="quantity">
          Quantity
        </label>

        <input
          id="quantity"
          name="quantity"
          type="number"
          placeholder="0"
          value={formData.quantity}
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="unit">
          Unit
        </label>

        <select
          id="unit"
          name="unit"
          value={formData.unit}
          onChange={handleChange}
        >
          <option value="pcs">
            Pieces
          </option>

          <option value="kg">
            Kilograms
          </option>

          <option value="L">
            Liters
          </option>
        </select>
      </div>

      <div>
        <label htmlFor="minimumStock">
          Minimum Stock
        </label>

        <input
          id="minimumStock"
          name="minimumStock"
          type="number"
          placeholder="0"
          value={formData.minimumStock}
          onChange={handleChange}
        />
      </div>
    </>
  );
};

export default InventoryItemForm;