import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";
import logger from '../config/logger.js'
export const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body

    if (!username || !email || !password) {
        return res.status(400).json({ message: "All fields are required"})
    }
    try {
        const existingUser = await User.findOne({ email})
        if (existingUser) {
            return res.status(400).json({ message: "User already exists"})
        }
        const newUser = new User({
            username,
            email,
            password,
            role: 'customer'}) 
        await newUser.save()
        res.status(201).json({ message: "User registered successfully"})
    } catch (error) {
      res.status(400);
      throw new Error("Invalid user data");
    }
})

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  try {
      const existingUser = await User.findOne({ email }).select('+password');
      if (!existingUser) {
          return res.status(400).json({ message: "User doesn't exist" });
      }

      // Check if the password matches
      const isPasswordCorrect = await existingUser.matchPassword(password);
      if (!isPasswordCorrect) {
          return res.status(400).json({ message: "Invalid credentials" });
      }
      console.log(existingUser.password)
      console.log(isPasswordCorrect)
      // Generate tokens
      const accessToken = generateToken(existingUser, res, false); // Access token (sent to user)
      generateToken(existingUser, res, true); // Refresh token (stored in cookie)

      // Log token for debugging purposes
      logger.info(`Access Token: ${accessToken}`);

      res.status(200).json({
          message: "User logged in successfully",
          accessToken, // Return access token here
      });
  } catch (error) {
      res.status(400);
      throw new Error("Invalid user data");
  }
});


export const logoutUser = asyncHandler(async(req, res) => {
    res.cookie('refreshToken', '', { maxAge: 0 });
    res.status(200).json({ message: 'Logged out successfully' });
});

export const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find({});
    res.json(users);
});
  
export const getCurrentUserProfile = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (user) {
      res.status(200).json({
        userId,
        username,
        email
      });
    } else {
      res.status(404);
      throw new Error("User not found.");
    }
});
  
export const updateCurrentUserProfile = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const user = await User.findById(userId);
  
    if (user) {
      user.username = req.body.username || user.username;
      user.email = req.body.email || user.email;
  
      if (req.body.password) {
        user.password = req.body.password;
      }
  
      const updatedUser = await user.save();
  
      res.json({
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
      });
    } else {
      res.status(404);
      throw new Error("User not found.");     
    }
});
  
export const deleteUserById = asyncHandler(async (req, res) => {
    const userId = req.params.id;
    const user = await User.findById(userId);
  
    if (user) {
      if (user.isAdmin) {
        res.status(400);
        throw new Error("Cannot delete admin user");
      }
  
      await User.deleteOne({ _id: userId });
      res.status(200).json({ message: "User removed" });
    } else {
      res.status(404);
      throw new Error("User not found.");
    
    }
});
  
export const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select("-password");
  
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404);
      throw new Error("User not found.");
    }
});
  
export const updateUserById = asyncHandler(async (req, res) => {
    const userId = req.params.id;
    const user = await User.findById(userId);
  
    if (user) {
      user.username = req.body.username || user.username;
      user.email = req.body.email || user.email;
      user.isAdmin = Boolean(req.body.isAdmin);
  
      const updatedUser = await user.save();
  
      res.status(200).json({
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
      });
    } else {
      res.status(404);
      throw new Error("User not found.");
    }
});
  