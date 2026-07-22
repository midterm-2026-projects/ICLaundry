import { useEffect, useState } from "react";
import { UserRound, X } from "lucide-react";

const emptyCustomer = {
  name: "",
  phone: "",
  email: "",
  address: "",
  notes: "",
};

const CustomerModal = ({
  customer = null,
  isEditing = false,
  onSubmit,
  onClose,
}) => {
  const [formData, setFormData] = useState(emptyCustomer);

  useEffect(() => {
    setFormData(
      customer
        ? {
            name: customer.name || "",
            phone: customer.phone || "",
            email: customer.email || "",
            address: customer.address || "",
            notes: customer.notes || "",
          }
        : emptyCustomer,
    );
  }, [customer]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!formData.name.trim()) {
      alert("Customer name is required.");
      return;
    }

    if (!formData.phone.trim()) {
      alert("Phone number is required.");
      return;
    }

    onSubmit?.(formData);
  };

  return (
    <div
      className="modal-overlay customer-modal-overlay"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose?.();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="customer-modal-title"
        className="order-modal customer-modal"
      >
        <header className="order-modal-header">
          <div className="customer-modal-title">
            <span aria-hidden="true"><UserRound size={20} /></span>
            <div>
              <h3 id="customer-modal-title">
                {isEditing ? "Edit Customer" : "Add Customer"}
              </h3>
              <p>
                {isEditing
                  ? "Update the customer profile and contact details."
                  : "Create a customer profile for faster order processing."}
              </p>
            </div>
          </div>

          <button
            type="button"
            className="btn-icon"
            aria-label="Close customer modal"
            onClick={onClose}
          >
            <X size={18} aria-hidden="true" />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="customer-modal-form">
          <div className="order-modal-body">
            <section className="order-section customer-form-section">
              <div className="order-section-title">Customer information</div>

              <div className="form-group">
                <label htmlFor="customer-name">Customer Name</label>
                <input id="customer-name" className="form-control" type="text" name="name" value={formData.name} onChange={handleChange} autoFocus />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="customer-phone">Phone Number</label>
                  <input id="customer-phone" className="form-control" type="text" name="phone" value={formData.phone} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label htmlFor="customer-email">Email</label>
                  <input id="customer-email" className="form-control" type="email" name="email" value={formData.email} onChange={handleChange} />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="customer-address">Address</label>
                <textarea id="customer-address" className="form-control" name="address" rows={2} value={formData.address} onChange={handleChange} />
              </div>

              <div className="form-group customer-notes-field">
                <label htmlFor="customer-notes">Notes</label>
                <textarea id="customer-notes" className="form-control" name="notes" rows={3} value={formData.notes} onChange={handleChange} placeholder="Preferences or other helpful information..." />
              </div>
            </section>
          </div>

          <footer className="order-modal-footer">
            <button type="button" onClick={onClose} className="btn btn-secondary">Cancel</button>
            <button type="submit" className="btn btn-primary">
              {isEditing ? "Update Customer" : "Create Customer"}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
};

export default CustomerModal;
