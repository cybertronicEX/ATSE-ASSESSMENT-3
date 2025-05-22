import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null); // NEW
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedRole = localStorage.getItem("role");
    const savedUserId = localStorage.getItem("userId") // NEW
    setIsAuthenticated(!!token);
    setRole(savedRole || null);
    setUserId(savedUserId || null) // NEW
    setLoading(false);
  }, []);

  const login = (token, userRole, userId) => {
    localStorage.setItem("token", token);
    if (userRole) {
      localStorage.setItem("role", userRole); // NEW
      setRole(userRole); // NEW
    }
    if (userId) {
      localStorage.setItem("userId", userId); // NEW
      setUserId(userId);
    }
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role"); // NEW
    setIsAuthenticated(false);
    setRole(null); // NEW
    setUserId(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
