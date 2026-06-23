const TotalRevenueCard = ({
  value = "₱0",
}) => {
  return (
    <div>
      <h2>Total Revenue</h2>
      <p>{value}</p>
    </div>
  );
};

export default TotalRevenueCard;