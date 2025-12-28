import React, { useEffect, useMemo, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Leaf, Droplets, CloudRain, ThermometerSun, MapPin, RefreshCcw } from "lucide-react";
import Loader from "../components/ui/Loader";
import { getCurrentWeather, getForecast } from "../services/weatherService";

/**
 * RULE-BASED "SMART" AGRICULTURE INSIGHTS
 * (Later you can replace this with a trained ML model)
 */
const buildAgriInsights = ({ weather, forecast }) => {
  const insights = [];
  if (!weather) return insights;

  const tempC = weather.main?.temp ? weather.main.temp - 273.15 : null;
  const humidity = weather.main?.humidity ?? null;
  const wind = weather.wind?.speed ?? null;
  const condition = (weather.weather?.[0]?.main || "").toLowerCase();

  // Rain advice
  if (condition.includes("rain")) {
    insights.push({
      title: "Rain detected",
      msg: "Avoid watering now. Natural rainfall is already providing moisture.",
      icon: "rain",
    });
  } else {
    insights.push({
      title: "No rain right now",
      msg: "Watering is possible. Check rainfall chance in next few hours.",
      icon: "water",
    });
  }

  // Heat advice
  if (tempC !== null && tempC >= 32) {
    insights.push({
      title: "High temperature",
      msg: "Water early morning or late evening to reduce evaporation.",
      icon: "temp",
    });
  } else if (tempC !== null && tempC <= 22) {
    insights.push({
      title: "Cool weather",
      msg: "Evaporation is low. Moderate watering is sufficient.",
      icon: "temp",
    });
  }

  // Wind advice
  if (wind !== null && wind >= 8) {
    insights.push({
      title: "Strong winds",
      msg: "Avoid spraying pesticides/fertilizers now. Wind can cause drift and waste.",
      icon: "wind",
    });
  }

  // Humidity → fungal risk
  if (humidity !== null && humidity >= 80) {
    insights.push({
      title: "High humidity",
      msg: "Higher risk of fungal disease. Improve airflow and monitor leaves.",
      icon: "humidity",
    });
  }

  // Forecast-based watering time suggestion
  // If forecast exists, take next ~8 points (3-hour steps) and find the first low-rain slot.
  if (Array.isArray(forecast) && forecast.length > 0) {
    const nextSlots = forecast.slice(0, 8); // roughly next 24 hours
    const lowRainSlot = nextSlots.find((x) => (x.pop ?? 0) < 0.2);

    if (lowRainSlot?.dt_txt) {
      insights.push({
        title: "Best watering time (next 24h)",
        msg: `Low rain probability around: ${lowRainSlot.dt_txt}.`,
        icon: "calendar",
      });
    } else {
      insights.push({
        title: "Rain likely",
        msg: "Rain probability is high in most upcoming hours — watering can be reduced.",
        icon: "calendar",
      });
    }
  }

  return insights;
};

// Simple “soil moisture prediction” demo (rule-based)
const estimateSoilMoisture = ({ weather, forecast }) => {
  if (!weather) return { level: "Unknown", percent: 0 };

  const humidity = weather.main?.humidity ?? 50;
  const condition = (weather.weather?.[0]?.main || "").toLowerCase();

  let base = Math.min(Math.max(humidity, 30), 95);

  if (condition.includes("rain")) base = Math.min(base + 20, 100);
  if (condition.includes("clear") || condition.includes("sun")) base = Math.max(base - 10, 0);

  // If forecast shows upcoming rain, boost a bit
  if (Array.isArray(forecast) && forecast.slice(0, 8).some((x) => (x.pop ?? 0) > 0.5)) {
    base = Math.min(base + 10, 100);
  }

  const percent = Math.round(base);

  let level = "Medium";
  if (percent >= 75) level = "High";
  if (percent <= 40) level = "Low";

  return { level, percent };
};

