const RECOMMENDATIONS = [
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

const TYPE_STYLES = {
  revenue: {
    bg: "#ecfdf5",
    iconBg: "#d1fae5",
    iconColor: "#10b981",
  },
  restock: {
    bg: "#fffbeb",
    iconBg: "#fef3c7",
    iconColor: "#f59e0b",
  },
};

function TrendIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  );
}

function AlertTriangleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

function BrainIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2">
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z" />
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z" />
    </svg>
  );
}

function RecommendationItem({ item }) {
  const styles = TYPE_STYLES[item.type];

  return (
    <div
      data-testid="recommendation-item"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "12px",
        padding: "14px 16px",
        backgroundColor: styles.bg,
        borderRadius: "10px",
        marginBottom: "10px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "32px",
            height: "32px",
            borderRadius: "8px",
            backgroundColor: styles.iconBg,
            color: styles.iconColor,
            flexShrink: 0,
          }}
        >
          {item.type === "revenue" ? <TrendIcon /> : <AlertTriangleIcon />}
        </div>
        <div style={{ fontSize: "14px", color: "#374151" }}>
          <span style={{ color: "#6b7280" }}>{item.label} </span>
          {item.type === "revenue" ? (
            <>
              <span style={{ fontWeight: "700", color: "#059669" }}>{item.highlight}</span>{" "}
              <span style={{ color: "#9ca3af" }}>{item.suffix}</span>
            </>
          ) : (
            <>
              <span style={{ fontWeight: "600" }}>{item.highlight}</span>{" "}
              <span style={{ color: "#6b7280" }}>{item.suffix} </span>
              <span style={{ fontWeight: "600" }}>{item.days}</span>{" "}
              <span style={{ color: "#9ca3af" }}>{item.detail}</span>
            </>
          )}
        </div>
      </div>
      {item.actionLabel && (
        <button
          data-testid="restock-button"
          style={{
            fontSize: "13px",
            padding: "6px 14px",
            borderRadius: "6px",
            border: "none",
            backgroundColor: "#f3f4f6",
            color: "#374151",
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
        >
          {item.actionLabel} →
        </button>
      )}
    </div>
  );
}

export default function DecisionSupportOverview({ recommendations = RECOMMENDATIONS }) {
  return (
    <div
      data-testid="decision-support-panel"
      style={{
        backgroundColor: "white",
        border: "1px solid #e5e7eb",
        borderRadius: "12px",
        padding: "16px",
        marginTop: "16px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <BrainIcon />
          <span style={{ fontSize: "14px", fontWeight: "600", color: "#1f2937" }}>
            Decision Support Overview
          </span>
        </div>
        <button
          data-testid="predictions-button"
          style={{
            fontSize: "12px",
            padding: "5px 12px",
            borderRadius: "999px",
            border: "none",
            backgroundColor: "#ede9fe",
            color: "#7c3aed",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          ⚡ Predictions
        </button>
      </div>

      <div>
        {recommendations.map((item) => (
          <RecommendationItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}