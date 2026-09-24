"use client";

import { useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import { ClipboardList } from "lucide-react";
import { AssignmentCard } from "./components/AssignmentCard";
import type { AssignmentListItem } from "@/apis/assignments/types";
import Header from "@/components/ui/Header";
import { IMAGES } from "@/constants/images";
import Image from "next/image";

// Replace with useGetCourseAssignmentsQuery(topicId) — shape matches exactly
const MOCK_ASSIGNMENTS: AssignmentListItem[] = [
  {
    id: "ass-1-uuid",
    title: "Exercise: Array Method Challenges",
    description:
      "## Array Challenges\n\nSolve the following using array methods...",
    type: "EXERCISE",
    dueDate: "2026-07-24T00:00:00.000Z",
    points: 50,
    requiresLink: false,
    requiresFile: true,
    requiresText: true,
    createdBy: { firstName: "Sarah", lastName: "Mitchell", avatar: null },
    totalSubmissions: 0,
    mySubmission: null,
    createdAt: "2026-07-17T00:00:00.000Z",
  },
  {
    id: "ass-2-uuid",
    title: "Final Project: Build a Quiz App",
    type: "PROJECT",
    points: 100,
    requiresLink: true,
    requiresFile: false,
    requiresText: true,
    createdBy: { firstName: "Sarah", lastName: "Mitchell", avatar: null },
    totalSubmissions: 1,
    mySubmission: {
      id: "sub-uuid",
      status: "SUBMITTED",
      link: "https://github.com/alex-johnson/js-quiz-app",
      files: [
        {
          url: "#",
          fileName: "quiz-screenshot.png",
          fileType: "image/png",
          fileSize: 340000,
        },
      ],
      text: "Built with vanilla JS. Live demo: https://alex-quiz.vercel.app",
      score: null,
      feedback: null,
      submittedAt: "2026-07-17T00:00:00.000Z",
    },
    createdAt: "2026-07-10T00:00:00.000Z",
  },
];

export default function AssignmentsListPage() {
  const router = useRouter();
  const params = useParams();
  const topicId = params.topicId as string;

  const assignments = MOCK_ASSIGNMENTS;

  // Not-yet-submitted first, sorted by urgency; already-handled ones after —
  // action-needed items shouldn't be buried below settled ones.
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
    (a) => !a.mySubmission || a.mySubmission.status === "REJECTED",
  ).length;

  return (
    <div className="min-h-screen w-full">
      <div className="mb-8">
        <Header
          title="Assignments"
          subtitle={
            pendingCount > 0
              ? `${pendingCount} assignment${pendingCount > 1 ? "s" : ""} need your attention.`
              : "You're all caught up."
          }
        />
      </div>

      {sorted.length === 0 ? (
        <div className="flex flex-col items-center gap-5 justify-center py-20 text-center">
          <Image
            src={IMAGES.EmptyImageTwo}
            width={300}
            height={300}
            alt="No practice topics available"
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
