import Recruiter from "../models/Recruiter.js";
import JobSeeker from "../models/JobSeeker.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secret123";

// ================= REGISTER =================
export const registerRecruiter = async (req, res) => {
  try {
    const { name, email, password, company } =
      req.body;

    if (
      !name ||
      !email ||
      !password ||
      !company
    ) {
      return res.status(400).json({
        success: false,
        message:
          "All fields are required",
      });
    }

    const exist =
      await Recruiter.findOne({
        email,
      });

    if (exist) {
      return res.status(400).json({
        success: false,
        message:
          "User already exists",
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const recruiter =
      await Recruiter.create({
        name,
        email,
        password: hashedPassword,
        company,
      });

    const token = jwt.sign(
      { id: recruiter._id },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(201).json({
      success: true,
      message:
        "Signup successful ✅",
      token,
      recruiter,
    });
  } catch (error) {
    console.log(
      "REGISTER ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ================= LOGIN =================
export const loginRecruiter = async (
  req,
  res
) => {
  try {
    const { email, password } =
      req.body;

    const user =
      await Recruiter.findOne({
        email,
      });

    if (!user) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid credentials",
      });
    }

    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid credentials",
      });
    }

    const token = jwt.sign(
      { id: user._id },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      success: true,
      token,
      recruiter: {
        id: user._id,
        name: user.name,
        email: user.email,
        company: user.company,
      },
    });
  } catch (err) {
    console.log(
      "LOGIN ERROR:",
      err
    );

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ================= PROFILE =================
export const getRecruiterProfile =
  async (req, res) => {
    try {
      res.json({
        success: true,
        recruiter:
          req.recruiter,
      });
    } catch (error) {
      console.log(
        "PROFILE ERROR:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Server error",
      });
    }
  };

// ================= DASHBOARD =================
export const getDashboardData =
  async (req, res) => {
    try {
      const recruiter =
        req.recruiter;

      res.json({
        success: true,
        totalJobs:
          recruiter.jobsCreated || 0,
        applicants:
          recruiter.totalApplicants ||
          0,
        shortlisted:
          recruiter.shortlistedCount ||
          0,
        interviews:
          recruiter.interviewCount ||
          0,
        recentActivity: [
          {
            message:
              "New candidate applied for Frontend Developer role",
          },
          {
            message:
              "Interview scheduled for MERN Stack Developer",
          },
          {
            message:
              "3 new applications received today",
          },
        ],
      });
    } catch (error) {
      console.log(
        "DASHBOARD ERROR:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Server error",
      });
    }
  };

// ================= SEARCH + RANK CANDIDATES =================
export const searchRankedCandidates =
  async (req, res) => {
    try {
      const {
        role = "",
        location = "",
        experience = "",
        skills = [],
      } = req.body;

      const candidates =
        await JobSeeker.find();

      const rankedCandidates =
        candidates
          .map((candidate) => {
            let score = 0;
            let matchedSkills = [];

            const candidateSkills =
              candidate.skills || [];

            const skillText =
              candidateSkills
                .join(" ")
                .toLowerCase();

            const roleText =
              (
                candidate.role || ""
              ).toLowerCase();

            const locationText =
              (
                candidate.location ||
                ""
              ).toLowerCase();

            // ===== ROLE / SKILL MATCH =====
            if (
              role &&
              (roleText.includes(
                role.toLowerCase()
              ) ||
                skillText.includes(
                  role.toLowerCase()
                ))
            ) {
              score += 40;
            }

            // ===== LOCATION MATCH =====
            if (
              location &&
              locationText.includes(
                location.toLowerCase()
              )
            ) {
              score += 30;
            }

            // ===== EXPERIENCE MATCH =====
            if (
              experience &&
              Number(
                candidate.experience ||
                  0
              ) >=
                Number(
                  experience
                )
            ) {
              score += 10;
            }

            // ===== SKILLS MATCH =====
            if (
              skills.length > 0
            ) {
              matchedSkills =
                candidateSkills.filter(
                  (skill) =>
                    skills
                      .map((s) =>
                        s
                          .toLowerCase()
                          .trim()
                      )
                      .includes(
                        skill
                          .toLowerCase()
                          .trim()
                      )
                );

              score +=
                matchedSkills.length *
                10;
            }

            score =
              Math.min(
                score,
                100
              );

            return {
              ...candidate.toObject(),
              matchScore:
                score,
              matchedSkills,
            };
          })
          .sort(
            (a, b) =>
              b.matchScore -
              a.matchScore
          );

      console.log(
        "FINAL SCORES:",
        rankedCandidates.map(
          (c) => ({
            name: c.fullName,
            score:
              c.matchScore,
          })
        )
      );

      res.status(200).json({
        success: true,
        candidates:
          rankedCandidates,
      });
    } catch (error) {
      console.log(
        "SEARCH ERROR:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Search failed",
      });
    }
  };