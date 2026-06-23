import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import BranchFilter from "../components/BranchFilter";

describe("BranchFilter", () => {
  const branches = [
    "All Branches",
    "Ermita, Balayan Branch",
    "Brgy. 7, Balayan Branch",
    "Nasugbu Branch",
  ];

  it.each(branches)("should render %s option", (branch) => {
    render(<BranchFilter />);

    expect(screen.getByText(branch)).toBeInTheDocument();
  });
});