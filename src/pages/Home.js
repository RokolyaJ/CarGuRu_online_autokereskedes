import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import FloatingActions from "../components/FloatingActions";

import { API_BASE_URL } from "../apiConfig";

function Home() {
  const { darkMode } = useTheme();
  const [cars, setCars] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [news, setNews] = useState([]);

  const sliderImages = [
    "/images/home_page/audi1.jpg",
    "/images/home_page/mercedes-benz1.jpg",
    "/images/home_page/skoda1.jpg"
  ];

  const brands = [
    { name: "Audi", image: "/images/home_page/brand_logo/audi_logo.png" },
    { name: "BMW", image: "/images/home_page/brand_logo/bmw_logo.jpg" },
    { name: "Mercedes", image: "/images/home_page/brand_logo/mercedes_logo.png" },
    { name: "Volkswagen", image: "/images/home_page/brand_logo/volkswagen_logo.png" },
    { name: "Skoda", image: "/images/home_page/brand_logo/skoda_logo.jpg" }
  ];

const highlights = [
  {
    title: "Innováció",
    desc: "LIDAR-alapú vezetéstámogatás, digitális cockpit, fejlett biztonsági rendszerek.",
    image: "/images/home_page/audi1.jpg"
  },
  {
    title: "Teljesítmény",
    desc: "Erőteljes motorok, sportos futómű és villámgyors gyorsulás.",
    image: "/images/home_page/mercedes-benz1.jpg"
  },
  {
    title: "Kényelem",
    desc: "Prémium belső tér, ergonomikus ülések és modern infotainment.",
    image: "/images/home_page/skoda1.jpg"
  }
];


  useEffect(() => {
    async function loadFeaturedCars() {
      try {
        const res = await fetch(`${API_BASE_URL}/api/home/featured-cars`);
        if (!res.ok) throw new Error();

        const data = await res.json();
        setCars(data);
      } catch {
        setCars([
          {
            id: "1",
            name: "Audi A4",
            price: "5 200 000 Ft",
            year: 2018,
            image: "/images/home_page/audi1.jpg"
          },
          {
            id: "2",
            name: "Mercedes-Benz C",
            price: "7 500 000 Ft",
            year: 2020,
            image: "/images/home_page/mercedes-benz1.jpg"
          },
          {
            id: "3",
            name: "Skoda Octavia",
            price: "6 200 000 Ft",
            year: 2019,
            image: "/images/home_page/skoda1.jpg"
          }
        ]);
      }
    }
    loadFeaturedCars();
  }, []);

  useEffect(() => {
    async function loadNews() {
      try {
        const res = await fetch(`${API_BASE_URL}/api/news`);
        if (!res.ok) throw new Error();

        const data = await res.json();
        setNews(data);
      } catch {
        setNews([
          {
            id: 1,
            slug: "audi-skoda-elektromos-2026",
            date: "2025/09/25",
            title: "Audi és Skoda: új elektromos modellek 2026-ra",
            summary:
              "Az Audi és a Skoda új elektromos SUV-modelleket fejleszt, melyek 2026-ban érkeznek.",
            image: "/images/home_page/news/audi_and_skoda.jpg"
          },
          {
            id: 2,
            slug: "mercedes-bmw-onvezetes",
            date: "2025/09/22",
            title: "Mercedes és BMW: közös fejlesztés az önvezetésért",
            summary:
              "A Mercedes és a BMW közösen dolgoznak a 4-es szintű önvezető rendszerek bevezetésén.",
            image: "/images/home_page/news/mercedesz_and_bmw.jpg"
          },
          {
            id: 3,
            slug: "volkswagen-zoldebb-jovo",
            date: "2025/09/18",
            title: "Volkswagen-csoport: erős második negyedév, zöldebb jövő",
            summary:
              "A VW-csoport 15%-kal növelte az eladásokat az elektromos járművek szegmensében.",
            image: "/images/home_page/news/Volkswagen_results.jpg"
          }
        ]);
      }
    }
    loadNews();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [sliderImages.length]);

  const styles = {
    container: {
      textAlign: "center",
      backgroundColor: darkMode ? "#121212" : "#f9f9f9",
      color: darkMode ? "#e0e0e0" : "#000",
      transition: "background-color 0.3s ease, color 0.3s ease",
      minHeight: "100vh"
    },
highlightsWrapper: {
  width: "100%",
  height: "100vh",
  position: "relative",
  overflow: "hidden",
  borderBottomLeftRadius: "0px",
  borderBottomRightRadius: "0px",
  boxShadow: "0 10px 40px rgba(0,0,0,0.35)",
},


highlightSlide: {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  opacity: 0,
  transition: "opacity 1s ease"
},

activeSlide: { opacity: 1, zIndex: 2 },
inactiveSlide: { opacity: 0, zIndex: 1 },

highlightImage: {
  width: "100%",
  height: "100%",
  objectFit: "cover",
  objectPosition: "center",
  filter: "brightness(0.65)",
},


highlightContent: {
  position: "absolute",
  top: "45%",
  left: "60px",
  transform: "translateY(-50%)",
  color: "white",
  maxWidth: "650px",
  fontSize: "clamp(24px, 3vw, 48px)",
  lineHeight: 1.1,
  textShadow: "0 6px 20px rgba(0,0,0,0.85)",
},


highlightDots: {
  position: "absolute",
  bottom: "35px",
  left: "50%",
  transform: "translateX(-50%)",
  display: "flex",
  gap: "25px",
  zIndex: 3
},



highlightDot: {
  fontSize: "26px",
  cursor: "pointer",
  opacity: 0.5,
  transition: "0.3s"
},

highlightDotActive: {
  opacity: 1,
  transform: "scale(1.2)"
},

    heroWrapper: {
      width: "85%",
      maxWidth: "1400px",
      height: "70vh",
      margin: "90px auto 0 auto",
      position: "relative",
      borderRadius: "25px",
      overflow: "hidden",
      boxShadow: "0px 10px 30px rgba(0,0,0,0.25)"
    },

    heroImageWrapper: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      transition: "opacity 1.4s ease, transform 8s ease"
    },

    heroImage: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      filter: "brightness(0.8)",
      transform: "scale(1.15)"
    },

    heroActive: {
      opacity: 1,
      zIndex: 2,
      transform: "scale(1)"
    },

    heroInactive: {
      opacity: 0,
      zIndex: 1
    },

    gradientOverlay: {
      position: "absolute",
      bottom: 0,
      left: 0,
      width: "100%",
      height: "40%",
      background: "linear-gradient(to top, rgba(0,0,0,0.6), transparent)",
      zIndex: 3
    },

    navButton: {
      position: "absolute",
      top: "50%",
      transform: "translateY(-50%)",
      background: "rgba(0,0,0,0.55)",
      border: "none",
      color: "white",
      fontSize: "2rem",
      padding: "14px",
      cursor: "pointer",
      borderRadius: "50%",
      backdropFilter: "blur(6px)",
      zIndex: 4,
      transition: "background 0.3s"
    },

    dotsWrapper: {
      position: "absolute",
      bottom: "25px",
      left: "50%",
      transform: "translateX(-50%)",
      display: "flex",
      gap: "10px",
      zIndex: 4
    },

    dot: {
      width: "12px",
      height: "12px",
      borderRadius: "50%",
      background: "rgba(255,255,255,0.5)",
      cursor: "pointer",
      transition: "0.3s"
    },

    dotActive: {
      background: "#fff",
      width: "14px",
      height: "14px"
    },

    sectionOuter: {
      padding: "clamp(32px, 5vw, 64px) 0"
    },

    sectionInner: {
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "0 20px"
    },

    brandsSection: {
      backgroundColor: darkMode ? "#1a1a1a" : "#fff"
    },

    brandsTitle: {
      fontSize: "clamp(24px, 2.5vw, 32px)",
      lineHeight: 1.4,
      marginBottom: "40px",
      color: darkMode ? "#e0e0e0" : "#333",
      fontWeight: 700
    },

    brandsGrid: {
      display: "flex",
      justifyContent: "center",
      gap: "40px",
      flexWrap: "wrap"
    },

    brandCard: {
      width: "150px",
      textAlign: "center",
      transition: "transform 0.3s ease, box-shadow 0.3s ease",
      cursor: "pointer",
      backgroundColor: darkMode ? "#2c2c2c" : "#fff",
      borderRadius: "12px",
      padding: "16px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
    },

    brandImage: {
      width: "100%",
      height: "auto",
      marginBottom: "12px"
    },

    brandName: {
      fontSize: "clamp(16px, 1.4vw, 18px)",
      color: darkMode ? "#eee" : "#333",
      fontWeight: 600
    },

    featuredSection: {
      backgroundColor: darkMode ? "#121212" : "#f9f9f9"
    },

    sectionTitle: {
      fontSize: "clamp(24px, 2.5vw, 32px)",
      lineHeight: 1.4,
      marginBottom: "40px",
      color: darkMode ? "#e0e0e0" : "#333",
      fontWeight: 700,
      textAlign: "center"
    },

    carGrid: {
      display: "flex",
      justifyContent: "center",
      gap: "30px",
      flexWrap: "wrap"
    },

    carCard: {
      background: darkMode ? "#2c2c2c" : "#fff",
      borderRadius: "15px",
      padding: "20px",
      width: "280px",
      boxShadow: "0 6px 15px rgba(0,0,0,0.1)",
      color: darkMode ? "#e0e0e0" : "#000",
      textAlign: "left"
    },

    carImage: {
      width: "100%",
      borderRadius: "10px",
      marginBottom: "15px"
    },

    carName: {
      fontSize: "clamp(18px, 1.8vw, 22px)",
      margin: "10px 0",
      fontWeight: 600
    },

    carPrice: {
      fontSize: "16px",
      fontWeight: "bold",
      color: "#0063E5",
      marginBottom: "4px"
    },

    carYear: {
      fontSize: "14px",
      color: darkMode ? "#ccc" : "#555",
      marginBottom: "15px"
    },

    buttonSmall: {
      display: "inline-block",
      backgroundColor: "#0063E5",
      color: "white",
      padding: "8px 16px",
      textDecoration: "none",
      borderRadius: "20px",
      fontWeight: "bold",
      fontSize: "14px"
    },

    newsSection: {
      backgroundColor: darkMode ? "#1a1a1a" : "#fff"
    },

    newsGrid: {
      display: "flex",
      justifyContent: "center",
      flexWrap: "wrap",
      gap: "30px"
    },

    newsCard: {
      width: "320px",
      background: darkMode ? "#2c2c2c" : "#fff",
      borderRadius: "15px",
      padding: "20px",
      boxShadow: "0 6px 15px rgba(0,0,0,0.1)",
      color: darkMode ? "#e0e0e0" : "#000",
      textAlign: "left"
    },

    newsImage: {
      width: "100%",
      height: "200px",
      objectFit: "cover",
      borderRadius: "10px",
      marginBottom: "15px"
    },

    newsDate: {
      fontSize: "13px",
      color: darkMode ? "#aaa" : "#555",
      marginBottom: "8px"
    },

    newsTitle: {
      fontSize: "clamp(18px, 1.8vw, 22px)",
      fontWeight: "bold",
      marginBottom: "10px",
      lineHeight: 1.4
    },

    newsSummary: {
      fontSize: "15px",
      lineHeight: 1.4,
      marginBottom: "15px",
      maxWidth: "640px"
    },

    newsLink: {
      color: "#0063E5",
      textDecoration: "none",
      fontWeight: "bold",
      fontSize: "14px"
    }
  };

  return (
    <div style={styles.container}>
     <section style={styles.highlightsWrapper}>
  {highlights.map((item, i) => (
    <div
      key={i}
      style={{
        ...styles.highlightSlide,
        ...(currentSlide === i ? styles.activeSlide : styles.inactiveSlide),
      }}
    >
      <img src={item.image} alt={item.title} style={styles.highlightImage} />

      <div style={styles.highlightContent}>
        <h1>{item.icon} {item.title}</h1>
        <p>{item.desc}</p>
      </div>
    </div>
  ))}

  <div style={styles.highlightDots}>
    {highlights.map((item, i) => (
      <div
        key={i}
        onClick={() => setCurrentSlide(i)}
        style={{
          ...styles.highlightDot,
          ...(currentSlide === i ? styles.highlightDotActive : {}),
        }}
      >
        {item.icon}
      </div>
    ))}
  </div>
</section>



      <section style={{ ...styles.sectionOuter, ...styles.brandsSection }}>
        <div style={styles.sectionInner}>
          <h2 style={styles.brandsTitle}>Márkák áttekintése</h2>
          <div style={styles.brandsGrid}>
            {brands.map((b, i) => (
              <Link
                key={i}
                to={`/brand/${b.name.toLowerCase()}`}
                style={{ textDecoration: "none" }}
              >
                <div style={styles.brandCard}>
                  <img src={b.image} alt={b.name} style={styles.brandImage} />
                  <h3 style={styles.brandName}>{b.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section style={{ ...styles.sectionOuter, ...styles.featuredSection }}>
        <div style={styles.sectionInner}>
          <h2 style={styles.sectionTitle}>Kiemelt ajánlataink</h2>
          <div style={styles.carGrid}>
            {cars.map((car) => (
              <div key={car.id} style={styles.carCard}>
                <img src={car.image} alt={car.name} style={styles.carImage} />
                <h3 style={styles.carName}>{car.name}</h3>
                <p style={styles.carPrice}>Ár: {car.price}</p>
                <p style={styles.carYear}>Évjárat: {car.year}</p>
                <Link to={`/car/${car.id}`} style={styles.buttonSmall}>
                  Részletek
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ ...styles.sectionOuter, ...styles.newsSection }}>
        <div style={styles.sectionInner}>
          <h2 style={styles.sectionTitle}>Legfrissebb híreink</h2>
          <div style={styles.newsGrid}>
            {news.map((n) => (
              <div key={n.id} style={styles.newsCard}>
                <img src={n.image} alt={n.title} style={styles.newsImage} />
                <p style={styles.newsDate}>{n.date}</p>
                <h3 style={styles.newsTitle}>{n.title}</h3>
                <p style={styles.newsSummary}>{n.summary}</p>
                <Link to={`/news/${n.slug}`} style={styles.newsLink}>
                  Tudjon meg többet ›
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FloatingActions />
    </div>
  );
}

export default Home;
