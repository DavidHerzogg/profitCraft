import React, { useMemo } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export const WinrateChart = ({ trades = [] }) => {
  const parseProfit = (profit) => {
    if (typeof profit === "number") return profit;
    if (typeof profit === "string") {
      const normalized = profit.replace("–", "-");
      const cleaned = normalized
        .replace(/\./g, "")
        .replace(",", ".")
        .replace(/[^\d.-]/g, "");
      const parsed = parseFloat(cleaned);
      return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  };

  const wins = trades.filter((t) => parseProfit(t.profit) > 0).length;
  const losses = trades.length - wins;
  const winrate = trades.length > 0 ? Math.round((wins / trades.length) * 100) : 0;

  const data = useMemo(() => ({
    labels: ["Wins", "Losses"],
    datasets: [
      {
        data: [wins, losses],
        backgroundColor: ["#dbaf58", "#8c6c3f"],
        borderColor: "#fff",
        borderWidth: 1,
        hoverOffset: 0,
      },
    ],
  }), [wins, losses]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "60%", // Loch in der Mitte für Donut
    rotation: 90 * (Math.PI / 180), // Startwinkel 90 Grad (oben)
    plugins: {
      tooltip: {
        backgroundColor: "#0b1825",
        borderColor: "#f0f0f0",
        borderWidth: 1,
        titleColor: "white",
        bodyColor: "white",
        bodyFont: { weight: "bold" },
        callbacks: {
          label: (context) => {
            const label = context.label || "";
            const value = context.parsed || 0;
            return `${value} ${label}`;
          },
        },
      },
      legend: { display: false },
    },
  };

  return (
    <div
      style={{
        width: "100%",
        height: 220,
        borderRadius: 12,
        fontFamily: "Arial, sans-serif",
        position: "relative",
        padding: "0px 16px 16px 16px",
        boxSizing: "border-box",
        color: "#dbaf58",
        backgroundColor: "transparent",
      }}
    >
      <h3 style={{ margin: "0px 0 15px 0", fontWeight: "bold", color: "#fff" }}>
        Gewinn Rate
      </h3>

      <div
        style={{
          width: "100%",
          height: "150px",
          borderRadius: "12px",
          position: "relative",
        }}
      >
        <Pie data={data} options={options} />
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontSize: "1.5rem",
            fontWeight: "bold",
            color: "#dbaf58",
            pointerEvents: "none",
            userSelect: "none",
            zIndex: -1,
          }}
        >
          {winrate}%
        </div>
      </div>
    </div>
  );
};
