import React, { useState, useMemo, useCallback } from "react";
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
// import { de } from "date-fns/locale";

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

export const CapitalChart = ({ data, startCapital }) => {
  const [selectedRange, setSelectedRange] = useState(TIME_FILTERS.ALL);
  const startingCapital = startCapital;
  const now = useMemo(() => new Date(), []);

  const parseProfit = useCallback((profitValue) => {
    if (typeof profitValue === "number") return profitValue;
    if (typeof profitValue === "string") {
      const normalized = profitValue.replace("–", "-");
      const cleaned = normalized
        .replace(/\./g, "")
        .replace(",", ".")
        .replace(/[^\d.-]/g, "");
      const parsed = parseFloat(cleaned);
      return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
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
        return null;
    }
    return date;
  };

  const filterDate = getFilterDate(selectedRange);

  const filteredRawData = useMemo(() => {
    if (!filterDate) return data;
    return data.filter(({ date }) => {
      const d = new Date(date);
      if (selectedRange === TIME_FILTERS.DAY) {
        return (
          d.getFullYear() === filterDate.getFullYear() &&
          d.getMonth() === filterDate.getMonth() &&
          d.getDate() === filterDate.getDate()
        );
      }
      return d >= filterDate;
    });
  }, [data, filterDate, selectedRange]);

  const capitalUntilYesterday = useMemo(() => {
    if (selectedRange !== TIME_FILTERS.DAY) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return data.reduce((acc, trade) => {
      const d = new Date(trade.date);
      return d < today ? acc + parseProfit(trade.profit) : acc;
    }, startingCapital);
  }, [data, parseProfit, selectedRange, startingCapital]);

  const transformedData = useMemo(() => {
    if (filteredRawData.length === 0) {
      if (selectedRange === TIME_FILTERS.DAY) {
        return [
          {
            date: now.setHours(0, 0, 0, 0),
            capital: capitalUntilYesterday || startingCapital,
          },
        ];
      }
      return [];
    }

    let aggregationMode = "day";
    const timestamps = filteredRawData.map((e) => new Date(e.date).getTime());
    const [min, max] = [Math.min(...timestamps), Math.max(...timestamps)];
    const diffDays = (max - min) / (1000 * 60 * 60 * 24);
    if (diffDays > 90) aggregationMode = "month";
    else if (diffDays <= 1 || selectedRange === TIME_FILTERS.DAY)
      aggregationMode = "hour";

    const aggMap = new Map();
    for (const entry of filteredRawData) {
      const d = new Date(entry.date);
      let key;
      if (aggregationMode === "month")
        key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      else if (aggregationMode === "day") key = formatDateKey(d);
      else key = `${formatDateKey(d)}-${String(d.getHours()).padStart(2, "0")}`;

      const profit = parseProfit(entry.profit);
      if (!aggMap.has(key)) {
        aggMap.set(key, { profit: 0, date: d });
      }
      const current = aggMap.get(key);
      current.profit += profit;
      if (d > current.date) current.date = d;
    }

    let sortedEntries = Array.from(aggMap.values()).sort((a, b) => a.date - b.date);

    // Monatslücken schließen
    if (aggregationMode === "month" && sortedEntries.length > 0) {
      const filled = [];
      const first = new Date(
        sortedEntries[0].date.getFullYear(),
        sortedEntries[0].date.getMonth(),
        1
      );
      const last = new Date(
        sortedEntries.at(-1).date.getFullYear(),
        sortedEntries.at(-1).date.getMonth(),
        1
      );
      for (let d = new Date(first); d <= last; d.setMonth(d.getMonth() + 1)) {
        const found = sortedEntries.find(
          (e) => e.date.getFullYear() === d.getFullYear() && e.date.getMonth() === d.getMonth()
        );
        filled.push(found ?? { profit: 0, date: new Date(d) });
      }
      sortedEntries = filled;
    }

    let cumulative = startingCapital;
    if (filterDate) {
      for (const t of data) {
        if (new Date(t.date) < filterDate) {
          cumulative += parseProfit(t.profit);
        }
      }
    }

    const chartData = [];
    if (selectedRange !== TIME_FILTERS.ALL && filterDate) {
      chartData.push({ date: filterDate.getTime(), capital: Math.round(cumulative) });
    }

    for (const e of sortedEntries) {
      cumulative += e.profit;
      chartData.push({ date: e.date.getTime(), capital: Math.round(cumulative) });
    }

    return chartData;
  }, [
    filteredRawData,
    data,
    startingCapital,
    selectedRange,
    filterDate,
    capitalUntilYesterday,
    now,
    parseProfit,
  ]);

  const options = useMemo(() => {
    const totalRange =
      transformedData.length > 1
        ? transformedData.at(-1).date - transformedData[0].date
        : 0;
    const diffDays = totalRange / (1000 * 60 * 60 * 24);

    return {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: "nearest",
        intersect: false,
      },
      scales: {
        x: {
          type: "time",
          time: {
            tooltipFormat: "dd.MM.yyyy HH:mm",
            unit:
              diffDays > 90 ? "month" : diffDays > 1 ? "day" : "hour",
            displayFormats: {
              month: "MMM yy",
              day: "dd MMM",
              hour: "HH:mm",
            },
          },
          ticks: {
            color: "#cccccc",
            font: { size: 12 },
          },
          grid: {
            color: "#293646ff",
            borderColor: "#293646ff",
          },
        },
        y: {
          ticks: {
            color: "#cccccc",
            font: { size: 12 },
          },
          grid: {
            color: "#293646ff",
            borderColor: "#293646ff",
          },
          beginAtZero: false,
        },
      },
      plugins: {
        tooltip: {
          backgroundColor: "#0b1825",
          titleColor: "#dbaf58",
          bodyColor: "#dbaf58",
          callbacks: {
            label: (context) => `${context.parsed.y} € Kapital`,
            title: (context) =>
              `Datum: ${new Date(context[0].parsed.x).toLocaleString("de-DE")}`,
          },
        },
        legend: {
          display: false,
        },
      },
    };
  }, [transformedData]);

  const chartData = useMemo(() => {
    return {
      labels: transformedData.map((e) => e.date),
      datasets: [
        {
          label: "Kapital",
          data: transformedData.map((e) => ({ x: e.date, y: e.capital })),
          borderColor: "#dbaf58",
          backgroundColor: "rgba(219, 175, 88, 0.2)",
          fill: true,
          pointRadius: 3,
          pointHoverRadius: 5,
          tension: 0.3,
          borderWidth: 2,
          pointBackgroundColor: "#162428",
          pointBorderColor: "#dbaf58",
          hoverBorderWidth: 2,
        },
      ],
    };
  }, [transformedData]);

  return (
    <div style={{ width: "100%", padding: "1rem", backgroundColor: "transparent" }}>
      <h2>Kapitalentwicklung</h2>
      <div style={{ display: "flex", gap: "0.5rem", margin: "1rem 0" }}>
        {Object.entries(TIME_FILTERS).map(([label, key]) => (
          <button
            key={key}
            onClick={() => setSelectedRange(key)}
            style={{
              padding: "0.4rem 0.8rem",
              backgroundColor: selectedRange === key ? "#dbaf58" : "#162428",
              color: selectedRange === key ? "#0b1825" : "#dbaf58",
              border: "1px solid #dbaf58",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "0.8rem",
            }}
          >
            {label === "ALL"
              ? "Gesamt"
              : label === "MONTH"
              ? "Letzter Monat"
              : label === "WEEK"
              ? "Letzte Woche"
              : "Heute"}
          </button>
        ))}
      </div>

      <div style={{ width: "100%", height: "360px", borderRadius: "12px", padding: "1rem" }}>
        <Line options={options} data={chartData} />
      </div>
    </div>
  );
};
