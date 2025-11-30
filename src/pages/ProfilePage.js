import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { API_BASE_URL } from "../apiConfig";

const ImageCarousel = ({ images }) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!images || images.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [images]);

  if (!images || images.length === 0) {
    return (
      <img
        src="/no-image.png"
        alt="no img"
        style={{
          width: "180px",
          height: "130px",
          objectFit: "cover",
          borderRadius: "8px",
        }}
      />
    );
  }

  return (
    <div style={{ position: "relative", width: "180px", height: "130px" }}>
      <img
        src={`${API_BASE_URL}${images[current].url}`}
        alt="car"
        style={{
          width: "180px",
          height: "130px",
          objectFit: "cover",
          borderRadius: "8px",
          transition: "opacity 0.5s ease-in-out",
        }}
      />
    </div>
  );
};

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
const { setUser } = useAuth();


  const [profile, setProfile] = useState({});
  const [saveMsg, setSaveMsg] = useState("");
  const [passMsg, setPassMsg] = useState("");
  const [passwords, setPasswords] = useState({ oldPassword: "", newPassword: "" });
const [recipientEmail, setRecipientEmail] = useState("");
const [transferAmount, setTransferAmount] = useState("");
const [transferMsg, setTransferMsg] = useState("");
const [profileImgMsg, setProfileImgMsg] = useState("");
const [newProfileImage, setNewProfileImage] = useState(null);


const handleTransfer = async () => {
  if (!recipientEmail || !transferAmount) {
    setTransferMsg("Add meg az email címet és az összeget!");
    return;
  }

  if (!window.confirm(`Biztosan elutalod ${transferAmount} Ft-ot a(z) ${recipientEmail} címre?`)) {
    return;
  }

  try {
    const res = await fetch(
      `${baseUrl}/api/users/transfer?recipientEmail=${recipientEmail}&amount=${transferAmount}`,
      {
        method: "PUT",
        headers: { Authorization: `Bearer ${user?.token}` },
      }
    );
    if (res.ok) {
      setTransferMsg("Utalás sikeresen elküldve!");
      setProfile((p) => ({ ...p, balance: p.balance - Number(transferAmount) }));
      setRecipientEmail("");
      setTransferAmount("");
    } else {
      const msg = await res.text();
      setTransferMsg(`Hiba: ${msg}`);
    }
  } catch (err) {
    console.error("Hiba az utalás során:", err);
    setTransferMsg("Kapcsolódási hiba.");
  }
};
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedType, setSelectedType] = useState("ID_CARD");
  const [documents, setDocuments] = useState([]);
  const [uploadMsg, setUploadMsg] = useState("");
  const [tradeIns, setTradeIns] = useState([]);
  const [tradeMsg, setTradeMsg] = useState("");
