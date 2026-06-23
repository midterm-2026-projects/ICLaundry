const TotalExpensesCard = ({
  value = "₱0",
}) => {
  return (
    <div>
      <h2>Total Expenses</h2>
      <p>{value}</p>
    </div>
  );
};

export default TotalExpensesCard;