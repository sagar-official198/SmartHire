import jwt from "jsonwebtoken";
import { getAuth } from "@clerk/express";

import Recruiter from "../models/Recruiter.js";
import JobSeeker from "../models/JobSeeker.js";

const JWT_SECRET =
  process.env.JWT_SECRET || "secret123";

const verifyUser = async (req, res, next) => {
  try {
    // ================= RECRUITER CHECK =================
    const authHeader =
      req.headers.authorization;

    if (authHeader?.startsWith("Bearer ")) {
      const token =
        authHeader.split(" ")[1];

      try {
        const decoded = jwt.verify(
          token,
          JWT_SECRET
        );

        const recruiter =
          await Recruiter.findById(
            decoded.id
          ).select("-password");

        if (recruiter) {
          req.recruiter =
            recruiter;
          return next();
        }
      } catch (err) {
        console.log(
          "Recruiter token failed, checking clerk..."
        );
      }
    }

    // ================= JOB SEEKER CHECK =================
    const auth = getAuth(req);

    if (auth?.userId) {
      const jobSeeker =
        await JobSeeker.findOne({
          clerkId: auth.userId,
        });

      if (jobSeeker) {
        req.jobSeeker =
          jobSeeker;
        return next();
      }
    }

    return res.status(401).json({
      success: false,
      message: "Unauthorized user",
    });
  } catch (error) {
    console.log(
      "VERIFY USER ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export default verifyUser;