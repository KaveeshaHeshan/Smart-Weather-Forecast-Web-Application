import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

const ForecastChart = ({ forecast }) => {
  if (!forecast || !forecast.list) return null;

  // Convert OpenWeather data → chart-friendly format
  const chartData = forecast.list.slice(0, 8).map((item) => ({
    time: new Date(item.dt * 1000).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    temp: (item.main.temp - 273.15).toFixed(1), // Kelvin → Celsius
  }));

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 w-full mx-auto border border-gray-100 hover:shadow-xl transition">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Next Hours Temperature
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-40" />

          <XAxis
            dataKey="time"
            stroke="#555"
            tick={{ fontSize: 12 }}
          />

          <YAxis
            stroke="#555"
            tick={{ fontSize: 12 }}
            domain={["auto", "auto"]}
            label={{ value: "°C", angle: -90, position: "insideLeft" }}
          />

          <Tooltip
            contentStyle={{
              backgroundColor: "#ffffff",
              borderRadius: "8px",
              border: "1px solid #ddd",
              padding: "10px",
            }}
          />

          <Line
            type="monotone"
            dataKey="temp"
            stroke="#3b82f6"
            strokeWidth={3}
            dot={{ r: 4, strokeWidth: 2, fill: "#3b82f6" }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ForecastChart;
