"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Select, Skeleton } from "antd";
import { useSelector } from "react-redux";
import { AssignmentCard } from "./components/AssignmentCard";
import { useGetCourseAssignmentsQuery } from "@/apis/assignments/assignmentService";
import { useGetDashboardQuery } from "@/apis/dashboard/dashboardService";
import Header from "@/components/ui/Header";
import { IMAGES } from "@/constants/images";
import Image from "next/image";
import type { RootState } from "@/store";

export default function AssignmentsListPage() {
  const router = useRouter();
  const { accessToken } = useSelector((s: RootState) => s.tokens);
  const [topicId, setTopicId] = useState<string>("");

  // Enrolled courses for the picker
  const { data: dashData, isLoading: dashLoading } = useGetDashboardQuery(
    undefined,
    { skip: !accessToken },
  );
  const enrolledCourses = dashData?.enrolledCourses ?? [];

  const { data: assignments = [], isLoading: assignmentsLoading } =
    useGetCourseAssignmentsQuery(topicId, { skip: !topicId });

  const isLoading = assignmentsLoading;

  // Action-needed items first, sorted by due date urgency
  const sorted = useMemo(() => {
    return [...assignments].sort((a, b) => {
      const aDone = a.mySubmission?.status === "APPROVED";
      const bDone = b.mySubmission?.status === "APPROVED";
      if (aDone !== bDone) return aDone ? 1 : -1;
      const aDue = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
      const bDue = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
      return aDue - bDue;
    });
  }, [assignments]);

  const pendingCount = assignments.filter(
    (a) =>
      !a.mySubmission ||
      a.mySubmission.status === "REJECTED" ||
      a.mySubmission.status === "RESUBMIT",
  ).length;

  return (
    <div className="min-h-screen w-full">
      <div className="mb-6">
        <Header
          title="Assignments"
          subtitle={
            !topicId
              ? "Select a course to view its assignments."
              : isLoading
                ? "Loading..."
                : pendingCount > 0
                  ? `${pendingCount} assignment${pendingCount > 1 ? "s" : ""} need your attention.`
                  : "You're all caught up."
          }
        />
      </div>

      {/* Course picker */}
      <div className="mb-6">
        <Select
          showSearch
          allowClear
          placeholder="Select a course"
          style={{ width: "100%", maxWidth: 360 }}
          size="large"
          loading={dashLoading}
          value={topicId || undefined}
          onChange={(v) => setTopicId(v ?? "")}
          filterOption={(input, opt) =>
            ((opt?.label as string) ?? "")
              .toLowerCase()
              .includes(input.toLowerCase())
          }
          options={enrolledCourses.map((c) => ({
            label: c.courseName,
            value: c.courseId,
          }))}
        />
      </div>

      {!topicId ? (
        <div className="flex flex-col items-center gap-5 justify-center py-20 text-center">
          <Image
            src={IMAGES.EmptyImageTwo}
            width={240}
            height={240}
            alt="Select a course"
          />
          <p className="text-base sm:text-lg text-[#9CA3AF]">
            Pick a course above to see its assignments.
          </p>
        </div>
      ) : isLoading ? (
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-2xl p-5 bg-white border border-[#EDE0FB]"
            >
              <Skeleton active paragraph={{ rows: 2 }} />
            </div>
          ))}
        </div>
      ) : sorted.length === 0 ? (
        <div className="flex flex-col items-center gap-5 justify-center py-20 text-center">
          <Image
            src={IMAGES.EmptyImageTwo}
            width={240}
            height={240}
            alt="No assignments"
          />
          <p className="text-base sm:text-lg text-[#9CA3AF]">
            No assignments in this course yet.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {sorted.map((assignment) => (
            <AssignmentCard
              key={assignment.id}
              assignment={assignment}
              onClick={() =>
                router.push(`/student/assignments/${assignment.id}`)
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
