import { useState } from "react";

const DEFAULT_ALERTS = [
  {
    id: 1,
    type: "critical",
    title: "Out of Stock",
    description: "Drip-dry concentrate — 1 unit has been out of stock since yesterday.",
    actionLabel: "Restock Now",
  },
  {
    id: 2,
    type: "warning",
    title: "Restock Needed",
    description: "Washing detergent (Powder) at 3% stock (40 units). Consider restocking soon.",
    actionLabel: "Restock Now",
  },
  {
  id: 3,
  type: "warning",
  title: "Bleach Powder Running Out",
  description: "Based on usage trends, bleach powder will run out in ~2 days. Buy more to avoid shortage.",
  actionLabel: "View Predictions",
  },
  {
    id: 4,
    type: "info",
    title: "3 Orders Ready for Pickup",
    description: "Send email notifications to customers about their completed laundry. Don't keep them waiting!",
    actionLabel: "Send Notifications",
  },
];

const TYPE_CONFIG = {
  critical: {
    className: "bg-red-50 border-b",
    bg: "#fff5f5",
    borderColor: "#fed7d7",
    iconColor: "#e53e3e",
    titleColor: "#c53030",
    dotColor: "#e53e3e",
  },
  warning: {
    className: "bg-yellow-50 border-b",
    bg: "#fffff0",
    borderColor: "#fefcbf",
    iconColor: "#d69e2e",
    titleColor: "#b7791f",
    dotColor: "#d69e2e",
  },
  info: {
    className: "bg-blue-50 border-b",
    bg: "#ebf8ff",
    borderColor: "#bee3f8",
    iconColor: "#3182ce",
    titleColor: "#2b6cb0",
    dotColor: "#3182ce",
  },
};

const ICONS = {
  critical: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
      <line x1="12" y1="9" x2="12" y2="13"/>
      <line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  ),
  warning: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
    </svg>
  ),
  info: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  ),
};

function AlertItem({ alert, onDismiss, onAction, isLast }) {
  const config = TYPE_CONFIG[alert.type];
  const className = isLast
    ? config.className.replace(" border-b", "")
    : config.className;

  return (
    <div
      data-testid="alert-item"
      className={className}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "14px 16px",
        backgroundColor: config.bg,
        borderBottom: isLast ? "none" : `1px solid ${config.borderColor}`,
      }}
    >
      {/* Icon */}
      <div style={{ color: config.iconColor, flexShrink: 0 }}>
        <span data-testid={`alert-dot-${alert.type}`}>
          {ICONS[alert.type]}
        </span>
      </div>

      {/* Text */}
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: "14px", fontWeight: "600", color: config.titleColor, margin: 0 }}>
          {alert.title}
        </p>
        <p style={{ fontSize: "12px", color: "#718096", margin: "2px 0 0 0" }}>
          {alert.description}
        </p>
      </div>

      {/* Buttons */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
        <button
          data-testid="action-button"
          onClick={() => onAction(alert)}
          style={{
            fontSize: "12px",
            padding: "6px 12px",
            borderRadius: "6px",
            border: "1px solid #e2e8f0",
            backgroundColor: "white",
            color: "#4a5568",
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
        >
          {alert.actionLabel} →
        </button>
        <button
          data-testid="dismiss-button"
          onClick={() => onDismiss(alert.id)}
          aria-label="Dismiss"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#a0aec0",
            padding: "2px",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

export default function SuggestionsAlerts({ alerts = DEFAULT_ALERTS }) {
  const [items, setItems] = useState(alerts);

  const handleDismiss = (id) => setItems((prev) => prev.filter((a) => a.id !== id));
  const handleAction = (alert) => console.log("Action:", alert.actionLabel, alert.title);

  return (
    <div
      data-testid="suggestions-alerts-panel"
      style={{
        backgroundColor: "white",
        border: "1px solid #e2e8f0",
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
      }}
    >
      {/* Header */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 16px",
        borderBottom: "1px solid #e2e8f0",
        backgroundColor: "white",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ecc94b" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <span style={{ fontSize: "14px", fontWeight: "600", color: "#2d3748" }}>
            Suggestions & Alerts
          </span>
        </div>
        <span style={{
          fontSize: "12px",
          color: "#718096",
          backgroundColor: "#f7fafc",
          padding: "2px 8px",
          borderRadius: "999px",
          border: "1px solid #e2e8f0",
        }}>
          {items.length}
        </span>
      </div>

      {/* Body */}
      {items.length === 0 ? (
        <div
          data-testid="empty-state"
          style={{ padding: "24px", textAlign: "center", color: "#a0aec0", fontSize: "14px" }}
        >
          No alerts at this time.
        </div>
      ) : (
        <div>
          {items.map((alert, index) => (
            <AlertItem
              key={alert.id}
              alert={alert}
              onDismiss={handleDismiss}
              onAction={handleAction}
              isLast={index === items.length - 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}