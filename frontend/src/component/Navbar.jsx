import React from "react";
import {
  useUser,
  UserButton,
} from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { MessageSquare } from "lucide-react";
import Logo from "../assets/logo.png";

function Navbar() {
  const { user } = useUser();
  const navigate = useNavigate();

  return (
    <div className="fixed top-0 left-0 w-full h-20 bg-white border-b shadow-sm z-50 px-8 flex justify-between items-center">
      
      {/* Left Side */}
      <div className="flex items-center gap-4">
        <img
          src={Logo}
          alt="SmartHire Logo"
          className="w-32"
        />
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-5">
        <button
          onClick={() =>
            navigate("/jobseeker-messages")
          }
          className="relative hover:scale-110 transition"
        >
          <MessageSquare
            size={22}
            className="text-gray-700"
          />
        </button>

        <span className="hidden md:block text-gray-700 font-semibold">
          {user?.fullName}
        </span>

        <UserButton afterSignOutUrl="/" />
      </div>
    </div>
  );
}

export default Navbar;