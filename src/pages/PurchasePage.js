import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../apiConfig";

export default function PurchasePage() {
  const location = useLocation();
  const carData = location.state?.car || null;

const [userId, setUserId] = useState(null);
  const [carId, setCarId] = useState(carData?.id || 1);
const baseUrl = API_BASE_URL;

  const [order, setOrder] = useState(null);
  const [payment, setPayment] = useState("CARD");
  const [leasingMonths, setLeasingMonths] = useState(60);
  const [totalPrice, setTotalPrice] = useState(carData?.price || 0);
  const [casco, setCasco] = useState(false);
  const [compulsory, setCompulsory] = useState(false);
  const [deliveryType, setDeliveryType] = useState("IN_STORE");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [docType, setDocType] = useState("ID_CARD");
  const [docUrl, setDocUrl] = useState("");
  const [uploadedDocs, setUploadedDocs] = useState([]);
  const [tradeIn, setTradeIn] = useState({
    make: "",
    model: "",
    year: 2018,
    mileageKm: 100000,
    vin: "",
  });
  const [tradeInValue, setTradeInValue] = useState(null);
  const [statusMsg, setStatusMsg] = useState("");

  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [hasSavedCard, setHasSavedCard] = useState(false);
  const [downPayment, setDownPayment] = useState(20); 
    const [interestRate, setInterestRate] = useState(7.5); 
    const [monthlyPayment, setMonthlyPayment] = useState(0);
    const [bank, setBank] = useState("OTP Bank");
    const [isEditingCard, setIsEditingCard] = useState(false);
const [deliveryData, setDeliveryData] = useState(null);


const [insuranceProvider, setInsuranceProvider] = useState("Allianz");
const [insuranceType, setInsuranceType] = useState("CASCO");
const [insuranceDuration, setInsuranceDuration] = useState(12);
const [bonusClass, setBonusClass] = useState("B10");
const [insurancePrice, setInsurancePrice] = useState(0); 
const [availableStores, setAvailableStores] = useState([]);
const [selectedStoreId, setSelectedStoreId] = useState(null);
const { user } = useAuth();
const [profile, setProfile] = useState(null);
const [selectedFile, setSelectedFile] = useState(null);
  const [useTradeIn, setUseTradeIn] = useState(false);
  const [finalAmount, setFinalAmount] = useState(carData?.price || 0);
const navigate = useNavigate();

  useEffect(() => {
    if (carData) {
      setTotalPrice(carData.price);
      setCarId(carData.id);
    }
  }, [carData]);

  useEffect(() => {
  if (!userId) return; 
  async function fetchCard() {
    try {
      const res = await fetch(`${baseUrl}/api/paymentinfo/get?userId=${userId}`, {
  headers: {
    Authorization: `Bearer ${user.token}`,
    Accept: "application/json",
  },
});

      if (res.ok) {
    const data = await res.json(); 
    setCardName(data.cardName);
    setCardNumber(data.cardNumber);
    setCardExpiry(data.cardExpiry);
    setCardCvv(data.cardCvv);
    setHasSavedCard(true);
    setIsEditingCard(false);
  }

    } catch (e) {
      console.error("Nem sikerült betölteni a mentett kártyaadatokat:", e);
    }
  }
  fetchCard();
}, [userId]);

useEffect(() => {
  if (payment === "LEASING") {
    const loanAmount = totalPrice * (1 - downPayment / 100);
    const monthlyRate = interestRate / 100 / 12;
    const monthly =
      (loanAmount * monthlyRate) /
      (1 - Math.pow(1 + monthlyRate, -leasingMonths));
    setMonthlyPayment(Math.round(monthly));
  }
}, [leasingMonths, downPayment, interestRate, totalPrice, payment]);
useEffect(() => {
  const base = 25000;
  const typeMultiplier = insuranceType === "CASCO" ? 1.8 : 1.0;
  const bonusDiscount = bonusClass.startsWith("B") ? 0.9 : 1.2;
  const annualPrice = (base + totalPrice * 0.005) * typeMultiplier * bonusDiscount;
  const durationFactor = insuranceDuration / 12;

  const price = Math.round(annualPrice * durationFactor);
  setInsurancePrice(price);
}, [insuranceType, bonusClass, totalPrice, insuranceDuration]);

useEffect(() => {
  async function fetchStores() {
    if (deliveryType === "IN_STORE" && carData) {
      let modelParam = carData.model || carData.name || carData.modelName || "";
      const words = modelParam.split(" ");
      const shortModel = words.find(w => /^[A-Z0-9]+$/.test(w)) || modelParam;
      modelParam = shortModel;

      console.log("Fetch indul model:", modelParam);

      try {
        const res = await fetch(
          `${baseUrl}/api/stock-vehicle/available?model=${encodeURIComponent(modelParam)}`
        );
        if (res.ok) {
          const data = await res.json();
          console.log("Bolt adatok érkeztek:", data);
          setAvailableStores(data);
        } else {
          console.warn("Fetch hiba:", res.status);
          setAvailableStores([]);
        }
      } catch (err) {
        console.error("Hiba a fetch során:", err);
        setAvailableStores([]);
      }
    }
  }

  const timeout = setTimeout(fetchStores, 300);
  return () => clearTimeout(timeout);
}, [deliveryType, carData]);

useEffect(() => {
  async function loadDocuments() {
    if (!userId || !user?.token) return;

    try {
      const res = await fetch(`${baseUrl}/api/documents/get?userId=${userId}`, {
        headers: {
          Authorization: `Bearer ${user.token}`, 
        },
      });

      if (res.ok) {
        const data = await res.json();
        setUploadedDocs(data);
      } else if (res.status === 403) {
        console.warn("403 - Jogosultsági hiba a dokumentumok lekérésekor");
        setUploadedDocs([]);
      } else {
        console.warn("Lekérési hiba:", res.status);
        setUploadedDocs([]);
      }
    } catch (err) {
      console.error("Nem sikerült betölteni a dokumentumokat:", err);
    }
  }

  loadDocuments();
}, [userId, user]);

useEffect(() => {
  async function fetchProfile() {
    if (!user?.token) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/users/me`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          Accept: "application/json",
        },
      });
      if (!res.ok) throw new Error("Nem sikerült betölteni a profiladatokat.");
      const data = await res.json();
      setProfile(data);
      if (data?.id) {
  setUserId(data.id);
}
    } catch (err) {
      console.error("Profil betöltési hiba:", err);
    }
  }
  fetchProfile();
}, [user]);
const [saveMsg, setSaveMsg] = useState("");
useEffect(() => {
  if (!profile || !profile.balance) {
    setFinalAmount(totalPrice);
    return;
  }

  const balance = profile.balance;
  if (payment === "BALANCE") {
    if (balance >= totalPrice) {
      setFinalAmount(0);
    } else {
      setFinalAmount(totalPrice - balance);
    }
  } else {
    setFinalAmount(totalPrice);
  }
}, [payment, profile, totalPrice]);

async function handleSaveProfile() {
  if (!user?.token || !profile) return;

  const cleaned = {
    firstName: profile.firstName,
    lastName: profile.lastName,
    phone: profile.phone,
    country: profile.country,
    addressCity: profile.addressCity,
    addressZip: profile.addressZip,
    addressStreet: profile.addressStreet,
    taxId: profile.taxId,
  };

  try {
    const res = await fetch(`${API_BASE_URL}/api/users/me/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify(cleaned),
    });

    if (res.ok) {
      setSaveMsg("Adataid sikeresen elmentve!");
    } else {
      setSaveMsg("Hiba történt a mentés során!");
    }
  } catch (err) {
    setSaveMsg("Kapcsolódási hiba a szerverhez.");
  }
}
  async function savePaymentInfo() {
  if (!cardName || !cardNumber || !cardExpiry || !cardCvv)
    return alert("Kérlek, tölts ki minden mezőt!");

  if (!user || !user.token) {
    alert("Kérlek, jelentkezz be újra — nincs érvényes token!");
    return;
  }

  const params = new URLSearchParams();
  params.append("userId", userId);
  params.append("cardName", cardName);
  params.append("cardNumber", cardNumber);
  params.append("cardExpiry", cardExpiry);
  params.append("cardCvv", cardCvv);

  try {
    const res = await fetch(`${baseUrl}/api/paymentinfo/save`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
      body: params,
    });

    if (res.ok) {
      setStatusMsg("Kártyaadatok mentve!");
      setHasSavedCard(true);
      setIsEditingCard(false); 
      setTimeout(() => setStatusMsg(""), 2000);
    } else if (res.status === 401 || res.status === 403) {
      setStatusMsg("Nincs jogosultság — jelentkezz be újra!");
    } else {
      setStatusMsg("Hiba történt a mentés során!");
    }
  } catch (err) {
    console.error("Hálózati hiba:", err);
    setStatusMsg("Nem sikerült kapcsolatot létesíteni a szerverrel!");
  }
}


