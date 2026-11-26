// app/roadmap/[slug]/components/ProjectsView.tsx
"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  ExternalLink,
  ThumbsUp,
  ThumbsDown,
  CheckCircle2,
  PlayCircle,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  useGetProjectsQuery,
  useGetProjectQuery,
  useGetSubmissionsQuery,
  useStartProjectMutation,
  useSubmitProjectMutation,
  useVoteSubmissionMutation,
} from "@/apis/roadmap/projectService";
import type {
  ProjectDifficulty,
  ProjectListItem,
  VoteType,
} from "@/apis/roadmap/projectTypes";

const DIFFICULTY_STYLE: Record<
  ProjectDifficulty,
  { bg: string; color: string }
> = {
  BEGINNER: { bg: "#DCFCE7", color: "#166534" },
  INTERMEDIATE: { bg: "#FEF9C3", color: "#854D0E" },
  ADVANCED: { bg: "#FEE2E2", color: "#991B1B" },
};

// ── Project card ──────────────────────────────────────────────────────────

function ProjectCard({
  project,
  onSelect,
}: {
  project: ProjectListItem;
  onSelect: (id: string) => void;
}) {
  const diff = DIFFICULTY_STYLE[project.difficulty];
  const up = project.userProject;
  const statusIcon =
    up?.status === "SUBMITTED" ? (
      <CheckCircle2 size={14} style={{ color: "#16A34A" }} />
    ) : up?.status === "STARTED" ? (
      <PlayCircle size={14} style={{ color: "#D97706" }} />
    ) : null;

  return (
    <button
      type="button"
      onClick={() => onSelect(project.id)}
      className="w-full rounded-2xl border bg-white p-5 text-left transition-colors hover:bg-[#FAF7FF]"
      style={{ borderColor: "#EDE0FB" }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
              style={{ background: diff.bg, color: diff.color }}
            >
              {project.difficulty}
            </span>
            <span
              className="rounded-full border px-2.5 py-0.5 text-[11px] font-medium"
              style={{ borderColor: "#EDE0FB", color: "#6B7280" }}
            >
              {project.projectType}
            </span>
            {statusIcon && (
              <span
                className="flex items-center gap-1 text-[12px]"
                style={{ color: "#6B7280" }}
              >
                {statusIcon}
                {up?.status === "SUBMITTED" ? "Submitted" : "In Progress"}
              </span>
            )}
          </div>
          <h3
            className="mt-2 text-[16px] font-bold"
            style={{ color: "#0e1430" }}
          >
            {project.title}
          </h3>
          <p
            className="mt-1.5 text-[13.5px] leading-relaxed line-clamp-2"
            style={{ color: "#6B7280" }}
          >
            {project.description}
          </p>
        </div>
      </div>
    </button>
  );
}

// ── Project Detail ────────────────────────────────────────────────────────

function ProjectDetail({
  projectId,
  isAuthenticated,
  onAuthRequired,
  onBack,
}: {
  projectId: string;
  isAuthenticated: boolean;
  onAuthRequired: () => void;
  onBack: () => void;
}) {
  const { data: project, isLoading } = useGetProjectQuery(projectId);
  const { data: submissionsData } = useGetSubmissionsQuery({ id: projectId });
  const [startProject, { isLoading: starting }] = useStartProjectMutation();
  const [submitProject, { isLoading: submitting }] = useSubmitProjectMutation();
  const [voteSubmission] = useVoteSubmissionMutation();
  const [solutionUrl, setSolutionUrl] = useState("");
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [activeSection, setActiveSection] = useState<
    "overview" | "submissions"
  >("overview");
  // Start modal state: null = closed, "loading" = calling API, "steps" = showing steps
  const [startModal, setStartModal] = useState<"loading" | "steps" | null>(
    null,
  );

  const handleStart = async () => {
    if (!isAuthenticated) return onAuthRequired();
    setStartModal("loading");
    try {
      await startProject(projectId).unwrap();
      setStartModal("steps");
    } catch {
      setStartModal(null);
      toast.error("Failed to start project");
    }
  };

  const handleSubmit = async () => {
    if (!solutionUrl.trim()) return toast.error("Please enter a solution URL");
    try {
      await submitProject({
        id: projectId,
        solutionUrl: solutionUrl.trim(),
      }).unwrap();
      toast.success("Solution submitted!");
      setShowSubmitForm(false);
      setSolutionUrl("");
    } catch {
      toast.error("Failed to submit solution");
    }
  };

  const handleVote = async (userProjectId: string, voteType: VoteType) => {
    if (!isAuthenticated) return onAuthRequired();
    try {
      await voteSubmission({ userProjectId, voteType }).unwrap();
    } catch {
      toast.error("Failed to vote");
    }
  };

  if (isLoading || !project) {
    return (
      <div className="flex justify-center py-24">
        <Loader2
          size={24}
          className="animate-spin"
          style={{ color: "#3A0CA3" }}
        />
      </div>
    );
  }

  const diff = DIFFICULTY_STYLE[project.difficulty];
  const up = project.userProject;
  const submissions = submissionsData?.data ?? [];

  return (
    <div className="mx-auto max-w-5xl">
      <button
        type="button"
        onClick={onBack}
        className="mb-6 flex items-center gap-1.5 text-[13px] font-medium transition-colors hover:text-[#3A0CA3]"
        style={{ color: "#6B7280" }}
      >
        <ArrowLeft size={14} />
        All projects
      </button>

      {/* Header */}
      <div
        className="rounded-2xl border bg-white p-6"
        style={{ borderColor: "#EDE0FB" }}
      >
        <div className="flex flex-wrap gap-2">
          <span
            className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
            style={{ background: diff.bg, color: diff.color }}
          >
            {project.difficulty}
          </span>
          <span
            className="rounded-full border px-2.5 py-0.5 text-[11px] font-medium"
            style={{ borderColor: "#EDE0FB", color: "#6B7280" }}
          >
            {project.projectType}
          </span>
        </div>
        <h1
          className="mt-3 text-[26px] font-extrabold tracking-tight"
          style={{ color: "#0e1430" }}
        >
          {project.title}
        </h1>
        <p
          className="mt-2 text-[14.5px] leading-relaxed"
          style={{ color: "#6B7280" }}
        >
          {project.description}
        </p>

        {/* CTA */}
        <div className="mt-5 flex flex-wrap gap-3">
          {!up ? (
            <button
              type="button"
              onClick={handleStart}
              disabled={startModal !== null}
              className="flex items-center gap-2 rounded-full px-5 py-2.5 text-[13.5px] font-semibold text-white disabled:opacity-50"
              style={{ background: "#3A0CA3" }}
            >
              <PlayCircle size={14} />
              Start Project
            </button>
          ) : up.status === "STARTED" ? (
            <>
              <span
                className="flex items-center gap-1.5 text-[13px] font-medium"
                style={{ color: "#D97706" }}
              >
                <PlayCircle size={14} /> In Progress
              </span>
              <button
                type="button"
                onClick={() => setShowSubmitForm((v) => !v)}
                className="flex items-center gap-2 rounded-full px-5 py-2.5 text-[13.5px] font-semibold text-white"
                style={{ background: "#3A0CA3" }}
              >
                Submit Solution
              </button>
            </>
          ) : (
            <span
              className="flex items-center gap-1.5 text-[13px] font-semibold"
              style={{ color: "#16A34A" }}
            >
              <CheckCircle2 size={14} /> Submitted
              {up.solutionUrl && (
                <a
                  href={up.solutionUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 flex items-center gap-1 text-[12px] hover:underline"
                  style={{ color: "#3A0CA3" }}
                >
                  <ExternalLink size={12} /> View
                </a>
              )}
            </span>
          )}
        </div>

        {/* Submit form */}
        {showSubmitForm && (
          <div
            className="mt-4 rounded-xl border p-4"
            style={{ borderColor: "#EDE0FB", background: "#FAF7FF" }}
          >
            <label
              className="mb-1.5 block text-[13px] font-medium"
              style={{ color: "#374151" }}
            >
              Solution URL (GitHub repo or live demo)
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={solutionUrl}
                onChange={(e) => setSolutionUrl(e.target.value)}
                placeholder="https://github.com/you/your-project"
                className="flex-1 rounded-lg border px-3 py-2 text-[13.5px] outline-none focus:border-[#3A0CA3]"
                style={{ borderColor: "#EDE0FB" }}
              />
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="rounded-lg px-4 py-2 text-[13px] font-semibold text-white disabled:opacity-50"
                style={{ background: "#3A0CA3" }}
              >
                {submitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Section tabs */}
      <div
        className="mt-6 flex gap-1 border-b"
        style={{ borderColor: "#EDE0FB" }}
      >
        {(["overview", "submissions"] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setActiveSection(s)}
            className="relative px-4 py-2.5 text-[13.5px] font-medium capitalize transition-colors"
            style={{ color: activeSection === s ? "#0e1430" : "#6B7280" }}
          >
            {s}
            {s === "submissions" && submissions.length > 0 && (
              <span
                className="ml-1.5 rounded-full px-1.5 text-[11px]"
                style={{ background: "#F3E8FF", color: "#3A0CA3" }}
              >
                {submissions.length}
              </span>
            )}
            {activeSection === s && (
              <span
                className="absolute inset-x-2 bottom-0 h-[2px] rounded-full"
                style={{ background: "#3A0CA3" }}
              />
            )}
          </button>
        ))}
      </div>

      {activeSection === "overview" && (
        <div className="mt-6 space-y-5">
          {/* Requirements */}
          <div
            className="rounded-2xl border bg-white p-5"
            style={{ borderColor: "#EDE0FB" }}
          >
            <h3
              className="mb-3 text-[15px] font-bold"
              style={{ color: "#0e1430" }}
            >
              Requirements
            </h3>
            <div
              className="prose prose-sm max-w-none text-[13.5px] leading-relaxed"
              style={{ color: "#374151" }}
              dangerouslySetInnerHTML={{
                __html: project.requirements.replace(/\n/g, "<br/>"),
              }}
            />
          </div>

          {/* Steps */}
          <div
            className="rounded-2xl border bg-white p-5"
            style={{ borderColor: "#EDE0FB" }}
          >
            <h3
              className="mb-4 text-[15px] font-bold"
              style={{ color: "#0e1430" }}
            >
              Submission Steps
            </h3>
            <ol className="space-y-3">
              {project.submissionSteps.map((step, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[12px] font-bold"
                    style={{ background: "#F3E8FF", color: "#3A0CA3" }}
                  >
                    {i + 1}
                  </span>
                  <span className="text-[13.5px]" style={{ color: "#374151" }}>
                    {step}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}

      {activeSection === "submissions" && (
        <div className="mt-6 space-y-4">
          {submissions.length === 0 ? (
            <p
              className="py-16 text-center text-[14px]"
              style={{ color: "#9CA3AF" }}
            >
              No submissions yet. Be the first!
            </p>
          ) : (
            submissions.map((sub) => (
              <div
                key={sub.id}
                className="rounded-2xl border bg-white p-5"
                style={{ borderColor: "#EDE0FB" }}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[13px] font-bold"
                      style={{ background: "#F3E8FF", color: "#3A0CA3" }}
                    >
                      {sub.submitter.firstName[0]}
                      {sub.submitter.lastName[0]}
                    </span>
                    <div>
                      <p
                        className="text-[14px] font-semibold"
                        style={{ color: "#0e1430" }}
                      >
                        {sub.submitter.firstName} {sub.submitter.lastName}
                      </p>
                      <p className="text-[12px]" style={{ color: "#9CA3AF" }}>
                        Submitted{" "}
                        {sub.submittedAt
                          ? new Date(sub.submittedAt).toLocaleDateString()
                          : "—"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {sub.solutionUrl && (
                      <a
                        href={sub.solutionUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 rounded-full border px-3 py-1 text-[12px] font-medium transition-colors hover:bg-[#FAF7FF]"
                        style={{ borderColor: "#EDE0FB", color: "#3A0CA3" }}
                      >
                        <ExternalLink size={11} /> View
                      </a>
                    )}
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleVote(sub.id, "UPVOTE")}
                        className="flex items-center gap-1 rounded-full px-2.5 py-1.5 text-[12px] font-medium transition-colors hover:bg-[#F0FDF4]"
                        style={{
                          color:
                            sub.myVote?.voteType === "UPVOTE"
                              ? "#16A34A"
                              : "#6B7280",
                        }}
                      >
                        <ThumbsUp size={13} />
                        {sub.upvotes}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleVote(sub.id, "DOWNVOTE")}
                        className="flex items-center gap-1 rounded-full px-2.5 py-1.5 text-[12px] font-medium transition-colors hover:bg-[#FFF1F2]"
                        style={{
                          color:
                            sub.myVote?.voteType === "DOWNVOTE"
                              ? "#DC2626"
                              : "#6B7280",
                        }}
                      >
                        <ThumbsDown size={13} />
                        {sub.downvotes}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ── Start Project Modal ───────────────────────────────────────── */}
      {startModal !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop — clicking it closes only when steps are shown */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => startModal === "steps" && setStartModal(null)}
          />

          <div
            className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl border bg-white shadow-2xl"
            style={{ borderColor: "#EDE0FB" }}
          >
            {/* Close button — only in steps state */}
            {startModal === "steps" && (
              <button
                type="button"
                onClick={() => setStartModal(null)}
                aria-label="Close"
                className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-[16px] font-semibold transition-colors hover:bg-[#F3E8FF]"
                style={{ color: "#6B7280" }}
              >
                ✕
              </button>
            )}

            {startModal === "loading" ? (
              /* ── Loading state ───────────────────────── */
              <div className="flex flex-col items-center px-8 py-14 text-center">
                <div
                  className="mb-5 h-14 w-14 animate-spin rounded-full border-4 border-solid"
                  style={{
                    borderColor: "#3A0CA3 transparent transparent transparent",
                  }}
                />
                <p
                  className="text-[16px] font-bold"
                  style={{ color: "#0e1430" }}
                >
                  Starting project...
                </p>
                <p className="mt-1.5 text-[13px]" style={{ color: "#9CA3AF" }}>
                  Setting things up for you
                </p>
              </div>
            ) : (
              /* ── Steps state ─────────────────────────── */
              <div className="p-7">
                {/* Header */}
                <div className="mb-6 flex items-center gap-3">
                  <span
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-xl"
                    style={{ background: "#F3E8FF" }}
                  >
                    🚀
                  </span>
                  <div>
                    <h3
                      className="text-[18px] font-extrabold"
                      style={{ color: "#0e1430" }}
                    >
                      Project started!
                    </h3>
                    <p className="text-[13px]" style={{ color: "#6B7280" }}>
                      Follow these steps to complete
                    </p>
                  </div>
                </div>

                {/* Steps list */}
                <ol className="space-y-3">
                  {project.submissionSteps.map((step, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span
                        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[12px] font-bold"
                        style={{ background: "#F3E8FF", color: "#3A0CA3" }}
                      >
                        {i + 1}
                      </span>
                      <span
                        className="text-[13.5px] leading-relaxed"
                        style={{ color: "#374151" }}
                      >
                        {step}
                      </span>
                    </li>
                  ))}
                </ol>

                <button
                  type="button"
                  onClick={() => setStartModal(null)}
                  className="mt-6 w-full rounded-full py-3 text-[13.5px] font-semibold text-white transition-transform hover:-translate-y-0.5"
                  style={{
                    background: "linear-gradient(135deg, #3A0CA3, #7C3AED)",
                  }}
                >
                  Got it, let&apos;s go! 🎯
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main View ─────────────────────────────────────────────────────────────

interface ProjectsViewProps {
  roadmapId: string; // UUID from roadmap.id
  roadmapSlug: string; // kept for display/navigation only
  isAuthenticated: boolean;
  onAuthRequired: () => void;
}

export default function ProjectsView({
  roadmapId,
  isAuthenticated,
  onAuthRequired,
}: ProjectsViewProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState("");

  const { data, isLoading } = useGetProjectsQuery({
    roadmapId,
    ...(difficulty ? { difficulty } : {}),
  });

  const projects = data?.data ?? [];

  if (selectedId) {
    return (
      <ProjectDetail
        projectId={selectedId}
        isAuthenticated={isAuthenticated}
        onAuthRequired={onAuthRequired}
        onBack={() => setSelectedId(null)}
      />
    );
  }

  return (
    <div>
      {/* Filter bar */}
      <div className="mb-6 flex items-center gap-2 flex-wrap">
        {(["", "BEGINNER", "INTERMEDIATE", "ADVANCED"] as const).map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => setDifficulty(d)}
            className="rounded-full border px-4 py-1.5 text-[12.5px] font-medium transition-colors"
            style={{
              borderColor: difficulty === d ? "#3A0CA3" : "#EDE0FB",
              background: difficulty === d ? "#F3E8FF" : "#FFFFFF",
              color: difficulty === d ? "#3A0CA3" : "#6B7280",
            }}
          >
            {d || "All"}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-24">
          <Loader2
            size={24}
            className="animate-spin"
            style={{ color: "#3A0CA3" }}
          />
        </div>
      ) : projects.length === 0 ? (
        <div className="py-24 text-center">
          <p className="text-[15px] font-medium" style={{ color: "#6B7280" }}>
            No projects available yet for this roadmap.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {projects.map((p) => (
            <ProjectCard key={p.id} project={p} onSelect={setSelectedId} />
          ))}
        </div>
      )}
    </div>
  );
}
