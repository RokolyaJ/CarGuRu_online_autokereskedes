import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { Link } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";

function Cars() {
  const [cars, setCars] = useState([]);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await checkAdminRole(currentUser.uid);
      } else {
        setIsAdmin(false);
      }
    });

    fetchCars();

    return () => unsubscribe();
  }, [auth]);

  const checkAdminRole = async (userId) => {
    try {
      const userDoc = await getDoc(doc(db, "users", userId));
      if (userDoc.exists() && userDoc.data().role === "admin") {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    } catch (error) {
      console.error("Hiba az admin ellenőrzésekor:", error);
      setIsAdmin(false);
    }
  };

  const fetchCars = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "cars"));
      setCars(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Hiba az autók lekérdezésekor:", error);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Elérhető Autók</h2>
      {user ? (
        <div style={styles.carList}>
          {cars.length > 0 ? (
            cars.map((car) => (
              <div key={car.id} style={styles.carCard}>
                <img src={car.image} alt={car.name} style={styles.carImage} />
                <h3>{car.name}</h3>
                <p><strong>Ár:</strong> {car.price}</p>
                <p><strong>Évjárat:</strong> {car.year}</p>
                <Link to={`/car/${car.id}`} style={styles.detailsButton}>Részletek</Link>
              </div>
            ))
          ) : (
            <p>Nincsenek autók az adatbázisban.</p>
          )}
        </div>
      ) : (
        <p>Kérlek jelentkezz be az autók megtekintéséhez!</p>
      )}
    </div>
  );
}

const styles = {
  container: { textAlign: "center", padding: "20px" },
  carList: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px" },
  carCard: { border: "1px solid #ddd", borderRadius: "8px", padding: "15px", textAlign: "center" },
  carImage: { width: "100%", borderRadius: "8px" },
  detailsButton: { padding: "8px 15px", background: "#007bff", color: "white", textDecoration: "none", borderRadius: "5px", display: "inline-block", marginTop: "10px" }
};

export default Cars;
