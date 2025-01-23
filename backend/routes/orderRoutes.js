import express from "express";
import { createOrder, getOrders, updateOrderStatus, verifyPayment, refundOrder, deleteOrder } from "../controllers/orderController.js";
import { authenticate, authorizeAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/user", authenticate, createOrder);
router.get("/admin", authenticate, authorizeAdmin, getOrders);
router.put("/:id/status", authenticate, authorizeAdmin, updateOrderStatus);
router.post("/verify-payment", authenticate, verifyPayment);
router.post("/:id/refund", authenticate, authorizeAdmin, refundOrder);
router.delete("/:id", authenticate, authorizeAdmin, deleteOrder);

export default router;