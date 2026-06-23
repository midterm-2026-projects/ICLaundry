const RevenueForecastingChart = ({
  title = "Revenue Forecast",
  data = [],
}) => {
  return (
    <div>
      <h2>{title}</h2>

      <ul>
        {data.length > 0 ? (
          data.map((item) => (
            <li key={item.id}>
              {item.label}: {item.value}
            </li>
          ))
        ) : (
          <li>No forecast data available</li>
        )}
      </ul>
    </div>
  );
};

export default RevenueForecastingChart;