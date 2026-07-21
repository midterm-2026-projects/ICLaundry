// frontend/src/components/NewOrderModal.jsx

import { useMemo, useState } from "react";
import { CheckCircle2, Minus, Plus, X } from "lucide-react";

const BUNDLE_KG = 8;
const BUNDLE_PRICE = 200;
const EXCESS_KG_PRICE = 30;
const ADDON_PRICE = 9;

const ADDONS = [
  { id: 1, name: "300", stock: 20 },
  { id: 2, name: "Ariel", stock: 0 },
  { id: 3, name: "ariel powder", stock: 15 },
  { id: 4, name: "bleach powder", stock: 85 },
  { id: 5, name: "downy", stock: 4833 },
];

const NewOrderModal = ({ onCreateOrder, onClose }) => {
  const [formData, setFormData] = useState({
    customer_name: "",
    customer_phone: "",
    customer_email: "",
    weight_kg: "",
    payment_method: "cash",
    amount_paid: "",
    notes: "",
  });

  const [addons, setAddons] = useState([]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const addAddon = (addon) => {
    const existing = addons.find((item) => item.id === addon.id);

    if (existing) {
      setAddons((previous) =>
        previous.map((item) =>
          item.id === addon.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        ),
      );
      return;
    }

    setAddons((previous) => [...previous, { ...addon, quantity: 1 }]);
  };

  const removeAddon = (addonId) => {
    setAddons((previous) =>
      previous
        .map((item) =>
          item.id === addonId
            ? { ...item, quantity: item.quantity - 1 }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const addonTotal = useMemo(
    () => addons.reduce((sum, item) => sum + item.quantity * ADDON_PRICE, 0),
    [addons],
  );

  const laundryTotal = useMemo(() => {
    const weight = Number(formData.weight_kg || 0);

    if (weight <= 0) {
      return 0;
    }

    let laundry = BUNDLE_PRICE;

    if (weight > BUNDLE_KG) {
      laundry += Math.ceil(weight - BUNDLE_KG) * EXCESS_KG_PRICE;
    }

    return laundry;
  }, [formData.weight_kg]);

  const totalPrice = laundryTotal + addonTotal;

  const paymentStatus = useMemo(() => {
    const paid = Number(formData.amount_paid || 0);

    if (paid >= totalPrice && totalPrice > 0) {
      return "paid";
    }

    if (paid > 0) {
      return "partial";
    }

    return "unpaid";
  }, [formData.amount_paid, totalPrice]);

  const handleSubmit = async () => {
    if (
      !formData.customer_name ||
      !formData.customer_phone ||
      !formData.weight_kg
    ) {
      alert("Please complete customer details and weight.");
      return;
    }

    const orderData = {
      customer_name: formData.customer_name.trim(),
      customer_phone: formData.customer_phone.trim(),
      customer_email: formData.customer_email.trim() || null,
      weight_kg: Number(formData.weight_kg),
      addons: addons.map((item) => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
      })),
      total_price: Number(totalPrice),
      amount_paid: Number(formData.amount_paid || 0),
      payment_method: formData.payment_method,
      payment_status: paymentStatus,
      notes: formData.notes || "",
    };

    console.log("FINAL ORDER PAYLOAD:", orderData);

    try {
      await onCreateOrder(orderData);
      alert("Order created successfully!");
    } catch (error) {
      console.error("CREATE ORDER FAILED:", error);
      alert(error.message || "Failed to create order");
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="order-modal" onClick={(e) => e.stopPropagation()}>
        <div className="order-modal-header">
          <div>
            <h3>New Order</h3>
            <p>Fill in the details below</p>
          </div>
          <button className="btn-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="order-modal-body">
          {/* Section: Customer & Service */}
          <div className="order-section">
            <div className="order-section-title">Client & Service</div>

            <div className="form-row">
              <div className="form-group">
                <label>Client Name *</label>
                <input
                  className="form-control"
                  name="customer_name"
                  value={formData.customer_name}
                  onChange={handleChange}
                  placeholder="Client Name"
                />
              </div>

              <div className="form-group">
                <label>Phone Number *</label>
                <input
                  className="form-control"
                  name="customer_phone"
                  value={formData.customer_phone}
                  onChange={handleChange}
                  placeholder="Phone Number"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                className="form-control"
                name="customer_email"
                value={formData.customer_email}
                onChange={handleChange}
                placeholder="Email"
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Weight (kg) *</label>
              <input
                className="form-control"
                type="number"
                name="weight_kg"
                value={formData.weight_kg}
                onChange={handleChange}
                placeholder="e.g. 3.5"
              />
            </div>
          </div>

          {/* Section: Add-ons */}
          <div className="order-section">
            <div className="order-section-title">
              Add-ons{" "}
              <span className="order-section-optional">
                ₱{ADDON_PRICE} each
              </span>
            </div>

            <div className="addon-grid">
              {ADDONS.map((addon) => {
                const selected = addons.find((item) => item.id === addon.id);
                const noStock = addon.stock < 1 && !selected;

                return (
                  <div
                    key={addon.id}
                    className={`addon-item ${selected ? "selected" : ""} ${
                      noStock ? "out-of-stock" : ""
                    }`}
                  >
                    <div className="addon-info">
                      <span className="addon-name">{addon.name}</span>
                      <span className="addon-stock">
                        {addon.stock} pcs in stock
                      </span>
                    </div>

                    <div className="addon-qty">
                      {selected && (
                        <button
                          type="button"
                          className="addon-btn"
                          onClick={() => removeAddon(addon.id)}
                        >
                          <Minus size={14} />
                        </button>
                      )}

                      {selected && (
                        <span className="addon-count">{selected.quantity}</span>
                      )}

                      <button
                        type="button"
                        className="addon-btn addon-btn-add"
                        disabled={addon.stock === 0}
                        onClick={() => addAddon(addon)}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {addons.length > 0 && (
              <div className="soap-selected-info">
                <CheckCircle2 size={15} />
                <span>
                  {addons.map((item) => `${item.name} ×${item.quantity}`).join(", ")}{" "}
                  — will be deducted from inventory
                </span>
              </div>
            )}
          </div>

          {/* Price Breakdown */}
          <div className="order-section">
            <div className="pricing-card">
              <div className="pricing-header">Price Breakdown</div>

              <div className="pricing-row">
                <span>Laundry</span>
                <span>₱{laundryTotal.toLocaleString()}</span>
              </div>

              <div className="pricing-row">
                <span>Add-ons</span>
                <span>₱{addonTotal.toLocaleString()}</span>
              </div>

              <div className="pricing-total">
                <span>Total</span>
                <span>₱{totalPrice.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Section: Payment */}
          <div className="order-section">
            <div className="order-section-title">Payment</div>

            <div className="form-row">
              <div className="form-group">
                <label>Method</label>
                <select
                  className="form-control"
                  name="payment_method"
                  value={formData.payment_method}
                  onChange={handleChange}
                >
                  <option value="cash">Cash</option>
                  <option value="gcash">GCash</option>
                </select>
              </div>

              <div className="form-group">
                <label>Amount Paid</label>
                <input
                  className="form-control"
                  type="number"
                  name="amount_paid"
                  value={formData.amount_paid}
                  onChange={handleChange}
                  placeholder="Amount Paid"
                />
              </div>
            </div>

            <span className={`badge badge-${paymentStatus}`}>
              {paymentStatus}
            </span>
          </div>

          {/* Notes */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Notes</label>
            <textarea
              className="form-control"
              name="notes"
              rows={2}
              value={formData.notes}
              onChange={handleChange}
              placeholder="Special instructions..."
            />
          </div>
        </div>

        <div className="order-modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSubmit}>
            Create Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewOrderModal;
