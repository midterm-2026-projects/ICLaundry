import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../models/CustomerModel.js", () => ({
  insertCustomer: vi.fn(),
}));

import * as customerModel from "../../models/CustomerModel.js";
import { createCustomer } from "../../services/CreateCustomerService.js";

describe("Create Customer Service", () => {

  beforeEach(() => {
    vi.resetAllMocks();
  });

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