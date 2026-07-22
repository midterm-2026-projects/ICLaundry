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

    insertCustomer: vi.fn(async (customer) => {
      const newCustomer = {
        id: customers.length + 1,
        ...customer,
      };

      customers.push(newCustomer);

      return newCustomer;
    }),

    getCustomers: vi.fn(async () => customers),

    updateCustomer: vi.fn(async (id, updatedCustomer) => {
      const index = customers.findIndex(
        (customer) => customer.id === Number(id),
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

    deleteCustomer: vi.fn(async (id) => {
      const index = customers.findIndex(
        (customer) => customer.id === Number(id),
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

  /**
   * ==============================================
   * CREATE CUSTOMER
   * ==============================================
   */

  describe("Create Customer", () => {
    it("should create a customer with complete information", async () => {
      // Arrange
      const customer = {
        name: "Pedro Cruz",
        phone: "09111111111",
        email: "pedro@gmail.com",
        notes: "New customer",
      };

      // Act
      const result = await createCustomer(customer);

      const customers = await customerModel.getCustomers();

      // Assert
      expect(result).toMatchObject({
        id: 3,
        name: "Pedro Cruz",
        phone: "09111111111",
        email: "pedro@gmail.com",
        notes: "New customer",
      });

      expect(customers).toHaveLength(3);
    });

    it("should create a customer without notes because notes are optional", async () => {
      // Arrange
      const customer = {
        name: "Ana Reyes",
        phone: "09222222222",
        email: "ana@gmail.com",
      };

      // Act
      const result = await createCustomer(customer);

      const customers = await customerModel.getCustomers();

      // Assert
      expect(result).toMatchObject({
        id: 3,
        name: "Ana Reyes",
        phone: "09222222222",
        email: "ana@gmail.com",
      });

      expect(customers).toHaveLength(3);

      expect(customers[2].notes).toBeUndefined();
    });

    it("should not create a customer when customer name is missing", async () => {
      // Arrange
      const customer = {
        name: "",
        phone: "09111111111",
        email: "juan@gmail.com",
      };

      // Assert
      await expect(createCustomer(customer)).rejects.toThrow(
        /Customer name is required/i,
      );

      expect(customerModel.insertCustomer).not.toHaveBeenCalled();
    });

    it("should not create a customer when phone number is missing", async () => {
      // Arrange
      const customer = {
        name: "Juan",
        phone: "",
        email: "juan@gmail.com",
      };

      // Assert
      await expect(createCustomer(customer)).rejects.toThrow(
        /Phone number is required/i,
      );

      expect(customerModel.insertCustomer).not.toHaveBeenCalled();
    });

    it("should not create a customer when email address is missing", async () => {
      // Arrange
      const customer = {
        name: "Juan",
        phone: "09111111111",
        email: "",
      };

      // Assert
      await expect(createCustomer(customer)).rejects.toThrow(
        /Email is required/i,
      );

      expect(customerModel.insertCustomer).not.toHaveBeenCalled();
    });

    it("should not create a customer when all required fields are empty", async () => {
      // Arrange
      const customer = {
        name: "",
        phone: "",
        email: "",
      };

      // Assert
      await expect(createCustomer(customer)).rejects.toThrow();

      expect(customerModel.insertCustomer).not.toHaveBeenCalled();
    });
  });
  /**
   * ==============================================
   * READ CUSTOMER
   * ==============================================
   */

  describe("Read Customer", () => {
    it("should retrieve all customer records", async () => {
      // Act
      const customers = await readCustomers();

      // Assert
      expect(customers).toHaveLength(2);

      expect(customers[0]).toMatchObject({
        id: 1,
        name: "Juan Dela Cruz",
        phone: "09171234567",
        email: "juan@gmail.com",
        notes: "Regular customer",
      });

      expect(customers[1]).toMatchObject({
        id: 2,
        name: "Maria Santos",
        phone: "09981234567",
        email: "maria@gmail.com",
        notes: "VIP customer",
      });

      expect(customerModel.getCustomers).toHaveBeenCalledTimes(1);
    });

    it("should retrieve an empty customer list", async () => {
      // Arrange
      customerModel.clearCustomers();

      // Act
      const customers = await readCustomers();

      // Assert
      expect(customers).toEqual([]);

      expect(customerModel.getCustomers).toHaveBeenCalledTimes(1);
    });

    it("should return an array", async () => {
      // Act
      const customers = await readCustomers();

      // Assert
      expect(Array.isArray(customers)).toBe(true);
    });
  });
  /**
   * ==============================================
   * UPDATE CUSTOMER
   * ==============================================
   */

  describe("Update Customer", () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it("should update an existing customer with complete information", async () => {
      // Arrange
      const updatedCustomer = {
        name: "Juan Dela Cruz",
        phone: "09999999999",
        email: "juan_updated@gmail.com",
        notes: "Updated customer",
      };

      customerModel.updateCustomer.mockResolvedValue({
        id: 1,
        ...updatedCustomer,
      });

      // Act
      const result = await editCustomer(1, updatedCustomer);

      // Assert
      expect(result).toEqual({
        id: 1,
        ...updatedCustomer,
      });

      expect(customerModel.updateCustomer).toHaveBeenCalledTimes(1);

      expect(customerModel.updateCustomer).toHaveBeenCalledWith(
        1,
        updatedCustomer,
      );
    });

    it("should update a customer without changing notes when notes are omitted", async () => {
      // Arrange
      const updatedCustomer = {
        name: "Juan Dela Cruz",
        phone: "09888888888",
        email: "juan@gmail.com",
      };

      customerModel.updateCustomer.mockResolvedValue({
        id: 1,
        ...updatedCustomer,
      });

      // Act
      const result = await editCustomer(1, updatedCustomer);

      // Assert
      expect(result).toEqual({
        id: 1,
        ...updatedCustomer,
      });

      expect(customerModel.updateCustomer).toHaveBeenCalledWith(
        1,
        updatedCustomer,
      );
    });

    it("should not update a customer when customer id is missing", async () => {
      // Arrange
      const updatedCustomer = {
        name: "Juan",
        phone: "09111111111",
        email: "juan@gmail.com",
      };

      // Assert
      await expect(editCustomer("", updatedCustomer)).rejects.toThrow(
        /Customer ID is required/i,
      );

      expect(customerModel.updateCustomer).not.toHaveBeenCalled();
    });

    it("should not update a customer when customer name is missing", async () => {
      // Arrange
      const updatedCustomer = {
        name: "",
        phone: "09111111111",
        email: "juan@gmail.com",
      };

      // Assert
      await expect(editCustomer(1, updatedCustomer)).rejects.toThrow(
        /Customer name is required/i,
      );

      expect(customerModel.updateCustomer).not.toHaveBeenCalled();
    });

    it("should not update a customer when phone number is missing", async () => {
      // Arrange
      const updatedCustomer = {
        name: "Juan",
        phone: "",
        email: "juan@gmail.com",
      };

      // Assert
      await expect(editCustomer(1, updatedCustomer)).rejects.toThrow(
        /Phone number is required/i,
      );

      expect(customerModel.updateCustomer).not.toHaveBeenCalled();
    });

    it("should not update a customer when email address is missing", async () => {
      // Arrange
      const updatedCustomer = {
        name: "Juan",
        phone: "09111111111",
        email: "",
      };

      // Assert
      await expect(editCustomer(1, updatedCustomer)).rejects.toThrow(
        /Email is required/i,
      );

      expect(customerModel.updateCustomer).not.toHaveBeenCalled();
    });

    it("should not update a customer when all required fields are empty", async () => {
      // Arrange
      const updatedCustomer = {
        name: "",
        phone: "",
        email: "",
      };

      // Assert
      await expect(editCustomer(1, updatedCustomer)).rejects.toThrow();

      expect(customerModel.updateCustomer).not.toHaveBeenCalled();
    });

    it("should throw an error when updating a customer that does not exist", async () => {
      // Arrange
      const updatedCustomer = {
        name: "Unknown Customer",
        phone: "09111111111",
        email: "unknown@gmail.com",
      };

      customerModel.updateCustomer.mockResolvedValue(null);

      // Assert
      await expect(editCustomer(999, updatedCustomer)).rejects.toThrow(
        /Customer not found/i,
      );

      expect(customerModel.updateCustomer).toHaveBeenCalledTimes(1);

      expect(customerModel.updateCustomer).toHaveBeenCalledWith(
        999,
        updatedCustomer,
      );
    });
  });
  /**
   * ==============================================
   * DELETE CUSTOMER
   * ==============================================
   */

  describe("Delete Customer", () => {
    it("should delete an existing customer", async () => {
      // Act
      const result = await removeCustomer(1);

      const customers = await customerModel.getCustomers();

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

      expect(customerModel.deleteCustomer).toHaveBeenCalledTimes(1);
    });

    it("should not delete a customer when customer id is missing", async () => {
      // Assert
      await expect(removeCustomer("")).rejects.toThrow(
        /Customer ID is required/i,
      );

      expect(customerModel.deleteCustomer).not.toHaveBeenCalled();
    });

    it("should throw an error when deleting a customer that does not exist", async () => {
      // Assert
      await expect(removeCustomer(999)).rejects.toThrow(/Customer not found/i);

      expect(customerModel.deleteCustomer).toHaveBeenCalledTimes(1);
    });

    it("should remove only the specified customer", async () => {
      // Act
      await removeCustomer(2);

      const customers = await customerModel.getCustomers();

      // Assert
      expect(customers).toHaveLength(1);

      expect(customers[0]).toMatchObject({
        id: 1,
        name: "Juan Dela Cruz",
      });
    });

    it("should keep remaining customer information intact after deletion", async () => {
      // Act
      await removeCustomer(1);

      const customers = await customerModel.getCustomers();

      // Assert
      expect(customers[0]).toMatchObject({
        id: 2,
        name: "Maria Santos",
        phone: "09981234567",
        email: "maria@gmail.com",
        notes: "VIP customer",
      });
    });
  });
});
