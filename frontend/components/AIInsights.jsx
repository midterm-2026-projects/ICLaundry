const INSIGHTS = [
  {
    id: 1,
    type: "operational",
    title: "Operational Recommendation",
    description: "Focus on fulfilling active orders and ensuring items ready for pickup are promptly communicated to customers, as current workload is low.",
  },
  {
    id: 2,
    type: "inventory",
    title: "Inventory Recommendation",
    description: "Address the 2 low stock items immediately to prevent potential order delays and customer dissatisfaction.",
  },
  {
    id: 3,
    type: "revenue",
    title: "Revenue Improvement Idea",
    description: "Leverage the predicted low workload and the peak day of Saturday to offer a special weekend promotion or express service for additional revenue.",
  },
];

const TYPE_STYLES = {
  operational: {
    bg: "#eef2ff",
    iconColor: "#6366f1",
    titleColor: "#4f46e5",
  },
  inventory: {
    bg: "#fffbeb",
    iconColor: "#f59e0b",
    titleColor: "#d97706",
  },
  revenue: {
    bg: "#ecfdf5",
    iconColor: "#10b981",
    titleColor: "#059669",
  },
};

function BoltIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

function BoxIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  );
}

function TrendIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
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

const ICONS = {
  operational: <BoltIcon />,
  inventory: <BoxIcon />,
  revenue: <TrendIcon />,
};

function InsightItem({ insight }) {
  const styles = TYPE_STYLES[insight.type];
  return (
    <div
      data-testid="insight-item"
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "12px",
        padding: "16px",
        backgroundColor: styles.bg,
        borderRadius: "10px",
        marginBottom: "10px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "32px",
          height: "32px",
          borderRadius: "8px",
          backgroundColor: "white",
          color: styles.iconColor,
          flexShrink: 0,
        }}
      >
        {ICONS[insight.type]}
      </div>
      <div>
        <p style={{ fontSize: "14px", fontWeight: "700", color: styles.titleColor, margin: 0 }}>
          {insight.title}
        </p>
        <p style={{ fontSize: "13px", color: "#6b7280", margin: "4px 0 0 0", lineHeight: "1.5" }}>
          {insight.description}
        </p>
      </div>
    </div>
  );
}

export default function AIInsights({ insights = INSIGHTS }) {
  return (
    <div
      data-testid="ai-insights-panel"
      style={{
        background: "linear-gradient(135deg, #f5f3ff 0%, #faf5ff 100%)",
        border: "1px solid #e9d5ff",
        borderRadius: "12px",
        padding: "16px",
        marginTop: "16px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <BrainIcon />
          <span style={{ fontSize: "14px", fontWeight: "600", color: "#1f2937" }}>
            AI Insights
          </span>
        </div>
        <span
          data-testid="model-badge"
          style={{
            fontSize: "12px",
            padding: "5px 12px",
            borderRadius: "999px",
            backgroundColor: "#ede9fe",
            color: "#7c3aed",
          }}
        >
          Gemini-2.5-Flash-Lite
        </span>
      </div>

      <div>
        {insights.map((insight) => (
          <InsightItem key={insight.id} insight={insight} />
        ))}
      </div>
    </div>
  );
}