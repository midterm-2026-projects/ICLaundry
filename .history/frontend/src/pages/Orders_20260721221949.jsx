import { useEffect, useMemo, useState } from "react";

import SearchOrders from "../../components/SearchOrders";
import StatusFilter from "../../components/StatusFilter";
import NewOrderButton from "../../components/NewOrderButton";
import OrdersTable from "../../components/OrdersTable";

import NewOrderModal from "../../components/NewOrderModal";
import EditOrderModal from "../../components/EditOrderModal";
import OrderDetailsModal from "../../components/OrderDetailsModal";
import PaymentSection from "../../components/PaymentSection";

import {
  getOrders,
  createOrder,
  updateOrder,
  deleteOrder,
  updateOrderStatus,
} from "../API/orderAPI";

import { completePayment } from "../API/paymentAPI";

const getOrderId = (order) =>
  order?.id ?? order?.order_id ?? order?.uuid ?? order?._id ?? null;

const Orders = () => {
  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [searchValue, setSearchValue] = useState("");

  const [selectedStatus, setSelectedStatus] = useState("all");

  const [showNewModal, setShowNewModal] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);

  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const [selectedOrder, setSelectedOrder] = useState(null);

  const [paymentOrder, setPaymentOrder] = useState(null);

  const loadOrders = async () => {
    try {
      setLoading(true);

      setError("");

      const response = await getOrders();

      setOrders(Array.isArray(response) ? response : response.data || []);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const hasOpenModal =
    showNewModal || showEditModal || showDetailsModal || showPaymentModal;

  useEffect(() => {
    if (!hasOpenModal) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleEscape = (event) => {
      if (event.key !== "Escape") {
        return;
      }

      if (showPaymentModal) {
        setShowPaymentModal(false);
        setPaymentOrder(null);
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [hasOpenModal, showPaymentModal]);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const customer = order.customers?.name
        ? order.customers.name.toLowerCase()
        : "";

      const orderNumber = order.order_number
        ? order.order_number.toLowerCase()
        : "";

      const search = searchValue.toLowerCase();

      const matchesSearch =
        customer.includes(search) || orderNumber.includes(search);

      const matchesStatus =
        selectedStatus === "all" || order.status === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [orders, searchValue, selectedStatus]);

  const handleCreateOrder = async (orderData) => {
    try {
      await createOrder(orderData);

      await loadOrders();

      setShowNewModal(false);
    } catch (error) {
      setError(error.message);

      alert(error.message);
    }
  };

  const handleUpdateOrder = async (id, updatedData) => {
    try {
      await updateOrder(id, updatedData);

      await loadOrders();

      setShowEditModal(false);

      setSelectedOrder(null);
    } catch (error) {
      setError(error.message);

      alert(error.message);
    }
  };

  const handleDeleteOrder = async (order) => {
    const orderId = getOrderId(order);

    if (!orderId) {
      alert("Cannot delete order because the order ID is missing.");
      console.error("Delete failed. Order ID is missing:", order);
      return;
    }

    const confirmed = window.confirm("Delete this order?");

    if (!confirmed) {
      return;
    }

    try {
      await deleteOrder(orderId);
      await loadOrders();
    } catch (error) {
      alert(error.message);
    }
  };

  /**
   * STATUS CHANGE WITH PAYMENT CHECK
   */

  const handleStatusChange = async (order, status) => {
    const orderId = getOrderId(order);

    if (!orderId) {
      alert("Cannot update order status because the order ID is missing.");
      console.error("Status update failed. Order ID is missing:", order);
      return;
    }

    if (status === "released") {
      const totalPrice = Number(order.total_price || 0);
      const amountPaid = Number(order.amount_paid || 0);
      const remainingBalance = totalPrice - amountPaid;

      if (remainingBalance > 0) {
        setPaymentOrder(order);
        setShowPaymentModal(true);
        return;
      }
    }

    try {
      await updateOrderStatus(orderId, status);
      await loadOrders();
    } catch (error) {
      alert(error.message);
    }
  };

  /**
   * COMPLETE PAYMENT THEN RELEASE
   */

  const handleCompletePayment = async (paymentData) => {
    const orderId = getOrderId(paymentOrder);

    if (!orderId) {
      alert("Cannot complete payment because the order ID is missing.");
      console.error(
        "Payment completion failed. Order ID is missing:",
        paymentOrder,
      );
      return;
    }

    try {
      await completePayment({
        ...paymentData,
        order_id: orderId,
      });

      await updateOrderStatus(orderId, "released");
      await loadOrders();

      setShowPaymentModal(false);
      setPaymentOrder(null);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);

    setShowDetailsModal(true);
  };

  if (loading) {
    return <div className="orders-loading">Loading orders...</div>;
  }

  return (
    <div className="orders-page">
      <div className="orders-shell">
        <div className="orders-header">
          <div className="orders-heading">
            <h1>Orders</h1>

            <p>Manage laundry orders, payments, and progress in one place.</p>
          </div>

          <NewOrderButton onClick={() => setShowNewModal(true)} />
        </div>

        <div className="orders-toolbar">
          <SearchOrders value={searchValue} onSearchChange={setSearchValue} />

          <StatusFilter
            selectedStatus={selectedStatus}
            onStatusChange={setSelectedStatus}
          />
        </div>

        {error && <p className="orders-error">{error}</p>}

        <OrdersTable
          orders={filteredOrders}
          onView={handleViewOrder}
          onEdit={(order) => {
            setSelectedOrder(order);

            setShowEditModal(true);
          }}
          onDelete={handleDeleteOrder}
          onStatusChange={handleStatusChange}
        />

        {showNewModal && (
          <NewOrderModal
            onClose={() => setShowNewModal(false)}
            onCreateOrder={handleCreateOrder}
          />
        )}

        {showEditModal && (
          <EditOrderModal
            order={selectedOrder}
            onClose={() => {
              setShowEditModal(false);

              setSelectedOrder(null);
            }}
            onUpdateOrder={handleUpdateOrder}
          />
        )}

        {showDetailsModal && (
          <OrderDetailsModal
            order={selectedOrder}
            onClose={() => {
              setShowDetailsModal(false);

              setSelectedOrder(null);
            }}
            onRefresh={loadOrders}
          />
        )}

        {showPaymentModal && paymentOrder && (
          <div
            className="modal-overlay"
            onClick={() => {
              setShowPaymentModal(false);
              setPaymentOrder(null);
            }}
          >
            <div
              className="order-modal"
              style={{ maxWidth: 520 }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="order-modal-body">
                <h2
                  style={{ margin: "0 0 16px", fontSize: 22, fontWeight: 800 }}
                >
                  Complete Payment
                </h2>

                <PaymentSection
                  orderId={getOrderId(paymentOrder)}
                  paymentStatus={paymentOrder.payment_status}
                  amountPaid={paymentOrder.amount_paid}
                  remainingBalance={
                    Number(paymentOrder.total_price || 0) -
                    Number(paymentOrder.amount_paid || 0)
                  }
                  onSubmitPayment={handleCompletePayment}
                />

                <button
                  type="button"
                  onClick={() => {
                    setShowPaymentModal(false);

                    setPaymentOrder(null);
                  }}
                  className="btn btn-secondary"
                  style={{ width: "100%", marginTop: 12 }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
