import { beforeEach, describe, expect, it, vi } from "vitest";
import * as orderModel from "../../models/OrderModel.js";
import { RecentOrder } from "../../models/OrderModel.js";
import {
  createOrder,
  readOrders,
  editOrder,
  getAnalytics,
  getWeeklyAnalytics,
  getMonthlyAnalytics,
  getYearlyAnalytics,
  getPaginatedOrders,
  getOrderById,
  addOrder
} from "../../services/OrderService.js";

// Mock the OrderModel
vi.mock("../../models/OrderModel.js", () => {
  let orders = [];

  const resetOrders = (newOrders = []) => {
    orders = structuredClone(newOrders);
  };

  const insertOrder = vi.fn((order) => {
    const newOrder = { id: orders.length + 1, ...order };
    orders.push(newOrder);
    return newOrder;
  });

  const getOrders = vi.fn(() => orders);

  const updateOrder = vi.fn((id, updatedOrder) => {
    const orderIndex = orders.findIndex(order => order.id === Number(id));
    if (orderIndex === -1) return null;
    orders[orderIndex] = { ...orders[orderIndex], ...updatedOrder };
    return orders[orderIndex];
  });

  return {
    resetOrders,
    insertOrder,
    getOrders,
    updateOrder,
    RecentOrder: class {
      constructor(data) {
        Object.assign(this, data);
        this.waitingTime = data.waitingTime || null;
      }
      validate() {
        const validStatuses = ["Pending", "Folding", "Ready", "Released"];
        if (!this.orderId) throw new Error("Order ID is required");
        if (!this.customer) throw new Error("Customer name is required");
        if (!validStatuses.includes(this.status)) throw new Error(`Status must be one of: ${validStatuses.join(", ")}`);
        if (!this.amount) throw new Error("Order amount is required");
        return true;
      }
    }
  };
});

