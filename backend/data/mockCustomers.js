const initialCustomers = [
  {
    id: 1,
    name: "Juan Dela Cruz",
    phone: "09171234567",
    email: "juan@gmail.com",
    notes: "Regular customer",
  },
  {
    id: 2,
    name: "Maria Santos",
    phone: "09981234567",
    email: "maria@gmail.com",
    notes: "VIP customer",
  },
];

let customers = [...initialCustomers];

export const getMockCustomers = () => customers;

export const resetMockCustomers = () => {
  customers = [...initialCustomers];
};