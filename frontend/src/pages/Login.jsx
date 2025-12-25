import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, LogIn } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = (e) => {
    e.preventDefault();

    // TEMPORARY VALIDATION (you will connect backend later)
    if (!formData.email || !formData.password) {
      toast.error("Please fill all fields");
      return;
    }

    toast.success("Login successful!");

    setTimeout(() => {
      navigate("/dashboard");
    }, 800);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 to-blue-400 px-6">

      <Toaster position="top-center" />

      {/* Cloud background */}
      <div className="clouds">
        <div className="cloud"></div>
        <div className="cloud"></div>
        <div className="cloud"></div>
      </div>

      {/* Glass card */}
      <div className="backdrop-blur-xl bg-white/20 border border-white/30 shadow-xl rounded-3xl px-8 py-10 w-full max-w-md animate-fadeIn">

        <h2 className="text-3xl font-bold text-gray-900 text-center mb-6">
          Welcome Back
        </h2>

        <form onSubmit={handleLogin} className="flex flex-col gap-5">

          {/* Email */}
          <div>
            <label className="text-gray-900 font-medium">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-3 rounded-xl border bg-white/70 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-gray-900 font-medium">Password</label>
            <div className="relative mt-1">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border bg-white/70 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3 cursor-pointer text-gray-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </span>
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl text-lg shadow-md transition"
          >
            <LogIn size={20} /> Login
          </button>

        </form>

        {/* Register */}
        <p className="text-center text-gray-900 mt-6">
          Don’t have an account?{" "}
          <button
            onClick={() => navigate("/register")}
            className="text-blue-700 font-semibold hover:underline"
          >
            Create Account
          </button>
        </p>

      </div>
    </div>
  );
};

export default Login;