describe("Order Module Tests", () => {
  beforeEach(() => {
    orderModel.resetOrders([
      {
        id: 1,
        customer_id: 1,
        weight_kg: 5,
        payment_method: "Cash",
        amount_paid: 500,
        orderDate: new Date("2026-07-06"),
        totalAmount: 500,
        status: "Released",
      },
    ]);
    vi.clearAllMocks();
  });

  // ==============================================
  // BASIC CRUD TESTS
  // ==============================================
  describe("Create Order", () => {
    it("creates an order successfully", () => {
      const order = { customer_id: 2, weight_kg: 3, payment_method: "GCash", amount_paid: 300 };
      const result = createOrder(order);
      expect(result).toBe("Order created successfully");
      expect(orderModel.insertOrder).toHaveBeenCalledTimes(1);
    });

    it("throws error when customer ID is missing", () => {
      const order = { weight_kg: 5, payment_method: "Cash", amount_paid: 500 };
      expect(() => createOrder(order)).toThrow("Customer ID is required");
    });

    it("throws error when weight is invalid", () => {
      const order = { customer_id: 1, weight_kg: 0, payment_method: "Cash", amount_paid: 500 };
      expect(() => createOrder(order)).toThrow("Weight is required");
    });

    it("throws error when payment method is missing", () => {
      const order = { customer_id: 1, weight_kg: 5, payment_method: "", amount_paid: 500 };
      expect(() => createOrder(order)).toThrow("Payment method is required");
    });

    it("throws error when amount paid is invalid", () => {
      const order = { customer_id: 1, weight_kg: 5, payment_method: "Cash", amount_paid: -100 };
      expect(() => createOrder(order)).toThrow("Amount paid is required");
    });
  });

  describe("Read Orders", () => {
    it("retrieves all order records", () => {
      const orders = readOrders();
      expect(orders).toHaveLength(1);
      expect(orders[0]).toEqual({
        id: 1,
        customer_id: 1,
        weight_kg: 5,
        payment_method: "Cash",
        amount_paid: 500,
        orderDate: new Date("2026-07-06"),
        totalAmount: 500,
        status: "Released",
      });
    });

    it("returns empty list when no orders exist", () => {
      orderModel.resetOrders([]);
      expect(readOrders()).toEqual([]);
    });

    it("shows newly created order after saving", () => {
      createOrder({
        customer_id: 2, weight_kg: 8, payment_method: "GCash", amount_paid: 800,
        orderDate: new Date("2026-07-07"), totalAmount: 800, status: "Pending"
      });
      const orders = readOrders();
      expect(orders).toHaveLength(2);
      expect(orders[1].customer_id).toBe(2);
    });
  });

  describe("Update Order", () => {
    it("updates an existing order successfully", () => {
      const updated = { customer_id: 1, weight_kg: 10, payment_method: "GCash", amount_paid: 1000, status: "Ready" };
      const result = editOrder(1, updated);
      expect(result).toBe("Order updated successfully");
      expect(orderModel.getOrders()[0].weight_kg).toBe(10);
    });

    it("updates only the selected order", () => {
      orderModel.resetOrders([
        { id: 1, customer_id: 1, weight_kg: 5, payment_method: "Cash", amount_paid: 500, status: "Pending" },
        { id: 2, customer_id: 2, weight_kg: 8, payment_method: "GCash", amount_paid: 800, status: "Folding" }
      ]);
      editOrder(1, { status: "Ready" });
      expect(orderModel.getOrders()[0].status).toBe("Ready");
      expect(orderModel.getOrders()[1].status).toBe("Folding");
    });

    it("throws error when order ID is missing", () => {
      expect(() => editOrder("", {})).toThrow("Order ID is required");
    });

    it("throws error when updating non-existent order", () => {
      expect(() => editOrder(999, {})).toThrow("Order not found");
    });
  });

  // ==============================================
  // ANALYTICS TESTS
  // ==============================================
  describe("Order Analytics", () => {
    it("throws error for invalid period", () => {
      expect(() => getAnalytics("invalid")).toThrow("Unknown analytics period");
    });

    it("returns weekly analytics correctly", () => {
      orderModel.resetOrders([
        { id: 1, orderDate: new Date("2026-07-06"), totalAmount: 400, status: "Released" },
        { id: 2, orderDate: new Date("2026-07-07"), totalAmount: 110, status: "Released" },
        { id: 3, orderDate: new Date("2026-07-08"), totalAmount: 260, status: "Released" }
      ]);
      const result = getWeeklyAnalytics();
      expect(result.labels).toEqual(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]);
      expect(result.orders).toEqual([1, 1, 1, 0, 0, 0, 0]);
      expect(result.revenue).toEqual([400, 110, 260, 0, 0, 0, 0]);
    });

    it("returns monthly analytics correctly", () => {
      orderModel.resetOrders([
        { id: 1, orderDate: new Date("2026-01-10"), totalAmount: 8000, status: "Released" },
        { id: 2, orderDate: new Date("2026-02-12"), totalAmount: 9500, status: "Released" }
      ]);
      const result = getMonthlyAnalytics();
      expect(result.orders[0]).toBe(1);
      expect(result.revenue[1]).toBe(9500);
    });

    it("returns yearly analytics correctly", () => {
      const currentYear = new Date().getFullYear();
      orderModel.resetOrders([
        { id: 1, orderDate: new Date(`${currentYear - 1}-05-10`), totalAmount: 60000, status: "Released" },
        { id: 2, orderDate: new Date(`${currentYear}-05-10`), totalAmount: 112000, status: "Released" }
      ]);
      const result = getYearlyAnalytics();
      expect(result.labels).toContain(String(currentYear));
      expect(result.revenue).toContain(60000);
    });

    it("ignores non-Released orders", () => {
      orderModel.resetOrders([
        { id: 1, orderDate: new Date("2026-01-10"), totalAmount: 300, status: "Pending" },
        { id: 2, orderDate: new Date("2026-01-11"), totalAmount: 700, status: "Released" }
      ]);
      const result = getMonthlyAnalytics();
      expect(result.orders[0]).toBe(1);
      expect(result.revenue[0]).toBe(700);
    });
  });

  // ==============================================
  // RECENT ORDERS TESTS
  // ==============================================
  describe("Recent Orders: Model & Service", () => {
    describe("RecentOrder Model", () => {
      it("creates a valid recent order object", () => {
        const order = new RecentOrder({ orderId: "TEST-001", customer: "Test Customer", status: "Pending", amount: "₱150" });
        expect(order.orderId).toBe("TEST-001");
        expect(order.waitingTime).toBeNull();
      });

      it("throws error for invalid status", () => {
        const bad = new RecentOrder({ orderId: "TEST-002", customer: "Test", status: "Cancelled", amount: "₱200" });
        expect(() => bad.validate()).toThrow("Status must be one of: Pending, Folding, Ready, Released");
      });

      it("throws error if order ID is missing", () => {
        const bad = new RecentOrder({ customer: "Test", status: "Ready", amount: "₱100" });
        expect(() => bad.validate()).toThrow("Order ID is required");
      });
    });

    describe("Recent Order Service", () => {
      it("returns correct paginated data for page 1", async () => {
        const result = await getPaginatedOrders(1, 10);
        expect(result.data.length).toBe(10);
        expect(result.totalItems).toBe(12);
      });

      it("returns correct data for page 2", async () => {
        const result = await getPaginatedOrders(2, 10);
        expect(result.data.length).toBe(2);
        expect(result.data[0].orderId).toBe("4J-20260503-1111");
      });

      it("finds existing order by ID", async () => {
        const order = await getOrderById("4J-20260426-3203");
        expect(order?.customer).toBe("Erica Vidal");
        expect(order?.status).toBe("Ready");
      });

      it("returns null for non-existent order ID", async () => {
        expect(await getOrderById("INVALID-999")).toBeNull();
      });

      it("creates new recent order successfully", async () => {
        const newOrder = await addOrder({
          orderId: "NEW-123", customer: "New User", status: "Folding", waitingTime: "Waiting start", amount: "₱275"
        });
        expect(newOrder.orderId).toBe("NEW-123");
      });
    });
  });
});