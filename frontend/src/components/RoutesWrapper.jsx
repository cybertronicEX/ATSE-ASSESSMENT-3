// src/components/RoutesWrapper.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import Landing from "../pages/Landing";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Settings from "../pages/Settings";
import { useAuth } from "../context/AuthContext";

const RoutesWrapper = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Or a spinner/loading component
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
        path="/settings"
        element={isAuthenticated ? <Settings /> : <Navigate to="/login" />}
      />
    </Routes>
  );
};

export default RoutesWrapper;
