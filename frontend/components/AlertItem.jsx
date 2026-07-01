import TYPE_CONFIG from "./alertConfig";
import ICONS from "./alertIcons";

export default function AlertItem({
  alert,
  onDismiss,
  onAction,
  isLast,
}) {
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
      <div style={{ color: config.iconColor, flexShrink: 0 }}>
        <span data-testid={`alert-dot-${alert.type}`}>
          {ICONS[alert.type]}
        </span>
      </div>

      <div style={{ flex: 1 }}>
        <p
          style={{
            fontSize: "14px",
            fontWeight: "600",
            color: config.titleColor,
            margin: 0,
          }}
        >
          {alert.title}
        </p>

        <p
          style={{
            fontSize: "12px",
            color: "#718096",
            margin: "2px 0 0 0",
          }}
        >
          {alert.description}
        </p>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <button
          data-testid="action-button"
          onClick={() => onAction(alert)}
        >
          {alert.actionLabel} →
        </button>

        <button
          data-testid="dismiss-button"
          aria-label="Dismiss"
          onClick={() => onDismiss(alert.id)}
        >
          ✕
        </button>
      </div>
    </div>
  );
}