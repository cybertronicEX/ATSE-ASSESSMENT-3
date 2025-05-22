// src/components/RoutesWrapper.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import Landing from "../pages/Landing";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Settings from "../pages/Settings";
import { useAuth } from "../context/AuthContext";
import Booking from "../pages/Booking";
import FullScreenLoader from "./Loader";
import AvailableFlights from "../sections/Bookings/AvailableFlights";
import PrivateLayout from "./PrivateRouteLayout";
import AdminDashboard from "../pages/Admin/Admin-Dashboard";
import AdminFlights from "../pages/Admin/Admin-Flights";
import AdminPlanes from "../pages/Admin/Admin-Planes";
import AdminBooking from "../pages/Admin/Admin-Booking";

const RoutesWrapper = () => {

  const { loading, role } = useAuth();

  if (loading) {
    return <div><FullScreenLoader /></div>;
  }

  console.log(role);


  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route element={<PrivateLayout />}>

        {role === "admin" ? (
          <>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/booking" element={<AdminBooking />} />
            <Route path="/admin/flights" element={<AdminFlights />} />
            <Route path="/admin/planes" element={<AdminPlanes />} />
          </>
        ) : (
          <>
            <Route path="/dashboard" element={<Dashboard />} />

            <Route path="/booking" element={<Booking />} />
            <Route path="/available-flights" element={<AvailableFlights />} />
            <Route path="/settings" element={<Settings />} />
          </>
        )}
      </Route>
    </Routes>
  );
};

export default RoutesWrapper;
