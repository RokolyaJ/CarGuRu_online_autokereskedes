import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FiUser, FiShoppingCart, FiHeart, FiMapPin } from "react-icons/fi";

function Navbar() {
  const { user, isAdmin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const isConfiguratorPage = location.pathname.startsWith("/configurator");
  const isHomePage = location.pathname === "/";

  const pathParts = location.pathname.split("/");
  const selectedBrand = pathParts[2] || "";
  const selectedModelSlug = pathParts[3] || "";
  const variantId = pathParts[3] || "";

  useEffect(() => {
    const path = location.pathname;
    if (path === "/configurator") setStep(1);
    else if (path.match(/^\/configurator\/[a-z]+$/)) setStep(2);
    else if (path.match(/^\/configurator\/[a-z]+\/[a-z0-9-]+$/)) setStep(3);
    else if (path.includes("/appearance")) setStep(4);
    else if (path.includes("/equipment")) setStep(5);
    else if (path.includes("/summary")) setStep(6);
  }, [location.pathname]);

  return (
    <>
      <nav style={{
        ...styles.navbar,
        background: isConfiguratorPage
          ? "linear-gradient(to right, #0f2027, #203a43, #2c5364)"
          : "#000",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <img src="/images/logo/logo.png" alt="CarGuRu Logo" style={styles.logo} />
          <Link to="/" style={styles.brand}>CarGuRu</Link>
          {isHomePage && (
            <Link to="/used-cars" style={styles.usedCarsButton}>Használtautók</Link>
          )}
        </div>

        {isHomePage && (
          <div style={styles.iconContainer}>
            {user && (
              <>
                <Link to="/favorites" style={styles.iconLink}><FiHeart size={22} /></Link>
                <Link to="/cart" style={styles.iconLink}><FiShoppingCart size={22} /></Link>
                <Link to="/locations" style={styles.iconLink}><FiMapPin size={22} /></Link>
              </>
            )}
            <Link to="/configurator" style={styles.configuratorButton}>Konfigurátor</Link>
            {!user ? (
              <Link to="/auth" style={styles.iconLink}><FiUser size={22} /></Link>
            ) : (
              <button onClick={logout} style={styles.iconButton}>Kijelentkezés</button>
            )}
          </div>
        )}
      </nav>

      {isConfiguratorPage && (
        <div style={styles.subMenu}>
          <button style={styles.subMenuItem} onClick={() => navigate("/configurator")}>
            Márkák
          </button>
          <button
            style={{
              ...styles.subMenuItem,
              color: step >= 2 ? "#000" : "#999",
              cursor: step >= 2 ? "pointer" : "not-allowed",
            }}
            disabled={step < 2}
            onClick={() => {
              if (step >= 2 && selectedBrand) {
                navigate(`/configurator/${selectedBrand}`);
              }
            }}
          >
            Modellek
          </button>
          <button
            style={{
              ...styles.subMenuItem,
              color: step >= 3 ? "#000" : "#999",
              cursor: step >= 3 ? "pointer" : "not-allowed",
            }}
            disabled={step < 3}
            onClick={() => {
              if (step >= 3 && selectedBrand && selectedModelSlug) {
                navigate(`/configurator/${selectedBrand}/${selectedModelSlug}`);
              }
            }}
          >
            Változat
          </button>
          <button
            style={{
              ...styles.subMenuItem,
              color: step >= 4 ? "#000" : "#999",
              cursor: step >= 4 ? "pointer" : "not-allowed",
            }}
            disabled={step < 4}
            onClick={() => {
              if (step >= 4 && selectedBrand && variantId) {
                navigate(`/configurator/${selectedBrand}/${variantId}/appearance`);
              }
            }}
          >
            Megjelenés
          </button>
          <button
            style={{
              ...styles.subMenuItem,
              color: step >= 5 ? "#000" : "#999",
              cursor: step >= 5 ? "pointer" : "not-allowed",
            }}
            disabled={step < 5}
            onClick={() => {
              if (step >= 5 && selectedBrand && variantId) {
                navigate(`/configurator/${selectedBrand}/${variantId}/equipment`);
              }
            }}
          >
            Felszereltség
          </button>
          <button
            style={{
              ...styles.subMenuItem,
              color: step >= 6 ? "#000" : "#999",
              cursor: step >= 6 ? "pointer" : "not-allowed",
            }}
            disabled={step < 6}
            onClick={() => {
              if (step >= 6 && selectedBrand && variantId) {
                navigate(`/configurator/${selectedBrand}/${variantId}/summary`);
              }
            }}
          >
            Áttekintés
          </button>
        </div>
      )}
    </>
  );
}

const styles = {
  navbar: {
    display: "flex",
    alignItems: "center",
    padding: "15px 20px",
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    zIndex: 1000,
    color: "#fff",
    justifyContent: "space-between",
  },
  logo: {
    height: "48px",
    width: "auto",
    objectFit: "contain",
  },
  brand: {
    fontSize: "22px",
    fontWeight: "bold",
    textDecoration: "none",
    color: "#fff",
  },
  iconContainer: {
    display: "flex",
    gap: "15px",
    alignItems: "center",
  },
  iconLink: {
    color: "white",
    textDecoration: "none",
    fontSize: "16px",
    display: "flex",
    alignItems: "center",
  },
  iconButton: {
    background: "none",
    border: "none",
    color: "white",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
  },
  usedCarsButton: {
    backgroundColor: "#1e90ff",
    color: "white",
    padding: "8px 14px",
    borderRadius: "8px",
    textDecoration: "none",
    fontWeight: "bold",
  },
  configuratorButton: {
    backgroundColor: "#007bff",
    color: "white",
    padding: "6px 12px",
    borderRadius: "6px",
    textDecoration: "none",
    fontWeight: "bold",
    fontSize: "14px",
  },
  subMenu: {
    position: "fixed",
    top: "76px",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    backgroundColor: "#f4f4f4",
    padding: "10px 0",
    gap: "30px",
    zIndex: 999,
  },
  subMenuItem: {
    background: "none",
    border: "none",
    fontSize: "16px",
    fontWeight: "bold",
    color: "#000",
    cursor: "pointer",
  },
};

export default Navbar;
