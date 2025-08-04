import { useEffect, useState } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";

export function ExportPanel({ trades, onClose }) {
  const [hover, setHover] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const originalOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = originalOverflow;
    };
  }, []);

  const handleExportData = async () => {
    if (!trades || trades.length === 0) {
      setError("Keine Trades verfügbar zum Exportieren.");
      return;
    }

    try {
      const zip = new JSZip();
      const tradesJson = JSON.stringify(trades, null, 2);
      zip.file("trades.json", tradesJson);

      const blob = await zip.generateAsync({ type: "blob" });
      saveAs(blob, "ProfitCraft-TradeExport.zip");

      onClose(); // Nach Export schließen
    } catch (e) {
      console.error("Fehler beim Export:", e);
      setError("Export fehlgeschlagen.");
    }
  };

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
      aria-labelledby="exportDataTitle"
      aria-describedby="exportDataDesc"
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
        <h2 id="exportDataTitle" style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "16px" }}>
          Daten exportieren
        </h2>
        <p id="exportDataDesc" style={{ marginBottom: "12px", fontSize: "14px", color: "#cccccc" }}>
          Deine Trades werden in eine ZIP-Datei mit JSON exportiert.
        </p>
        <p style={{ marginBottom: "12px", fontSize: "14px", color: "#999" }}>
          <strong>Dateiname:</strong> ProfitCraft-TradeExport.zip
        </p>
        {error && (
          <p style={{ color: "#ff6b6b", fontSize: "14px", marginBottom: "10px" }}>
            {error}
          </p>
        )}
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <button
            onClick={onClose}
            style={{
              width: "49%",
              marginRight: "0.3rem",
              backgroundColor: "#2f3b3e",
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
            onClick={handleExportData}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            style={{
              width: "49%",
              backgroundColor: hover ? "#c9a449" : "#dbaf58",
              color: "black",
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
            Exportieren
          </button>
        </div>
      </div>
    </div>
  );
}
