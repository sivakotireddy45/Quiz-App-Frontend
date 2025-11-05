import express from "express";
import { register, login } from "../controllers/userController.js";

const userRouter = express.Router();

// Register a new user
userRouter.post("/register", register);

// Login user
userRouter.post("/login", login);

// Optional route for debugging
userRouter.get("/", (req, res) => {
  res.send("Auth routes working ✅");
});

export default userRouter;
