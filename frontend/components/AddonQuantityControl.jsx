const AddonQuantityControl = ({
  quantity,
  maxStock,
  onIncrease,
  onDecrease,
}) => {
  return (
    <>
      <button
        type="button"
        onClick={onDecrease}
        disabled={quantity === 0}
      >
        -
      </button>

      <span>{quantity}</span>

      <button
        type="button"
        onClick={onIncrease}
        disabled={
          quantity >= maxStock
        }
      >
        +
      </button>
    </>
  );
};

export default AddonQuantityControl;