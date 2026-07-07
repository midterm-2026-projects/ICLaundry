import { beforeEach, describe, expect, it, vi } from "vitest";

import * as customerOrderModel from "../../models/CustomerOrderModel.js";

import {
  createCustomerOrder,
  readCustomerOrders,
  editCustomerOrder,
} from "../../services/CustomerOrderService.js";

vi.mock("../../models/CustomerOrderModel.js", () => {
  const initialCustomerOrders = [
    {
      id: 1,
      customer_id: 1,
      weight_kg: 5,
      payment_method: "Cash",
      amount_paid: 250,
      status: "Pending",
    },
    {
      id: 2,
      customer_id: 2,
      weight_kg: 8,
      payment_method: "GCash",
      amount_paid: 400,
      status: "Washing",
    },
  ];

  let customerOrders = [];

  const resetCustomerOrders = () => {
    customerOrders = structuredClone(initialCustomerOrders);
  };

  const clearCustomerOrders = () => {
    customerOrders = [];
  };

  resetCustomerOrders();

  return {
    resetCustomerOrders,
    clearCustomerOrders,

    insertCustomerOrder: vi.fn((customerOrder) => {
      const newCustomerOrder = {
        id: customerOrders.length + 1,
        ...customerOrder,
      };

      customerOrders.push(newCustomerOrder);

      return newCustomerOrder;
    }),

    getCustomerOrders: vi.fn(() => customerOrders),

    updateCustomerOrder: vi.fn((id, updatedCustomerOrder) => {
      const index = customerOrders.findIndex(
        (customerOrder) => customerOrder.id === Number(id)
      );

      if (index === -1) {
        return null;
      }

      customerOrders[index] = {
        ...customerOrders[index],
        ...updatedCustomerOrder,
      };

      return customerOrders[index];
    }),
  };
});