async function saveLeasingDetails() {
  setStatusMsg("Lízing adatok mentése...");
  const params = new URLSearchParams();
  params.append("userId", userId);
  params.append("carId", carId);
  params.append("months", leasingMonths);
  params.append("downPayment", downPayment);
  params.append("interestRate", interestRate);
  params.append("bank", bank);
  params.append("monthlyPayment", monthlyPayment);

  const res = await fetch(`${baseUrl}/api/leasing/save`, {
    method: "POST",
    body: params,
  });
  if (res.ok) {
    setStatusMsg("Lízing adatok mentve!");
  } else {
    setStatusMsg("Hiba a lízing mentésekor!");
  }
}
async function payWithBalance() {
  setStatusMsg("Egyenlegből fizetés folyamatban...");

  const res = await fetch(`${baseUrl}/api/orders/purchase-with-balance`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      userId: userId,
      carId: carId,
      totalPrice: totalPrice,
    }),
  });

  if (res.ok) {
    const data = await res.json();
    if (data.paymentStatus === "PAID") {
      setStatusMsg(" Teljes összeg kifizetve az egyenlegből!");
    } else if (data.paymentStatus === "PARTIALLY_PAID") {
      setStatusMsg("Részben kifizetve az egyenlegből, a fennmaradó összeget kártyával kell fizetni!");
    }
    setOrder(data);
  } else {
    setStatusMsg("Hiba történt a fizetés során!");
  }
}

  async function createOrder() {
  setStatusMsg("Rendelés létrehozása...");

  const orderData = {
    user: { id: userId },
    carId: carId,
    totalPriceHuf: totalPrice,
    payment: payment,
    paymentStatus: "PENDING",
    insuranceProvider: insuranceProvider,
    insuranceType: insuranceType,
    insuranceDurationMonths: insuranceDuration,
    insuranceBonusLevel: bonusClass,
    insuranceEstimatedFee: insurancePrice,
    deliveryMethod: deliveryType === "IN_STORE" ? "Személyes átvétel" : "Házhoz szállítás",
    pickupLocation: deliveryType === "IN_STORE" ? "Választott üzlet" : `${city}, ${zip}, ${address}`,
    fullName: `${profile?.firstName || ""} ${profile?.lastName || ""}`,
    phone: profile?.phone,
    country: profile?.country,
    city: profile?.addressCity,
    postalCode: profile?.addressZip,
    address: profile?.addressStreet,
    leasingMonths: payment === "LEASING" ? leasingMonths : null
  };

  const res = await fetch(`${baseUrl}/api/orders/create`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${user?.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(orderData),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("Backend hiba:", res.status, text);
    setStatusMsg("Rendelés létrehozása sikertelen!");
    return null;
  }

  const data = await res.json();
  console.log("createOrder response:", data);
  setOrder(data);
  setStatusMsg("Rendelés sikeresen létrehozva!");
  return data;
}




async function saveInsurance() {
  setStatusMsg("Biztosítás mentése folyamatban...");

  const params = new URLSearchParams();
  if (order?.id) params.append("orderId", order.id);
  if (userId) params.append("userId", userId);
  if (carId) params.append("carId", carId);
  params.append("provider", insuranceProvider);
  params.append("type", insuranceType);
  params.append("durationMonths", insuranceDuration);
  params.append("bonusClass", bonusClass);
  params.append("priceHuf", insurancePrice);

  try {
    const res = await fetch(`${baseUrl}/api/insurance/create`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${user?.token}`,
      },
      body: params,
    });

    if (res.ok) {
      const data = await res.json();
      setStatusMsg(data.message || `Biztosítás elmentve: ${insuranceProvider}`);
      setTimeout(() => setStatusMsg(""), 4000);
    } else if (res.status === 403) {
      setStatusMsg("Jogosultsági hiba — jelentkezz be újra!");
    } else {
      setStatusMsg("Hiba történt a biztosítás mentése során!");
    }
  } catch (err) {
    console.error("Hálózati hiba:", err);
    setStatusMsg("Nem sikerült elérni a szervert!");
  }
}
  async function saveDelivery() {
  if (deliveryType === "IN_STORE" && !selectedStoreId) {
    alert("Kérlek, válassz egy átvételi pontot!");
    return;
  }

  if (deliveryType === "HOME_DELIVERY" && (!address || !city || !zip)) {
    alert("Kérlek, töltsd ki a szállítási címet!");
    return;
  }
  const data = {
    type: deliveryType,
    storeId: selectedStoreId,
    addressLine: address,
    city,
    zip,
    dateTime: new Date().toISOString(),
  };

  setDeliveryData(data);
  setStatusMsg("Szállítási adatok elmentve (helyileg)!");
}



  async function uploadDocument() {
  if (!user || !user.token) {
    alert("Kérlek, jelentkezz be a dokumentum feltöltéséhez!");
    return;
  }

  if (!selectedFile) {
    alert("Kérlek, válassz ki egy fájlt a feltöltéshez!");
    return;
  }

  if (!userId) {
    alert("Nem sikerült azonosítani a felhasználót. Jelentkezz be újra!");
    return;
  }

  setStatusMsg("Dokumentum feltöltése folyamatban...");

  const formData = new FormData();
  formData.append("userId", userId.toString());
  formData.append("type", docType);
  formData.append("file", selectedFile);

  try {
    const res = await fetch(`${baseUrl}/api/documents/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
      body: formData,
    });

    if (!res.ok) throw new Error("Hiba történt a feltöltés során");

    const data = await res.json();
    setStatusMsg("Dokumentum sikeresen feltöltve!");
    setSelectedFile(null);

    const refresh = await fetch(`${baseUrl}/api/documents/get?userId=${userId}`, {
      headers: { Authorization: `Bearer ${user.token}` },
    });
    if (refresh.ok) {
      setUploadedDocs(await refresh.json());
    }
  } catch (err) {
    console.error(err);
    setStatusMsg("Sikertelen feltöltés!");
  }
}




 async function saveTradeIn() {
  if (!user || !user.token) {
    alert("Jelentkezz be a beszámítás használatához!");
    return;
  }

  setStatusMsg("Saját autó beszámítása...");

  try {
    const tradeInJson = JSON.stringify({ ...tradeIn, userId });

    const formData = new FormData();
    formData.append("tradeIn", new Blob([tradeInJson], { type: "application/json" }));

    if (tradeIn.images && tradeIn.images.length > 0) {
      for (let i = 0; i < tradeIn.images.length; i++) {
        formData.append("images", tradeIn.images[i]);
      }
    }

    const res = await fetch(`${baseUrl}/api/tradein/create`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
      body: formData,
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Hiba a válaszban:", res.status, text);
      setStatusMsg("Hiba történt az autó mentése közben!");
      return;
    }

    const data = await res.json();
    const value = data.estValueHuf || 0;
    setTradeInValue(value);
    setStatusMsg(`Beszámítás becsült értéke: ${value.toLocaleString()} Ft`);

    if (useTradeIn) {
      setFinalAmount(Math.max(0, totalPrice - value));
    }

  } catch (err) {
    console.error("Hálózati hiba:", err);
    setStatusMsg("Nem sikerült elérni a szervert!");
  }
}




  async function finalize() {
  if (!deliveryData) {
    alert("Kérlek, előbb mentsd el a szállítási adatokat!");
    return;
  }

  const newOrder = await createOrder();
  if (!newOrder) {
    alert("Rendelés létrehozása sikertelen!");
    return;
  }

  const orderId = newOrder.order?.id || newOrder.id;

  const params = new URLSearchParams();
  params.append("orderId", orderId);
  params.append("type", deliveryData.type);
  if (deliveryData.type === "IN_STORE") {
    params.append("storeId", deliveryData.storeId);
  } else {
    params.append("addressLine", deliveryData.addressLine);
    params.append("city", deliveryData.city);
    params.append("zip", deliveryData.zip);
  }
  params.append("dateTime", deliveryData.dateTime);

  await fetch(`${baseUrl}/api/delivery/create`, {
    method: "POST",
    headers: { Authorization: `Bearer ${user.token}` },
    body: params,
  });

  await saveInsurance();

  navigate(`/order-summary/${orderId}`, {
  state: {
    order: newOrder,
    car: carData,   
    insurance: {
      provider: insuranceProvider,
      type: insuranceType,
      price: insurancePrice,
    },
    delivery: deliveryData,
    total: totalPrice,
  },
});

}

  return (
    <div className="purchase-wrapper">
      <h1 className="page-title">Autóvásárlás és Rendelés</h1>

      {carData && (
        <div className="car-info">
          <img src={carData.image} alt={carData.name} className="car-img" />
          <div>
            <h3 className="car-name">{carData.name}</h3>
            <p className="car-price">{carData.price?.toLocaleString()} Ft</p>
          </div>
        </div>
      )}

      <section className="purchase-card">
        <h2>1. Fizetési mód kiválasztása</h2>
        <p className="section-desc">
          Válaszd ki, hogyan szeretnéd rendezni az autó vételárát.
        </p>

        <div className="payment-options">
          <label className={`payment-option ${payment === "BALANCE" ? "active" : ""}`}>
  <input
    type="radio"
    value="BALANCE"
    checked={payment === "BALANCE"}
    onChange={(e) => setPayment(e.target.value)}
  />
  <div className="payment-content">
    <strong>Fizetés egyenlegből</strong>
    <p>Felhasználja a saját fiókban lévő egyenleget.</p>
    {profile && (
      <p>
        Saját egyenleged: <strong>{profile.balance?.toLocaleString()} Ft</strong>
      </p>
    )}
  </div>
</label>
         <label className={`payment-option ${payment === "CARD" ? "active" : ""}`}>
  <input
    type="radio"
    value="CARD"
    checked={payment === "CARD"}
    onChange={(e) => setPayment(e.target.value)}
  />
  <div className="payment-content">
    <div className="payment-title">
  <strong>Online bankkártyás fizetés</strong>
  <span className="recommended">ajánlott</span>
</div>
    <p>Gyors és biztonságos bankkártyás fizetés (Visa, MasterCard)</p>
 </div>
  </label>
   {payment === "CARD" && (
  <div className="card-info-box">
    {hasSavedCard && !isEditingCard ? (
      <div className="saved-card-box">
        <p>
          Mentett kártyaadatok betöltve: <strong>{cardName}</strong> – {cardNumber}
        </p>
        <button
          onClick={() => setIsEditingCard(true)}
          className="secondary-btn small"
        >
          Módosítás
        </button>
      </div>
    ) : (
      <div className="card-edit-box">
        <h4>Kártyaadatok megadása / módosítása</h4>
        <input
          placeholder="Név a kártyán"
          value={cardName}
          onChange={(e) => setCardName(e.target.value)}
        />
        <input
          placeholder="Kártyaszám (16 számjegy)"
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value)}
        />
        <div className="grid-2">
          <input
            placeholder="Lejárat (MM/ÉÉ)"
            value={cardExpiry}
            onChange={(e) => setCardExpiry(e.target.value)}
          />
          <input
            placeholder="CVV"
            value={cardCvv}
            onChange={(e) => setCardCvv(e.target.value)}
          />
        </div>
        <div className="card-btn-row">
          <button onClick={savePaymentInfo} className="secondary-btn">
            Mentés
          </button>
          {hasSavedCard && (
            <button
              onClick={() => setIsEditingCard(false)}
              className="secondary-btn cancel"
            >
              Mégse
            </button>
          )}
        </div>
      </div>
    )}
  </div>
  
)}
          <label className={`payment-option ${payment === "CASH" ? "active" : ""}`}>
            <input
              type="radio"
              value="CASH"
              checked={payment === "CASH"}
              onChange={(e) => setPayment(e.target.value)}
            />
            <div className="payment-content">
              <strong>Készpénzes fizetés / utánvét</strong>
              <p>Fizetés az autó átvételekor személyesen.</p>
            </div>
          </label>

          <label className={`payment-option ${payment === "LEASING" ? "active" : ""}`}>
            <input
              type="radio"
              value="LEASING"
              checked={payment === "LEASING"}
              onChange={(e) => setPayment(e.target.value)}
            />
            <div className="payment-content">
              <strong>Lízing konstrukció</strong>
              <p>Finanszírozás fix futamidővel.</p>
              </div>
  </label>
             {payment === "LEASING" && (
  <div className="leasing-box">
    <h4>Lízing konstrukció adatai</h4>

    <div className="leasing-field">
      <label>Futamidő (hónapban)</label>
      <input
        type="number"
        min="12"
        step="12"
        value={leasingMonths}
        onChange={(e) => setLeasingMonths(e.target.value)}
        placeholder="pl. 60"
      />
    </div>

    <div className="leasing-field">
      <label>Önerő (%)</label>
      <input
        type="number"
        min="0"
        max="80"
        value={downPayment}
        onChange={(e) => setDownPayment(e.target.value)}
        placeholder="pl. 20"
      />
    </div>

    <div className="leasing-field">
      <label>Kamatláb (%)</label>
      <input
        type="number"
        step="0.1"
        value={interestRate}
        onChange={(e) => setInterestRate(e.target.value)}
        placeholder="pl. 7.5"
      />
    </div>

    <div className="leasing-field">
      <label>Bank kiválasztása</label>
      <select value={bank} onChange={(e) => setBank(e.target.value)}>
        <option>OTP Bank</option>
        <option>Erste Bank</option>
        <option>K&H Bank</option>
        <option>UniCredit Bank</option>
        <option>Raiffeisen Bank</option>
      </select>
    </div>

    <p className="leasing-summary">
      Havi törlesztőrészlet: <strong>{monthlyPayment.toLocaleString()} Ft</strong>
    </p>

    <button onClick={saveLeasingDetails} className="secondary-btn">
      Lízing mentése
    </button>
   </div>
  )}

