import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ConfigContext } from "../../context/ConfigContext";

function EngineSelector() {
  const { model } = useParams();
  const navigate = useNavigate();
  const { setSelectedEngine, setSelectedVariant } = useContext(ConfigContext);

  const [engines, setEngines] = useState([]);
  const [selected, setSelected] = useState(null);
  const [variantData, setVariantData] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/engines/by-variant/${model}`)
      .then((res) => {
        setEngines(res.data);
        if (res.data.length > 0) {
          setSelected(res.data[0]);
          setSelectedEngine(res.data[0]); 
        }
      })
      .catch((err) => console.error("Hiba a motorok lekérésekor:", err));

    axios
      .get(`http://localhost:8080/api/variants/${model}`)
      .then((res) => {
        setVariantData(res.data);
        setSelectedVariant(res.data); 
      })
      .catch((err) => console.error("Hiba a változat lekérésekor:", err));
  }, [model, setSelectedEngine, setSelectedVariant]);

  const handleSelect = (engine) => {
    setSelected(engine);
    setSelectedEngine(engine); 
  };

  const handleNext = () => {
    if (selected && variantData) {
      navigate(`/configurator/${variantData.brand.toLowerCase()}/${model}/appearance`);
    }
  };

  const groupByFuel = (engineList) => {
    const grouped = {};
    engineList.forEach((e) => {
      if (!grouped[e.fuelType]) grouped[e.fuelType] = [];
      grouped[e.fuelType].push(e);
    });
    return grouped;
  };

  const groupedEngines = groupByFuel(engines);

  const fuelLabels = {
    Benzin: "Benzin",
    Gázolaj: "Gázolaj",
    Elektromos: "Elektromos",
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <div style={styles.left}>
          <div style={styles.stickyBox}>
            <img
              src={variantData?.imageUrl || "/images/car-placeholder.png"}
              alt="Autó"
              style={styles.carImage}
              onClick={() => setModalOpen(true)}
            />
            <div style={styles.variantInfo}>
              <h3 style={styles.variantName}>{variantData?.name || "-"}</h3>
              <p style={styles.textSmall}>
                {variantData?.power || "-"} / {variantData?.drive || "-"}
              </p>
              <p style={styles.variantPrice}>
                <strong>Ár:</strong>{" "}
                {variantData?.price
                  ? `${variantData.price.toLocaleString()} Ft-tól`
                  : "Nincs ár"}
              </p>
            </div>
          </div>
        </div>

        <div style={styles.right}>
          <h2 style={styles.heading}>Motor kiválasztása</h2>
          {Object.entries(groupedEngines).map(([fuelType, items]) => (
            <div key={fuelType}>
              <h3 style={styles.fuelHeader}>{fuelLabels[fuelType] || fuelType}</h3>
              <div style={styles.engineGrid}>
                {items.map((engine) => (
                  <div
                    key={engine.id}
                    style={{
                      ...styles.engineCard,
                      ...(selected?.id === engine.id ? styles.selected : {}),
                    }}
                    onClick={() => handleSelect(engine)}
                  >
                    <h4 style={styles.cardTitle}>{engine.name}</h4>
                    <p style={styles.info}><strong>Üzemanyag:</strong> {engine.fuelType}</p>
                    <p style={styles.info}><strong>Hajtás:</strong> {engine.driveType}</p>
                    <p style={styles.info}><strong>Teljesítmény:</strong> {engine.powerKw} kW ({engine.powerHp} LE)</p>
                    <p style={styles.info}><strong>Fogyasztás:</strong> {engine.consumption}</p>
                    <p style={styles.info}><strong>CO₂:</strong> {engine.co2}</p>
                    <p style={styles.info}><strong>Ár:</strong> {engine.price.toLocaleString()} Ft-tól</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {selected && (
        <div style={styles.footer}>
          <div style={styles.footerContent}>
            <div style={styles.footerLeft}>
              <strong>{variantData?.name || "-"}</strong>
            </div>
            <div style={styles.footerCenter}>
              Teljes ajánlott kiskereskedelmi ár<br />
              <strong>
                {variantData?.price
                  ? `${variantData.price.toLocaleString()} Ft-tól`
                  : "Nincs ár"}
              </strong>
            </div>
            <div style={styles.footerRight}>
              <button style={styles.button} onClick={handleNext}>
                Tovább
              </button>
            </div>
          </div>
        </div>
      )}

      {modalOpen && (
        <div style={styles.modalOverlay} onClick={() => setModalOpen(false)}>
          <img
            src={variantData?.imageUrl || "/images/car-placeholder.png"}
            alt="Nagyított autó"
            style={styles.modalImage}
          />
        </div>
      )}
    </div>
  );
}

const styles = {
  wrapper: {
    display: "flex",
    justifyContent: "center",
    padding: "120px 0 140px",
  },
  container: {
    display: "flex",
    width: "100%",
    maxWidth: "1600px",
    padding: "0 40px",
    gap: "40px",
  },
  left: { flex: 1.5 },
  stickyBox: { position: "sticky", top: "100px" },
  carImage: {
    width: "100%",
    borderRadius: "12px",
    objectFit: "cover",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    marginBottom: "20px",
    cursor: "pointer",
  },
  variantInfo: {
    backgroundColor: "#f9f9f9",
    borderRadius: "10px",
    padding: "16px",
    textAlign: "center",
    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
  },
  variantName: { fontSize: "20px", fontWeight: "bold", marginBottom: "8px" },
  textSmall: { fontSize: "15px", marginBottom: "6px" },
  variantPrice: { fontSize: "16px", fontWeight: "500" },
  right: { flex: 1 },
  heading: { fontSize: "24px", fontWeight: "bold", marginBottom: "24px" },
  fuelHeader: { fontSize: "18px", fontWeight: "600", margin: "32px 0 12px" },
  engineGrid: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  engineCard: {
    backgroundColor: "#e9fff1",
    padding: "16px",
    borderRadius: "12px",
    width: "280px",
    height: "280px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
    cursor: "pointer",
    transition: "0.2s ease",
    fontSize: "13px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  selected: {
    border: "2px solid #28f5a1",
    backgroundColor: "#ccffe7",
  },
  cardTitle: {
    fontSize: "15px",
    fontWeight: "600",
    marginBottom: "8px",
  },
  info: {
    fontSize: "13px",
    margin: "2px 0",
    color: "#333",
  },
  footer: {
    position: "fixed",
    bottom: 0,
    left: 0,
    width: "100%",
    backgroundColor: "#003d2c",
    color: "#fff",
    padding: "20px",
    zIndex: 100,
  },
  footerContent: {
    maxWidth: "1200px",
    margin: "0 auto",
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerLeft: {
    fontWeight: "bold",
    fontSize: "16px",
  },
  footerCenter: {
    textAlign: "center",
    fontSize: "14px",
    lineHeight: "1.4",
  },
  footerRight: {},
  button: {
    backgroundColor: "#28f5a1",
    color: "#000",
    padding: "10px 24px",
    fontWeight: "bold",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    height: "100vh",
    width: "100vw",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modalImage: {
    maxWidth: "90%",
    maxHeight: "90%",
    borderRadius: "12px",
  },
};

export default EngineSelector;
