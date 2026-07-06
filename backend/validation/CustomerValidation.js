export const validateCustomer = (customer) => {

  if (!customer.name || customer.name.trim() === "") {
    throw new Error("Customer name is required");
  }

  if (!customer.phone || customer.phone.trim() === "") {
    throw new Error("Phone number is required");
  }

  return true;

};

export const validateCustomerId = (id) => {

  if (!id) {
    throw new Error("Customer ID is required");
  }

  return true;

};