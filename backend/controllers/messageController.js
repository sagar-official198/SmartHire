import Message from "../models/Message.js";
import nodemailer from "nodemailer";

// ================= SEND MESSAGE =================
export const sendMessage = async (req, res) => {
  try {
    const sender = req.recruiter || req.jobSeeker;

    if (!sender) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
      });
    }

    const senderId = sender._id;
    const senderType = req.recruiter
      ? "recruiter"
      : "jobseeker";

    const senderName =
      sender.fullName ||
      sender.name ||
      sender.companyName ||
      "User";

    const { receiverId, message } = req.body;

    if (!receiverId) {
      return res.status(400).json({
        success: false,
        error: "Receiver ID required",
      });
    }

    if (!message?.trim()) {
      return res.status(400).json({
        success: false,
        error: "Message cannot be empty",
      });
    }

    const newMessage = await Message.create({
      senderId,
      receiverId,
      senderType,
      senderName,
      message: message.trim(),
    });

    return res.status(201).json({
      success: true,
      data: newMessage,
    });
  } catch (error) {
    console.error("Send message error:", error);

    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// ================= GET MESSAGES =================
export const getMessages = async (req, res) => {
  try {
    const { receiverId } = req.params;

    const currentUserId =
      req.recruiter?._id || req.jobSeeker?._id;

    if (!currentUserId) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
      });
    }

    const messages = await Message.find({
      $or: [
        {
          senderId: currentUserId,
          receiverId: receiverId,
        },
        {
          senderId: receiverId,
          receiverId: currentUserId,
        },
      ],
    }).sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      data: messages,
    });
  } catch (error) {
    console.error("Get messages error:", error);

    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// ================= CHAT HISTORY =================
export const getChatHistory = async (req, res) => {
  try {
    const currentUserId =
      req.recruiter?._id || req.jobSeeker?._id;

    const chats = await Message.find({
      $or: [
        { senderId: currentUserId },
        { receiverId: currentUserId },
      ],
    }).sort({ createdAt: -1 });

    const uniqueUsers = [];
    const userMap = new Map();

    chats.forEach((chat) => {
      const otherUserId =
        chat.senderId.toString() ===
        currentUserId.toString()
          ? chat.receiverId.toString()
          : chat.senderId.toString();

      if (!userMap.has(otherUserId)) {
        userMap.set(otherUserId, {
          _id: otherUserId,
          fullName: chat.senderName,
          lastMessage: chat.message,
        });
      }
    });

    userMap.forEach((value) =>
      uniqueUsers.push(value)
    );

    return res.status(200).json({
      success: true,
      data: uniqueUsers,
    });
  } catch (error) {
    console.error("History error:", error);

    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// ================= SEND EMAIL =================
export const sendEmail = async (req, res) => {
  try {
    const { to, subject, fullName } = req.body;

    const transporter =
      nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASSWORD,
        },
      });

    await transporter.sendMail({
      from: process.env.EMAIL,
      to,
      subject,
      html: `
        <h1>Hello ${fullName || "User"}</h1>
        <p>A recruiter wants to connect with you.</p>
      `,
    });

    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};