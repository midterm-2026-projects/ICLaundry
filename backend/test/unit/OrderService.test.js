// backend/test/unit/OrderStatusService.test.js

import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../models/OrderModel.js", () => ({
  getOrderById: vi.fn(),
  updateOrderStatus: vi.fn(),
}));

import { updateOrderStatusService } from "../../services/OrderService.js";

import { getOrderById, updateOrderStatus } from "../../models/OrderModel.js";

describe("Order Status Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const createOrder = (status = "pending", payment_status = "paid") => ({
    id: "1",
    status,
    payment_status,
  });

  /**
   * ==============================================
   * SUCCESSFUL WORKFLOW
   * ==============================================
   */

  it.each([
    ["pending", "washing"],
    ["washing", "drying"],
    ["drying", "folding"],
    ["folding", "ready"],
    ["ready", "released"],
  ])(
    "should allow valid workflow transition %s -> %s",
    async (current, next) => {
      getOrderById.mockResolvedValue(createOrder(current));

      updateOrderStatus.mockResolvedValue({
        id: "1",
        status: next,
      });

      const result = await updateOrderStatusService("1", next);

      expect(getOrderById).toHaveBeenCalledWith("1");

      expect(updateOrderStatus).toHaveBeenCalledWith("1", next);

      expect(result.status).toBe(next);
    },
  );

  /**
   * ==============================================
   * PAYMENT BUSINESS RULE
   * ==============================================
   */

  it("should prevent releasing order with partial payment", async () => {
    getOrderById.mockResolvedValue(createOrder("ready", "partial"));

    await expect(updateOrderStatusService("1", "released")).rejects.toThrow(
      "Order cannot be released until payment is completed.",
    );

    expect(updateOrderStatus).not.toHaveBeenCalled();
  });

  it("should prevent releasing unpaid order", async () => {
    getOrderById.mockResolvedValue(createOrder("ready", "unpaid"));

    await expect(updateOrderStatusService("1", "released")).rejects.toThrow();

    expect(updateOrderStatus).not.toHaveBeenCalled();
  });

  it("should allow releasing fully paid order", async () => {
    getOrderById.mockResolvedValue(createOrder("ready", "paid"));

    updateOrderStatus.mockResolvedValue({
      id: "1",
      status: "released",
    });

    const result = await updateOrderStatusService("1", "released");

    expect(result.status).toBe("released");

    expect(updateOrderStatus).toHaveBeenCalled();
  });

  /**
   * ==============================================
   * ORDER NOT FOUND
   * ==============================================
   */

  it("should throw error when order does not exist", async () => {
    getOrderById.mockResolvedValue(null);

    await expect(updateOrderStatusService("999", "washing")).rejects.toThrow(
      "Order not found.",
    );

    expect(updateOrderStatus).not.toHaveBeenCalled();
  });

  /**
   * ==============================================
   * INVALID INPUT
   * ==============================================
   */

  it.each(["invalid", "", null, undefined, 123])(
    "should reject invalid status value %#",
    async (status) => {
      getOrderById.mockResolvedValue(createOrder());

      await expect(updateOrderStatusService("1", status)).rejects.toThrow();

      expect(updateOrderStatus).not.toHaveBeenCalled();
    },
  );

  /**
   * ==============================================
   * PREVENT BACKWARD MOVEMENT
   * ==============================================
   */

  it.each([
    ["washing", "pending"],
    ["drying", "washing"],
    ["folding", "drying"],
    ["ready", "folding"],
    ["released", "ready"],
  ])(
    "should prevent moving order backwards %s -> %s",
    async (current, next) => {
      getOrderById.mockResolvedValue(createOrder(current));

      await expect(updateOrderStatusService("1", next)).rejects.toThrow(
        "Order status cannot move backwards.",
      );

      expect(updateOrderStatus).not.toHaveBeenCalled();
    },
  );

  /**
   * ==============================================
   * PREVENT SKIPPING STEPS
   * ==============================================
   */

  it.each([
    ["pending", "ready"],
    ["washing", "ready"],
    ["drying", "released"],
    ["folding", "released"],
  ])(
    "should prevent skipping workflow steps %s -> %s",
    async (current, next) => {
      getOrderById.mockResolvedValue(createOrder(current));

      await expect(updateOrderStatusService("1", next)).rejects.toThrow(
        "Order status cannot skip workflow steps.",
      );

      expect(updateOrderStatus).not.toHaveBeenCalled();
    },
  );

  /**
   * ==============================================
   * SAME STATUS
   * ==============================================
   */

  it("should prevent updating to the same status", async () => {
    getOrderById.mockResolvedValue(createOrder("washing"));

    await expect(updateOrderStatusService("1", "washing")).rejects.toThrow(
      "Order is already in this status.",
    );

    expect(updateOrderStatus).not.toHaveBeenCalled();
  });

  /**
   * ==============================================
   * DATABASE FAILURE
   * ==============================================
   */

  it("should throw error when updating database fails", async () => {
    getOrderById.mockResolvedValue(createOrder("pending"));

    updateOrderStatus.mockRejectedValue(new Error("Database error"));

    await expect(updateOrderStatusService("1", "washing")).rejects.toThrow(
      "Database error",
    );
  });
});
