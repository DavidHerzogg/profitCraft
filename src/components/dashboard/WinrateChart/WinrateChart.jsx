import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

export const WinrateChart = ({ trades = [] }) => {
  const parseProfit = (profit) => {
    if (typeof profit === "number") return profit;
    if (typeof profit === "string") {
      const normalized = profit.replace("–", "-");
      const cleaned = normalized.replace(/\./g, "").replace(",", ".").replace(/[^\d.-]/g, "");
      const parsed = parseFloat(cleaned);
      return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  };

  const wins = trades.filter((t) => parseProfit(t.profit) > 0).length;
  const losses = trades.length - wins;
  const winrate = trades.length > 0 ? Math.round((wins / trades.length) * 100) : 0;

  const chartData = [
    { name: "Wins", value: wins },
    { name: "Losses", value: losses },
  ];

  const COLORS = ["#dbaf58", "#8c6c3f"];

  return (
    <>
      <h2 style={{ display: "block", justifySelf: "center", paddingTop: "0.6rem" }}>
        Winrate
      </h2>
      <div
        style={{
          width: "100%",
          height: "150px",
          backgroundColor: "transparent",
          borderRadius: "12px",
          color: "#dbaf58",
          position: "relative",
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={35}
              outerRadius={55}
              dataKey="value"
              startAngle={90}
              endAngle={-270}
              stroke="#fff"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#0b1825",
                borderColor: "#f0f0f0",
              }}
              itemStyle={{ color: "#dbaf58", fontWeight: "bold" }}
              formatter={(value, name) => [`${value}`, name]}
            />
          </PieChart>
        </ResponsiveContainer>
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontSize: "1.5rem",
            fontWeight: "bold",
            color: "#dbaf58",
            pointerEvents: "none",
          }}
        >
          {winrate}%
        </div>
      </div>
    </>
  );
};

