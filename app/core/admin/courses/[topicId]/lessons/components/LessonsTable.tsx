"use client";
import { Table, Tag, Switch } from "antd";
import { Pencil, Trash2, FileText } from "lucide-react";
import type { AdminLessonListItem } from "@/apis/admin/lessons/types";

export function LessonsTable({
  lessons,
  onEdit,
  onDelete,
  onTogglePublish,
}: {
  lessons: AdminLessonListItem[];
  onEdit: (lesson: AdminLessonListItem) => void;
  onDelete: (lesson: AdminLessonListItem) => Promise<void>;
  onTogglePublish: (lesson: AdminLessonListItem) => Promise<void>;
}) {
  const columns = [
    {
      title: "Order",
      dataIndex: "order",
      key: "order",
      width: 70,
      sorter: (a: AdminLessonListItem, b: AdminLessonListItem) =>
        a.order - b.order,
    },
    {
      title: "Title",
      key: "title",
      render: (_: unknown, l: AdminLessonListItem) => (
        <div className="flex items-center gap-2">
          <span className="text-base font-semibold text-[#0e1430]">
            {l.title}
          </span>
          {l.isProject && (
            <Tag color="magenta" bordered={false} style={{ fontSize: 14 }}>
              Project
            </Tag>
          )}
        </div>
      ),
    },
    {
      title: "Content",
      key: "content",
      render: (_: unknown, l: AdminLessonListItem) => (
        <span className="text-base" style={{ color: "#6B7280" }}>
          {l._count.contentBlocks} block
          {l._count.contentBlocks === 1 ? "" : "s"} · {l._count.questions}{" "}
          question{l._count.questions === 1 ? "" : "s"}
        </span>
      ),
    },
    {
      title: "Duration",
      dataIndex: "duration",
      key: "duration",
      render: (d: number) => (
        <span className="text-sm text-[#6B7280]">{d} min</span>
      ),
    },
    {
      title: "Published",
      key: "isPublished",
      render: (_: unknown, l: AdminLessonListItem) => (
        <Switch
          checked={l.isPublished}
          onChange={() => onTogglePublish(l)}
        />
      ),
    },
    {
      title: "",
      key: "actions",
      width: 90,
      render: (_: unknown, l: AdminLessonListItem) => (
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onEdit(l)}
            className="p-1.5 cursor-pointer rounded-full hover:bg-gray-100"
          >
            <Pencil size={16} style={{ color: "#6B7280" }} />
          </button>
          <button
            type="button"
            onClick={() => onDelete(l)}
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
      dataSource={lessons}
      columns={columns}
      rowKey="id"
      pagination={false}
    />
  );
}
