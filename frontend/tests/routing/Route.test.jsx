import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

vi.mock("../../src/pages/Orders", () => ({
  default: () => <h1>Orders Page</h1>,
}));

import App from "../../src/App";

describe("Application Navigation", () => {
  describe("Orders Navigation", () => {
    it("should navigate to the Orders page", async () => {
      const user = userEvent.setup();

      render(
        <MemoryRouter initialEntries={["/"]}>
          <App />
        </MemoryRouter>,
      );

      expect(
        screen.getByRole("heading", {
          name: /dashboard/i,
        }),
      ).toBeInTheDocument();

      await user.click(
        screen.getByRole("button", {
          name: /orders/i,
        }),
      );

      expect(
        screen.getByRole("heading", {
          name: /orders page/i,
        }),
      ).toBeInTheDocument();
    });
  });
});
