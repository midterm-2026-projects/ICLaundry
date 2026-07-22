import { render, screen } from "@testing-library/react";

import userEvent from "@testing-library/user-event";

import { describe, it, expect, vi } from "vitest";

import EditOrderModal from "../components/EditOrderModal.jsx";

describe("EditOrderModal", () => {
  const mockOrder = {
    id: "1",

    customers: {
      name: "Juan Dela Cruz",
      phone: "09171234567",
    },

    weight_kg: 5,

    total_price: 200,

    amount_paid: 100,

    payment_method: "cash",

    payment_status: "partial",

    notes: "Handle carefully",

    addons: {
      soap: 1,
    },
  };

  it("should display existing order information", () => {
    render(
      <EditOrderModal
        order={mockOrder}
        onUpdateOrder={vi.fn()}
        onClose={vi.fn()}
      />,
    );

    expect(screen.getByDisplayValue("Juan Dela Cruz")).toBeInTheDocument();

    expect(screen.getByDisplayValue("09171234567")).toBeInTheDocument();

    expect(screen.getByDisplayValue("5")).toBeInTheDocument();

    expect(screen.getByDisplayValue("Handle carefully")).toBeInTheDocument();
  });

  it("should update weight and submit updated order", async () => {
    const user = userEvent.setup();

    const handleUpdate = vi.fn();

    render(
      <EditOrderModal
        order={mockOrder}
        onUpdateOrder={handleUpdate}
        onClose={vi.fn()}
      />,
    );

    const weightInput = screen.getByDisplayValue("5");

    await user.clear(weightInput);

    await user.type(weightInput, "8");

    await user.click(
      screen.getByRole("button", {
        name: /update/i,
      }),
    );

    expect(handleUpdate).toHaveBeenCalledTimes(1);

    expect(handleUpdate).toHaveBeenCalledWith(
      "1",
      expect.objectContaining({
        weight_kg: 8,
        payment_method: "cash",
      }),
    );
  });

  it("should update payment method", async () => {
    const user = userEvent.setup();

    const handleUpdate = vi.fn();

    render(
      <EditOrderModal
        order={mockOrder}
        onUpdateOrder={handleUpdate}
        onClose={vi.fn()}
      />,
    );

    await user.selectOptions(screen.getByRole("combobox"), "gcash");

    await user.click(
      screen.getByRole("button", {
        name: /update/i,
      }),
    );

    expect(handleUpdate).toHaveBeenCalledWith(
      "1",
      expect.objectContaining({
        payment_method: "gcash",
      }),
    );
  });

  it("should recalculate payment status automatically", async () => {
    const user = userEvent.setup();

    render(
      <EditOrderModal
        order={mockOrder}
        onUpdateOrder={vi.fn()}
        onClose={vi.fn()}
      />,
    );

    const amountInput = screen.getByDisplayValue("100");

    await user.clear(amountInput);

    /*
          Total price is:
          Laundry 200
          Soap addon 15
          Total 215

          Use 300 to make payment status PAID
        */

    await user.type(amountInput, "300");

    expect(screen.getByText("paid")).toBeInTheDocument();
  });

  it("should call onClose when Cancel is clicked", async () => {
    const user = userEvent.setup();

    const handleClose = vi.fn();

    render(
      <EditOrderModal
        order={mockOrder}
        onUpdateOrder={vi.fn()}
        onClose={handleClose}
      />,
    );

    await user.click(
      screen.getByRole("button", {
        name: /cancel/i,
      }),
    );

    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
