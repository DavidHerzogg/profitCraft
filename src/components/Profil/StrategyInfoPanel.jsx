import React, { useEffect } from "react";

export default function StrategyInfoPanel({ strategyData, onClose }) {
  useEffect(() => {
    const originalOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = originalOverflow;
    };
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      role="dialog"
      aria-modal="true"
    >
      <div
        style={{
          backgroundColor: "#162428",
          padding: "24px",
          borderRadius: "16px",
          width: "90%",
          maxWidth: "600px",
          color: "white",
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          border: "1px solid #dbaf58",
          position: "relative",
        }}
      >
        <button
          onClick={onClose}
          aria-label="Schließen"
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            background: "transparent",
            border: "none",
            color: "#cccccc",
            fontSize: "24px",
            cursor: "pointer",
          }}
        >
          &times;
        </button>

        <h2 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "16px" }}>
          Strategieauswertung
        </h2>

        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "14px",
              color: "#ddd",
            }}
          >
            <thead>
              <tr>
                <th style={thStyle}>Strategie</th>
                <th style={thStyle}>Anzahl</th>
                <th style={thStyle}>Gewonnen</th>
                <th style={thStyle}>Winrate (%)</th>
              </tr>
            </thead>
            <tbody>
              {strategyData.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ padding: "1rem", textAlign: "center", color: "#aaa" }}>
                    Keine Daten verfügbar
                  </td>
                </tr>
              ) : (
                strategyData.map(({ strategy, count, wins, winrate }) => (
                  <tr key={strategy}>
                    <td style={tdStyle}>{strategy}</td>
                    <td style={tdStyle}>{count}</td>
                    <td style={tdStyle}>{wins}</td>
                    <td style={tdStyle}>{winrate}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const thStyle = {
  borderBottom: "1px solid #555",
  padding: "8px",
  textAlign: "left",
  color: "#dbaf58",
};

const tdStyle = {
  borderBottom: "1px solid #444",
  padding: "8px",
};
