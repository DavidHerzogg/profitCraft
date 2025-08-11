import React, { useMemo } from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export function DirectionAnalysisChart({ trades = [] }) {
  const data = useMemo(() => {
    const directionCount = { long: 0, short: 0 };

    trades.forEach(({ type }) => {
      const t = (type || "").toLowerCase();
      if (t === "long" || t === "short") {
        directionCount[t]++;
      }
    });

    return {
      labels: ["Long", "Short"],
      datasets: [
        {
          data: [directionCount.long, directionCount.short],
          backgroundColor: ["#4caf50", "#f44336"],
          borderColor: "#fff",
          borderWidth: 2,
          hoverOffset: 0,
          spacing: 0,
        },
      ],
    };
  }, [trades]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#ccc",
          font: {
            weight: "600",
            size: 14,
          },
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: "#0b1825",
        titleColor: "#dbaf58",
        bodyColor: "#fff",
        borderColor: "#dbaf58",
        borderWidth: 1,
        padding: 10,
        callbacks: {
          label: (context) => `${context.parsed} ${context.label}`,
        },
      },
    },
    cutout: "65%", // entspricht innerRadius (Donut-Größe)
    rotation: -90, // Startwinkel (90° bei recharts entspricht -90° in Chart.js)
    circumference: 360, // kompletter Kreis
  };

  return (
    <div style={{ width: "100%", height: 420, fontFamily: "Arial, sans-serif" }}>
      <h3 style={{ color: "#fff", fontWeight: "bold", marginBottom: 50 }}>
        Analyse der Handelsrichtung
      </h3>
      <div style={{ width: "100%", height: "calc(100% - 70px)" }}>
        <Pie data={data} options={options} />
      </div>
    </div>
  );
}
