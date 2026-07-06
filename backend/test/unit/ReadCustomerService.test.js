import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../models/CustomerModel.js", () => ({
  getCustomers: vi.fn(),
}));

import * as customerModel from "../../models/CustomerModel.js";
import { readCustomers } from "../../services/ReadCustomerService.js";

describe("Read Customer Service", () => {

  beforeEach(() => {
    vi.resetAllMocks();
  });

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