const baseUrl = API_BASE_URL;
const loadProfile = async () => {
  if (!user?.token) return;
  try {
    const res = await fetch(`${baseUrl}/api/users/me`, {
      headers: { Authorization: `Bearer ${user.token}` },
    });
    if (!res.ok) throw new Error("Nem sikerült betölteni a profiladatokat.");
    const data = await res.json();
    setProfile(data);
    await fetchDocuments(data.id);
    await fetchTradeIns(data.id);
  } catch (err) {
    console.error("Profil betöltési hiba:", err);
  }
};
const handleProfileImageUpload = async () => {
  if (!newProfileImage) {
    setProfileImgMsg("Kérlek válassz ki egy képet!");
    return;
  }

  const formData = new FormData();
  formData.append("file", newProfileImage);

  try {
    const res = await fetch(`${API_BASE_URL}/api/users/upload-profile-picture`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${user?.token}`
      },
      body: formData,
    });

    if (res.ok) {
      const data = await res.json();

      setProfile((p) => ({
        ...p,
        profileImage: data.url
      }));

      setUser((prev) => ({ ...prev, profileImage: data.url }));

      localStorage.setItem(
        "user",
        JSON.stringify({
          ...user,
          profileImage: data.url,
        })
      );

      await refreshUser();

      setProfileImgMsg("Profilkép sikeresen frissítve!");
      setNewProfileImage(null);
    } else {
      setProfileImgMsg("Hiba történt a feltöltéskor.");
    }
  } catch (err) {
    setProfileImgMsg("Kapcsolódási hiba.");
  }
};
const handleSetExistingProfileImage = async (imgUrl) => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/users/set-profile-picture`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user?.token}`
      },
      body: JSON.stringify({ imageUrl: imgUrl })
    });

    if (!res.ok) {
      setProfileImgMsg("Nem sikerült beállítani a képet.");
      return;
    }

    const data = await res.json();
    setProfile((p) => ({
      ...p,
      profileImage: data.url
    }));
    setUser((prev) => ({
      ...prev,
      profileImage: data.url
    }));

    localStorage.setItem(
      "user",
      JSON.stringify({
        ...user,
        profileImage: data.url,
      })
    );

    await refreshUser();
    setProfileImgMsg("Profilkép beállítva!");

  } catch (err) {
    console.error(err);
    setProfileImgMsg("Kapcsolódási hiba.");
  }
};



useEffect(() => {
  const localBal = localStorage.getItem("balance");
  if (localBal) {
    setProfile((prev) => ({ ...prev, balance: parseInt(localBal) }));
  }
  loadProfile();

  window.addEventListener("focus", loadProfile);
  return () => window.removeEventListener("focus", loadProfile);
}, [user]);
  const fetchDocuments = async (userId) => {
    try {
      const res = await fetch(`${baseUrl}/api/documents/get?userId=${userId}`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      if (res.ok) {
        setDocuments(await res.json());
      } else setDocuments([]);
    } catch (err) {
      console.error("Hiba a dokumentumok lekérésekor:", err);
    }
  };
  const fetchTradeIns = async (userId) => {
    try {
      const res = await fetch(`${baseUrl}/api/tradein/user/${userId}`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      if (res.ok) setTradeIns(await res.json());
    } catch (err) {
      console.error("Hiba az autók lekérésekor:", err);
    }
  };
const calculatePrice = (data) => {
  const year = parseInt(data.year) || 2015;
  const mileage = parseInt(data.mileage) || 0;
  const power = parseInt(data.power) || 0;
  const condition = parseInt(data.condition) || 3;

  let base = 10_000_000;
  let price =
    base -
    (2025 - year) * 300_000 -
    mileage * 10 +
    power * 1000 +
    (condition - 3) * 200_000;

  if (price < 500_000) price = 500_000;
  return Math.round(price);
};
  const handleSaveProfile = async () => {
    setSaveMsg("");
    const cleaned = {
      firstName: profile.firstName,
      lastName: profile.lastName,
      phone: profile.phone,
      country: profile.country,
      birthDate: profile.birthDate || null,
      birthPlace: profile.birthPlace,
      motherName: profile.motherName,
      idCardNumber: profile.idCardNumber,
      idCardExpiry: profile.idCardExpiry || null,
      personalNumber: profile.personalNumber,
      addressCountry: profile.addressCountry,
      addressCity: profile.addressCity,
      addressZip: profile.addressZip,
      addressStreet: profile.addressStreet,
      taxId: profile.taxId,
      taxCardNumber: profile.taxCardNumber,
      nationality: profile.nationality,
      bankAccount: profile.bankAccount,
    };

    try {
      const res = await fetch(`${baseUrl}/api/users/me/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify(cleaned),
      });

      if (res.ok) setSaveMsg("Profil sikeresen frissítve!");
      else setSaveMsg("Hiba történt a mentés során.");
    } catch {
      setSaveMsg("Kapcsolódási hiba.");
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadMsg("Kérlek, válassz ki egy fájlt!");
      return;
    }

    const formData = new FormData();
formData.append("userId", profile.id);  
formData.append("type", selectedType);
formData.append("file", selectedFile);


    try {
      const res = await fetch(`${baseUrl}/api/documents/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${user?.token}` },
        body: formData,
      });

      if (res.ok) {
        setUploadMsg("Fájl sikeresen feltöltve!");
        setSelectedFile(null);
        fetchDocuments(profile.id);
      } else {
        setUploadMsg("Hiba történt a feltöltéskor.");
      }
    } catch {
      setUploadMsg("Kapcsolódási hiba a szerverhez.");
    }
  };
const handleDelete = async (id) => {
  if (!window.confirm("Biztosan törölni szeretnéd ezt az autót?")) return;
  try {
    const res = await fetch(`${API_BASE_URL}/api/tradein/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${user?.token}` },
    });
    if (res.ok) {
      setTradeIns((prev) => prev.filter((c) => c.id !== id));
    }
  } catch (err) {
    console.error("Törlési hiba:", err);
  }
};

