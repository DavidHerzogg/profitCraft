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

export function TagFrequencyChart({ trades = [] }) {
  const data = useMemo(() => {
    const tagCount = {};

    trades.forEach((trade) => {
      if (Array.isArray(trade.errorTags)) {
        trade.errorTags.forEach((tag) => {
          if (tag && typeof tag === "string") {
            tagCount[tag] = (tagCount[tag] || 0) + 1;
          }
        });
      }
    });

    return Object.entries(tagCount)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count);
  }, [trades]);

  const labels = data.map((d) => d.tag);
  const counts = data.map((d) => d.count);

  const COLORS = [
    "#dbaf58",
    "#c59e4f",
    "#b18e46",
    "#9f7e3d",
    "#8c6c3f",
    "#7a5c35",
    "#6a522b",
  ];

  const chartData = {
    labels,
    datasets: [
      {
        label: "Anzahl",
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
          maxRotation: 0,
          autoSkip: false,
          padding: 4,
          callback: (val) => {
            const label = labels[val] || "";
            return label.length > 20 ? label.slice(0, 17) + "..." : label;
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
          label: (context) => `${context.parsed.x} Anzahl`,
          title: (context) => `Tag: ${context[0].label}`,
        },
      },
      title: {
        display: true,
        text: "Häufigkeit der Fehler-Tags",
        color: "#fff",
        font: { size: 20, weight: "bold" },
        padding: { top: 10, bottom: 20 },
      },
    },
  };

  if (data.length === 0) {
    return (
      <div style={{ width: "100%", height: 360, fontFamily: "Arial, sans-serif", color: "#bbb", fontStyle: "italic", padding: 20 }}>
        Keine Tags vorhanden.
      </div>
    );
  }

  return (
    <div style={{ width: "100%", height: 360, fontFamily: "Arial, sans-serif" }}>
      <Bar data={chartData} options={options} />
    </div>
  );
}
