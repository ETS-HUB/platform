import { Table, Tag } from "antd";
import type { TopicPerformance, SkillGap } from "@/apis/admin/analytics/types";

const SEVERITY_META: Record<string, { label: string; color: string }> = {
  critical: { label: "Critical", color: "red" },
  high: { label: "Needs attention", color: "volcano" },
  moderate: { label: "Below target", color: "orange" },
};

export function TopicPerformanceTable({
  performance,
  skillGaps,
}: {
  performance: TopicPerformance[];
  skillGaps: SkillGap[];
}) {
  const gapByTopic = new Map(skillGaps.map((g) => [g.topic, g.severity]));

  const columns = [
    {
      title: "Topic",
      dataIndex: "topic",
      key: "topic",
      render: (topic: string) => (
        <span className="text-sm font-semibold text-[#0e1430]">{topic}</span>
      ),
    },
    {
      title: "Average score",
      dataIndex: "averageScore",
      key: "averageScore",
      sorter: (a: TopicPerformance, b: TopicPerformance) =>
        a.averageScore - b.averageScore,
      render: (score: number) => {
        const color =
          score >= 70 ? "#059669" : score >= 40 ? "#D97706" : "#DC2626";
        return (
          <div className="flex items-center gap-2.5 w-40">
            <div className="flex-1 h-1.5 rounded-full bg-gray-200">
              <div
                className="h-full rounded-full"
                style={{ width: `${score}%`, background: color }}
              />
            </div>
            <span className="text-sm font-bold w-10 shrink-0" style={{ color }}>
              {score}%
            </span>
          </div>
        );
      },
    },
    {
      title: "Attempts",
      dataIndex: "totalAttempts",
      key: "totalAttempts",
      render: (n: number) => (
        <span className="text-sm" style={{ color: "#6B7280" }}>
          {n}
        </span>
      ),
    },
    {
      title: "Status",
      key: "status",
      render: (_: unknown, record: TopicPerformance) => {
        const severity = gapByTopic.get(record.topic);
        if (!severity) {
          return (
            <Tag color="green" bordered={false}>
              On track
            </Tag>
          );
        }
        const meta = SEVERITY_META[severity];
        return (
          <Tag color={meta.color} bordered={false}>
            {meta.label}
          </Tag>
        );
      },
    },
  ];

  return (
    <Table
      dataSource={performance}
      columns={columns}
      rowKey="topic"
      pagination={false}
      size="middle"
    />
  );
}
