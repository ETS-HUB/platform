"use client";
import toast from "react-hot-toast";

import { useState } from "react";
import { Button, Modal, message } from "antd";import { useAdminModal } from "@/hooks/useAdminModal";

import { Plus } from "lucide-react";
import { CoursesTable } from "./components/CoursesTable";
import { CategoryModal } from "./components/CategoryModal";
import { CourseModal } from "./components/CourseModal";
import type {
  CourseNode,
  CreateCategoryPayload,
  CreateCoursePayload,
  UpdateTopicPayload,
} from "@/apis/admin/courses/types";
import {
  useGetTopicsQuery,
  useCreateTopicMutation,
  useUpdateTopicMutation,
  useDeleteTopicMutation,
} from "@/apis/admin/courses/coursesService";
import { useRouter } from "next/navigation";
import Header from "@/components/ui/Header";
import { getApiError } from "@/lib/apiError";

export default function AdminCoursesPage() {
  const modal = useAdminModal();
  const router = useRouter();
  const { data: categories = [], isLoading } = useGetTopicsQuery();
  const [createTopic] = useCreateTopicMutation();
  const [updateTopic] = useUpdateTopicMutation();
  const [deleteTopic] = useDeleteTopicMutation();

  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CourseNode | null>(
    null,
  );
  const [courseModalOpen, setCourseModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<CourseNode | null>(null);
  const [courseDefaultParentId, setCourseDefaultParentId] = useState<
    string | undefined
  >();

  const handleCreateCategory = async (payload: CreateCategoryPayload) => {
    try {
      await createTopic(payload).unwrap();
      toast.success("Category created");
    } catch (err) {
      toast.error(getApiError(err, "Failed to create category"));
    }
  };

  const handleCreateCourse = async (payload: CreateCoursePayload) => {
    try {
      await createTopic(payload).unwrap();
      toast.success("Course created");
    } catch (err) {
      toast.error(getApiError(err, "Failed to create course"));
    }
  };

  const handleUpdateTopic = async (id: string, payload: UpdateTopicPayload) => {
    try {
      await updateTopic({ id, payload }).unwrap();
      toast.success("Saved");
    } catch (err) {
      toast.error(getApiError(err, "Failed to update"));
    }
  };

  const handleDelete = async (id: string) => {
    modal.confirm({
      title: "Delete this topic?",
      content: "This will remove the category or course and all its contents.",
      okText: "Delete",
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await deleteTopic(id).unwrap();
          toast.success("Deleted");
        } catch (err) {
          toast.error(getApiError(err, "Failed to delete"));
        }
      },
    });
  };

  const openAddCourse = (parentId: string) => {
    setEditingCourse(null);
    setCourseDefaultParentId(parentId);
    setCourseModalOpen(true);
  };

  return (
    <div className="min-h-screen w-full">
      <div className="flex items-start justify-between mb-6">
        <Header
          title="Courses"
          subtitle="Organize categories and the courses within them."
        />
        <Button
          icon={<Plus size={14} />}
          onClick={() => {
            setEditingCategory(null);
            setCategoryModalOpen(true);
          }}
          style={{ background: "#3A0CA3", color: "#FFFFFF" }}
        >
          New category
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <span className="text-[14px]" style={{ color: "#9CA3AF" }}>
            Loading...
          </span>
        </div>
      ) : categories.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-[14px] mb-4" style={{ color: "#9CA3AF" }}>
            No categories yet.
          </p>
          <Button
            icon={<Plus size={14} />}
            onClick={() => setCategoryModalOpen(true)}
            style={{ background: "#3A0CA3", color: "#FFFFFF" }}
          >
            New category
          </Button>
        </div>
      ) : (
        <CoursesTable
          categories={categories}
          onEditCategory={(c) => {
            setEditingCategory(c);
            setCategoryModalOpen(true);
          }}
          onEditCourse={(c) => {
            setEditingCourse(c);
            setCourseModalOpen(true);
          }}
          onEditCourseLessons={(c) =>
            router.push(`/core/admin/courses/${c.id}/lessons`)
          }
          onAddCourse={openAddCourse}
          onDelete={handleDelete}
        />
      )}

      <CategoryModal
        category={editingCategory}
        open={categoryModalOpen}
        onClose={() => setCategoryModalOpen(false)}
        onCreate={handleCreateCategory}
        onUpdate={handleUpdateTopic}
      />
      <CourseModal
        course={editingCourse}
        parentOptions={categories.map((c) => ({ id: c.id, name: c.name }))}
        defaultParentId={courseDefaultParentId}
        open={courseModalOpen}
        onClose={() => setCourseModalOpen(false)}
        onCreate={handleCreateCourse}
        onUpdate={handleUpdateTopic}
      />
    </div>
  );
}
