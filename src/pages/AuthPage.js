import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, googleProvider, db, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup } from "../firebase";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { setDoc, doc } from "firebase/firestore";

const countries = ["Magyarország", "Egyesült Államok", "Németország", "Franciaország", "Olaszország"];

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    country: "",
    termsAccepted: false
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setError("");

    if (!isLogin) {
      if (formData.password !== formData.confirmPassword) {
        setError("A jelszavak nem egyeznek!");
        return;
      }

      if (!formData.termsAccepted) {
        setError("El kell fogadnia a felhasználási feltételeket!");
        return;
      }

      try {
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        const user = userCredential.user;

      
        await setDoc(doc(db, "users", user.uid), {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          country: formData.country,
          createdAt: new Date()
        });

        navigate("/"); 
      } catch (err) {
        setError(err.message);
      }
    } else {
      try {
        await signInWithEmailAndPassword(auth, formData.email, formData.password);
        navigate("/"); 
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

  
      await setDoc(doc(db, "users", user.uid), {
        firstName: user.displayName || "",
        lastName: "",
        email: user.email,
        phone: "",
        country: "",
        createdAt: new Date()
      });

      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.authBox}>
        <h2 style={styles.title}>{isLogin ? "Bejelentkezés" : "Regisztráció"}</h2>
        {error && <p style={styles.error}>{error}</p>}

        <button onClick={handleGoogleLogin} style={styles.socialButton}>🔵 Bejelentkezés Google-lel</button>
        <p style={styles.orSeparator}>VAGY</p>

        <form onSubmit={handleAuth} style={styles.form}>
          {!isLogin && (
            <>
              <input type="text" name="firstName" placeholder="Vezetéknév" value={formData.firstName} onChange={handleChange} required style={styles.input} />
              <input type="text" name="lastName" placeholder="Keresztnév" value={formData.lastName} onChange={handleChange} required style={styles.input} />
              <input type="text" name="phone" placeholder="Telefonszám" value={formData.phone} onChange={handleChange} required style={styles.input} />
              <select name="country" value={formData.country} onChange={handleChange} required style={styles.input}>
                <option value="">Válassz országot...</option>
                {countries.map((country, index) => (
                  <option key={index} value={country}>{country}</option>
                ))}
              </select>
            </>
          )}
          
          <input type="email" name="email" placeholder="Email cím" value={formData.email} onChange={handleChange} required style={styles.input} />
          <input type={showPassword ? "text" : "password"} name="password" placeholder="Jelszó" value={formData.password} onChange={handleChange} required style={styles.input} />
          
          {!isLogin && (
            <input type={showPassword ? "text" : "password"} name="confirmPassword" placeholder="Jelszó megerősítés" value={formData.confirmPassword} onChange={handleChange} required style={styles.input} />
          )}

          {!isLogin && (
            <label style={styles.checkboxLabel}>
              <input type="checkbox" name="termsAccepted" checked={formData.termsAccepted} onChange={handleChange} required />
              Elfogadom a felhasználási feltételeket
            </label>
          )}

          <button type="submit" style={styles.submitButton}>{isLogin ? "Bejelentkezés" : "Regisztráció"}</button>
        </form>

        <p style={styles.switchText}>
          {isLogin ? "Nincs még fiókja?" : "Már van fiókja?"}{" "}
          <span onClick={() => setIsLogin(!isLogin)} style={styles.switchLink}>
            {isLogin ? "Regisztráció" : "Bejelentkezés"}
          </span>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: { display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", backgroundColor: "#f5f5f5" },
  authBox: { background: "#fff", padding: "40px", borderRadius: "10px", boxShadow: "0 5px 15px rgba(0, 0, 0, 0.2)", width: "400px", textAlign: "center" },
  title: { fontSize: "24px", fontWeight: "bold", marginBottom: "10px" },
  input: { width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "5px", border: "1px solid #ccc" },
  submitButton: { width: "100%", padding: "10px", backgroundColor: "#007bff", color: "white", border: "none", cursor: "pointer" },
  switchText: { marginTop: "15px", fontSize: "14px" },
  switchLink: { color: "#007bff", cursor: "pointer", fontWeight: "bold" },
  error: { color: "red", fontSize: "14px", marginBottom: "10px" }
};

export default AuthPage;
