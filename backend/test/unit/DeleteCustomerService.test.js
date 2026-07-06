import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../models/CustomerModel.js", () => ({
  deleteCustomer: vi.fn(),
}));

import * as customerModel from "../../models/CustomerModel.js";
import { removeCustomer } from "../../services/DeleteCustomerService.js";

describe("Delete Customer Service", () => {

  beforeEach(() => {
    vi.resetAllMocks();
  });

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