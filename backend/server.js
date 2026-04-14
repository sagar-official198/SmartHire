import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import { clerkMiddleware } from "@clerk/express";

import recruiterRoutes from "./routes/recruiterRoutes.js";
import jobSeekerRoutes from "./routes/jobSeekerRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import { socketHandler } from "./socket/socketServer.js";

dotenv.config();

const app = express();

// ================= MIDDLEWARE =================
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(clerkMiddleware());

// ================= TEST ROUTE =================
app.get("/", (req, res) => {
  res.status(200).send("Smart Hire API Running 🚀");
});

// ================= ROUTES =================
app.use("/api/recruiter", recruiterRoutes);
app.use("/api/jobseeker", jobSeekerRoutes);
app.use("/api/messages", messageRoutes);

// ================= INVALID ROUTE =================
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

// ================= DATABASE =================
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("MongoDB Error:", error.message);
    process.exit(1);
  }
};

// ================= SOCKET =================
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

socketHandler(io);

// ================= START =================
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(
      `🚀 Server running on http://localhost:${PORT}`
    );
  });
});