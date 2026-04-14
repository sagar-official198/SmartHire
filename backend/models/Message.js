import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },

    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },

    senderType: {
      type: String,
      required: true,
      enum: ["jobseeker", "recruiter"],
    },

    senderName: {
      type: String,
      required: true,
      default: "User",
    },

    message: {
      type: String,
      maxlength: 1000,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "Message",
  MessageSchema
);