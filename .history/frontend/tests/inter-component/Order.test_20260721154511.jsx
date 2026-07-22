import { describe, it, expect, beforeEach, vi } from "vitest";

import { render, screen, waitFor } from "@testing-library/react";

import userEvent from "@testing-library/user-event";

/**
 * ==============================================
 * MOCK APIS
 * ==============================================
 */

vi.mock("../../src/API/orderAPI", () => ({
  getOrders: vi.fn(),
  createOrder: vi.fn(),
  updateOrder: vi.fn(),
  deleteOrder: vi.fn(),
  updateOrderStatus: vi.fn(),
}));

vi.mock("../../src/API/paymentAPI", () => ({
  completePayment: vi.fn(),
}));

import Order from "../../src/pages/Orders.jsx";

import {
  getOrders,
  createOrder,
  updateOrder,
  deleteOrder,
  updateOrderStatus,
} from "../../src/API/orderAPI";

import { completePayment } from "../../src/API/paymentAPI";

describe("Order Page Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  /**
   * ==============================================
   * ORDER RETRIEVAL
   * ==============================================
   */

  describe("Order Loading", () => {
    beforeEach(() => {
      getOrders.mockResolvedValue([
        {
          id: "1",
          order_number: "ORD-001",
          customers: {
            name: "Juan Dela Cruz",
            phone: "09123456789",
          },
          weight_kg: 5,
          total_price: 500,
          amount_paid: 250,
          payment_status: "partial",
          payment_method: "cash",
          status: "pending",
        },
      ]);
    });

    it("should display loading while retrieving orders", () => {
      getOrders.mockReturnValue(new Promise(() => {}));

      render(<Order />);

      expect(screen.getByText(/loading orders/i)).toBeInTheDocument();
    });

    it("should load orders on page load", async () => {
      render(<Order />);

      await waitFor(() => {
        expect(getOrders).toHaveBeenCalledTimes(1);
      });

      expect(screen.getByText("Juan Dela Cruz")).toBeInTheDocument();

      expect(screen.getByText("ORD-001")).toBeInTheDocument();

      expect(screen.getByText(/partial/i)).toBeInTheDocument();
    });

    it("should display empty state when no orders are returned", async () => {
      getOrders.mockResolvedValue([]);

      render(<Order />);

      await waitFor(() => {
        expect(getOrders).toHaveBeenCalled();
      });

      expect(screen.getByText(/no orders found/i)).toBeInTheDocument();
    });

    it("should display error when loading orders fails", async () => {
      getOrders.mockRejectedValue(new Error("Failed to load orders"));

      render(<Order />);

      expect(
        await screen.findByText("Failed to load orders"),
      ).toBeInTheDocument();
    });
  });

  /**
   * ==============================================
   * 50% PAYMENT RULE
   *
   * Existing orders already passed
   * the initial payment requirement.
   *
   * These tests verify the remaining
   * payment process.
   * ==============================================
   */

  describe("Remaining Payment", () => {
    beforeEach(() => {
      getOrders.mockResolvedValue([
        {
          id: "1",
          order_number: "ORD-001",
          customers: {
            name: "Juan Dela Cruz",
            phone: "09123456789",
          },
          weight_kg: 5,
          total_price: 500,
          amount_paid: 250,
          payment_status: "partial",
          payment_method: "cash",
          status: "ready",
        },
      ]);
    });

    it("should open payment modal when releasing unpaid order", async () => {
      const user = userEvent.setup();

      render(<Order />);

      await screen.findByText("Juan Dela Cruz");

      await user.click(
        screen.getByRole("button", {
          name: /move to washing/i,
        }),
      );

      expect(await screen.findByText(/complete payment/i)).toBeInTheDocument();

      expect(screen.getByText(/remaining balance/i)).toBeInTheDocument();
    });

    it("should complete remaining payment", async () => {
      const user = userEvent.setup();

      completePayment.mockResolvedValue({
        paymentStatus: "paid",
      });

      updateOrderStatus.mockResolvedValue({});

      render(<Order />);

      await screen.findByText("Juan Dela Cruz");

      await user.click(
        screen.getByRole("button", {
          name: /move to washing/i,
        }),
      );

      await user.type(screen.getByPlaceholderText(/enter amount/i), "250");

      await user.selectOptions(screen.getByRole("combobox"), "cash");

      await user.click(
        screen.getByRole("button", {
          name: /submit payment/i,
        }),
      );

      await waitFor(() => {
        expect(completePayment).toHaveBeenCalledWith({
          order_id: "1",
          amount: 250,
          payment_method: "cash",
        });
      });

      expect(updateOrderStatus).toHaveBeenCalledWith("1", "released");
    });

    it("should handle failed payment", async () => {
      const user = userEvent.setup();

      completePayment.mockRejectedValue(new Error("Payment failed"));

      window.alert = vi.fn();

      render(<Order />);

      await screen.findByText("Juan Dela Cruz");

      await user.click(
        screen.getByRole("button", {
          name: /move to washing/i,
        }),
      );

      await user.type(screen.getByPlaceholderText(/enter amount/i), "250");

      await user.selectOptions(screen.getByRole("combobox"), "cash");

      await user.click(
        screen.getByRole("button", {
          name: /submit payment/i,
        }),
      );

      await waitFor(() => {
        expect(window.alert).toHaveBeenCalled();
      });
    });
  });

  /**
   * ==============================================
   * ORDER STATUS
   * ==============================================
   */

  describe("Order Status", () => {
    beforeEach(() => {
      getOrders.mockResolvedValue([
        {
          id: "1",
          order_number: "ORD-001",
          customers: {
            name: "Juan Dela Cruz",
            phone: "09123456789",
          },
          weight_kg: 5,
          total_price: 500,
          amount_paid: 500,
          payment_status: "paid",
          payment_method: "cash",
          status: "pending",
        },
      ]);
    });

    it("should update order status successfully", async () => {
      const user = userEvent.setup();

      updateOrderStatus.mockResolvedValue({
        success: true,
      });

      render(<Order />);

      await screen.findByText("Juan Dela Cruz");

      await user.click(
        screen.getByRole("button", {
          name: /move to washing/i,
        }),
      );

      await waitFor(() => {
        expect(updateOrderStatus).toHaveBeenCalledWith("1", "washing");
      });

      expect(getOrders).toHaveBeenCalledTimes(2);
    });

    it("should display alert when status update fails", async () => {
      const user = userEvent.setup();

      updateOrderStatus.mockRejectedValue(new Error("Status failed"));

      window.alert = vi.fn();

      render(<Order />);

      await screen.findByText("Juan Dela Cruz");

      await user.click(
        screen.getByRole("button", {
          name: /move to washing/i,
        }),
      );

      await waitFor(() => {
        expect(window.alert).toHaveBeenCalledWith("Status failed");
      });
    });

    it("should reload orders after successful status update", async () => {
      const user = userEvent.setup();

      updateOrderStatus.mockResolvedValue({
        success: true,
      });

      render(<Order />);

      await screen.findByText("Juan Dela Cruz");

      await user.click(
        screen.getByRole("button", {
          name: /move to washing/i,
        }),
      );

      await waitFor(() => {
        expect(getOrders).toHaveBeenCalledTimes(2);
      });
    });
  });
});
