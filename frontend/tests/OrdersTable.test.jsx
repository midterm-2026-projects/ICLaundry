import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";

import OrdersTable from "../components/OrdersTable.jsx";

describe("OrdersTable", () => {
  const mockOrders = [
    {
      id: "1",
      order_number: "ORD001",
      customers: {
        name: "Juan Dela Cruz",
        phone: "09171234567",
      },
      weight_kg: 5,
      total_price: 200,
      amount_paid: 100,
      payment_status: "partial",
      payment_method: "cash",
      status: "pending",
      estimated_completion: null,
    },
    {
      id: "2",
      order_number: "ORD002",
      customers: {
        name: "Maria Santos",
        phone: "09999999999",
      },
      weight_kg: 8,
      total_price: 350,
      amount_paid: 350,
      payment_status: "paid",
      payment_method: "gcash",
      status: "ready",
      estimated_completion: null,
    },
  ];

  const renderTable = (orders = mockOrders) =>
    render(
      <OrdersTable
        orders={orders}
        onView={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onStatusChange={vi.fn()}
      />,
    );

  it("should render all table headers", () => {
    renderTable();

    expect(
      screen.getByRole("columnheader", {
        name: /order #/i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("columnheader", {
        name: /customer/i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("columnheader", {
        name: /weight/i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("columnheader", {
        name: /status/i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("columnheader", {
        name: /payment/i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("columnheader", {
        name: /amount/i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("columnheader", {
        name: /completion/i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("columnheader", {
        name: /actions/i,
      }),
    ).toBeInTheDocument();
  });

  it("should render all orders", () => {
    renderTable();

    // 1 header row + 2 order rows
    expect(screen.getAllByRole("row")).toHaveLength(3);
  });

  it("should render order information correctly", () => {
    renderTable();

    expect(screen.getByText("ORD001")).toBeInTheDocument();

    expect(screen.getByText("Juan Dela Cruz")).toBeInTheDocument();

    expect(screen.getByText("5kg")).toBeInTheDocument();

    expect(screen.getByText(/partial/i)).toBeInTheDocument();

    expect(screen.getByText("₱200.00")).toBeInTheDocument();
  });

  it("should display 'No orders found' when empty", () => {
    renderTable([]);

    expect(screen.getByText(/no orders found/i)).toBeInTheDocument();
  });

  it("should call onView when View button is clicked", async () => {
    const user = userEvent.setup();

    const handleView = vi.fn();

    render(
      <OrdersTable
        orders={mockOrders}
        onView={handleView}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onStatusChange={vi.fn()}
      />,
    );

    await user.click(
      screen.getAllByRole("button", {
        name: /view/i,
      })[0],
    );

    expect(handleView).toHaveBeenCalledWith(mockOrders[0]);
  });

  it("should call onEdit when Edit button is clicked", async () => {
    const user = userEvent.setup();

    const handleEdit = vi.fn();

    render(
      <OrdersTable
        orders={mockOrders}
        onView={vi.fn()}
        onEdit={handleEdit}
        onDelete={vi.fn()}
        onStatusChange={vi.fn()}
      />,
    );

    await user.click(
      screen.getAllByRole("button", {
        name: /edit/i,
      })[0],
    );

    expect(handleEdit).toHaveBeenCalledWith(mockOrders[0]);
  });

  it("should call onDelete when Delete button is clicked", async () => {
    const user = userEvent.setup();

    const handleDelete = vi.fn();

    render(
      <OrdersTable
        orders={mockOrders}
        onView={vi.fn()}
        onEdit={vi.fn()}
        onDelete={handleDelete}
        onStatusChange={vi.fn()}
      />,
    );

    await user.click(
      screen.getAllByRole("button", {
        name: /delete/i,
      })[0],
    );

    expect(handleDelete).toHaveBeenCalledWith(mockOrders[0]);
  });

  it("should render one View button per order", () => {
    renderTable();

    expect(
      screen.getAllByRole("button", {
        name: /view/i,
      }),
    ).toHaveLength(2);
  });

  it("should render one Edit button per order", () => {
    renderTable();

    expect(
      screen.getAllByRole("button", {
        name: /edit/i,
      }),
    ).toHaveLength(2);
  });

  it("should render one Delete button per order", () => {
    renderTable();

    expect(
      screen.getAllByRole("button", {
        name: /delete/i,
      }),
    ).toHaveLength(2);
  });
});
