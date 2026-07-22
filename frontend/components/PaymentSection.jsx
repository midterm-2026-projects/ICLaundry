// frontend/src/components/PaymentSection.jsx

import { useState } from "react";

const PaymentSection = ({
  orderId,
  paymentStatus = "unpaid",
  amountPaid = 0,
  remainingBalance = 0,
  onSubmitPayment,
}) => {
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    setError("");

    const paymentAmount = Number(amount);

    if (!paymentAmount || paymentAmount <= 0) {
      setError("Enter a valid payment amount.");
      return;
    }

    if (!paymentMethod) {
      setError("Select payment method.");
      return;
    }

    /**
     * Prevent over payment
     */
    if (remainingBalance > 0 && paymentAmount > remainingBalance) {
      setError(
        `Payment cannot exceed remaining balance of ₱${remainingBalance.toFixed(2)}`,
      );
      return;
    }

    if (onSubmitPayment) {
      onSubmitPayment({
        order_id: orderId,
        amount: paymentAmount,
        payment_method: paymentMethod,
      });
    }

    setAmount("");
    setPaymentMethod("");
  };

  return (
    <div className="order-section">
      <div className="order-section-title">Payment</div>

      <div className="pricing-card" style={{ marginBottom: 16 }}>
        <div className="pricing-row">
          <span>Payment Status</span>
          <span className={`badge badge-${paymentStatus}`}>{paymentStatus}</span>
        </div>

        <div className="pricing-row">
          <span>Amount Paid</span>
          <span>₱{Number(amountPaid || 0).toFixed(2)}</span>
        </div>

        <div className="pricing-total">
          <span>Remaining Balance</span>
          <span>₱{Number(remainingBalance || 0).toFixed(2)}</span>
        </div>
      </div>

      {error && (
        <div className="form-group">
          <span style={{ color: "var(--danger)", fontSize: 13 }}>{error}</span>
        </div>
      )}

      <div className="form-row">
        <div className="form-group">
          <label>Payment Amount</label>
          <input
            className="form-control"
            type="number"
            min="1"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            placeholder="Enter amount"
          />
        </div>

        <div className="form-group">
          <label>Payment Method</label>
          <select
            className="form-control"
            value={paymentMethod}
            onChange={(event) => setPaymentMethod(event.target.value)}
          >
            <option value="">Select Method</option>
            <option value="cash">Cash</option>
            <option value="gcash">GCash</option>
            <option value="bank_transfer">Bank Transfer</option>
            <option value="card">Card</option>
          </select>
        </div>
      </div>

      <button
        type="button"
        className="btn btn-primary"
        onClick={handleSubmit}
        style={{ width: "100%" }}
      >
        Submit Payment
      </button>
    </div>
  );
};

export default PaymentSection;
