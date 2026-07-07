// backend/models/OrderModel.js
import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  orderDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ["pending", "completed", "cancelled"],
    default: "completed"
  }
});

export default mongoose.model("Order", OrderSchema);