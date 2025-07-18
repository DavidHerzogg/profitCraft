import React, { useMemo } from "react";

export const PnlChart = ({ trades }) => {
  const totalPnL = useMemo(() => {
    if (!trades || trades.length === 0) return 0;
    const sum = trades.reduce((acc, trade) => acc + (trade.profit || 0), 0);
    return sum.toFixed(2);
  }, [trades]);

  const isPositive = parseFloat(totalPnL) >= 0;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        height: "90%",
        padding: "1rem",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          marginBottom: "1rem",
          fontSize: "1.5rem",
        }}
      >
        Gesamt-PnL
      </h2>
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "300px",
          height: "auto",
          backgroundColor: "transparent",
          borderRadius: "12px",
          border: "2px solid #c4c5ca",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            fontSize: "2.5rem",
            fontWeight: "bold",
            color: isPositive ? "#dbaf58" : "#8c6c3f",
            textAlign: "center",
          }}
        >
          {isPositive ? "+" : ""}
          {totalPnL}€
        </div>
      </div>
    </div>
  );
};
