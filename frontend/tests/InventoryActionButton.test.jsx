import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  describe,
  it,
  expect,
  vi,
} from "vitest";

import InventoryActionButton from "../components/InventoryActionButton";

describe("InventoryActionButton", () => {
  it("should render Save Item button", () => {
    render(
      <InventoryActionButton
        label="Save Item"
        onClick={vi.fn()}
      />
    );

    expect(
      screen.getByRole("button", {
        name: /save item/i,
      })
    ).toBeInTheDocument();
  });

  it("should render Update Item button", () => {
    render(
      <InventoryActionButton
        label="Update Item"
        onClick={vi.fn()}
      />
    );

    expect(
      screen.getByRole("button", {
        name: /update item/i,
      })
    ).toBeInTheDocument();
  });

  it("should render Submit Restock button", () => {
    render(
      <InventoryActionButton
        label="Submit Restock"
        onClick={vi.fn()}
      />
    );

    expect(
      screen.getByRole("button", {
        name: /submit restock/i,
      })
    ).toBeInTheDocument();
  });

  it("should call onClick when Save Item is clicked", async () => {
    const user = userEvent.setup();

    const handleClick = vi.fn();

    render(
      <InventoryActionButton
        label="Save Item"
        onClick={handleClick}
      />
    );

    await user.click(
      screen.getByRole("button", {
        name: /save item/i,
      })
    );

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("should call onClick when Update Item is clicked", async () => {
    const user = userEvent.setup();

    const handleClick = vi.fn();

    render(
      <InventoryActionButton
        label="Update Item"
        onClick={handleClick}
      />
    );

    await user.click(
      screen.getByRole("button", {
        name: /update item/i,
      })
    );

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("should call onClick when Submit Restock is clicked", async () => {
    const user = userEvent.setup();

    const handleClick = vi.fn();

    render(
      <InventoryActionButton
        label="Submit Restock"
        onClick={handleClick}
      />
    );

    await user.click(
      screen.getByRole("button", {
        name: /submit restock/i,
      })
    );

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("should render a disabled button", () => {
    render(
      <InventoryActionButton
        label="Save Item"
        onClick={vi.fn()}
        disabled
      />
    );

    expect(
      screen.getByRole("button", {
        name: /save item/i,
      })
    ).toBeDisabled();
  });

  it("should render only one button", () => {
    render(
      <InventoryActionButton
        label="Save Item"
        onClick={vi.fn()}
      />
    );

    expect(
      screen.getAllByRole("button")
    ).toHaveLength(1);
  });
});
