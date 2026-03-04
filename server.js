import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import { verifyToken } from "./middleware/verifyToken.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve all files from "static" folder
app.use(express.static("static"));

app.get("/dashboard.html", verifyToken, (req, res) => {
  res.sendFile(path.join(__dirname, "static", "dashboard.html"));
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("MongoDB Error:", err));

// API Routes
app.use("/api/auth", authRoutes);

// Start Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on: http://localhost:${PORT}`);
  console.log(`📊 Dashboard URL: http://localhost:${PORT}/dashboard.html`);
});