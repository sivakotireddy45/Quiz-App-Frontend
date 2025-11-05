import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

export async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    // 1️⃣ Check for token presence
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No token provided",
      });
    }

    // 2️⃣ Extract token
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Token missing",
      });
    }

    // 3️⃣ Verify token
    const payload = jwt.verify(token, JWT_SECRET);

    // 4️⃣ Find user (minus password)
    const user = await User.findById(payload.id).select("-password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User not found",
      });
    }

    // 5️⃣ Attach user to request object
    req.user = user;
    next();
  } catch (err) {
    console.error("JWT Verification Failed:", err);
    return res.status(401).json({
      success: false,
      message: "Unauthorized: Invalid or expired token",
    });
  }
}
