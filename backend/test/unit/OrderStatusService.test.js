import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../models/OrderModel.js", () => ({
  getOrderById: vi.fn(),
  updateOrderStatus: vi.fn(),
}));

import { getOrderById, updateOrderStatus } from "../../models/OrderModel.js";

import { updateOrderStatusService } from "../../services/OrderStatusService.js";

describe("Order Status Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should update the order status", async () => {
    getOrderById.mockResolvedValue({
      id: "1",
      status: "pending",
      payment_status: "partial",
    });

    updateOrderStatus.mockResolvedValue({
      id: "1",
      status: "washing",
    });

    const result = await updateOrderStatusService("1", "washing");

    expect(updateOrderStatus).toHaveBeenCalledWith("1", "washing");

    expect(result.status).toBe("washing");
  });

  it("should not allow released when payment is partial", async () => {
    getOrderById.mockResolvedValue({
      id: "1",
      status: "ready",
      payment_status: "partial",
    });

    await expect(updateOrderStatusService("1", "released")).rejects.toThrow(
      "Order cannot be released until payment is completed.",
    );
  });
});
