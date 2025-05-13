// src/components/RoutesWrapper.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import Landing from "../pages/Landing";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Settings from "../pages/Settings";
import { useAuth } from "../context/AuthContext";
import Booking from "../pages/Booking";
import FullScreenLoader from "./Loader";

const RoutesWrapper = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div><FullScreenLoader /></div>;
  }

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard"
        element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
      />
      <Route
        path="/Booking"
        element={isAuthenticated ? <Booking /> : <Navigate to="/login" />}
      />
      <Route
        path="/settings"
        element={isAuthenticated ? <Settings /> : <Navigate to="/login" />}
      />
    </Routes>
  );
};

export default RoutesWrapper;
