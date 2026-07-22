import { Edit2, Mail, MapPin, Phone, Trash2, UserRound } from "lucide-react";

const CustomerTable = ({ customers = [], onEdit, onDelete }) => {
  return (
    <div className="customers-card">
      <div className="customers-table-wrapper">
        <table className="customers-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Contact</th>
              <th>Address</th>
              <th>Notes</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {customers.length > 0 ? (
              customers.map((customer) => (
                <tr key={customer.id}>
                  <td>
                    <div className="customer-identity">
                      <span className="customer-avatar" aria-hidden="true">
                        <UserRound size={18} />
                      </span>
                      <div>
                        <strong>{customer.name}</strong>
                        <span>Customer profile</span>
                      </div>
                    </div>
                  </td>

                  <td>
                    <div className="customer-contact">
                      <span>
                        <Phone size={14} aria-hidden="true" />
                        {customer.phone || "No phone number"}
                      </span>
                      <span>
                        <Mail size={14} aria-hidden="true" />
                        {customer.email || "No email address"}
                      </span>
                    </div>
                  </td>

                  <td>
                    <span className="customer-address">
                      <MapPin size={15} aria-hidden="true" />
                      {customer.address || "No address provided"}
                    </span>
                  </td>

                  <td className="customer-notes">
                    {customer.notes || "No notes"}
                  </td>

                  <td>
                    <div className="customer-row-actions">
                      <button
                        type="button"
                        onClick={() => onEdit(customer)}
                        className="btn-icon customer-edit-button"
                        aria-label={`Edit ${customer.name}`}
                        title="Edit customer"
                      >
                        <Edit2 size={16} aria-hidden="true" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onDelete(customer)}
                        className="btn-icon customer-delete-button"
                        aria-label={`Delete ${customer.name}`}
                        title="Delete customer"
                      >
                        <Trash2 size={16} aria-hidden="true" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="customers-empty-state">
                  <span className="customers-empty-icon" aria-hidden="true">
                    <UserRound size={25} />
                  </span>
                  <strong>No customers found</strong>
                  <p>Try a different search or add your first customer.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerTable;