</div>

            
      </section>

      <section className="purchase-card">
        <h2>2. Biztosítás</h2>
  <p className="section-desc">
    Add meg a biztosítás típusát és adatait. A rendszer automatikusan kiszámolja a várható díjat.
  </p>

  <div className="insurance-box">
    <div className="insurance-field">
      <label>Biztosító</label>
      <select value={insuranceProvider} onChange={(e) => setInsuranceProvider(e.target.value)}>
        <option>Allianz</option>
        <option>Generali</option>
        <option>Groupama</option>
        <option>K&H Biztosító</option>
        <option>Uniqa</option>
      </select>
    </div>

    <div className="insurance-field">
      <label>Biztosítás típusa</label>
      <select value={insuranceType} onChange={(e) => setInsuranceType(e.target.value)}>
        <option value="COMPULSORY">Kötelező gépjármű-felelősségbiztosítás</option>
        <option value="CASCO">Casco biztosítás</option>
      </select>
    </div>

    <div className="grid-2">
      <div className="insurance-field">
        <label>Futamidő (hónap)</label>
        <input
          type="number"
          value={insuranceDuration}
          min="6"
          max="36"
          onChange={(e) => setInsuranceDuration(e.target.value)}
        />
      </div>

      <div className="insurance-field">
        <label>Bónusz fokozat</label>
        <select value={bonusClass} onChange={(e) => setBonusClass(e.target.value)}>
          <option>B10</option>
          <option>B9</option>
          <option>B8</option>
          <option>A0</option>
          <option>M1</option>
        </select>
      </div>
    </div>

    <p className="insurance-price">
      Becsült díj: <strong>{insurancePrice.toLocaleString()} Ft / év</strong>
    </p>

    <button onClick={saveInsurance} className="secondary-btn">
      Biztosítás mentése
    </button>
    {statusMsg && (
  <p
    style={{
      color: statusMsg.startsWith("") ? "green" : "red",
      marginTop: "10px",
      fontWeight: "600",
    }}
  >
    {statusMsg}
  </p>
)}

  </div>
      </section>

      <section className="purchase-card">
       <h2>3. Szállítás</h2>
  <select
    value={deliveryType}
    onChange={(e) => setDeliveryType(e.target.value)}
  >
    <option value="IN_STORE">Személyes átvétel</option>
    <option value="HOME_DELIVERY">Házhoz szállítás</option>
  </select>

  {deliveryType === "IN_STORE" && (
  <div className="store-box">
    <h4>Válassz üzletet:</h4>
    {availableStores.length > 0 ? (
      <select
        value={selectedStoreId || ""}
        onChange={(e) => setSelectedStoreId(e.target.value)}
      >
        <option value="">-- Válassz üzletet --</option>
        {availableStores.map((store) => (
          <option key={store.id} value={store.id}>
            {store.storeName} – {store.city || "Nincs város megadva"} ({store.quantity} db elérhető)
          </option>
        ))}
      </select>
    ) : (
      <p>Nincs elérhető bolt ehhez a modellhez.</p>
    )}
  </div>
)}


  {deliveryType === "HOME_DELIVERY" && (
    <>
      <input placeholder="Cím" value={address} onChange={(e) => setAddress(e.target.value)} />
      <input placeholder="Város" value={city} onChange={(e) => setCity(e.target.value)} />
      <input placeholder="Irányítószám" value={zip} onChange={(e) => setZip(e.target.value)} />
    </>
  )}

  <button onClick={saveDelivery} className="secondary-btn">
    Mentés
  </button>
  {deliveryData && (
    <p style={{ color: "green", marginTop: "10px" }}>
      Szállítási adatok elmentve:
      {deliveryData.type === "IN_STORE"
        ? " Személyes átvétel"
        : ` Házhoz szállítás (${deliveryData.city}, ${deliveryData.zip})`}
    </p>
  )}
      </section>
