import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import PaymentSection from "../components/PaymentSection";

describe("PaymentSection", () => {
  it("should render amount paid input", () => {
    // Arrange
    render(
      <PaymentSection
        paymentStatus="Unpaid"
        onAmountChange={vi.fn()}
        onMethodChange={vi.fn()}
      />
    );

    // Act
    const input = screen.getByRole("spinbutton");

    // Assert
    expect(input).toBeInTheDocument();
  });

  it("should render payment method dropdown", () => {
    // Arrange
    render(
      <PaymentSection
        paymentStatus="Unpaid"
        onAmountChange={vi.fn()}
        onMethodChange={vi.fn()}
      />
    );

    // Act
    const dropdown = screen.getByRole("combobox");

    // Assert
    expect(dropdown).toBeInTheDocument();
  });

  it("should display payment status", () => {
    // Arrange
    render(
      <PaymentSection
        paymentStatus="Paid"
        onAmountChange={vi.fn()}
        onMethodChange={vi.fn()}
      />
    );

    // Act
    const status = screen.getByText("Paid");

    // Assert
    expect(status).toBeInTheDocument();
  });

  it("should allow typing amount", async () => {
    // Arrange
    const user = userEvent.setup();

    render(
      <PaymentSection
        paymentStatus="Unpaid"
        onAmountChange={vi.fn()}
        onMethodChange={vi.fn()}
      />
    );

    const input = screen.getByRole("spinbutton");

    // Act
    await user.type(input, "500");

    // Assert
    expect(input).toHaveValue(500);
  });

  it("should call onAmountChange", async () => {
    // Arrange
    const user = userEvent.setup();
    const handleAmount = vi.fn();

    render(
      <PaymentSection
        paymentStatus="Unpaid"
        onAmountChange={handleAmount}
        onMethodChange={vi.fn()}
      />
    );

    const input = screen.getByRole("spinbutton");

    // Act
    await user.type(input, "500");

    // Assert
    expect(handleAmount).toHaveBeenLastCalledWith("500");
  });

  it("should call onMethodChange", async () => {
    // Arrange
    const user = userEvent.setup();
    const handleMethod = vi.fn();

    render(
      <PaymentSection
        paymentStatus="Unpaid"
        onAmountChange={vi.fn()}
        onMethodChange={handleMethod}
      />
    );

    const dropdown = screen.getByRole("combobox");

    // Act
    await user.selectOptions(dropdown, "GCash");

    // Assert
    expect(handleMethod).toHaveBeenCalledWith("GCash");
  });

  it("should display all payment methods", () => {
    // Arrange
    render(
      <PaymentSection
        paymentStatus="Paid"
        onAmountChange={vi.fn()}
        onMethodChange={vi.fn()}
      />
    );

    // Act
    const cash = screen.getByRole("option", { name: "Cash" });
    const gcash = screen.getByRole("option", { name: "GCash" });
    const maya = screen.getByRole("option", { name: "Maya" });

    // Assert
    expect(cash).toBeInTheDocument();
    expect(gcash).toBeInTheDocument();
    expect(maya).toBeInTheDocument();
  });
});