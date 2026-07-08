// backend/models/OrderModel.js

let orders = [
  {
    id: 1,
    orderDate: new Date("2026-07-06"),
    totalAmount: 400,
    status: "Completed",
  },
  {
    id: 2,
    orderDate: new Date("2026-07-07"),
    totalAmount: 110,
    status: "Completed",
  },
  {
    id: 3,
    orderDate: new Date("2026-07-08"),
    totalAmount: 260,
    status: "Completed",
  },
];

// Read Orders
export const getOrders = () => {
  return orders;
};

// Used only for unit tests
export const resetOrders = (newOrders = []) => {
  orders = [...newOrders];
};