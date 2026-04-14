import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";

export default function RecruiterLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const API = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // 🔥 NORMAL LOGIN FIX
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API}/api/recruiter/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      console.log("Login Response:", data);

      if (data.success) {
        // ✅ save token
        localStorage.setItem("recruiterToken", data.token);

        // ✅ redirect
        navigate("/recruiter-dashboard");
      } else {
        alert(data.message || "Login failed");
      }

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
        
        <h2 className="text-2xl font-semibold text-center mb-2">
          Recruiter Login
        </h2>
        <p className="text-sm text-gray-500 text-center mb-6">
          Welcome back! Please enter your details
        </p>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* EMAIL */}
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

          {/* PASSWORD */}
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

          {/* ✅ KEEP THIS (UNCHANGED) */}
          <div className="text-right">
            <a href="#" className="text-sm text-black hover:underline">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition"
          >
            Sign In
          </button>
        </form>

        {/* DIVIDER */}
        <div className="my-6 flex items-center">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="px-3 text-sm text-gray-400">OR</span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        {/* 🔥 GOOGLE LOGIN FIX */}
        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              try {
                const token = credentialResponse.credential;

                const res = await fetch(`${API}/api/recruiter/google-login`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ token }),
                });

                const data = await res.json();

                console.log("Google Login:", data);

                if (data.success) {
                  localStorage.setItem("recruiterToken", data.token);
                  navigate("/recruiter-dashboard");
                }

              } catch (err) {
                console.log(err);
              }
            }}
            onError={() => {
              console.log("Google Login Failed");
            }}
          />
        </div>

        {/* ✅ KEEP THIS (UNCHANGED) */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Don’t have an account?{" "}
          <a href="/recruiter-signup" className="text-black font-medium">
            Sign up
          </a>
        </p>

      </div>
    </div>
  );
}