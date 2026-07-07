import { beforeEach, describe, expect, it, vi } from "vitest";

import * as customerModel from "../../models/CustomerModel.js";

import {
  createCustomer,
  readCustomers,
  editCustomer,
  removeCustomer,
} from "../../services/CustomerService.js";

vi.mock("../../models/CustomerModel.js", () => {
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

  let customers = [];

  const resetCustomers = () => {
    customers = structuredClone(initialCustomers);
  };

  const clearCustomers = () => {
    customers = [];
  };

  resetCustomers();

  return {
    resetCustomers,
    clearCustomers,

    insertCustomer: vi.fn((customer) => {
      const newCustomer = {
        id: customers.length + 1,
        ...customer,
      };

      customers.push(newCustomer);

      return newCustomer;
    }),

    getCustomers: vi.fn(() => customers),

    updateCustomer: vi.fn((id, updatedCustomer) => {
      const index = customers.findIndex(
        (customer) => customer.id === Number(id)
      );

      if (index === -1) {
        return null;
      }

      customers[index] = {
        ...customers[index],
        ...updatedCustomer,
      };

      return customers[index];
    }),

    deleteCustomer: vi.fn((id) => {
      const index = customers.findIndex(
        (customer) => customer.id === Number(id)
      );

      if (index === -1) {
        return false;
      }

      customers.splice(index, 1);

      return true;
    }),
  };
});

