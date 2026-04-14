import React from "react";
import { Mail, Phone, MapPin, Linkedin, Github } from "lucide-react";

function RecruiterFooter() {
  return (
    <footer className="w-full bg-slate-900 text-white mt-10">
      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Brand */}
        <div>
          <h2 className="text-2xl font-bold mb-3">SmartHire</h2>
          <p className="text-gray-300 text-sm leading-6">
            Helping recruiters find the best candidates faster with smart
            ranking, profile matching, and direct communication tools.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li className="hover:text-white cursor-pointer">Dashboard</li>
            <li className="hover:text-white cursor-pointer">Candidates</li>
            <li className="hover:text-white cursor-pointer">Messages</li>
            <li className="hover:text-white cursor-pointer">Profile</li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Contact</h3>
          <div className="space-y-3 text-gray-300 text-sm">
            <p className="flex items-center gap-2">
              <Mail size={16} /> support@smarthire.com
            </p>
            <p className="flex items-center gap-2">
              <Phone size={16} /> +91 98765 43210
            </p>
            <p className="flex items-center gap-2">
              <MapPin size={16} /> Delhi, India
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-700 text-center text-gray-400 text-sm py-4">
        © 2026 SmartHire. All rights reserved.
      </div>
    </footer>
  );
}

export default RecruiterFooter;
