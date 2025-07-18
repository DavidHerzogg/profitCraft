import React, { useMemo } from "react";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

export function PerformanceByHourChart({ trades = [] }) {
  const data = useMemo(() => {
    const profits = Array(24).fill(0);

    trades.forEach(({ date, profit }) => {
      if (!date) return;
      const hour = new Date(date).getHours();
      let p = 0;
      if (typeof profit === "number") p = profit;
      else if (typeof profit === "string") {
        const normalized = profit.replace("–", "-");
        const cleaned = normalized.replace(/\./g, "").replace(",", ".").replace(/[^\d.-]/g, "");
        const parsed = parseFloat(cleaned);
        p = isNaN(parsed) ? 0 : parsed;
      }
      profits[hour] += p;
    });

    return profits.map((sum, hour) => ({
      hour,
      profit: +sum.toFixed(2),
      label: `${hour}:00`,
    }));
  }, [trades]);

  const maxAbsProfit = Math.max(
    Math.abs(Math.min(...data.map((d) => d.profit))),
    Math.abs(Math.max(...data.map((d) => d.profit))),
    1
  );

  const backgroundColors = data.map(({ profit }) =>
    profit > 0
      ? "rgba(72, 194, 115, 0.7)"
      : profit < 0
        ? "rgba(255, 99, 99, 0.7)"
        : "#555"
  );

  const chartData = {
    labels: data.map((d) => d.label),
    datasets: [
      {
        label: "Performance",
        data: data.map((d) => d.profit),
        backgroundColor: backgroundColors,
        borderRadius: 6,
        barPercentage: 0.7,
        categoryPercentage: 0.8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',     // Tooltip zeigt alle Werte des gleichen X-Werts
      intersect: false,  // Tooltip wird auch angezeigt, wenn nicht exakt über Balken
    },
    scales: {
      x: {
        ticks: {
          color: "#ccc",
          maxRotation: 40,
          minRotation: 40,
          font: { weight: "600", size: 13 },
        },
        grid: { display: false, drawBorder: true, color: "#666" },
        border: { color: "#666" },
      },
      y: {
        min: -maxAbsProfit,
        max: maxAbsProfit,
        ticks: {
          color: "#ccc",
          callback: (v) => `${v} €`,
          maxTicksLimit: 6,
        },
        grid: { color: "#444" },
        border: { color: "#666" },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#121f2f",
        borderColor: "#dbaf58",
        borderWidth: 1,
        titleColor: "#dbaf58",
        bodyColor: "#fff",
        bodyFont: { weight: "bold" },
        padding: 10,
        cornerRadius: 6,
        callbacks: {
          title: (ctx) => `Stunde: ${ctx[0].label}`,
          label: (ctx) => `${ctx.parsed.y.toFixed(2)} €`,
        },
      },
    },
  };

  return (
    <div style={{ width: "100%", height: 340, fontFamily: "Arial, sans-serif" }}>
      <h3
        style={{
          color: "#fff",
          marginBottom: 14,
          fontWeight: "bold",
          fontSize: 20,
        }}
      >
        Performance pro Stunde
      </h3>
      <div style={{ height: "90%" }}>
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
}
