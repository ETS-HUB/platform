import { Table, Tag, Switch } from "antd";
import { Pencil, Trash2, Users } from "lucide-react";
import type { AdminAssignmentListItem } from "@/apis/admin/assignments/types";

export function AssignmentsTable({
  assignments,
  loading,
  onEdit,
  onDelete,
  onTogglePublish,
}: {
  assignments: AdminAssignmentListItem[];
  loading?: boolean;
  onEdit: (a: AdminAssignmentListItem) => void;
  onDelete: (a: AdminAssignmentListItem) => void;
  onTogglePublish: (a: AdminAssignmentListItem) => void;
}) {
  const columns = [
    {
      title: "Title",
      key: "title",
      render: (_: unknown, a: AdminAssignmentListItem) => (
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-900">
              {a.title}
            </span>
            <Tag
              color={a.type === "PROJECT" ? "magenta" : "blue"}
              bordered={false}
              style={{ fontSize: 11 }}
            >
              {a.type}
            </Tag>
          </div>
          <span className="text-sm text-gray-400">
            {a.topic.parent ? `${a.topic.parent.name} › ` : ""}
            {a.topic.name}
            {a.lesson ? ` · Lesson ${a.lesson.order}: ${a.lesson.title}` : ""}
          </span>
        </div>
      ),
    },
    {
      title: "Points",
      dataIndex: "points",
      key: "points",
      width: 80,
      render: (p: number) => <span className="text-sm text-gray-700">{p}</span>,
    },
    {
      title: "Due",
      dataIndex: "dueDate",
      key: "dueDate",
      width: 110,
      render: (d: string | null) =>
        d ? (
          <span className="text-sm text-gray-500">
            {new Date(d).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              year: "2-digit",
            })}
          </span>
        ) : (
          <span className="text-gray-300">—</span>
        ),
    },
    {
      title: "Submissions",
      key: "submissions",
      width: 110,
      render: (_: unknown, a: AdminAssignmentListItem) => (
        <span className="flex items-center gap-1 text-sm text-gray-500">
          <Users size={12} />
          {a._count.submissions}
        </span>
      ),
    },
    {
      title: "Requires",
      key: "requires",
      render: (_: unknown, a: AdminAssignmentListItem) => (
        <span className="text-sm text-gray-400">
          {[
            a.requiresLink && "Link",
            a.requiresFile && "File",
            a.requiresText && "Text",
          ]
            .filter(Boolean)
            .join(", ")}
        </span>
      ),
    },
    {
      title: "Created by",
      key: "createdBy",
      width: 130,
      render: (_: unknown, a: AdminAssignmentListItem) => (
        <span className="text-sm text-gray-500">
          {a.createdBy.firstName} {a.createdBy.lastName}
        </span>
      ),
    },
    {
      title: "Published",
      key: "isPublished",
      width: 90,
      render: (_: unknown, a: AdminAssignmentListItem) => (
        <Switch
          size="small"
          checked={a.isPublished}
          onChange={() => onTogglePublish(a)}
        />
      ),
    },
    {
      title: "",
      key: "actions",
      width: 72,
      render: (_: unknown, a: AdminAssignmentListItem) => (
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onEdit(a)}
            className="p-1.5 rounded-full hover:bg-gray-100"
          >
            <Pencil size={15} style={{ color: "#6B7280" }} />
          </button>
          <button
            type="button"
            onClick={() => onDelete(a)}
            className="p-1.5 rounded-full hover:bg-red-50"
          >
            <Trash2 size={15} style={{ color: "#DC2626" }} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <Table
      dataSource={assignments}
      columns={columns}
      rowKey="id"
      loading={loading}
      pagination={false}
      locale={{ emptyText: "No assignments match the current filters." }}
    />
  );
}
