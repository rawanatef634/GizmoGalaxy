import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/User.js";
import { generateToken } from "../utils/createToken.js";

export const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password, role } = req.body;

  if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
  }

  const existingUser = await User.findOne({ email }).select( "+password" );
  if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
  }

  const newUser = new User({ username, email, password, role: role || "customer" });
  await newUser.save();

  // ✅ Generate Token & Set Cookie
  generateToken(newUser._id, res);

  res.status(201).json({ message: "User registered successfully", user: newUser });
});
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user) return res.status(400).json({ message: "User doesn't exist" });

  const isPasswordCorrect = await user.matchPassword(password);
  if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials" });

  generateToken(user._id, res);

  res.status(200).json({
          _id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
  });
});


export const logoutUser = asyncHandler(async (req, res) => {
    res.cookie("jwt", "", { 
      httpOnly: true,
      expires: new Date(0)
    });
    res.status(200).json({ message: "Logged out successfully" });
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
  