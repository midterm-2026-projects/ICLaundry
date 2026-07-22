const DateRangeFilter = ({ startDate = "", endDate = "", onStartDateChange, onEndDateChange }) => (
  <div className="analytics-date-filter">
    <div className="analytics-filter-field">
      <label htmlFor="startDate">Start Date</label>
      <input id="startDate" type="date" value={startDate} max={endDate || undefined} onChange={(event) => onStartDateChange?.(event.target.value)} />
    </div>
    <div className="analytics-filter-field">
      <label htmlFor="endDate">End Date</label>
      <input id="endDate" type="date" value={endDate} min={startDate || undefined} onChange={(event) => onEndDateChange?.(event.target.value)} />
    </div>
  </div>
);

export default DateRangeFilter;
