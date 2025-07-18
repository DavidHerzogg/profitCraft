import React, { useMemo, useRef, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
  TimeScale,
} from "chart.js";
import { Line } from "react-chartjs-2";
import "chartjs-adapter-date-fns";
import { format, parseISO, isValid } from "date-fns";
import deLocale from "date-fns/locale/de";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
  TimeScale
);

function aggregateTradesByDay(trades) {
  const grouped = trades.reduce((acc, trade) => {
    // Versuche Datum zu parsen und validieren
    let dateObj = null;
    try {
      dateObj = trade.date instanceof Date ? trade.date : parseISO(trade.date);
    } catch {
      dateObj = null;
    }
    if (!dateObj || !isValid(dateObj)) return acc;

    const day = dateObj.toISOString().slice(0, 10);
    const profit = typeof trade.profit === "number" ? trade.profit : 0;
    acc[day] = (acc[day] || 0) + profit;
    return acc;
  }, {});

  return Object.entries(grouped)
    .map(([date, profit]) => ({ date, profit }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));
}

function calculateDrawdown(trades) {
  let capital = 0;
  let peak = 0;
  return trades.map((t) => {
    capital += t.profit;
    peak = Math.max(peak, capital);
    const dd = capital - peak;
    return { date: t.date, drawdown: dd };
  });
}

export function DrawdownChart({ trades }) {
  const chartRef = useRef(null);

  // Tooltip-Element managen
  useEffect(() => {
    return () => {
      // Tooltip beim Unmount entfernen
      const tooltipEl = document.getElementById("chartjs-tooltip");
      if (tooltipEl) {
        tooltipEl.remove();
      }
    };
  }, []);

  const drawdownData = useMemo(() => {
    if (!trades || trades.length === 0) return [];
    const aggregated = aggregateTradesByDay(trades);
    return calculateDrawdown(aggregated);
  }, [trades]);

  if (drawdownData.length === 0) {
    return (
      <div style={{ color: "#bbb", fontFamily: "Arial, sans-serif", padding: 20 }}>
        Keine Daten für Drawdown verfügbar.
      </div>
    );
  }

  const labels = drawdownData.map((d) => d.date);
  const dataPoints = drawdownData.map((d) => d.drawdown);

  const data = {
    labels,
    datasets: [
      {
        label: "Drawdown (€)",
        data: dataPoints,
        fill: true,
        borderColor: "rgba(255,80,80,1)",
        backgroundColor: "rgba(255,80,80,0.15)",
        pointRadius: 0,
        pointHoverRadius: 6,
        pointHoverBorderWidth: 3,
        pointHoverBackgroundColor: "rgba(255,80,80,1)",
        pointHoverBorderColor: "rgba(255,80,80,1)",
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "nearest",
      intersect: false,
    },
    plugins: {
      tooltip: {
        enabled: false, // wir nutzen custom Tooltip
        external: function (context) {
          let tooltipEl = document.getElementById("chartjs-tooltip");
          if (!tooltipEl) {
            tooltipEl = document.createElement("div");
            tooltipEl.id = "chartjs-tooltip";
            Object.assign(tooltipEl.style, {
              background: "#1f1f1f",
              color: "#ccc",
              border: "1px solid #555",
              padding: "8px 12px",
              fontSize: "12px",
              position: "absolute",
              pointerEvents: "none",
              borderRadius: "4px",
              transition: "all 0.1s ease",
              transform: "translate(-50%, 0)",
              whiteSpace: "nowrap",
              zIndex: "1000",
            });
            document.body.appendChild(tooltipEl);
          }

          const tooltipModel = context.tooltip;
          const chartCanvas = context.chart.canvas;
          const chartRect = chartCanvas.getBoundingClientRect();

          if (tooltipModel.opacity === 0) {
            tooltipEl.style.opacity = "0";
            return;
          }

          if (!tooltipModel.dataPoints || tooltipModel.dataPoints.length === 0) {
            tooltipEl.style.opacity = "0";
            return;
          }

          const dataPoint = tooltipModel.dataPoints[0];
          let dateStr = dataPoint.label;
          try {
            const parsedDate = typeof dateStr === "string" ? parseISO(dateStr) : dateStr;
            dateStr = format(parsedDate, "dd.MM.yyyy", { locale: deLocale });
          } catch(err) {
            console.log(err);
          }

          const value = dataPoint.formattedValue || dataPoint.raw;
          tooltipEl.innerHTML = `<div style="color:#fff; margin-bottom:4px">Datum: ${dateStr}</div><div>Drawdown: ${parseFloat(value).toFixed(2)} €</div>`;

          let left = chartRect.left + window.pageXOffset + tooltipModel.caretX;
          let top = chartRect.top + window.pageYOffset + tooltipModel.caretY - tooltipEl.offsetHeight - 8;

          const tooltipWidth = tooltipEl.offsetWidth;
          const canvasWidth = chartRect.width;

          if (left - tooltipWidth / 2 < chartRect.left + window.pageXOffset) {
            left = chartRect.left + window.pageXOffset + tooltipWidth / 2;
          }
          if (left + tooltipWidth / 2 > chartRect.left + window.pageXOffset + canvasWidth) {
            left = chartRect.left + window.pageXOffset + canvasWidth - tooltipWidth / 2;
          }
          if (top < chartRect.top + window.pageYOffset) {
            top = chartRect.top + window.pageYOffset + tooltipModel.caretY + 12;
          }

          tooltipEl.style.left = `${left}px`;
          tooltipEl.style.top = `${top}px`;
          tooltipEl.style.opacity = "1";
        },
      },
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        type: "time",
        time: {
          unit: "day",
          tooltipFormat: "dd.MM.yyyy",
        },
        ticks: {
          color: "#fff",
          maxRotation: 0,
          maxTicksLimit: 6,
        },
        grid: {
          color: "#2a2a2a",
        },
        adapters: {
          date: {
            locale: deLocale,
          },
        },
      },
      y: {
        ticks: {
          color: "#fff",
          callback: (value) => `${value} €`,
          maxTicksLimit: 5,
        },
        grid: {
          color: "#2a2a2a",
        },
      },
    },
  };

  return (
    <div
      style={{
        width: "100%",
        minHeight: 220,
        position: "relative",
        fontFamily: "Arial, sans-serif",
        color: "#fff",
      }}
    >
      <h3 style={{ marginBottom: 10, fontWeight: "bold" }}>Drawdown</h3>
      <div style={{ height: "calc(100% - 40px)" }}>
        <Line ref={chartRef} data={data} options={options} />
      </div>
    </div>
  );
}
