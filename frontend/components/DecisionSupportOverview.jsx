
const DEFAULT_RECOMMENDATIONS = [
  {
    id: 1,
    type: "revenue",
    label: "Predicted Revenue:",
    highlight: "₱171",
    suffix: "Next Month",
  },
  {
    id: 2,
    type: "restock",
    label: "Restock Alert:",
    highlight: "ariel powder",
    suffix: "will run out in",
    days: "0 days",
    detail: "Reorder ~521 pcs",
    actionLabel: "Restock",
  },
  {
    id: 3,
    type: "restock",
    label: "Restock Alert:",
    highlight: "bleach powder",
    suffix: "will run out in",
    days: "2 days",
    detail: "Reorder ~1110 pcs",
    actionLabel: "Restock",
  },
];

const TYPE_CONFIG = {
  revenue: {
    backgroundColor: "rgb(236, 253, 245)",
    borderColor: "#6ee7b7",
    iconColor: "#059669",
    iconBg: "#d1fae5",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
        <polyline points="17 6 23 6 23 12" />
      </svg>
    ),
  },
  restock: {
    backgroundColor: "rgb(255, 251, 235)",
    borderColor: "#fde68a",
    iconColor: "#d97706",
    iconBg: "#fef3c7",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
  },
};

function RecommendationItem({ item }) {
  const config = TYPE_CONFIG[item.type] || TYPE_CONFIG.restock;

  return (
    <div
      data-testid="recommendation-item"
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "14px 18px",
        backgroundColor: config.backgroundColor,
        borderRadius: "10px",
        border: `1px solid ${config.borderColor}`,
        marginBottom: "10px",
      }}
    >
      {/* Icon box */}
      <div
        style={{
          flexShrink: 0,
          width: "34px",
          height: "34px",
          borderRadius: "8px",
          backgroundColor: config.iconBg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: config.iconColor,
        }}
      >
        {config.icon}
      </div>

      {/* Inline text */}
      <div style={{ flex: 1, fontSize: "14px", color: "#4b5563", whiteSpace: "nowrap", overflow: "hidden" }}>
        <span>{item.label} </span>
        <span style={{ fontWeight: "700", color: "#111827" }}>{item.highlight}</span>
        {item.suffix && <span> {item.suffix} </span>}
        {item.days && <span style={{ fontWeight: "700", color: "#111827" }}>{item.days}</span>}
        {item.detail && (
          <span style={{ color: "#9ca3af", fontSize: "13px", marginLeft: "6px" }}>{item.detail}</span>
        )}
      </div>

      {/* Restock button */}
      {item.type === "restock" && item.actionLabel && (
        <button
          data-testid="restock-button"
          style={{
            flexShrink: 0,
            fontSize: "13px",
            fontWeight: "500",
            padding: "6px 14px",
            borderRadius: "8px",
            border: "1px solid #d1d5db",
            backgroundColor: "white",
            color: "#374151",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          {item.actionLabel} →
        </button>
      )}
    </div>
  );
}

export default function DecisionSupportOverview({ recommendations = DEFAULT_RECOMMENDATIONS }) {
  return (
    <div
      data-testid="decision-support-panel"
      style={{
        backgroundColor: "white",
        border: "1px solid #e5e7eb",
        borderRadius: "14px",
        padding: "20px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "16px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span style={{ fontSize: "15px", fontWeight: "700", color: "#111827" }}>
            Decision Support Overview
          </span>
        </div>
        <button
          data-testid="predictions-button"
          style={{
            fontSize: "12px",
            fontWeight: "600",
            padding: "5px 14px",
            borderRadius: "999px",
            border: "1px solid #ddd6fe",
            backgroundColor: "#f5f3ff",
            color: "#7c3aed",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "5px",
          }}
        >
          ⚡ Predictions
        </button>
      </div>

      {/* Items */}
      <div>
        {recommendations.map((item) => (
          <RecommendationItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}