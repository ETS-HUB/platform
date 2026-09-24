import { Table, Tag } from "antd";
import { Pencil, Trash2, CheckCircle2 } from "lucide-react";
import { DifficultyTag } from "./DifficultyTag";
import type { AdminQuestion } from "@/apis/admin/questions/types";

export function QuestionsTable({
  questions,
  loading,
  pagination,
  onPageChange,
  onEdit,
  onDelete,
}: {
  questions: AdminQuestion[];
  loading: boolean;
  pagination: { page: number; limit: number; total: number };
  onPageChange: (page: number) => void;
  onEdit: (q: AdminQuestion) => void;
  onDelete: (q: AdminQuestion) => void;
}) {
  const columns = [
    {
      title: "Question",
      key: "text",
      render: (_: unknown, q: AdminQuestion) => (
        <div style={{ opacity: q.isActive ? 1 : 0.5 }}>
          <p className="text-base font-medium" style={{ color: "#0e1430" }}>
            {q.text}
          </p>
          {q.options.find((o) => o.isCorrect) && (
            <p className="text-base text-[#059669] inline-flex items-center gap-1 mt-0.5">
              <CheckCircle2 size={16} />{" "}
              {q.options.find((o) => o.isCorrect)!.text}
            </p>
          )}
        </div>
      ),
    },
    {
      title: "Topic",
      key: "topic",
      width: 130,
      render: (_: unknown, q: AdminQuestion) => (
        <span className="text-sm text-[#6B7280]">{q.topic?.name ?? "—"}</span>
      ),
    },
    {
      title: "Difficulty",
      dataIndex: "difficulty",
      key: "difficulty",
      width: 100,
      render: (d: AdminQuestion["difficulty"]) => (
        <DifficultyTag difficulty={d} />
      ),
    },
    {
      title: "Points",
      dataIndex: "points",
      key: "points",
      width: 80,
      render: (p: number) => (
        <span className="text-sm" style={{ color: "#374151" }}>
          {p}
        </span>
      ),
    },
    {
      title: "Time limit",
      dataIndex: "timeLimit",
      key: "timeLimit",
      width: 120,
      render: (t: number | null) => (
        <span
          className="text-sm"
          style={{ color: t ? "#374151" : "#C4C4C4" }}
        >
          {t ? `${t}s` : "—"}
        </span>
      ),
    },
    {
      title: "Status",
      key: "isActive",
      width: 90,
      render: (_: unknown, q: AdminQuestion) => (
        <Tag style={{ fontSize: "14px" }} color={q.isActive ? "green" : "default"} bordered={false}>
          {q.isActive ? "Active" : "Deleted"}
        </Tag>
      ),
    },
    {
      title: "",
      key: "actions",
      width: 80,
      render: (_: unknown, q: AdminQuestion) => (
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onEdit(q)}
            className="p-1.5 cursor-pointer rounded-full hover:bg-gray-100"
            disabled={!q.isActive}
          >
            <Pencil
              size={16}
              style={{ color: q.isActive ? "#6B7280" : "#D1D5DB" }}
            />
          </button>
          {q.isActive && (
            <button
              type="button"
              onClick={() => onDelete(q)}
              className="p-1.5 cursor-pointer rounded-full hover:bg-red-50"
            >
              <Trash2 size={16} style={{ color: "#DC2626" }} />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <Table
      dataSource={questions}
      columns={columns}
      rowKey="id"
      loading={loading}
      pagination={{
        current: pagination.page,
        pageSize: pagination.limit,
        total: pagination.total,
        onChange: onPageChange,
        showSizeChanger: false,
      }}
    />
  );
}
