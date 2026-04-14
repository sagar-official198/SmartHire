import React, { useState } from "react";
import {
  useNavigate,
} from "react-router-dom";
import {
  useAuth,
  useUser,
} from "@clerk/clerk-react";
import axios from "axios";
import Sidebar from "../component/Sidebar";
import Navbar from "../component/Navbar";

function ProfileForm() {
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const { user } = useUser();

  const [formData, setFormData] =
    useState({
      fullName: "",
      email:
        user
          ?.primaryEmailAddress
          ?.emailAddress || "",
      phone: "",
      location: "",
      experience: "",
      skills: "",
      about: "",
      salary: "",
      resume: "",
    });

  const [loading, setLoading] =
    useState(false);

  const handleChange = (e) => {
    const { name, value } =
      e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (
    e
  ) => {
    e.preventDefault();

    try {
      setLoading(true);

      const token =
        await getToken();

      const payload = {
        fullName:
          formData.fullName,
        email: formData.email,
        phone: formData.phone,
        location:
          formData.location,
        experience:
          Number(
            formData.experience
          ) || 0,
        salary:
          Number(
            formData.salary
          ) || 0,

        skills:
          formData.skills
            .split(",")
            .map((skill) =>
              skill.trim()
            )
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

      alert(
        "Profile saved successfully 🚀"
      );

      navigate("/dashboard");
    } catch (error) {
      console.error(
        "Profile save error:",
        error.response?.data ||
          error.message
      );

      alert(
        "Failed to save profile"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Navbar />

        <div className="p-6">
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">
              Complete Your Profile 🚀
            </h2>

            <form
              onSubmit={
                handleSubmit
              }
              className="grid grid-cols-1 md:grid-cols-2 gap-5"
            >
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={
                  formData.fullName
                }
                onChange={
                  handleChange
                }
                className="border rounded-lg px-4 py-3"
                required
              />

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={
                  formData.email
                }
                onChange={
                  handleChange
                }
                className="border rounded-lg px-4 py-3"
                required
              />

              <input
                type="text"
                name="phone"
                placeholder="Phone"
                value={
                  formData.phone
                }
                onChange={
                  handleChange
                }
                className="border rounded-lg px-4 py-3"
              />

              <input
                type="text"
                name="location"
                placeholder="Location"
                value={
                  formData.location
                }
                onChange={
                  handleChange
                }
                className="border rounded-lg px-4 py-3"
              />

              <input
                type="number"
                name="experience"
                placeholder="Experience"
                value={
                  formData.experience
                }
                onChange={
                  handleChange
                }
                className="border rounded-lg px-4 py-3"
              />

              <input
                type="number"
                name="salary"
                placeholder="Expected Salary"
                value={
                  formData.salary
                }
                onChange={
                  handleChange
                }
                className="border rounded-lg px-4 py-3"
              />

              <input
                type="text"
                name="skills"
                placeholder="React, Node, MongoDB"
                value={
                  formData.skills
                }
                onChange={
                  handleChange
                }
                className="border rounded-lg px-4 py-3 md:col-span-2"
              />

              <textarea
                name="about"
                rows="4"
                placeholder="About yourself"
                value={
                  formData.about
                }
                onChange={
                  handleChange
                }
                className="border rounded-lg px-4 py-3 md:col-span-2"
              />

              <input
                type="text"
                name="resume"
                placeholder="Resume Link"
                value={
                  formData.resume
                }
                onChange={
                  handleChange
                }
                className="border rounded-lg px-4 py-3 md:col-span-2"
              />

              <button
                type="submit"
                disabled={
                  loading
                }
                className="md:col-span-2 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
              >
                {loading
                  ? "Saving..."
                  : "Submit Profile"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileForm;