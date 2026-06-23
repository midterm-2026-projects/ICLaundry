import {
  fireEvent,
  render,
  screen,
} from "@testing-library/react";

import {
  describe,
  expect,
  it,
  vi,
} from "vitest";

import CustomerModal from "../components/CustomerModal.jsx";

describe("CustomerModal", () => {
  it("Should display Full Name, Phone Number, Email, and Notes fields inside the modal", () => {
    render(
      <CustomerModal editing={false} />
    );

    expect(
      screen.getByLabelText("Full Name")
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText("Phone Number")
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText("Email")
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText("Notes")
    ).toBeInTheDocument();
  });

  it("Should pass customer data when Add Customer button is clicked", () => {
    const onAddCustomer = vi.fn();

    render(
      <CustomerModal
        editing={false}
        onAddCustomer={onAddCustomer}
      />
    );

    fireEvent.change(
      screen.getByLabelText("Full Name"),
      {
        target: {
          value: "Juan Dela Cruz",
        },
      }
    );

    fireEvent.change(
      screen.getByLabelText("Phone Number"),
      {
        target: {
          value: "09171234567",
        },
      }
    );

    fireEvent.change(
      screen.getByLabelText("Email"),
      {
        target: {
          value: "juan@gmail.com",
        },
      }
    );

    fireEvent.change(
      screen.getByLabelText("Notes"),
      {
        target: {
          value: "VIP Customer",
        },
      }
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Add Customer",
      })
    );

    expect(onAddCustomer)
      .toHaveBeenCalledWith({
        fullName: "Juan Dela Cruz",
        phone: "09171234567",
        email: "juan@gmail.com",
        notes: "VIP Customer",
      });
  });

  it("Should pass customer data when Update button is clicked", () => {
    const onUpdate = vi.fn();

    render(
      <CustomerModal
        editing
        onUpdate={onUpdate}
      />
    );

    fireEvent.change(
      screen.getByLabelText("Full Name"),
      {
        target: {
          value: "Updated Name",
        },
      }
    );

    fireEvent.change(
      screen.getByLabelText("Phone Number"),
      {
        target: {
          value: "09999999999",
        },
      }
    );

    fireEvent.change(
      screen.getByLabelText("Email"),
      {
        target: {
          value: "updated@gmail.com",
        },
      }
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Update",
      })
    );

    expect(onUpdate)
      .toHaveBeenCalledWith({
        fullName: "Updated Name",
        phone: "09999999999",
        email: "updated@gmail.com",
        notes: "",
      });
  });

  it("Should prevent submission when required fields are empty", () => {
    render(
      <CustomerModal editing={false} />
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Add Customer",
      })
    );

    expect(
      screen.getByText(
        "Full Name, Phone Number, and Email are required."
      )
    ).toBeInTheDocument();
  });
});