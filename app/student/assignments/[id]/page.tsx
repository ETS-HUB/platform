"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, FileCode2, Rocket } from "lucide-react";
import { StatusBadge } from "../components/StatusBadge";
import { DueDateLabel } from "../components/DueDateLabel";
import { SubmissionStatusCard } from "../components/SubmissionStatusCard";
import { SubmittedContentPreview } from "../components/SubmittedContentPreview";
import { SubmissionForm } from "../components/SubmissionForm";
import type { AssignmentDetail, SubmittedFile } from "@/apis/assignments/types";
import { TextBlock } from "../../learn/[slug]/lesson/components/blocks/TextBlock";

const MOCK_ASSIGNMENT: AssignmentDetail = {
  id: "ass-2-uuid",
  title: "Final Project: Build a Quiz App",
  description:
    "## Build a JavaScript Quiz App\n\nCreate a fully functional quiz application...",
  type: "PROJECT",
  dueDate: "2026-07-31T00:00:00.000Z",
  points: 100,
  requiresLink: true,
  requiresFile: false,
  requiresText: true,
  isPublished: true,
  createdBy: { firstName: "Sarah", lastName: "Mitchell", avatar: null },
  lesson: {
    id: "lesson-9-uuid",
    title: "Final Project: Build a Quiz App",
    order: 9,
  },
  mySubmission: {
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
    text: "Built with vanilla JS.",
    score: null,
    feedback: null,
    submittedAt: "2026-07-17T00:00:00.000Z",
  },
};

const TYPE_META = {
  EXERCISE: { icon: FileCode2, label: "Exercise", color: "#3A0CA3" },
  PROJECT: { icon: Rocket, label: "Project", color: "#F52593" },
};

export default function AssignmentDetailPage() {
  const router = useRouter();
  const params = useParams();
  const assignmentId = params.id as string;

  const assignment = MOCK_ASSIGNMENT;
  const meta = TYPE_META[assignment.type];
  const Icon = meta.icon;
  const submission = assignment.mySubmission;
  const canSubmitOrResubmit = !submission || submission.status === "REJECTED";

  const handleSubmit = async (payload: {
    link?: string;
    files?: SubmittedFile[];
    text?: string;
  }) => {
    // Stub — replace with usePostSubmitAssignmentMutation(assignmentId, payload)
    await new Promise((r) => setTimeout(r, 600));
  };

  return (
    <div className="min-h-screen w-full">
      <button
        type="button"
        onClick={() => router.back()}
        className="flex cursor-pointer text-[#8A8A8A] items-center gap-1.5 text-sm hover:scale-105 transition-transform font-medium mb-5"
      >
        <ArrowLeft size={14} />
        Back to assignments
      </button>

      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <div
            className="flex items-center justify-center rounded-full w-8 h-8"
            style={{ background: `${meta.color}15` }}
          >
            <Icon size={15} style={{ color: meta.color }} />
          </div>
          <span
            className="text-[11px] font-bold uppercase tracking-wide"
            style={{ color: meta.color }}
          >
            {meta.label}
          </span>
          <span className="text-sm text-[#9CA3AF]">
            · {assignment.points} points
          </span>
        </div>

          <h1 className="text-[22px] font-semibold mb-2 text-[#0e1430] font-noto">
          {assignment.title}
        </h1>

        <div className="flex items-center gap-3 flex-wrap mb-3">
          <StatusBadge status={submission?.status ?? null} />
          <DueDateLabel
            dueDate={assignment.dueDate}
            isSubmitted={!!submission}
          />
        </div>

        <div className="flex items-center gap-2">
          <img
            src={
              assignment.createdBy.avatar ||
              `https://api.dicebear.com/7.x/avataaars/svg?seed=${assignment.createdBy.firstName}`
            }
            alt=""
            className="w-6 h-6 rounded-full"
          />
          <span className="text-base text-[#8B84A0]">
            Assigned by {assignment.createdBy.firstName}{" "}
            {assignment.createdBy.lastName}
          </span>
        </div>
      </div>

      <div className="rounded-2xl p-6 mb-5 bg-white border border-[#EDE0FB]">
        <TextBlock content={assignment.description} />
      </div>

      {submission && (
        <>
          <SubmissionStatusCard submission={submission} />
          <SubmittedContentPreview submission={submission} />
        </>
      )}

      {canSubmitOrResubmit && (
        <SubmissionForm
          requiresLink={assignment.requiresLink}
          requiresFile={assignment.requiresFile}
          requiresText={assignment.requiresText}
          isResubmit={!!submission}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
