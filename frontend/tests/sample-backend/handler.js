import { http, HttpResponse } from "msw";

export const handlers = [
  /**
   * ===============================
   * GET ORDER
   * ===============================
   */
  http.get("http://localhost:3000/api/orders/:id", ({ params }) => {
    return HttpResponse.json({
      success: true,
      data: {
        id: params.id,
        total_price: 500,
        payment_status: "unpaid",
        status: "Pending",
        estimated_completion: "2 Hours",
      },
    });
  }),

  /**
   * ===============================
   * INITIAL PAYMENT
   * ===============================
   */
  http.post(
    "http://localhost:3000/api/payments/initial",
    async ({ request }) => {
      const body = await request.json();

      return HttpResponse.json(
        {
          success: true,
          data: body,
        },
        {
          status: 201,
        },
      );
    },
  ),

  /**
   * ===============================
   * COMPLETE PAYMENT
   * ===============================
   */
  http.post(
    "http://localhost:3000/api/payments/complete",
    async ({ request }) => {
      const body = await request.json();

      return HttpResponse.json({
        success: true,
        data: {
          ...body,
          paymentStatus: "paid",
        },
      });
    },
  ),
];
