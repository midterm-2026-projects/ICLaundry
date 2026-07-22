const currency = (value) => new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP", maximumFractionDigits: 0 }).format(Number(value) || 0);

const periodDescriptions = {
  weekly: "Daily breakdown",
  monthly: "Monthly breakdown",
  yearly: "Annual breakdown",
};

const RevenueExpenseTrendChart = ({ revenue = [], expenses = [], period = "monthly" }) => {
  const records = new Map();
  revenue.forEach((item) => records.set(item.id ?? item.label, { label: item.label, revenue: Number(item.value) || 0, expenses: 0 }));
  expenses.forEach((item) => {
    const key = item.id ?? item.label;
    const current = records.get(key) || { label: item.label, revenue: 0, expenses: 0 };
    records.set(key, { ...current, expenses: Number(item.value) || 0 });
  });
  const data = [...records.values()];
  const maximum = Math.max(...data.flatMap((item) => [item.revenue, item.expenses]), 1);

  return (
    <section className="analytics-chart-card analytics-trend-card" aria-label="Revenue and Expense Trend">
      <header>
        <div><h2>Revenue &amp; Expense Trend</h2><p>{periodDescriptions[period] || "Descriptive Analytics"}</p></div>
        <div className="analytics-series-legend"><span className="revenue">Revenue</span><span className="expenses">Expenses</span></div>
      </header>
      {data.length ? <div className="analytics-comparison-chart" role="img" aria-label="Revenue and expense comparison chart">
        {data.map((item) => <div className="analytics-comparison-column" key={item.label}>
          <div className="analytics-comparison-bars">
            <span className="revenue" title={`Revenue: ${currency(item.revenue)}`} style={{ height: `${Math.max(5, item.revenue / maximum * 165)}px` }} />
            <span className="expenses" title={`Expenses: ${currency(item.expenses)}`} style={{ height: `${Math.max(5, item.expenses / maximum * 165)}px` }} />
          </div>
          <strong>{item.label}</strong>
        </div>)}
      </div> : <div className="analytics-chart-empty">No revenue or expense data for the selected filters.</div>}
    </section>
  );
};

export default RevenueExpenseTrendChart;
