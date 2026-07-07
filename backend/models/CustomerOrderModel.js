let customerOrders = [];

// Create Customer Order
export const insertCustomerOrder = (customerOrder) => {
  const newCustomerOrder = {
    id: customerOrders.length + 1,
    ...customerOrder,
  };

  customerOrders.push(newCustomerOrder);

  return newCustomerOrder;
};

// Read Customer Orders
export const getCustomerOrders = () => {
  return customerOrders;
};

// Update Customer Order
export const updateCustomerOrder = (id, updatedCustomerOrder) => {
  const customerOrderIndex = customerOrders.findIndex(
    (customerOrder) => customerOrder.id === Number(id)
  );

  if (customerOrderIndex === -1) {
    return null;
  }

  customerOrders[customerOrderIndex] = {
    ...customerOrders[customerOrderIndex],
    ...updatedCustomerOrder,
  };

  return customerOrders[customerOrderIndex];
};

// Used only for unit tests
export const resetCustomerOrders = (orders = []) => {
  customerOrders = [...orders];
};