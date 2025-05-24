import React from "react";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div style={styles.container}>
      <h1>404 - Az oldal nem található</h1>
      <p>A keresett oldal nem létezik vagy elérhetetlen.</p>
      <Link to="/" style={styles.link}>Vissza a főoldalra</Link>
    </div>
  );
}

const styles = {
  container: { textAlign: "center", padding: "50px" },
  link: { textDecoration: "none", color: "#007bff", fontSize: "18px" }
};

export default NotFound;
