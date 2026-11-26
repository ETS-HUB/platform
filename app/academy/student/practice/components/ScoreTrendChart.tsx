import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
export function ScoreTrendChart({
  progress,
}: {
  progress: { date: string; percentage: number }[];
}) {
  if (progress.length < 2) {
    return (
      <div
        className="flex items-center justify-center h-[160px] text-[12.5px]"
        style={{ color: "#9CA3AF" }}
      >
        Complete another session to see your trend.
      </div>
    );
  }

  const data = progress.map((p) => ({
    date: new Date(p.date).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    }),
    percentage: p.percentage,
  }));

  return (
    <ResponsiveContainer width="100%" height={160}>
      <LineChart
        data={data}
        margin={{ top: 8, right: 8, left: -20, bottom: 0 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="#F0F0F0"
          vertical={false}
        />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 11, fill: "#9CA3AF" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          domain={[0, 100]}
          tick={{ fontSize: 11, fill: "#9CA3AF" }}
          axisLine={false}
          tickLine={false}
          width={32}
        />
        <Tooltip
          formatter={(value) => [`${value ?? 0}%`, "Score"] as [string, string]}
          contentStyle={{
            borderRadius: 10,
            border: "1px solid #EDE0FB",
            fontSize: 12,
          }}
        />
        <Line
          type="monotone"
          dataKey="percentage"
          stroke="#3A0CA3"
          strokeWidth={2.5}
          dot={{ r: 3, fill: "#3A0CA3" }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
