// frontend/src/components/TimeLeftDisplay.jsx

import { Clock } from "lucide-react";

const TimeLeftDisplay = ({ timeLeft = "Calculating..." }) => {
  return (
    <span className="order-time-left">
      <Clock size={14} /> {timeLeft || "—"}
    </span>
  );
};

export default TimeLeftDisplay;
