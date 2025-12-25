import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import Pages
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import AgricultureMode from "./pages/AgricultureMode";
import TravelMode from "./pages/TravelMode";
import AlertsPage from "./pages/AlertsPage";
import NotFound from "./pages/NotFound";

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { WeatherProvider } from './context/WeatherContext';
import { PreferenceProvider } from './context/PreferenceContext';

// Toast notifications
import { Toaster } from 'react-hot-toast';

// Root redirect (optional)
const Root = () => <Navigate to="/dashboard" />;

const App = () => {
  return (
    <AuthProvider>
      <WeatherProvider>
        <PreferenceProvider>
          <Router>
            <Toaster position="top-right" />
            <Routes>

              {/* Default Redirect */}
              <Route path="/" element={<Root />} />

              {/* Auth Pages */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Main Application Pages */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/agriculture" element={<AgricultureMode />} />
              <Route path="/travel" element={<TravelMode />} />
              <Route path="/alerts" element={<AlertsPage />} />

              {/* Home (optional landing) */}
              <Route path="/home" element={<Home />} />

              {/* 404 Error Page */}
              <Route path="*" element={<NotFound />} />

            </Routes>
          </Router>
        </PreferenceProvider>
      </WeatherProvider>
    </AuthProvider>
  );
};

export default App;
