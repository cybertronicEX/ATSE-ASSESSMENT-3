import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null); // NEW

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedRole = localStorage.getItem("role"); // NEW
    setIsAuthenticated(!!token);
    setRole(savedRole || null); // NEW
    setLoading(false);
  }, []);

  const login = (token, userRole) => {
    localStorage.setItem("token", token);
    if (userRole) {
      localStorage.setItem("role", userRole); // NEW
      setRole(userRole); // NEW
    }
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role"); // NEW
    setIsAuthenticated(false);
    setRole(null); // NEW
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
