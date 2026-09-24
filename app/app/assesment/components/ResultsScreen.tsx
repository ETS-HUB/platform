"use client";

import React from "react";
import {
  Trophy,
  GraduationCap,
  Users,
  Download,
  Share2,
  Loader2,
} from "lucide-react";
import type {
  CompleteResponse,
  Badge,
  Certificate,
} from "@/apis/assessment/types";
import type { PercentileResponse } from "@/apis/assessment/assessmentService";

interface ResultsScreenProps {
  loading: boolean;
  result: CompleteResponse | null;
  badges: Badge[];
  certificate: Certificate | null;
  percentile: PercentileResponse | null;
  studentName: string;
  onDone: () => void;
}

export function ResultsScreen({
  loading,
  result,
  badges,
  certificate,
  percentile,
  studentName,
  onDone,
}: ResultsScreenProps) {
  if (loading) {
    return (
      <div
        className="min-h-screen w-full flex items-center justify-center px-4"
        style={{ background: "#F5EEFE" }}
      >
        <div className="text-center">
          <div
            className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-5"
            style={{ background: "#EDE0FB" }}
          >
            <Loader2
              size={22}
              className="animate-spin"
              style={{ color: "#3A0CA3" }}
            />
          </div>
          <h2
            className="text-[18px] font-semibold mb-1.5"
            style={{ color: "#0e1430" }}
          >
            Generating your results
          </h2>
          <p className="text-[13.5px]" style={{ color: "#6B7280" }}>
            Calculating badges, certificate, and percentile...
          </p>
        </div>
      </div>
    );
  }

  const score = result ? Math.round(result.percentageScore) : 0;
  const topicList = result ? Object.values(result.topicScores) : [];

  return (
    <div
      className="min-h-screen w-full px-4 py-12"
      style={{ background: "#F5EEFE" }}
    >
      <div className="w-full max-w-2xl mx-auto flex flex-col gap-6">
        {/* Header */}
        <div className="text-center mb-2">
          <div
            className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-4"
            style={{ background: "#EDE0FB" }}
          >
            <Trophy size={24} style={{ color: "#3A0CA3" }} />
          </div>
          <h1
            className="text-[24px] font-semibold"
            style={{ color: "#0e1430" }}
          >
            Assessment Complete!
          </h1>
          <p className="text-[14px] mt-1" style={{ color: "#6B7280" }}>
            Here&apos;s how you did, {studentName.split(" ")[0]}.
          </p>
        </div>

        {/* Score + Percentile Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div
            className="rounded-xl p-5 text-center"
            style={{ background: "#FFFFFF", border: "1.5px solid #DDC9F0" }}
          >
            <p
              className="text-[36px] font-semibold leading-none mb-1"
              style={{ color: "#3A0CA3" }}
            >
              {score}%
            </p>
            <p className="text-[12px]" style={{ color: "#8B84A0" }}>
              Overall Score
            </p>
          </div>

          <div
            className="rounded-xl p-5 text-center"
            style={{ background: "#FFFFFF", border: "1.5px solid #DDC9F0" }}
          >
            <div className="flex items-center justify-center gap-1 mb-1">
              <Users size={16} style={{ color: "#3A0CA3" }} />
              <p
                className="text-[28px] font-semibold leading-none"
                style={{ color: "#3A0CA3" }}
              >
                {percentile ? `${percentile.percentile}%` : "—"}
              </p>
            </div>
            <p className="text-[12px]" style={{ color: "#8B84A0" }}>
              Percentile
              {percentile && (
                <span> · {percentile.totalCandidates} candidates</span>
              )}
            </p>
          </div>

          <div
            className="rounded-xl p-5 text-center"
            style={{ background: "#FFFFFF", border: "1.5px solid #DDC9F0" }}
          >
            <p
              className="text-[28px] font-semibold leading-none mb-1"
              style={{ color: "#3A0CA3" }}
            >
              {certificate?.xp || 0}
            </p>
            <p className="text-[12px]" style={{ color: "#8B84A0" }}>
              XP Earned · Level {certificate?.level || 1}
            </p>
          </div>
        </div>

        {/* Topic Breakdown */}
        {topicList.length > 0 && (
          <div
            className="rounded-xl p-6"
            style={{ background: "#FFFFFF", border: "1.5px solid #DDC9F0" }}
          >
            <h3
              className="text-[15px] font-semibold mb-4"
              style={{ color: "#0e1430" }}
            >
              Topic Breakdown
            </h3>
            <div className="flex flex-col gap-3">
              {topicList.map((t) => (
                <div key={t.topicName}>
                  <div className="flex justify-between mb-1.5">
                    <span
                      className="text-[13px] font-medium"
                      style={{ color: "#0e1430" }}
                    >
                      {t.topicName}
                    </span>
                    <span className="text-[12px]" style={{ color: "#8B84A0" }}>
                      {t.correct}/{t.total} · {Math.round(t.percentage)}%
                    </span>
                  </div>
                  <div
                    className="h-2 rounded-full"
                    style={{ background: "#EDE0FB" }}
                  >
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${t.percentage}%`,
                        background: t.percentage >= 70 ? "#3A0CA3" : "#F52593",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Badges */}
        {badges.length > 0 && (
          <div
            className="rounded-xl p-6"
            style={{ background: "#FFFFFF", border: "1.5px solid #DDC9F0" }}
          >
            <h3
              className="text-[15px] font-semibold mb-4"
              style={{ color: "#0e1430" }}
            >
              Badges Earned
            </h3>
            <div className="flex flex-wrap gap-3">
              {badges.map((b, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg"
                  style={{ background: "#FCE3F1" }}
                >
                  <span className="text-xl">{b.icon}</span>
                  <div>
                    <p
                      className="text-[12.5px] font-semibold"
                      style={{ color: "#0e1430" }}
                    >
                      {b.name}
                    </p>
                    <p className="text-[11px]" style={{ color: "#8B84A0" }}>
                      {b.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certificate Card */}
        {certificate && (
          <div
            className="rounded-2xl p-6 text-center relative overflow-hidden"
            style={{ background: "#FFFFFF", border: "1.5px solid #DDC9F0" }}
          >
            <div
              className="absolute top-0 left-0 right-0 h-1.5"
              style={{
                background: "linear-gradient(to right, #3A0CA3, #F52593)",
              }}
            />

            <div
              className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-4 mt-2"
              style={{ background: "#EDE0FB" }}
            >
              <GraduationCap size={20} style={{ color: "#3A0CA3" }} />
            </div>

            <p
              className="text-[11px] font-semibold uppercase tracking-widest mb-1"
              style={{ color: "#8B84A0" }}
            >
              Certificate of completion
            </p>
            <h2
              className="text-[20px] font-semibold mb-0.5"
              style={{ color: "#0e1430" }}
            >
              {certificate.studentName || studentName}
            </h2>
            <p className="text-[13px] mb-4" style={{ color: "#6B7280" }}>
              {certificate.assessmentName} · {certificate.levelName}
            </p>

            <div className="flex justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  /* TODO: download */
                }}
                className="inline-flex items-center gap-1.5 text-[13px] font-medium px-4 py-2 rounded-lg"
                style={{
                  color: "#3A0CA3",
                  background: "#EDE0FB",
                }}
              >
                <Download size={14} />
                Download
              </button>
              <button
                type="button"
                onClick={() => {
                  /* TODO: share */
                }}
                className="inline-flex items-center gap-1.5 text-[13px] font-medium px-4 py-2 rounded-lg"
                style={{ color: "#FFFFFF", background: "#3A0CA3" }}
              >
                <Share2 size={14} />
                Share
              </button>
            </div>

            <p className="text-[10px] mt-4" style={{ color: "#C9BEDD" }}>
              ID: {certificate.id}
            </p>
          </div>
        )}

        {/* Recruiter visibility notice */}
        <div
          className="rounded-xl px-4 py-3 flex items-start gap-3"
          style={{ background: "#D1FAE5", border: "1px solid #A7F3D0" }}
        >
          <span className="text-lg">🎯</span>
          <p
            className="text-[13px] leading-relaxed"
            style={{ color: "#065F46" }}
          >
            Your results are now visible to recruiters. They can find you based
            on your skills and scores.
          </p>
        </div>

        {/* Done button */}
        <button
          type="button"
          onClick={onDone}
          className="inline-flex items-center justify-center gap-2 text-[14px] font-semibold px-6 py-3 rounded-lg self-center mt-2"
          style={{ color: "#FFFFFF", background: "#3A0CA3" }}
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}

export default ResultsScreen;
