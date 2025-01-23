import jwt from "jsonwebtoken";
import User from "../models/User.js";
import asyncHandler from "./asyncHandler.js";

const authenticate = asyncHandler(async (req, res, next) => {
  console.log("Cookies: ", req.cookies); // Log the cookies
  let token = req.cookies.jwt;

  if (token) {
      try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          req.user = await User.findById(decoded._id).select("-password");
          next();
      } catch (error) {
          res.status(401);
          throw new Error("Not authorized, token failed.");
      }
  } else {
      res.status(401);
      throw new Error("Not authorized, no token.");
  }
});


const authorizeAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ message: "Access denied. Admins only." });
  }
};

export { authenticate, authorizeAdmin };
