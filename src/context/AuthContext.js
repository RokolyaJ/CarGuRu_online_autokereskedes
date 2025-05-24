import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      if (currentUser) {
        await checkAdminRole(currentUser.uid);
      } else {
        setIsAdmin(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const checkAdminRole = async (userId) => {
    try {
      const userDoc = await getDoc(doc(db, "users", userId));
      setIsAdmin(userDoc.exists() && userDoc.data().role === "admin");
    } catch (error) {
      console.error("Hiba az admin jogosultság ellenőrzésekor:", error);
      setIsAdmin(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setIsAdmin(false);
    } catch (error) {
      console.error("Hiba a kijelentkezés során:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("A useAuth() csak AuthProvider belsejében használható!");
  }
  return context;
};
