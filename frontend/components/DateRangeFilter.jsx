const DateRangeFilter = () => {
  return (
    <div>
      <label htmlFor="startDate">Start Date</label>
      <input id="startDate" type="date" />

      <label htmlFor="endDate">End Date</label>
      <input id="endDate" type="date" />
    </div>
  );
};

export default DateRangeFilter;