"use client";
import toast from "react-hot-toast";
import {
  FileText,
  Video,
  Code2,
  Link2,
  Pencil,
  Trash2,
  GripVertical,
} from "lucide-react";
import { Modal, message } from "antd";
import { useAdminModal } from "@/hooks/useAdminModal";

import type { AdminContentBlock } from "@/apis/admin/lessons/types";

const TYPE_META: Record<
  AdminContentBlock["type"],
  { icon: typeof FileText; color: string }
> = {
  TEXT: { icon: FileText, color: "#3A0CA3" },
  VIDEO: { icon: Video, color: "#F52593" },
  CODE: { icon: Code2, color: "#059669" },
  RESOURCE_LINK: { icon: Link2, color: "#D97706" },
};

export function ContentBlockList({
  blocks,
  onEdit,
  onDelete,
  onReorder,
}: {
  blocks: AdminContentBlock[];
  onEdit: (block: AdminContentBlock) => void;
  onDelete: (block: AdminContentBlock) => Promise<void>;
  onReorder: (fromIndex: number, toIndex: number) => void;
}) {
  const modal = useAdminModal();
  const sorted = [...blocks].sort((a, b) => a.order - b.order);

  const handleDelete = (block: AdminContentBlock) => {
    modal.confirm({
      title: `Delete "${block.title}"?`,
      content: "This removes the block and any questions attached to it.",
      okText: "Delete",
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await onDelete(block);
          toast.success("Block deleted");
        } catch {
          toast.error("Failed to delete block");
        }
      },
    });
  };

  if (sorted.length === 0) {
    return (
      <p className="text-sm sm:text-base text-[#9CA3AF] py-4 text-center">
        No content blocks yet — add one below.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {sorted.map((block, i) => {
        const meta = TYPE_META[block.type];
        const Icon = meta.icon;
        return (
          <div
            key={block.id ?? `local-${i}`}
            className="flex items-center gap-3 px-4 py-3 rounded-xl"
            style={{ background: "#FFFFFF", border: "1.5px solid #EDE0FB" }}
          >
            <GripVertical
              size={16}
              style={{ color: "#D1D5DB" }}
              className="cursor-grab shrink-0"
            />
            <div
              className="flex items-center justify-center rounded-full w-8 h-8 shrink-0"
              style={{ background: `${meta.color}15` }}
            >
              <Icon size={16} style={{ color: meta.color }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-base font-semibold truncate text-[#0e1430]">
                {block.title}
              </p>
              <p className="text-sm text-[#9CA3AF]">
                {block.type} · {!block.id && "not yet saved"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onEdit(block)}
              className="p-1.5 rounded-full hover:bg-gray-100"
            >
              <Pencil size={18} style={{ color: "#6B7280" }} />
            </button>
            <button
              type="button"
              onClick={() => handleDelete(block)}
              className="p-1.5 rounded-full hover:bg-red-50"
            >
              <Trash2 size={18} style={{ color: "#DC2626" }} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
