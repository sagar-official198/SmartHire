import express from "express";
import {
  createOrUpdateProfile,
  getProfile,
} from "../controllers/jobseekerController.js";

const router = express.Router();

router.post("/profile", createOrUpdateProfile);
router.get("/profile", getProfile);

export default router;