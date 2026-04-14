import JobSeeker from "../models/JobSeeker.js";
import { getAuth } from "@clerk/express";

const verifyJobSeeker = async (
  req,
  res,
  next
) => {
  try {
    const auth = getAuth(req);

    console.log("AUTH DATA:", auth);

    if (!auth || !auth.userId) {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    const user =
      await JobSeeker.findOne({
        clerkId: auth.userId,
      });

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "Job seeker not found",
      });
    }

    req.jobSeeker = user;

    next();
  } catch (error) {
    console.error(
      "AUTH ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export default verifyJobSeeker;