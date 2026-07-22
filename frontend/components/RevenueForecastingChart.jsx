const formatCurrency = (value) => new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP", maximumFractionDigits: 0 }).format(Number(value) || 0);

const RevenueForecastingChart = ({ title = "Revenue Forecast", data = [], valueKey = "value", tone = "blue" }) => {
  const values = data.map((item) => Number(item[valueKey] ?? item.value ?? item.actual ?? item.forecast ?? 0));
  const maximum = Math.max(...values, 1);

  return (
    <section className="analytics-chart-card" aria-label={title}>
      <header><div><h2>{title}</h2><p>{data.length} data point{data.length === 1 ? "" : "s"}</p></div><span className={`analytics-chart-legend ${tone}`}>Amount</span></header>
      {data.length ? (
        <div className="analytics-chart" role="img" aria-label={`${title} bar chart`}>
          {data.map((item, index) => {
            const value = values[index];
            return <div className="analytics-chart-column" key={item.id ?? item.period ?? item.label ?? index} title={`${item.label ?? item.period}: ${formatCurrency(value)}`}>
              <span className="analytics-chart-value">{formatCurrency(value)}</span>
              <div className={`analytics-chart-bar ${tone}`} style={{ height: `${Math.max(8, (value / maximum) * 150)}px` }} />
              <span className="analytics-chart-label">{item.label ?? item.period ?? "Period"}</span>
            </div>;
          })}
        </div>
      ) : <div className="analytics-chart-empty">No chart data available for the selected filters.</div>}
    </section>
  );
};

export default RevenueForecastingChart;