<section className="purchase-card">
  <h2>4. Személyes adatok</h2>
  <p className="section-desc">
    Kérjük, töltsd ki a személyes adataidat a vásárláshoz. Ezeket automatikusan elmentjük a profilodba is.
  </p>

  {profile ? (
    <div className="personal-form">
      <div className="grid-2">
        <input
          placeholder="Keresztnév"
          value={profile.firstName || ""}
          onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
        />
        <input
          placeholder="Vezetéknév"
          value={profile.lastName || ""}
          onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
        />
        <input
          placeholder="Telefon"
          value={profile.phone || ""}
          onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
        />
        <input
          placeholder="Ország"
          value={profile.country || ""}
          onChange={(e) => setProfile({ ...profile, country: e.target.value })}
        />
        <input
          placeholder="Város"
          value={profile.addressCity || ""}
          onChange={(e) => setProfile({ ...profile, addressCity: e.target.value })}
        />
        <input
          placeholder="Irányítószám"
          value={profile.addressZip || ""}
          onChange={(e) => setProfile({ ...profile, addressZip: e.target.value })}
        />
        <input
          placeholder="Utca, házszám"
          value={profile.addressStreet || ""}
          onChange={(e) => setProfile({ ...profile, addressStreet: e.target.value })}
        />
        <input
          placeholder="Adószám"
          value={profile.taxId || ""}
          onChange={(e) => setProfile({ ...profile, taxId: e.target.value })}
        />
      </div>

      <button onClick={handleSaveProfile} className="secondary-btn">
        Mentés
      </button>

      {saveMsg && (
        <p className={`status ${saveMsg.startsWith("") ? "ok" : "warn"}`}>{saveMsg}</p>
      )}
    </div>
  ) : (
    <p>Adataid betöltése...</p>
  )}
