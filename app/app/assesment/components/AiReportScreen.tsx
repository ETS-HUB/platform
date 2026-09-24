"use client";

import React from "react";
import {
  Sparkles,
  BookOpen,
  ListChecks,
  Lightbulb,
  ArrowRight,
  ExternalLink,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";
import type { AiReportData } from "@/apis/assessment/types";

interface AiReportScreenProps {
  loading: boolean;
  report: AiReportData | null;
  onContinue: () => void;
  onRetry?: () => void;
}

function isError(obj: unknown): obj is { error: string; detail: string } {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "error" in obj &&
    typeof (obj as Record<string, unknown>).error === "string"
  );
}

function SectionSkeleton() {
  return (
    <div className="flex flex-col gap-3 animate-pulse">
      <div
        className="h-3 rounded"
        style={{ background: "#EDE0FB", width: "92%" }}
      />
      <div
        className="h-3 rounded"
        style={{ background: "#EDE0FB", width: "78%" }}
      />
      <div
        className="h-3 rounded"
        style={{ background: "#EDE0FB", width: "64%" }}
      />
      <div
        className="h-3 rounded"
        style={{ background: "#EDE0FB", width: "85%" }}
      />
    </div>
  );
}

function ErrorSection({ onRetry }: { onRetry?: () => void }) {
  return (
    <div className="flex items-start gap-3 py-2">
      <AlertTriangle
        size={16}
        className="shrink-0 mt-0.5"
        style={{ color: "#D97706" }}
      />
      <div className="flex-1">
        <p className="text-[13px] font-medium" style={{ color: "#92400E" }}>
          AI generation failed (rate limit exceeded)
        </p>
        <p className="text-[12px] mt-0.5" style={{ color: "#A16207" }}>
          The AI service is temporarily overloaded. Try again in a minute.
        </p>
      </div>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-1 text-[12px] font-medium px-2.5 py-1.5 rounded-lg shrink-0"
          style={{ background: "#FEF3C7", color: "#92400E" }}
        >
          <RotateCcw size={12} />
          Retry
        </button>
      )}
    </div>
  );
}

function MarkdownBlock({ content }: { content: string }) {
  const lines = content.split("\n");
  return (
    <div className="flex flex-col gap-2">
      {lines.map((line, i) => {
        if (line.startsWith("## ")) {
          return (
            <h4
              key={i}
              className="text-[14px] font-semibold mt-2"
              style={{ color: "#0e1430" }}
            >
              {line.replace("## ", "")}
            </h4>
          );
        }
        if (line.startsWith("- ")) {
          return (
            <p
              key={i}
              className="text-[13.5px] leading-relaxed pl-3 relative"
              style={{ color: "#3D3552" }}
            >
              <span
                className="absolute left-0 top-[9px] w-1 h-1 rounded-full"
                style={{ background: "#C9BEDD" }}
              />
              {line.replace("- ", "").replace(/\*\*(.*?)\*\*/g, "$1")}
            </p>
          );
        }
        if (line.match(/^\d+\. /)) {
          return (
            <p
              key={i}
              className="text-[13.5px] leading-relaxed pl-3"
              style={{ color: "#3D3552" }}
            >
              {line.replace(/\*\*(.*?)\*\*/g, "$1")}
            </p>
          );
        }
        if (!line.trim()) return <div key={i} className="h-1" />;
        return (
          <p
            key={i}
            className="text-[13.5px] leading-relaxed"
            style={{ color: "#3D3552" }}
          >
            {line.replace(/\*\*(.*?)\*\*/g, "$1")}
          </p>
        );
      })}
    </div>
  );
}

