import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  describe,
  it,
  expect,
  vi,
} from "vitest";

import RestockModal from "../components/RestockModal";

describe("RestockModal", () => {
  it("should not render when closed", () => {
    render(
      <RestockModal
        isOpen={false}
        onClose={vi.fn()}
        onSubmitRestock={vi.fn()}
      />
    );

    expect(
      screen.queryByText(/restock item/i)
    ).not.toBeInTheDocument();
  });

  it("should render when opened", () => {
    render(
      <RestockModal
        isOpen={true}
        onClose={vi.fn()}
        onSubmitRestock={vi.fn()}
      />
    );

    expect(
      screen.getByRole("heading", {
        name: /restock item/i,
      })
    ).toBeInTheDocument();
  });

  it("should display quantity input", () => {
    render(
      <RestockModal
        isOpen={true}
        onClose={vi.fn()}
        onSubmitRestock={vi.fn()}
      />
    );

    expect(
      screen.getByLabelText(
        /restock quantity/i
      )
    ).toBeInTheDocument();
  });

  it("should display notes textarea", () => {
    render(
      <RestockModal
        isOpen={true}
        onClose={vi.fn()}
        onSubmitRestock={vi.fn()}
      />
    );

    expect(
      screen.getByLabelText(
        /restock notes/i
      )
    ).toBeInTheDocument();
  });

  it("should display Submit Restock button", () => {
    render(
      <RestockModal
        isOpen={true}
        onClose={vi.fn()}
        onSubmitRestock={vi.fn()}
      />
    );

    expect(
      screen.getByRole("button", {
        name: /submit restock/i,
      })
    ).toBeInTheDocument();
  });

  it("should display Cancel button", () => {
    render(
      <RestockModal
        isOpen={true}
        onClose={vi.fn()}
        onSubmitRestock={vi.fn()}
      />
    );

    expect(
      screen.getByRole("button", {
        name: /cancel/i,
      })
    ).toBeInTheDocument();
  });

  it("should allow entering quantity", async () => {
    const user = userEvent.setup();

    render(
      <RestockModal
        isOpen={true}
        onClose={vi.fn()}
        onSubmitRestock={vi.fn()}
      />
    );

    const quantity =
      screen.getByLabelText(
        /restock quantity/i
      );

    await user.type(quantity, "25");

    expect(quantity).toHaveValue(25);
  });

  it("should allow entering notes", async () => {
    const user = userEvent.setup();

    render(
      <RestockModal
        isOpen={true}
        onClose={vi.fn()}
        onSubmitRestock={vi.fn()}
      />
    );

    const notes =
      screen.getByLabelText(
        /restock notes/i
      );

    await user.type(
      notes,
      "Supplier delivery"
    );

    expect(notes).toHaveValue(
      "Supplier delivery"
    );
  });

  it("should show validation error when quantity is empty", async () => {
    const user = userEvent.setup();

    render(
      <RestockModal
        isOpen={true}
        onClose={vi.fn()}
        onSubmitRestock={vi.fn()}
      />
    );

    await user.click(
      screen.getByRole("button", {
        name: /submit restock/i,
      })
    );

    expect(
      screen.getByRole("alert")
    ).toHaveTextContent(
      "Restock Quantity is required"
    );
  });

  it("should call onSubmitRestock when form is valid", async () => {
    const user = userEvent.setup();

    const handleSubmit = vi.fn();

    render(
      <RestockModal
        isOpen={true}
        onClose={vi.fn()}
        onSubmitRestock={handleSubmit}
      />
    );

    await user.type(
      screen.getByLabelText(
        /restock quantity/i
      ),
      "30"
    );

    await user.type(
      screen.getByLabelText(
        /restock notes/i
      ),
      "Weekly restock"
    );

    await user.click(
      screen.getByRole("button", {
        name: /submit restock/i,
      })
    );

    expect(handleSubmit).toHaveBeenCalledTimes(1);

    expect(handleSubmit).toHaveBeenCalledWith({
      quantity: 30,
      notes: "Weekly restock",
    });
  });

  it("should call onClose when Cancel is clicked", async () => {
    const user = userEvent.setup();

    const handleClose = vi.fn();

    render(
      <RestockModal
        isOpen={true}
        onClose={handleClose}
        onSubmitRestock={vi.fn()}
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