import React, { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export function StrategyFrequencyChart({ trades = [] }) {
  // Anzahl der Trades pro Strategie aggregieren
  const data = useMemo(() => {
    const freqMap = {};
    trades.forEach(({ strategy }) => {
      if (!strategy) return;
      freqMap[strategy] = (freqMap[strategy] || 0) + 1;
    });
    return Object.entries(freqMap)
      .map(([strategy, count]) => ({ strategy, count }))
      .sort((a, b) => b.count - a.count);
  }, [trades]);

  const labels = data.map((d) => d.strategy);
  const counts = data.map((d) => d.count);

  const COLORS = [
    "#dbaf58",
    "#c59e4f",
    "#b18e46",
    "#9f7e3d",
    "#8c6c3f",
    "#7a5c35",
  ];

  const chartData = {
    labels,
    datasets: [
      {
        label: "Anzahl Trades",
        data: counts,
        backgroundColor: labels.map((_, i) => COLORS[i % COLORS.length]),
        borderRadius: 6,
        barPercentage: 0.7,
        categoryPercentage: 0.8,
      },
    ],
  };

  const options = {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: {
          color: "#ccc",
          font: { size: 13 },
          precision: 0,
        },
        grid: {
          color: "#444",
          borderDash: [3, 3],
          drawBorder: true,
        },
        border: {
          display: true,
          color: "#666",
        },
        beginAtZero: true,
      },
      y: {
        ticks: {
          color: "#ccc",
          font: { size: 14, weight: "600" },
          padding: 4,
          maxRotation: 0,
          autoSkip: false,
          callback: (val) => {
            const label = labels[val] || "";
            return label.length > 15 ? label.slice(0, 12) + "..." : label;
          },
        },
        grid: { display: false },
        border: {
          display: true,
          color: "#666",
        },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        backgroundColor: "#121f2f",
        titleColor: "#dbaf58",
        bodyColor: "#fff",
        borderColor: "#dbaf58",
        borderWidth: 1,
        padding: 10,
        callbacks: {
          label: (context) => `${context.parsed.x} Trades`,
          title: (context) => `Strategie: ${context[0].label}`,
        },
      },
      title: {
        display: true,
        text: "Häufigkeit der Strategien",
        color: "#fff",
        font: { size: 20, weight: "bold" },
        padding: { top: 10, bottom: 20 },
      },
    },
  };

  return (
    <div style={{ width: "100%", height: 360, fontFamily: "Arial, sans-serif" }}>
      <Bar data={chartData} options={options} />
    </div>
  );
}
