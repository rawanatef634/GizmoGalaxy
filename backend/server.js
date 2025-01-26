import express from "express";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import logger from "./config/logger.js";
import rateLimit from 'express-rate-limit';
import errorMiddleware from "./middleware/errorMiddleware.js";
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";
import cors from "cors";
const app = express();
const PORT = 5000
dotenv.config();
connectDB();
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again after 15 minutes"
})
app.use(cookieParser());
const corsOptions = {
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Origin', 'X-Requested-With', 'Accept', 
  'x-client-key', 'x-client-token', 'x-client-secret', 'Authorization'],
  credentials: true}
  
app.use(cors(corsOptions))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(limiter);
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/carts", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use(errorMiddleware);
app.use((req, res, next) => {
  console.log("Cookies Received:", req.cookies);
  next();
});

logger.info("Server is running on port 3000");

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})