describe("Customer Service", () => {
  beforeEach(() => {
    customerModel.resetCustomers();
    vi.clearAllMocks();
  });

  describe("Create Customer", () => {
    it("should create a customer with complete information", () => {
      // Arrange
      const customer = {
        name: "Pedro Cruz",
        phone: "09111111111",
        email: "pedro@gmail.com",
        notes: "New customer",
      };

      // Act
      const result = createCustomer(customer);

      const customers = customerModel.getCustomers();

      // Assert
      expect(result).toBe("Customer created successfully");

      expect(customers).toHaveLength(3);

      expect(customers[2]).toMatchObject({
        id: 3,
        name: "Pedro Cruz",
        phone: "09111111111",
        email: "pedro@gmail.com",
        notes: "New customer",
      });
    });

    it("should create a customer without notes because notes are optional", () => {
      // Arrange
      const customer = {
        name: "Ana Reyes",
        phone: "09222222222",
        email: "ana@gmail.com",
      };

      // Act
      createCustomer(customer);

      const customers = customerModel.getCustomers();

      // Assert
      expect(customers).toHaveLength(3);

      expect(customers[2]).toMatchObject({
        id: 3,
        name: "Ana Reyes",
        phone: "09222222222",
        email: "ana@gmail.com",
      });

      expect(customers[2].notes).toBeUndefined();
    });

    it("should not create a customer when customer name is missing", () => {
      const customer = {
        name: "",
        phone: "09111111111",
        email: "juan@gmail.com",
      };

      expect(() => createCustomer(customer))
        .toThrow(/Customer name is required/i);

      expect(customerModel.insertCustomer).not.toHaveBeenCalled();
    });

    it("should not create a customer when phone number is missing", () => {
      const customer = {
        name: "Juan",
        phone: "",
        email: "juan@gmail.com",
      };

      expect(() => createCustomer(customer))
        .toThrow(/Phone number is required/i);

      expect(customerModel.insertCustomer).not.toHaveBeenCalled();
    });

    it("should not create a customer when email address is missing", () => {
      const customer = {
        name: "Juan",
        phone: "09111111111",
        email: "",
      };

      expect(() => createCustomer(customer))
        .toThrow(/Email is required/i);

      expect(customerModel.insertCustomer).not.toHaveBeenCalled();
    });

    it("should not create a customer when all required fields are empty", () => {
      const customer = {
        name: "",
        phone: "",
        email: "",
      };

      expect(() => createCustomer(customer)).toThrow();

      expect(customerModel.insertCustomer).not.toHaveBeenCalled();
    });
  });

  describe("Read Customer", () => {
    it("should retrieve all customer records", () => {
      // Act
      const customers = readCustomers();

      // Assert
      expect(customers).toHaveLength(2);

      expect(customers[0].name).toBe("Juan Dela Cruz");
      expect(customers[1].name).toBe("Maria Santos");
    });

    it("should retrieve an empty customer list", () => {
      // Arrange
      customerModel.clearCustomers();

      // Act
      const customers = readCustomers();

      // Assert
      expect(customers).toEqual([]);
    });
  });

    describe("Update Customer", () => {

    it("should update an existing customer with complete information", () => {

      // Arrange
      const updatedCustomer = {
        name: "Juan Dela Cruz",
        phone: "09999999999",
        email: "juan_updated@gmail.com",
        notes: "Updated customer",
      };

      // Act
      const result = editCustomer(1, updatedCustomer);
      const customers = customerModel.getCustomers();

      // Assert
      expect(result).toBe("Customer updated successfully");

      expect(customers).toHaveLength(2);

      expect(customers[0]).toMatchObject({
        id: 1,
        name: "Juan Dela Cruz",
        phone: "09999999999",
        email: "juan_updated@gmail.com",
        notes: "Updated customer",
      });

    });

    it("should update a customer without changing notes when notes are omitted", () => {

      // Arrange
      const updatedCustomer = {
        name: "Juan Dela Cruz",
        phone: "09888888888",
        email: "juan@gmail.com",
      };

      // Act
      const result = editCustomer(1, updatedCustomer);
      const customers = customerModel.getCustomers();

      // Assert
      expect(result).toBe("Customer updated successfully");

      expect(customers[0]).toMatchObject({
        id: 1,
        name: "Juan Dela Cruz",
        phone: "09888888888",
        email: "juan@gmail.com",
      });

      expect(customers[0].notes).toBe("Regular customer");

    });

    it("should not update a customer when customer id is missing", () => {

      // Arrange
      const updatedCustomer = {
        name: "Juan",
        phone: "09111111111",
        email: "juan@gmail.com",
      };

      // Act
      const result = () => editCustomer("", updatedCustomer);

      // Assert
      expect(result).toThrow(/Customer ID is required/i);
      expect(customerModel.updateCustomer).not.toHaveBeenCalled();

    });

    it("should not update a customer when customer name is missing", () => {

      // Arrange
      const updatedCustomer = {
        name: "",
        phone: "09111111111",
        email: "juan@gmail.com",
      };

      // Act
      const result = () => editCustomer(1, updatedCustomer);

      // Assert
      expect(result).toThrow(/Customer name is required/i);
      expect(customerModel.updateCustomer).not.toHaveBeenCalled();

    });

    it("should not update a customer when phone number is missing", () => {

      // Arrange
      const updatedCustomer = {
        name: "Juan",
        phone: "",
        email: "juan@gmail.com",
      };

      // Act
      const result = () => editCustomer(1, updatedCustomer);

      // Assert
      expect(result).toThrow(/Phone number is required/i);
      expect(customerModel.updateCustomer).not.toHaveBeenCalled();

    });

    it("should not update a customer when email address is missing", () => {

      // Arrange
      const updatedCustomer = {
        name: "Juan",
        phone: "09111111111",
        email: "",
      };

      // Act
      const result = () => editCustomer(1, updatedCustomer);

      // Assert
      expect(result).toThrow(/Email is required/i);
      expect(customerModel.updateCustomer).not.toHaveBeenCalled();

    });

    it("should not update a customer when all required fields are empty", () => {

      // Arrange
      const updatedCustomer = {
        name: "",
        phone: "",
        email: "",
      };

      // Act
      const result = () => editCustomer(1, updatedCustomer);

      // Assert
      expect(result).toThrow();
      expect(customerModel.updateCustomer).not.toHaveBeenCalled();

    });

    it("should throw an error when updating a customer that does not exist", () => {

      // Arrange
      const updatedCustomer = {
        name: "Unknown Customer",
        phone: "09111111111",
        email: "unknown@gmail.com",
      };

      // Act
      const result = () => editCustomer(999, updatedCustomer);

      // Assert
      expect(result).toThrow(/Customer not found/i);

    });

  });

  describe("Delete Customer", () => {

    it("should delete an existing customer", () => {

      // Arrange

      // Act
      const result = removeCustomer(1);
      const customers = customerModel.getCustomers();

      // Assert
      expect(result).toBe("Customer deleted successfully");

      expect(customers).toHaveLength(1);

      expect(customers[0]).toMatchObject({
        id: 2,
        name: "Maria Santos",
        phone: "09981234567",
        email: "maria@gmail.com",
        notes: "VIP customer",
      });

    });

    it("should not delete a customer when customer id is missing", () => {

      // Act
      const result = () => removeCustomer("");

      // Assert
      expect(result).toThrow(/Customer ID is required/i);
      expect(customerModel.deleteCustomer).not.toHaveBeenCalled();

    });

    it("should throw an error when deleting a customer that does not exist", () => {

      // Act
      const result = () => removeCustomer(999);

      // Assert
      expect(result).toThrow(/Customer not found/i);

    });

  });

});