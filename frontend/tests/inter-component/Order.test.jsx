// frontend/tests/inter-component/Order.test.jsx

import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("../../src/API/orderAPI", () => ({
  getOrderById: vi.fn(),
  updateOrderStatus: vi.fn(),
}));

vi.mock("../../src/API/paymentAPI", () => ({
  createInitialPayment: vi.fn(),
  completePayment: vi.fn(),
}));

import Order from "../../src/pages/Orders.jsx";

import { getOrderById, updateOrderStatus } from "../../src/API/orderAPI";

import {
  createInitialPayment,
  completePayment,
} from "../../src/API/paymentAPI";

describe("Order Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Initial Rendering", () => {
    it("should display the order information after loading", async () => {
      getOrderById.mockResolvedValue({
        id: "1",
        total_price: 500,
        payment_status: "unpaid",
        status: "Pending",
        estimated_completion: "2 Hours",
      });

      render(<Order orderId="1" />);

      expect(screen.getByText(/loading/i)).toBeInTheDocument();

      await waitFor(() => {
        expect(getOrderById).toHaveBeenCalledWith("1");
      });

      expect(
        screen.getByRole("button", {
          name: /submit payment/i,
        }),
      ).toBeInTheDocument();

      expect(screen.getAllByText(/pending/i)).toHaveLength(2);

      expect(screen.getByText(/2 hours/i)).toBeInTheDocument();
    });
  });

  describe("Initial Payment", () => {
    it("should allow the user to submit the initial payment", async () => {
      const user = userEvent.setup();

      getOrderById.mockResolvedValue({
        id: "1",
        total_price: 500,
        payment_status: "unpaid",
        status: "Pending",
        estimated_completion: "2 Hours",
      });

      createInitialPayment.mockResolvedValue({});

      render(<Order orderId="1" />);

      await waitFor(() => {
        expect(getOrderById).toHaveBeenCalled();
      });

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

      expect(createInitialPayment).toHaveBeenCalledWith({
        order_id: "1",
        amount: 250,
        payment_method: "Cash",
      });
    });
  });

  describe("Complete Payment", () => {
    it("should allow the user to complete the remaining payment", async () => {
      const user = userEvent.setup();

      getOrderById.mockResolvedValue({
        id: "1",
        total_price: 500,
        payment_status: "partial",
        status: "Ready for Pick-up",
        estimated_completion: "Ready",
      });

      completePayment.mockResolvedValue({});

      render(<Order orderId="1" />);

      await waitFor(() => {
        expect(getOrderById).toHaveBeenCalled();
      });

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
  });

  describe("Order Status Progression", () => {
    it("should update the order status when Next Status is clicked", async () => {
      const user = userEvent.setup();

      getOrderById.mockResolvedValue({
        id: "1",
        total_price: 500,
        payment_status: "paid",
        status: "Pending",
        estimated_completion: "2 Hours",
      });

      updateOrderStatus.mockResolvedValue({
        id: "1",
        status: "Washing",
      });

      render(<Order orderId="1" />);

      await waitFor(() => {
        expect(getOrderById).toHaveBeenCalled();
      });

      await user.click(
        screen.getByRole("button", {
          name: /next status/i,
        }),
      );

      expect(updateOrderStatus).toHaveBeenCalledWith("1", "Washing");
    });
  });
});
