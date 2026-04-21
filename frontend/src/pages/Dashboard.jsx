import React, { useEffect, useState } from "react";
import { useUser, useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../component/Sidebar";
import Navbar from "../component/Navbar";
import Footer from "../component/Footer";
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
    if (profileData?.resume || profileData?.resumeUrl) score += 20;
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
        setMessagesCount(data.messagesCount || 0);
        setStrength(calculateStrength(data));
      } catch (error) {
        console.error("Dashboard fetch error:", error);
        if (error.response?.status === 404) {
          setProfile(null);
        }
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchDashboardData();
  }, [user, getToken]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-100 via-white to-green-200">
        <Navbar />
        <Sidebar />
        <div className="ml-[64px] md:ml-[256px] px-6 pt-6">
          Loading dashboard...
        </div>
      </div>
    );
  }

  const resumeLink =
    typeof profile?.resume === "string"
      ? profile.resume
      : profile?.resume?.url || profile?.resumeUrl;

  return (
    <div className=" min-h-screen bg-gradient-to-br from-green-100 via-white to-green-200">
      <Navbar />
      <Sidebar />

      {/* ✅ PERFECT SPACING FIX */}
      <div className="ml-[64px] md:ml-[256px] margin-top: 1rem px-6 pt-6 pb-6 flex flex-col min-h-screen">
        <div className="flex-1">

          {/* 🆕 NEW USER CTA */}
          {!profile && (
            <div className="mb-4 bg-white/60 backdrop-blur-xl p-6 rounded-2xl shadow-lg border">
              <h2 className="text-xl font-bold text-gray-800">
                Welcome 👋
              </h2>

              <p className="text-gray-600 mt-2 margin-top: 1rem">
                You haven’t created your profile yet. Complete your profile to unlock jobs and recruiter visibility.
              </p>

              <button
                onClick={() => navigate("/create-profile")}
                className="mt-4 bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg transition"
              >
                Create Profile
              </button>
            </div>
          )}

          {/* HEADER */}
          <h2 className="text-3xl font-bold text-gray-800">
            Welcome back, {user?.firstName || "User"} 👋
          </h2>

          {/* TOP CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-4">
            {[
              { title: "Profile Strength", value: `${strength}%`, isProgress: true },
              { title: "Recruiter Views", value: profile?.views || 0 },
              { title: "Messages", value: messagesCount },
              { title: "Skills", value: profile?.skills?.length || 0 },
            ].map((card, index) => (
              <div
                key={index}
                className="bg-white/40 backdrop-blur-xl p-5 rounded-2xl shadow-lg border"
              >
                <h6 className="text-gray-600">{card.title}</h6>
                <h3 className="text-2xl font-bold mt-2 text-green-600">
                  {card.value}
                </h3>

                {card.isProgress && (
                  <div className="mt-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${strength}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* MAIN GRID */}
          {profile && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">

              {/* PROFILE */}
              <div className="bg-gradient-to-br from-green-400 to-green-600 text-white p-6 rounded-3xl shadow-2xl sticky top-24 h-fit">
                <h3 className="text-xl font-bold">{profile.fullName}</h3>
                <p className="opacity-80">{profile.location}</p>

                <div className="mt-4 space-y-1 text-sm">
                  <p>Email: {profile.email}</p>
                  <p>Phone: {profile.phone}</p>
                  <p>Experience: {profile.experience} yrs</p>
                </div>

                <button
                  onClick={() => navigate("/create-profile")}
                  className="mt-5 bg-black/70 px-4 py-2 rounded-xl"
                >
                  Edit Profile
                </button>
              </div>

              {/* RIGHT SIDE */}
              <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* ABOUT */}
                <div className="md:col-span-2 bg-white p-6 rounded-3xl shadow">
                  <h4>About</h4>
                  <p>{profile.about}</p>
                </div>

                {/* SEARCH APPEARANCE */}
                <div className="md:col-span-2 bg-white p-6 rounded-3xl shadow">
                  <h4 className="mb-4 font-semibold">Search Appearance</h4>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                      <p className="text-gray-500 text-xs">Views</p>
                      <h3 className="font-bold text-green-600">
                        {profile?.views || 0}
                      </h3>
                    </div>

                    <div>
                      <p className="text-gray-500 text-xs">Clicks</p>
                      <h3 className="font-bold text-green-600">
                        {profile?.clicks || 0}
                      </h3>
                    </div>

                    <div>
                      <p className="text-gray-500 text-xs">Visibility</p>
                      <h3 className="font-bold text-green-600">
                        {strength}%
                      </h3>
                    </div>

                    <div>
                      <p className="text-gray-500 text-xs">Last Active</p>
                      <h3 className="font-bold text-green-600">
                        {profile?.lastActive
                          ? new Date(profile.lastActive).toLocaleDateString()
                          : "Today"}
                      </h3>
                    </div>
                  </div>
                </div>

                {/* SKILLS */}
                <div className="md:col-span-2 bg-white p-6 rounded-3xl shadow">
                  <h4>Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills?.map((skill, i) => (
                      <span
                        key={i}
                        className="bg-green-100 px-3 py-1 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* RESUME */}
                <div className="md:col-span-2 bg-white p-6 rounded-3xl shadow">
                  <h4>Resume</h4>
                  {resumeLink ? (
                    <a
                      href={resumeLink}
                      target="_blank"
                      rel="noreferrer"
                      className="text-green-600 underline"
                    >
                      View Resume
                    </a>
                  ) : (
                    "Not Uploaded"
                  )}
                </div>

              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Dashboard;