import JobSeeker from "../models/JobSeeker.js";

// ================= CREATE / UPDATE PROFILE =================
export const createOrUpdateProfile = async (req, res) => {
  try {
    const clerkId =
      req.auth?.userId ||
      req.auth?.().userId;

    if (!clerkId) {
      return res.status(401).json({
        message: "Unauthorized: Clerk user not found",
      });
    }

    const {
      fullName,
      email,
      phone,
      location,
      experience,
      about,
      skills,
      resume,
    } = req.body;

    let profile = await JobSeeker.findOne({
      clerkId,
    });

    if (profile) {
      profile.fullName = fullName;
      profile.email = email;
      profile.phone = phone;
      profile.location = location;
      profile.experience = experience;
      profile.about = about;
      profile.skills = skills;

      profile.resume = {
        url: resume?.url || "",
        name: resume?.name || "Resume",
      };

      await profile.save();
    } else {
      profile = await JobSeeker.create({
        clerkId,
        fullName,
        email,
        phone,
        location,
        experience,
        about,
        skills,
        resume: {
          url: resume?.url || "",
          name: resume?.name || "Resume",
        },
      });
    }

    res.status(200).json(profile);
  } catch (error) {
    console.error("Profile save error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// ================= GET PROFILE =================
export const getProfile = async (req, res) => {
  try {
    const clerkId =
      req.auth?.userId ||
      req.auth?.().userId;

    if (!clerkId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const profile = await JobSeeker.findOne({
      clerkId,
    });

    if (!profile) {
      return res.status(404).json({
        message: "Profile not found",
      });
    }

    // 🔥 UPDATE LAST ACTIVE (NEW)
    profile.lastActive = new Date();
    await profile.save();

    res.status(200).json(profile);
  } catch (error) {
    console.error("Get profile error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// ================= 🔥 INCREMENT VIEWS =================
export const incrementViews = async (req, res) => {
  try {
    const { id } = req.params;

    const profile = await JobSeeker.findById(id);

    if (!profile) {
      return res.status(404).json({
        message: "Profile not found",
      });
    }

    profile.views += 1;
    await profile.save();

    res.status(200).json({
      message: "Views updated",
      views: profile.views,
    });
  } catch (error) {
    console.error("Views error:", error);
    res.status(500).json({
      message: "Server error",
    });
  }
};

// ================= 🔥 INCREMENT CLICKS =================
export const incrementClicks = async (req, res) => {
  try {
    const { id } = req.params;

    const profile = await JobSeeker.findById(id);

    if (!profile) {
      return res.status(404).json({
        message: "Profile not found",
      });
    }

    profile.clicks += 1;
    await profile.save();

    res.status(200).json({
      message: "Clicks updated",
      clicks: profile.clicks,
    });
  } catch (error) {
    console.error("Clicks error:", error);
    res.status(500).json({
      message: "Server error",
    });
  }
};
