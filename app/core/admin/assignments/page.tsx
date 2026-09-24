"use client";
import toast from "react-hot-toast";

import { useState } from "react";
import { Tabs, Button, Select, Pagination } from "antd";
import { useAdminModal } from "@/hooks/useAdminModal";
import { Plus } from "lucide-react";

import { AssignmentsTable } from "./components/AssignmentsTable";
import { AssignmentFormModal } from "./components/AssignmentFormModal";
import { GradingQueue } from "./components/GradingQueue";
import type {
  AdminAssignment,
  AdminAssignmentListItem,
  AssignmentType,
  CreateAssignmentPayload,
  ReviewPayload,
} from "@/apis/admin/assignments/types";
import {
  useGetAdminAssignmentsQuery,
  useCreateAdminAssignmentMutation,
  useUpdateAdminAssignmentMutation,
  useDeleteAdminAssignmentMutation,
  useGetTopicSubmissionsQuery,
  useReviewSubmissionMutation,
} from "@/apis/admin/assignments/adminAssignmentsService";
import { useGetTopicsQuery } from "@/apis/admin/courses/coursesService";
import { useGetAdminLessonsQuery } from "@/apis/admin/lessons/lessonsService";
import type { CourseNode } from "@/apis/admin/courses/types";
import type { AdminLessonListItem } from "@/apis/admin/lessons/types";
import Header from "@/components/ui/Header";
import { getApiError } from "@/lib/apiError";

const PAGE_SIZE = 20;

