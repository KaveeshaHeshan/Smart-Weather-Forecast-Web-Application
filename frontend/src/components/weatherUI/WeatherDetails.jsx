import React from "react";
import dayjs from "dayjs";

const WeatherDetails = ({ weather }) => {
  if (!weather) return null;

  const temp = (weather.main?.temp - 273.15).toFixed(1);
  const feelsLike = (weather.main?.feels_like - 273.15).toFixed(1);
  const humidity = weather.main?.humidity;
  const pressure = weather.main?.pressure;
  const visibility = weather.visibility / 1000; // meters → km
  const wind = weather.wind?.speed;
  const sunrise = weather.sys?.sunrise;
  const sunset = weather.sys?.sunset;

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-2xl mx-auto border border-gray-100 hover:shadow-xl transition">
      
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Weather Details
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">

        {/* Temperature */}
        <div className="p-4 bg-blue-50 rounded-lg text-center">
          <p className="text-gray-500 text-sm">Temperature</p>
          <p className="font-bold text-gray-800 text-lg">{temp}°C</p>
        </div>

        {/* Feels Like */}
        <div className="p-4 bg-blue-50 rounded-lg text-center">
          <p className="text-gray-500 text-sm">Feels Like</p>
          <p className="font-bold text-gray-800 text-lg">{feelsLike}°C</p>
        </div>

        {/* Humidity */}
        <div className="p-4 bg-blue-50 rounded-lg text-center">
          <p className="text-gray-500 text-sm">Humidity</p>
          <p className="font-bold text-gray-800 text-lg">{humidity}%</p>
        </div>

        {/* Pressure */}
        <div className="p-4 bg-blue-50 rounded-lg text-center">
          <p className="text-gray-500 text-sm">Pressure</p>
          <p className="font-bold text-gray-800 text-lg">{pressure} hPa</p>
        </div>

        {/* Visibility */}
        <div className="p-4 bg-blue-50 rounded-lg text-center">
          <p className="text-gray-500 text-sm">Visibility</p>
          <p className="font-bold text-gray-800 text-lg">{visibility} km</p>
        </div>

        {/* Wind Speed */}
        <div className="p-4 bg-blue-50 rounded-lg text-center">
          <p className="text-gray-500 text-sm">Wind Speed</p>
          <p className="font-bold text-gray-800 text-lg">{wind} m/s</p>
        </div>

        {/* Sunrise */}
        <div className="p-4 bg-yellow-50 rounded-lg text-center">
          <p className="text-gray-500 text-sm">Sunrise</p>
          <p className="font-bold text-gray-800 text-lg">
            {dayjs(sunrise * 1000).format("hh:mm A")}
          </p>
        </div>

        {/* Sunset */}
        <div className="p-4 bg-orange-50 rounded-lg text-center">
          <p className="text-gray-500 text-sm">Sunset</p>
          <p className="font-bold text-gray-800 text-lg">
            {dayjs(sunset * 1000).format("hh:mm A")}
          </p>
        </div>

      </div>
    </div>
  );
};

export default WeatherDetails;
