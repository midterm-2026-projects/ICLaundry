import { BarChart3, TrendingUp } from "lucide-react";

const money = (value) => new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  notation: "compact",
  maximumFractionDigits: 1,
}).format(Number(value) || 0);

const normalize = (data) => data.map((item, index) => ({
  id: item.id ?? item.label ?? index,
  label: item.label ?? "Period",
  value: Number(item.value) || 0,
}));

export function WeeklyOrdersChart({ data = [] }) {
  const records = normalize(data);
  const maximum = Math.max(...records.map((item) => item.value), 1);

  return (
    <section className="dashboard-chart-card" aria-label="Weekly Orders Chart">
      <header>
        <div className="dashboard-chart-heading">
          <span className="blue"><BarChart3 size={18} /></span>
          <div><h2>Weekly Orders</h2><p>Daily transaction volume</p></div>
        </div>
        <strong>{records.reduce((sum, item) => sum + item.value, 0)} orders</strong>
      </header>
      {records.length ? (
        <div className="dashboard-bar-chart" role="img" aria-label="Weekly orders bar chart">
          {records.map((item) => (
            <div className="dashboard-bar-column" key={item.id} title={`${item.label}: ${item.value} orders`}>
              <span>{item.value}</span>
              <div style={{ height: `${Math.max(8, (item.value / maximum) * 150)}px` }} />
              <small>{item.label}</small>
            </div>
          ))}
        </div>
      ) : <div className="dashboard-chart-empty">No order data is available for this week.</div>}
    </section>
  );
}

export function RevenueTrendChart({ data = [] }) {
  const records = normalize(data);
  const maximum = Math.max(...records.map((item) => item.value), 1);
  const width = 600;
  const height = 180;
  const points = records.map((item, index) => ({
    ...item,
    x: records.length === 1 ? width / 2 : (index / (records.length - 1)) * width,
    y: height - (item.value / maximum) * (height - 24) - 8,
  }));
  const path = points.map((point, index) => `${index ? "L" : "M"} ${point.x} ${point.y}`).join(" ");

  return (
    <section className="dashboard-chart-card" aria-label="Weekly Revenue Trend">
      <header>
        <div className="dashboard-chart-heading">
          <span className="green"><TrendingUp size={18} /></span>
          <div><h2>Weekly Revenue Trend</h2><p>Collected payments by day</p></div>
        </div>
        <strong>{money(records.reduce((sum, item) => sum + item.value, 0))}</strong>
      </header>
      {records.length ? (
        <div className="dashboard-line-chart" role="img" aria-label="Weekly revenue line chart">
          <svg viewBox={`-10 -10 ${width + 20} ${height + 20}`} preserveAspectRatio="none" aria-hidden="true">
            <defs><linearGradient id="dashboardRevenueArea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#10b981" stopOpacity=".28" /><stop offset="1" stopColor="#10b981" stopOpacity=".02" /></linearGradient></defs>
            <path className="dashboard-line-area" d={`${path} L ${points.at(-1).x} ${height} L ${points[0].x} ${height} Z`} />
            <path className="dashboard-line-path" d={path} />
            {points.map((point) => <circle key={point.id} cx={point.x} cy={point.y} r="5" />)}
          </svg>
          <div className="dashboard-line-labels" style={{ gridTemplateColumns: `repeat(${points.length}, minmax(0, 1fr))` }}>{points.map((point) => <span key={point.id} title={`${point.label}: ${money(point.value)}`}>{point.label}</span>)}</div>
        </div>
      ) : <div className="dashboard-chart-empty">No revenue data is available for this week.</div>}
    </section>
  );
}

export default { WeeklyOrdersChart, RevenueTrendChart };
