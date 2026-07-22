// frontend/src/components/StatusTracker.jsx

import { ArrowRight } from "lucide-react";

const STATUS_LABELS = {
  pending: "Pending",
  washing: "Washing",
  drying: "Drying",
  folding: "Folding",
  ready: "Ready for pick-up",
  released: "Released",
};

const statuses = [
  { label: STATUS_LABELS.pending, value: "pending" },
  { label: STATUS_LABELS.washing, value: "washing" },
  { label: STATUS_LABELS.drying, value: "drying" },
  { label: STATUS_LABELS.folding, value: "folding" },
  { label: STATUS_LABELS.ready, value: "ready" },
  { label: STATUS_LABELS.released, value: "released" },
];

const StatusTracker = ({ currentStatus = "pending", onStatusChange }) => {
  const currentIndex = statuses.findIndex(
    (status) => status.value === currentStatus?.toLowerCase(),
  );

  const nextStatus = statuses[currentIndex + 1];

  const handleNextStatus = () => {
    if (!nextStatus) {
      return;
    }

    if (onStatusChange) {
      onStatusChange(nextStatus.value);
    }
  };

  return (
    <div className="status-track">
      <div className="status-dots">
        {statuses.map((status, index) => (
          <div key={status.value} className="status-dot-group" title={status.label}>
            {index > 0 && (
              <div
                className={`status-line ${index <= currentIndex ? "filled" : ""}`}
              />
            )}
            <div
              className={`status-dot ${index <= currentIndex ? "filled" : ""} ${
                index === currentIndex ? "current" : ""
              }`}
            />
          </div>
        ))}
      </div>

      <div className="status-track-label">
        <span
          className={`badge badge-${statuses[currentIndex]?.value || currentStatus}`}
        >
          {statuses[currentIndex]?.label || currentStatus}
        </span>

        {nextStatus && onStatusChange && (
          <button
            type="button"
            className="status-next-btn"
            onClick={handleNextStatus}
            title={`Move to ${nextStatus.label}`}
          >
            <ArrowRight size={14} />
          </button>
        )}
      </div>
    </div>
  );
};

export default StatusTracker;
