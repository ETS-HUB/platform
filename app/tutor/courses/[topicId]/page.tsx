"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Tabs, Skeleton } from "antd";
import { ArrowLeft, Users } from "lucide-react";
import toast from "react-hot-toast";

import { CourseStatsBar } from "../components/CourseStatsBar";
import { DraftLessonsBanner } from "../components/DraftLessonsBanner";
import { RosterTab } from "../components/RosterTab";
import { TutorAssignmentCard } from "../components/TutorAssignmentCard";
import { AssignmentFormModal } from "@/app/core/admin/assignments/components/AssignmentFormModal";
import {
  useGetTutorCourseDetailQuery,
  useCreateTutorAssignmentMutation,
  useUpdateTutorAssignmentMutation,
} from "@/apis/tutor/tutorService";
import type { TutorCourseAssignment } from "@/apis/tutor/courses/types";
import type {
  AdminAssignment,
  CreateAssignmentPayload,
} from "@/apis/admin/assignments/types";
import { getApiError } from "@/lib/apiError";

export default function TutorCourseDetailPage() {
  const router = useRouter();
  const params = useParams();
  const topicId = params.topicId as string;

  const { data: detail, isLoading } = useGetTutorCourseDetailQuery(topicId);
  console.log(detail);
  const [createAssignment] = useCreateTutorAssignmentMutation();
  const [updateAssignment] = useUpdateTutorAssignmentMutation();

  const [formOpen, setFormOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] =
    useState<TutorCourseAssignment | null>(null);
  console.log(editingAssignment);
  const handleSave = async (
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
      setFormOpen(false);
    } catch (err) {
      toast.error(getApiError(err, "Failed to save assignment"));
    }
  };

  // Map TutorCourseAssignment → AdminAssignment shape the form modal expects
  const editingForForm: AdminAssignment | null = editingAssignment
    ? {
        id: editingAssignment.id,
        topicId: editingAssignment.topicId,
        lessonId: editingAssignment.lessonId,
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
        updatedAt: editingAssignment.updatedAt,
      }
    : null;

  if (isLoading || !detail) {
    return (
      <div className="min-h-screen w-full">
        <button
          type="button"
          onClick={() => router.push("/tutor/courses")}
          className="flex items-center gap-1.5 text-[13px] font-medium mb-5"
          style={{ color: "#8A8A8A" }}
        >
          <ArrowLeft size={14} />
          Back to my courses
        </button>
        <Skeleton active paragraph={{ rows: 8 }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full">
      <button
        type="button"
        onClick={() => router.push("/tutor/courses")}
        className="flex items-center gap-1.5 text-[13px] font-medium mb-5 text-[#8A8A8A]"
      >
        <ArrowLeft size={14} />
        Back to my courses
      </button>

      <div className="mb-6">
        <p className="text-sm font-medium" style={{ color: "#9CA3AF" }}>
          {detail.course.category}
        </p>
        <h1 className="text-2xl font-bold mb-1" style={{ color: "#0e1430" }}>
          {detail.course.name}
        </h1>
        <p className="text-xl" style={{ color: "#6B7280" }}>
          {detail.course.description}
        </p>

        {detail.tutors.length > 1 && (
          <div className="flex items-center gap-1.5 mt-2 text-base text-[#9CA3AF]">
            <Users size={12} />
            Co-taught with{" "}
            {detail.tutors
              .slice(1)
              .map((t) => `${t.firstName} ${t.lastName}`)
              .join(", ")}
          </div>
        )}
      </div>

      <CourseStatsBar stats={detail.stats} />

      <Tabs
        items={[
          {
            key: "roster",
            label: "Students",
            children: <RosterTab topicId={topicId} />,
          },
          {
            key: "lessons",
            label: `Lessons (${detail.stats.totalLessons})`,
            children: (
              <div>
                <DraftLessonsBanner drafts={detail.draftLessons} />
                <div className="flex flex-col gap-2">
                  {detail.lessons.map((l) => (
                    <div
                      key={l.id}
                      className="flex items-center gap-3 px-4 py-3.5 rounded-xl"
                      style={{
                        background: "#FFFFFF",
                        border: "1.5px solid #EDE0FB",
                      }}
                    >
                      <span
                        className="flex items-center justify-center rounded-full w-7 h-7 text-[11px] font-bold shrink-0"
                        style={{ background: "#F5EEFE", color: "#3A0CA3" }}
                      >
                        {l.order}
                      </span>
                      <div className="flex-1">
                        <p
                          className="text-[13px] font-semibold"
                          style={{ color: "#0e1430" }}
                        >
                          {l.title}
                        </p>
                        <p
                          className="text-[11.5px]"
                          style={{ color: "#9CA3AF" }}
                        >
                          {l.duration} min · {l._count.contentBlocks} blocks ·{" "}
                          {l._count.questions} questions
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ),
          },
          {
            key: "assignments",
            label: `Assignments (${detail.assignments.length})`,
            children: (
              <div className="flex flex-col gap-3">
                <div className="flex justify-end mb-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingAssignment(null);
                      setFormOpen(true);
                    }}
                    className="text-[12px] font-semibold px-3.5 py-1.5 rounded-full"
                    style={{ background: "#3A0CA3", color: "#FFFFFF" }}
                  >
                    + New assignment
                  </button>
                </div>
                {detail.assignments.map((a) => (
                  <TutorAssignmentCard
                    key={a.id}
                    assignment={a}
                    onEdit={() => {
                      setEditingAssignment(a);
                      setFormOpen(true);
                    }}
                    onReview={() =>
                      router.push(`/tutor/review-queue?assignmentId=${a.id}`)
                    }
                  />
                ))}
              </div>
            ),
          },
        ]}
      />

      <AssignmentFormModal
        assignment={editingForForm}
        topicId={topicId}
        lessons={detail.lessons.map((l) => ({ id: l.id, title: l.title }))}
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}
