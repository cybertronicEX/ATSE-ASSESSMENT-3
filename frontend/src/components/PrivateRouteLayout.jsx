import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateLayout = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null; // or <Loader />
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateLayout;
