import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const getStrength = (password) => {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score <= 1) return { label: "Weak", value: 25 };
  if (score === 2) return { label: "Medium", value: 55 };
  if (score === 3) return { label: "Strong", value: 80 };
  return { label: "Very Strong", value: 100 };
};

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const strength = useMemo(
    () => getStrength(formData.password),
    [formData.password]
  );

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRegister = (e) => {
    e.preventDefault();

    const { name, email, password, confirmPassword } = formData;

    // Basic validation (connect backend later)
    if (!name || !email || !password || !confirmPassword) {
      toast.error("Please fill all fields");
      return;
    }

    if (password.length < 6) {
      toast.error("Password should be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    toast.success("Account created successfully!");
    setTimeout(() => navigate("/login"), 900);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 to-blue-400 px-6">
      <Toaster position="top-center" />

      {/* Cloud background (uses your index.css .clouds/.cloud styles) */}
      <div className="clouds">
        <div className="cloud"></div>
        <div className="cloud"></div>
        <div className="cloud"></div>
      </div>

      {/* Glass card */}
      <div className="backdrop-blur-xl bg-white/20 border border-white/30 shadow-xl rounded-3xl px-8 py-10 w-full max-w-md animate-fadeIn">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-6">
          Create Account
        </h2>

        <form onSubmit={handleRegister} className="flex flex-col gap-5">
          {/* Name */}
          <div>
            <label className="text-gray-900 font-medium">Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-3 rounded-xl border bg-white/70 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

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
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border bg-white/70 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <span
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-4 top-3 cursor-pointer text-gray-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </span>
            </div>

            {/* Strength meter */}
            <div className="mt-2">
              <div className="w-full h-2 rounded-full bg-white/60 overflow-hidden">
                <div
                  className="h-2 rounded-full bg-blue-600 transition-all"
                  style={{ width: `${strength.value}%` }}
                />
              </div>
              <p className="text-xs text-gray-800 mt-1">
                Password strength: <span className="font-semibold">{strength.label}</span>
              </p>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="text-gray-900 font-medium">Confirm Password</label>
            <div className="relative mt-1">
              <input
                type={showConfirm ? "text" : "password"}
                name="confirmPassword"
                placeholder="Re-enter your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border bg-white/70 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <span
                onClick={() => setShowConfirm((s) => !s)}
                className="absolute right-4 top-3 cursor-pointer text-gray-600"
              >
                {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
              </span>
            </div>
          </div>

          {/* Register Button */}
          <button
            type="submit"
            className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl text-lg shadow-md transition"
          >
            <UserPlus size={20} /> Register
          </button>
        </form>

        {/* Login link */}
        <p className="text-center text-gray-900 mt-6">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-blue-700 font-semibold hover:underline"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default Register;
