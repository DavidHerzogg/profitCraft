import React, { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export function TradesByHourChart({ trades = [] }) {
  const data = useMemo(() => {
    const counts = Array(24).fill(0);
    trades.forEach(({ date }) => {
      if (!date) return;
      const hour = new Date(date).getHours();
      counts[hour]++;
    });
    return counts;
  }, [trades]);

  const maxCount = Math.max(...data, 1);
  const backgroundColors = data.map((count) =>
    count === 0
      ? "#444"
      : `rgba(219, 175, 88, ${0.3 + 0.7 * (count / maxCount)})`
  );

  const labels = Array.from({ length: 24 }, (_, i) => `${i}:00`);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Trades",
        data,
        backgroundColor: backgroundColors,
        borderRadius: 4,
        maxBarThickness: 24,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: {
          color: "#ccc",
          font: { size: 12, weight: "bold" },
          maxRotation: 45,
          minRotation: 45,
        },
        grid: { display: false },
        border: { display: false },
      },
      y: {
        ticks: {
          color: "#ccc",
          font: { size: 12, weight: "bold" },
          stepSize: 1,
          beginAtZero: true,
        },
        grid: {
          color: "#333",
          borderDash: [3, 3],
        },
        border: { display: false },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#0b1825",
        titleColor: "#dbaf58",
        bodyColor: "#fff",
        borderColor: "#dbaf58",
        borderWidth: 1,
        padding: 10,
        callbacks: {
          label: (ctx) => `${ctx.parsed.y} Trades`,
        },
      },
    },
  };

  return (
    <div style={{ width: "100%", height: 300, fontFamily: "Arial, sans-serif" }}>
      <h3 style={{ color: "#fff", marginBottom: 12, fontWeight: "bold", fontSize: 18 }}>
        Trades per Stunde
      </h3>
      <div style={{ height: "calc(100% - 36px)" }}>
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
}
