import React from "react";

function Contact() {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Kapcsolat</h1>
      <p style={styles.subtitle}>Vedd fel velünk a kapcsolatot!</p>

      <div style={styles.card}>
        <h2>Elérhetőségeink</h2>
        <p><strong>Email:</strong> info@carguru.hu</p>
        <p><strong>Telefon:</strong> +36 30 123 4567</p>
        <p><strong>Cím:</strong> Budapest, 10. kerület, Autó utca 12.</p>
        <p><strong>Ügyfélszolgálat:</strong> H–P: 9:00 – 17:00</p>
      </div>

      <form style={styles.form}>
        <h2>Írj nekünk üzenetet</h2>

        <input type="text" placeholder="Név" style={styles.input} />
        <input type="email" placeholder="Email" style={styles.input} />
        <textarea placeholder="Üzenet" rows="5" style={styles.textarea} />

        <button type="submit" style={styles.button}>Küldés</button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "900px",
    margin: "50px auto",
    padding: "20px",
    fontFamily: "Arial",
  },
  title: {
    textAlign: "center",
    fontSize: "32px",
    fontWeight: "700",
  },
  subtitle: {
    textAlign: "center",
    marginBottom: "30px",
    color: "#555",
  },
  card: {
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
    marginBottom: "40px",
  },
  form: {
    background: "#fff",
    padding: "25px",
    borderRadius: "10px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  input: {
    padding: "12px",
    fontSize: "16px",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },
  textarea: {
    padding: "12px",
    fontSize: "16px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    resize: "vertical",
  },
  button: {
    padding: "12px",
    backgroundColor: "#007bff",
    color: "#fff",
    fontSize: "16px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
};

export default Contact;
