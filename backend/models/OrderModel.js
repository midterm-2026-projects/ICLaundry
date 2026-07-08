// backend/models/OrderModel.js

let orders = [];

// Create Order
export const insertOrder = (order) => {
  const newOrder = {
    id: orders.length + 1,
    ...order,
  };

  orders.push(newOrder);

  return newOrder;
};

// Read Orders
export const getOrders = () => {
  return orders;
};

// Update Order
export const updateOrder = (id, updatedOrder) => {
  const orderIndex = orders.findIndex(
    (order) => order.id === Number(id)
  );

  if (orderIndex === -1) {
    return null;
  }

  orders[orderIndex] = {
    ...orders[orderIndex],
    ...updatedOrder,
  };

  return orders[orderIndex];
};

// Used only for unit tests
export const resetOrders = (newOrders = []) => {
  orders = [...newOrders];
};