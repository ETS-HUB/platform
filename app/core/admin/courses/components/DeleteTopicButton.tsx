"use client";
import toast from "react-hot-toast";
import { Modal, message } from "antd";
import { useAdminModal } from "@/hooks/useAdminModal";

import { Trash2 } from "lucide-react";
import type { CourseNode } from "@/apis/admin/courses/types";

export function DeleteTopicButton({
  node,
  isCategory,
  onDelete,
}: {
  node: CourseNode;
  isCategory: boolean;
  onDelete: (id: string) => Promise<void>;
}) {
  const modal = useAdminModal();
  const hasChildren = isCategory && (node.children?.length ?? 0) > 0;
  const hasQuestions = node._count.questions > 0;

  const handleClick = () => {
    modal.confirm({
      title: isCategory ? "Delete this category?" : "Delete this course?",
      content: hasChildren
        ? `"${node.name}" has ${node.children!.length} course(s) inside it. Deleting it may affect those too — check with your API's cascade behavior before confirming.`
        : hasQuestions
          ? `"${node.name}" has ${node._count.questions} question(s) attached. Deleting it will remove student access to this content.`
          : `This can't be undone.`,
      okText: "Delete",
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await onDelete(node.id);
          toast.success(isCategory ? "Category deleted" : "Course deleted");
        } catch {
          toast.error("Failed to delete — it may have dependent content");
        }
      },
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="p-1.5 rounded-full hover:bg-red-50"
    >
      <Trash2 size={16} style={{ color: "#DC2626" }} />
    </button>
  );
}
