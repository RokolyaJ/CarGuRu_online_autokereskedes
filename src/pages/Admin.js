import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../apiConfig";

export default function Admin() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const [editUser, setEditUser] = useState(null);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    country: "",
  });

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (user.role !== "ADMIN") {
      setMessage("Nincs jogosultságod az admin felülethez.");
      setLoading(false);
      return;
    }
    fetchUsers();
  }, [user, navigate]);

  const authHeader = () => {
    try {
      const stored = localStorage.getItem("user");
      if (!stored) return {};
      const parsed = JSON.parse(stored);
      const token = parsed.token;
      if (!token) return {};
      return { Authorization: `Bearer ${token}` };
    } catch (e) {
      console.error("Token olvasási hiba:", e);
      return {};
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/users`, {
        headers: {
          ...authHeader(),
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("Nem sikerült betölteni a felhasználókat.");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const openReset = (u) => {
    setSelectedUser(u);
    setNewPassword("");
    setMessage("");
  };

  const doResetPassword = async () => {
    if (!newPassword || newPassword.length < 8) {
      setMessage("A jelszó legalább 8 karakter kell legyen.");
      return;
    }

    try {
      const res = await fetch(
        `${API_BASE_URL}/api/admin/users/${selectedUser.id}/reset-password`,
        {
          method: "PUT",
          headers: {
            ...authHeader(),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ newPassword }),
        }
      );

      if (!res.ok) {
        const t = await res.text();
        throw new Error(t || "Hiba a jelszó visszaállításakor.");
      }

      setMessage("Jelszó sikeresen visszaállítva.");
      setSelectedUser(null);
      fetchUsers();
    } catch (err) {
      setMessage(err.message);
    }
  };

  const changeRole = async (id, role) => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/admin/users/${id}/role?role=${role}`,
        {
          method: "PUT",
          headers: {
            ...authHeader(),
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        const t = await res.text();
        throw new Error(t || "Hiba a szerep módosításakor.");
      }

      setMessage("Szerep sikeresen módosítva.");
      fetchUsers();
    } catch (err) {
      setMessage(err.message);
    }
  };
  const openEdit = (u) => {
    setEditUser(u);
    setForm({
      firstName: u.firstName,
      lastName: u.lastName,
      email: u.email,
      phone: u.phone || "",
      country: u.country || "",
    });
    setMessage("");
  };
  const saveUserEdit = async () => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/admin/users/${editUser.id}`,
        {
          method: "PUT",
          headers: {
            ...authHeader(),
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      if (!res.ok) throw new Error(await res.text());

      setMessage("Felhasználó sikeresen módosítva!");
      setEditUser(null);
      fetchUsers();
    } catch (err) {
      setMessage(err.message);
    }
  };

  if (loading) return <p style={{ padding: 24 }}>Betöltés...</p>;

  return (
    <div
      style={{
        padding: "100px 24px 40px",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      <h1 style={{ marginBottom: 20 }}>Admin – Felhasználók kezelése</h1>

      {message && (
        <div style={{ margin: "10px 0", color: "red" }}>{message}</div>
      )}

      <div style={{ overflowX: "auto" }}>
        <table
  style={{
    width: "100%",
    minWidth: "900px",
    borderCollapse: "collapse",
    tableLayout: "fixed",  
    backgroundColor: "#fff",
    color: "#000",
    borderRadius: "8px",
  }}
>

          <thead>
            <tr style={{ textAlign: "left", borderBottom: "1px solid #ddd" }}>
              <th style={thStyle}>Név</th>
              <th style={thStyle}>Email</th>
              <th style={thStyle}>Telefon</th>
              <th style={thStyle}>Ország</th>
              <th style={thStyle}>Szerep</th>
              <th style={thStyle}>Regisztrálva</th>
              <th style={{ ...thStyle, width: "270px" }}>Műveletek</th>

            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} style={{ borderBottom: "1px solid #f1f1f1" }}>
                <td style={tdStyle}>
                  {u.firstName} {u.lastName}
                </td>
                <td
              style={{
                ...tdStyle,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: "250px",
              }}
              title={u.email}
            >
              {u.email}
            </td>

                <td style={tdStyle}>{u.phone || "-"}</td>
                <td style={tdStyle}>{u.country || "-"}</td>
                <td style={tdStyle}>{u.role}</td>
                <td style={tdStyle}>
                  {new Date(u.createdAt).toLocaleString()}
                </td>
                <td
              style={{
                ...tdStyle,
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
                gap: "8px",
                flexWrap: "nowrap",
              }}
            >
              <button onClick={() => openReset(u)} style={btnStyle}>
                Jelszó
              </button>
              <button onClick={() => openEdit(u)} style={btnStyle}>
                Szerkesztés
              </button>
              {u.role !== "ADMIN" ? (
                <button
                  onClick={() => changeRole(u.id, "ADMIN")}
                  style={btnStyle}
                >
                  Admin
                </button>
              ) : (
                <button
                  onClick={() => changeRole(u.id, "USER")}
                  style={btnStyle}
                >
                  Eltávolít
                </button>
              )}
            </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

     {selectedUser && (
  <div
    style={{
      marginTop: 40,
      padding: 30,
      borderRadius: 12,
      background: "#ffffff",
      maxWidth: 500,
      marginLeft: "auto",
      marginRight: "auto",
      boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
    }}
  >
    <h2
      style={{
        marginBottom: 20,
        fontSize: "22px",
        fontWeight: "600",
      }}
    >
      Jelszó visszaállítása:
      {" "}
      {selectedUser.firstName} {selectedUser.lastName}
    </h2>

    <label style={labelStyle}>Új jelszó</label>
    <input
      type="password"
      placeholder="Új jelszó"
      value={newPassword}
      onChange={(e) => setNewPassword(e.target.value)}
      style={editInputStyle}
    />

    <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
      <button
        onClick={doResetPassword}
        style={{
          flex: 1,
          padding: "10px 0",
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: 6,
          cursor: "pointer",
          fontSize: "15px",
          fontWeight: "500",
        }}
      >
        Visszaállít
      </button>

      <button
        onClick={() => setSelectedUser(null)}
        style={{
          flex: 1,
          padding: "10px 0",
          backgroundColor: "#6c757d",
          color: "#fff",
          border: "none",
          borderRadius: 6,
          cursor: "pointer",
          fontSize: "15px",
          fontWeight: "500",
        }}
      >
        Mégse
      </button>
    </div>
  </div>
)}


      {editUser && (
  <div
    style={{
      marginTop: 40,
      padding: 30,
      borderRadius: 12,
      background: "#ffffff",
      maxWidth: 500,
      marginLeft: "auto",
      marginRight: "auto",
      boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
    }}
  >
    <h2
      style={{
        marginBottom: 20,
        fontSize: "22px",
        fontWeight: "600",
      }}
    >
      Felhasználó szerkesztése
    </h2>

    <label style={labelStyle}>Keresztnév</label>
    <input
      placeholder="Keresztnév"
      value={form.firstName}
      onChange={(e) => setForm({ ...form, firstName: e.target.value })}
      style={editInputStyle}
    />

    <label style={labelStyle}>Vezetéknév</label>
    <input
      placeholder="Vezetéknév"
      value={form.lastName}
      onChange={(e) => setForm({ ...form, lastName: e.target.value })}
      style={editInputStyle}
    />

    <label style={labelStyle}>Email</label>
    <input
      placeholder="Email"
      value={form.email}
      onChange={(e) => setForm({ ...form, email: e.target.value })}
      style={editInputStyle}
    />

    <label style={labelStyle}>Telefon</label>
    <input
      placeholder="Telefon"
      value={form.phone}
      onChange={(e) => setForm({ ...form, phone: e.target.value })}
      style={editInputStyle}
    />

    <label style={labelStyle}>Ország</label>
    <input
      placeholder="Ország"
      value={form.country}
      onChange={(e) => setForm({ ...form, country: e.target.value })}
      style={editInputStyle}
    />

    <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
      <button
        onClick={saveUserEdit}
        style={{
          flex: 1,
          padding: "10px 0",
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: 6,
          cursor: "pointer",
          fontSize: "15px",
          fontWeight: "500",
        }}
      >
        Mentés
      </button>

      <button
        onClick={() => setEditUser(null)}
        style={{
          flex: 1,
          padding: "10px 0",
          backgroundColor: "#6c757d",
          color: "#fff",
          border: "none",
          borderRadius: 6,
          cursor: "pointer",
          fontSize: "15px",
          fontWeight: "500",
        }}
      >
        Mégse
      </button>
    </div>
  </div>
)}

    </div>
  );
}

const thStyle = {
  padding: "10px 12px",
  fontWeight: "bold",
  whiteSpace: "nowrap",
};

const tdStyle = {
  padding: "10px 12px",
  wordBreak: "break-word",
  verticalAlign: "top",
};

const btnStyle = {
  marginRight: 8,
  padding: "6px 10px",
  backgroundColor: "#007bff",
  border: "none",
  borderRadius: 4,
  color: "#fff",
  cursor: "pointer",
  fontSize: "14px",
};
const labelStyle = {
  marginBottom: 6,
  fontWeight: "500",
  fontSize: "14px",
  display: "block",
};

const editInputStyle = {
  padding: 10,
  width: "100%",
  marginBottom: 18,
  borderRadius: 6,
  border: "1px solid #ccc",
  fontSize: "15px",
};

const inputStyle = {
  padding: 8,
  width: "100%",
  margin: "10px 0",
  borderRadius: 4,
  border: "1px solid #ccc",
};
