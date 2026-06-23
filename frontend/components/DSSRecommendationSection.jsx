const DSSRecommendationSection = ({
  recommendation = "No recommendations available",
}) => {
  return (
    <div>
      <h2>DSS Recommendations</h2>
      <p>{recommendation}</p>
    </div>
  );
};

export default DSSRecommendationSection;