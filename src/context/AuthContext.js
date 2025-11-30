import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        if (parsed?.token) {
          setUser(parsed);
          setToken(parsed.token);
        }
      }
    } catch (err) {
      console.error("LocalStorage error:", err);
      localStorage.removeItem("user");
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshUser = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) return;

      const updatedUser = await res.json();

      const newUser = {
        ...user,
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        role: updatedUser.role,
        profileImage: updatedUser.profileImage || updatedUser.url || null,

      };

      setUser(newUser);
      localStorage.setItem("user", JSON.stringify(newUser));

      console.log("User refreshed:", newUser);

    } catch (err) {
      console.error("refreshUser error:", err);
    }
  };

  const login = (token, id, email, fullName, role, profileImage) => {
    const loggedInUser = { id, token, email, fullName, role, profileImage };

    localStorage.setItem("user", JSON.stringify(loggedInUser));
    setUser(loggedInUser);
    setToken(token);

    console.log("User logged in:", loggedInUser);
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setToken(null);
  };

  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated,
        loading,
        refreshUser,  
        setUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
