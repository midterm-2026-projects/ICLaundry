import BoltIcon from "./icons/BoltIcon";
import BoxIcon from "./icons/BoxIcon";
import TrendIcon from "./icons/TrendIcon";
import { TYPE_STYLES } from "./data/insightStyles";

const ICONS = {
  operational: <BoltIcon />,
  inventory: <BoxIcon />,
  revenue: <TrendIcon />,
};

export default function InsightItem({ insight }) {
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
        <p
          style={{
            fontSize: "14px",
            fontWeight: "700",
            color: styles.titleColor,
            margin: 0,
          }}
        >
          {insight.title}
        </p>

        <p
          style={{
            fontSize: "13px",
            color: "#6b7280",
            margin: "4px 0 0 0",
            lineHeight: "1.5",
          }}
        >
          {insight.description}
        </p>
      </div>
    </div>
  );
}