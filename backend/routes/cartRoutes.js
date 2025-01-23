import express from "express";
import { addToCart, getCart, removeFromCart, clearCart, updateToCart } from "../controllers/cartController.js";
import { authenticate, authorizeAdmin } from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/add", authenticate, addToCart);
router.get("/", authenticate, getCart);
router.delete("/remove", authenticate, removeFromCart);
router.put("/update", authenticate, updateToCart);
router.delete("/clear", authenticate, clearCart);

export default router;