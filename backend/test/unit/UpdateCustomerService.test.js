import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../models/CustomerModel.js", () => ({
  updateCustomer: vi.fn(),
}));

import * as customerModel from "../../models/CustomerModel.js";
import { editCustomer } from "../../services/UpdateCustomerService.js";

describe("Update Customer Service", () => {

  beforeEach(() => {
    vi.resetAllMocks();
  });

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