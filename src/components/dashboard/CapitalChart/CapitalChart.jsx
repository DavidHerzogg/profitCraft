import React, { useState, useMemo, useCallback, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  TimeScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import "chartjs-adapter-date-fns";

ChartJS.register(
  CategoryScale,
  LinearScale,
  TimeScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
);

const TIME_FILTERS = {
  ALL: "ALL",
  MONTH: "MONTH",
  WEEK: "WEEK",
  DAY: "DAY",
};

const formatDateKey = (date) => date.toISOString().split("T")[0];

export const CapitalChart = ({ data, startCapital = 0 }) => {
  const [selectedRange, setSelectedRange] = useState(TIME_FILTERS.ALL);
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const now = useMemo(() => new Date(), []);

  const parseProfit = useCallback((profitValue) => {
    if (typeof profitValue === "number") return profitValue;
    const cleaned = String(profitValue).replace(/[^0-9\-.,]/g, "").replace(/\./g, "").replace(/,/, ".");
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
  }, []);

  const getFilterDate = (range) => {
    const date = new Date(now);
    date.setHours(0, 0, 0, 0);
    switch (range) {
      case TIME_FILTERS.MONTH:
        date.setDate(date.getDate() - 30);
        break;
      case TIME_FILTERS.WEEK:
        date.setDate(date.getDate() - 7);
        break;
      case TIME_FILTERS.DAY:
        break;
      default:
        break;
    }
    return range === TIME_FILTERS.ALL ? null : date;
  };
  const filterDate = getFilterDate(selectedRange);

  // Berechne das kumulative Kapital vor dem Filterzeitraum
  const initialCapitalBeforeFilter = useMemo(() => {
    if (!filterDate) return startCapital;

    let cumulative = startCapital;
    const tradesBeforeFilter = data.filter(({ date }) => new Date(date) < filterDate);
    tradesBeforeFilter.forEach((t) => {
      cumulative += parseProfit(t.profit);
    });
    return cumulative;
  }, [data, filterDate, startCapital, parseProfit]);

  const filteredRawData = useMemo(() => {
    if (!filterDate) return data;
    return data.filter(({ date }) => {
      const d = new Date(date);
      if (selectedRange === TIME_FILTERS.DAY) {
        return d.toDateString() === filterDate.toDateString();
      }
      return d >= filterDate;
    });
  }, [data, filterDate, selectedRange]);

  const transformedData = useMemo(() => {
    let cumulative = initialCapitalBeforeFilter;
    const map = new Map();
    filteredRawData.forEach((t) => {
      const d = new Date(t.date);
      const key = formatDateKey(d) + (selectedRange === TIME_FILTERS.DAY ? `-${d.getHours()}` : "");
      if (!map.has(key)) map.set(key, { date: d, profit: 0 });
      map.get(key).profit += parseProfit(t.profit);
    });
    const points = Array.from(map.values())
      .sort((a, b) => a.date - b.date)
      .map(({ date, profit }) => {
        cumulative += profit;
        return { x: date.getTime(), y: Math.round(cumulative) };
      });
    return points.length > 0 ? points : [{ x: now.getTime(), y: cumulative }];
  }, [filteredRawData, initialCapitalBeforeFilter, parseProfit, selectedRange, now]);

  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "nearest",
      intersect: false,
    },
    scales: {
      x: { type: "time", time: { unit: width > 1024 ? "day" : "hour" }, ticks: { font: { size: width > 1024 ? 12 : 10 } } },
      y: { ticks: { font: { size: width > 1024 ? 12 : 10 } } },
    },
    plugins: { legend: { display: false } },
  }), [width]);

  const chartData = useMemo(() => ({
    datasets: [
      {
        data: transformedData,
        borderColor: "#dbaf58",
        backgroundColor: "rgba(219,175,88,0.2)",
        fill: true,
        pointRadius: width > 1024 ? 4 : 2,
      },
    ],
  }), [transformedData, width]);

  const containerStyle = { width: "100%", padding: 16, boxSizing: "border-box" };
  const titleStyle = { fontSize: "1.8rem", margin: "0 0 8px", textAlign: "center" };
  const controlStyle = { display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 4, marginBottom: 12 };
  const buttonStyle = (active) => ({
    padding: "6px 12px",
    border: "none",
    borderRadius: 999,
    backgroundColor: active ? "#dbaf58" : "transparent",
    color: active ? "#0b1825" : "#dbaf58",
    fontSize: "0.9rem",
    fontWeight: 600,
    cursor: "pointer",
    transition: "background-color 0.2s",
  });
  const chartWrapperStyle = { width: "100%", height: "380px", borderRadius: 12, overflow: "hidden" };

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>Kapitalentwicklung</h2>
      <div style={controlStyle}>
        {Object.entries(TIME_FILTERS).map(([label, key]) => (
          <button key={key} onClick={() => setSelectedRange(key)} style={buttonStyle(selectedRange === key)}>
            {label === "ALL" ? "Gesamt" : label === "MONTH" ? "Monat" : label === "WEEK" ? "Woche" : "Tag"}
          </button>
        ))}
      </div>
      <div style={chartWrapperStyle}>
        <Line options={options} data={chartData} />
      </div>
    </div>
  );
};