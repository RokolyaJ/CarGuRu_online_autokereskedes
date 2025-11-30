import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import {
  FiShoppingCart,
  FiHeart,
  FiMapPin,
  FiSun,
  FiMoon,
  FiUser,
  FiMenu,
  FiX
} from "react-icons/fi";
import { useTheme } from "../context/ThemeContext";
import AuthDialog from "./AuthDialog";

function Navbar() {
  const { user, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const { cart } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [menuOpen, setMenuOpen] = useState(false);
  const [brandsPanelOpen, setBrandsPanelOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const authRef = useRef(null);
  const profileRef = useRef(null);

  const [vw, setVw] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1920
  );

  useEffect(() => {
    const onResize = () => setVw(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const compact = vw < 1280;
  const tight = vw < 1060;

  const isConfiguratorPage = location.pathname.startsWith("/configurator");
  const isHomePage = location.pathname === "/";

  useEffect(() => {
    const path = location.pathname;
    if (path === "/configurator") setStep(1);
    else if (path.match(/^\/configurator\/[a-z]+$/)) setStep(2);
    else if (path.match(/^\/configurator\/[a-z0-9-]+\/[a-z0-9-]+$/)) setStep(3);
    else if (path.includes("/appearance")) setStep(4);
    else if (path.includes("/equipment")) setStep(5);
    else if (path.includes("/summary")) setStep(6);
  }, [location.pathname]);

  useEffect(() => {
    function handleOutsideClick(e) {
      if (authOpen && authRef.current && !authRef.current.contains(e.target))
        setAuthOpen(false);
      if (profileOpen && profileRef.current && !profileRef.current.contains(e.target))
        setProfileOpen(false);
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [authOpen, profileOpen]);

  useEffect(() => {
    if (brandsPanelOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => (document.body.style.overflow = "");
  }, [brandsPanelOpen]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setBrandsPanelOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const navPadding = tight ? "12px 18px" : compact ? "14px 28px" : "15px 40px";
  const btnPad = tight ? "6px 10px" : compact ? "6px 12px" : "8px 14px";
  const btnFont = tight ? "13px" : "14px";
  const gapRight = tight ? 10 : 15;
  const toggleSize = tight ? 34 : compact ? 38 : 42;

  const themeBtnStyle = {
    ...styles.themeToggleBase,
    width: toggleSize,
    height: toggleSize,
    background: darkMode ? "#f59e0b" : "#0f172a",
    border: "2px solid #fff",
    color: darkMode ? "#111" : "#fff"
  };

  const handleMenuButton = () => {
    setMenuOpen(!menuOpen);
    setBrandsPanelOpen(false);
  };

  const handleBrandsButton = () => {
    setBrandsPanelOpen(!brandsPanelOpen);
    setMenuOpen(false);
  };

  return (
    <>
      <nav
        style={{
          ...styles.navbar,
          padding: navPadding,
          background: darkMode ? "#111" : "#000"
        }}
      >
        <div style={{ ...styles.leftSide, gap: compact ? 16 : 20 }}>

          {isHomePage && (
            <button
              style={styles.hamburgerBtn}
              onClick={handleMenuButton}
              aria-label="Főmenü"
            >
              <FiMenu size={24} />
            </button>
          )}

          {isHomePage && (
            <span
              style={{
                ...styles.brandPanelToggle,
                fontSize: compact ? "1.05rem" : "1.1rem"
              }}
              onClick={handleBrandsButton}
            >
              Márkák ▾
            </span>
          )}

          {isHomePage && (
            <Link
              to="/used-cars"
              style={{
                ...styles.usedCarsButton,
                padding: btnPad,
                fontSize: btnFont,
                backgroundColor: "transparent"

              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#1e90ff")}
              onMouseLeave={(e) => {
                if (location.pathname !== "/used-cars") {
                  e.target.style.backgroundColor = "transparent";
                }
              }}
            >
              Használtautók
            </Link>
          )}

        </div>

        <div style={styles.centerLogo}>
          <Link to="/">
            <img
              src="/images/logo/logo.png"
              alt="CarGuRu Logo"
              style={styles.logoImage}
            />
          </Link>
        </div>
        <div style={{ ...styles.rightSide, gap: gapRight }}>

          {user && (
            <>
              <Link to="/favorites" style={styles.iconLink}>
                <FiHeart size={22} />
              </Link>

              {!location.pathname.startsWith("/used-cars") && (
                <Link to="/cart" style={{ ...styles.iconLink }}>
                  <FiShoppingCart size={22} />
                </Link>
              )}

              {!location.pathname.startsWith("/used-cars") && (
                <Link to="/locations" style={styles.iconLink}>
                  <FiMapPin size={22} />
                </Link>
              )}
            </>
          )}

          {!user && (
            <div style={{ position: "relative" }} ref={authRef}>
              <button
  onClick={() => {
    setAuthOpen(!authOpen);
  }}
  style={{
    ...styles.loginButton,
    padding: btnPad,
    fontSize: btnFont,
    backgroundColor:
      location.pathname === "/login"
        ? "#10b981"          
        : authOpen
        ? "#10b981"           
        : "transparent",      
  }}
  onMouseEnter={(e) => {
    if (location.pathname !== "/login") {
      e.target.style.backgroundColor = "#10b981";
    }
  }}
  onMouseLeave={(e) => {
    if (location.pathname !== "/login") {
      e.target.style.backgroundColor = "transparent";
    }
  }}
>
  Bejelentkezés
</button>



              {authOpen && (
                <div style={styles.authDialogWrapper}>
                  <AuthDialog onClose={() => setAuthOpen(false)} />
                </div>
              )}
            </div>
          )}

          {user && (
            <div style={{ position: "relative" }} ref={profileRef}>
             <button
  onClick={() => setProfileOpen(!profileOpen)}
  style={{
    ...styles.profileButton,
    padding: 0,
    borderRadius: "50%",
    width: "40px",
    height: "40px",
    overflow: "hidden"
  }}
>
  {user?.profileImage ? (
    <img
      src={user.profileImage}
      alt="Profil"
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        borderRadius: "50%"
      }}
    />
  ) : (
    <FiUser size={22} />
  )}
</button>


              {profileOpen && (
                <div style={styles.profileMenu}>
                  <div style={styles.profileHeader}>
                    Üdvözöljük, {user.fullName}
                  </div>

                  <div
                    style={styles.profileItem}
                    onClick={() => {
                      setProfileOpen(false);
                      navigate("/dashboard");
                    }}
                  >
                    Irányítópult
                  </div>

                  <div style={styles.profileItem}>A kívánságlistám</div>

                  <div
                    style={styles.profileItem}
                    onClick={() => {
                      setProfileOpen(false);
                      navigate("/messages");
                    }}
                  >
                    Üzeneteim
                  </div>

                  <div
                    style={styles.profileItem}
                    onClick={() => {
                      setProfileOpen(false);
                      navigate("/profile");
                    }}
                  >
                    Saját fiók
                  </div>

                  <div
                    style={styles.profileItem}
                    onClick={() => {
                      setProfileOpen(false);
                      navigate("/used-cars/my");
                    }}
                  >
                    Feltöltött hirdetéseim
                  </div>

                  <div
                    style={styles.profileItem}
                    onClick={() => {
                      setProfileOpen(false);
                      navigate("/used-cars/my-reservations");
                    }}
                  >
                    Lefoglalt hirdetéseim
                  </div>

                  {user.role === "ADMIN" && (
                    <div
                      style={styles.profileItem}
                      onClick={() => {
                        setProfileOpen(false);
                        navigate("/used-cars/admin");
                      }}
                    >
                      Hirdetések (Admin)
                    </div>
                  )}
                  <div
                    style={styles.profileItem}
                    onClick={() => {
                      setProfileOpen(false);
                      navigate("/car-calculator");
                    }}
                  >
                    Autó kalkulálás
                  </div>

                  {user.role === "ADMIN" && (
                    <div
                      style={styles.profileItem}
                      onClick={() => {
                        setProfileOpen(false);
                        navigate("/admin");
                      }}
                    >
                      Admin felület
                    </div>
                  )}

                  <hr />
                  <button onClick={logout} style={styles.logoutButton}>
                    Kijelentkezés
                  </button>
                </div>
              )}
            </div>
          )}

          <button
            onClick={toggleTheme}
            style={themeBtnStyle}
            aria-label={darkMode ? "Világos mód" : "Sötét mód"}
          >
            {darkMode ? (
              <FiSun size={tight ? 18 : 22} />
            ) : (
              <FiMoon size={tight ? 18 : 22} />
            )}
          </button>
        </div>
      </nav>
      {menuOpen && (
        <div
          style={{
            ...styles.topDropMenu,
            backgroundColor: darkMode ? "#1a1a1a" : "#f2f2f2",
            color: darkMode ? "#fff" : "#000"
          }}
        >
          <button
            style={{ ...styles.closeTopMenu, color: darkMode ? "#fff" : "#000" }}
            onClick={() => setMenuOpen(false)}
          >
            <FiX size={26} />
          </button>

          <div style={styles.topMenuItems}>
            {["Autók történelme", "Kapcsolat"].map((item) =>
              item === "Kapcsolat" ? (
                <Link
                  key={item}
                  to="/contact"
                  onClick={() => setMenuOpen(false)}
                  style={{
                    ...styles.topMenuItem,
                    color: darkMode ? "#fff" : "#000",
                    textDecoration: "none"
                  }}
                >
                  {item}
                </Link>
              ) : (
                <div
                  key={item}
                  style={{
                    ...styles.topMenuItem,
                    color: darkMode ? "#fff" : "#000"
                  }}
                >
                  {item}
                </div>
              )
            )}
          </div>
        </div>
      )}
      {brandsPanelOpen && (
        <div
          style={{
            ...styles.brandsPanel,
            backgroundColor: darkMode ? "#1a1a1a" : "#fff",
            color: darkMode ? "#fff" : "#000"
          }}
        >
          <button
            style={{
              ...styles.closeTopMenu,
              color: darkMode ? "#fff" : "#000"
            }}
            onClick={() => setBrandsPanelOpen(false)}
          >
            <FiX size={26} />
          </button>

          <h2
            style={{
              ...styles.brandsHeading,
              color: darkMode ? "#fff" : "#000"
            }}
          >
            Márkák áttekintése
          </h2>

          <div style={styles.brandsGrid}>
            {[
              { name: "Audi", logo: "/images/home_page/brand_logo/audi_logo.png" },
              { name: "BMW", logo: "/images/home_page/brand_logo/bmw_logo.jpg" },
              { name: "Mercedes", logo: "/images/home_page/brand_logo/mercedes_logo.png" },
              { name: "Volkswagen", logo: "/images/home_page/brand_logo/volkswagen_logo.png" },
              { name: "Skoda", logo: "/images/home_page/brand_logo/skoda_logo.jpg" }
            ].map((b) => (
              <Link
                key={b.name}
                to={`/brand/${b.name.toLowerCase()}`}
                style={{
                  ...styles.brandItem,
                  color: darkMode ? "#fff" : "#000"
                }}
                onClick={() => setBrandsPanelOpen(false)}
              >
                <img src={b.logo} alt={b.name} style={styles.brandLogo} />
                <span style={styles.brandName}>{b.name}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {isConfiguratorPage && (
        <div style={styles.subMenu}>
          {["Márkák", "Modellek", "Változat", "Megjelenés", "Felszereltség", "Áttekintés"].map(
            (t, i) => (
              <button
                key={t}
                style={{
                  ...styles.subMenuItem,
                  color: step >= i + 1 ? "#000" : "#999"
                }}
                disabled={step < i + 1}
              >
                {t}
              </button>
            )
          )}
        </div>
      )}
    </>
  );
}

const styles = {
  navbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    zIndex: 1000,
    color: "#fff",
    transition: "background .3s",
    boxSizing: "border-box",
    paddingTop: "10px",
    height: "60px"
  },

  centerLogo: {
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)",
    zIndex: 1
  },

  logoImage: {
    height: 80,
    objectFit: "contain"
  },

  leftSide: {
    display: "flex",
    alignItems: "center",
    position: "relative",
    zIndex: 2
  },

  rightSide: {
    display: "flex",
    alignItems: "center",
    position: "relative",
    zIndex: 3
  },

  usedCarsButton: {
    backgroundColor: "transparent",
    color: "#fff",
    borderRadius: "8px",
    textDecoration: "none",
    fontWeight: "bold",
    whiteSpace: "nowrap",
    transition: "0.25s ease"
  },

  hamburgerBtn: {
    background: "none",
    border: "none",
    color: "white",
    cursor: "pointer",
    padding: "6px 10px",
    display: "flex",
    alignItems: "center"
  },

  brandPanelToggle: {
    color: "white",
    cursor: "pointer",
    fontWeight: "bold",
    whiteSpace: "nowrap"
  },

  iconLink: {
    color: "white",
    textDecoration: "none",
    display: "flex",
    alignItems: "center"
  },

  loginButton: {
    backgroundColor: "transparent",
    color: "#fff",
    borderRadius: "6px",
    fontWeight: "bold",
    position: "relative",
    whiteSpace: "nowrap",
    transition: "0.25s ease",
    border: "2px solid transparent",
    cursor: "pointer"
  },

  authDialogWrapper: {
    position: "absolute",
    top: "110%",
    right: 0,
    zIndex: 2000
  },

  themeToggleBase: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    cursor: "pointer",
    position: "relative",
    boxShadow: "0 0 8px rgba(0,0,0,0.4)"
  },

  profileButton: {
    background: "none",
    border: "none",
    color: "white",
    cursor: "pointer"
  },

  profileMenu: {
    position: "absolute",
    top: "110%",
    right: 0,
    backgroundColor: "#fff",
    color: "#000",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    padding: "12px",
    minWidth: "220px",
    zIndex: 3000
  },

  profileHeader: {
    fontWeight: "bold",
    marginBottom: "8px"
  },

  profileItem: {
    padding: "6px 0",
    cursor: "pointer"
  },

  logoutButton: {
    width: "100%",
    padding: "8px",
    marginTop: "10px",
    backgroundColor: "#eee",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "bold"
  },

  topDropMenu: {
    position: "fixed",
    top: "76px",
    left: 0,
    width: "340px",
    height: "100vh",
    zIndex: 4000,
    padding: "30px",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    gap: "25px",
    transition: "transform .3s ease",
    transform: "translateX(0)",
    overflowY: "auto",
    borderRight: "1px solid #ddd"
  },

  closeTopMenu: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "1.5rem",
    position: "absolute",
    top: "20px",
    right: "30px"
  },

  topMenuItems: {
    display: "flex",
    flexDirection: "column",
    gap: "28px",
    fontSize: "1.3rem",
    fontWeight: "bold",
    paddingBottom: "40px"
  },

  topMenuItem: {
    cursor: "pointer",
    lineHeight: "1.6"
  },

  brandsPanel: {
    position: "fixed",
    top: "76px",
    left: 0,
    width: "100%",
    zIndex: 4000,
    minHeight: "calc(100vh - 76px)",
    padding: "40px 60px",
    boxSizing: "border-box"
  },

  brandsHeading: {
    fontSize: "1.8rem",
    fontWeight: "bold",
    marginBottom: "40px"
  },

  brandsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))",
    gap: "40px",
    justifyItems: "center"
  },

  brandItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textDecoration: "none"
  },

  brandLogo: {
    width: "120px",
    height: "auto",
    marginBottom: "12px"
  },

  brandName: {
    fontWeight: "bold",
    fontSize: "1.1rem"
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
    zIndex: 999
  },

  subMenuItem: {
    background: "none",
    border: "none",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer"
  }
};

export default Navbar;