const handleEdit = (car) => {
  localStorage.setItem("editCarData", JSON.stringify(car));
  window.location.href = "/car-calculator";
};

  const handleChangePassword = async () => {
    setPassMsg("");
    try {
      const res = await fetch(`${baseUrl}/api/users/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify(passwords),
      });

      if (res.ok) {
        setPassMsg("Jelszó sikeresen módosítva!");
        setPasswords({ oldPassword: "", newPassword: "" });
      } else {
        setPassMsg("Hiba a jelszó módosításakor!");
      }
    } catch {
      setPassMsg("Kapcsolódási hiba.");
    }
  };
  const handleAccept = async (id) => {
  try {
    const res = await fetch(`${baseUrl}/api/tradein/${id}/accept`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${user?.token}` },
    });

    if (!res.ok) {
      setTradeMsg("Hiba az elfogadás során.");
      setTimeout(() => setTradeMsg(""), 3000);
      return;
    }

    const data = await res.json();
    setTradeMsg(data.message || "Autó elfogadva, egyenleg frissítve!");

    setProfile((prev) => ({ ...prev, balance: data.newBalance ?? prev.balance }));
    setTradeIns((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: "ACCEPTED" } : t))
    );
    setTimeout(() => setTradeMsg(""), 3000);
  } catch {
    setTradeMsg("Kapcsolódási hiba.");
    setTimeout(() => setTradeMsg(""), 3000);
  }
};



  const handleDecline = async (id) => {
    try {
      const res = await fetch(`${baseUrl}/api/tradein/${id}/decline`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      if (res.ok) {
        setTradeMsg("Autó elutasítva!");
        fetchTradeIns(profile.id);
      } else setTradeMsg("Hiba az elutasítás során.");
    } catch {
      setTradeMsg("Kapcsolódási hiba.");
    }
  };
const handleDeleteDocument = async (id) => {
  if (!window.confirm("Biztosan törölni szeretnéd ezt a dokumentumot?")) return;

  try {
    const res = await fetch(`${baseUrl}/api/documents/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${user?.token}` },
    });

    if (res.ok) {
      setDocuments((prev) => prev.filter((doc) => doc.id !== id));
    } else {
      alert("Hiba történt a törlés során.");
    }
  } catch (err) {
    console.error("Dokumentum törlési hiba:", err);
    alert("Kapcsolódási hiba.");
  }
};

  if (!profile) return <p className="profile-wrap">Betöltés...</p>;

  return (
    <div className="profile-wrap">
      <h1 className="page-title">Saját fiók</h1>

<section className="card-section">
  <h2 className="section-title">Egyenleged</h2>
  <p style={{ fontSize: "18px", fontWeight: "700", color: "#2563eb" }}>
    {profile.balance ? `${profile.balance.toLocaleString()} Ft` : "0 Ft"}
    
  </p>
  <button
    className="btn-primary"
    
    onClick={async () => {
      if (!profile.bankAccount || profile.bankAccount.trim() === "") {
  alert("Nincs megadva bankszámlaszám! Kérlek, töltsd ki a profilodban.");
  return;
}
      if (!window.confirm("Biztosan ki szeretnéd utalni a teljes egyenlegedet a számládra?")) return;
      try {
        const res = await fetch(`${baseUrl}/api/users/withdraw`, {
          method: "PUT",
          headers: { Authorization: `Bearer ${user?.token}` },
        });
        if (res.ok) {
          alert("Kifizetés megtörtént! Az egyenleged lenullázódott.");
          setProfile((p) => ({ ...p, balance: 0 }));
        } else {
          alert("Hiba történt az utalás közben.");
        }
      } catch (err) {
        console.error("Hiba:", err);
      }
    }}
    style={{ marginTop: "10px" }}
  >
    Utalás a saját számlámra
  </button>

  <div style={{ marginTop: "20px" }}>
    <h3 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "8px" }}>
      Pénz küldése másik felhasználónak
    </h3>
    <input
      type="email"
      placeholder="Címzett email címe"
      value={recipientEmail}
      onChange={(e) => setRecipientEmail(e.target.value)}
      style={{ width: "100%", marginBottom: "8px", padding: "8px" }}
    />
    <input
      type="number"
      placeholder="Összeg (Ft)"
      value={transferAmount}
      onChange={(e) => setTransferAmount(e.target.value)}
      style={{ width: "100%", marginBottom: "8px", padding: "8px" }}
    />
    <button
      className="btn-primary"
      onClick={handleTransfer}
    >
      Utalás indítása
    </button>
    {transferMsg && <p className="msg ok">{transferMsg}</p>}
  </div>
