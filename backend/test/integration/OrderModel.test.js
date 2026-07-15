import { describe, it, expect } from "vitest";

import {
  getOrders,
  getOrderById,
  createOrder,
  updateOrder,
} from "../../models/OrderModel.js";

describe("Order Model Integration Test", () => {
  describe("Get All Orders", () => {
    it("should retrieve all orders from the database", async () => {
      // Arrange

      // Act
      const result = await getOrders();

      // Assert
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("Get Order By ID", () => {
    it("should retrieve an order using its id", async () => {
      // Arrange
      const orders = await getOrders();

      expect(orders.length).toBeGreaterThan(0);

      // Act
      const result = await getOrderById(orders[0].id);

      // Assert
      expect(result).toBeDefined();
      expect(result.id).toBe(orders[0].id);
    });
  });

  describe("Create Order", () => {
    it("should insert a new order into the database", async () => {
      // Arrange
      const order = {
        order_number: `TEST-${Date.now()}`,
        weight_kg: 5,
        total_price: 250,
      };

      // Act
      const result = await createOrder(order);

      // Assert
      expect(result).toBeDefined();
      expect(result.order_number).toBe(order.order_number);
    });
  });

  describe("Update Order", () => {
    it("should update an existing order", async () => {
      // Arrange
      const orders = await getOrders();

      expect(orders.length).toBeGreaterThan(0);

      // Act
      const result = await updateOrder(orders[0].id, {
        status: "washing",
      });

      // Assert
      expect(result.status).toBe("washing");
    });
  });
});
