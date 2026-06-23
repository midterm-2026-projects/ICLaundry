const DSSInsightsCard = ({
  insight = "No insights available",
}) => {
  return (
    <div>
      <h2>DSS Insights</h2>
      <p>{insight}</p>
    </div>
  );
};

export default DSSInsightsCard;