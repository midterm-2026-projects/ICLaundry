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

    expect(screen.getByPlaceholderText(/e\.g\. 3\.5/i)).toBeInTheDocument();

    expect(screen.getByPlaceholderText(/amount paid/i)).toBeInTheDocument();
  });

  it("should allow user to enter customer information", async () => {
    const user = userEvent.setup();

    render(<NewOrderModal onCreateOrder={vi.fn()} onClose={vi.fn()} />);

    const name = screen.getByPlaceholderText(/client name/i);

    const phone = screen.getByPlaceholderText(/phone number/i);

    const email = screen.getByPlaceholderText(/email/i);

    await user.type(name, "Juan Dela Cruz");

    await user.type(phone, "09171234567");

    await user.type(email, "juan@email.com");

    expect(name).toHaveValue("Juan Dela Cruz");

    expect(phone).toHaveValue("09171234567");

    expect(email).toHaveValue("juan@email.com");
  });

  it("should allow user to enter laundry weight", async () => {
    const user = userEvent.setup();

    render(<NewOrderModal onCreateOrder={vi.fn()} onClose={vi.fn()} />);

    const weight = screen.getByPlaceholderText(/e\.g\. 3\.5/i);

    await user.type(weight, "5");

    expect(weight).toHaveValue(5);
  });

  it("should calculate total price after entering weight", async () => {
    const user = userEvent.setup();

    render(<NewOrderModal onCreateOrder={vi.fn()} onClose={vi.fn()} />);

    await user.type(screen.getByPlaceholderText(/e\.g\. 3\.5/i), "5");

    expect(screen.getByText(/total/i)).toBeInTheDocument();
  });

  it("should submit a new order", async () => {
    const user = userEvent.setup();

    const handleCreate = vi.fn().mockResolvedValue();

    render(<NewOrderModal onCreateOrder={handleCreate} onClose={vi.fn()} />);

    await user.type(
      screen.getByPlaceholderText(/client name/i),
      "Juan Dela Cruz",
    );

    await user.type(
      screen.getByPlaceholderText(/phone number/i),
      "09171234567",
    );

    await user.type(screen.getByPlaceholderText(/e\.g\. 3\.5/i), "5");

    await user.type(screen.getByPlaceholderText(/amount paid/i), "100");

    await user.click(
      screen.getByRole("button", {
        name: /create order/i,
      }),
    );

    expect(handleCreate).toHaveBeenCalled();
  });

  it("should prevent submission when required fields are missing", async () => {
    const user = userEvent.setup();

    const handleCreate = vi.fn();

    window.alert = vi.fn();

    render(<NewOrderModal onCreateOrder={handleCreate} onClose={vi.fn()} />);

    await user.click(
      screen.getByRole("button", {
        name: /create order/i,
      }),
    );

    expect(handleCreate).not.toHaveBeenCalled();
  });

  it("should close modal", async () => {
    const user = userEvent.setup();

    const close = vi.fn();

    render(<NewOrderModal onCreateOrder={vi.fn()} onClose={close} />);

    await user.click(
      screen.getByRole("button", {
        name: /cancel/i,
      }),
    );

    expect(close).toHaveBeenCalled();
  });
});
