import React, { useEffect, useState } from "react";
import WeatherCard from "../components/weatherUI/WeatherCard";
import WeatherDetails from "../components/weatherUI/WeatherDetails";
import SmartInsights from "../components/weatherUI/SmartInsights";
import AiRecommendations from "../components/assistant/AiRecommendations";
import ForecastChart from "../components/weatherUI/ForecastChart";
import WeatherMap from "../components/weatherUI/WeatherMap";

import { getCurrentWeather, getForecast } from "../services/weatherService";
import Loader from "../components/ui/Loader";

const Dashboard = () => {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState(null);

  // TEMP DEFAULT COLOMBO COORDS
  const defaultCoords = { lat: 6.9271, lon: 79.8612 };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch weather + AI insights
        const weatherResponse = await getCurrentWeather(defaultCoords.lat, defaultCoords.lon);

        setWeather(weatherResponse.weather);
        setInsights(weatherResponse.insights);
        setRecommendations(weatherResponse.recommendations);

        // Fetch forecast graph data
        const forecastResponse = await getForecast(defaultCoords.lat, defaultCoords.lon);
        setForecast(forecastResponse);

      } catch (err) {
        console.error(err);
        setError("Failed to load weather data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Loading state
  if (loading) return <Loader />;

  // Error UI
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 text-lg">
        {error}
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col gap-6">

      {/* Heading */}
      <h1 className="text-3xl font-bold text-gray-800 text-center">
        🌦 Smart Weather Dashboard
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Weather Card */}
        <div className="col-span-1 flex justify-center">
          <WeatherCard weather={weather} />
        </div>

        {/* Insights + AI Assistant */}
        <div className="col-span-2 flex flex-col gap-6">
          <SmartInsights insights={insights} />
          <AiRecommendations recommendations={recommendations} />
        </div>

      </div>

      {/* Forecast Chart */}
      <div className="mt-6">
        <ForecastChart forecast={forecast} />
      </div>

      {/* 🌍 Weather Map Search System */}
      <div className="mt-6">
        <WeatherMap apiKey={import.meta.env.VITE_WEATHER_API_KEY} />
      </div>

      {/* Weather Details */}
      <div className="mt-6">
        <WeatherDetails weather={weather} />
      </div>

    </div>
  );
};

export default Dashboard;
