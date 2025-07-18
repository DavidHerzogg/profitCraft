import React, { useEffect } from "react";
import { FaFileAlt, FaFolder } from "react-icons/fa";

export default function ImportPanel({
  importFile,
  setImportFile,
  importMode,
  setImportMode,
  handleImportData,
  importing,
  onClose,
}) {
  useEffect(() => {
    const originalOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = originalOverflow;
    };
  }, []);

  return (
    <div style={overlayStyle}>
      <div style={panelStyle}>
        <button onClick={onClose} style={closeButtonStyle} aria-label="Schließen">
          ×
        </button>

        <h3 style={{ marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
          <FaFolder /> Trades importieren
        </h3>

        <label
          htmlFor="fileInput"
          style={fileInputLabelStyle}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              document.getElementById("fileInput").click();
            }
          }}
        >
          <FaFileAlt size={20} style={{ marginRight: 8 }} />
          {importFile ? importFile.name : "Datei auswählen (.json)"}
        </label>
        <input
          id="fileInput"
          type="file"
          accept=".json"
          onChange={(e) => setImportFile(e.target.files?.[0])}
          disabled={importing}
          style={{ display: "none" }}
        />

        <div style={{ marginTop: 20, marginBottom: 24 }}>
          <label style={labelStyle}>
            <input
              type="radio"
              name="importMode"
              value="append"
              checked={importMode === "append"}
              onChange={() => setImportMode("append")}
              disabled={importing}
            />
            Neue Trades anhängen
          </label>

          <label style={labelStyle}>
            <input
              type="radio"
              name="importMode"
              value="replace"
              checked={importMode === "replace"}
              onChange={() => setImportMode("replace")}
              disabled={importing}
            />
            Alle bisherigen Trades ersetzen
          </label>
        </div>

        <button
          onClick={handleImportData}
          disabled={importing || !importFile}
          style={buttonStyle}
        >
          {importing ? "Importiere..." : "Import starten"}
        </button>
      </div>
    </div>
  );
}

const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  backgroundColor: "rgba(0,0,0,0.75)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 9999,
};

const panelStyle = {
  position: "relative",
  backgroundColor: "#222831",
  padding: 28,
  borderRadius: 12,
  width: 380,
  boxShadow: "0 0 25px rgba(219, 175, 88, 0.9)",
  color: "#eeeeee",
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
};

const closeButtonStyle = {
  position: "absolute",
  top: 12,
  right: 12,
  background: "transparent",
  border: "none",
  color: "#dbaf58",
  fontSize: 28,
  cursor: "pointer",
  lineHeight: 1,
  fontWeight: "bold",
};

const fileInputLabelStyle = {
  display: "flex",
  alignItems: "center",
  padding: "10px 14px",
  backgroundColor: "#393e46",
  borderRadius: 8,
  cursor: "pointer",
  userSelect: "none",
  color: "#dbaf58",
  fontWeight: "600",
  fontSize: 15,
  border: "2px dashed #dbaf58",
  transition: "background-color 0.2s",
};

const labelStyle = {
  cursor: "pointer",
  userSelect: "none",
  fontSize: 15,
  color: "#cccccc",
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
};

const buttonStyle = {
  padding: "12px 0",
  borderRadius: 8,
  backgroundColor: "#dbaf58",
  border: "none",
  color: "#0b1825",
  fontWeight: "700",
  fontSize: 16,
  cursor: "pointer",
  width: "100%",
  boxShadow: "0 4px 10px rgba(219, 175, 88, 0.7)",
  transition: "background-color 0.3s ease",
};

