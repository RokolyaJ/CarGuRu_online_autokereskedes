import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { API_BASE_URL } from "../apiConfig";

function CarDetails() {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCar = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/usedcars/${id}`);
        if (!response.ok) {
          throw new Error("Nem található az autó.");
        }

        const data = await response.json();
        setCar(data);
      } catch (err) {
        console.error("Hiba:", err);
        setError("Az autó nem található vagy hiba történt a betöltés során.");
      } finally {
        setLoading(false);
      }
    };

    loadCar();
  }, [id]);

  if (loading) return <p>Betöltés...</p>;
  if (error) return <p>{error}</p>;
  if (!car) return <p>Nem található autó.</p>;

  const imageUrl =
    car.images && car.images.length > 0
      ? `${API_BASE_URL}${car.images[0].url}`
      : "/images/default-car.png";

  return (
    <div style={styles.container}>
      <h2>{car.make} {car.model}</h2>

      <img
        src={imageUrl}
        alt={car.make + " " + car.model}
        style={styles.image}
      />

      <p><strong>Ár:</strong> {car.price?.toLocaleString("hu-HU")} Ft</p>
      <p><strong>Évjárat:</strong> {car.year}</p>
      <p><strong>Futott km:</strong> {car.mileage?.toLocaleString()} km</p>

      <p><strong>Leírás:</strong><br />{car.description || "Nincs megadva."}</p>
    </div>
  );
}

const styles = {
  container: { textAlign: "center", padding: "20px" },
  image: { width: "80%", maxWidth: "600px", borderRadius: "10px", marginBottom: "20px" }
};

export default CarDetails;
