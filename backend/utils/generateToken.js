// utils/generateToken.js
import jwt from "jsonwebtoken";

export const generateToken = (user, res, isRefresh = false) => {
    const payload = { _id: user._id, email: user.email, role: user.role };

    // Sign the token based on whether it's an access or refresh token
    const token = jwt.sign(
        payload,
        isRefresh ? process.env.REFRESH_SECRET : process.env.JWT_SECRET,
        { expiresIn: isRefresh ? '30d' : '1d' }
    );

    // If it's a refresh token, set it as a cookie in the response
    if (isRefresh) {
        res.cookie("jwt", token, {
            httpOnly: true,
            secure: true, // Ensure you're using HTTPS in production
            sameSite: "none",
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        });
    }

    return token; // Return the access token for use in login response
};
