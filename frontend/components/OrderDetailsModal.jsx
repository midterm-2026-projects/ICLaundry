// frontend/src/components/OrderDetailsModal.jsx

import { useEffect, useState } from "react";
import { X } from "lucide-react";

import PaymentSection from "./PaymentSection";
import { createInitialPayment, completePayment } from "../src/API/paymentAPI";
import { updateOrderStatus, getOrders } from "../src/API/orderAPI";

const getOrderId = (order) => {
  return order?.id ?? order?.order_id ?? order?.uuid ?? order?._id ?? null;
};

const OrderDetailsModal = ({ order, onClose, onRefresh }) => {
  const [error, setError] = useState("");
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !isSubmittingPayment) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isSubmittingPayment, onClose]);

  if (!order) {
    return null;
  }

  const orderId = getOrderId(order);
  const totalPrice = Number(order.total_price || 0);
  const amountPaid = Number(order.amount_paid || 0);

  const remainingBalance = Math.max(totalPrice - amountPaid, 0);

  const handlePayment = async (paymentData) => {
    if (!orderId) {
      console.error("Order ID is missing:", order);

      setError("Cannot process payment because the order ID is missing.");

      return;
    }

    if (isSubmittingPayment) {
      return;
    }

    try {
      setError("");
      setIsSubmittingPayment(true);

      const paymentAmount = Number(paymentData?.amount);

      if (!Number.isFinite(paymentAmount) || paymentAmount <= 0) {
        throw new Error("Enter a valid payment amount.");
      }

      if (!paymentData?.payment_method) {
        throw new Error("Select a payment method.");
      }

      if (paymentAmount > remainingBalance) {
        throw new Error(
          `Payment cannot exceed the remaining balance of ₱${remainingBalance.toFixed(
            2,
          )}.`,
        );
      }

      const paymentPayload = {
        order_id: orderId,
        amount: paymentAmount,
        payment_method: paymentData.payment_method,
      };

      if (order.payment_status === "unpaid" || amountPaid <= 0) {
        await createInitialPayment(paymentPayload);
      } else {
        await completePayment(paymentPayload);
      }

      if (onRefresh) {
        await onRefresh();
      }

      const latestOrdersResponse = await getOrders();

      const latestOrders = Array.isArray(latestOrdersResponse)
        ? latestOrdersResponse
        : Array.isArray(latestOrdersResponse?.data)
          ? latestOrdersResponse.data
          : Array.isArray(latestOrdersResponse?.orders)
            ? latestOrdersResponse.orders
            : [];

      const latestOrder = latestOrders.find((item) => {
        return getOrderId(item) === orderId;
      });

      if (!latestOrder) {
        throw new Error(
          "Payment was processed, but the updated order could not be found.",
        );
      }

      const latestTotalPrice = Number(latestOrder.total_price || 0);

      const latestAmountPaid = Number(latestOrder.amount_paid || 0);

      const isFullyPaid =
        latestOrder.payment_status === "paid" ||
        latestAmountPaid >= latestTotalPrice;

      if (isFullyPaid && latestOrder.status !== "released") {
        await updateOrderStatus(orderId, "released");
      }

      if (onRefresh) {
        await onRefresh();
      }

      onClose();
    } catch (paymentError) {
      console.error("Payment processing failed:", paymentError);

      setError(
        paymentError?.response?.data?.message ||
          paymentError?.message ||
          "Failed to process payment.",
      );
    } finally {
      setIsSubmittingPayment(false);
    }
  };

  return (
    <div
      className="modal-overlay"
      onClick={() => {
        if (!isSubmittingPayment) {
          onClose();
        }
      }}
    >
      <div
        className="order-modal"
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        <div className="order-modal-header">
          <div>
            <h3>Order Details</h3>

            <p>Order #{order.order_number || "N/A"}</p>
          </div>

          <button
            type="button"
            className="btn-icon"
            title="Close"
            aria-label="Close"
            onClick={onClose}
            disabled={isSubmittingPayment}
          >
            <X size={20} />
          </button>
        </div>

        <div className="order-modal-body">
          {error && (
            <div className="form-group">
              <span
                style={{
                  color: "var(--danger)",
                  fontSize: 13,
                }}
              >
                {error}
              </span>
            </div>
          )}

          <div className="order-section">
            <div className="order-section-title">Overview</div>

            <div className="pricing-card">
              <div className="pricing-row">
                <span>Customer</span>

                <span>
                  {order.customers?.name || order.customer_name || "Unknown"}
                </span>
              </div>

              <div className="pricing-row">
                <span>Phone</span>

                <span>
                  {order.customers?.phone || order.customer_phone || "-"}
                </span>
              </div>

              <div className="pricing-row">
                <span>Weight</span>

                <span>{Number(order.weight_kg || 0)} kg</span>
              </div>

              <div className="pricing-row">
                <span>Order Status</span>

                <span className={`badge badge-${order.status || "pending"}`}>
                  {order.status || "pending"}
                </span>
              </div>

              <div className="pricing-row">
                <span>Payment Status</span>

                <span
                  className={`badge badge-${order.payment_status || "unpaid"}`}
                >
                  {order.payment_status || "unpaid"}
                </span>
              </div>

              <div className="pricing-row">
                <span>Amount Paid</span>

                <span>₱{amountPaid.toFixed(2)}</span>
              </div>

              <div className="pricing-total">
                <span>Total Price</span>

                <span>₱{totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {remainingBalance > 0 ? (
            <PaymentSection
              orderId={orderId}
              paymentStatus={order.payment_status}
              amountPaid={amountPaid}
              remainingBalance={remainingBalance}
              onSubmitPayment={handlePayment}
            />
          ) : (
            <div className="order-section">
              <div className="order-section-title">Payment</div>

              <div className="pricing-card">
                <div className="pricing-total">
                  <span>Payment Complete</span>

                  <span className="badge badge-paid">Paid</span>
                </div>
              </div>
            </div>
          )}

          {isSubmittingPayment && (
            <div
              style={{
                marginTop: 12,
                textAlign: "center",
                color: "var(--text-muted)",
                fontSize: 13,
              }}
            >
              Processing payment...
            </div>
          )}
        </div>

        <div className="order-modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
            disabled={isSubmittingPayment}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
