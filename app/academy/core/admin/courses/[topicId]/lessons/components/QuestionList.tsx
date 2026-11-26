"use client";
import toast from "react-hot-toast";
import { Pencil, Trash2, CheckCircle2 } from "lucide-react";
import { Tag } from "antd";
import { useAdminModal } from "@/hooks/useAdminModal";

import type { AdminLessonQuestion } from "@/apis/admin/lessons/types";

const DIFFICULTY_COLOR: Record<string, string> = {
  EASY: "green",
  MEDIUM: "orange",
  HARD: "red",
};

export function QuestionList({
  questions,
  onEdit,
  onDelete,
}: {
  questions: AdminLessonQuestion[];
  onEdit: (q: AdminLessonQuestion) => void;
  onDelete: (q: AdminLessonQuestion) => Promise<void>;
}) {
  const modal = useAdminModal();
  const sorted = [...questions].sort((a, b) => a.order - b.order);

  const handleDelete = (q: AdminLessonQuestion) => {
    modal.confirm({
      title: "Delete this question?",
      content: "This can't be undone.",
      okText: "Delete",
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await onDelete(q);
          toast.success("Question deleted");
        } catch {
          toast.error("Failed to delete question");
        }
      },
    });
  };

  if (sorted.length === 0) {
    return (
      <p className="text-sm sm:text-base text-[#9CA3AF] py-4 text-center">
        No questions yet — add one below.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {sorted.map((q, i) => {
        const correctOption = q.options.find((o) => o.isCorrect);
        return (
          <div
            key={q.id ?? `local-${i}`}
            className="rounded-xl p-4 bg-white border border-[#EDE0FB]"
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <p className="text-base font-medium flex-1 text-[#0e1430]">
                {q.text}
              </p>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => onEdit(q)}
                  className="p-1.5 rounded-full hover:bg-gray-100"
                >
                  <Pencil size={16} style={{ color: "#6B7280" }} />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(q)}
                  className="p-1.5 rounded-full hover:bg-red-50"
                >
                  <Trash2 size={16} style={{ color: "#DC2626" }} />
                </button>
              </div>
            </div>
            <div className="flex items-center gap-4 flex-wrap">
              <Tag
                color={DIFFICULTY_COLOR[q.difficulty]}
                bordered={false}
                style={{ fontSize: 14 }}
              >
                {q.difficulty}
              </Tag>
              <span className="text-base" style={{ color: "#9CA3AF" }}>
                {q.points} pts
              </span>
              {correctOption && (
                <span className="inline-flex items-center gap-1 text-base text-[#16A34A]">
                  <CheckCircle2 size={15} /> {correctOption.text}
                </span>
              )}
              {!q.id && (
                <span className="text-base text-[#D97706]">not yet saved</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
