import React, { useEffect, useState } from "react";
import { useUser, useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Sidebar from "../component/Sidebar";
import Navbar from "../component/Navbar";
import axios from "axios";

function Dashboard() {
  const { user } = useUser();
  const { getToken } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [messagesCount, setMessagesCount] = useState(0);
  const [strength, setStrength] = useState(0);
  const [loading, setLoading] = useState(true);

  const calculateStrength = (profileData) => {
    let score = 0;

    if (profileData?.fullName) score += 10;
    if (profileData?.email) score += 10;
    if (profileData?.phone) score += 10;
    if (profileData?.location) score += 10;
    if (profileData?.experience !== undefined) score += 10;
    if (profileData?.about) score += 10;
    if (profileData?.skills?.length > 0) score += 20;
    if (
      profileData?.resume ||
      profileData?.resumeUrl
    )
      score += 20;

    return score;
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = await getToken();

        const res = await axios.get(
          "http://localhost:5000/api/jobseeker/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = res.data;

        setProfile(data);
        setMessagesCount(
          data.messagesCount || 0
        );
        setStrength(
          calculateStrength(data)
        );
      } catch (error) {
        console.error(
          "Dashboard fetch error:",
          error
        );

        if (
          error.response?.status === 404
        ) {
          setProfile(null);
        }
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user, getToken]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#eef2ff] via-[#f8fafc] to-[#dbeafe]">
        <Navbar />
        <Sidebar />
        <div className="ml-[64px] md:ml-[256px] p-6">
          Loading dashboard...
        </div>
      </div>
    );
  }

  const resumeLink =
    typeof profile?.resume === "string"
      ? profile.resume
      : profile?.resume?.url ||
        profile?.resumeUrl;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#eef2ff] via-[#f8fafc] to-[#dbeafe]">
      {/* Navbar */}
      <Navbar />

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="ml-[64px] md:ml-[256px] w-[calc(100%-64px)] md:w-[calc(100%-256px)] min-h-[calc(100vh-80px)]">
        <div className="p-6 bg-white/20 backdrop-blur-sm min-h-[calc(100vh-80px)]">
          <motion.div
            initial={{
              opacity: 0,
              y: -25,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.6,
            }}
          >
            <h2 className="text-3xl font-bold text-gray-800">
              Welcome back,{" "}
              {user?.firstName || "User"} 👋
            </h2>

            <p className="text-gray-500 mt-1">
              Here's what's happening today
            </p>
          </motion.div>

          {/* TOP CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mt-8">
            {[
              {
                title:
                  "Profile Strength",
                value: `${strength}%`,
                isProgress: true,
              },
              {
                title:
                  "Recruiter Views",
                value:
                  profile?.views || 0,
              },
              {
                title: "Messages",
                value:
                  messagesCount,
              },
              {
                title: "Skills",
                value:
                  profile?.skills
                    ?.length || 0,
              },
            ].map((card, index) => (
              <motion.div
                key={index}
                initial={{
                  opacity: 0,
                  y: 35,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay:
                    index * 0.15,
                }}
                whileHover={{
                  scale: 1.03,
                  y: -6,
                }}
                className="bg-white/70 backdrop-blur-xl p-5 rounded-2xl shadow-xl border border-white/40"
              >
                <h6 className="text-gray-500">
                  {card.title}
                </h6>

                <h3 className="text-3xl font-bold mt-3 text-blue-600">
                  {card.value}
                </h3>

                {card.isProgress && (
                  <div className="mt-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        initial={{
                          width: 0,
                        }}
                        animate={{
                          width: `${strength}%`,
                        }}
                        transition={{
                          duration: 1,
                        }}
                        className="bg-blue-500 h-2 rounded-full"
                      />
                    </div>

                    <p className="text-sm mt-2 font-medium">
                      {strength}% Complete
                    </p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* PROFILE SECTION */}
          {profile ? (
            <motion.div
              initial={{
                opacity: 0,
                y: 40,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.7,
              }}
              className="bg-white/75 backdrop-blur-xl rounded-3xl shadow-2xl mt-8 p-8 border border-white/40"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">
                    {
                      profile.fullName
                    }
                  </h3>

                  <p className="text-gray-500 mt-1">
                    {
                      profile.location
                    }
                  </p>
                </div>

                <button
                  onClick={() =>
                    navigate(
                      "/create-profile"
                    )
                  }
                  className="bg-blue-600 text-white px-5 py-2 rounded-xl shadow-md hover:bg-blue-700"
                >
                  Edit Profile
                </button>
              </div>

              {/* DETAILS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div className="bg-white p-5 rounded-2xl shadow">
                  <h4 className="font-semibold text-gray-700 mb-2">
                    Email
                  </h4>
                  <p>
                    {profile.email ||
                      "Not Added"}
                  </p>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow">
                  <h4 className="font-semibold text-gray-700 mb-2">
                    Phone
                  </h4>
                  <p>
                    {profile.phone ||
                      "Not Added"}
                  </p>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow">
                  <h4 className="font-semibold text-gray-700 mb-2">
                    Experience
                  </h4>
                  <p>
                    {profile.experience ||
                      0} Years
                  </p>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow">
                  <h4 className="font-semibold text-gray-700 mb-2">
                    Resume
                  </h4>

                  {resumeLink ? (
                    <a
                      href={
                        resumeLink
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 underline break-all text-sm"
                    >
                      {
                        resumeLink
                      }
                    </a>
                  ) : (
                    <p>
                      Not Uploaded
                    </p>
                  )}
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl shadow mt-6">
                <h4 className="font-semibold text-gray-700 mb-2">
                  About
                </h4>
                <p>
                  {profile.about ||
                    "No About Info"}
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl shadow mt-6">
                <h4 className="font-semibold text-gray-700 mb-3">
                  Skills
                </h4>

                <div className="flex flex-wrap gap-2">
                  {profile.skills?.length >
                  0 ? (
                    profile.skills.map(
                      (
                        skill,
                        index
                      ) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      )
                    )
                  ) : (
                    <p>
                      No Skills Added
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="mt-8 bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl p-8 text-center border border-white/40">
              <h3 className="text-2xl font-semibold mb-3">
                Complete Your Profile 🚀
              </h3>

              <button
                onClick={() =>
                  navigate(
                    "/create-profile"
                  )
                }
                className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700"
              >
                Create Profile
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;