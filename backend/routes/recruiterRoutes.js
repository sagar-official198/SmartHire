import express from "express";
import Recruiter from "../models/Recruiter.js";

import {
  registerRecruiter,
  loginRecruiter,
  getRecruiterProfile,
  getDashboardData,
  searchRankedCandidates,
} from "../controllers/recruiterController.js";

import verifyRecruiter from "../middleware/recruiterAuth.js";

const router = express.Router();

// ================= PUBLIC ROUTES =================
router.post("/register", registerRecruiter);
router.post("/login", loginRecruiter);

// ================= TEST ROUTE =================
router.get("/all", async (req, res) => {
  const data = await Recruiter.find().select("-password");
  res.json(data);
});

// ================= PROTECTED ROUTES =================
router.get("/profile", verifyRecruiter, getRecruiterProfile);
router.get("/dashboard", verifyRecruiter, getDashboardData);

router.post(
  "/search-candidates",
  verifyRecruiter,
  searchRankedCandidates
);

export default router;