</section>
<section className="card-section">
  <h2 className="section-title">Banki adatok</h2>
  <div className="grid">

    <div className="floating-group">
      <input
        type="text"
        className={`floating-input ${profile.bankAccount ? "has-value" : ""}`}
        value={profile.bankAccount || ""}
        onChange={(e) =>
          setProfile({ ...profile, bankAccount: e.target.value })
        }
        placeholder=" "
      />
      <label className="floating-label">Bankszámlaszám</label>
    </div>

  </div>

  <button
    className="btn-primary"
    style={{ marginTop: "10px" }}
    onClick={async () => {
      if (!profile.bankAccount || profile.bankAccount.trim() === "") {
        alert("Kérlek, add meg a bankszámlaszámodat!");
        return;
      }

      try {
        const res = await fetch(`${baseUrl}/api/users/me/update`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
          body: JSON.stringify({ bankAccount: profile.bankAccount }),
        });

        if (res.ok) alert("Bankszámlaszám sikeresen mentve!");
        else alert("Hiba történt a mentés során.");
      } catch {
        alert("Kapcsolódási hiba a szerverhez.");
      }
    }}
  >
    Bankszámlaszám mentése
  </button>
</section>
<section className="card-section">
  <h2 className="section-title">Profilkép</h2>

  <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
    
   <img
  src={profile.profileImage || "/default-avatar.png"}
  alt="Profilkép"
  style={{
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "3px solid #ddd",
  }}
/>


    <div>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setNewProfileImage(e.target.files[0])}

      />
      <button
        className="btn-primary"
        style={{ marginTop: "10px" }}
        onClick={handleProfileImageUpload}
      >
        Profilkép mentése
      </button>
    </div>

  </div>

  {profileImgMsg && <p className="msg ok">{profileImgMsg}</p>}
</section>
<section className="card-section">
  <h3 className="section-title">Korábban feltöltött képek</h3>

  <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
    {profile.previousImages && profile.previousImages.length > 0 ? (
      profile.previousImages.map((url, index) => (
        <img
          key={index}
          src={url}
          alt="old profile"
          onClick={() => handleSetExistingProfileImage(url)}
          style={{
            width: "70px",
            height: "70px",
            borderRadius: "50%",
            objectFit: "cover",
            cursor: "pointer",
            border: "3px solid #ddd",
            transition: "0.2s",
          }}
        />
      ))
    ) : (
      <p>Nincs korábbi profilképed.</p>
    )}
  </div>
</section>


     <section className="card-section">
  <h2 className="section-title">Felhasználói adatok</h2>
  <div className="grid">

    <div className="floating-group">
      <input
        type="text"
        className={`floating-input ${profile.firstName ? "has-value" : ""}`}
        value={profile.firstName || ""}
        onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
        placeholder=" "
      />
      <label className="floating-label">Keresztnév</label>
    </div>

    <div className="floating-group">
      <input
        type="text"
        className={`floating-input ${profile.lastName ? "has-value" : ""}`}
        value={profile.lastName || ""}
        onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
        placeholder=" "
      />
      <label className="floating-label">Vezetéknév</label>
    </div>

    <div className="floating-group">
      <input
        type="text"
        className={`floating-input ${profile.phone ? "has-value" : ""}`}
        value={profile.phone || ""}
        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
        placeholder=" "
      />
      <label className="floating-label">Telefonszám</label>
    </div>

    <div className="floating-group">
      <input
        type="text"
        className={`floating-input ${profile.country ? "has-value" : ""}`}
        value={profile.country || ""}
        onChange={(e) => setProfile({ ...profile, country: e.target.value })}
        placeholder=" "
      />
      <label className="floating-label">Ország</label>
    </div>

  </div>
