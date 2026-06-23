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

import CustomerActions from "../components/CustomerActions.jsx";

describe("CustomerActions", () => {
  it("Should display the Add Customer button", () => {
    render(
      <CustomerActions
        setShowModal={vi.fn()}
        setEditing={vi.fn()}
      />
    );

    expect(
      screen.getByRole("button", {
        name: "Add Customer",
      })
    ).toBeInTheDocument();
  });

  it("Should open the Add Customer modal when the button is clicked", () => {
    const setShowModal = vi.fn();
    const setEditing = vi.fn();

    render(
      <CustomerActions
        setShowModal={setShowModal}
        setEditing={setEditing}
      />
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Add Customer",
      })
    );

    expect(setEditing)
      .toHaveBeenCalledWith(false);

    expect(setShowModal)
      .toHaveBeenCalledWith(true);
  });

  it("Should open the Edit Customer modal when the Edit button is clicked", () => {
    const setShowModal = vi.fn();
    const setEditing = vi.fn();

    render(
      <CustomerActions
        setShowModal={setShowModal}
        setEditing={setEditing}
      />
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Edit Customer",
      })
    );

    expect(setEditing)
      .toHaveBeenCalledWith(true);

    expect(setShowModal)
      .toHaveBeenCalledWith(true);
  });

  it("Should trigger Delete action when Delete button is clicked", () => {
    const onDelete = vi.fn();

    render(
      <CustomerActions
        setShowModal={vi.fn()}
        setEditing={vi.fn()}
        onDelete={onDelete}
      />
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Delete",
      })
    );

    expect(onDelete)
      .toHaveBeenCalledTimes(1);
  });
});