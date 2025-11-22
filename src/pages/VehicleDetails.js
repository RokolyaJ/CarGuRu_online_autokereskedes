import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function VehicleDetails() {
  const { id } = useParams(); 
  const navigate = useNavigate();

  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = "http://localhost:8080";

  useEffect(() => {
    setLoading(true);

    axios
      .get(`${API_BASE_URL}/api/vehicles/${id}`)
      .then((res) => {
        setVehicle(res.data);
      })
      .catch((err) => {
        console.error("Hiba betöltéskor:", err);
        setVehicle(null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        <h2>Betöltés...</h2>
      </div>
    );

  if (!vehicle)
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        <p>Nincs ilyen jármű az adatbázisban.</p>
        <button
          onClick={() => navigate("/dashboard")}
          style={{
            marginTop: 20,
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          Vissza
        </button>
      </div>
    );

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "40px auto",
        padding: "20px",
        fontFamily: "sans-serif",
      }}
    >
      <h1 style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "20px" }}>
        Jármű adatai
      </h1>

      <p><b>Márka:</b> {vehicle.brand}</p>
      <p><b>Modell:</b> {vehicle.model}</p>
      <p><b>Változat:</b> {vehicle.variant}</p>
      <p><b>Motor:</b> {vehicle.engine}</p>
      <p><b>Szín:</b> {vehicle.color}</p>
      <p><b>Felszereltség:</b> {vehicle.equipments}</p>
      <p><b>Ár:</b> {vehicle.price} Ft</p>
      <p><b>Kereskedés:</b> {vehicle.dealership}</p>
      <p><b>Vásárlás dátuma:</b> {vehicle.purchaseDate}</p>
      <p><b>Vásárló neve:</b> {vehicle.buyerName}</p>

      <button
        onClick={() => navigate(-1)}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          backgroundColor: "#28f5a1",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        Vissza
      </button>
    </div>
  );
}
