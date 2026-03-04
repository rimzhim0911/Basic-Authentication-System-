import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    console.log("Incoming Register:", req.body);

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword
    });

    await user.save();

    res.status(201).json({ message: "Registered successfully" });
  } catch (err) {
  console.error("FULL LOGIN ERROR >>>", err);
  res.status(500).json({ message: err.message });
}
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("Incoming Login:", req.body);

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.json({ message: "Login successful", token });
  } catch (err) {
  console.error("FULL REGISTER ERROR >>>", err); // show real error
  res.status(500).json({ message: err.message }); // send real error to frontend
}
});
// VERIFY TOKEN (Protected Route)

import { verifyToken } from "../middleware/verifyToken.js";

router.get("/protected", verifyToken, (req, res) => {
  res.json({ message: "Protected route accessed", user: req.user });
});
router.get("/verify", (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    res.json({ message: "Token valid" });
  } catch (err) {
    res.status(403).json({ message: "Invalid token" });
  }
});

export default router;