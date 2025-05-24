import React, { useState, useEffect, useCallback } from "react";
import { db, auth } from "../firebase";
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function Admin() {
  const [cars, setCars] = useState([]);
  const [car, setCar] = useState({ name: "", price: "", year: "", image: "" });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const checkAdminRole = useCallback(async () => {
    const user = auth.currentUser;
    if (!user) {
      navigate("/login");
      return;
    }

    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (!userDoc.exists() || userDoc.data().role !== "admin") {
      alert("Nincs jogosultságod az admin felülethez!");
      navigate("/");
    } else {
      setLoading(false);
      fetchCars();
    }
  }, [navigate]);

  useEffect(() => {
    checkAdminRole();
  }, [checkAdminRole]);

  const fetchCars = async () => {
    const querySnapshot = await getDocs(collection(db, "cars"));
    setCars(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  const handleChange = (e) => {
    setCar({ ...car, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData }
      );

      const data = await response.json();
      if (data.secure_url) {
        setCar({ ...car, image: data.secure_url });
      } else {
        alert("Hiba történt a kép feltöltésekor!");
      }
    } catch (error) {
      console.error("Hiba a feltöltésnél:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!car.name || !car.price || !car.year || !car.image) {
      alert("Minden mező kitöltése kötelező!");
      return;
    }

    try {
      if (editingId) {
        await updateDoc(doc(db, "cars", editingId), car);
        alert("Autó frissítve!");
      } else {
        await addDoc(collection(db, "cars"), car);
        alert("Autó hozzáadva!");
      }

      setCar({ name: "", price: "", year: "", image: "" });
      setEditingId(null);
      fetchCars();
    } catch (error) {
      console.error("Hiba:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Biztosan törölni akarod ezt az autót?")) {
      try {
        await deleteDoc(doc(db, "cars", id));
        setCars(cars.filter((car) => car.id !== id));
        alert("Autó törölve!");
      } catch (error) {
        console.error("Hiba a törlésnél:", error);
      }
    }
  };

  const handleEdit = (car) => {
    setCar(car);
    setEditingId(car.id);
  };

  if (loading) {
    return <p>Betöltés...</p>;
  }

  return (
    <div style={styles.container}>
      <h2>{editingId ? "Autó szerkesztése" : "Új autó hozzáadása"}</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input type="text" name="name" placeholder="Autó neve" value={car.name} onChange={handleChange} style={styles.input} />
        <input type="text" name="price" placeholder="Ár (pl. 8 500 000 Ft)" value={car.price} onChange={handleChange} style={styles.input} />
        <input type="number" name="year" placeholder="Évjárat" value={car.year} onChange={handleChange} style={styles.input} />
        <input type="file" onChange={handleImageUpload} style={styles.input} />
        {car.image && <img src={car.image} alt="Feltöltött kép" style={styles.previewImage} />}
        <button type="submit" style={styles.button}>
          {editingId ? "Autó frissítése" : "Autó hozzáadása"}
        </button>
      </form>

      <h2>Autók listája</h2>
      <div style={styles.carList}>
        {cars.map((car) => (
          <div key={car.id} style={styles.carCard}>
            <img src={car.image} alt={car.name} style={styles.carImage} />
            <h3>{car.name}</h3>
            <p>Ár: {car.price}</p>
            <p>Évjárat: {car.year}</p>
            <button onClick={() => handleEdit(car)} style={styles.editButton}>Szerkesztés</button>
            <button onClick={() => handleDelete(car.id)} style={styles.deleteButton}>Törlés</button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* 🔹 Stílusok */
const styles = {
  container: { textAlign: "center", padding: "20px" },
  form: { display: "flex", flexDirection: "column", gap: "10px", width: "300px", margin: "0 auto" },
  input: { padding: "10px", fontSize: "16px", borderRadius: "5px", border: "1px solid #ddd" },
  previewImage: { width: "100px", height: "100px", objectFit: "cover", marginTop: "10px" },
  button: { padding: "10px", fontSize: "16px", borderRadius: "5px", border: "none", backgroundColor: "#007bff", color: "white", cursor: "pointer" },
  carList: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px", justifyContent: "center", padding: "20px" },
  carCard: { border: "1px solid #ddd", borderRadius: "8px", padding: "15px", textAlign: "center" },
  carImage: { width: "100%", borderRadius: "8px" },
  editButton: { marginTop: "10px", marginRight: "5px", padding: "8px 15px", background: "#ffc107", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" },
  deleteButton: { marginTop: "10px", padding: "8px 15px", background: "#ff4d4d", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" },
};

export default Admin;
