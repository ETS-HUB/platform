"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, FileCode2, Rocket } from "lucide-react";
import { Skeleton } from "antd";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

import { StatusBadge } from "../components/StatusBadge";
import { DueDateLabel } from "../components/DueDateLabel";
import { SubmissionStatusCard } from "../components/SubmissionStatusCard";
import { SubmittedContentPreview } from "../components/SubmittedContentPreview";
import { SubmissionForm } from "../components/SubmissionForm";
import {
  useGetAssignmentDetailQuery,
  useSubmitAssignmentMutation,
} from "@/apis/assignments/assignmentService";
import type { SubmittedFile } from "@/apis/assignments/types";
import type { RootState } from "@/store";
import { TextBlock } from "../../learn/[slug]/lesson/components/blocks/TextBlock";
import { uploadMultipleFiles } from "@/apis/upload/uploadService";

const TYPE_META = {
  EXERCISE: { icon: FileCode2, label: "Exercise", color: "#3A0CA3" },
  PROJECT: { icon: Rocket, label: "Project", color: "#F52593" },
};

export default function AssignmentDetailPage() {
  const router = useRouter();
  const params = useParams();
  const assignmentId = params.id as string;
  const { accessToken } = useSelector((s: RootState) => s.tokens);

  const { data: assignment, isLoading } = useGetAssignmentDetailQuery(
    assignmentId,
    { skip: !assignmentId },
  );
  const [submitAssignment] = useSubmitAssignmentMutation();

  const handleSubmit = async (payload: {
    link?: string;
    files?: File[];
    text?: string;
  }) => {
    if (!assignment || !accessToken) return;

    let uploadedFiles: SubmittedFile[] = [];

    if (payload.files && payload.files.length > 0) {
      const results = await uploadMultipleFiles(
        payload.files,
        accessToken,
        "submissions",
      );
      uploadedFiles = results.map((r, i) => ({
        url: r.url,
        fileName: payload.files![i].name,
        fileType: payload.files![i].type,
        fileSize: payload.files![i].size,
      }));
    }

    await submitAssignment({
      assignmentId: assignment.id,
      payload: {
        link: payload.link,
        files: uploadedFiles.length > 0 ? uploadedFiles : undefined,
        text: payload.text,
      },
    }).unwrap();

    toast.success("Assignment submitted!");
  };

  if (isLoading || !assignment) {
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
        <Skeleton active paragraph={{ rows: 6 }} />
      </div>
    );
  }

  const meta =
    TYPE_META[assignment.type as keyof typeof TYPE_META] ?? TYPE_META.EXERCISE;
  const Icon = meta.icon;
  const submission = assignment.mySubmission;
  const canSubmitOrResubmit =
    !submission ||
    submission.status === "REJECTED" ||
    submission.status === "RESUBMIT";

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
