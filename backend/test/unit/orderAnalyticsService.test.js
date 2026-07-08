import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import * as orderModel from "../../models/OrderModel.js";

import {
  getAnalytics,
  getWeeklyAnalytics,
  getMonthlyAnalytics,
  getYearlyAnalytics,
} from "../../services/orderAnalyticsService.js";

vi.mock("../../models/OrderModel.js", () => {
  const initialOrders = [
    {
      id: 1,
      orderDate: new Date("2026-07-06"),
      totalAmount: 400,
      status: "Completed",
    },
    {
      id: 2,
      orderDate: new Date("2026-07-07"),
      totalAmount: 110,
      status: "Completed",
    },
    {
      id: 3,
      orderDate: new Date("2026-07-08"),
      totalAmount: 260,
      status: "Completed",
    },
  ];

  let orders = [];

  const resetOrders = (newOrders = initialOrders) => {
    orders = structuredClone(newOrders);
  };

  resetOrders();

  return {
    resetOrders,

    getOrders: vi.fn(() => orders),
  };
});

describe("Order Analytics Service", () => {
  beforeEach(() => {
    orderModel.resetOrders();
    vi.clearAllMocks();
  });

  describe("Analytics", () => {
    it("should throw an error for an invalid analytics period", () => {
      // Arrange

      // Act
      const result = () =>
        getAnalytics("invalid");

      // Assert
      expect(result).toThrow(
        /Unknown analytics period/i
      );
    });

    it("should return weekly analytics", () => {
      // Act
      const result =
        getWeeklyAnalytics();

      // Assert
      expect(result.labels).toEqual([
        "Mon",
        "Tue",
        "Wed",
        "Thu",
        "Fri",
        "Sat",
        "Sun",
      ]);

      expect(result.orders).toEqual([
        1,
        1,
        1,
        0,
        0,
        0,
        0,
      ]);

      expect(result.revenue).toEqual([
        400,
        110,
        260,
        0,
        0,
        0,
        0,
      ]);
    });

    it("should return monthly analytics", () => {
      // Arrange
      orderModel.resetOrders([
        {
          id: 1,
          orderDate: new Date("2026-01-10"),
          totalAmount: 8000,
          status: "Completed",
        },
        {
          id: 2,
          orderDate: new Date("2026-02-12"),
          totalAmount: 9500,
          status: "Completed",
        },
      ]);

      // Act
      const result =
        getMonthlyAnalytics();

      // Assert
      expect(result.orders).toEqual([
        1,
        1,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
      ]);

      expect(result.revenue).toEqual([
        8000,
        9500,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
      ]);
    });

    it("should return yearly analytics", () => {
      // Arrange
      const currentYear =
        new Date().getFullYear();

      orderModel.resetOrders([
        {
          id: 1,
          orderDate: new Date(
            `${currentYear - 1}-05-10`
          ),
          totalAmount: 60000,
          status: "Completed",
        },
        {
          id: 2,
          orderDate: new Date(
            `${currentYear}-05-10`
          ),
          totalAmount: 112000,
          status: "Completed",
        },
      ]);

      // Act
      const result =
        getYearlyAnalytics();

      // Assert
      expect(result.labels).toContain(
        String(currentYear - 1)
      );

      expect(result.labels).toContain(
        String(currentYear)
      );

      expect(result.revenue).toContain(
        60000
      );

      expect(result.revenue).toContain(
        112000
      );
    });

    it("should ignore orders that are not completed", () => {
      // Arrange
      orderModel.resetOrders([
        {
          id: 1,
          orderDate: new Date("2026-01-10"),
          totalAmount: 300,
          status: "Pending",
        },
        {
          id: 2,
          orderDate: new Date("2026-01-11"),
          totalAmount: 700,
          status: "Completed",
        },
      ]);

      // Act
      const result =
        getMonthlyAnalytics();

      // Assert
      expect(result.orders[0]).toBe(1);
      expect(result.revenue[0]).toBe(700);
    });
  });
});