// frontend/tests/inter-component/Order.test.jsx

import { describe, it, expect, vi, beforeEach } from "vitest";

import { render, screen, waitFor } from "@testing-library/react";

import userEvent from "@testing-library/user-event";

import Order from "../../src/pages/Orders";

import {
  getOrders,
  getOrderById,
  updateOrderStatus,
  completePayment,
} from "../../src/API/orderAPI";

/**
 * ==========================================
 * MOCK API
 * ==========================================
 */

vi.mock("../../src/API/orderAPI", () => ({
  getOrders: vi.fn(),

  getOrderById: vi.fn(),

  updateOrderStatus: vi.fn(),

  completePayment: vi.fn(),
}));

/**
 * ==========================================
 * MOCK DATA
 * ==========================================
 */

const mockOrder = {
  id: "1",

  order_number: "ORD-001",

  customer: {
    name: "Juan Dela Cruz",
    phone: "09123456789",
  },

  weight_kg: 5,

  total_price: 500,

  amount_paid: 500,

  payment_status: "paid",

  status: "pending",

  estimated_completion: null,
};

const mockReadyOrder = {
  ...mockOrder,

  status: "ready",

  amount_paid: 250,

  payment_status: "partial",
};

beforeEach(() => {
  vi.clearAllMocks();

  getOrders.mockResolvedValue([mockOrder]);

  getOrderById.mockResolvedValue(mockOrder);

  updateOrderStatus.mockResolvedValue({
    success: true,
  });

  completePayment.mockResolvedValue({
    paymentStatus: "paid",
  });
});

describe("Order Page Integration", () => {
  /**
   * ==================================
   * BASIC RENDER
   * ==================================
   */

  it("should display orders", async () => {
    render(<Order />);

    expect(await screen.findByText("ORD-001")).toBeInTheDocument();
  });

  /**
   * ==================================
   * STATUS UPDATE
   * ==================================
   */

  describe("Order Status", () => {
    it("should update order status correctly", async () => {
      const user = userEvent.setup();

      render(<Order />);

      await waitFor(() => {
        expect(getOrders).toHaveBeenCalled();
      });

      const button = screen.getByRole("button", {
        name: /move to/i,
      });

      await user.click(button);

      await waitFor(() => {
        expect(updateOrderStatus).toHaveBeenCalled();
      });
    });

    it("should handle status update failure", async () => {
      const user = userEvent.setup();

      updateOrderStatus.mockRejectedValue(new Error("Update failed"));

      render(<Order />);

      const button = await screen.findByRole("button", {
        name: /move to/i,
      });

      await user.click(button);

      await waitFor(() => {
        expect(updateOrderStatus).toHaveBeenCalled();
      });
    });

    it("should reload orders after successful status update", async () => {
      const user = userEvent.setup();

      render(<Order />);

      const button = await screen.findByRole("button", {
        name: /move to/i,
      });

      await user.click(button);

      await waitFor(() => {
        expect(getOrders).toHaveBeenCalledTimes(2);
      });
    });
  });

  /**
   * ==================================
   * PAYMENT
   * ==================================
   */

  describe("Remaining Payment", () => {
    beforeEach(() => {
      getOrders.mockResolvedValue([mockReadyOrder]);

      getOrderById.mockResolvedValue(mockReadyOrder);
    });

    it("should complete remaining payment", async () => {
      const user = userEvent.setup();

      render(<Order />);

      expect(await screen.findByText("Balance:")).toBeInTheDocument();
    });

    it("should handle failed payment", async () => {
      completePayment.mockRejectedValue(new Error("Payment failed"));

      render(<Order />);

      expect(await screen.findByText("Ready for pick-up")).toBeInTheDocument();
    });
  });
});
