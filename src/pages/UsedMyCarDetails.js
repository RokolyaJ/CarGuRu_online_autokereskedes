import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import { TouchSensor } from "@dnd-kit/core";

import { API_BASE_URL } from "../apiConfig";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

const api = axios.create({
  baseURL: API_BASE_URL,
});

export default function UsedMyCarDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [car, setCar] = useState(null);
  const [activeImg, setActiveImg] = useState(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const [images, setImages] = useState([]);

  const buildUrl = (img) => {
  if (!img) return "/placeholder.png";
  if (img.url?.startsWith("http")) return img.url;
  if (img.image?.startsWith("http")) return img.image;
  const BASE = window.location.origin.includes("localhost")
    ? "http://localhost:8080"
    : "https://carguru-online-autokereskedes.onrender.com";

  return `${BASE}${img.url || img.image}`;
};



  const saveOrder = async (newOrder) => {
    try {
      const ids = newOrder.map((img) => img.id);
      await api.put(`/api/images/reorder/${id}`, { images: ids });
    } catch (err) {
      console.error("Hiba sorrend mentése közben", err);
    }
  };

  useEffect(() => {
    api
      .get(`/api/usedcars/${id}`)
      .then(({ data }) => setCar(data))
      .catch(() => setErr("Hiba történt."));
    api
      .get(`/api/images/${id}`)
      .then(({ data }) => {
        setImages(data);
        if (data.length > 0) setActiveImg(data[0]);
        setLoading(false);
      })
      .catch(() => {
        setErr("Hiba történt képek betöltésénél.");
        setLoading(false);
      });
  }, [id]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } })
  );

  const title = useMemo(() => {
    if (!car) return "";
    return `${car.brand || ""} ${car.model || ""}`.trim();
  }, [car]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCar((c) => ({ ...c, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleUploadImages = async () => {
    if (!files.length) return alert("Nincs kiválasztott fájl!");

    const formData = new FormData();
    files.forEach((f) => formData.append("files", f));

    try {
      await api.post(`/api/images/upload/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Képek feltöltve!");
      window.location.reload();
    } catch (err) {
      alert("Hiba a képfeltöltés során!");
      console.error(err);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Nem vagy bejelentkezve!");
      setSaving(false);
      return;
    }

    try {
      await api.put(`/api/usedcars/${id}`, car, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      alert("Autó adatai frissítve!");
      navigate("/mycars");
    } catch (e) {
      alert("Hiba mentés közben!");
    } finally {
      setSaving(false);
    }
  };
  if (loading || !car)
    return (
      <div>
        <Navbar />
        <div style={sx.page}>
          <h2>Betöltés...</h2>
        </div>
      </div>
    );

  if (err)
    return (
      <div>
        <Navbar />
        <div style={sx.page}>
          <h2 style={{ color: "#B42318" }}>{err}</h2>
        </div>
      </div>
    );

  return (
    <div>
      <Navbar />

      <div style={sx.page}>
        <button style={btn.ghost} onClick={() => navigate(-1)}>
          ← Vissza
        </button>

        <h1 style={sx.title}>{title}</h1>

        <section style={sx.galleryWrap}>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={({ active, over }) => {
              if (!over) return;

              setImages((prev) => {
                const oldIndex = prev.findIndex((i) => i.id === active.id);
                const newIndex = prev.findIndex((i) => i.id === over.id);

                const newOrder = arrayMove(prev, oldIndex, newIndex);
                saveOrder(newOrder);
                return newOrder;
              });
            }}
          >
            <SortableContext
              items={images.map((img) => img.id)}
              strategy={verticalListSortingStrategy}
            >
              <div
                style={{
                  maxHeight: "600px",
                  overflowY: "auto",
                  paddingRight: 6,
                  touchAction: "none",
                }}
              >
                <div style={sx.thumbs}>
                  {images.map((img) => (
                    <SortableThumb
                      key={img.id}
                      img={img}
                      activeImg={activeImg}
                      setActiveImg={setActiveImg}
                      buildUrl={buildUrl}
                    />
                  ))}
                </div>
              </div>
            </SortableContext>
          </DndContext>

          <div style={sx.mainImgWrap}>
            <img src={buildUrl(activeImg)} alt="Aktív kép" style={sx.mainImg} />
          </div>
        </section>

        <div style={{ marginTop: 20 }}>
          <input type="file" multiple onChange={handleFileChange} />
          <button style={btn.primary} onClick={handleUploadImages}>
            Képek feltöltése
          </button>
        </div>

        <section style={sx.block}>
          <h2 style={sx.blockTitle}>Alapadatok szerkesztése</h2>

          <div style={form.grid}>
            {[
              "brand",
              "model",
              "year",
              "price",
              "mileage",
              "fuel",
              "engineSize",
              "transmission",
              "bodyType",
              "condition",
              "doors",
              "seats",
              "trunkCapacity",
              "drivetrain",
              "engineLayout",
              "klimaType",
              "docs",
              "tireSize",
              "location",
              "dealer",
            ].map((field) => (
              <Input
                key={field}
                label={field}
                name={field}
                value={car[field]}
                onChange={handleChange}
              />
            ))}
          </div>

          <div style={{ marginTop: 20 }}>
            <label>Leírás</label>
            <textarea
              name="description"
              value={car.description || ""}
              onChange={handleChange}
              rows={5}
              style={form.textarea}
            />
          </div>

          <button style={btn.save} onClick={handleSave} disabled={saving}>
            {saving ? "Mentés..." : "Változások mentése"}
          </button>
        </section>
      </div>
    </div>
  );
}
function Input({ label, name, value, onChange }) {
  return (
    <div style={form.field}>
      <label style={form.label}>{label}</label>
      <input style={form.input} name={name} value={value ?? ""} onChange={onChange} />
    </div>
  );
}
function SortableThumb({ img, activeImg, setActiveImg, buildUrl }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: img.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    outline: img.id === activeImg?.id ? "2px solid #ef530f" : "1px solid #eee",
    width: "100%",
    height: 100,
    borderRadius: 10,
    overflow: "hidden",
    cursor: "grab",
    background: "#fff",
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      onClick={() => setActiveImg(img)}
      style={style}
    >
      <img
  src={buildUrl(img)}
  style={{ width: "100%", height: "100%", objectFit: "cover" }}
/>

    </div>
  );
}
const sx = {
  page: {
    maxWidth: 1000,
    margin: "0 auto",
    padding: "90px 20px",
    fontFamily: "Inter, Arial, sans-serif",
  },
  title: { fontSize: 28, fontWeight: 800, margin: "10px 0" },
  galleryWrap: {
    display: "grid",
    gridTemplateColumns: "148px 1fr",
    gap: 16,
    marginTop: 20,
  },
  thumbs: {
    display: "grid",
    gap: 10,
  },
  mainImgWrap: {
    width: "100%",
    aspectRatio: "16/9",
    borderRadius: 12,
    overflow: "hidden",
    border: "1px solid #EEF0F2",
  },
  mainImg: { width: "100%", height: "100%", objectFit: "cover" },
  block: { marginTop: 32 },
  blockTitle: { fontSize: 20, fontWeight: 800, marginBottom: 16 },
};

const form = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: 12,
  },
  field: { display: "flex", flexDirection: "column", gap: 4 },
  label: { fontWeight: 600, color: "#555" },
  input: {
    border: "1px solid #DDD",
    borderRadius: 8,
    padding: "8px 10px",
    fontSize: 14,
  },
  textarea: {
    width: "100%",
    border: "1px solid #DDD",
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    resize: "vertical",
  },
};

const btn = {
  ghost: {
    background: "#fff",
    color: "#344054",
    border: "1px solid #D0D5DD",
    borderRadius: 10,
    padding: "9px 14px",
    cursor: "pointer",
    fontWeight: 600,
  },
  primary: {
    background: "#ef530f",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "9px 14px",
    marginLeft: 10,
    cursor: "pointer",
    fontWeight: 600,
  },
  save: {
    marginTop: 20,
    background: "#16A34A",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    padding: "12px 20px",
    fontWeight: 700,
    cursor: "pointer",
  },
};
