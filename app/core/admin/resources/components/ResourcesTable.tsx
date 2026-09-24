import { Table, Tag } from "antd";
import { Pencil, Trash2, ExternalLink } from "lucide-react";
import type { AdminResource } from "@/apis/admin/resources/types";
import Link from "next/link";

const TYPE_COLOR: Record<string, string> = {
  TUTORIAL: "purple",
  VIDEO: "magenta",
  DOCUMENTATION: "green",
};
const DIFFICULTY_COLOR: Record<string, string> = {
  EASY: "green",
  MEDIUM: "orange",
  HARD: "red",
};

export function ResourcesTable({
  resources,
  loading,
  pagination,
  onPageChange,
  onEdit,
  onDelete,
}: {
  resources: AdminResource[];
  loading: boolean;
  pagination: { page: number; limit: number; total: number };
  onPageChange: (page: number) => void;
  onEdit: (r: AdminResource) => void;
  onDelete: (r: AdminResource) => void;
}) {
  const columns = [
    {
      title: "Title",
      key: "title",
      render: (_: unknown, r: AdminResource) => (
        <div style={{ opacity: r.isActive ? 1 : 0.5 }}>
          <Link
            href={r.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-base font-semibold hover:underline"
            style={{ color: "#0e1430" }}
          >
            {r.title}
            <ExternalLink size={11} style={{ color: "#C9BEDD" }} />
          </Link>
          <p className="text-sm mt-1 text-gray-500 truncate max-w-70">
            {r.description}
          </p>
        </div>
      ),
    },
    {
      title: "Topic",
      key: "topic",
      width: 120,
      render: (_: unknown, r: AdminResource) => (
        <span className="text-sm" style={{ color: "#6B7280" }}>
          {r.topic.name}
        </span>
      ),
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      width: 110,
      render: (t: string) => (
        <Tag color={TYPE_COLOR[t]} bordered={false} style={{ fontSize: 14 }}>
          {t}
        </Tag>
      ),
    },
    {
      title: "Difficulty",
      dataIndex: "difficulty",
      key: "difficulty",
      width: 100,
      render: (d: string) => (
        <Tag color={DIFFICULTY_COLOR[d]} bordered={false} style={{ fontSize: 14 }}>
          {d}
        </Tag>
      ),
    },
    {
      title: "Style",
      dataIndex: "learningStyle",
      key: "learningStyle",
      width: 90,
      render: (s: string) => (
        <span className="text-sm text-gray-600">
          {s?.charAt(0) + s?.slice(1).toLowerCase().replace("_", "-")}
        </span>
      ),
    },
    {
      title: "",
      key: "actions",
      width: 80,
      render: (_: unknown, r: AdminResource) => (
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onEdit(r)}
            disabled={!r.isActive}
            className="p-1.5 cursor-pointer rounded-full hover:bg-gray-100"
          >
            <Pencil
              size={16}
              style={{ color: r.isActive ? "#6B7280" : "#D1D5DB" }}
            />
          </button>
          {r.isActive && (
            <button
              type="button"
              onClick={() => onDelete(r)}
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
      dataSource={resources}
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
