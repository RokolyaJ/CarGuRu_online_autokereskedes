import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

function Home() {
  const [cars, setCars] = useState([]);

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    const querySnapshot = await getDocs(collection(db, "cars"));
    setCars(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  return (
    <div style={styles.container}>
      {}
      <section style={styles.hero}>
        <h1>Üdvözöl az Autókereskedés!</h1>
        <p>Itt találod a legjobb autókat, elérhető áron.</p>
        <div>
          <Link to="/cars" style={styles.button}>Autók megtekintése</Link>
          <Link to="/contact" style={styles.buttonOutline}>Kapcsolat</Link>
        </div>
      </section>

      {}
      <section style={styles.featuredCars}>
        <h2>Kiemelt autók</h2>
        <div style={styles.carGrid}>
          {cars.slice(0, 3).map((car) => (
            <div key={car.id} style={styles.carCard}>
              <img src={car.image} alt={car.name} style={styles.carImage} />
              <h3>{car.name}</h3>
              <p>Ár: {car.price}</p>
              <p>Évjárat: {car.year}</p>
              <Link to={`/car/${car.id}`} style={styles.buttonSmall}>Részletek</Link>
            </div>
          ))}
        </div>
      </section>

      {}
      <section style={styles.services}>
        <h2>Miért válassz minket?</h2>
        <div style={styles.serviceList}>
          <div style={styles.serviceItem}>Széles választék</div>
          <div style={styles.serviceItem}>Korrekt árak</div>
          <div style={styles.serviceItem}>Megbízható autók</div>
          <div style={styles.serviceItem}>Kiváló ügyfélszolgálat</div>
        </div>
      </section>
    </div>
  );
}

const styles = {
  container: { textAlign: "center", padding: "20px" },
  
  hero: {
    backgroundImage: "url('https://source.unsplash.com/1600x900/?car')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    padding: "100px 20px",
    color: "white",
    textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
  },

  button: {
    backgroundColor: "#007bff",
    color: "white",
    padding: "10px 20px",
    margin: "10px",
    textDecoration: "none",
    borderRadius: "5px",
    display: "inline-block",
  },

  buttonOutline: {
    backgroundColor: "transparent",
    border: "2px solid white",
    color: "white",
    padding: "10px 20px",
    margin: "10px",
    textDecoration: "none",
    borderRadius: "5px",
    display: "inline-block",
  },

  featuredCars: { padding: "40px 20px" },
  carGrid: { display: "flex", justifyContent: "center", gap: "20px" },
  carCard: { border: "1px solid #ddd", borderRadius: "10px", padding: "15px", width: "250px", textAlign: "center" },
  carImage: { width: "100%", borderRadius: "10px" },
  buttonSmall: { backgroundColor: "#28a745", color: "white", padding: "5px 10px", textDecoration: "none", borderRadius: "5px", display: "inline-block", marginTop: "10px" },

  services: { backgroundColor: "#f8f9fa", padding: "40px 20px" },
  serviceList: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "20px", justifyContent: "center" },
  serviceItem: { background: "#007bff", color: "white", padding: "15px", borderRadius: "5px", textAlign: "center" },
};

export default Home;
