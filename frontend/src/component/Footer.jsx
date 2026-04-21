import React from "react";
import { Github, Linkedin, Mail } from "lucide-react";

function Footer() {
  return (
    <div className="mt-12">

      <div className="bg-white/40 backdrop-blur-2xl border border-white/30 
      rounded-3xl shadow-xl px-6 py-5 flex flex-col md:flex-row 
      justify-between items-center gap-4 text-sm text-gray-700">

        {/* LEFT */}
        <div>
          <h2 className="font-semibold text-lg text-gray-800">
            SmartHire
          </h2>
          <p className="text-gray-500 text-xs">
            Smart hiring made simple 🚀
          </p>
        </div>

        {/* CENTER LINKS */}
        <div className="flex gap-6 font-medium">
          <span className="hover:text-green-600 cursor-pointer transition">
            Dashboard
          </span>
          <span className="hover:text-green-600 cursor-pointer transition">
            Privacy
          </span>
          <span className="hover:text-green-600 cursor-pointer transition">
            Terms
          </span>
          <span className="hover:text-green-600 cursor-pointer transition">
            Support
          </span>
        </div>

        {/* RIGHT ICONS */}
        <div className="flex gap-4">
          <Github className="cursor-pointer hover:text-green-600 transition" size={18} />
          <Linkedin className="cursor-pointer hover:text-green-600 transition" size={18} />
          <Mail className="cursor-pointer hover:text-green-600 transition" size={18} />
        </div>

      </div>

      {/* BOTTOM BAR */}
      <div className="text-center mt-3 text-xs text-gray-500">
        © {new Date().getFullYear()} SmartHire 
      </div>

    </div>
  );
}

export default Footer;