</section>
<section className="card-section">
  <h2 className="section-title">Jelszó módosítása</h2>

  <div className="grid">

    <div className="floating-group">
      <input
        type="password"
        className={`floating-input ${passwords.oldPassword ? "has-value" : ""}`}
        value={passwords.oldPassword}
        onChange={(e) =>
          setPasswords((p) => ({ ...p, oldPassword: e.target.value }))
        }
        placeholder=" "
      />
      <label className="floating-label">Régi jelszó</label>
    </div>

    <div className="floating-group">
      <input
        type="password"
        className={`floating-input ${passwords.newPassword ? "has-value" : ""}`}
        value={passwords.newPassword}
        onChange={(e) =>
          setPasswords((p) => ({ ...p, newPassword: e.target.value }))
        }
        placeholder=" "
      />
      <label className="floating-label">Új jelszó</label>
    </div>

  </div>

  <button className="btn-primary" onClick={handleChangePassword}>
    Jelszó frissítése
  </button>

  {passMsg && <p className="msg ok">{passMsg}</p>}
</section>

     <section className="card-section">
  <h2 className="section-title">Személyes és igazolvány adatok</h2>
  <div className="grid">

    <div className="floating-group">
      <input
        type="date"
        className={`floating-input ${profile.birthDate ? "has-value" : ""}`}
        value={profile.birthDate ? profile.birthDate.substring(0, 10) : ""}
        onChange={(e) =>
          setProfile({ ...profile, birthDate: e.target.value })
        }
        placeholder=" "
      />
      <label className="floating-label">Születési dátum</label>
    </div>

    <div className="floating-group">
      <input
        type="date"
        className={`floating-input ${profile.idCardExpiry ? "has-value" : ""}`}
        value={profile.idCardExpiry ? profile.idCardExpiry.substring(0, 10) : ""}
        onChange={(e) =>
          setProfile({ ...profile, idCardExpiry: e.target.value })
        }
        placeholder=" "
      />
      <label className="floating-label">Igazolvány lejárati dátuma</label>
    </div>

    <div className="floating-group">
      <input
        type="text"
        className={`floating-input ${profile.motherName ? "has-value" : ""}`}
        value={profile.motherName || ""}
        onChange={(e) =>
          setProfile({ ...profile, motherName: e.target.value })
        }
        placeholder=" "
      />
      <label className="floating-label">Anyja neve</label>
    </div>

    <div className="floating-group">
      <input
        type="text"
        className={`floating-input ${profile.idCardNumber ? "has-value" : ""}`}
        value={profile.idCardNumber || ""}
        onChange={(e) =>
          setProfile({ ...profile, idCardNumber: e.target.value })
        }
        placeholder=" "
      />
      <label className="floating-label">Személyi igazolvány száma</label>
    </div>

    <div className="floating-group">
      <input
        type="text"
        className={`floating-input ${profile.personalNumber ? "has-value" : ""}`}
        value={profile.personalNumber || ""}
        onChange={(e) =>
          setProfile({ ...profile, personalNumber: e.target.value })
        }
        placeholder=" "
      />
      <label className="floating-label">Személyi szám</label>
    </div>

    <div className="floating-group">
      <input
        type="text"
        className={`floating-input ${profile.nationality ? "has-value" : ""}`}
        value={profile.nationality || ""}
        onChange={(e) =>
          setProfile({ ...profile, nationality: e.target.value })
        }
        placeholder=" "
      />
      <label className="floating-label">Állampolgárság</label>
    </div>

  </div>
