import jwt from "jsonwebtoken";
import Recruiter from "../models/Recruiter.js";

const JWT_SECRET = process.env.JWT_SECRET || "secret123";

const verifyRecruiter = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    const recruiter = await Recruiter.findById(decoded.id).select("-password");

    if (!recruiter) {
      return res.status(404).json({
        success: false,
        message: "Recruiter not found",
      });
    }

    req.recruiter = recruiter; // 🔥 current recruiter
    next();
  } catch (error) {
    console.log("AUTH ERROR:", error);
    res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};

export default verifyRecruiter;