describe("Customer Order Service", () => {

  beforeEach(() => {
    customerOrderModel.resetCustomerOrders();
    vi.clearAllMocks();
  });

  describe("Create Customer Order", () => {

    it("should create a new customer order with complete information", () => {

      // Arrange
      const customerOrder = {
        customer_id: 3,
        weight_kg: 6,
        payment_method: "Cash",
        amount_paid: 300,
        status: "Pending",
      };

      // Act
      const result = createCustomerOrder(customerOrder);

      const customerOrders =
        customerOrderModel.getCustomerOrders();

      // Assert
      expect(result)
        .toBe("Customer Order created successfully");

      expect(customerOrders).toHaveLength(3);

      expect(customerOrders[2]).toEqual({
        id: 3,
        customer_id: 3,
        weight_kg: 6,
        payment_method: "Cash",
        amount_paid: 300,
        status: "Pending",
      });

    });

    it("should associate the selected customer with the order", () => {

      // Arrange
      const customerOrder = {
        customer_id: 2,
        weight_kg: 4,
        payment_method: "GCash",
        amount_paid: 200,
        status: "Pending",
      };

      // Act
      createCustomerOrder(customerOrder);

      const customerOrders =
        customerOrderModel.getCustomerOrders();

      // Assert
      expect(customerOrders).toHaveLength(3);

      expect(customerOrders[2].customer_id)
        .toBe(2);

    });

    it("should display the newly created customer order immediately after saving", () => {

      // Arrange
      createCustomerOrder({
        customer_id: 4,
        weight_kg: 7,
        payment_method: "Cash",
        amount_paid: 350,
        status: "Pending",
      });

      // Act
      const customerOrders =
        readCustomerOrders();

      // Assert
      expect(customerOrders).toHaveLength(3);

      expect(customerOrders[2]).toEqual({
        id: 3,
        customer_id: 4,
        weight_kg: 7,
        payment_method: "Cash",
        amount_paid: 350,
        status: "Pending",
      });

    });

    it("should not create a customer order when customer id is missing", () => {

      // Arrange
      const customerOrder = {
        customer_id: "",
        weight_kg: 5,
        payment_method: "Cash",
        amount_paid: 250,
      };

      // Act
      const result = () =>
        createCustomerOrder(customerOrder);

      // Assert
      expect(result)
        .toThrow(/Customer ID is required/i);

      expect(customerOrderModel.insertCustomerOrder)
        .not.toHaveBeenCalled();

    });

    it("should not create a customer order when weight is missing", () => {

      // Arrange
      const customerOrder = {
        customer_id: 1,
        weight_kg: "",
        payment_method: "Cash",
        amount_paid: 250,
      };

      // Act
      const result = () =>
        createCustomerOrder(customerOrder);

      // Assert
      expect(result)
        .toThrow(/Weight is required/i);

      expect(customerOrderModel.insertCustomerOrder)
        .not.toHaveBeenCalled();

    });

    it("should not create a customer order when payment method is missing", () => {

      // Arrange
      const customerOrder = {
        customer_id: 1,
        weight_kg: 5,
        payment_method: "",
        amount_paid: 250,
      };

      // Act
      const result = () =>
        createCustomerOrder(customerOrder);

      // Assert
      expect(result)
        .toThrow(/Payment method is required/i);

      expect(customerOrderModel.insertCustomerOrder)
        .not.toHaveBeenCalled();

    });

    it("should not create a customer order when amount paid is missing", () => {

      // Arrange
      const customerOrder = {
        customer_id: 1,
        weight_kg: 5,
        payment_method: "Cash",
      };

      // Act
      const result = () =>
        createCustomerOrder(customerOrder);

      // Assert
      expect(result)
        .toThrow(/Amount paid is required/i);

      expect(customerOrderModel.insertCustomerOrder)
        .not.toHaveBeenCalled();

    });

  });

    describe("Read Customer Orders", () => {

    it("should retrieve all customer order records", () => {

      // Act
      const customerOrders = readCustomerOrders();

      // Assert
      expect(customerOrders).toHaveLength(2);

      expect(customerOrders).toEqual([
        {
          id: 1,
          customer_id: 1,
          weight_kg: 5,
          payment_method: "Cash",
          amount_paid: 250,
          status: "Pending",
        },
        {
          id: 2,
          customer_id: 2,
          weight_kg: 8,
          payment_method: "GCash",
          amount_paid: 400,
          status: "Washing",
        },
      ]);

    });

    it("should retrieve an empty customer order list when there are no records", () => {

      // Arrange
      customerOrderModel.clearCustomerOrders();

      // Act
      const customerOrders = readCustomerOrders();

      // Assert
      expect(customerOrders).toEqual([]);

      expect(customerOrders).toHaveLength(0);

    });

    it("should display the latest customer order after creating a new order", () => {

      // Arrange
      createCustomerOrder({
        customer_id: 5,
        weight_kg: 9,
        payment_method: "Cash",
        amount_paid: 450,
        status: "Pending",
      });

      // Act
      const customerOrders = readCustomerOrders();

      // Assert
      expect(customerOrders).toHaveLength(3);

      expect(customerOrders[2]).toEqual({
        id: 3,
        customer_id: 5,
        weight_kg: 9,
        payment_method: "Cash",
        amount_paid: 450,
        status: "Pending",
      });

    });

    it("should preserve the existing customer orders after adding a new order", () => {

      // Arrange
      createCustomerOrder({
        customer_id: 3,
        weight_kg: 6,
        payment_method: "GCash",
        amount_paid: 300,
        status: "Pending",
      });

      // Act
      const customerOrders = readCustomerOrders();

      // Assert
      expect(customerOrders[0]).toEqual({
        id: 1,
        customer_id: 1,
        weight_kg: 5,
        payment_method: "Cash",
        amount_paid: 250,
        status: "Pending",
      });

      expect(customerOrders[1]).toEqual({
        id: 2,
        customer_id: 2,
        weight_kg: 8,
        payment_method: "GCash",
        amount_paid: 400,
        status: "Washing",
      });

      expect(customerOrders[2]).toEqual({
        id: 3,
        customer_id: 3,
        weight_kg: 6,
        payment_method: "GCash",
        amount_paid: 300,
        status: "Pending",
      });

    });

  });

    describe("Update Customer Order", () => {

    it("should update an existing customer order with complete information", () => {

      // Arrange
      const updatedCustomerOrder = {
        customer_id: 1,
        weight_kg: 10,
        payment_method: "GCash",
        amount_paid: 500,
        status: "Ready",
      };

      // Act
      const result = editCustomerOrder(
        1,
        updatedCustomerOrder
      );

      const customerOrders =
        customerOrderModel.getCustomerOrders();

      // Assert
      expect(result)
        .toBe("Customer Order updated successfully");

      expect(customerOrders).toHaveLength(2);

      expect(customerOrders[0]).toEqual({
        id: 1,
        customer_id: 1,
        weight_kg: 10,
        payment_method: "GCash",
        amount_paid: 500,
        status: "Ready",
      });

    });

    it("should display the updated customer order immediately after editing", () => {

      // Arrange
      const updatedCustomerOrder = {
        customer_id: 2,
        weight_kg: 12,
        payment_method: "Cash",
        amount_paid: 600,
        status: "Drying",
      };

      // Act
      editCustomerOrder(
        2,
        updatedCustomerOrder
      );

      const customerOrders =
        readCustomerOrders();

      // Assert
      expect(customerOrders[1]).toEqual({
        id: 2,
        customer_id: 2,
        weight_kg: 12,
        payment_method: "Cash",
        amount_paid: 600,
        status: "Drying",
      });

    });

    it("should update only the selected customer order", () => {

      // Arrange
      const updatedCustomerOrder = {
        customer_id: 1,
        weight_kg: 9,
        payment_method: "Cash",
        amount_paid: 450,
        status: "Folding",
      };

      // Act
      editCustomerOrder(
        1,
        updatedCustomerOrder
      );

      const customerOrders =
        customerOrderModel.getCustomerOrders();

      // Assert
      expect(customerOrders[0].status)
        .toBe("Folding");

      expect(customerOrders[1]).toEqual({
        id: 2,
        customer_id: 2,
        weight_kg: 8,
        payment_method: "GCash",
        amount_paid: 400,
        status: "Washing",
      });

    });

    it("should not update a customer order when customer order id is missing", () => {

      // Arrange
      const updatedCustomerOrder = {
        customer_id: 1,
        weight_kg: 5,
        payment_method: "Cash",
        amount_paid: 250,
        status: "Pending",
      };

      // Act
      const result = () =>
        editCustomerOrder("", updatedCustomerOrder);

      // Assert
      expect(result)
        .toThrow(/Customer Order ID is required/i);

      expect(customerOrderModel.updateCustomerOrder)
        .not.toHaveBeenCalled();

    });

    it("should not update a customer order when customer id is missing", () => {

      // Arrange
      const updatedCustomerOrder = {
        customer_id: "",
        weight_kg: 5,
        payment_method: "Cash",
        amount_paid: 250,
        status: "Pending",
      };

      // Act
      const result = () =>
        editCustomerOrder(1, updatedCustomerOrder);

      // Assert
      expect(result)
        .toThrow(/Customer ID is required/i);

      expect(customerOrderModel.updateCustomerOrder)
        .not.toHaveBeenCalled();

    });

    it("should not update a customer order when weight is missing", () => {

      // Arrange
      const updatedCustomerOrder = {
        customer_id: 1,
        weight_kg: "",
        payment_method: "Cash",
        amount_paid: 250,
        status: "Pending",
      };

      // Act
      const result = () =>
        editCustomerOrder(1, updatedCustomerOrder);

      // Assert
      expect(result)
        .toThrow(/Weight is required/i);

      expect(customerOrderModel.updateCustomerOrder)
        .not.toHaveBeenCalled();

    });

    it("should not update a customer order when payment method is missing", () => {

      // Arrange
      const updatedCustomerOrder = {
        customer_id: 1,
        weight_kg: 5,
        payment_method: "",
        amount_paid: 250,
        status: "Pending",
      };

      // Act
      const result = () =>
        editCustomerOrder(1, updatedCustomerOrder);

      // Assert
      expect(result)
        .toThrow(/Payment method is required/i);

      expect(customerOrderModel.updateCustomerOrder)
        .not.toHaveBeenCalled();

    });

    it("should not update a customer order when amount paid is missing", () => {

      // Arrange
      const updatedCustomerOrder = {
        customer_id: 1,
        weight_kg: 5,
        payment_method: "Cash",
        status: "Pending",
      };

      // Act
      const result = () =>
        editCustomerOrder(1, updatedCustomerOrder);

      // Assert
      expect(result)
        .toThrow(/Amount paid is required/i);

      expect(customerOrderModel.updateCustomerOrder)
        .not.toHaveBeenCalled();

    });

    it("should throw an error when updating a customer order that does not exist", () => {

      // Arrange
      const updatedCustomerOrder = {
        customer_id: 99,
        weight_kg: 5,
        payment_method: "Cash",
        amount_paid: 250,
        status: "Pending",
      };

      // Act
      const result = () =>
        editCustomerOrder(999, updatedCustomerOrder);

      // Assert
      expect(result)
        .toThrow(/Customer Order not found/i);

    });

  });

});