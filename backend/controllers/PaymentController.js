import {
  createInitialPayment,
  completePayment,
} from "../services/PaymentService.js";

/**
 * Create initial payment (50% downpayment)
 */
export const createInitialPaymentController = async (req, res) => {
  try {
    const payment = await createInitialPayment(req.body);

    return res.status(201).json({
      success: true,
      message: "Initial payment recorded successfully.",
      data: payment,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Complete remaining payment
 */
export const completePaymentController = async (req, res) => {
  try {
    const payment = await completePayment(req.body);

    return res.status(200).json({
      success: true,
      message: "Payment completed successfully.",
      data: payment,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
