import { Eye, Edit2, Trash2, UserRound } from "lucide-react";
import StatusTracker from "./StatusTracker";
import TimeLeftDisplay from "./TimeLeftDisplay";

const formatCurrency = (amount) =>
  `₱${Number(amount || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const formatDate = (date) => {
  if (!date) {
    return "N/A";
  }

  return new Date(date).toLocaleDateString();
};

const getPaymentLabel = (status) => {
  if (!status) {
    return "Unpaid";
  }

  return status.charAt(0).toUpperCase() + status.slice(1);
};

/**
 * Supports different backend ID field names.
 */
const getOrderId = (order) =>
  order?.id ?? order?.order_id ?? order?.uuid ?? order?._id ?? null;

const OrdersTable = ({
  orders = [],
  onView,
  onEdit,
  onDelete,
  onStatusChange,
}) => {
  const handleStatusChange = (order, newStatus) => {
    const orderId = getOrderId(order);

    if (!orderId) {
      console.error("Order ID is missing:", order);

      alert("Cannot update order status because the order ID is missing.");

      return;
    }

    /**
     * Payment check before release.
     */
    if (newStatus === "released") {
      const totalPrice = Number(order.total_price || 0);

      const amountPaid = Number(order.amount_paid || 0);

      const remainingBalance = totalPrice - amountPaid;

      if (remainingBalance > 0) {
        alert(
          `Cannot release order. Remaining balance: ₱${remainingBalance.toFixed(
            2,
          )}`,
        );

        return;
      }
    }

    if (onStatusChange) {
      onStatusChange(order, newStatus);
    }
  };

  return (
    <div className="card orders-card">
      <div className="table-wrapper orders-table-wrapper">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order #</th>
              <th>Customer</th>
              <th>Weight</th>
              <th>Status</th>
              <th>Payment</th>
              <th>Amount</th>
              <th>Completion</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {orders.length > 0 ? (
              orders.map((order, index) => {
                const orderId = getOrderId(order);

                return (
                  <tr key={orderId ?? order.order_number ?? index}>
                    <td>
                      <span className="order-number">
                        {order.order_number || "N/A"}
                      </span>
                    </td>

                    <td>
                      <div className="order-customer">
                        <span className="order-customer-avatar" aria-hidden="true">
                          <UserRound size={16} />
                        </span>
                        <div>
                          <strong>
                            {order.customers?.name ||
                              order.customer_name ||
                              "Unknown Customer"}
                          </strong>
                          <span>
                            {order.customers?.phone ||
                              order.customer_phone ||
                              "No phone number"}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="order-weight">{order.weight_kg || 0}kg</span>
                    </td>

                    <td>
                      <StatusTracker
                        currentStatus={order.status}
                        onStatusChange={
                          onStatusChange
                            ? (status) => handleStatusChange(order, status)
                            : undefined
                        }
                      />
                    </td>

                    <td>
                      <span className={`badge badge-${order.payment_status}`}>
                        {getPaymentLabel(order.payment_status)}
                      </span>

                      {order.payment_status !== "paid" && (
                        <div className="order-balance">
                          Balance:{" "}
                          {formatCurrency(
                            Number(order.total_price || 0) -
                              Number(order.amount_paid || 0),
                          )}
                        </div>
                      )}
                    </td>

                    <td className="order-amount">
                      {formatCurrency(order.total_price)}
                    </td>

                    <td>
                      <TimeLeftDisplay
                        timeLeft={
                          order.estimated_completion
                            ? formatDate(order.estimated_completion)
                            : "Pending"
                        }
                      />
                    </td>

                    <td>
                      <div className="order-row-actions">
                        {onView && (
                          <button
                            type="button"
                            className="btn-icon"
                            title="View"
                            aria-label="View order"
                            onClick={() => onView(order)}
                          >
                            <Eye size={16} aria-hidden="true" />
                          </button>
                        )}

                        {onEdit && (
                          <button
                            type="button"
                            className="btn-icon"
                            title="Edit"
                            aria-label="Edit order"
                            onClick={() => onEdit(order)}
                          >
                            <Edit2 size={16} />
                          </button>
                        )}

                        {onDelete && (
                          <button
                            type="button"
                            className="btn-icon"
                            title="Delete"
                            aria-label="Delete order"
                            onClick={() => onDelete(order)}
                            style={{ color: "var(--orders-danger)" }}
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={8} className="empty-state orders-empty-state">
                  <strong>No orders found</strong>
                  <p>Try changing your search or status filter.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersTable;
