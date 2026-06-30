const StockStatusBadge = ({
  quantity,
  minimumStock,
}) => {
  const isLow =
    quantity <= minimumStock;

  return (
    <span>
      {isLow ? "Low" : "OK"}
    </span>
  );
};

export default StockStatusBadge;