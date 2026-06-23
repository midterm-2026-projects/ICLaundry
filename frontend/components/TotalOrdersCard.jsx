const TotalOrdersCard = ({
  value = 0,
}) => {
  return (
    <div>
      <h2>Total Orders</h2>
      <p>{value}</p>
    </div>
  );
};

export default TotalOrdersCard;