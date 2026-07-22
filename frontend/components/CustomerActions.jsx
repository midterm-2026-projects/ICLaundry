import { Plus } from "lucide-react";

const CustomerActions = ({ onAddCustomer }) => {
  return (
    <button
      type="button"
      onClick={onAddCustomer}
      className="btn btn-primary customer-add-button"
    >
      <Plus size={18} aria-hidden="true" />
      Add Customer
    </button>
  );
};

export default CustomerActions;
