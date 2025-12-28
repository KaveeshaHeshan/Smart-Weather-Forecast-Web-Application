import React, { useEffect, useMemo, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { MapPin, Bell, ThermometerSun, Save, Trash2, LogOut } from "lucide-react";

const LS_PROFILE = "smartWeather_profile";
const LS_SAVED = "smartWeather_savedLocations";
const LS_PREFS = "smartWeather_preferences";

const defaultProfile = {
  name: "Guest User",
  email: "guest@example.com",
};

const defaultPrefs = {
  unit: "C", // C or F
  alertsEnabled: true,
  agricultureMode: false,
  travelMode: true,
  dailySummary: true,
  severeAlerts: true,
};

const Profile = () => {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(defaultProfile);
  const [prefs, setPrefs] = useState(defaultPrefs);
  const [savedLocations, setSavedLocations] = useState([]);

  const [newLocation, setNewLocation] = useState("");
  const [editing, setEditing] = useState(false);

  // Load local data
  useEffect(() => {
    const p = localStorage.getItem(LS_PROFILE);
    const s = localStorage.getItem(LS_SAVED);
    const pr = localStorage.getItem(LS_PREFS);

    if (p) {
      try { setProfile(JSON.parse(p)); } catch {}
    }
    if (s) {
      try { setSavedLocations(JSON.parse(s)); } catch {}
    }
    if (pr) {
      try { setPrefs(JSON.parse(pr)); } catch {}
    }
  }, []);

  // Save to localStorage when changes happen
  useEffect(() => {
    localStorage.setItem(LS_PROFILE, JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem(LS_PREFS, JSON.stringify(prefs));
  }, [prefs]);

  useEffect(() => {
    localStorage.setItem(LS_SAVED, JSON.stringify(savedLocations));
  }, [savedLocations]);

  const handleProfileChange = (e) => {
    setProfile((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const togglePref = (key) => {
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const changeUnit = (unit) => {
    setPrefs((prev) => ({ ...prev, unit }));
  };

  const addLocation = () => {
    const name = newLocation.trim();
    if (!name) return toast.error("Enter a location name");

    const exists = savedLocations.some(
      (loc) => loc.toLowerCase() === name.toLowerCase()
    );
    if (exists) return toast.error("Location already saved");

    setSavedLocations((prev) => [name, ...prev]);
    setNewLocation("");
    toast.success("Location saved!");
  };

  const removeLocation = (loc) => {
    setSavedLocations((prev) => prev.filter((x) => x !== loc));
    toast.success("Removed from saved locations");
  };

  const saveAll = () => {
    toast.success("Profile updated!");
    setEditing(false);
  };

  const logout = () => {
    // Later: clear token + redirect
    toast.success("Logged out");
    setTimeout(() => navigate("/login"), 700);
  };

  const summaryText = useMemo(() => {
    return `${prefs.unit} • Alerts: ${prefs.alertsEnabled ? "On" : "Off"} • Daily Summary: ${
      prefs.dailySummary ? "On" : "Off"
    }`;
  }, [prefs]);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-200 to-blue-400 px-6 py-10">
      <Toaster position="top-center" />

      {/* Cloud background */}
      <div className="clouds">
        <div className="cloud"></div>
        <div className="cloud"></div>
        <div className="cloud"></div>
      </div>

      {/* Page container */}
      <div className="max-w-5xl mx-auto flex flex-col gap-6 animate-fadeIn">
        {/* Header */}
        <div className="backdrop-blur-xl bg-white/20 border border-white/30 shadow-xl rounded-3xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">👤 Profile</h1>
            <p className="text-gray-800 mt-1">{summaryText}</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => navigate("/dashboard")}
              className="px-4 py-2 rounded-xl bg-white/80 hover:bg-white text-blue-700 border border-blue-600 shadow transition"
            >
              Back to Dashboard
            </button>
            <button
              onClick={logout}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white shadow transition flex items-center gap-2"
            >
              <LogOut size={18} /> Logout
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1 backdrop-blur-xl bg-white/20 border border-white/30 shadow-xl rounded-3xl p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Account Info</h2>

            <div className="flex flex-col gap-4">
              <div>
                <label className="text-gray-900 font-medium">Full Name</label>
                <input
                  name="name"
                  value={profile.name}
                  onChange={handleProfileChange}
                  disabled={!editing}
                  className={`w-full mt-1 px-4 py-3 rounded-xl border bg-white/70 shadow-sm outline-none ${
                    editing ? "focus:ring-2 focus:ring-blue-500" : "opacity-90"
                  }`}
                />
              </div>

              <div>
                <label className="text-gray-900 font-medium">Email</label>
                <input
                  name="email"
                  value={profile.email}
                  onChange={handleProfileChange}
                  disabled={!editing}
                  className={`w-full mt-1 px-4 py-3 rounded-xl border bg-white/70 shadow-sm outline-none ${
                    editing ? "focus:ring-2 focus:ring-blue-500" : "opacity-90"
                  }`}
                />
              </div>

              <div className="flex gap-3">
                {!editing ? (
                  <button
                    onClick={() => setEditing(true)}
                    className="w-full px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow transition"
                  >
                    Edit Profile
                  </button>
                ) : (
                  <button
                    onClick={saveAll}
                    className="w-full px-4 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white shadow transition flex items-center justify-center gap-2"
                  >
                    <Save size={18} /> Save
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="lg:col-span-2 backdrop-blur-xl bg-white/20 border border-white/30 shadow-xl rounded-3xl p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Preferences</h2>

            {/* Units */}
            <div className="bg-white/30 border rounded-2xl p-4 mb-4">
              <div className="flex items-center gap-2 text-gray-900 font-semibold mb-3">
                <ThermometerSun size={18} />
                Temperature Units
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => changeUnit("C")}
                  className={`px-4 py-2 rounded-xl border shadow-sm transition ${
                    prefs.unit === "C"
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white/70 text-gray-900 hover:bg-white"
                  }`}
                >
                  Celsius (°C)
                </button>
                <button
                  onClick={() => changeUnit("F")}
                  className={`px-4 py-2 rounded-xl border shadow-sm transition ${
                    prefs.unit === "F"
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white/70 text-gray-900 hover:bg-white"
                  }`}
                >
                  Fahrenheit (°F)
                </button>
              </div>
            </div>

            {/* Toggles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/30 border rounded-2xl p-4">
                <div className="flex items-center gap-2 font-semibold text-gray-900 mb-2">
                  <Bell size={18} /> Alerts
                </div>

                <label className="flex items-center justify-between">
                  <span className="text-gray-800">Enable alerts</span>
                  <input
                    type="checkbox"
                    checked={prefs.alertsEnabled}
                    onChange={() => togglePref("alertsEnabled")}
                    className="w-5 h-5"
                  />
                </label>

                <label className="flex items-center justify-between mt-3">
                  <span className="text-gray-800">Severe alerts</span>
                  <input
                    type="checkbox"
                    checked={prefs.severeAlerts}
                    onChange={() => togglePref("severeAlerts")}
                    className="w-5 h-5"
                  />
                </label>

                <label className="flex items-center justify-between mt-3">
                  <span className="text-gray-800">Daily summary</span>
                  <input
                    type="checkbox"
                    checked={prefs.dailySummary}
                    onChange={() => togglePref("dailySummary")}
                    className="w-5 h-5"
                  />
                </label>
              </div>

              <div className="bg-white/30 border rounded-2xl p-4">
                <div className="flex items-center gap-2 font-semibold text-gray-900 mb-2">
                  <MapPin size={18} /> Modes
                </div>

                <label className="flex items-center justify-between">
                  <span className="text-gray-800">Agriculture mode</span>
                  <input
                    type="checkbox"
                    checked={prefs.agricultureMode}
                    onChange={() => togglePref("agricultureMode")}
                    className="w-5 h-5"
                  />
                </label>

                <label className="flex items-center justify-between mt-3">
                  <span className="text-gray-800">Travel mode</span>
                  <input
                    type="checkbox"
                    checked={prefs.travelMode}
                    onChange={() => togglePref("travelMode")}
                    className="w-5 h-5"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Saved Locations */}
        <div className="backdrop-blur-xl bg-white/20 border border-white/30 shadow-xl rounded-3xl p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Saved Locations</h2>

          <div className="flex flex-col md:flex-row gap-3">
            <input
              value={newLocation}
              onChange={(e) => setNewLocation(e.target.value)}
              placeholder="Add a city (e.g., Kandy, Galle)"
              className="flex-1 px-4 py-3 rounded-xl border bg-white/70 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <button
              onClick={addLocation}
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow transition flex items-center justify-center gap-2"
            >
              <Save size={18} /> Save
            </button>
          </div>

          {savedLocations.length === 0 ? (
            <p className="text-gray-800 mt-4">No saved locations yet.</p>
          ) : (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {savedLocations.map((loc) => (
                <div
                  key={loc}
                  className="bg-white/30 border rounded-2xl p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2 text-gray-900 font-semibold">
                    <MapPin size={18} />
                    <span>{loc}</span>
                  </div>
                  <button
                    onClick={() => removeLocation(loc)}
                    className="text-red-700 hover:text-red-900 transition"
                    title="Remove"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <p className="text-xs text-gray-800 mt-4 italic">
            Tip: Later we’ll connect this to MongoDB so each user’s saved locations are stored permanently.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
