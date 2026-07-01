import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import InventoryItemForm from "../components/InventoryItemForm";

describe("InventoryItemForm", () => {
  it("should render all inventory fields", () => {
    render(
      <InventoryItemForm
        onFormChange={vi.fn()}
      />
    );

    expect(
      screen.getByLabelText(/item name/i)
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText(/category/i)
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText(/^quantity$/i)
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText(/unit/i)
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText(/minimum stock/i)
    ).toBeInTheDocument();
  });

  it("should allow typing item name", async () => {
    const user = userEvent.setup();

    render(
      <InventoryItemForm
        onFormChange={vi.fn()}
      />
    );

    const input =
      screen.getByLabelText(/item name/i);

    await user.type(
      input,
      "Ariel Powder"
    );

    expect(input).toHaveValue(
      "Ariel Powder"
    );
  });

  it("should allow selecting category", async () => {
    const user = userEvent.setup();

    render(
      <InventoryItemForm
        onFormChange={vi.fn()}
      />
    );

    const dropdown =
      screen.getByLabelText(/category/i);

    await user.selectOptions(
      dropdown,
      "Detergent"
    );

    expect(dropdown).toHaveValue(
      "Detergent"
    );
  });

  it("should allow entering quantity", async () => {
    const user = userEvent.setup();

    render(
      <InventoryItemForm
        onFormChange={vi.fn()}
      />
    );

    const input =
      screen.getByLabelText(/^quantity$/i);

    await user.type(input, "25");

    expect(input).toHaveValue(25);
  });

  it("should allow selecting unit", async () => {
    const user = userEvent.setup();

    render(
      <InventoryItemForm
        onFormChange={vi.fn()}
      />
    );

    const dropdown =
      screen.getByLabelText(/unit/i);

    await user.selectOptions(
      dropdown,
      "kg"
    );

    expect(dropdown).toHaveValue(
      "kg"
    );
  });

  it("should allow entering minimum stock", async () => {
    const user = userEvent.setup();

    render(
      <InventoryItemForm
        onFormChange={vi.fn()}
      />
    );

    const input =
      screen.getByLabelText(
        /minimum stock/i
      );

    await user.type(input, "10");

    expect(input).toHaveValue(10);
  });

  it("should call onFormChange whenever a field changes", async () => {
    const user = userEvent.setup();

    const handleChange = vi.fn();

    render(
      <InventoryItemForm
        onFormChange={handleChange}
      />
    );

    await user.type(
      screen.getByLabelText(
        /item name/i
      ),
      "Downy"
    );

    expect(handleChange).toHaveBeenCalled();
  });
});