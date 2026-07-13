import { useEffect, useState } from "react";

import PriceBreakdownCard from "../../components/PriceBreakdownCard";
import PaymentSection from "../../components/PaymentSection";
import StatusTracker from "../../components/StatusTracker";
import TimeLeftDisplay from "../../components/TimeLeftDisplay";

import { createInitialPayment, completePayment } from "../API/paymentAPI";

import { getOrderById, updateOrderStatus } from "../API/orderAPI";

const Order = ({ orderId }) => {
  const [order, setOrder] = useState(null);

  const [amountPaid, setAmountPaid] = useState("");

  const [paymentMethod, setPaymentMethod] = useState("");

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  /**
   * Load Order Details
   */
  const loadOrder = async () => {
    try {
      const data = await getOrderById(orderId);

      setOrder(data);
    } catch (error) {
      console.error("Failed to load order:", error);
    }
  };

  /**
   * Handle Payment
   */
  const handlePayment = async () => {
    if (!order) return;

    try {
      // Initial 50% payment
      if (order.payment_status === "unpaid") {
        await createInitialPayment({
          order_id: order.id,
          amount: Number(amountPaid),
          payment_method: paymentMethod,
        });
      }
      // Remaining payment
      else {
        await completePayment({
          order_id: order.id,
          amount: Number(amountPaid),
          payment_method: paymentMethod,
        });
      }

      await loadOrder();

      setAmountPaid("");
      setPaymentMethod("");
    } catch (error) {
      console.error("Payment failed:", error);
    }
  };

  /**
   * Handle Order Status Update
   */
  const handleStatusChange = async (status) => {
    if (!order) return;

    try {
      await updateOrderStatus(order.id, status);

      await loadOrder();
    } catch (error) {
      console.error("Failed to update order status:", error);
    }
  };

  if (!order) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <PriceBreakdownCard
        laundryCost={order.total_price}
        totalAmount={order.total_price}
      />

      <PaymentSection
        paymentStatus={order.payment_status}
        onAmountChange={setAmountPaid}
        onMethodChange={setPaymentMethod}
      />

      <StatusTracker
        currentStatus={order.status}
        onStatusChange={handleStatusChange}
      />

      <TimeLeftDisplay
        timeLeft={order.estimated_completion ?? "Calculating..."}
      />

      <button onClick={handlePayment}>Submit Payment</button>
    </>
  );
};

export default Order;
