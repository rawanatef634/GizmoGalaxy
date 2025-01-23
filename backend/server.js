import express from "express";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import logger from "./config/logger.js";
import rateLimit from 'express-rate-limit';
import errorMiddleware from "./middleware/errorMiddleware.js";
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";
import cors from "cors";
const app = express();
const PORT = 5000
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again after 15 minutes"
})
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(limiter);
dotenv.config();
connectDB();
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/carts", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use(errorMiddleware);


logger.info("Server is running on port 3000");

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})
