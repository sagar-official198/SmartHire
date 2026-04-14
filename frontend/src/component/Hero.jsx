import React from "react";
import heroImg from "../assets/hero.png";
import { useNavigate } from "react-router-dom";

function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex flex-col-reverse md:flex-row items-center justify-between px-6 md:px-16 py-12 bg-gray-50 overflow-hidden">
      
      {/* Background Effects */}
      <div className="absolute top-[-100px] right-[-100px] w-[300px] h-[300px] bg-blue-200 rounded-full blur-3xl opacity-30"></div>
      <div className="absolute bottom-[-100px] left-[-100px] w-[300px] h-[300px] bg-purple-200 rounded-full blur-3xl opacity-30"></div>

      {/* LEFT CONTENT */}
      <div className="max-w-xl text-center md:text-left z-10">
        
        <span className="inline-block px-4 py-1 mb-4 text-sm bg-blue-100 text-blue-600 rounded-full">
          🚀 #1 Smart Hiring Platform
        </span>

        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
          Find Your Dream Job <br />
          <span className="text-blue-600">Faster & Smarter</span>
        </h1>

        <p className="mt-4 text-gray-600 text-lg">
          SmartHire connects you with top companies and helps you land your
          perfect role quickly and easily.
        </p>

        {/* 🔥 Buttons with routing */}
        <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
          
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-700 hover:scale-105 transition"
          >
            Job Seekers Login
          </button>

          <button
            onClick={() => navigate("/recruiter-login")}
            className="px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-100 hover:scale-105 transition"
          >
            Recruiters Login
          </button>
        </div>

        {/* Stats */}
        <div className="mt-8 flex justify-center md:justify-start gap-8 text-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">10K+</h2>
            <p className="text-gray-500 text-sm">Jobs</p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">5K+</h2>
            <p className="text-gray-500 text-sm">Companies</p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">20K+</h2>
            <p className="text-gray-500 text-sm">Users</p>
          </div>
        </div>
      </div>

      {/* RIGHT IMAGE */}
      <div className="mb-10 md:mb-0 z-10">
        <img
          src={heroImg}
          alt="hero"
          className="w-[320px] md:w-[450px] lg:w-[550px] drop-shadow-2xl hover:scale-105 transition duration-300"
        />
      </div>
    </section>
  );
}

export default Hero;