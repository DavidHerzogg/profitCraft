import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

export default function StrategyPanel({ onClose }) {
  const { user } = useUser();
  const userId = user?.id;

  const settings = useQuery(api.userSettings.getSettings, { userId });
  const saveSettings = useMutation(api.userSettings.saveSettings);

  const [strategies, setStrategies] = useState([]);
  const [newStrategy, setNewStrategy] = useState("");

  useEffect(() => {
    if (settings?.strategies) {
      setStrategies(settings.strategies);
    }
  }, [settings]);

  const handleAddStrategy = () => {
    const trimmed = newStrategy.trim();
    if (trimmed && !strategies.includes(trimmed)) {
      const updated = [...strategies, trimmed];
      setStrategies(updated);
      saveSettings({
        userId,
        strategies: updated,
        errorTags: settings?.errorTags ?? [],
        purchasedProductIds: settings?.purchasedProductIds ?? [],
      });
    }
    setNewStrategy("");
  };

  const handleDelete = (strategy) => {
    const updated = strategies.filter((s) => s !== strategy);
    setStrategies(updated);
    saveSettings({
      userId,
      strategies: updated,
      errorTags: settings?.errorTags ?? [],
      purchasedProductIds: settings?.purchasedProductIds ?? [],
    });
  };

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
          maxWidth: "500px",
          maxHeight: "80vh",
          overflowY: "auto",
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
          Strategien verwalten
        </h2>

        <div style={{ display: "flex", marginBottom: "1rem" }}>
          <input
            type="text"
            value={newStrategy}
            onChange={(e) => setNewStrategy(e.target.value)}
            placeholder="Neue Strategie..."
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "6px 0 0 6px",
              border: "1px solid #666",
              backgroundColor: "#0b1825",
              color: "white",
              fontSize: "14px",
              outline: "none",
            }}
          />
          <button
            onClick={handleAddStrategy}
            style={{
              padding: "0 16px",
              backgroundColor: "#dbaf58",
              color: "black",
              border: "none",
              borderRadius: "0 6px 6px 0",
              fontWeight: "600",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            +
          </button>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            maxHeight: "200px",
            overflowY: "auto",
            scrollbarWidth: "thin",
            scrollbarColor: "#555 transparent",
          }}
        >
          {strategies.length === 0 ? (
            <p style={{ color: "#888", fontStyle: "italic" }}>Keine Strategien vorhanden.</p>
          ) : (
            strategies.map((strategy) => (
              <div
                key={strategy}
                style={{
                  backgroundColor: "#0b1825",
                  padding: "10px",
                  borderRadius: "6px",
                  border: "1px solid #444",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontSize: "14px",
                }}
              >
                <span>{strategy}</span>
                <button
                  onClick={() => handleDelete(strategy)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#ff6b6b",
                    fontSize: "16px",
                    cursor: "pointer",
                  }}
                  aria-label={`Strategie ${strategy} löschen`}
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>

        <button
          onClick={onClose}
          style={{
            marginTop: "20px",
            width: "100%",
            padding: "10px",
            backgroundColor: "#2f3b3e",
            color: "#dddddd",
            borderRadius: "6px",
            fontWeight: "500",
            fontSize: "16px",
            cursor: "pointer",
            border: "1px solid #555",
          }}
        >
          Schließen
        </button>
      </div>
    </div>
  );
}
