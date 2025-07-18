import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const product = useQuery(api.products.getById, id ? { id } : "skip");

  const containerStyle = {
    backgroundColor: "#0b1825",
    color: "#ffffff",
    padding: "32px",
    borderRadius: "20px",
    maxWidth: "900px",
    margin: "40px auto",
    boxShadow: "0 0 20px rgba(0, 0, 0, 0.3)",
    fontFamily: "sans-serif",
  };

  const titleStyle = {
    color: "#dbaf58",
    fontSize: "32px",
    marginBottom: "12px",
  };

  const descriptionStyle = {
    fontSize: "16px",
    color: "#e1e1e1",
    marginBottom: "24px",
  };

  const infoStyle = {
    display: "flex",
    gap: "20px",
    flexWrap: "wrap",
    backgroundColor: "#162428",
    padding: "20px",
    borderRadius: "16px",
    marginBottom: "24px",
  };

  const imgStyle = {
    width: "260px",
    borderRadius: "10px",
    objectFit: "cover",
    backgroundColor: "#111",
  };

  const metaStyle = {
    color: "#e1e1e1",
    fontSize: "15px",
    flex: "1",
  };

  const sectionTitleStyle = {
    color: "#dbaf58",
    fontSize: "22px",
    marginTop: "24px",
    marginBottom: "10px",
  };

  const listStyle = {
    backgroundColor: "#162428",
    padding: "16px",
    borderRadius: "10px",
    listStyle: "disc",
    paddingLeft: "32px",
    color: "#e1e1e1",
  };

  const guideStyle = {
    backgroundColor: "#162428",
    padding: "20px",
    borderRadius: "12px",
    color: "#e1e1e1",
    lineHeight: 1.6,
  };

  const downloadLinkStyle = {
    backgroundColor: "#dbaf58",
    color: "#0b1825",
    padding: "10px 20px",
    borderRadius: "8px",
    textDecoration: "none",
    display: "inline-block",
    marginTop: "12px",
    fontWeight: "bold",
  };

  const backButtonStyle = {
    backgroundColor: "#dbaf58",
    color: "#0b1825",
    padding: "10px 18px",
    borderRadius: "8px",
    border: "none",
    fontSize: "14px",
    fontWeight: "bold",
    cursor: "pointer",
    marginBottom: "24px",
  };

  if (!product) {
    return (
      <div style={containerStyle}>
        <p>Produkt wird geladen oder existiert nicht.</p>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <button style={backButtonStyle} onClick={() => navigate(-1)}>
        ← Zurück
      </button>

      <h1 style={titleStyle}>{product.title}</h1>
      <p style={descriptionStyle}>{product.description}</p>

      <div style={infoStyle}>
        <img src={product.img} alt={product.title} style={imgStyle} />
        <div style={metaStyle}>
          <p><strong>Preis:</strong> {product.price} {product.currency}</p>
          {product.taxIncluded && <p>(inkl. Steuern)</p>}
          <p><strong>Bezahlmethoden:</strong> {product.paymentMethods?.join(", ")}</p>
        </div>
      </div>

      {product.benefits?.length > 0 && (
        <div>
          <h2 style={sectionTitleStyle}>Was ist enthalten?</h2>
          <ul style={listStyle}>
            {product.benefits.map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>
        </div>
      )}

      {product.guide && (
        <div>
          <h2 style={sectionTitleStyle}>Strategie-Guide</h2>
          <div
            style={guideStyle}
            dangerouslySetInnerHTML={{ __html: product.guide }}
          />
        </div>
      )}

      {product.template && (
        <div>
          <h2 style={sectionTitleStyle}>Checkliste / Vorlage</h2>
          <a href={product.template} style={downloadLinkStyle} download>
            Jetzt herunterladen
          </a>
        </div>
      )}
    </div>
  );
}
