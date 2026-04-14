import mongoose from "mongoose";

const jobSeekerSchema =
  new mongoose.Schema(
    {
      clerkId: {
        type: String,
        required: true,
        unique: true,
      },
      fullName: String,
      email: String,
      phone: String,
      location: String,
      experience: Number,
      about: String,
      skills: [String],

      resume: {
        url: {
          type: String,
          default: "",
        },
        name: {
          type: String,
          default: "Resume",
        },
      },

      views: {
        type: Number,
        default: 0,
      },
      messagesCount: {
        type: Number,
        default: 0,
      },
    },
    { timestamps: true }
  );

export default mongoose.model(
  "JobSeeker",
  jobSeekerSchema
);