</section>

     <section className="purchase-card">
  <h2>4. Dokumentum feltöltés</h2>

  <select value={docType} onChange={(e) => setDocType(e.target.value)}>
    <option value="ID_CARD">Személyi igazolvány</option>
    <option value="ADDRESS_CARD">Lakcímkártya</option>
    <option value="DRIVER_LICENSE">Jogosítvány</option>
    <option value="INCOME_PROOF">Jövedelemigazolás</option>
  </select>

  <input
    type="file"
    onChange={(e) => setSelectedFile(e.target.files[0])}
  />

  <button onClick={uploadDocument} className="secondary-btn">
    Feltöltés
  </button>

  {uploadedDocs.length > 0 ? (
  <ul style={{ marginTop: "10px", listStyle: "none", padding: 0 }}>
    {uploadedDocs.map((d) => {
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
            <strong>{d.type}</strong> <span style={{ color: "#666" }}>({fileName})</span>
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
          <a href={`${API_BASE_URL}${d.url}`}
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
        </li>
      );
    })}
  </ul>
) : (
  <p>Nincsenek feltöltött dokumentumok.</p>
)}

</section>



    <section className="purchase-card">
  <h2>5. Saját autó beszámítás / értékkalkulátor</h2>
  <p className="section-desc">
    Add meg a beszámítandó autó részletes adatait – a rendszer kiszámolja a becsült értékét.
  </p>

  <div className="grid">
    {[
      ["Márka", "make"],
      ["Típus / Modell", "model"],
      ["Évjárat", "year", "number"],
      ["Futott km", "mileageKm", "number"],
      ["Ülések száma", "seats", "number"],
      ["Motor (cm³)", "engineSize", "number"],
      ["Üzemanyag", "fuelType"],
      ["Teljesítmény (kW)", "powerKw", "number"],
      ["Állapot (1–5)", "condition", "number"],
      ["Csomagtartó (liter)", "trunkLiters", "number"],
      ["Kivitel (pl. Sedan)", "bodyStyle"],
      ["Kárpit színe", "interiorColor"],
      ["Külső szín", "color"],
      ["Teljes tömeg (kg)", "grossWeight", "number"],
      ["Hajtás", "driveType"],
      ["Sebességváltó", "transmission"],
      ["Okmányok", "documents"],
      ["Műszaki érvényessége", "technicalValidity"],
    ].map(([label, name, type = "text"], i) => (
      <div key={i} className="form-group">
        <label>{label}</label>
        <input
          type={type}
          value={tradeIn[name] || ""}
          onChange={(e) => setTradeIn({ ...tradeIn, [name]: e.target.value })}
        />
      </div>
    ))}
  </div>

  <div className="form-group full">
    <label>Részletes leírás</label>
    <textarea
      value={tradeIn.description || ""}
      onChange={(e) => setTradeIn({ ...tradeIn, description: e.target.value })}
      placeholder="Írd ide az autó részletes állapotát, extrákat, megjegyzéseket..."
      rows="5"
    />
  </div>

  <div className="form-group full">
    <label>Képek feltöltése</label>
    <input
      type="file"
      multiple
      accept="image/*"
      onChange={(e) => setTradeIn({ ...tradeIn, images: e.target.files })}
    />
  </div>

  <button onClick={saveTradeIn} className="secondary-btn">
    Autó mentése és kalkulálás
  </button>

  {tradeInValue !== null && (
    <>
      <p className="result-text">Becsült érték: {tradeInValue.toLocaleString()} Ft</p>

      <div className="toggle-row">
  <label className="switch">
    <input
      type="checkbox"
      checked={useTradeIn}
      onChange={(e) => {
        const checked = e.target.checked;
        setUseTradeIn(checked);
        setFinalAmount(
          checked
            ? Math.max(0, totalPrice - (tradeInValue || 0))
            : totalPrice
        );
      }}
    />
    <span className="slider"></span>
  </label>
  <span className="switch-label">
    Saját autó értékének beszámítása a fizetendő összegbe
  </span>
</div>


      {useTradeIn && (
        <p className="trade-summary">
          {tradeInValue > totalPrice ? (
            <span>
              Többlet beszámítás — visszajár:{" "}
              <strong>{(tradeInValue - totalPrice).toLocaleString()} Ft</strong>
            </span>
          ) : (
            <span>
              Beszámítás után fizetendő:{" "}
              <strong>{(totalPrice - tradeInValue).toLocaleString()} Ft</strong>
            </span>
          )}
        </p>
      )}
    </>
  )}
