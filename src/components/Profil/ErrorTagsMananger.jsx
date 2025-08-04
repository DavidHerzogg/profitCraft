import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useUser } from "@clerk/clerk-react";

export default function ErrorTagManager({ onClose }) {
  const { user } = useUser();
  const userId = user?.id;

  const saveSettings = useMutation(api.userSettings.saveSettings);
  const userSettings = useQuery(api.userSettings.getSettings, { userId });

  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState("");

  useEffect(() => {
    if (userSettings?.errorTags) {
      setTags(userSettings.errorTags);
    }
  }, [userSettings]);

  const handleAddTag = () => {
    const trimmed = newTag.trim();
    if (trimmed && !tags.includes(trimmed)) {
      const updated = [...tags, trimmed];
      setTags(updated);
      saveSettings({
        userId,
        strategies: userSettings?.strategies ?? [],
        errorTags: updated,
        purchasedProductIds: userSettings?.purchasedProductIds ?? [],
      });
    }
    setNewTag("");
  };

  const handleRemoveTag = (tag) => {
    const updated = tags.filter((t) => t !== tag);
    setTags(updated);
    saveSettings({
      userId,
      strategies: userSettings?.strategies ?? [],
      errorTags: updated,
      purchasedProductIds: userSettings?.purchasedProductIds ?? [],
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
          Fehler-Tags verwalten
        </h2>

        <div style={{ display: "flex", marginBottom: "1rem" }}>
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="Neuer Fehler-Tag..."
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
            onClick={handleAddTag}
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
          {tags.length === 0 ? (
            <p style={{ color: "#888", fontStyle: "italic" }}>Keine Fehler-Tags vorhanden.</p>
          ) : (
            tags.map((tag) => (
              <div
                key={tag}
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
                <span>{tag}</span>
                <button
                  onClick={() => handleRemoveTag(tag)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#ff6b6b",
                    fontSize: "16px",
                    cursor: "pointer",
                  }}
                  aria-label={`Tag ${tag} entfernen`}
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
