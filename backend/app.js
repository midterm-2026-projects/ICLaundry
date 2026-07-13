import express from "express";
import cors from "cors";

import orderRoutes from "./routes/OrderRoutes.js";
import paymentRoutes from "./routes/PaymentRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);

export default app;
