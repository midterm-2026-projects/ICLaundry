const DSSAlertsSection = ({
  alert = "No alerts available",
}) => {
  return (
    <div>
      <h2>DSS Alerts</h2>
      <p>{alert}</p>
    </div>
  );
};

export default DSSAlertsSection;