// frontend/src/components/StatusFilter.jsx

const STATUS_ICONS = {
  pending: "⏳",
  washing: "🧺",
  drying: "☀️",
  folding: "👕",
  ready: "✅",
  released: "📦",
  cancelled: "🚫",
};

const statuses = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Washing", value: "washing" },
  { label: "Drying", value: "drying" },
  { label: "Folding", value: "folding" },
  { label: "Ready for Pick-up", value: "ready" },
  { label: "Released", value: "released" },
  { label: "Cancelled", value: "cancelled" },
];

const StatusFilter = ({ selectedStatus = "all", onStatusChange }) => {
  return (
    <div className="garment-filters">
      {statuses.map((status) => (
        <button
          key={status.value}
          type="button"
          className={`garment-filter-btn ${
            selectedStatus === status.value ? "active" : ""
          }`}
          onClick={() => onStatusChange(status.value)}
        >
          {status.value !== "all" && (
            <span className="garment-filter-icon">
              {STATUS_ICONS[status.value]}
            </span>
          )}
          {status.label}
        </button>
      ))}
    </div>
  );
};

export default StatusFilter;
