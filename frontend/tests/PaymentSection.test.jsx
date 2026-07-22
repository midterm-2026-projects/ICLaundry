import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";

import PaymentSection from "../components/PaymentSection";

describe("PaymentSection", () => {
  const defaultProps = {
    orderId: "1",
    paymentStatus: "partial",
    amountPaid: 100,
    remainingBalance: 100,
    onSubmitPayment: vi.fn(),
  };

  it("should render payment information", () => {
    render(<PaymentSection {...defaultProps} />);

    expect(screen.getByText(/payment status/i)).toBeInTheDocument();

    expect(screen.getByText(/amount paid/i)).toBeInTheDocument();

    expect(screen.getByText(/remaining balance/i)).toBeInTheDocument();
  });

  it("should render payment amount input", () => {
    render(<PaymentSection {...defaultProps} />);

    expect(screen.getByPlaceholderText(/enter amount/i)).toBeInTheDocument();
  });

  it("should render payment method dropdown", () => {
    render(<PaymentSection {...defaultProps} />);

    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("should allow entering payment amount", async () => {
    const user = userEvent.setup();

    render(<PaymentSection {...defaultProps} />);

    const input = screen.getByPlaceholderText(/enter amount/i);

    await user.type(input, "100");

    expect(input).toHaveValue(100);
  });

  it("should allow selecting payment method", async () => {
    const user = userEvent.setup();

    render(<PaymentSection {...defaultProps} />);

    const select = screen.getByRole("combobox");

    await user.selectOptions(select, "gcash");

    expect(select).toHaveValue("gcash");
  });

  it("should submit payment", async () => {
    const user = userEvent.setup();

    const handleSubmit = vi.fn();

    render(<PaymentSection {...defaultProps} onSubmitPayment={handleSubmit} />);

    await user.type(screen.getByPlaceholderText(/enter amount/i), "100");

    await user.selectOptions(screen.getByRole("combobox"), "cash");

    await user.click(
      screen.getByRole("button", {
        name: /submit payment/i,
      }),
    );

    expect(handleSubmit).toHaveBeenCalledWith({
      order_id: "1",
      amount: 100,
      payment_method: "cash",
    });
  });

  it("should prevent payment greater than remaining balance", async () => {
    const user = userEvent.setup();

    render(<PaymentSection {...defaultProps} />);

    await user.type(screen.getByPlaceholderText(/enter amount/i), "300");

    await user.selectOptions(screen.getByRole("combobox"), "cash");

    await user.click(
      screen.getByRole("button", {
        name: /submit payment/i,
      }),
    );

    expect(
      screen.getByText(/cannot exceed remaining balance/i),
    ).toBeInTheDocument();
  });

  it("should require payment method", async () => {
    const user = userEvent.setup();

    render(<PaymentSection {...defaultProps} />);

    await user.type(screen.getByPlaceholderText(/enter amount/i), "100");

    await user.click(
      screen.getByRole("button", {
        name: /submit payment/i,
      }),
    );

    expect(screen.getByText(/select payment method/i)).toBeInTheDocument();
  });

  it("should display all payment methods", () => {
    render(<PaymentSection {...defaultProps} />);

    expect(
      screen.getByRole("option", {
        name: "Cash",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("option", {
        name: "GCash",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("option", {
        name: "Bank Transfer",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("option", {
        name: "Card",
      }),
    ).toBeInTheDocument();
  });
});
