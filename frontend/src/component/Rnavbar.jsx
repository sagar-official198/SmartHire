import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { MessageSquare } from "lucide-react";

function RecruiterNavbar() {
  const [recruiterName, setRecruiterName] =
    useState("Recruiter");
  const [recruiterCompany, setRecruiterCompany] =
    useState("");
  const [unreadMessages, setUnreadMessages] =
    useState(2);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecruiterName = async () => {
      const token = localStorage.getItem(
        "recruiterToken"
      );

      if (!token) {
        navigate("/", { replace: true });
        return;
      }

      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/recruiter/profile`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        if (data.success) {
          setRecruiterName(
            data.recruiter.name
          );
          setRecruiterCompany(
            data.recruiter.company
          );
        } else {
          localStorage.removeItem(
            "recruiterToken"
          );
          navigate("/", {
            replace: true,
          });
        }
      } catch (error) {
        console.log(
          "Error fetching recruiter:",
          error
        );
      }
    };

    fetchRecruiterName();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem(
      "recruiterToken"
    );
    localStorage.removeItem(
      "chatReceiverId"
    );
    localStorage.removeItem(
      "chatReceiverName"
    );

    navigate("/", { replace: true });
  };

  const handleMessages = () => {
    navigate("/recruiter-messages");
  };

  return (
    <nav className="w-full bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 shadow-lg px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Left Logo */}
        <div className="bg-white px-4 py-2 rounded-xl shadow-md flex items-center">
          <img
            src={logo}
            alt="SmartHire Logo"
            className="h-10 md:h-12 w-auto object-contain"
          />
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-5">
          
          {/* Message Icon */}
          <button
            onClick={handleMessages}
            className="relative cursor-pointer hover:scale-110 transition-all duration-300"
            title="Messages"
          >
            <MessageSquare
              size={24}
              className="text-white"
            />

            {unreadMessages > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center">
                {unreadMessages}
              </span>
            )}
          </button>

          {/* Name + Company */}
          <div className="hidden md:flex flex-col text-right">
            <span className="text-white font-semibold text-lg leading-tight">
              {recruiterName}
            </span>
            <span className="text-gray-300 text-sm">
              {recruiterCompany}
            </span>
          </div>

          {/* Profile Avatar */}
          <div className="w-10 h-10 rounded-full bg-white text-blue-900 font-bold flex items-center justify-center shadow-md">
            {recruiterName
              ?.charAt(0)
              .toUpperCase()}
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-xl bg-white text-slate-900 font-semibold shadow-md hover:scale-105 transition-all duration-300"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default RecruiterNavbar;