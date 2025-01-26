import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });

    res.cookie("jwt", token, {
        httpOnly: true, // ✅ Prevents JavaScript access (more secure)
        secure: true, // ✅ Ensures HTTPS in production
        sameSite: "none", // ✅ Prevents CSRF while allowing frontend requests
        maxAge: 7 * 24 * 60 * 60 * 1000, // ✅ 7 days
    });

    return token;
};
