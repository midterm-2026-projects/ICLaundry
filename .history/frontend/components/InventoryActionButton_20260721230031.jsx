const InventoryActionButton = ({
  label,
  children,
  onClick,
  type = "button",
  disabled = false,
  className = "",
  title = "",
  ariaLabel = "",
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={ariaLabel || label}
      className={`inventory-action-button ${className}`}
    >
      {children ? children : label}
    </button>
  );
};

export default InventoryActionButton;