export default function AdminAssignmentsPage() {
  const modal = useAdminModal();

  // ── Filters ──────────────────────────────────────────────────────────────
  const [topicFilter, setTopicFilter] = useState<string | undefined>();
  const [typeFilter, setTypeFilter] = useState<AssignmentType | undefined>();
  const [publishedFilter, setPublishedFilter] = useState<boolean | undefined>();
  const [page, setPage] = useState(1);

  // ── Form modal state ──────────────────────────────────────────────────────
  const [formOpen, setFormOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] =
    useState<AdminAssignmentListItem | null>(null);

  // ── Queries ───────────────────────────────────────────────────────────────
  const { data: assignmentsData, isLoading: loadingAssignments } =
    useGetAdminAssignmentsQuery({
      topicId: topicFilter,
      type: typeFilter,
      isPublished: publishedFilter,
      page,
      limit: PAGE_SIZE,
    });

  // Topics for filter dropdown (flat list of courses from the hierarchy)
  const { data: topicsData = [] } = useGetTopicsQuery();
  const allTopics = topicsData.flatMap((cat: CourseNode) =>
    (cat.children ?? []).map((c: CourseNode) => ({
      id: c.id,
      name: c.name,
      parentName: cat.name,
    })),
  );

  // Lessons for the form modal — only fetched when a topic is selected
  const { data: lessonsRaw = [] } = useGetAdminLessonsQuery(
    { topicId: topicFilter ?? "" },
    { skip: !topicFilter },
  );
  const lessons = lessonsRaw.map((l: AdminLessonListItem) => ({
    id: l.id,
    title: l.title,
  }));

  // Submissions for grading tab — scoped to selected topic
  const { data: submissions = [] } = useGetTopicSubmissionsQuery(
    { topicId: topicFilter ?? "" },
    { skip: !topicFilter },
  );

  // ── Mutations ─────────────────────────────────────────────────────────────
  const [createAssignment] = useCreateAdminAssignmentMutation();
  const [updateAssignment] = useUpdateAdminAssignmentMutation();
  const [deleteAssignment] = useDeleteAdminAssignmentMutation();
  const [reviewSubmission] = useReviewSubmissionMutation();

  const assignments = assignmentsData?.assignments ?? [];
  const pagination = assignmentsData?.pagination;

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleSaveAssignment = async (
    id: string | null,
    payload: CreateAssignmentPayload,
  ) => {
    try {
      if (id) {
        await updateAssignment({ id, payload }).unwrap();
        toast.success("Assignment updated");
      } else {
        await createAssignment(payload).unwrap();
        toast.success("Assignment created");
      }
    } catch (err) {
      toast.error(getApiError(err, "Failed to save assignment"));
    }
  };

  const handleTogglePublish = async (a: AdminAssignmentListItem) => {
    try {
      await updateAssignment({
        id: a.id,
        payload: { isPublished: !a.isPublished },
      }).unwrap();
      toast.success(a.isPublished ? "Unpublished" : "Published");
    } catch (err) {
      toast.error(getApiError(err, "Failed to update"));
    }
  };

  const handleDelete = (a: AdminAssignmentListItem) => {
    modal.confirm({
      title: `Delete "${a.title}"?`,
      content: "Existing student submissions will also be affected.",
      okText: "Delete",
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await deleteAssignment(a.id).unwrap();
          toast.success("Assignment deleted");
        } catch (err) {
          toast.error(getApiError(err, "Failed to delete assignment"));
        }
      },
    });
  };

  const handleReview = async (submissionId: string, payload: ReviewPayload) => {
    try {
      await reviewSubmission({ submissionId, payload }).unwrap();
      toast.success("Review submitted");
    } catch (err) {
      toast.error(getApiError(err, "Failed to submit review"));
    }
  };

  const resetFilters = () => {
    setTopicFilter(undefined);
    setTypeFilter(undefined);
    setPublishedFilter(undefined);
    setPage(1);
  };

  const pendingCount = submissions.filter(
    (s) => s.status === "SUBMITTED",
  ).length;

  // Build AdminAssignment-compatible stub for the form modal (needs topicId flat)
  const editingForForm: AdminAssignment | null = editingAssignment
    ? {
        id: editingAssignment.id,
        topicId: editingAssignment.topic.id,
        lessonId: editingAssignment.lesson?.id ?? null,
        createdById: editingAssignment.createdBy.id,
        title: editingAssignment.title,
        description: editingAssignment.description,
        type: editingAssignment.type,
        dueDate: editingAssignment.dueDate,
        points: editingAssignment.points,
        requiresLink: editingAssignment.requiresLink,
        requiresFile: editingAssignment.requiresFile,
        requiresText: editingAssignment.requiresText,
        isPublished: editingAssignment.isPublished,
        createdAt: editingAssignment.createdAt,
        updatedAt: editingAssignment.createdAt,
      }
    : null;

  return (
    <div className="min-h-screen w-full">
      <div className="flex items-start justify-between mb-6">
        <Header
          title="Assignments"
          subtitle={
            pagination
              ? `${pagination.total} assignment${pagination.total === 1 ? "" : "s"} total`
              : "Manage exercises and projects, and review student submissions."
          }
        />
        <Button
          icon={<Plus size={16} />}
          onClick={() => {
            setEditingAssignment(null);
            setFormOpen(true);
          }}
          style={{ background: "#3A0CA3", color: "#FFFFFF" }}
        >
          New assignment
        </Button>
      </div>

      <Tabs
        items={[
          {
            key: "assignments",
            label: "Assignments",
            children: (
              <>
                {/* Filters */}
                <div className="flex items-center gap-2 mb-4 flex-wrap">
                  <Select
                    allowClear
                    showSearch
                    placeholder="All topics"
                    style={{ width: 220 }}
                    size="large"
                    value={topicFilter}
                    onChange={(v) => {
                      setTopicFilter(v);
                      setPage(1);
                    }}
                    filterOption={(input, opt) =>
                      ((opt?.label as string) ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    options={allTopics.map((t) => ({
                      label: `${t.parentName} › ${t.name}`,
                      value: t.id,
                    }))}
                  />
                  <Select
                    allowClear
                    placeholder="All types"
                    style={{ width: 140 }}
                    size="large"
                    value={typeFilter}
                    onChange={(v) => {
                      setTypeFilter(v);
                      setPage(1);
                    }}
                    options={[
                      { label: "Exercise", value: "EXERCISE" },
                      { label: "Project", value: "PROJECT" },
                    ]}
                  />
                  <Select
                    allowClear
                    placeholder="All statuses"
                    style={{ width: 160 }}
                    size="large"
                    value={
                      publishedFilter === undefined
                        ? undefined
                        : String(publishedFilter)
                    }
                    onChange={(v) => {
                      setPublishedFilter(
                        v === undefined ? undefined : v === "true",
                      );
                      setPage(1);
                    }}
                    options={[
                      { label: "Published", value: "true" },
                      { label: "Unpublished", value: "false" },
                    ]}
                  />
                  {(topicFilter ||
                    typeFilter ||
                    publishedFilter !== undefined) && (
                    <button
                      type="button"
                      onClick={resetFilters}
                      className="text-xs text-gray-400 hover:text-gray-600 underline"
                    >
                      Clear filters
                    </button>
                  )}
                </div>

                <AssignmentsTable
                  assignments={assignments}
                  loading={loadingAssignments}
                  onEdit={(a) => {
                    setEditingAssignment(a);
                    setFormOpen(true);
                  }}
                  onDelete={handleDelete}
                  onTogglePublish={handleTogglePublish}
                />

                {pagination && pagination.totalPages > 1 && (
                  <div className="flex justify-center mt-6">
                    <Pagination
                      current={page}
                      total={pagination.total}
                      pageSize={PAGE_SIZE}
                      onChange={(p) => setPage(p)}
                    />
                  </div>
                )}
              </>
            ),
          },
          {
            key: "grading",
            label: (
              <span>
                Grading
                {pendingCount > 0 && (
                  <span className="ml-1.5 text-xs bg-[#FEF2F2] text-[#DC2626] font-bold px-1.5 py-0.5 rounded-full">
                    {pendingCount}
                  </span>
                )}
              </span>
            ),
            children: (
              <>
                {!topicFilter && (
                  <p className="text-sm text-gray-400 mb-4">
                    Select a topic in the Assignments tab to load submissions.
                  </p>
                )}
                <GradingQueue
                  submissions={submissions}
                  onReview={handleReview}
                />
              </>
            ),
          },
        ]}
      />

      <AssignmentFormModal
        assignment={editingForForm}
        topicId={editingAssignment?.topic.id ?? topicFilter ?? ""}
        lessons={lessons}
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSave={handleSaveAssignment}
      />
    </div>
  );
}
