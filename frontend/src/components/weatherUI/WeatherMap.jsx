import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import axios from "axios";

// --- FIX LEAFLET DEFAULT ICON ISSUE ---
const weatherIcon = (icon) =>
  new L.Icon({
    iconUrl: `https://openweathermap.org/img/wn/${icon || "01d"}@2x.png`,
    iconSize: [50, 50],
    iconAnchor: [25, 45],
  });

// --- Helper: move map when coords change ---
const ChangeMapView = ({ coords }) => {
  const map = useMap();
  useEffect(() => {
    if (coords) map.flyTo(coords, 11);
  }, [coords]);
  return null;
};

// --- Helper: handle click on map to fetch weather ---
const MapClickHandler = ({ onMapClick }) => {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng);
    },
  });
  return null;
};

// --- Smart hint generator (fake AI but smart rules) ---
const getSmartHint = (weather, recent) => {
  if (!weather && recent.length === 0) {
    return "Hint: Try searching your city (e.g., Colombo, Kandy, Galle) to see live weather on the map.";
  }

  if (weather) {
    const tempC = (weather.main.temp - 273.15).toFixed(1);
    const condition = weather.weather[0].main.toLowerCase();

    if (condition.includes("rain")) {
      return "It's raining here. Hint: Check coastal cities like Galle or Negombo to compare rainfall patterns.";
    }
    if (tempC > 32) {
      return "It's quite hot! Hint: Try hill-country locations like Kandy or Nuwara Eliya for cooler weather.";
    }
    if (tempC < 22) {
      return "Cool temperature here. Hint: Compare with dry-zone cities like Anuradhapura or Trincomalee.";
    }
  }

  if (recent.length > 0) {
    const last = recent[0];
    return `You recently checked ${last.name}. Hint: You can tap on the map anywhere to instantly view weather there.`;
  }

  return "Hint: Click anywhere on the map to get weather for that exact spot.";
};

const LOCAL_STORAGE_KEY = "smartWeather_recentLocations";

