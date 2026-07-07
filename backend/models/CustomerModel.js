

export const insertCustomer = (customer) => {
  const customers = getMockCustomers();

  const newCustomer = {
    id: customers.length + 1,
    ...customer,
  };

  customers.push(newCustomer);

  return newCustomer;
};

export const getCustomers = () => {
  return getMockCustomers();
};

export const updateCustomer = (id, updatedCustomer) => {
  const customers = getMockCustomers();

  const customerIndex = customers.findIndex(
    (customer) => customer.id === Number(id)
  );

  if (customerIndex === -1) {
    return null;
  }

  customers[customerIndex] = {
    ...customers[customerIndex],
    ...updatedCustomer,
  };

  return customers[customerIndex];
};

export const deleteCustomer = (id) => {
  const customers = getMockCustomers();

  const customerIndex = customers.findIndex(
    (customer) => customer.id === Number(id)
  );

  if (customerIndex === -1) {
    return false;
  }

  customers.splice(customerIndex, 1);

  return true;
};