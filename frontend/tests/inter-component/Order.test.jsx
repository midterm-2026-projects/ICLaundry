import { describe, it, expect, beforeEach, vi } from "vitest";

import { render, screen, waitFor } from "@testing-library/react";

import userEvent from "@testing-library/user-event";

/**
 * ==============================================
 * MOCK APIS
 * ==============================================
 */

vi.mock("../../src/API/orderAPI", () => ({
  getOrderById: vi.fn(),
  updateOrderStatus: vi.fn(),
}));

vi.mock("../../src/API/paymentAPI", () => ({
  completePayment: vi.fn(),
}));

import Order from "../../src/pages/Orders.jsx";

import { getOrderById, updateOrderStatus } from "../../src/API/orderAPI";

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
    it("should display loading before retrieving order", () => {
      getOrderById.mockReturnValue(new Promise(() => {}));

      render(<Order orderId="1" />);

      expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    it("should load existing order information", async () => {
      getOrderById.mockResolvedValue({
        id: "1",

        total_price: 500,

        amount_paid: 250,

        payment_status: "partial",

        status: "Pending",

        estimated_completion: "2 Hours",
      });

      render(<Order orderId="1" />);

      await waitFor(() => {
        expect(getOrderById).toHaveBeenCalledWith("1");
      });

      expect(
        screen.getByRole("button", {
          name: /submit payment/i,
        }),
      ).toBeInTheDocument();

      expect(screen.getByText("Order Status")).toBeInTheDocument();

      expect(
        screen.getByText("Pending", {
          selector: "span",
        }),
      ).toBeInTheDocument();
    });

    it("should handle order retrieval failure", async () => {
      getOrderById.mockRejectedValue(new Error("Failed to load order"));

      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      render(<Order orderId="1" />);

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalled();
      });

      consoleSpy.mockRestore();
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
    it("should allow customer to complete remaining balance", async () => {
      const user = userEvent.setup();

      getOrderById.mockResolvedValue({
        id: "1",

        total_price: 500,

        amount_paid: 250,

        payment_status: "partial",

        status: "Ready",
      });

      completePayment.mockResolvedValue({
        payment_status: "paid",
      });

      render(<Order orderId="1" />);

      await waitFor(() => expect(getOrderById).toHaveBeenCalled());

      await user.type(
        screen.getByRole("spinbutton", {
          name: /amount paid/i,
        }),

        "250",
      );

      await user.selectOptions(
        screen.getByRole("combobox", {
          name: /payment method/i,
        }),

        "Cash",
      );

      await user.click(
        screen.getByRole("button", {
          name: /submit payment/i,
        }),
      );

      expect(completePayment).toHaveBeenCalledWith({
        order_id: "1",

        amount: 250,

        payment_method: "Cash",
      });
    });

    it("should handle failed remaining payment", async () => {
      const user = userEvent.setup();

      getOrderById.mockResolvedValue({
        id: "1",

        payment_status: "partial",
      });

      completePayment.mockRejectedValue(new Error("Payment failed"));

      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      render(<Order orderId="1" />);

      await waitFor(() => expect(getOrderById).toHaveBeenCalled());

      await user.click(
        screen.getByRole("button", {
          name: /submit payment/i,
        }),
      );

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalled();
      });

      consoleSpy.mockRestore();
    });
  });

  /**
   * ==============================================
   * ORDER STATUS
   * ==============================================
   */

  describe("Order Status", () => {
    it("should update order status correctly", async () => {
      const user = userEvent.setup();

      getOrderById.mockResolvedValue({
        id: "1",

        payment_status: "paid",

        status: "Pending",
      });

      updateOrderStatus.mockResolvedValue({
        status: "Washing",
      });

      render(<Order orderId="1" />);

      await waitFor(() => expect(getOrderById).toHaveBeenCalled());

      await user.click(
        screen.getByRole("button", {
          name: /next status/i,
        }),
      );

      expect(updateOrderStatus).toHaveBeenCalledWith("1", "Washing");
    });

    it("should handle status update failure", async () => {
      const user = userEvent.setup();

      getOrderById.mockResolvedValue({
        id: "1",

        payment_status: "paid",

        status: "Pending",
      });

      updateOrderStatus.mockRejectedValue(new Error("Status failed"));

      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      render(<Order orderId="1" />);

      await waitFor(() => expect(getOrderById).toHaveBeenCalled());

      await user.click(
        screen.getByRole("button", {
          name: /next status/i,
        }),
      );

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalled();
      });

      consoleSpy.mockRestore();
    });
  });
});
