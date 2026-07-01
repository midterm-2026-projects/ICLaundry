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
    // Arrange
    render(
      <RestockModal
        isOpen={false}
        onClose={vi.fn()}
        onSubmitRestock={vi.fn()}
      />
    );

    // Act
    const modal = screen.queryByText(
      /restock item/i
    );

    // Assert
    expect(modal)
      .not.toBeInTheDocument();
  });

  it("should render when opened", () => {
    // Arrange
    render(
      <RestockModal
        isOpen={true}
        onClose={vi.fn()}
        onSubmitRestock={vi.fn()}
      />
    );

    // Act
    const heading =
      screen.getByRole("heading", {
        name: /restock item/i,
      });

    // Assert
    expect(heading)
      .toBeInTheDocument();
  });

  it("should display all restock fields", () => {
    // Arrange
    render(
      <RestockModal
        isOpen={true}
        onClose={vi.fn()}
        onSubmitRestock={vi.fn()}
      />
    );

    // Assert
    expect(
      screen.getByLabelText(
        /restock quantity/i
      )
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText(
        /restock notes/i
      )
    ).toBeInTheDocument();
  });

  it("should display Submit Restock button", () => {
    // Arrange
    render(
      <RestockModal
        isOpen={true}
        onClose={vi.fn()}
        onSubmitRestock={vi.fn()}
      />
    );

    // Assert
    expect(
      screen.getByRole("button", {
        name: /submit restock/i,
      })
    ).toBeInTheDocument();
  });

  it("should display Cancel button", () => {
    // Arrange
    render(
      <RestockModal
        isOpen={true}
        onClose={vi.fn()}
        onSubmitRestock={vi.fn()}
      />
    );

    // Assert
    expect(
      screen.getByRole("button", {
        name: /cancel/i,
      })
    ).toBeInTheDocument();
  });

  it("should allow user to enter restock information", async () => {
    // Arrange
    const user =
      userEvent.setup();

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

    const notes =
      screen.getByLabelText(
        /restock notes/i
      );

    // Act
    await user.type(
      quantity,
      "30"
    );

    await user.type(
      notes,
      "Weekly supplier delivery"
    );

    // Assert
    expect(quantity)
      .toHaveValue(30);

    expect(notes)
      .toHaveValue(
        "Weekly supplier delivery"
      );
  });

  it("should show validation message when quantity is empty", async () => {
    // Arrange
    const user =
      userEvent.setup();

    render(
      <RestockModal
        isOpen={true}
        onClose={vi.fn()}
        onSubmitRestock={vi.fn()}
      />
    );

    // Act
    await user.click(
      screen.getByRole(
        "button",
        {
          name:
            /submit restock/i,
        }
      )
    );

    // Assert
    expect(
      screen.getByRole(
        "alert"
      )
    ).toHaveTextContent(
      "Restock Quantity is required"
    );
  });

  it("should call onSubmitRestock with complete restock data", async () => {
    // Arrange
    const user =
      userEvent.setup();

    const handleSubmit =
      vi.fn();

    render(
      <RestockModal
        isOpen={true}
        onClose={vi.fn()}
        onSubmitRestock={
          handleSubmit
        }
      />
    );

    // Act
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
      "Weekly supplier delivery"
    );

    await user.click(
      screen.getByRole(
        "button",
        {
          name:
            /submit restock/i,
        }
      )
    );

    // Assert
    expect(handleSubmit)
      .toHaveBeenCalledWith({
        quantity: 30,
        notes:
          "Weekly supplier delivery",
      });
  });

  it("should call onClose after successful restock", async () => {
    // Arrange
    const user =
      userEvent.setup();

    const handleClose =
      vi.fn();

    render(
      <RestockModal
        isOpen={true}
        onClose={
          handleClose
        }
        onSubmitRestock={vi.fn()}
      />
    );

    // Act
    await user.type(
      screen.getByLabelText(
        /restock quantity/i
      ),
      "15"
    );

    await user.click(
      screen.getByRole(
        "button",
        {
          name:
            /submit restock/i,
        }
      )
    );

    // Assert
    expect(handleClose)
      .toHaveBeenCalledWith();
  });

  it("should call onClose when Cancel button is clicked", async () => {
    // Arrange
    const user =
      userEvent.setup();

    const handleClose =
      vi.fn();

    render(
      <RestockModal
        isOpen={true}
        onClose={
          handleClose
        }
        onSubmitRestock={vi.fn()}
      />
    );

    const cancelButton =
      screen.getByRole(
        "button",
        {
          name: /cancel/i,
        }
      );

    // Act
    await user.click(
      cancelButton
    );

    // Assert
    expect(handleClose)
      .toHaveBeenCalledWith();
  });
});