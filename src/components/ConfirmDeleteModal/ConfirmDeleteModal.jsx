import React, { useState } from "react";

export function ConfirmDeleteModal({ trade, onCancel, onConfirm }) {
  const [hoverConfirm, setHoverConfirm] = useState(false);
  const [hoverCancel, setHoverCancel] = useState(false);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirmDeleteTitle"
      aria-describedby="confirmDeleteDesc"
    >
      <div
        style={{
          backgroundColor: "#162428",
          padding: "24px",
          borderRadius: "16px",
          width: "90%",
          maxWidth: "400px",
          color: "white",
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          border: "1px solid #dbaf58",
        }}
      >
        <h3
          id="confirmDeleteTitle"
          style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "16px" }}
        >
          Löschen bestätigen
        </h3>
        <p
          id="confirmDeleteDesc"
          style={{ marginBottom: "12px", fontSize: "14px", color: "#cccccc" }}
        >
          Willst du den Eintrag <strong>{trade.name}</strong> wirklich löschen?
        </p>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "0.3rem",
            marginTop: "16px",
          }}
        >
          <button
            onClick={onCancel}
            onMouseEnter={() => setHoverCancel(true)}
            onMouseLeave={() => setHoverCancel(false)}
            style={{
              width: "49%",
              backgroundColor: hoverCancel ? "#3a4649" : "#2f3b3e",
              color: "#dddddd",
              padding: "10px",
              borderRadius: "6px",
              fontWeight: "500",
              fontSize: "16px",
              cursor: "pointer",
              border: "1px solid #555",
              transition: "background-color 0.2s ease, color 0.2s ease",
            }}
            type="button"
          >
            Abbrechen
          </button>
          <button
            onClick={onConfirm}
            onMouseEnter={() => setHoverConfirm(true)}
            onMouseLeave={() => setHoverConfirm(false)}
            style={{
              width: "49%",
              backgroundColor: hoverConfirm ? "#e05d5dff" : "#ff6b6b",
              color: "white",
              padding: "10px",
              borderRadius: "6px",
              fontWeight: "600",
              fontSize: "16px",
              cursor: "pointer",
              border: "none",
              transition: "background-color 0.3s ease",
            }}
            type="button"
          >
            Ja, löschen
          </button>
        </div>
      </div>
    </div>
  );
}