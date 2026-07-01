import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  describe,
  it,
  expect,
  vi,
} from "vitest";

import AddItemModal from "../components/AddItemModal";

describe("AddItemModal", () => {
  it("should not render when closed", () => {
    render(
      <AddItemModal
        isOpen={false}
        onClose={vi.fn()}
        onSaveItem={vi.fn()}
      />
    );

    expect(
      screen.queryByText(/add item/i)
    ).not.toBeInTheDocument();
  });

  it("should render when opened", () => {
    render(
      <AddItemModal
        isOpen={true}
        onClose={vi.fn()}
        onSaveItem={vi.fn()}
      />
    );

    expect(
      screen.getByText(/add item/i)
    ).toBeInTheDocument();
  });

  it("should display all inventory fields", () => {
    render(
      <AddItemModal
        isOpen={true}
        onClose={vi.fn()}
        onSaveItem={vi.fn()}
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

  it("should display Save Item button", () => {
    render(
      <AddItemModal
        isOpen={true}
        onClose={vi.fn()}
        onSaveItem={vi.fn()}
      />
    );

    expect(
      screen.getByRole("button", {
        name: /save item/i,
      })
    ).toBeInTheDocument();
  });

  it("should display Cancel button", () => {
    render(
      <AddItemModal
        isOpen={true}
        onClose={vi.fn()}
        onSaveItem={vi.fn()}
      />
    );

    expect(
      screen.getByRole("button", {
        name: /cancel/i,
      })
    ).toBeInTheDocument();
  });

  it("should call onSaveItem when valid data is submitted", async () => {
    const user = userEvent.setup();

    const handleSave = vi.fn();

    render(
      <AddItemModal
        isOpen={true}
        onClose={vi.fn()}
        onSaveItem={handleSave}
      />
    );

    await user.type(
      screen.getByLabelText(/item name/i),
      "Ariel Powder"
    );

    await user.selectOptions(
      screen.getByLabelText(/category/i),
      "Detergent"
    );

    await user.type(
      screen.getByLabelText(/^quantity$/i),
      "50"
    );

    await user.selectOptions(
      screen.getByLabelText(/unit/i),
      "kg"
    );

    await user.type(
      screen.getByLabelText(/minimum stock/i),
      "10"
    );

    await user.click(
      screen.getByRole("button", {
        name: /save item/i,
      })
    );

    expect(handleSave).toHaveBeenCalledTimes(1);
  });

  it("should show validation error when required fields are empty", async () => {
    const user = userEvent.setup();

    render(
      <AddItemModal
        isOpen={true}
        onClose={vi.fn()}
        onSaveItem={vi.fn()}
      />
    );

    await user.click(
      screen.getByRole("button", {
        name: /save item/i,
      })
    );

    expect(
      screen.getByRole("alert")
    ).toBeInTheDocument();
  });

  it("should call onClose when Cancel is clicked", async () => {
    const user = userEvent.setup();

    const handleClose = vi.fn();

    render(
      <AddItemModal
        isOpen={true}
        onClose={handleClose}
        onSaveItem={vi.fn()}
      />
    );

    await user.click(
      screen.getByRole("button", {
        name: /cancel/i,
      })
    );

    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});