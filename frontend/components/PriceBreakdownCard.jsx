// frontend/src/components/PriceBreakdownCard.jsx

const formatCurrency = (amount) =>
  `₱${Number(amount || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const PriceBreakdownCard = ({
  weight,
  pricePerKg,
  laundryCost,
  totalAmount,
}) => {
  return (
    <div className="pricing-card">
      <div className="pricing-header">Price Breakdown</div>

      {weight !== undefined && (
        <div className="pricing-row">
          <span>Weight</span>
          <span>{weight} kg</span>
        </div>
      )}

      {pricePerKg !== undefined && (
        <div className="pricing-row">
          <span>Price / Kg</span>
          <span>{formatCurrency(pricePerKg)}</span>
        </div>
      )}

      <div className="pricing-row">
        <span>Laundry Cost</span>
        <span>{formatCurrency(laundryCost)}</span>
      </div>

      <div className="pricing-total">
        <span>Total Amount</span>
        <span>{formatCurrency(totalAmount)}</span>
      </div>
    </div>
  );
};

export default PriceBreakdownCard;
