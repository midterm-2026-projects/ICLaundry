// frontend/src/components/NewOrderButton.jsx

import { Plus } from "lucide-react";

const NewOrderButton = ({ onClick }) => {
  return (
    <button type="button" className="btn btn-primary" onClick={onClick}>
      <Plus size={18} /> New Order
    </button>
  );
};

export default NewOrderButton;
