const NetProfitCard = ({
  value = "₱0",
}) => {
  return (
    <div>
      <h2>Net Profit</h2>
      <p>{value}</p>
    </div>
  );
};

export default NetProfitCard;