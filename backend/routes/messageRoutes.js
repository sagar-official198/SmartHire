import express from "express";
import {
  sendMessage,
  getMessages,
  getChatHistory,
  sendEmail,
} from "../controllers/messageController.js";

import jwt from "jsonwebtoken";
import Recruiter from "../models/Recruiter.js";
import JobSeeker from "../models/JobSeeker.js";

const router = express.Router();

// ================= FINAL AUTH =================
const authBoth = async (req, res, next) => {
  try {
    const token =
      req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token missing",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const recruiter =
      await Recruiter.findById(decoded.id);

    if (recruiter) {
      req.recruiter = recruiter;
      return next();
    }

    const jobSeeker =
      await JobSeeker.findById(decoded.id);

    if (jobSeeker) {
      req.jobSeeker = jobSeeker;
      return next();
    }

    return res.status(401).json({
      success: false,
      message: "User not found",
    });
  } catch (error) {
    console.error("AUTH ERROR:", error);

    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};

router.post("/send", authBoth, sendMessage);
router.get("/history", authBoth, getChatHistory);
router.get("/:receiverId", authBoth, getMessages);
router.post("/send-email", authBoth, sendEmail);

export default router;