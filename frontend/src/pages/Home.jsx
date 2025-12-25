import React from "react";
import { useNavigate } from "react-router-dom";
import { Cloud, Sun, Wind } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center py-12 px-6 overflow-hidden">

      {/* 🌥️ Animated Cloud Background */}
      <div className="clouds">
        <div className="cloud"></div>
        <div className="cloud"></div>
        <div className="cloud"></div>
      </div>

      {/* 🌤 Floating Weather Icons */}
      <div className="absolute top-12 left-10 float opacity-80">
        <Sun size={70} color="#ffd700" />
      </div>

      <div className="absolute bottom-24 right-12 float opacity-80">
        <Cloud size={80} color="#ffffff" />
      </div>

      <div className="absolute bottom-12 left-20 float opacity-80">
        <Wind size={65} color="#f0f0f0" />
      </div>

      {/* 🧊 Glassmorphism Main Container */}
      <div className="backdrop-blur-xl bg-white/20 border border-white/30 shadow-2xl rounded-3xl p-10 max-w-3xl w-full text-center animate-fadeIn">

        {/* Title */}
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 drop-shadow-lg">
          Smart Weather Forecast
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-gray-800 mt-4 max-w-2xl mx-auto">
          Real-time updates, AI insights, interactive maps & personalized recommendations — 
          all in one powerful weather dashboard.
        </p>

        {/* 🔍 Search Box UI */}
        <div className="mt-8 flex justify-center">
          <input
            type="text"
            placeholder="Search your city..."
            className="w-full max-w-md px-4 py-3 rounded-xl border bg-white/70 shadow-md focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-col md:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate("/dashboard")}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-lg shadow-lg transition"
          >
            Go to Dashboard
          </button>

          <button
            onClick={() => navigate("/login")}
            className="px-8 py-3 bg-white/80 hover:bg-white text-blue-700 border border-blue-600 rounded-xl text-lg shadow-lg transition"
          >
            Login
          </button>

          <button
            onClick={() => navigate("/register")}
            className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl text-lg shadow-lg transition"
          >
            Register
          </button>
        </div>

        {/* 🌟 Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">

          <div className="p-6 rounded-2xl bg-white/30 border shadow-md">
            <h3 className="text-xl font-bold text-gray-900">🌡 Real-Time Weather</h3>
            <p className="text-gray-700 mt-2">
              Get precise temperature, humidity, wind speed & hourly updates.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/30 border shadow-md">
            <h3 className="text-xl font-bold text-gray-900">🤖 AI Smart Insights</h3>
            <p className="text-gray-700 mt-2">
              AI suggestions like “Rain expected soon” or “High UV — be careful”.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/30 border shadow-md">
            <h3 className="text-xl font-bold text-gray-900">🗺 Live Map Search</h3>
            <p className="text-gray-700 mt-2">
              Explore weather by searching or clicking anywhere on the map.
            </p>
          </div>

        </div>
      </div>

      {/* Footer */}
      <p className="mt-10 text-gray-900 text-sm font-medium">
        © {new Date().getFullYear()} Smart Weather App — Built with ❤️ using MERN + Tailwind
      </p>
    </div>
  );
};

export default Home;
