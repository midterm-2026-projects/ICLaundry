// backend/test/unit/orderAnalyticsService.test.js
import { describe, it, expect, vi, beforeEach } from "vitest";
import Order from "../../models/OrderModel.js";
import { getAnalytics, getWeeklyAnalytics, getMonthlyAnalytics, getYearlyAnalytics } from "../../services/orderAnalyticsService.js";

// Mock ang Order model
vi.mock("../../models/OrderModel.js", () => ({
  default: {
    aggregate: vi.fn()
  }
}));

describe("Analytics Service (Backend Unit Tests)", () => {
  beforeEach(() => {
    vi.clearAllMocks(); // Linisin ang mock bago ang bawat test
  });

  it("throws error for invalid period", async () => {
    await expect(getAnalytics("invalid")).rejects.toThrow("Unknown analytics period");
  });

  it("returns correct weekly analytics format", async () => {
    Order.aggregate.mockResolvedValue([
      { _id: 2, count: 4, total: 400 }, // Monday
      { _id: 3, count: 1, total: 110 }, // Tuesday
      { _id: 4, count: 2, total: 260 }, // Wednesday
    ]);

    const res = await getWeeklyAnalytics();
    
    expect(res.labels).toEqual(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]);
    expect(res.orders).toHaveLength(7);
    expect(res.revenue).toHaveLength(7);
    expect(res.orders[0]).toBe(4); // Monday
  });

  it("returns correct monthly analytics format", async () => {
    Order.aggregate.mockResolvedValue([
      { _id: 1, count: 20, total: 8000 },
      { _id: 2, count: 25, total: 9500 },
    ]);

    const res = await getMonthlyAnalytics();
    
    expect(res.labels[0]).toBe("Jan");
    expect(res.labels[1]).toBe("Feb");
    expect(res.orders[0]).toBe(20);
    expect(res.revenue[0]).toBe(8000);
  });

  it("returns correct yearly analytics format", async () => {
    Order.aggregate.mockResolvedValue([
      { _id: 2024, count: 150, total: 60000 },
      { _id: 2025, count: 280, total: 112000 },
    ]);

    const res = await getYearlyAnalytics();
    
    expect(res.labels).toContain("2024");
    expect(res.orders).toContain(150);
    expect(res.revenue).toContain(60000);
  });
});