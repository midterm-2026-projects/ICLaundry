const statuses = [
  "Pending",
  "Washing",
  "Drying",
  "Folding",
  "Ready for Pick-up",
  "Released",
];

const StatusTracker = ({ currentStatus }) => {
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
              fontWeight:
                status === currentStatus
                  ? "bold"
                  : "normal",
            }}
          >
            {status}
          </li>
        ))}
      </ul>
    </>
  );
};

export default StatusTracker;