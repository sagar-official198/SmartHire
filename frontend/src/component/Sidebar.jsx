import React from "react";
import { Link, useLocation } from "react-router-dom";

function Sidebar() {
  const location = useLocation();

  const menu = [
    { name: "My Profile", path: "/profile", icon: "👤" },
    { name: "Resume", path: "/ats-checker", icon: "📄" },
    
  ];

  return (
    <div className="fixed top-24 left-4 w-16 md:w-64">

      {/* GLASS CONTAINER */}
      <div className="bg-white/40 backdrop-blur-2xl border border-white/30 shadow-xl rounded-3xl p-3 md:p-5">

        <div className="flex flex-col gap-3">

          {menu.map((item, index) => {
            const active = location.pathname === item.path;

            return (
              <Link
                key={index}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200
                  ${
                    active
                      ? "bg-green-500 text-white shadow-md"
                      : "text-gray-700 hover:bg-white/60"
                  }`}
              >
                <span className="text-xl">{item.icon}</span>

                <span className="hidden md:block font-medium">
                  {item.name}
                </span>
              </Link>
            );
          })}

        </div>
      </div>
    </div>
  );
}

export default Sidebar;