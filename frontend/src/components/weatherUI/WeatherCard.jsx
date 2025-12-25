import React from "react";

const WeatherCard = ({ weather }) => {
  if (!weather) return null;

  // Extract values
  const temp = (weather.main?.temp - 273.15).toFixed(1);
  const feelsLike = (weather.main?.feels_like - 273.15).toFixed(1);
  const humidity = weather.main?.humidity;
  const wind = weather.wind?.speed;
  const condition = weather.weather?.[0]?.description;
  const icon = weather.weather?.[0]?.icon;
  const location = weather.name;

  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-sm mx-auto border border-gray-100 transition transform hover:-translate-y-1 hover:shadow-xl flex flex-col items-center gap-4">

      {/* Location */}
      <h2 className="text-2xl font-semibold text-gray-800 tracking-wide">
        {location || "Unknown Location"}
      </h2>

      {/* Weather Icon */}
      <div className="flex justify-center">
        <img
          src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
          alt="weather icon"
          className="w-24 h-24"
        />
      </div>

      {/* Temperature */}
      <h1 className="text-6xl font-bold text-blue-600">
        {temp}°C
      </h1>

      {/* Condition */}
      <p className="text-gray-600 capitalize text-lg -mt-3">
        {condition}
      </p>

      {/* Weather Details Row */}
      <div className="w-full grid grid-cols-3 gap-3 mt-4 text-center">

        <div className="bg-blue-50 p-2 rounded-xl">
          <p className="text-xs text-gray-500">Humidity</p>
          <p className="font-semibold text-gray-800">{humidity}%</p>
        </div>

        <div className="bg-blue-50 p-2 rounded-xl">
          <p className="text-xs text-gray-500">Wind</p>
          <p className="font-semibold text-gray-800">{wind} m/s</p>
        </div>

        <div className="bg-blue-50 p-2 rounded-xl">
          <p className="text-xs text-gray-500">Feels Like</p>
          <p className="font-semibold text-gray-800">{feelsLike}°C</p>
        </div>

      </div>
    </div>
  );
};

export default WeatherCard;
