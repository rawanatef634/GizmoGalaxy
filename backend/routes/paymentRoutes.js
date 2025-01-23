import express from 'express';
import { createPaymentIntent, verifyPayment } from '../controllers/paymentController.js';
import { authenticate, authorizeAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post('/create', authenticate, createPaymentIntent); // Create payment intent
router.post('/verify', verifyPayment); // Verify payment through Stripe webhook

export default router;
