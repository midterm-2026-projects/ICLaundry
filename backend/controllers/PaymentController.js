import { supabase } from '../config/db.js';
import { createPayment } from '../models/PaymentModel.js';

// ==============================================
// POST /api/payments/initial
// ==============================================
export const initialPayment = async (req, res) => {
  try {
    const { order_id, amount, payment_method } = req.body;

    if (!order_id || !amount || !payment_method) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const payAmount = Number(amount);
    if (isNaN(payAmount) || payAmount <= 0) {
      return res.status(400).json({ success: false, message: "Invalid payment amount" });
    }

    // Hanapin ang order sa Supabase
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("id, total_price, amount_paid, payment_status")
      .eq("id", order_id)
      .single();

    if (orderError || !order) {
      console.log("❌ ORDER FETCH ERROR:", orderError);
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    const total = Number(order.total_price || 0);
    const paidSoFar = Number(order.amount_paid || 0);

    // ✅ TAMANG 50% MINIMUM CHECK — para pumasa sa "rejects very small downpayment"
    const minRequired = total * 0.5;
    if (payAmount < minRequired) {
      return res.status(400).json({ 
        success: false, 
        message: `Minimum downpayment required: ${minRequired}` 
      });
    }

    // Valid payment methods
    const validMethods = ["cash", "gcash", "maya", "bank"];
    if (!validMethods.includes(payment_method.toLowerCase())) {
      return res.status(400).json({ success: false, message: "Invalid payment method" });
    }

    // I-save ang payment
    await createPayment({
      order_id: order_id,
      amount: payAmount,
      payment_method: payment_method,
      payment_date: new Date().toISOString()
    });

    // I-update ang order
    const newPaid = paidSoFar + payAmount;
    const newStatus = newPaid >= total ? "paid" : "partial";

    const { error: updateError } = await supabase
      .from("orders")
      .update({ amount_paid: newPaid, payment_status: newStatus })
      .eq("id", order_id);

    if (updateError) {
      console.log("❌ ORDER UPDATE ERROR:", updateError);
      throw new Error(updateError.message);
    }

    return res.status(201).json({ success: true, data: { paymentStatus: newStatus } });

  } catch (err) {
    console.log("\n❌ FINAL INITIAL ERROR:", err.message, "\n");
    return res.status(400).json({ success: false, message: err.message });
  }
};

// ==============================================
// POST /api/payments/complete
// ==============================================
export const completePayment = async (req, res) => {
  try {
    const { order_id, amount, payment_method } = req.body;

    if (!order_id || !amount || !payment_method) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const payAmount = Number(amount);
    if (isNaN(payAmount) || payAmount <= 0) {
      return res.status(400).json({ success: false, message: "Invalid payment amount" });
    }

    // Hanapin ang order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("id, total_price, amount_paid, payment_status")
      .eq("id", order_id)
      .single();

    if (orderError || !order) {
      console.log("❌ COMPLETE ORDER FETCH ERROR:", orderError);
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    const total = Number(order.total_price || 0);
    const paidSoFar = Number(order.amount_paid || 0);

    // ✅ MAS MATIBAY NA CHECK: Huwag umasa lang sa text status — gamitin ang totoong halaga
    if (paidSoFar >= total) {
      return res.status(400).json({ success: false, message: "Order already fully paid" });
    }

    const remaining = total - paidSoFar;
    if (payAmount > remaining) {
      return res.status(400).json({ success: false, message: `Overpayment not allowed. Remaining: ${remaining}` });
    }

    const validMethods = ["cash", "gcash", "maya", "bank"];
    if (!validMethods.includes(payment_method.toLowerCase())) {
      return res.status(400).json({ success: false, message: "Invalid payment method" });
    }

    // I-save ang payment
    await createPayment({
      order_id: order_id,
      amount: payAmount,
      payment_method: payment_method,
      payment_date: new Date().toISOString()
    });

    // I-update ang order
    const newPaid = paidSoFar + payAmount;
    const newStatus = newPaid >= total ? "paid" : "partial";

    const { error: updateError } = await supabase
      .from("orders")
      .update({ amount_paid: newPaid, payment_status: newStatus })
      .eq("id", order_id);

    if (updateError) {
      console.log("❌ COMPLETE ORDER UPDATE ERROR:", updateError);
      throw new Error(updateError.message);
    }

    // ✅ SIGURADONG 200 ANG IBABALIK KAPAG WALANG ERROR
    return res.status(200).json({ success: true, data: { paymentStatus: newStatus } });

  } catch (err) {
    console.log("\n❌ FINAL COMPLETE ERROR:", err.message, err.stack, "\n");
    return res.status(400).json({ success: false, message: err.message });
  }
};