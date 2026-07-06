import BrainIcon from "./icons/BrainIcon";
import InsightItem from "./InsightItem";
import { INSIGHTS } from "./data/insightsData";

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
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "14px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <BrainIcon />
          <span
            style={{
              fontSize: "14px",
              fontWeight: "600",
              color: "#1f2937",
            }}
          >
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

      {insights.map((insight) => (
        <InsightItem key={insight.id} insight={insight} />
      ))}
    </div>
  );
}