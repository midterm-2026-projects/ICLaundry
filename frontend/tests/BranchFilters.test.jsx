import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  describe,
  it,
  expect,
  vi,
} from "vitest";
import BranchFilter from "../components/BranchFilters";

describe("BranchFilter", () => {
  it("should render branch dropdown", () => {
    // Arrange
    render(
      <BranchFilter
        onBranchChange={vi.fn()}
      />
    );

    // Act
    const dropdown =
      screen.getByRole(
        "combobox"
      );

    // Assert
    expect(dropdown)
      .toBeInTheDocument();
  });

  it("should display all branch options", () => {
    // Arrange
    render(
      <BranchFilter
        onBranchChange={vi.fn()}
      />
    );

    // Act
    const options =
      screen.getAllByRole(
        "option"
      );

    // Assert
    expect(options)
      .toHaveLength(4);
  });

  it("should call onBranchChange when user selects a branch", async () => {
    // Arrange
    const user =
      userEvent.setup();

    const handleBranch =
      vi.fn();

    render(
      <BranchFilter
        onBranchChange={
          handleBranch
        }
      />
    );

    const dropdown =
      screen.getByRole(
        "combobox"
      );

    // Act
    await user.selectOptions(
      dropdown,
      "Main - Brgy 7"
    );

    // Assert
    expect(handleBranch)
      .toHaveBeenCalledWith(
        "Main - Brgy 7"
      );
  });

  it("should allow user to select Nasugbu branch", async () => {
    // Arrange
    const user =
      userEvent.setup();

    render(
      <BranchFilter
        onBranchChange={vi.fn()}
      />
    );

    const dropdown =
      screen.getByRole(
        "combobox"
      );

    // Act
    await user.selectOptions(
      dropdown,
      "3rd Branch - Nasugbu"
    );

    // Assert
    expect(
      dropdown
    ).toHaveValue(
      "3rd Branch - Nasugbu"
    );
  });
});