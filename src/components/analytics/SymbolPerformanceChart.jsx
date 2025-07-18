import React, { useMemo } from "react";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export function SymbolPerformanceChart({ trades = [] }) {
  const { chartData, chartOptions } = useMemo(() => {
    const map = {};

    trades.forEach((t) => {
      const symbol = t.name ?? "unbekannt";

      let profit = 0;
      if (typeof t.profit === "number") {
        profit = t.profit;
      } else if (typeof t.profit === "string") {
        const normalized = t.profit.replace("–", "-");
        const cleaned = normalized.replace(/\./g, "").replace(",", ".").replace(/[^\d.-]/g, "");
        const parsed = parseFloat(cleaned);
        profit = isNaN(parsed) ? 0 : parsed;
      }

      if (!map[symbol]) {
        map[symbol] = { name: symbol, trades: 0, profit: 0 };
      }

      map[symbol].trades += 1;
      map[symbol].profit += profit;
    });

    const sorted = Object.values(map).sort((a, b) => a.name.localeCompare(b.name));
    const labels = sorted.map((d) => d.name);
    const tradesArr = sorted.map((d) => d.trades);
    const profitsArr = sorted.map((d) => +d.profit.toFixed(2));

    const chartData = {
      labels,
      datasets: [
        {
          label: "Trades",
          data: tradesArr,
          backgroundColor: "#dbaf58",
          yAxisID: "yTrades",
          borderRadius: 5,
          barThickness: 18,
        },
        {
          label: "Profit (€)",
          data: profitsArr,
          backgroundColor: "#8c6c3f",
          yAxisID: "yProfit",
          borderRadius: 5,
          barThickness: 18,
        },
      ],
    };

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "top",
          labels: {
            color: "#ccc",
            font: { size: 12, weight: "bold" },
          },
        },
        tooltip: {
          backgroundColor: "#0b1825",
          borderColor: "#dbaf58",
          borderWidth: 1,
          titleColor: "#dbaf58",
          bodyColor: "#ffffff",
          padding: 10,
          mode: "nearest",
          intersect: false,
          callbacks: {
            label: (ctx) => {
              const label = ctx.dataset.label;
              const value = ctx.raw;
              return `${label}: ${label.includes("Profit") ? value.toFixed(2) + " €" : value}`;
            },
          },
        },
      },
      layout: {
        padding: { top: 5, bottom: 5, left: 10, right: 10 },
      },
      scales: {
        x: {
          ticks: {
            color: "#ccc",
            maxRotation: 45,
            minRotation: 45,
            font: { size: 10 },
          },
          grid: { color: "#2a2a2a" },
        },
        yTrades: {
          position: "left",
          ticks: {
            color: "#dbaf58",
            font: { size: 11, weight: "bold" },
          },
          grid: { color: "#2a2a2a" },
        },
        yProfit: {
          position: "right",
          ticks: {
            color: "#8c6c3f",
            font: { size: 11, weight: "bold" },
            callback: (v) => `${v} €`,
          },
          grid: { drawOnChartArea: false },
        },
      },
    };

    return { chartData, chartOptions };
  }, [trades]);

  return (
    <div style={{ width: "100%", height: 350, fontFamily: "Arial, sans-serif" }}>
      <div style={{ color: "#fff", fontWeight: "bold", fontSize: 16, marginBottom: 6 }}>
        Performance je Symbol
      </div>
      <div style={{ height: "calc(100% - 36px)" }}>
        {chartData.labels.length === 0 ? (
          <div style={{ color: "#777", fontStyle: "italic" }}>Keine Daten vorhanden.</div>
        ) : (
          <Bar data={chartData} options={chartOptions} />
        )}
      </div>
    </div>
  );
}
