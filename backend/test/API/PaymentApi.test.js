import { describe, it, expect } from "vitest";
import request from "supertest";

import app from "../../app.js";

describe("Payment API Integration Test", () => {
  describe("POST /api/payments/initial", () => {
    it("should create an initial payment", async () => {
      // Retrieve an existing order
      const ordersResponse = await request(app).get("/api/orders");

      expect(ordersResponse.status).toBe(200);

      expect(ordersResponse.body.data.length).toBeGreaterThan(0);

      const order = ordersResponse.body.data[0];

      const minimumDownpayment = Number(order.total_price) * 0.5;

      const response = await request(app).post("/api/payments/initial").send({
        order_id: order.id,
        amount: minimumDownpayment,
        payment_method: "cash",
      });

      if (response.status !== 201) {
        console.log(response.body);
      }

      expect(response.status).toBe(201);

      expect(response.body.success).toBe(true);

      expect(response.body.data).toBeDefined();
    });
  });

  describe("POST /api/payments/complete", () => {
    it("should complete the payment", async () => {
      // Retrieve an existing order
      const ordersResponse = await request(app).get("/api/orders");

      expect(ordersResponse.status).toBe(200);

      expect(ordersResponse.body.data.length).toBeGreaterThan(0);

      const order = ordersResponse.body.data[0];

      const remainingBalance =
        Number(order.total_price) - Number(order.amount_paid);

      const response = await request(app).post("/api/payments/complete").send({
        order_id: order.id,
        amount: remainingBalance,
        payment_method: "cash",
      });

      if (response.status !== 200) {
        console.log(response.body);
      }

      expect(response.status).toBe(200);

      expect(response.body.success).toBe(true);

      expect(response.body.data.paymentStatus).toBe("paid");
    });
  });
});
