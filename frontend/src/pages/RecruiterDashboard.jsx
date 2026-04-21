import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import RecruiterNavbar from "../component/Rnavbar";
import {
  Briefcase,
  Users,
  UserCheck,
  CalendarDays,
  Search,
} from "lucide-react";
import img from "../assets/default-avatar.jpg";

function RecruiterDashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem("recruiterToken");

  const [stats, setStats] = useState({
    totalJobs: 0,
    applicants: 0,
    shortlisted: 0,
    interviews: 0,
  });

  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    role: "",
    location: "",
    experience: "",
    skills: "",
  });

  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] =
    useState(null);

  // ================= RESUME LINK FIX =================
  const getWorkingResumeLink = (candidate) => {
    const rawLink =
      candidate?.resumeUrl ||
      candidate?.resume ||
      candidate?.resumeLink ||
      candidate?.portfolioUrl ||
      candidate?.website ||
      "";

    if (!rawLink) return "";

    let link = rawLink.trim();

    if (
      link.startsWith("http://") ||
      link.startsWith("https://")
    ) {
      return link;
    }

    if (
      link.startsWith("www.") ||
      link.includes("drive.google.com")
    ) {
      return `https://${link}`;
    }

    return `https://${link}`;
  };

  // ================= MESSAGE =================
  const handleMessageClick = () => {
    if (!selectedCandidate?._id) {
      alert("Please select candidate first");
      return;
    }

    localStorage.setItem(
      "chatReceiverId",
      selectedCandidate._id
    );

    localStorage.setItem(
      "chatReceiverName",
      selectedCandidate.fullName
    );

    navigate("/recruiter-messages", {
      state: {
        receiverId: selectedCandidate._id,
        receiverName:
          selectedCandidate.fullName,
      },
    });
  };

  // ================= EMAIL =================
  const handleEmailClick = () => {
    if (!selectedCandidate?.email) {
      alert("Candidate email not available");
      return;
    }

    const score =
      selectedCandidate.matchScore || 0;

    const rank =
      candidates.findIndex(
        (candidate) =>
          candidate._id ===
          selectedCandidate._id
      ) + 1;

    const subject = encodeURIComponent(
      "Profile Match Update from SmartHire"
    );

    const body = encodeURIComponent(
      `Hi ${selectedCandidate.fullName},

Congratulations!

We found your profile at Rank #${rank} in our candidate search.

Your profile has successfully matched our recruitment criteria.

Profile Match Score: ${score}%

Based on your qualifications, skills, and experience, you have been shortlisted for the next stage of the hiring process.

Best regards,
Recruitment Team
SmartHire`
    );

    window.location.href = `mailto:${selectedCandidate.email}?subject=${subject}&body=${body}`;
  };

  // ================= DASHBOARD =================
  const fetchDashboardData = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/recruiter/dashboard",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setStats({
        totalJobs: res.data.totalJobs || 0,
        applicants: res.data.applicants || 0,
        shortlisted: res.data.shortlisted || 0,
        interviews: res.data.interviews || 0,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // ================= SEARCH =================
  const searchCandidates = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/recruiter/search-candidates",
        {
          ...filters,
          skills: filters.skills
            .split(",")
            .map((skill) => skill.trim())
            .filter(Boolean),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCandidates(res.data.candidates || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const cards = [
    {
      title: "Total Jobs",
      value: stats.totalJobs,
      icon: <Briefcase size={28} />,
    },
    {
      title: "Applicants",
      value: stats.applicants,
      icon: <Users size={28} />,
    },
    {
      title: "Shortlisted",
      value: stats.shortlisted,
      icon: <UserCheck size={28} />,
    },
    {
      title: "Interviews",
      value: stats.interviews,
      icon: <CalendarDays size={28} />,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100">
      <RecruiterNavbar />

      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">
          Recruiter Dashboard
        </h1>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {cards.map((card, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl shadow-md p-6"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-500 text-sm">
                    {card.title}
                  </p>
                  <h2 className="text-3xl font-bold mt-2">
                    {loading ? "..." : card.value}
                  </h2>
                </div>
                <div className="p-3 rounded-2xl bg-blue-100 text-blue-700">
                  {card.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* SEARCH */}
        <div className="bg-white rounded-3xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">
            Search Best Candidates
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Search Role"
              className="border p-3 rounded-2xl"
              onChange={(e) =>
                setFilters({
                  ...filters,
                  role: e.target.value,
                })
              }
            />

            <input
              type="text"
              placeholder="Search Location"
              className="border p-3 rounded-2xl"
              onChange={(e) =>
                setFilters({
                  ...filters,
                  location: e.target.value,
                })
              }
            />

            <input
              type="number"
              placeholder="Experience"
              className="border p-3 rounded-2xl"
              onChange={(e) =>
                setFilters({
                  ...filters,
                  experience: e.target.value,
                })
              }
            />

            <input
              type="text"
              placeholder="Skills (comma separated)"
              className="border p-3 rounded-2xl"
              onChange={(e) =>
                setFilters({
                  ...filters,
                  skills: e.target.value,
                })
              }
            />
          </div>

          <button
            onClick={searchCandidates}
            className="mt-4 flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl"
          >
            <Search size={18} />
            Search Candidates
          </button>
        </div>

        {/* CANDIDATES */}
        {candidates.length > 0 && (
          <div className="bg-white rounded-3xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">
              Ranked Candidates
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {candidates.map((candidate, index) => (
                <div
                  key={candidate._id}
                  className="relative p-6 bg-white rounded-3xl shadow-md border hover:shadow-xl transition"
                >
                  <div className="absolute top-4 right-4 bg-green-100 text-green-700 font-bold px-4 py-2 rounded-full shadow">
                    {candidate.matchScore || 0}%
                  </div>

                  <h3 className="font-bold text-lg">
                    Rank #{index + 1}
                  </h3>

                  <p className="mt-3 text-xl font-semibold">
                    {candidate.fullName}
                  </p>

                  <p className="text-gray-600">
                    {candidate.role || ""}
                  </p>

                  <p className="mt-2 text-sm font-semibold text-green-600">
                    Profile Match:{" "}
                    {candidate.matchScore || 0}%
                  </p>

                  <p className="text-sm text-gray-500 mt-2">
                    📍 {candidate.location || "N/A"}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {candidate.skills?.map(
                      (skill, i) => (
                        <span
                          key={i}
                          className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full"
                        >
                          {skill}
                        </span>
                      )
                    )}
                  </div>

                  <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{
                          width: `${candidate.matchScore || 0}%`,
                        }}
                      ></div>
                    </div>
                  </div>

                      <button
                      onClick={async () => {
                        setSelectedCandidate(candidate); // existing logic same

                        // 🔥 ADD THIS (NEW)
                        try {
                          await axios.post(
                            `http://localhost:5000/api/jobseeker/views/${candidate._id}`
                          );
                        } catch (err) {
                          console.error("View update failed", err);
                        }
                      }}
                      className="mt-5 bg-indigo-600 text-white px-4 py-2 rounded-xl"
                    >
                      View Profile
                    </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* MODAL */}
      {selectedCandidate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 w-[850px] shadow-xl flex gap-6">
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-4">
                {selectedCandidate.fullName}
              </h2>

              <p>Email: {selectedCandidate.email}</p>
              <p>Phone: {selectedCandidate.phone}</p>
              <p>
                Role: {selectedCandidate.role || "N/A"}
              </p>
              <p>
                Location:{" "}
                {selectedCandidate.location || "N/A"}
              </p>

              <p className="mt-2">
                Skills:{" "}
                {selectedCandidate.skills?.join(", ")}
              </p>

              <p className="mt-2 font-bold text-green-600">
                Profile Match:{" "}
                {selectedCandidate.matchScore || 0}%
              </p>

              <button
                onClick={() => {
                  const link =
                    getWorkingResumeLink(
                      selectedCandidate
                    );

                  if (link) {
                    window.open(
                      link,
                      "_blank",
                      "noopener,noreferrer"
                    );
                  } else {
                    alert(
                      "Resume not uploaded"
                    );
                  }
                }}
                className="text-blue-600 underline mt-3"
              >
                View Resume
              </button>

              <div className="mt-5 flex gap-3">
                <button
                  onClick={() =>
                    setSelectedCandidate(null)
                  }
                  className="bg-red-500 text-white px-4 py-2 rounded-xl"
                >
                  Close
                </button>

                <button
                  onClick={handleEmailClick}
                  className="bg-blue-500 text-white px-4 py-2 rounded-xl"
                >
                  Email
                </button>
              </div>
            </div>

            <div className="w-[180px]">
              <img
                src={
                  selectedCandidate.profileImage ||
                  img
                }
                alt={selectedCandidate.fullName}
                className="w-40 h-40 rounded-full object-cover"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RecruiterDashboard;