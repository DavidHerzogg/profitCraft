import React, { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, Title);

export function StrategyPerformanceChart({ trades = [] }) {
  const data = useMemo(() => {
    const map = {};

    trades.forEach(({ strategy, profit }) => {
      if (!strategy) return;
      let p = 0;
      if (typeof profit === "number") p = profit;
      else if (typeof profit === "string") {
        const normalized = profit.replace("–", "-");
        const cleaned = normalized.replace(/\./g, "").replace(",", ".").replace(/[^\d.-]/g, "");
        const parsed = parseFloat(cleaned);
        p = isNaN(parsed) ? 0 : parsed;
      }
      if (!map[strategy]) map[strategy] = 0;
      map[strategy] += p;
    });

    return Object.entries(map).map(([strategy, profit]) => ({
      strategy,
      profit: +profit.toFixed(2),
    }));
  }, [trades]);

  const maxAbsProfit = Math.max(
    Math.abs(Math.min(...data.map((d) => d.profit))),
    Math.abs(Math.max(...data.map((d) => d.profit))),
    1
  );

  const backgroundColors = data.map(({ profit }) => {
    if (profit === 0) return "#555";
    if (profit > 0) {
      const alpha = Math.min(0.9, 0.4 + 0.6 * (profit / maxAbsProfit));
      return `rgba(72, 194, 115, ${alpha})`;
    } else {
      const alpha = Math.min(0.9, 0.4 + 0.6 * (-profit / maxAbsProfit));
      return `rgba(255, 99, 99, ${alpha})`;
    }
  });

  const labels = data.map((d) => d.strategy);
  const profits = data.map((d) => d.profit);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Performance",
        data: profits,
        backgroundColor: backgroundColors,
        borderRadius: 6,
        barThickness: 28,
      },
    ],
  };

  const options = {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        min: -maxAbsProfit,
        max: maxAbsProfit,
        ticks: {
          color: "#ccc",
          font: { size: 13 },
          callback: (v) => `${v} €`,
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
        zeroLineColor: "rgba(168, 168, 168, 1)",
        zeroLineWidth: 1.5,
      },
      y: {
        ticks: {
          color: "#ccc",
          font: { size: 12, weight: "600" },
          padding: 4,
          // Label auf max 80px begrenzen via callback + Ellipsis
          callback: (val, index) => {
            const label = labels[index] || "";
            if (label.length > 12) return label.slice(0, 9) + "...";
            return label;
          },
          maxRotation: 0,
          autoSkip: false,
        },
        grid: {
          display: false,
        },
        border: {
          display: true,
          color: "#666",
        },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#121f2f",
        titleColor: "#dbaf58",
        bodyColor: "#fff",
        borderColor: "#dbaf58",
        borderWidth: 1,
        padding: 10,
        mode: "nearest",
        intersect: false,
        callbacks: {
          label: (ctx) => `${ctx.parsed.x.toFixed(2)} €`,
          title: (ctx) => `Strategie: ${ctx[0].label}`,
        },
      },
      title: {
        display: true,
        text: "Performance nach Strategie",
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
