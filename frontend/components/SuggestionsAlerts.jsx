import { useState } from "react";
import AlertItem from "./AlertItem";
import DEFAULT_ALERTS from "./alertData";

export default function SuggestionsAlerts({
  alerts = DEFAULT_ALERTS,
}) {
  const [items, setItems] = useState(alerts);

  const handleDismiss = (id) =>
    setItems((prev) => prev.filter((a) => a.id !== id));

  const handleAction = (alert) =>
    console.log("Action:", alert.actionLabel, alert.title);

  return (
    <div data-testid="suggestions-alerts-panel">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "12px 16px",
        }}
      >
        <span>Suggestions & Alerts</span>

        <span>{items.length}</span>
      </div>

      {items.length === 0 ? (
        <div data-testid="empty-state">
          No alerts at this time.
        </div>
      ) : (
        items.map((alert, index) => (
          <AlertItem
            key={alert.id}
            alert={alert}
            onDismiss={handleDismiss}
            onAction={handleAction}
            isLast={index === items.length - 1}
          />
        ))
      )}
    </div>
  );
}