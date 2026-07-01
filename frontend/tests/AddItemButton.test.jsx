import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  describe,
  it,
  expect,
  vi,
} from "vitest";

import AddItemButton from "../components/AddItemButton";

describe("AddItemButton", () => {
  it("should render Add Item button", () => {
    render(
      <AddItemButton
        onAddItem={vi.fn()}
      />
    );

    expect(
      screen.getByRole("button", {
        name: /add item/i,
      })
    ).toBeInTheDocument();
  });

  it("should call onAddItem when clicked", async () => {
    const user = userEvent.setup();

    const handleAddItem = vi.fn();

    render(
      <AddItemButton
        onAddItem={handleAddItem}
      />
    );

    await user.click(
      screen.getByRole("button", {
        name: /add item/i,
      })
    );

    expect(handleAddItem)
      .toHaveBeenCalledTimes(1);
  });

  it("should render only one Add Item button", () => {
    render(
      <AddItemButton
        onAddItem={vi.fn()}
      />
    );

    expect(
      screen.getAllByRole("button", {
        name: /add item/i,
      })
    ).toHaveLength(1);
  });

  it("should render a disabled button", () => {
    render(
      <AddItemButton
        onAddItem={vi.fn()}
        disabled
      />
    );

    expect(
      screen.getByRole("button", {
        name: /add item/i,
      })
    ).toBeDisabled();
  });

  it("should not call onAddItem when button is disabled", async () => {
    const user = userEvent.setup();

    const handleAddItem = vi.fn();

    render(
      <AddItemButton
        onAddItem={handleAddItem}
        disabled
      />
    );

    await user.click(
      screen.getByRole("button", {
        name: /add item/i,
      })
    );

    expect(handleAddItem)
      .not.toHaveBeenCalled();
  });
});