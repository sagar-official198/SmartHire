import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, useUser } from "@clerk/clerk-react";
import axios from "axios";
import Sidebar from "../component/Sidebar";
import Navbar from "../component/Navbar";

function ProfileForm() {
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const { user } = useUser();

  const [formData, setFormData] = useState({
    fullName: "",
    email: user?.primaryEmailAddress?.emailAddress || "",
    phone: "",
    location: "",
    experience: "",
    skills: "",
    about: "",
    salary: "",
    resume: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const token = await getToken();

      const payload = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        location: formData.location,
        experience: Number(formData.experience) || 0,
        salary: Number(formData.salary) || 0,

        skills: formData.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),

        about: formData.about,

        resume: {
          url: formData.resume,
          name: "Resume",
        },
      };

      await axios.post(
        "http://localhost:5000/api/jobseeker/profile",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Profile saved successfully 🚀");
      navigate("/dashboard");
    } catch (error) {
      console.error(
        "Profile save error:",
        error.response?.data || error.message
      );
      alert("Failed to save profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-200 to-green-500 flex">

      {/* Sidebar */}
      <Sidebar />

      {/* Main */}
      <div className="flex-1">
        <Navbar />

        {/* Content */}
        <div className="ml-[260px] pt-24 p-8">

          <div className="max-w-5xl mx-auto bg-white/40 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/30 p-8">

            {/* Heading */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-800">
                Complete Your Profile 🚀
              </h2>
              <p className="text-gray-500 mt-1">
                Fill your details to get better opportunities
              </p>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >

              {/* Full Name */}
              <div>
                <label className="text-sm text-gray-600">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="mt-1 w-full bg-white/70 border border-white/40 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-400 outline-none"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="text-sm text-gray-600">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 w-full bg-white/70 border border-white/40 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-400 outline-none"
                  required
                />
              </div>

              {/* Phone */}
              <div>
                <label className="text-sm text-gray-600">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="mt-1 w-full bg-white/70 border border-white/40 rounded-xl px-4 py-3"
                />
              </div>

              {/* Location */}
              <div>
                <label className="text-sm text-gray-600">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="mt-1 w-full bg-white/70 border border-white/40 rounded-xl px-4 py-3"
                />
              </div>

              {/* Experience */}
              <div>
                <label className="text-sm text-gray-600">Experience</label>
                <input
                  type="number"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  className="mt-1 w-full bg-white/70 border border-white/40 rounded-xl px-4 py-3"
                />
              </div>

              {/* Salary */}
              <div>
                <label className="text-sm text-gray-600">Expected Salary</label>
                <input
                  type="number"
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  className="mt-1 w-full bg-white/70 border border-white/40 rounded-xl px-4 py-3"
                />
              </div>

              {/* Skills */}
              <div className="md:col-span-2">
                <label className="text-sm text-gray-600">Skills</label>
                <input
                  type="text"
                  name="skills"
                  placeholder="React, Node, MongoDB"
                  value={formData.skills}
                  onChange={handleChange}
                  className="mt-1 w-full bg-white/70 border border-white/40 rounded-xl px-4 py-3"
                />
              </div>

              {/* About */}
              <div className="md:col-span-2">
                <label className="text-sm text-gray-600">About</label>
                <textarea
                  name="about"
                  rows="4"
                  value={formData.about}
                  onChange={handleChange}
                  className="mt-1 w-full bg-white/70 border border-white/40 rounded-xl px-4 py-3"
                />
              </div>

              {/* Resume */}
              <div className="md:col-span-2">
                <label className="text-sm text-gray-600">Resume Link</label>
                <input
                  type="text"
                  name="resume"
                  value={formData.resume}
                  onChange={handleChange}
                  className="mt-1 w-full bg-white/70 border border-white/40 rounded-xl px-4 py-3"
                />
              </div>

              {/* Button */}
              <button
                type="submit"
                disabled={loading}
                className="md:col-span-2 mt-4 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-xl shadow-lg hover:scale-[1.02] transition"
              >
                {loading ? "Saving..." : "Save Profile"}
              </button>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileForm;