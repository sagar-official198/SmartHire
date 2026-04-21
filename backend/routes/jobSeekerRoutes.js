import express from "express";
import {
  createOrUpdateProfile,
  getProfile,
  incrementViews,
  incrementClicks,
} from "../controllers/jobseekerController.js";

const router = express.Router();

// ================= PROFILE =================
router.post("/profile", createOrUpdateProfile);
router.get("/profile", getProfile);

// ================= 🔥 SEARCH APPEARANCE =================

// 👁️ Increment profile views
router.post("/views/:id", incrementViews);

// 🖱️ Increment profile clicks (optional but recommended)
router.post("/clicks", incrementClicks);

export default router;