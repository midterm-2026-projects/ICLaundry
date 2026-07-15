const statuses = [
  "Pending",
  "Washing",
  "Drying",
  "Folding",
  "Ready for Pick-up",
  "Released",
];

const StatusTracker = ({ currentStatus, onStatusChange }) => {
  const currentIndex = statuses.indexOf(currentStatus);

  const handleNextStatus = () => {
    if (!onStatusChange) return;

    if (currentIndex < statuses.length - 1) {
      onStatusChange(statuses[currentIndex + 1]);
    }
  };

  return (
    <>
      <h3>Order Status</h3>

      <span>{currentStatus}</span>

      <h3>Order Progress</h3>

      <ul>
        {statuses.map((status) => (
          <li
            key={status}
            style={{
              fontWeight: status === currentStatus ? "bold" : "normal",
            }}
          >
            {status}
          </li>
        ))}
      </ul>

      {onStatusChange && currentStatus !== "Released" && (
        <button onClick={handleNextStatus}>Next Status</button>
      )}
    </>
  );
};

export default StatusTracker;
