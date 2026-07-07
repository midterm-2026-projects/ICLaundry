import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../models/CustomerModel.js", () => ({
  insertCustomer: vi.fn(),
  getCustomers: vi.fn(),
  updateCustomer: vi.fn(),
  deleteCustomer: vi.fn(),
}));

import * as customerModel from "../../models/CustomerModel.js";

import {
  createCustomer,
  readCustomers,
  editCustomer,
  removeCustomer,
} from "../../services/CustomerService.js";

describe("Customer Service", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe("Create Customer", () => {
    it("should create a customer when valid customer information is provided", () => {
      // Arrange
      const customer = {
        name: "Juan Dela Cruz",
        phone: "09171234567",
        email: "juan@gmail.com",
        notes: "Regular Customer",
      };

      // Act
      const result = createCustomer(customer);

      // Assert
      expect(customerModel.insertCustomer).toHaveBeenCalledOnce();
      expect(customerModel.insertCustomer).toHaveBeenCalledWith(customer);
      expect(result).toBe("Customer created successfully");
    });

    it("should not create a customer when customer name is missing", () => {
      // Arrange
      const customer = {
        name: "",
        phone: "09171234567",
        email: "juan@gmail.com",
        notes: "",
      };

      // Act
      const result = () => createCustomer(customer);

      // Assert
      expect(result).toThrow(/Customer name is required/i);
      expect(customerModel.insertCustomer).not.toHaveBeenCalled();
    });

    it("should not create a customer when phone number is missing", () => {
      // Arrange
      const customer = {
        name: "Juan",
        phone: "",
        email: "juan@gmail.com",
        notes: "",
      };

      // Act
      const result = () => createCustomer(customer);

      // Assert
      expect(result).toThrow(/Phone number is required/i);
      expect(customerModel.insertCustomer).not.toHaveBeenCalled();
    });
  });

  describe("Read Customers", () => {
    it("should retrieve all customer records", () => {
      // Arrange
      const customers = [
        {
          id: 1,
          name: "Juan Dela Cruz",
        },
        {
          id: 2,
          name: "Maria Santos",
        },
      ];

      customerModel.getCustomers.mockReturnValue(customers);

      // Act
      const result = readCustomers();

      // Assert
      expect(customerModel.getCustomers).toHaveBeenCalledOnce();
      expect(result).toEqual(customers);
    });
  });

  describe("Update Customer", () => {
    it("should update an existing customer", () => {
      // Arrange
      const customer = {
        name: "Updated Customer",
        phone: "09999999999",
        email: "updated@gmail.com",
        notes: "Updated",
      };

      customerModel.updateCustomer.mockReturnValue(customer);

      // Act
      const result = editCustomer(1, customer);

      // Assert
      expect(customerModel.updateCustomer).toHaveBeenCalledOnce();
      expect(customerModel.updateCustomer).toHaveBeenCalledWith(1, customer);
      expect(result).toBe("Customer updated successfully");
    });

    it("should not update when customer id is missing", () => {
      // Arrange
      const customer = {
        name: "Juan",
        phone: "09171234567",
      };

      // Act
      const result = () => editCustomer("", customer);

      // Assert
      expect(result).toThrow(/Customer ID is required/i);
      expect(customerModel.updateCustomer).not.toHaveBeenCalled();
    });

    it("should notify when customer does not exist", () => {
      // Arrange
      const customer = {
        name: "Juan",
        phone: "09171234567",
      };

      customerModel.updateCustomer.mockReturnValue(null);

      // Act
      const result = () => editCustomer(999, customer);

      // Assert
      expect(result).toThrow(/Customer not found/i);
      expect(customerModel.updateCustomer).toHaveBeenCalledOnce();
    });
  });

  describe("Delete Customer", () => {
    it("should delete an existing customer", () => {
      // Arrange
      customerModel.deleteCustomer.mockReturnValue(true);

      // Act
      const result = removeCustomer(1);

      // Assert
      expect(customerModel.deleteCustomer).toHaveBeenCalledOnce();
      expect(customerModel.deleteCustomer).toHaveBeenCalledWith(1);
      expect(result).toBe("Customer deleted successfully");
    });

    it("should not delete when customer id is missing", () => {
      // Arrange
      const customerId = "";

      // Act
      const result = () => removeCustomer(customerId);

      // Assert
      expect(result).toThrow(/Customer ID is required/i);
      expect(customerModel.deleteCustomer).not.toHaveBeenCalled();
    });

    it("should notify when customer does not exist", () => {
      // Arrange
      customerModel.deleteCustomer.mockReturnValue(false);

      // Act
      const result = () => removeCustomer(999);

      // Assert
      expect(result).toThrow(/Customer not found/i);
      expect(customerModel.deleteCustomer).toHaveBeenCalledOnce();
    });
  });
});