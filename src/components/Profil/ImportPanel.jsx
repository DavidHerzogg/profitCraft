import React, { useEffect, useState } from "react";
import { FaFileAlt, FaFolder } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useMutation } from "convex/react";
import { useUser } from "@clerk/clerk-react";

export default function ImportPanel({
  importFile,
  setImportFile,
  importMode,
  setImportMode,
  importing,
  setImporting,
  onClose,
}) {
  const [error, setError] = useState("");
  const [hover, setHover] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const navigate = useNavigate();
  const { user } = useUser();
  const userId = user?.id;

  const importTrades = useMutation("trades:importTrades");

  useEffect(() => {
    const originalOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = originalOverflow;
    };
  }, []);

  const handleImport = async () => {
    if (!importFile) return;
    setImporting(true);

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const importedTrades = JSON.parse(e.target.result);
        await importTrades({ userId, trades: importedTrades, mode: importMode });
        setShowSuccessModal(true);
        setImportFile(null);
      } catch (err) {
        console.error(err);
        setError("Ungültige Datei oder Serverfehler.");
      } finally {
        setImporting(false);
      }
    };
    reader.onerror = () => {
      setError("Fehler beim Lesen der Datei.");
      setImporting(false);
    };
    reader.readAsText(importFile);
  };

  const closeAll = () => {
    setShowSuccessModal(false);
    onClose();
  };

  return (
    <div style={overlayStyle}>
      <div style={panelStyle}>
        <h2 style={{ fontSize: 20, fontWeight: "bold", marginBottom: 16 }}>
          <FaFolder style={{ marginRight: 8 }} />
          Trades importieren
        </h2>

        <div
          style={{
            ...dropZoneStyle,
            borderColor: dragOver ? "#dbaf58" : "#444",
            backgroundColor: dragOver ? "#1e2e30" : "#0b1825",
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            if (e.dataTransfer.files.length > 0) {
              setImportFile(e.dataTransfer.files[0]);
            }
          }}
          onClick={() => document.getElementById("fileInput").click()}
        >
          <FaFileAlt size={22} style={{ marginRight: 10 }} />
          {importFile ? importFile.name : "Datei hier ablegen oder klicken (.json)"}
        </div>

        <input
          id="fileInput"
          type="file"
          accept=".json"
          style={{ display: "none" }}
          onChange={(e) => setImportFile(e.target.files?.[0])}
        />

        <div style={{ marginTop: 16 }}>
          <label style={radioStyle}>
            <input
              type="radio"
              value="append"
              checked={importMode === "append"}
              onChange={() => setImportMode("append")}
              disabled={importing}
              style={{ marginRight: 6 }}
            />
            Neue Trades anhängen
          </label>
          <label style={radioStyle}>
            <input
              type="radio"
              value="replace"
              checked={importMode === "replace"}
              onChange={() => setImportMode("replace")}
              disabled={importing}
              style={{ marginRight: 6 }}
            />
            Vorherige ersetzen
          </label>
        </div>

        {error && (
          <p style={{ color: "#ff6b6b", marginTop: 12, fontSize: 14 }}>{error}</p>
        )}

        <div style={{ marginTop: 20, display: "flex", gap: 12 }}>
          <button
            onClick={onClose}
            style={cancelBtnStyle}
            disabled={importing}
          >
            Abbrechen
          </button>
          <button
            onClick={handleImport}
            disabled={!importFile || importing}
            style={{
              ...confirmBtnStyle,
              backgroundColor: hover ? "#c9a449" : "#dbaf58",
            }}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            {importing ? "Importiere..." : "Import starten"}
          </button>
        </div>
      </div>

      {showSuccessModal && (
        <div style={modalOverlay}>
          <div style={modalContent}>
            <h3>✅ Import erfolgreich!</h3>
            <p>Die Daten wurden erfolgreich hinzugefügt.</p>
            <div style={modalBtnContainer}>
              <button onClick={closeAll} style={cancelBtnStyle}>Schließen</button>
              <button onClick={() => navigate("/journal")} style={confirmBtnStyle}>
                Zum Journal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const overlayStyle = {
  position: "fixed",
  inset: 0,
  zIndex: 9999,
  backgroundColor: "rgba(0, 0, 0, 0.7)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const panelStyle = {
  backgroundColor: "#162428",
  padding: 24,
  borderRadius: 16,
  width: "90%",
  maxWidth: 400,
  color: "white",
  border: "1px solid #dbaf58",
};

const dropZoneStyle = {
  padding: "14px",
  border: "2px dashed #555",
  borderRadius: 8,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 15,
  fontWeight: 500,
  color: "#cccccc",
  transition: "all 0.3s ease",
};

const radioStyle = {
  display: "block",
  color: "#dddddd",
  fontSize: 14,
  marginTop: 10,
  cursor: "pointer",
};

const cancelBtnStyle = {
  flex: 1,
  backgroundColor: "#2f3b3e",
  color: "#dddddd",
  padding: 10,
  borderRadius: 6,
  fontWeight: 500,
  fontSize: 16,
  border: "1px solid #555",
  cursor: "pointer",
};

const confirmBtnStyle = {
  flex: 1,
  color: "black",
  padding: 10,
  borderRadius: 6,
  fontWeight: 600,
  fontSize: 16,
  border: "none",
  cursor: "pointer",
  transition: "background-color 0.2s ease",
  backgroundColor: "#dbaf58",
};

const modalOverlay = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  backgroundColor: "rgba(0, 0, 0, 0.6)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 10000,
};

const modalContent = {
  backgroundColor: "#162428",
  color: "#eeeeee",
  padding: 32,
  borderRadius: 14,
  minWidth: 320,
  textAlign: "center",
  border: "1px solid #dbaf58",
};

const modalBtnContainer = {
  display: "flex",
  justifyContent: "center",
  gap: 16,
  marginTop: 24,
  flexWrap: "wrap",
};
