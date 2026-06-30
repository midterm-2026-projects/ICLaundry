import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  describe,
  it,
  expect,
  vi,
} from "vitest";
import InventoryFilters from "../components/InventoryFilters";

describe("InventoryFilters", () => {
  it("should render search textbox", () => {
    render(
      <InventoryFilters
        onSearchChange={vi.fn()}
        onBranchChange={vi.fn()}
      />
    );

    expect(
      screen.getByRole("textbox")
    ).toBeInTheDocument();
  });

  it("should render branch dropdown", () => {
    render(
      <InventoryFilters
        onSearchChange={vi.fn()}
        onBranchChange={vi.fn()}
      />
    );

    expect(
      screen.getByRole("combobox")
    ).toBeInTheDocument();
  });

  it("should render empty search textbox initially", () => {
    render(
      <InventoryFilters
        onSearchChange={vi.fn()}
        onBranchChange={vi.fn()}
      />
    );

    expect(
      screen.getByRole("textbox")
    ).toHaveValue("");
  });

  it("should display all branch options", () => {
    render(
      <InventoryFilters
        onSearchChange={vi.fn()}
        onBranchChange={vi.fn()}
      />
    );

    expect(
      screen.getAllByRole("option")
    ).toHaveLength(4);
  });

  it("should call onSearchChange when user types", async () => {
    const user =
      userEvent.setup();

    const handleSearch =
      vi.fn();

    render(
      <InventoryFilters
        onSearchChange={
          handleSearch
        }
        onBranchChange={vi.fn()}
      />
    );

    const textbox =
      screen.getByRole("textbox");

    await user.type(
      textbox,
      "Ariel"
    );

    expect(handleSearch)
      .toHaveBeenCalled();

    expect(textbox)
      .toHaveValue("Ariel");
  });

  it("should call onBranchChange when user selects a branch", async () => {
    const user =
      userEvent.setup();

    const handleBranch =
      vi.fn();

    render(
      <InventoryFilters
        onSearchChange={vi.fn()}
        onBranchChange={
          handleBranch
        }
      />
    );

    const dropdown =
      screen.getByRole(
        "combobox"
      );

    await user.selectOptions(
      dropdown,
      "Main - Brgy 7"
    );

    expect(handleBranch)
      .toHaveBeenCalledWith(
        "Main - Brgy 7"
      );

    expect(dropdown)
      .toHaveValue(
        "Main - Brgy 7"
      );
  });

  it("should allow user to select Nasugbu branch", async () => {
    const user =
      userEvent.setup();

    render(
      <InventoryFilters
        onSearchChange={vi.fn()}
        onBranchChange={vi.fn()}
      />
    );

    const dropdown =
      screen.getByRole(
        "combobox"
      );

    await user.selectOptions(
      dropdown,
      "3rd Branch - Nasugbu"
    );

    expect(dropdown)
      .toHaveValue(
        "3rd Branch - Nasugbu"
      );
  });

  it("should allow user to search detergent item", async () => {
    const user =
      userEvent.setup();

    render(
      <InventoryFilters
        onSearchChange={vi.fn()}
        onBranchChange={vi.fn()}
      />
    );

    const textbox =
      screen.getByRole("textbox");

    await user.type(
      textbox,
      "Detergent"
    );

    expect(textbox)
      .toHaveValue(
        "Detergent"
      );
  });
});