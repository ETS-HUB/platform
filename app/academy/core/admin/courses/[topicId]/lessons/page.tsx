"use client";
import toast from "react-hot-toast";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button, Select, Modal, message } from "antd";import { useAdminModal } from "@/hooks/useAdminModal";

import { Plus, ArrowLeft } from "lucide-react";
import { LessonsTable } from "./components/LessonsTable";
import type { AdminLessonListItem } from "@/apis/admin/lessons/types";
import {
  useGetAdminLessonsQuery,
  useUpdateLessonMutation,
  useDeleteLessonMutation,
} from "@/apis/admin/lessons/lessonsService";
import Header from "@/components/ui/Header";
import { getApiError } from "@/lib/apiError";

export default function LessonsListPage() {
  const modal = useAdminModal();
  const router = useRouter();
  const params = useParams();
  const topicId = params.topicId as string;
  const [publishFilter, setPublishFilter] = useState<boolean | undefined>(
    undefined,
  );
console.log(topicId)
  const { data: lessons = [], isLoading } = useGetAdminLessonsQuery({
    topicId,
    isPublished: publishFilter,
  });
  const [updateLesson] = useUpdateLessonMutation();
  const [deleteLesson] = useDeleteLessonMutation();

  const courseName = lessons[0]?.topic.name ?? "Course";

  const handleTogglePublish = async (lesson: AdminLessonListItem) => {
    try {
      await updateLesson({
        id: lesson.id,
        payload: { isPublished: !lesson.isPublished },
      }).unwrap();
      toast.success(
        lesson.isPublished ? "Lesson unpublished" : "Lesson published",
      );
    } catch (err) {
      toast.error(getApiError(err, "Failed to update lesson"));
    }
  };

  const handleDelete = async (lesson: AdminLessonListItem) => {
    modal.confirm({
      title: `Delete "${lesson.title}"?`,
      content:
        "This lesson and its content blocks will be permanently removed.",
      okText: "Delete",
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await deleteLesson(lesson.id).unwrap();
          toast.success("Lesson deleted");
        } catch (err) {
          toast.error(getApiError(err, "Failed to delete lesson"));
        }
      },
    });
  };

  return (
    <div className="min-h-screen w-full">
      <button
        type="button"
        onClick={() => router.push("/core/admin/courses")}
        className="flex cursor-pointer hover:scale-105 transition-transform items-center gap-1.5 text-sm font-medium mb-5 text-[#8A8A8A]"
      >
        <ArrowLeft size={14} />
        Back to courses
      </button>
      <div className="flex items-start justify-between mb-6">
        <Header
          title={`${courseName} — Lessons`}
          subtitle={`${lessons.length} lesson${lessons.length === 1 ? "" : "s"}`}
        />
        <Button
          icon={<Plus size={14} />}
          onClick={() =>
            router.push(`/core/admin/courses/${topicId}/lessons/new`)
          }
          style={{ background: "#3A0CA3", color: "#FFFFFF" }}
        >
          New lesson
        </Button>
      </div>
      <div className="mb-4">
        <Select
          allowClear
          placeholder="All lessons"
          style={{ width: 160 }}
          size="large"
          value={publishFilter}
          onChange={setPublishFilter}
          options={[
            { label: "Published", value: true },
            { label: "Draft", value: false },
          ]}
        />
      </div>
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <span className="text-[14px]" style={{ color: "#9CA3AF" }}>
            Loading...
          </span>
        </div>
      ) : lessons.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-[14px] mb-4" style={{ color: "#9CA3AF" }}>
            No lessons yet.
          </p>
          <Button
            icon={<Plus size={14} />}
            onClick={() =>
              router.push(`/core/admin/courses/${topicId}/lessons/new`)
            }
            style={{ background: "#3A0CA3", color: "#FFFFFF" }}
          >
            Create first lesson
          </Button>
        </div>
      ) : (
        <LessonsTable
          lessons={lessons}
          onEdit={(l) =>
            router.push(`/core/admin/courses/${topicId}/lessons/${l.id}`)
          }
          onDelete={handleDelete}
          onTogglePublish={handleTogglePublish}
        />
      )}
    </div>
  );
}
