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

const WEEKDAYS = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];

function parseDay(isoDate) {
  const date = new Date(isoDate);
  if (isNaN(date)) return 0;
  return (date.getDay() + 6) % 7; // Montag=0
}

export function ResultByWeekdayChart({ trades = [] }) {
  const data = useMemo(() => {
    const counts = Array(7).fill(0);

    trades.forEach(({ date }) => {
      if (!date) return;
      const day = parseDay(date);
      counts[day]++;
    });

    return counts;
  }, [trades]);

  const maxCount = Math.max(...data, 1);

  // Farbwerte mit Alpha auf Basis des Anteils
  const backgroundColors = data.map((count) =>
    count === 0
      ? "#444"
      : `rgba(219, 175, 88, ${0.3 + 0.7 * (count / maxCount)})`
  );

  const chartData = {
    labels: WEEKDAYS,
    datasets: [
      {
        label: "Trades",
        data,
        backgroundColor: backgroundColors,
        borderRadius: 6,
        maxBarThickness: 40,
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
          font: { size: 14, weight: "bold" },
        },
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
      },
      y: {
        ticks: {
          color: "#ccc",
          font: { size: 12 },
          stepSize: 1,
          beginAtZero: true,
        },
        grid: {
          color: "#333",
          borderDash: [3, 3],
        },
        border: {
          display: false,
        },
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
          label: (context) => `${context.parsed.y} Trades`,
        },
      },
    },
  };

  return (
    <div style={{ width: "100%", height: 250, fontFamily: "Arial, sans-serif" }}>
      <h3
        style={{
          color: "#fff",
          marginBottom: 30,
          fontWeight: "bold",
          fontSize: 20,
        }}
      >
        Trades per Wochentag
      </h3>
      <Bar data={chartData} options={options} />
    </div>
  );
}
