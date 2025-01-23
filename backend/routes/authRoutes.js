import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUserProfile,
  updateCurrentUserProfile,
  deleteUserById,
  getUserById,
  updateUserById,
} from "../controllers/authController.js";

import { authenticate, authorizeAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public Routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

// Protected Routes for User Profile
router
  .route("/profile")
  .get(authenticate, getCurrentUserProfile) // Only authenticated users can access their profile
  .put(authenticate, updateCurrentUserProfile); // Only authenticated users can update their profile

// ADMIN ROUTES (Authenticated & Admin only)
// router
//   .route("/")
//   .get(authenticate, authorizeAdmin, getAllUsers); // Admin route to get all users

router
  .route("/:id")
  .delete(authenticate, authorizeAdmin, deleteUserById) // Admin route to delete user
  .get(authenticate, authorizeAdmin, getUserById) // Admin route to get user by ID
  .put(authenticate, authorizeAdmin, updateUserById); // Admin route to update user by ID

export default router;