const WeatherMap = ({ apiKey }) => {
  const [query, setQuery] = useState("");
  const [coords, setCoords] = useState([6.9271, 79.8612]); // Default: Colombo
  const [weather, setWeather] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [recentLocations, setRecentLocations] = useState([]);
  const [error, setError] = useState(null);

  // ---- Load recent locations from localStorage ----
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        setRecentLocations(JSON.parse(saved));
      } catch {
        setRecentLocations([]);
      }
    }
  }, []);

  // ---- Save recent locations to localStorage ----
  const updateRecentLocations = (loc) => {
    const exists = recentLocations.find(
      (item) => item.lat === loc.lat && item.lon === loc.lon
    );
    let updated = [...recentLocations];

    if (!exists) {
      updated = [loc, ...recentLocations].slice(0, 5); // keep last 5
    }

    setRecentLocations(updated);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  };

  // ---- Fetch weather by coordinates ----
  const fetchWeatherByCoords = async (lat, lon) => {
    try {
      const res = await axios.get("https://api.openweathermap.org/data/2.5/weather", {
        params: { lat, lon, appid: apiKey },
      });
      setWeather(res.data);
      setError(null);

      // also save to recent
      updateRecentLocations({
        name: res.data.name,
        lat,
        lon,
      });
    } catch (err) {
      console.error(err);
      setError("Weather data not found for this location.");
    }
  };

  // ---- Initial fetch for default location ----
  useEffect(() => {
    fetchWeatherByCoords(coords[0], coords[1]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- Handle search typing (autocomplete using OpenWeather Geo API) ----
  const handleSearchChange = async (e) => {
    const value = e.target.value;
    setQuery(value);
    if (value.length < 3) {
      setSuggestions([]);
      return;
    }

    try {
      const geoRes = await axios.get(
        "https://api.openweathermap.org/geo/1.0/direct",
        {
          params: {
            q: value,
            limit: 5,
            appid: apiKey,
          },
        }
      );

      setSuggestions(
        geoRes.data.map((item) => ({
          name: `${item.name}${item.state ? ", " + item.state : ""}, ${
            item.country
          }`,
          lat: item.lat,
          lon: item.lon,
        }))
      );
    } catch (err) {
      console.error(err);
      setSuggestions([]);
    }
  };

  // ---- When user picks a suggestion ----
  const handleSuggestionClick = (loc) => {
    setQuery(loc.name);
    setSuggestions([]);
    setCoords([loc.lat, loc.lon]);
    fetchWeatherByCoords(loc.lat, loc.lon);
  };

  // ---- Manual search submit (press Enter / click Search) ----
  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (!query) return;
    // If suggestions exist, choose the first one
    if (suggestions.length > 0) {
      handleSuggestionClick(suggestions[0]);
      return;
    }
    // Otherwise, try direct search via Geo API
    try {
      const geoRes = await axios.get(
        "https://api.openweathermap.org/geo/1.0/direct",
        {
          params: {
            q: query,
            limit: 1,
            appid: apiKey,
          },
        }
      );
      if (geoRes.data.length === 0) {
        setError("Location not found.");
        return;
      }
      const { lat, lon, name, country, state } = geoRes.data[0];
      const locName = `${name}${state ? ", " + state : ""}, ${country}`;
      setCoords([lat, lon]);
      fetchWeatherByCoords(lat, lon);
      setQuery(locName);
      setSuggestions([]);
    } catch (err) {
      console.error(err);
      setError("Failed to search location.");
    }
  };

  // ---- Handle clicking on map to get weather ----
  const handleMapClick = (latlng) => {
    const { lat, lng } = latlng;
    setCoords([lat, lng]);
    fetchWeatherByCoords(lat, lng);
  };

  const smartHint = getSmartHint(weather, recentLocations);

  return (
    <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200 flex flex-col gap-4">
      <h2 className="text-xl font-semibold text-gray-800">
        🌍 Search & Explore Weather on Map
      </h2>

      {/* Search Bar + Suggestions */}
      <form onSubmit={handleSearchSubmit} className="relative flex flex-col gap-2">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search location (e.g., Colombo, Kandy, Galle)..."
            className="flex-1 p-2 rounded-lg border text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={query}
            onChange={handleSearchChange}
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 rounded-lg hover:bg-blue-700"
          >
            Search
          </button>
        </div>

        {/* Autocomplete suggestions */}
        {suggestions.length > 0 && (
          <ul className="absolute top-12 left-0 right-0 bg-white border rounded-lg shadow-md z-10 max-h-48 overflow-y-auto">
            {suggestions.map((s, idx) => (
              <li
                key={idx}
                className="px-3 py-2 hover:bg-blue-50 cursor-pointer text-sm"
                onClick={() => handleSuggestionClick(s)}
              >
                {s.name}
              </li>
            ))}
          </ul>
        )}
      </form>

      {/* Error message */}
      {error && <p className="text-red-600 text-sm">{error}</p>}

      {/* Smart AI-like hint */}
      <p className="text-xs text-gray-500 italic">💡 {smartHint}</p>

      {/* Recent search history */}
      {recentLocations.length > 0 && (
        <div className="flex flex-wrap gap-2 text-sm">
          <span className="text-gray-600 font-medium">Recent:</span>
          {recentLocations.map((loc, idx) => (
            <button
              key={idx}
              className="px-2 py-1 bg-gray-100 rounded-full hover:bg-gray-200"
              onClick={() => {
                setCoords([loc.lat, loc.lon]);
                fetchWeatherByCoords(loc.lat, loc.lon);
              }}
            >
              {loc.name}
            </button>
          ))}
        </div>
      )}

      {/* Map */}
      <MapContainer
        center={coords}
        zoom={11}
        scrollWheelZoom={true}
        className="h-80 w-full rounded-lg"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* Move map when coords change */}
        <ChangeMapView coords={coords} />

        {/* Click handler */}
        <MapClickHandler onMapClick={handleMapClick} />

        {/* Weather marker */}
        {weather && (
          <Marker
            position={coords}
            icon={weatherIcon(weather.weather[0].icon)}
          >
            <Popup>
              <div className="text-center">
                <b>{weather.name}</b> <br />
                {weather.weather[0].description} <br />
                Temp: {(weather.main.temp - 273.15).toFixed(1)}°C <br />
                Humidity: {weather.main.humidity}% <br />
                Wind: {weather.wind.speed} m/s
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};

export default WeatherMap;
