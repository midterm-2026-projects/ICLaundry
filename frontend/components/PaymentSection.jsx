import { useState } from "react";

const PaymentSection = ({
  paymentStatus,
  onAmountChange,
  onMethodChange,
}) => {
  const [amountPaid, setAmountPaid] =
    useState("");

  const [paymentMethod, setPaymentMethod] =
    useState("");

  const handleAmountChange = (e) => {
    const value = e.target.value;

    setAmountPaid(value);

    if (onAmountChange) {
      onAmountChange(value);
    }
  };

  const handleMethodChange = (e) => {
    const value = e.target.value;

    setPaymentMethod(value);

    if (onMethodChange) {
      onMethodChange(value);
    }
  };

  return (
    <>
      <h2>Payment</h2>

      <label htmlFor="amountPaid">
        Amount Paid
      </label>

      <input
        id="amountPaid"
        type="number"
        value={amountPaid}
        placeholder="Enter amount paid"
        onChange={handleAmountChange}
      />

      <label htmlFor="paymentMethod">
        Payment Method
      </label>

      <select
        id="paymentMethod"
        value={paymentMethod}
        onChange={handleMethodChange}
      >
        <option value="">
          Select Payment Method
        </option>

        <option value="Cash">
          Cash
        </option>

        <option value="GCash">
          GCash
        </option>

        <option value="Maya">
          Maya
        </option>
      </select>

      <h3>Payment Status</h3>

      <span>{paymentStatus}</span>
    </>
  );
};

export default PaymentSection;