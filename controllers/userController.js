import mongoose from "mongoose";
import User from "../models/userModel.js";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const TOKEN_EXPIRES_IN = "24h";
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

// ✅ Register a new user
export async function register(req, res) {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email",
      });
    }

    // Check if user exists
    const exists = await User.findOne({ email }).lean();
    if (exists) {
      return res.status(409).json({
        success: false,
        message: "Email already in use",
      });
    }

    // Create new user
    const newId = new mongoose.Types.ObjectId();
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      _id: newId,
      name,
      email,
      password: hashedPassword,
    });
    await user.save();

    // Generate token
    const token = jwt.sign({ id: newId.toString() }, JWT_SECRET, {
      expiresIn: TOKEN_EXPIRES_IN,
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Register error: ", err);
    return res.status(500).json({
      success: false,
      message: "Server error during registration",
    });
  }
}

// ✅ Login a user
export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate token
    const token = jwt.sign({ id: user._id.toString() }, JWT_SECRET, {
      expiresIn: TOKEN_EXPIRES_IN,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Login error: ", err);
    return res.status(500).json({
      success: false,
      message: "Server error during login",
    });
  }
}
