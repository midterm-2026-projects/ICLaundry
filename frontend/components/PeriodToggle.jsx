const periods = ["weekly", "monthly", "yearly"];

const PeriodToggle = ({ selectedPeriod = "monthly", onPeriodChange }) => (
  <div className="analytics-period-toggle" aria-label="Analytics period">
    {periods.map((period) => (
      <button key={period} type="button" className={selectedPeriod === period ? "active" : ""} onClick={() => onPeriodChange?.(period)}>
        {period.charAt(0).toUpperCase() + period.slice(1)}
      </button>
    ))}
  </div>
);

export default PeriodToggle;
