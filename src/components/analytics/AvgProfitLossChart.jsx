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

export function AvgProfitLossChart({ trades = [] }) {
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
        map[symbol] = {
          profitSum: 0,
          profitCount: 0,
          lossSum: 0,
          lossCount: 0,
        };
      }

      if (profit > 0) {
        map[symbol].profitSum += profit;
        map[symbol].profitCount++;
      } else if (profit < 0) {
        map[symbol].lossSum += profit;
        map[symbol].lossCount++;
      }
    });

    const sorted = Object.entries(map)
      .map(([name, stats]) => ({
        name,
        avgProfit: stats.profitCount > 0 ? stats.profitSum / stats.profitCount : 0,
        avgLoss: stats.lossCount > 0 ? Math.abs(stats.lossSum / stats.lossCount) : 0,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));

    const labels = sorted.map((d) => d.name);
    const avgProfit = sorted.map((d) => +d.avgProfit.toFixed(2));
    const avgLoss = sorted.map((d) => +d.avgLoss.toFixed(2));

    const chartData = {
      labels,
      datasets: [
        {
          label: "Durchschnittlicher Gewinn",
          data: avgProfit,
          backgroundColor: "#dbaf58",
          borderRadius: 6,
          barThickness: 24,
        },
        {
          label: "Durchschnittlicher Verlust",
          data: avgLoss,
          backgroundColor: "#8c6c3f",
          borderRadius: 6,
          barThickness: 24,
        },
      ],
    };

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "top",
          align: "start",
          labels: {
            color: "#dbaf58",
            font: { weight: "bold", size: 13 },
          },
        },
        tooltip: {
          backgroundColor: "#121f2f",
          borderColor: "#dbaf58",
          borderWidth: 1,
          titleColor: "#dbaf58",
          bodyColor: "#fff",
          mode: "nearest",
          intersect: false,
          callbacks: {
            label: (ctx) => `${ctx.dataset.label}: ${ctx.raw.toFixed(2)} €`,
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: "#ccc",
            font: { size: 11, weight: "bold" },
            maxRotation: 45,
            minRotation: 45,
          },
          grid: { color: "#2f3540" },
        },
        y: {
          ticks: {
            color: "#dbaf58",
            font: { size: 12, weight: "600" },
            callback: (v) => `${v.toLocaleString()} €`,
          },
          grid: { color: "#2f3540" },
        },
      },
    };

    return { chartData, chartOptions };
  }, [trades]);

  return (
    <div style={{ width: "100%", height: 420, fontFamily: "'Segoe UI', sans-serif" }}>
      <div style={{ color: "#fff", fontWeight: "700", fontSize: 18, marginBottom: 8 }}>
        Durchschnittlicher Gewinn & Verlust je Symbol
      </div>
      <div style={{ height: "calc(100% - 45px)" }}>
        {chartData.labels.length === 0 ? (
          <div style={{ color: "#777", fontStyle: "italic" }}>Keine Daten vorhanden.</div>
        ) : (
          <Bar data={chartData} options={chartOptions} />
        )}
      </div>
    </div>
  );
}