</section>





      <section className="card-section">
  <h2 className="section-title">Lakcím és adó adatok</h2>
  <div className="grid">

    <div className="floating-group">
      <input
        type="text"
        className={`floating-input ${profile.addressCountry ? "has-value" : ""}`}
        value={profile.addressCountry || ""}
        onChange={(e) =>
          setProfile({ ...profile, addressCountry: e.target.value })
        }
        placeholder=" "
      />
      <label className="floating-label">Ország</label>
    </div>

    <div className="floating-group">
      <input
        type="text"
        className={`floating-input ${profile.addressCity ? "has-value" : ""}`}
        value={profile.addressCity || ""}
        onChange={(e) =>
          setProfile({ ...profile, addressCity: e.target.value })
        }
        placeholder=" "
      />
      <label className="floating-label">Város</label>
    </div>

    <div className="floating-group">
      <input
        type="text"
        className={`floating-input ${profile.addressZip ? "has-value" : ""}`}
        value={profile.addressZip || ""}
        onChange={(e) =>
          setProfile({ ...profile, addressZip: e.target.value })
        }
        placeholder=" "
      />
      <label className="floating-label">Irányítószám</label>
    </div>

    <div className="floating-group">
      <input
        type="text"
        className={`floating-input ${profile.addressStreet ? "has-value" : ""}`}
        value={profile.addressStreet || ""}
        onChange={(e) =>
          setProfile({ ...profile, addressStreet: e.target.value })
        }
        placeholder=" "
      />
      <label className="floating-label">Utca, házszám</label>
    </div>

    <div className="floating-group">
      <input
        type="text"
        className={`floating-input ${profile.taxId ? "has-value" : ""}`}
        value={profile.taxId || ""}
        onChange={(e) =>
          setProfile({ ...profile, taxId: e.target.value })
        }
        placeholder=" "
      />
      <label className="floating-label">Adószám</label>
    </div>

    <div className="floating-group">
      <input
        type="text"
        className={`floating-input ${profile.taxCardNumber ? "has-value" : ""}`}
        value={profile.taxCardNumber || ""}
        onChange={(e) =>
          setProfile({ ...profile, taxCardNumber: e.target.value })
        }
        placeholder=" "
      />
      <label className="floating-label">Adókártya szám</label>
    </div>

  </div>

  <button className="btn-primary" onClick={handleSaveProfile}>
    Mentés
  </button>

  {saveMsg && <p className="msg ok">{saveMsg}</p>}
</section>


<section className="card-section">
  <h2 className="section-title">Feltöltött autóim</h2>
  {tradeIns.length === 0 && <p>Nincs még feltöltött autód.</p>}
  <div className="saved-cars">
    {tradeIns.map((car) => {
      const price = calculatePrice(car);
      const details = [
        car.year && `${car.year}`,
        car.mileage && `${car.mileage.toLocaleString()} km`,
        car.fuelType && `Üzemanyag: ${car.fuelType}`,
        (car.driveType || car.drivetrain) && `Hajtás: ${car.driveType || car.drivetrain}`,
        car.transmission && `Sebességváltó: ${car.transmission}`,
        car.condition && `Állapot: ${car.condition}/5`,
        car.color && `Külső szín: ${car.color}`,
        car.interiorColor && `Kárpit: ${car.interiorColor}`,
        car.bodyType && `Kivitel: ${car.bodyType}`,
        car.seats && `Ülések száma: ${car.seats}`,
        car.engineSize && `Motor: ${car.engineSize} cm³`,
        car.power && `Teljesítmény: ${car.power} kW`,
        car.luggage && `Csomagtartó: ${car.luggage} liter`,
        car.weight && `Teljes tömeg: ${car.weight} kg`,
        car.documents && `Okmányok: ${car.documents}`,
        car.technicalValidity && `Műszaki érvényessége: ${car.technicalValidity}`,
      ].filter(Boolean);

      return (
        <div key={car.id} className="saved-car-card">
          <div className="saved-car-image">
            <ImageCarousel images={car.images} />
          </div>

          <div className="saved-car-info">
            <h2 className="car-title">{car.make} {car.model}</h2>
            <p className="seller">Forgalmazza: CarGuru</p>

            {details.length > 0 && (
              <div className="car-meta">{details.join(" • ")}</div>
            )}

            {car.description && (
              <div className="car-description">
                <strong>Leírás:</strong> {car.description}
              </div>
            )}

            <div className="bottom-row">
              <div className="price">{price.toLocaleString()} Ft</div>
              <div className="buttons">
  <button className="btn-primary" onClick={() => handleEdit(car)}>
    Módosítás
  </button>
  <button
    className="btn-danger"
    onClick={() => handleDelete(car.id)}
  >
    Törlés
  </button>
</div>

            </div>
          </div>
        </div>
      );
    })}
  </div>
