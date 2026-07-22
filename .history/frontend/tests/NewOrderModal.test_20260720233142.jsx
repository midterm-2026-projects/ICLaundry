import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";

import NewOrderModal from "../components/NewOrderModal";

describe("NewOrderModal", () => {
  it("should render all required input fields", () => {
    render(<NewOrderModal onCreateOrder={vi.fn()} onClose={vi.fn()} />);

    expect(screen.getByPlaceholderText(/client name/i)).toBeInTheDocument();

    expect(screen.getByPlaceholderText(/phone number/i)).toBeInTheDocument();

    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();

    expect(screen.getByPlaceholderText(/weight/i)).toBeInTheDocument();

    expect(screen.getByPlaceholderText(/amount paid/i)).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText(/special instructions/i),
    ).toBeInTheDocument();
  });

  it("should allow user to enter customer information", async () => {
    const user = userEvent.setup();

    render(<NewOrderModal onCreateOrder={vi.fn()} onClose={vi.fn()} />);

    const nameInput = screen.getByPlaceholderText(/client name/i);

    const phoneInput = screen.getByPlaceholderText(/phone number/i);

    const emailInput = screen.getByPlaceholderText(/email/i);

    await user.type(nameInput, "Juan Dela Cruz");

    await user.type(phoneInput, "09171234567");

    await user.type(emailInput, "juan@email.com");

    expect(nameInput).toHaveValue("Juan Dela Cruz");

    expect(phoneInput).toHaveValue("09171234567");

    expect(emailInput).toHaveValue("juan@email.com");
  });

  it("should allow user to enter laundry weight", async () => {
    const user = userEvent.setup();

    render(<NewOrderModal onCreateOrder={vi.fn()} onClose={vi.fn()} />);

    const weightInput = screen.getByPlaceholderText(/weight/i);

    await user.type(weightInput, "5");

    expect(weightInput).toHaveValue(5);
  });

  it("should calculate total price after entering weight", async () => {
    const user = userEvent.setup();

    render(<NewOrderModal onCreateOrder={vi.fn()} onClose={vi.fn()} />);

    await user.type(screen.getByPlaceholderText(/weight/i), "5");

    expect(screen.getByText(/total:/i)).toHaveTextContent("₱200");
  });

  it("should submit a new order", async () => {
    const user = userEvent.setup();

    const handleCreateOrder = vi.fn().mockResolvedValue();

    window.alert = vi.fn();

    render(
      <NewOrderModal onCreateOrder={handleCreateOrder} onClose={vi.fn()} />,
    );

    await user.type(
      screen.getByPlaceholderText(/client name/i),
      "Juan Dela Cruz",
    );

    await user.type(
      screen.getByPlaceholderText(/phone number/i),
      "09171234567",
    );

    await user.type(screen.getByPlaceholderText(/weight/i), "5");

    await user.type(screen.getByPlaceholderText(/amount paid/i), "100");

    await user.click(
      screen.getByRole("button", {
        name: /create order/i,
      }),
    );

    expect(handleCreateOrder).toHaveBeenCalledWith(
      expect.objectContaining({
        customer_name: "Juan Dela Cruz",
        customer_phone: "09171234567",
        weight_kg: 5,
        total_price: 200,
        amount_paid: 100,
        payment_method: "cash",
        payment_status: "partial",
      }),
    );
  });

  it("should prevent submission when required fields are missing", async () => {
    const user = userEvent.setup();

    window.alert = vi.fn();

    const handleCreateOrder = vi.fn();

    render(
      <NewOrderModal onCreateOrder={handleCreateOrder} onClose={vi.fn()} />,
    );

    await user.click(
      screen.getByRole("button", {
        name: /create order/i,
      }),
    );

    expect(handleCreateOrder).not.toHaveBeenCalled();

    expect(window.alert).toHaveBeenCalled();
  });

  it("should call onClose when Cancel button is clicked", async () => {
    const user = userEvent.setup();

    const handleClose = vi.fn();

    render(<NewOrderModal onCreateOrder={vi.fn()} onClose={handleClose} />);

    await user.click(
      screen.getByRole("button", {
        name: /cancel/i,
      }),
    );

    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
