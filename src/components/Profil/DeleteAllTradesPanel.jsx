import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useEffect } from "react";

export default function DeleteAllTradesPanel({ userId, onClose }) {
  const trades = useQuery(api.trades.getUserTrades, userId ? { userId } : "skip");
  const deleteAll = useMutation(api.trades.deleteAllTrades);

  useEffect(() => {
    const originalOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = originalOverflow;
    };
  }, []);

  const handleDelete = async () => {
    await deleteAll({ userId });
    onClose();
  };

  const tradeCount = trades?.length ?? 0;

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
          maxWidth: "420px",
          color: "white",
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          border: "1px solid #dbaf58",
        }}
      >
        <h2 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "16px" }}>
          Alle Trades löschen?
        </h2>
        <p style={{ marginBottom: "16px", fontSize: "14px", color: "#cccccc" }}>
          Diese Aktion kann nicht rückgängig gemacht werden. Du hast aktuell <strong>{tradeCount}</strong> gespeicherte Trades.
        </p>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <button
            onClick={onClose}
            style={{
              width: "48%",
              backgroundColor: "#2f3b3e",
              color: "#dddddd",
              padding: "10px",
              borderRadius: "6px",
              fontWeight: "500",
              fontSize: "16px",
              cursor: "pointer",
              border: "1px solid #555",
            }}
          >
            Abbrechen
          </button>
          <button
            onClick={handleDelete}
            style={{
              width: "48%",
              backgroundColor: "#ff6b6b",
              color: "white",
              padding: "10px",
              borderRadius: "6px",
              fontWeight: "600",
              fontSize: "16px",
              cursor: "pointer",
              border: "none",
              transition: "background-color 0.3s ease",
            }}
          >
            Alle löschen
          </button>
        </div>
      </div>
    </div>
  );
}
