const PriceBreakdownCard = ({
  laundryCost,
  totalAmount,
}) => {
  return (
    <>
      <h2>Price Breakdown</h2>

      <h3>Laundry Cost</h3>
      <p>₱{laundryCost}</p>

      <h3>Total Amount</h3>
      <p>₱{totalAmount}</p>
    </>
  );
};

export default PriceBreakdownCard;