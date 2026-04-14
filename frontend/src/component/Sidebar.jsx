import React from "react";
import { Link, useLocation } from "react-router-dom";

function Sidebar() {
  const location = useLocation();

  const menu = [
    {
      name: "My Profile",
      path: "/profile",
      icon: "👤",
    },
    {
      name: "Resume",
      path: "/resume",
      icon: "📄",
    },
    {
      name: "Settings",
      path: "/settings",
      icon: "⚙️",
    },
  ];

  return (
    <div className="fixed top-20 left-0 h-[calc(100vh-80px)] bg-white shadow-lg w-16 md:w-64 transition-all duration-300 p-3 md:p-6">
      <div className="flex flex-col gap-2">
        {menu.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className={`flex items-center gap-3 px-3 py-3 rounded-lg transition font-medium
              ${
                location.pathname === item.path
                  ? "bg-blue-500 text-white shadow"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
          >
            <span className="text-xl">
              {item.icon}
            </span>

            <span className="hidden md:block">
              {item.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;