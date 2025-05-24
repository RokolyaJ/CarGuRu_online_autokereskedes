import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

function CarDetails() {
  const { id } = useParams();
  const [car, setCar] = useState(null);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const carDoc = await getDoc(doc(db, "cars", id));
        if (carDoc.exists()) {
          setCar(carDoc.data());
        } else {
          console.error("Nincs ilyen autó!");
        }
      } catch (error) {
        console.error("Hiba történt az autó lekérésekor:", error);
      }
    };

    fetchCar();
  }, [id]);

  if (!car) {
    return <p>Betöltés...</p>;
  }

  return (
    <div style={styles.container}>
      <h2>{car.name}</h2>
      <img src={car.image} alt={car.name} style={styles.image} />
      <p><strong>Ár:</strong> {car.price}</p>
      <p><strong>Évjárat:</strong> {car.year}</p>
      <p><strong>Leírás:</strong> {car.description || "Nincs megadva"}</p>
    </div>
  );
}

const styles = {
  container: { textAlign: "center", padding: "20px" },
  image: { width: "80%", maxWidth: "600px", borderRadius: "10px" }
};

export default CarDetails;
