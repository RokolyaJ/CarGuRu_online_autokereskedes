import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ConfigContext } from "../../context/ConfigContext";
import { API_BASE_URL } from "../../apiConfig";

function Appearance() {
  const { brand, model, variantId } = useParams();
  const navigate = useNavigate();
  const { setSelectedAppearance } = useContext(ConfigContext);

  const [variant, setVariant] = useState(null);
  const [colorKeys, setColorKeys] = useState([]);
  const [colorGalleries, setColorGalleries] = useState({});
  const [activeColor, setActiveColor] = useState(null);
  const [colorIndex, setColorIndex] = useState(0);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/variants/${variantId}`).then((res) => {
      const v = res.data;

      setVariant(v);
      const cg = v.colorGalleries || {};

      setColorGalleries(cg);
      setColorKeys(Object.keys(cg));

      const first = Object.keys(cg)[0] || null;
      setActiveColor(first);
      setColorIndex(0);
    });
  }, [variantId]);

  const next = () => {
    if (!activeColor) return;
    const imgs = colorGalleries[activeColor] || [];
    setColorIndex((prev) => (prev + 1) % imgs.length);
  };

  const prev = () => {
    if (!activeColor) return;
    const imgs = colorGalleries[activeColor] || [];
    setColorIndex((prev) => (prev - 1 + imgs.length) % imgs.length);
  };

  const handleNext = () => {
    setSelectedAppearance({
      color: activeColor,
      imageUrl: colorGalleries[activeColor][0],
    });
    navigate(`/configurator/${brand}/${model}/${variantId}/equipment`);
  };

  if (!variant || colorKeys.length === 0)
    return <p style={{ marginTop: "150px", textAlign: "center" }}>Betöltés...</p>;

  const images = colorGalleries[activeColor] || [];

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Megjelenés kiválasztása</h1>

      <div style={styles.viewerBox}>
        <button style={styles.arrowLeft} onClick={prev}>‹</button>

        <img
          src={images[colorIndex]}
          alt={activeColor}
          style={styles.mainImage}
        />

        <button style={styles.arrowRight} onClick={next}>›</button>
      </div>

      <div style={styles.swatches}>
        {colorKeys.map((c) => (
          <button
            key={c}
            onClick={() => {
              setActiveColor(c);
              setColorIndex(0);
            }}
            style={{
              ...styles.swatch,
              ...(activeColor === c ? styles.swatchActive : {}),
              background: c,
            }}
            title={c}
          />
        ))}
      </div>

      <div style={styles.footerBar}>
        <strong>Választott szín:</strong> {activeColor}
        <button style={styles.button} onClick={handleNext}>
          Tovább
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "120px 20px 160px",
    maxWidth: "1400px",
    margin: "0 auto",
  },
  title: {
    textAlign: "center",
    fontSize: "32px",
    fontWeight: "bold",
    marginBottom: "40px",
  },
  viewerBox: {
    position: "relative",
    textAlign: "center",
    marginBottom: "40px",
  },
  mainImage: {
    width: "100%",
    maxWidth: "900px",
    borderRadius: "16px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
  },
  arrowLeft: {
    position: "absolute",
    top: "50%",
    left: "5%",
    transform: "translateY(-50%)",
    background: "rgba(0,0,0,0.6)",
    color: "#fff",
    border: "none",
    borderRadius: "50%",
    width: 40,
    height: 40,
    fontSize: 22,
    cursor: "pointer",
  },
  arrowRight: {
    position: "absolute",
    top: "50%",
    right: "5%",
    transform: "translateY(-50%)",
    background: "rgba(0,0,0,0.6)",
    color: "#fff",
    border: "none",
    borderRadius: "50%",
    width: 40,
    height: 40,
    fontSize: 22,
    cursor: "pointer",
  },
  swatches: {
    display: "flex",
    justifyContent: "center",
    gap: "16px",
    marginBottom: "40px",
  },
  swatch: {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    border: "2px solid #ccc",
    cursor: "pointer",
  },
  swatchActive: {
    border: "3px solid #000",
  },
  footerBar: {
    position: "fixed",
    bottom: 0,
    left: 0,
    width: "100%",
    background: "#003d2c",
    padding: "20px",
    color: "#fff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  button: {
    background: "#28f5a1",
    color: "#000",
    padding: "10px 20px",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer",
    border: "none",
  },
};

export default Appearance;
