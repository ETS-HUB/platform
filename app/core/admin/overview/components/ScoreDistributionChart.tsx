import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { ScoreDistribution } from "@/apis/admin/analytics/types";

const BUCKET_ORDER = ["0-20", "21-40", "41-60", "61-80", "81-100"];
const BUCKET_COLORS = ["#DC2626", "#F97316", "#D97706", "#65A30D", "#059669"];

export function ScoreDistributionChart({
  distribution,
}: {
  distribution: ScoreDistribution;
}) {
  const totalScores = Object.values(distribution).reduce(
    (sum, n) => sum + n,
    0,
  );

  const data = BUCKET_ORDER.map((bucket, i) => ({
    bucket,
    count: distribution[bucket] ?? 0,
    color: BUCKET_COLORS[i],
  }));

  if (totalScores === 0) {
    return (
      <div className="flex items-center justify-center h-[200px]">
        <p className="text-[12.5px]" style={{ color: "#9CA3AF" }}>
          No completed assessments yet.
        </p>
      </div>
    );
  }

  return (
    <>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart
          data={data}
          margin={{ top: 8, right: 8, left: -20, bottom: 0 }}
        >
          <XAxis
            dataKey="bucket"
            tick={{ fontSize: 11, fill: "#9CA3AF" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fontSize: 11, fill: "#9CA3AF" }}
            axisLine={false}
            tickLine={false}
            width={28}
          />
          <Tooltip
            formatter={(value) =>
              [
                `${value ?? 0} student${(value ?? 0) === 1 ? "" : "s"}`,
                "Count",
              ] as [string, string]
            }
            contentStyle={{
              borderRadius: 10,
              border: "1px solid #EDE0FB",
              fontSize: 12,
            }}
          />
          <Bar dataKey="count" radius={[6, 6, 0, 0]}>
            {data.map((d) => (
              <Cell key={d.bucket} fill={d.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      {totalScores < 5 && (
        <p className="text-sm text-gray-500 text-center mt-2">
          Based on {totalScores} completed assessment
          {totalScores === 1 ? "" : "s"} — early data.
        </p>
      )}
    </>
  );
}
