import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

const calculateLongShort = (trades) => {
  if (!trades || trades.length === 0) {
    return [
      { name: "Long", count: 0, percentage: 0 },
      { name: "Short", count: 0, percentage: 0 },
    ];
  }
  const longCount = trades.filter((t) => t.type === "long").length;
  const shortCount = trades.length - longCount;
  const longPercentage = Math.round((longCount / trades.length) * 100);
  const shortPercentage = 100 - longPercentage;

  return [
    { name: "Long", count: longCount, percentage: longPercentage },
    { name: "Short", count: shortCount, percentage: shortPercentage },
  ];
};

export const DirectionChart = ({ trades }) => {
  const chartData = calculateLongShort(trades);
  const COLORS = ["#dbaf58", "#8c6c3f"];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        padding: "0.5rem",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          marginBottom: "0.5rem",
          fontSize: "1.5rem",
        }}
      >
        Long/Short-Anteil
      </h2>
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "150px",
          backgroundColor: "transparent",
          borderRadius: "8px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -10, bottom: 10 }}
          >
            <XAxis
              dataKey="name"
              stroke="#dbaf58"
              tick={{ fill: "#dbaf58", fontSize: "0.8rem" }}
            />
            <YAxis
              stroke="#dbaf58"
              tick={{ fill: "#dbaf58", fontSize: "0.8rem" }}
              label={{
                value: "Anzahl",
                angle: -90,
                position: "insideLeft",
                fill: "#dbaf58",
                fontSize: "0.8rem",
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0b1825",
                borderColor: "#f0f0f0",
                fontSize: "0.8rem",
              }}
              itemStyle={{ color: "#dbaf58", fontWeight: "bold" }}
              formatter={(value, name, props) => [
                `${value} (${props.payload.percentage}%)`,
                "Anzahl",
              ]}
            />
            <Bar dataKey="count" radius={[6, 6, 0, 0]} barSize={80}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