</section>


      <section className="card-section">
        <h2 className="section-title">Dokumentum feltöltés</h2>
        <div className="grid">
          <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
            <option value="ID_CARD">Személyi igazolvány</option>
            <option value="ADDRESS_CARD">Lakcímkártya</option>
            <option value="DRIVING_LICENSE">Jogosítvány</option>
            <option value="OTHER">Egyéb</option>
          </select>
          <input type="file" onChange={(e) => setSelectedFile(e.target.files[0])} />
        </div>
        <button className="btn-primary" onClick={handleUpload}>Feltöltés</button>
        {uploadMsg && <p className="msg ok">{uploadMsg}</p>}

        {documents.length > 0 ? (
          <ul style={{ marginTop: "10px", listStyle: "none", padding: 0 }}>
            {documents.map((d) => {
              const fileName = d.url.split("/").pop();
              return (
                <li
                  key={d.id}
                  style={{
                    background: "#f3f4f6",
                    padding: "10px 12px",
                    borderRadius: "8px",
                    marginBottom: "8px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                 <div>
  <strong>{d.type}</strong>{" "}
  <span style={{ color: "#666" }}>({fileName})</span>
  <br />
  <span
    style={{
      fontSize: "0.9rem",
      color: d.status === "PENDING" ? "#ca8a04" : "#16a34a",
      fontWeight: 500,
    }}
  >
    {d.status === "PENDING" ? "Jóváhagyás alatt" : "Elfogadva"}
  </span>
</div>

<div style={{ display: "flex", gap: "10px" }}>
  <a
   href={d.url}

    target="_blank"
    rel="noopener noreferrer"
    style={{
      background: "#2563eb",
      color: "#fff",
      padding: "6px 12px",
      borderRadius: "6px",
      textDecoration: "none",
      fontWeight: 500,
    }}
  >
    Megnyitás
  </a>

  <button
    onClick={() => handleDeleteDocument(d.id)}
    style={{
      background: "#ef4444",
      color: "#fff",
      padding: "6px 12px",
      borderRadius: "6px",
      border: "none",
      cursor: "pointer",
      fontWeight: 500,
    }}
  >
    Törlés
  </button>
</div>

                </li>
              );
            })}
          </ul>
        ) : (
          <p>Nincsenek feltöltött dokumentumok.</p>
        )}
      </section>

    



      <style>{`
        .profile-wrap { max-width: 900px; margin: 40px auto; padding: 20px; }
        .page-title { font-size: 28px; font-weight: 800; margin-bottom: 22px; }
        .card-section { background: #fafafa; border: 1px solid #e5e7eb; border-radius: 12px; padding: 22px; margin-bottom: 26px; }
        .section-title { font-size: 20px; font-weight: 700; margin-bottom: 10px; }
        .grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 40px;   /* EZ TOLJA JOBBRA A MÁSODIK OSZLOPOT */
  row-gap: 14px;
}
.btn-primary {
  background: #2563eb;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 10px 16px;
  cursor: pointer;
  font-weight: 600;
}

.btn-primary:hover {
  background: #1d4ed8;
}

.btn-danger {
  background: #ef4444;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 10px 16px;
  cursor: pointer;
  font-weight: 600;
}

.btn-danger:hover {
  background: #dc2626;
}

        input, select { padding: 10px; border-radius: 8px; border: 1px solid #ccc; }
        .btn-primary { margin-top: 10px; background: #2563eb; color: #fff; border: none; border-radius: 8px; padding: 10px 16px; cursor: pointer; font-weight: 600; }
        .btn-primary:hover { background: #1d4ed8; }
        .tradein-item { margin-bottom: 15px; padding: 12px; background: #fff; border-radius: 10px; border: 1px solid #ddd; }
        .actions button { margin-right: 10px; padding: 6px 12px; border-radius: 8px; border: none; cursor: pointer; }
        .actions button:first-child { background: #22c55e; color: white; }
        .actions button:last-child { background: #ef4444; color: white; }
        .msg.ok { color: #16a34a; margin-top: 8px; font-weight: 600; }
        .msg.ok {
  color: #16a34a;
  margin-top: 8px;
  font-weight: 600;
}
.floating-group {
  position: relative;
}

.floating-input {
  width: 100%;
  padding: 14px 12px 10px 12px;
  border-radius: 8px;
  border: 1px solid #ccc;
  background: white;
  font-size: 15px;
  outline: none;
}

.floating-label {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #888;
  font-size: 15px;
  pointer-events: none;
  background: white;
  transition: 0.2s;
  padding: 0 4px;
}

/* animáció amikor be van írva valami */
.floating-input:focus + .floating-label,
.floating-input.has-value + .floating-label {
  top: -6px;
  font-size: 12px;
  color: #2563eb;
}


      `}</style>
    </div>
  );
}
