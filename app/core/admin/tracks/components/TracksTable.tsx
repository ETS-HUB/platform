import { Table, Tag, Switch } from "antd";
import { Pencil, Trash2 } from "lucide-react";
import type { Track } from "@/apis/admin/tracks/types";

export function TracksTable({
  tracks,
  onEdit,
  onToggleActive,
  onDelete,
}: {
  tracks: Track[];
  onEdit: (t: Track) => void;
  onToggleActive: (t: Track) => void;
  onDelete: (t: Track) => void;
}) {
  const columns = [
    {
      title: "Track",
      key: "track",
      render: (_: unknown, t: Track) => (
        <div className="flex items-center gap-2.5">
          {t.imageUrl ? (
            <img
              src={t.imageUrl}
              alt={t.name}
              className="w-8 h-8 rounded-lg object-contain"
            />
          ) : (
            <span className="text-[18px]">🗂️</span>
          )}
          <div>
            <p className="text-base text-gray-700 font-semibold">{t.name}</p>
            <p className="text-sm text-[#9CA3AF] font-mono">{t.slug}</p>
          </div>
        </div>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (d: string) => (
        <span className="text-sm" style={{ color: d ? "#6B7280" : "#C4C4C4" }}>
          {d || "—"}
        </span>
      ),
    },
    {
      title: "Active",
      key: "isActive",
      width: 90,
      render: (_: unknown, t: Track) => (
        <Switch checked={t.isActive} onChange={() => onToggleActive(t)} />
      ),
    },
    {
      title: "",
      key: "actions",
      width: 80,
      render: (_: unknown, t: Track) => (
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onEdit(t)}
            className="p-1.5 cursor-pointer rounded-full hover:bg-gray-100"
          >
            <Pencil size={16} style={{ color: "#6B7280" }} />
          </button>
          <button
            type="button"
            onClick={() => onDelete(t)}
            className="p-1.5 cursor-pointer rounded-full hover:bg-red-50"
            title="Delete track permanently"
          >
            <Trash2 size={16} style={{ color: "#DC2626" }} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <Table
      dataSource={tracks}
      columns={columns}
      rowKey="id"
      pagination={false}
    />
  );
}
