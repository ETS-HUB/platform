"use client";

import { useState } from "react";
import { Trophy, ArrowRight, Loader2, AlertTriangle } from "lucide-react";

export function CompleteLessonBar({
  visitedSteps,
  totalSteps,
  onComplete,
  hasNextLesson,
  onGoNext,
}: {
  visitedSteps: number;
  totalSteps: number;
  onComplete: () => Promise<{ xpEarned: number }>;
  hasNextLesson: boolean;
  onGoNext: () => void;
}) {
  const [status, setStatus] = useState<
    "idle" | "confirming" | "submitting" | "done"
  >("idle");
  const [xp, setXp] = useState(0);

  const allVisited = visitedSteps >= totalSteps;

  const runComplete = async () => {
    setStatus("submitting");
    const res = await onComplete();
    setXp(res.xpEarned);
    setStatus("done");
  };

  const handleCompleteClick = () => {
    if (allVisited) {
      runComplete();
    } else {
      setStatus("confirming");
    }
  };

  return (
    <div
      className="sticky bottom-4 rounded-2xl px-5 py-4 flex items-center justify-between gap-4 shadow-lg"
      style={{ background: "#FFFFFF", border: "1.5px solid #EDE0FB" }}
    >
      {status === "confirming" ? (
        <>
          <div className="flex items-center gap-2.5">
            <div
              className="flex items-center justify-center rounded-full w-8 h-8 shrink-0"
              style={{ background: "#FFF3E0" }}
            >
              <AlertTriangle size={14} style={{ color: "#D97706" }} />
            </div>
            <p
              className="text-[12.5px] leading-snug"
              style={{ color: "#374151" }}
            >
              You've viewed {visitedSteps} of {totalSteps} sections.
              <br />
              Complete anyway?
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setStatus("idle")}
              className="text-[12.5px] font-medium px-3.5 py-2 rounded-full"
              style={{ color: "#6B7280" }}
            >
              Go back
            </button>
            <button
              type="button"
              onClick={runComplete}
              className="text-[13px] font-semibold px-4 py-2 rounded-full text-white"
              style={{ background: "#3A0CA3" }}
            >
              Complete anyway
            </button>
          </div>
        </>
      ) : status !== "done" ? (
        <>
          <span
            className="text-[12.5px]"
            style={{ color: allVisited ? "#059669" : "#6B7280" }}
          >
            {allVisited
              ? "All sections viewed — ready to complete"
              : `${visitedSteps}/${totalSteps} sections viewed`}
          </span>
          <button
            type="button"
            onClick={handleCompleteClick}
            disabled={status === "submitting"}
            className="flex items-center gap-2 text-[14px] font-semibold px-6 py-2.5 rounded-full text-white transition-transform hover:scale-[1.03] active:scale-[0.97] disabled:opacity-70"
            style={{ background: "#3A0CA3" }}
          >
            {status === "submitting" && (
              <Loader2 size={14} className="animate-spin" />
            )}
            Complete lesson
          </button>
        </>
      ) : (
        <>
          <div className="flex items-center gap-2">
            <div
              className="flex items-center justify-center rounded-full w-9 h-9"
              style={{ background: "#FFF3E0" }}
            >
              <Trophy size={16} style={{ color: "#D97706" }} />
            </div>
            <div>
              <p className="text-[13px] font-bold" style={{ color: "#0e1430" }}>
                Lesson complete
              </p>
              <p className="text-[12px]" style={{ color: "#8B84A0" }}>
                +{xp} XP earned
              </p>
            </div>
          </div>
          {hasNextLesson && (
            <button
              type="button"
              onClick={onGoNext}
              className="flex items-center gap-1.5 text-[13.5px] font-semibold px-5 py-2.5 rounded-full text-white transition-transform hover:scale-[1.03] active:scale-[0.97]"
              style={{ background: "#3A0CA3" }}
            >
              Next lesson
              <ArrowRight size={13} />
            </button>
          )}
        </>
      )}
    </div>
  );
}
