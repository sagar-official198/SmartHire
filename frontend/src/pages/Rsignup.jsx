import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";

export default function RecruiterSignup() {
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    company: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "https://smarthire-af4a.onrender.com/api/recruiter/register",
        formData
      );

      console.log("Signup Success:", res.data);
      alert("Account Created Successfully ✅");

      // redirect to login
      window.location.href = "/recruiter-login";

    } catch (error) {
      console.error(error.response?.data || error.message);
      alert(error.response?.data?.message || "Signup Failed ❌");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
        
        <h2 className="text-2xl font-semibold text-center mb-2">
          Recruiter Signup
        </h2>
        <p className="text-sm text-gray-500 text-center mb-6">
          Create your recruiter account
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Name */}
          <div>
            <label className="text-sm font-medium">Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black outline-none"
            />
          </div>

          {/* Company */}
          <div>
            <label className="text-sm font-medium">Company</label>
            <input
              type="text"
              name="company"
              placeholder="Company name"
              value={formData.company}
              onChange={handleChange}
              required
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black outline-none"
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              placeholder="recruiter@email.com"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black outline-none"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <label className="text-sm font-medium">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black outline-none"
            />

            <span
              className="absolute right-3 top-9 cursor-pointer text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition"
          >
            Sign Up
          </button>
        </form>

        {/* Login Link */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <a href="/recruiter-login" className="text-black font-medium">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}