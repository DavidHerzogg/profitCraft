import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";

export function StartCapitalPanel({ onComplete }) {
  const { userId } = useAuth();
  const setStartCapital = useMutation(api.userSettings.setStartCapital);
  const [capitalInput, setCapitalInput] = useState("");
  const [error, setError] = useState("");
  const [hover, setHover] = useState(false);

  useEffect(() => {
    const originalOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = originalOverflow;
    };
  }, []);

  const handleSave = async () => {
    if (!userId) {
      setError("Nicht eingeloggt. Bitte anmelden.");
      return;
    }

    const capitalStr = capitalInput.trim();
    const capital = parseFloat(capitalStr);

    if (!capitalStr || isNaN(capital) || capital <= 0) {
      setError("Bitte gib einen gültigen Betrag ein.");
      return;
    }

    setError("");

    try {
      await setStartCapital({ userId, startCapital: capital });
      onComplete();
    } catch (e) {
      setError("Fehler beim Speichern.");
      console.error("StartCapitalPanel - Mutation Fehler:", e);
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
      aria-labelledby="startCapitalTitle"
      aria-describedby="startCapitalDesc"
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
        <h2 id="startCapitalTitle" style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "16px" }}>
          Startkapital festlegen
        </h2>
        <p id="startCapitalDesc" style={{ marginBottom: "12px", fontSize: "14px", color: "#cccccc" }}>
          Gib dein anfängliches Startkapital ein. Du kannst es später jederzeit im Profil ändern.
        </p>
        <input
          type="text"
          placeholder="z. B. 5000"
          value={capitalInput}
          onChange={(e) => setCapitalInput(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "6px",
            backgroundColor: "#0b1825",
            color: "white",
            border: "1px solid #666",
            marginBottom: "10px",
            fontSize: "16px",
          }}
          aria-invalid={!!error}
          aria-describedby={error ? "startCapitalError" : undefined}
        />
        {error && (
          <p id="startCapitalError" style={{ color: "#ff6b6b", fontSize: "14px", marginBottom: "10px" }}>
            {error}
          </p>
        )}
        <button
          onClick={onComplete}
          style={{
            width: "49%",
            marginRight: "0.3rem",
            backgroundColor: "#2f3b3e", // dunkler, neutraler Hintergrund
            color: "#dddddd",
            padding: "10px",
            borderRadius: "6px",
            fontWeight: "500",
            fontSize: "16px",
            cursor: "pointer",
            border: "1px solid #555", // dezenter Rahmen
            transition: "background-color 0.2s ease, color 0.2s ease",
          }}
          type="button"
        >
          Abbrechen
        </button>
        <button
          onClick={handleSave}
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
          Speichern
        </button>
      </div>
    </div>
  );
}