</section>



      <div className="summary-box">
  <div className="summary-info">
    <span>Végösszeg:</span>
    <strong>{finalAmount.toLocaleString("hu-HU")} Ft</strong>
  </div>

  {payment === "BALANCE" && profile?.balance && (
    <p style={{ fontSize: "0.9rem", color: "#555", marginTop: "4px" }}>
      {profile.balance >= totalPrice
        ? `Egyenleged elegendő, marad: ${(profile.balance - totalPrice).toLocaleString("hu-HU")} Ft`
        : `Egyenleg levonva: ${profile.balance.toLocaleString("hu-HU")} Ft`}
    </p>
  )}

 <button className="order-btn" onClick={finalize}>Megrendelem</button>

</div>


{statusMsg && (
  <p
    className={`status ${
      statusMsg.startsWith("") ? "success" :
      statusMsg.startsWith("") || statusMsg.startsWith("") || statusMsg.startsWith("") ? "error" : ""
    }`}
  >
    {statusMsg}
  </p>
)}

      <style>{`
  .purchase-wrapper {
    max-width: 900px;
    margin: 50px auto;
    background: #fff;
    padding: 40px;
    border-radius: 16px;
    box-shadow: 0 2px 20px rgba(0,0,0,0.1);
  }
.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px 30px;
}
.form-group.full {
  grid-column: 1 / 3;
}
@media (max-width: 700px) {
  .grid {
    grid-template-columns: 1fr;
  }
}

  .page-title {
    text-align: center;
    font-size: 2rem;
    font-weight: 700;
    color: #111;
    margin-bottom: 40px;
  }

  .car-info {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-bottom: 25px;
    border-bottom: 1px solid #eee;
    padding-bottom: 20px;
  }

  .car-img {
    width: 160px;
    border-radius: 10px;
  }

  .car-name {
    font-size: 1.3rem;
    font-weight: 600;
  }

  .car-price {
    font-size: 1.1rem;
    color: #2563eb;
    font-weight: 600;
  }

  .purchase-card {
    background: #fafafa;
    padding: 25px;
    margin-bottom: 30px;
    border-radius: 12px;
    border: 1px solid #e5e7eb;
  }

  .payment-options {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .payment-option {
    display: grid;
    grid-template-columns: 22px 1fr; 
    align-items: start;
    gap: 12px;
    padding: 14px 16px;
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 10px;
    cursor: pointer;
    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
  }

  .payment-option input[type="radio"] {
    width: 18px;
    height: 18px;
    margin: 0;
    align-self: start;
    justify-self: start;
    accent-color: #2563eb;
  }

  .payment-option.active {
    border-color: #2563eb;
    background: #f0f6ff;
    box-shadow: 0 0 0 2px rgba(37,99,235,0.1);
  }

  .payment-content {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .payment-content p {
    font-size: 0.9rem;
    color: #555;
    margin: 0;
  }

  .recommended {
    display: inline-block;
  background: #16a34a;
  color: white;
  padding: 2px 6px;
  border-radius: 6px;
  font-size: 0.75rem;
  margin-left: 2px;
  font-weight: 500;
  line-height: 1.2;
    
  }


  .primary-btn {
    margin-top: 20px;
    background: #2563eb;
    color: #fff;
    padding: 12px;
    border-radius: 8px;
    width: 100%;
    font-weight: 600;
    border: none;
    cursor: pointer;
  }

  .secondary-btn {
    margin-top: 15px;
    background: #e5e7eb;
    color: #111;
    padding: 10px 16px;
    border-radius: 8px;
    font-weight: 500;
    border: none;
    cursor: pointer;
  }

  .secondary-btn:hover {
    background: #d1d5db;
  }

  .card-info-box,
  .leasing-box {
    margin-top: 12px;
    background: #f9fafb;
    padding: 14px;
    border-radius: 10px;
    border: 1px solid #ddd;
  }

  .leasing-summary {
    margin-top: 8px;
    font-weight: 600;
    color: #2563eb;
  }

  .grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }

  .checkbox-row {
    display: flex;
    gap: 20px;
    margin-top: 10px;
  }

  .summary-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #f9fafb;
    padding: 20px 25px;
    border-radius: 12px;
    border: 1px solid #e5e7eb;
    margin-top: 30px;
  }

  .summary-info strong {
    color: #2563eb;
    font-size: 1.3rem;
  }

  .order-btn {
    background: linear-gradient(90deg, #1e90ff, #0066ff);
    color: white;
    font-size: 1.1rem;
    padding: 12px 24px;
    border-radius: 10px;
    font-weight: 600;
    border: none;
    cursor: pointer;
  }

  .order-btn:hover {
    background: linear-gradient(90deg, #0070e0, #004bb5);
  }

  .status {
    text-align: center;
    color: #555;
    margin-top: 25px;
    font-style: italic;
  }
    .status.success {
  color: #16a34a; 
  font-weight: 600;
}

.status.error {
  color: #dc2626; 
  font-weight: 600;
}



  input,
  select {
    width: 100%;
    padding: 10px;
    border-radius: 8px;
    border: 1px solid #ccc;
    margin-top: 10px;
    font-size: 0.95rem;
  }

  input:focus,
  select:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.15);
  }
    .leasing-box {
  margin-top: 15px;
  background: #f9fafb;
  padding: 18px;
  border-radius: 10px;
  border: 1px solid #ddd;
}

.leasing-field {
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
}

.leasing-field label {
  font-weight: 600;
  color: #333;
  font-size: 0.9rem;
  margin-bottom: 4px;
}

.leasing-summary {
  margin-top: 10px;
  font-weight: 600;
  color: #2563eb;
  font-size: 1rem;
}
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}
  .payment-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}
.insurance-box {
  margin-top: 15px;
  background: #f9fafb;
  padding: 18px;
  border-radius: 10px;
  border: 1px solid #ddd;
}

.insurance-field {
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
}

.insurance-field label {
  font-weight: 600;
  color: #333;
  font-size: 0.9rem;
  margin-bottom: 4px;
}

.insurance-price {
  margin-top: 10px;
  font-weight: 600;
  color: #2563eb;
  font-size: 1rem;
}
.store-box {
  background: #f9fafb;
  padding: 15px;
  border-radius: 10px;
  border: 1px solid #ddd;
  margin-top: 10px;
}

.store-box h4 {
  margin-bottom: 8px;
  font-weight: 600;
  font-size: 1rem;
  color: #333;
}
.user-info-box {
  margin-top: 20px;
  background: #f3f4f6;
  padding: 14px;
  border-radius: 10px;
  border: 1px solid #d1d5db;
  font-size: 0.95rem;
  color: #111;
}
.user-info-box h4 {
  margin-bottom: 10px;
  font-weight: 700;
  color: #1f2937;
}
.user-info-box p {
  margin: 4px 0;
}
.personal-form {
  margin-top: 15px;
  background: #f9fafb;
  padding: 18px;
  border-radius: 10px;
  border: 1px solid #ddd;
}
.personal-form input {
  margin-bottom: 10px;
}
.status.ok {
  color: #16a34a;
  font-weight: 600;
  margin-top: 10px;
}
.status.warn {
  color: #dc2626;
  font-weight: 600;
  margin-top: 10px;
}
.toggle-row {
  margin-top: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.toggle-row label {
  font-weight: 600;
  color: #333;
  font-size: 0.95rem;
}

.trade-summary {
  margin-top: 10px;
  font-weight: 600;
  color: #2563eb;
}
.section-desc {
  color: #555;
  margin-bottom: 15px;
}

.result-text {
  margin-top: 10px;
  font-weight: 600;
  color: #2563eb;
}

.toggle-row {
  margin-top: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.trade-summary {
  margin-top: 10px;
  font-weight: 600;
  color: #1d4ed8;
}
.switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 28px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.3s;
  border-radius: 34px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 20px;
  width: 20px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: 0.3s;
  border-radius: 50%;
}

.switch input:checked + .slider {
  background-color: #2563eb;
}

.switch input:checked + .slider:before {
  transform: translateX(22px);
}

.switch-label {
  font-weight: 600;
  color: #333;
  margin-left: 12px;
}
.saved-card-box {
  background: #f3f4f6;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #ddd;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-btn-row {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.secondary-btn.small {
  padding: 6px 10px;
  font-size: 0.85rem;
}

.secondary-btn.cancel {
  background: #fee2e2;
  color: #b91c1c;
}

`}</style>
    </div>
  );
}