export function AiReportScreen({
  loading,
  report,
  onContinue,
  onRetry,
}: AiReportScreenProps) {
  const hasAnySuccess =
    report &&
    (!isError(report.skillReport) ||
      !isError(report.learningPath) ||
      !isError(report.cheatSheet) ||
      !isError(report.recommendations));

  const allFailed =
    report &&
    isError(report.skillReport) &&
    isError(report.learningPath) &&
    isError(report.cheatSheet) &&
    isError(report.recommendations);

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center px-4 py-12"
      style={{ background: "#F5EEFE" }}
    >
      <div className="w-full max-w-2xl flex flex-col gap-6">
        <div className="text-center mb-2">
          <div
            className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-4"
            style={{ background: "#EDE0FB" }}
          >
            <Sparkles size={22} style={{ color: "#7408B3" }} />
          </div>
          <h1
            className="text-[22px] font-semibold"
            style={{ color: "#0e1430" }}
          >
            Your personalized report
          </h1>
          <p className="text-[13.5px] mt-1" style={{ color: "#6B7280" }}>
            {loading
              ? "AI is analyzing your results — this may take a moment."
              : allFailed
                ? "AI generation failed. You can retry or continue to badges."
                : "Based on how you did across each topic."}
          </p>
        </div>

        {/* All failed banner */}
        {allFailed && !loading && (
          <div
            className="rounded-xl p-4 flex items-center gap-3"
            style={{ background: "#FEF3C7", border: "1px solid #FDE68A" }}
          >
            <AlertTriangle size={18} style={{ color: "#D97706" }} />
            <div className="flex-1">
              <p
                className="text-[13px] font-medium"
                style={{ color: "#92400E" }}
              >
                AI service rate limit reached
              </p>
              <p className="text-[12px]" style={{ color: "#A16207" }}>
                All report sections failed. Wait a minute then retry, or
                continue without the report.
              </p>
            </div>
            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="inline-flex items-center gap-1.5 text-[13px] font-semibold px-3 py-2 rounded-lg"
                style={{
                  background: "#FFFFFF",
                  color: "#92400E",
                  border: "1px solid #FDE68A",
                }}
              >
                <RotateCcw size={13} />
                Retry
              </button>
            )}
          </div>
        )}

        {/* Skill Report */}
        <div
          className="rounded-xl p-6"
          style={{ background: "#FFFFFF", border: "1.5px solid #DDC9F0" }}
        >
          <div className="flex items-center gap-2 mb-4">
            <BookOpen size={16} style={{ color: "#3A0CA3" }} />
            <h3
              className="text-[15px] font-semibold"
              style={{ color: "#0e1430" }}
            >
              Skill Report
            </h3>
          </div>
          {loading || !report ? (
            <SectionSkeleton />
          ) : isError(report.skillReport) ? (
            <ErrorSection onRetry={onRetry} />
          ) : (
            <MarkdownBlock content={report.skillReport.report} />
          )}
        </div>

        {/* Learning Path */}
        <div
          className="rounded-xl p-6"
          style={{ background: "#FFFFFF", border: "1.5px solid #DDC9F0" }}
        >
          <div className="flex items-center gap-2 mb-4">
            <ListChecks size={16} style={{ color: "#3A0CA3" }} />
            <h3
              className="text-[15px] font-semibold"
              style={{ color: "#0e1430" }}
            >
              Learning Path
            </h3>
          </div>
          {loading || !report ? (
            <SectionSkeleton />
          ) : isError(report.learningPath) ? (
            <ErrorSection onRetry={onRetry} />
          ) : (
            <div className="flex flex-col gap-3">
              {report.learningPath.learningPath.map((week) => (
                <div key={week.week} className="flex gap-3 items-start">
                  <span
                    className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-semibold shrink-0 mt-0.5"
                    style={{ background: "#EDE0FB", color: "#3A0CA3" }}
                  >
                    {week.week}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className="text-[13.5px] font-medium"
                        style={{ color: "#0e1430" }}
                      >
                        {week.topic}
                      </span>
                      <span
                        className="text-[10.5px] font-semibold uppercase px-1.5 py-0.5 rounded"
                        style={{
                          background:
                            week.priority === "high" ? "#FEE2E2" : "#EDE0FB",
                          color:
                            week.priority === "high" ? "#DC2626" : "#3A0CA3",
                        }}
                      >
                        {week.priority}
                      </span>
                    </div>
                    <p
                      className="text-[12.5px] mt-0.5"
                      style={{ color: "#6B7280" }}
                    >
                      {week.focus} · {week.estimatedHours}h
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cheat Sheet */}
        <div
          className="rounded-xl p-6"
          style={{ background: "#FFFFFF", border: "1.5px solid #DDC9F0" }}
        >
          <div className="flex items-center gap-2 mb-4">
            <BookOpen size={16} style={{ color: "#F52593" }} />
            <h3
              className="text-[15px] font-semibold"
              style={{ color: "#0e1430" }}
            >
              Cheat Sheet
              {report && !isError(report.cheatSheet) && (
                <span style={{ color: "#8B84A0", fontWeight: 400 }}>
                  {" "}
                  — {report.cheatSheet.topic}
                </span>
              )}
            </h3>
          </div>
          {loading || !report ? (
            <SectionSkeleton />
          ) : isError(report.cheatSheet) ? (
            <ErrorSection onRetry={onRetry} />
          ) : (
            <MarkdownBlock content={report.cheatSheet.cheatSheet} />
          )}
        </div>

        {/* Recommendations */}
        <div
          className="rounded-xl p-6"
          style={{ background: "#FFFFFF", border: "1.5px solid #DDC9F0" }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb size={16} style={{ color: "#7408B3" }} />
            <h3
              className="text-[15px] font-semibold"
              style={{ color: "#0e1430" }}
            >
              Recommended Resources
            </h3>
          </div>
          {loading || !report ? (
            <SectionSkeleton />
          ) : isError(report.recommendations) ? (
            <ErrorSection onRetry={onRetry} />
          ) : (
            <>
              {report.recommendations.weakTopics.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {report.recommendations.weakTopics.map((topic) => (
                    <span
                      key={topic}
                      className="text-[11px] font-medium px-2 py-1 rounded-full"
                      style={{ background: "#FEE2E2", color: "#DC2626" }}
                    >
                      Needs work: {topic}
                    </span>
                  ))}
                </div>
              )}
              <div className="flex flex-col gap-3">
                {report.recommendations.recommendations.map((rec) => (
                  <a
                    key={rec.id}
                    href={rec.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors hover:bg-gray-50"
                    style={{ border: "1px solid #E5E7EB" }}
                  >
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-[13.5px] font-medium truncate"
                        style={{ color: "#0e1430" }}
                      >
                        {rec.title}
                      </p>
                      <p className="text-[11.5px]" style={{ color: "#8B84A0" }}>
                        {rec.type} · {rec.topic} · {rec.difficulty}
                      </p>
                    </div>
                    <ExternalLink
                      size={14}
                      className="shrink-0"
                      style={{ color: "#8B84A0" }}
                    />
                  </a>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="flex items-center justify-center gap-3">
          {onRetry && hasAnySuccess === false && !loading && (
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex items-center gap-2 text-[14px] font-medium px-5 py-3 rounded-lg"
              style={{
                color: "#3A0CA3",
                background: "#FFFFFF",
                border: "1.5px solid #DDC9F0",
              }}
            >
              <RotateCcw size={15} />
              Retry report
            </button>
          )}
          <button
            type="button"
            disabled={loading}
            onClick={onContinue}
            className="inline-flex items-center justify-center gap-2 text-[14px] font-semibold px-5 py-3 rounded-lg"
            style={{
              color: loading ? "#B3A8C9" : "#FFFFFF",
              background: loading ? "#EDE0FB" : "#3A0CA3",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            Continue
            <ArrowRight size={15} strokeWidth={2.4} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default AiReportScreen;
