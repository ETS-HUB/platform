import { Table, Tag } from "antd";
import { Pencil, Trash2 } from "lucide-react";
import type { AssessmentConfig } from "@/apis/admin/configs/types";

const TRACK_LABELS: Record<string, string> = {
  frontend: "Frontend",
  backend: "Backend",
  fullstack: "Full Stack",
};

export function ConfigsTable({
  configs,
  onEdit,
  onDelete,
}: {
  configs: AssessmentConfig[];
  onEdit: (c: AssessmentConfig) => void;
  onDelete: (c: AssessmentConfig) => void;
}) {
  const columns = [
    {
      title: "Name",
      key: "name",
      render: (_: unknown, c: AssessmentConfig) => (
        <div>
          <div className="flex items-center gap-2">
            <span className="text-base text-[#0e1430] font-semibold">
              {c.name}
            </span>
            {c.isBoothMode && (
              <Tag color="gold" bordered={false} style={{ fontSize: 14 }}>
                Booth
              </Tag>
            )}
          </div>
          {c.description && (
            <p className="text-base text-[#9CA3AF]">{c.description}</p>
          )}
        </div>
      ),
    },
    {
      title: "Track",
      dataIndex: "track",
      key: "track",
      render: (t: string) => (
        <Tag color="purple" bordered={false} style={{ fontSize: 14 }}>
          {TRACK_LABELS[t] ?? t}
        </Tag>
      ),
    },
    {
      title: "Selection",
      key: "selection",
      render: (_: unknown, c: AssessmentConfig) => {
        if (c.topicDistribution) {
          const topicCount = Object.keys(c.topicDistribution).length;
          return (
            <span className="text-base" style={{ color: "#374151" }}>
              By topic ({topicCount} topics)
            </span>
          );
        }
        if (c.difficultyDistribution) {
          return (
            <span className="text-base" style={{ color: "#374151" }}>
              By difficulty
            </span>
          );
        }
        return (
          <span className="text-base" style={{ color: "#374151" }}>
            Random{c.difficulty ? ` (${c.difficulty.toLowerCase()})` : ""}
          </span>
        );
      },
    },
    {
      title: "Questions",
      dataIndex: "totalQuestions",
      key: "totalQuestions",
      width: 90,
      render: (n: number) => (
        <span className="text-sm" style={{ color: "#6B7280" }}>
          {n}
        </span>
      ),
    },
    {
      title: "Time",
      dataIndex: "timeLimitMinutes",
      key: "timeLimitMinutes",
      width: 80,
      render: (n: number) => (
        <span className="text-sm" style={{ color: "#6B7280" }}>
          {n} min
        </span>
      ),
    },
    {
      title: "",
      key: "actions",
      width: 80,
      render: (_: unknown, c: AssessmentConfig) => (
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onEdit(c)}
            className="p-1.5 cursor-pointer rounded-full hover:bg-gray-100"
          >
            <Pencil size={16} style={{ color: "#6B7280" }} />
          </button>
          <button
            type="button"
            onClick={() => onDelete(c)}
            className="p-1.5 cursor-pointer rounded-full hover:bg-red-50"
          >
            <Trash2 size={16} style={{ color: "#DC2626" }} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <Table
      dataSource={configs}
      columns={columns}
      rowKey="id"
      pagination={false}
    />
  );
}
