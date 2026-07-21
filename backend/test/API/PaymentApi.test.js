import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../../app.js";

/**
 * ==============================================
 * TEST HELPERS — INAYOS PARA HINDI MAGKAGAMIT NG PAREHONG ORDER
 * ==============================================
 */
const getOrders = async () => {
  const response = await request(app).get("/api/orders");
  expect(response.status).toBe(200);
  return response.body.data;
};

const getUnpaidOrder = async () => {
  const orders = await getOrders();
  const order = orders.find((o) => {
    const paid = Number(o.amount_paid || 0);
    const total = Number(o.total_price || 0);
    return paid < total;
  }) || orders[0];
  if (!order) throw new Error("Walang order na makukuha");
  return order;
};

// ✅ INAYOS: Kumuha ng order na HINDI PA BINAYARAN NG BUO — ibang logic sa getUnpaidOrder
const getPartialOrder = async () => {
  const orders = await getOrders();
  // Hanapin ang order na may bayad na pero kulang pa
  let order = orders.find((o) => {
    const paid = Number(o.amount_paid || 0);
    const total = Number(o.total_price || 0);
    return paid > 0 && paid < total;
  });
  // Kung walang ganoon, kumuha ng pinakaunang hindi pa bayad
  if (!order) {
    order = orders.find((o) => {
      const paid = Number(o.amount_paid || 0);
      const total = Number(o.total_price || 0);
      return paid < total;
    }) || orders[0];
  }
  return order;
};

const getPaidOrder = async () => {
  const orders = await getOrders();
  return orders.find((o) => {
    const paid = Number(o.amount_paid || 0);
    const total = Number(o.total_price || 0);
    return paid >= total;
  }) || orders.at(-1);
};

/**
 * ==============================================
 * TEST SUITE
 * ==============================================
 */
describe("Payment API Integration Test", () => {
  describe("POST /api/payments/initial", () => {
    it("should allow customer to create initial downpayment", async () => {
      const order = await getUnpaidOrder();
      const total = Number(order.total_price || order.totalAmount || 200);

      const res = await request(app)
        .post("/api/payments/initial")
        .send({
          order_id: order.id,
          amount: total * 0.5, // ✅ Magbayad lang ng kalahati — hindi buo — para may matira pa sa ibang test
          payment_method: "cash"
        });

      if (res.status >= 400) console.log("❌ INITIAL FAILED:", res.body);
      expect([200, 201]).toContain(res.status);
      expect(res.body.success).toBe(true);
    });

    it.each([{}, { amount: 100, payment_method: "cash" }, { order_id: null, amount: 100, payment_method: "cash" }])(
      "rejects incomplete data %#", async (payload) => {
        const res = await request(app).post("/api/payments/initial").send(payload);
        expect(res.status).toBe(400);
      }
    );

    it("rejects non-existing order", async () => {
      const res = await request(app).post("/api/payments/initial").send({ order_id: "999999", amount: 500, payment_method: "cash" });
      expect([400, 404]).toContain(res.status);
    });

    it.each([0, -100, -1])("rejects invalid amount %s", async (amount) => {
      const order = await getUnpaidOrder();
      const res = await request(app).post("/api/payments/initial").send({ order_id: order.id, amount, payment_method: "cash" });
      expect(res.status).toBe(400);
    });

    it("rejects very small downpayment", async () => {
      const order = await getUnpaidOrder();
      const res = await request(app).post("/api/payments/initial").send({
        order_id: order.id,
        amount: Number(order.total_price || 100) * 0.01,
        payment_method: "cash"
      });
      expect(res.status).toBe(400);
    });
  });

  describe("POST /api/payments/complete", () => {
    it("should allow customer to complete remaining payment", async () => {
      const order = await getPartialOrder();
      const total = Number(order.total_price || order.totalAmount || 200);
      const paidSoFar = Number(order.amount_paid || 0);
      const remaining = total - paidSoFar;

      const res = await request(app)
        .post("/api/payments/complete")
        .send({
          order_id: order.id,
          amount: remaining, // ✅ Ipadala lang ang EKSATONG KULANG — hindi buong total
          payment_method: "cash"
        });

      if (res.status >= 400) console.log("❌ COMPLETE FAILED:", res.body);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      const finalStatus = String(
        res.body.data?.paymentStatus || res.body.data?.payment_status || ""
      ).toLowerCase();
      expect(finalStatus).toBe("paid");
    });

    it("rejects without order id", async () => {
      const res = await request(app).post("/api/payments/complete").send({ amount: 500, payment_method: "cash" });
      expect(res.status).toBe(400);
    });

    it("rejects negative amount", async () => {
      const order = await getPartialOrder();
      const res = await request(app).post("/api/payments/complete").send({ order_id: order.id, amount: -500, payment_method: "cash" });
      expect(res.status).toBe(400);
    });

    it("rejects overpaying", async () => {
      const order = await getPartialOrder();
      const total = Number(order.total_price || 100);
      const paidSoFar = Number(order.amount_paid || 0);
      const res = await request(app).post("/api/payments/complete").send({
        order_id: order.id,
        amount: (total - paidSoFar) + 1000, // ✅ Siguradong sobra sa kulang
        payment_method: "cash"
      });
      expect(res.status).toBe(400);
    });

    it("rejects paying already paid order", async () => {
      const order = await getPaidOrder();
      const res = await request(app).post("/api/payments/complete").send({ order_id: order.id, amount: 500, payment_method: "cash" });
      expect(res.status).toBe(400);
    });
  });

  describe("Payment method validation", () => {
    it.each(["", null, "invalid_method"])("rejects invalid method %s", async (method) => {
      const order = await getUnpaidOrder();
      const res = await request(app).post("/api/payments/initial").send({ order_id: order.id, amount: 500, payment_method: method });
      expect(res.status).toBe(400);
    });
  });
});