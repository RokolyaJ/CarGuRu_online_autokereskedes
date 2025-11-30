import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../apiConfig";
import { useTheme } from "../context/ThemeContext";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    country: "Magyarország",
    terms: false,
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const validate = () => {
    if (!form.firstName.trim()) return "Az utónév kötelező.";
    if (!form.lastName.trim()) return "A vezetéknév kötelező.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return "Érvényes e-mail cím szükséges.";
    if (form.password.length < 8)
      return "A jelszónak legalább 8 karakter hosszúnak kell lennie.";
    if (form.password !== form.confirmPassword)
      return "A jelszavak nem egyeznek.";
    if (!form.terms) return "El kell fogadnod a feltételeket.";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const v = validate();
    if (v) return setError(v);

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          email: form.email.trim(),
          password: form.password,
          phone: form.phone.trim(),
          country: form.country,
        }),
      });

      if (!res.ok) throw new Error(await res.text());

      navigate("/login", {
        state: { success: "Sikeres regisztráció, jelentkezz be!" },
      });
    } catch (err) {
      setError(err.message || "Hiba történt a regisztráció során.");
    } finally {
      setLoading(false);
    }
  };

  const colors = {
    bg: darkMode ? "#121212" : "#f5f6f7",
    card: darkMode ? "#1e1e1e" : "#fff",
    text: darkMode ? "#e3e3e3" : "#111",
    inputBg: darkMode ? "#2a2a2a" : "#fff",
    inputBorder: darkMode ? "#3d3d3d" : "#cfd4dc",
    primary: "#0063E5",
  };

 const wrapper = {
  minHeight: "calc(100vh - 60px)", 
  background: colors.bg,
  color: colors.text,
  padding: "20px 12px",   
  marginTop: "60px",      
  display: "flex",
  justifyContent: "center",
  alignItems: "flex-start",
};

const card = {
  width: "100%",
  maxWidth: "520px",      
  background: colors.card,
  color: colors.text,
  padding: "18px 18px 20px", 
  borderRadius: "14px",      
  boxShadow: "0 5px 20px rgba(0,0,0,0.18)", 
};

const title = {
  fontSize: "22px",       
  fontWeight: 700,
  marginBottom: "12px",
};

const field = {
  display: "flex",
  flexDirection: "column",
  gap: "3px",
  marginBottom: "10px",   
  fontSize: "14px",
};

const input = {
  padding: "8px 10px",   
  borderRadius: "8px",
  border: `1px solid ${colors.inputBorder}`,
  background: colors.inputBg,
  fontSize: "14px",
};

const grid2 = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "10px",           
};

const btn = {
  width: "100%",
  padding: "10px 14px",   
  background: colors.primary,
  border: "none",
  borderRadius: "10px",
  color: "#fff",
  fontWeight: 700,
  cursor: "pointer",
  fontSize: "15px",
  marginTop: "6px",
  boxShadow: "0 3px 10px rgba(0,0,0,0.15)",
};


  const errBox = {
    background: "#ffdddd",
    color: "#7b0000",
    padding: "10px",
    borderRadius: "10px",
    border: "1px solid #f5b5b5",
    marginBottom: "12px",
    fontSize: "14px",
  };

  const checkbox = {
  display: "flex",
  alignItems: "center",
  gap: "6px",
  margin: "6px 0 10px",
  fontSize: "14px",
};


  return (
    <div style={wrapper}>
      <div style={card}>
        <h1 style={title}>Új fiók létrehozása</h1>

        {error && <div style={errBox}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <label style={field}>
            E-mail cím *
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              style={input}
              required
            />
          </label>

          <div style={grid2}>
            <label style={field}>
              Utónév *
              <input
                type="text"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                style={input}
                required
              />
            </label>

            <label style={field}>
              Vezetéknév *
              <input
                type="text"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                style={input}
                required
              />
            </label>
          </div>

          <label style={field}>
            Telefonszám
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              style={input}
            />
          </label>

          <label style={field}>
            Ország *
            <select
              name="country"
              value={form.country}
              onChange={handleChange}
              style={input}
              required
            >
              <option>Magyarország</option>
              <option>Ausztria</option>
              <option>Németország</option>
              <option>Szlovákia</option>
              <option>Románia</option>
            </select>
          </label>

          <div style={grid2}>
            <label style={field}>
              Jelszó *
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                style={input}
                required
              />
            </label>

            <label style={field}>
              Jelszó megerősítése *
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                style={input}
                required
              />
            </label>
          </div>

          <label style={checkbox}>
            <input
              type="checkbox"
              name="terms"
              checked={form.terms}
              onChange={handleChange}
            />
            Elfogadom a feltételeket
          </label>

          <button type="submit" style={btn} disabled={loading}>
            {loading ? "Fiók létrehozása..." : "Új fiók létrehozása"}
          </button>

          <div
            style={{
              marginTop: "14px",
              textAlign: "center",
              fontSize: "14px",
            }}
          >
            Már van fiókod?{" "}
            <a
              href="/login"
              style={{ color: colors.primary, fontWeight: 600 }}
            >
              Bejelentkezés
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
