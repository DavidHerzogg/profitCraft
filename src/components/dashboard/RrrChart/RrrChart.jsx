import React, { useMemo } from "react";

const calculateAverageRRR = (trades) => {
  if (!trades || trades.length === 0) return 0;
  const totalRRR = trades.reduce((sum, trade) => sum + (trade.rrr || 0), 0);
  return (totalRRR / trades.length).toFixed(2);
};

export const RrrChart = ({ trades }) => {
  const averageRRR = useMemo(() => calculateAverageRRR(trades), [trades]);

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
        Durchschnittliches R:R-Verhältnis
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
            color: "#dbaf58",
            textAlign: "center",
          }}
        >
          1 : {averageRRR}
        </div>
      </div>
    </div>
  );
};
