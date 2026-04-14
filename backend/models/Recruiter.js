import mongoose from "mongoose";

const recruiterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },

    // dashboard stats
    jobsCreated: {
      type: Number,
      default: 0,
    },
    mailsSent: {
      type: Number,
      default: 0,
    },
    hiredCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Recruiter", recruiterSchema);