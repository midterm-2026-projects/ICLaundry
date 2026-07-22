import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";

const BUNDLE_KG = 8;
const BUNDLE_PRICE = 200;
const EXCESS_KG_PRICE = 30;
const SOAP_PRICE = 15;

/**
 * ==============================================
 * CALCULATE TOTAL PRICE
 * ==============================================
 */
const calculateTotalPrice = (weight, addons) => {
  const weightKg = Number(weight);

  if (!Number.isFinite(weightKg) || weightKg <= 0) {
    return 0;
  }

  let total = BUNDLE_PRICE;

  if (weightKg > BUNDLE_KG) {
    total += Math.ceil(weightKg - BUNDLE_KG) * EXCESS_KG_PRICE;
  }

  const soapQty = Number(addons?.soap ?? 0);

  total += soapQty * SOAP_PRICE;

  return total;
};

/**
 * ==============================================
 * PAYMENT STATUS
 * ==============================================
 */
const calculatePaymentStatus = (totalPrice, amountPaid) => {
  const total = Number(totalPrice);
  const paid = Number(amountPaid);

  if (paid <= 0) {
    return "unpaid";
  }

  if (paid >= total) {
    return "paid";
  }

  return "partial";
};

const getOrderId = (order) =>
  order?.id ?? order?.order_id ?? order?.uuid ?? order?._id ?? null;

const EditOrderModal = ({ order, onUpdateOrder, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const [formData, setFormData] = useState({
    customer_name: "",
    customer_phone: "",
    weight_kg: 0,
    addons: { soap: 0 },
    amount_paid: 0,
    payment_method: "cash",
    notes: "",
  });

  /**
   * ==============================================
   * LOAD ORDER
   * ==============================================
   */
  useEffect(() => {
    if (!order) {
      return;
    }

    setFormData({
      customer_name: order.customers?.name ?? "",
      customer_phone: order.customers?.phone ?? "",
      weight_kg: Number(order.weight_kg ?? 0),
      addons: { soap: Number(order.addons?.soap ?? 0) },
      amount_paid: Number(order.amount_paid ?? 0),
      payment_method: order.payment_method ?? "cash",
      notes: order.notes ?? "",
    });
  }, [order]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]:
        name === "weight_kg" || name === "amount_paid" ? Number(value) : value,
    }));
  };

  const handleAddonChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      addons: {
        ...previous.addons,
        [name]: Number(value),
      },
    }));
  };

  const totalPrice = useMemo(
    () => calculateTotalPrice(formData.weight_kg, formData.addons),
    [formData.weight_kg, formData.addons],
  );

  const remainingBalance = useMemo(
    () => Math.max(totalPrice - Number(formData.amount_paid), 0),
    [totalPrice, formData.amount_paid],
  );

  const paymentStatus = useMemo(
    () => calculatePaymentStatus(totalPrice, formData.amount_paid),
    [totalPrice, formData.amount_paid],
  );

  const handleSubmit = () => {
    const orderId = getOrderId(order);

    if (!orderId) {
      alert("Cannot update order because the order ID is missing.");
      console.error("Update failed. Order ID is missing:", order);
      return;
    }

    onUpdateOrder(orderId, {
      weight_kg: Number(formData.weight_kg),
      total_price: totalPrice,
      addons: { soap: Number(formData.addons.soap) },
      amount_paid: Number(formData.amount_paid),
      payment_method: formData.payment_method,
      payment_status: paymentStatus,
      notes: formData.notes,
    });
  };

  if (!order) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="order-modal" onClick={(e) => e.stopPropagation()}>
        <div className="order-modal-header">
          <div>
            <h3>Edit Order</h3>
            <p>Order #{order.order_number}</p>
          </div>
          <button type="button" className="btn-icon" aria-label="Close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="order-modal-body">
          {/* CUSTOMER */}
          <div className="order-section">
            <div className="order-section-title">Client & Service</div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="customer-name">Customer</label>
                <input
                  id="customer-name"
                  className="form-control"
                  type="text"
                  value={formData.customer_name}
                  disabled
                />
              </div>

              <div className="form-group">
                <label htmlFor="customer-phone">Phone Number</label>
                <input
                  id="customer-phone"
                  className="form-control"
                  type="text"
                  value={formData.customer_phone}
                  disabled
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="weight">Weight (kg)</label>
                <input
                  id="weight"
                  className="form-control"
                  type="number"
                  min="1"
                  name="weight_kg"
                  value={formData.weight_kg}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="soap">Soap Add-on</label>
                <input
                  id="soap"
                  className="form-control"
                  type="number"
                  min="0"
                  name="soap"
                  value={formData.addons.soap}
                  onChange={handleAddonChange}
                />
              </div>
            </div>
          </div>

          {/* PAYMENT */}
          <div className="order-section">
            <div className="order-section-title">Payment</div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="amount-paid">Amount Paid</label>
                <input
                  id="amount-paid"
                  className="form-control"
                  type="number"
                  min="0"
                  name="amount_paid"
                  value={formData.amount_paid}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="payment-method">Payment Method</label>
                <select
                  id="payment-method"
                  className="form-control"
                  name="payment_method"
                  value={formData.payment_method}
                  onChange={handleChange}
                >
                  <option value="cash">Cash</option>
                  <option value="gcash">GCash</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="card">Card</option>
                </select>
              </div>
            </div>

            {/* SUMMARY */}
            <div className="pricing-card">
              <div className="pricing-header">Summary</div>

              <div className="pricing-row">
                <span>Total Price</span>
                <span>
                  ₱
                  {Number.isFinite(totalPrice) ? totalPrice.toFixed(2) : "0.00"}
                </span>
              </div>

              <div className="pricing-row">
                <span>Amount Paid</span>
                <span>₱{Number(formData.amount_paid).toFixed(2)}</span>
              </div>

              <div className="pricing-row">
                <span>Remaining Balance</span>
                <span>₱{remainingBalance.toFixed(2)}</span>
              </div>

              <div className="pricing-total">
                <span>Payment Status</span>
                <span className={`badge badge-${paymentStatus}`}>
                  {paymentStatus}
                </span>
              </div>
            </div>
          </div>

          {/* NOTES */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              className="form-control"
              rows={3}
              name="notes"
              value={formData.notes}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="order-modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSubmit}
          >
            Update Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditOrderModal;
