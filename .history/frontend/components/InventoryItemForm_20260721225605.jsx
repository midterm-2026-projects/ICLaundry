import { useEffect, useState } from "react";

const defaultFormData = {
  itemName: "",
  category: "",
  branch: "",
  quantity: "",
  unit: "pcs",
  minimumStock: "",
  costPerUnit: "",
  usagePerLoad: "",
};

const InventoryItemForm = ({ initialData, onFormChange, disabled = false }) => {
  const [formData, setFormData] = useState({
    ...defaultFormData,
    ...(initialData || {}),
  });

  useEffect(() => {
    const updatedFormData = {
      ...defaultFormData,
      ...(initialData || {}),
    };

    setFormData(updatedFormData);

    onFormChange?.(updatedFormData);
  }, [initialData, onFormChange]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    const updatedForm = {
      ...formData,
      [name]: value,
    };

    setFormData(updatedForm);

    onFormChange?.(updatedForm);
  };

  return (
    <div className="inventory-item-form">
      <div className="inventory-form-group">
        <label htmlFor="itemName">Item Name</label>

        <input
          id="itemName"
          name="itemName"
          type="text"
          placeholder="Enter item name"
          value={formData.itemName}
          onChange={handleChange}
          disabled={disabled}
          required
        />
      </div>

      <div className="inventory-form-group">
        <label htmlFor="category">Category</label>

        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          disabled={disabled}
          required
        >
          <option value="">Select Category</option>

          <option value="Detergent">Detergent</option>

          <option value="Fabric Conditioner">Fabric Conditioner</option>

          <option value="Chemical">Chemical</option>

          <option value="Packaging">Packaging</option>

          <option value="Cleaning Supply">Cleaning Supply</option>

          <option value="Other">Other</option>
        </select>
      </div>

      <div className="inventory-form-group">
        <label htmlFor="branch">Branch</label>

        <select
          id="branch"
          name="branch"
          value={formData.branch}
          onChange={handleChange}
          disabled={disabled}
          required
        >
          <option value="">Select Branch</option>

          <option value="Main - Brgy 7">Main - Brgy 7</option>

          <option value="Calzada">Calzada</option>

          <option value="Nasugbu">Nasugbu</option>
        </select>
      </div>

      <div className="inventory-form-group">
        <label htmlFor="quantity">Current Stock</label>

        <input
          id="quantity"
          name="quantity"
          type="number"
          min="0"
          step="0.01"
          placeholder="0"
          value={formData.quantity}
          onChange={handleChange}
          disabled={disabled}
          required
        />
      </div>

      <div className="inventory-form-group">
        <label htmlFor="unit">Unit</label>

        <select
          id="unit"
          name="unit"
          value={formData.unit}
          onChange={handleChange}
          disabled={disabled}
          required
        >
          <option value="pcs">Pieces</option>

          <option value="kg">Kilograms</option>

          <option value="g">Grams</option>

          <option value="L">Liters</option>

          <option value="mL">Milliliters</option>

          <option value="pack">Packs</option>

          <option value="box">Boxes</option>

          <option value="sachet">Sachets</option>
        </select>
      </div>

      <div className="inventory-form-group">
        <label htmlFor="minimumStock">Minimum Stock</label>

        <input
          id="minimumStock"
          name="minimumStock"
          type="number"
          min="0"
          step="0.01"
          placeholder="0"
          value={formData.minimumStock}
          onChange={handleChange}
          disabled={disabled}
          required
        />
      </div>

      <div className="inventory-form-group">
        <label htmlFor="costPerUnit">Cost Per Unit</label>

        <input
          id="costPerUnit"
          name="costPerUnit"
          type="number"
          min="0"
          step="0.01"
          placeholder="0.00"
          value={formData.costPerUnit}
          onChange={handleChange}
          disabled={disabled}
          required
        />
      </div>

      <div className="inventory-form-group">
        <label htmlFor="usagePerLoad">Usage Per Load</label>

        <input
          id="usagePerLoad"
          name="usagePerLoad"
          type="number"
          min="0"
          step="0.01"
          placeholder="0"
          value={formData.usagePerLoad}
          onChange={handleChange}
          disabled={disabled}
          required
        />

        <small className="inventory-form-helper">
          Enter how much of this item is used for one laundry load.
        </small>
      </div>
    </div>
  );
};

export default InventoryItemForm;