const AgricultureMode = () => {
  const [location, setLocation] = useState("Colombo");
  const [coords, setCoords] = useState({ lat: 6.9271, lon: 79.8612 });

  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null); // expect list array for insights
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  const fetchAll = async (lat, lon) => {
    try {
      setLoading(true);
      setError(null);

      const w = await getCurrentWeather(lat, lon);
      setWeather(w.weather);

      const f = await getForecast(lat, lon);

      // Many forecast APIs return { list: [...] }.
      // Your getForecast may already return list. This handles both.
      const list = Array.isArray(f) ? f : f?.list || [];
      setForecast(list);

      toast.success("Agriculture weather updated");
    } catch (e) {
      console.error(e);
      setError("Failed to load agriculture weather data");
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  // First load
  useEffect(() => {
    fetchAll(coords.lat, coords.lon);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Basic Geo search using OpenWeather Geo API (front-end only)
  const handleSearch = async () => {
    if (!location.trim()) return toast.error("Enter a location");

    try {
      setLoading(true);
      setError(null);

      const res = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
          location
        )}&limit=1&appid=${import.meta.env.VITE_WEATHER_API_KEY}`
      );

      const data = await res.json();
      if (!Array.isArray(data) || data.length === 0) {
        setError("Location not found");
        toast.error("Location not found");
        setLoading(false);
        return;
      }

      const { lat, lon, name, country, state } = data[0];
      setCoords({ lat, lon });
      setLocation(`${name}${state ? ", " + state : ""}, ${country}`);

      await fetchAll(lat, lon);
    } catch (e) {
      console.error(e);
      setError("Search failed");
      toast.error("Search failed");
      setLoading(false);
    }
  };

  const insights = useMemo(() => buildAgriInsights({ weather, forecast }), [weather, forecast]);
  const soil = useMemo(() => estimateSoilMoisture({ weather, forecast }), [weather, forecast]);

  if (loading) return <Loader />;

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-6">
        <div className="bg-white rounded-xl shadow-md p-6 text-center">
          <p className="text-red-600 font-semibold">{error}</p>
          <button
            onClick={() => fetchAll(coords.lat, coords.lon)}
            className="mt-4 px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const tempC = weather?.main?.temp ? (weather.main.temp - 273.15).toFixed(1) : "—";
  const humidity = weather?.main?.humidity ?? "—";
  const wind = weather?.wind?.speed ?? "—";
  const condition = weather?.weather?.[0]?.description ?? "—";

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-green-100 to-green-300 px-6 py-10">
      <Toaster position="top-center" />

      {/* Cloud background */}
      <div className="clouds">
        <div className="cloud"></div>
        <div className="cloud"></div>
        <div className="cloud"></div>
      </div>

      <div className="max-w-6xl mx-auto flex flex-col gap-6 animate-fadeIn">
        {/* Header */}
        <div className="backdrop-blur-xl bg-white/20 border border-white/30 shadow-xl rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-2">
              <Leaf /> Agriculture Mode
            </h1>
            <p className="text-gray-800 mt-1">
              Farmer-friendly insights: watering time, rain impact, and crop safety tips.
            </p>
          </div>

          <button
            onClick={() => fetchAll(coords.lat, coords.lon)}
            className="px-4 py-2 rounded-xl bg-white/80 hover:bg-white text-green-700 border border-green-600 shadow transition flex items-center gap-2"
          >
            <RefreshCcw size={18} /> Refresh
          </button>
        </div>

        {/* Search */}
        <div className="backdrop-blur-xl bg-white/20 border border-white/30 shadow-xl rounded-3xl p-6">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1">
              <label className="text-gray-900 font-medium flex items-center gap-2">
                <MapPin size={18} /> Farm Location
              </label>
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Search village/city (e.g., Kurunegala, Matale)"
                className="w-full mt-1 px-4 py-3 rounded-xl border bg-white/70 shadow-sm focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>
            <button
              onClick={handleSearch}
              className="mt-6 md:mt-0 px-6 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white shadow transition"
            >
              Search
            </button>
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white/40 border rounded-2xl p-5 shadow-md">
            <div className="flex items-center gap-2 text-gray-900 font-semibold">
              <ThermometerSun size={18} /> Temperature
            </div>
            <p className="text-3xl font-bold text-gray-900 mt-2">{tempC}°C</p>
            <p className="text-gray-700 mt-1 capitalize">{condition}</p>
          </div>

          <div className="bg-white/40 border rounded-2xl p-5 shadow-md">
            <div className="flex items-center gap-2 text-gray-900 font-semibold">
              <Droplets size={18} /> Humidity
            </div>
            <p className="text-3xl font-bold text-gray-900 mt-2">{humidity}%</p>
            <p className="text-gray-700 mt-1">Affects soil moisture & disease</p>
          </div>

          <div className="bg-white/40 border rounded-2xl p-5 shadow-md">
            <div className="flex items-center gap-2 text-gray-900 font-semibold">
              <CloudRain size={18} /> Rain/Wind
            </div>
            <p className="text-3xl font-bold text-gray-900 mt-2">{wind} m/s</p>
            <p className="text-gray-700 mt-1">Wind impacts spraying</p>
          </div>

          <div className="bg-white/40 border rounded-2xl p-5 shadow-md">
            <div className="flex items-center gap-2 text-gray-900 font-semibold">
              🌱 Soil Moisture (Predicted)
            </div>
            <p className="text-3xl font-bold text-gray-900 mt-2">{soil.percent}%</p>
            <p className="text-gray-700 mt-1">Level: <b>{soil.level}</b></p>
          </div>
        </div>

        {/* Smart Insights */}
        <div className="backdrop-blur-xl bg-white/20 border border-white/30 shadow-xl rounded-3xl p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">🧠 Smart Agriculture Insights</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {insights.map((x, idx) => (
              <div key={idx} className="bg-white/40 border rounded-2xl p-5 shadow-sm">
                <h3 className="text-gray-900 font-semibold">{x.title}</h3>
                <p className="text-gray-800 mt-2">{x.msg}</p>
              </div>
            ))}
          </div>

          <p className="text-xs text-gray-800 mt-4 italic">
            Note: This is rule-based “AI-like” logic now. Later you can replace with ML models (rain prediction, flood risk, crop disease risk).
          </p>
        </div>

        {/* Daily Tips */}
        <div className="backdrop-blur-xl bg-white/20 border border-white/30 shadow-xl rounded-3xl p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3">🌾 Daily Farming Tips</h2>

          <ul className="list-disc pl-6 text-gray-800 space-y-2">
            <li>Water early morning (5–8 AM) or late evening (4–6 PM) to reduce evaporation.</li>
            <li>If humidity is high, check for fungal diseases and improve airflow.</li>
            <li>Avoid spraying during strong winds to prevent chemical drift.</li>
            <li>After heavy rain, wait before fertilizing to avoid nutrient runoff.</li>
            <li>Save your farm locations in Profile for quick access later.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AgricultureMode;
