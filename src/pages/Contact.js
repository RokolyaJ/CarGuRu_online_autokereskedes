import React from "react";
import { FiPhone, FiMail, FiMapPin, FiClock } from "react-icons/fi";

export default function Contact() {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Kapcsolat</h1>
      <p style={styles.subtitle}>Vedd fel velünk a kapcsolatot bármikor!</p>

      <div style={styles.cardWrapper}>

        <div style={styles.card}>
          <FiPhone size={40} style={styles.icon} />
          <h2 style={styles.cardTitle}>Telefon</h2>
          <p style={styles.cardText}>+36 30 123 4567</p>
        </div>

        <div style={styles.card}>
          <FiMail size={40} style={styles.icon} />
          <h2 style={styles.cardTitle}>Email</h2>
          <p style={styles.cardText}>carguruinformation@gmail.com</p>
        </div>

        <div style={styles.card}>
          <FiMapPin size={40} style={styles.icon} />
          <h2 style={styles.cardTitle}>Cím</h2>
          <p style={styles.cardText}>Szeged, Francia utca 18.</p>
        </div>

        <div style={styles.card}>
          <FiClock size={40} style={styles.icon} />
          <h2 style={styles.cardTitle}>Nyitvatartás</h2>
          <p style={styles.cardText}>H–P: 08:00 – 18:00</p>
        </div>

      </div>

      <div style={styles.mapContainer}>
  <iframe
    title="map"
    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2758.36406694565!2d20.13645565064414!3d46.26286867797466!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x474487e16560adb5%3A0x7db928adf48efbe7!2sSzeged%2C%20Francia%20u.%2018%2C%206724!5e0!3m2!1shu!2hu!4v1764024934812!5m2!1shu!2hu"
    width="100%"
    height="100%"
    style={{ border: 0, borderRadius: "14px" }}
    allowFullScreen=""
    loading="lazy"
    referrerPolicy="no-referrer-when-downgrade"
  ></iframe>
</div>

    </div>
  );
}

const styles = {
  container: {
    paddingTop: "120px",
    paddingBottom: "80px",
    maxWidth: "1200px",
    margin: "0 auto"
  },
  title: {
    fontSize: "3rem",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: "10px"
  },
  subtitle: {
    textAlign: "center",
    fontSize: "1.2rem",
    color: "#555",
    marginBottom: "40px"
  },
  cardWrapper: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "30px",
    marginBottom: "60px"
  },
  card: {
    background: "#fff",
    padding: "30px",
    borderRadius: "14px",
    textAlign: "center",
    boxShadow: "0 6px 16px rgba(0,0,0,0.15)",
    transition: ".3s"
  },
  icon: {
    marginBottom: "14px",
    color: "#1e90ff"
  },
  cardTitle: {
    fontSize: "1.6rem",
    marginBottom: "10px"
  },
  cardText: {
    fontSize: "1.1rem",
    color: "#444"
  },
  mapContainer: {
    width: "100%",
    height: "400px",
    borderRadius: "14px",
    overflow: "hidden"
  }
};
