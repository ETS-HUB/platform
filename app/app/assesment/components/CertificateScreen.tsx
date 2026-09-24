"use client";

import React from "react";
import { GraduationCap, Download, Share2, Loader2 } from "lucide-react";
import type { Certificate } from "@/apis/assessment/types";

interface CertificateScreenProps {
  loading: boolean;
  certificate: Certificate | null;
  studentName: string;
  onDownload: () => void;
  onShare: () => void;
}

export function CertificateScreen({
  loading,
  certificate,
  studentName,
  onDownload,
  onShare,
}: CertificateScreenProps) {
  if (loading || !certificate) {
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
            Generating certificate
          </h2>
          <p className="text-[13.5px]" style={{ color: "#6B7280" }}>
            Hang tight — putting your achievement together.
          </p>
        </div>
      </div>
    );
  }

  const dateLabel = new Date(certificate.completedAt).toLocaleDateString(
    undefined,
    { year: "numeric", month: "long", day: "numeric" },
  );

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center px-4 py-12"
      style={{ background: "#F5EEFE" }}
    >
      <div className="w-full max-w-xl flex flex-col gap-6">
        {/* Certificate card */}
        <div
          className="rounded-2xl p-8 text-center relative overflow-hidden"
          style={{ background: "#FFFFFF", border: "1.5px solid #DDC9F0" }}
        >
          <div
            className="absolute top-0 left-0 right-0 h-2"
            style={{
              background: "linear-gradient(to right, #3A0CA3, #F52593)",
            }}
          />

          <div
            className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-5 mt-2"
            style={{ background: "#EDE0FB" }}
          >
            <GraduationCap size={24} style={{ color: "#3A0CA3" }} />
          </div>

          <p
            className="text-[12px] font-semibold uppercase tracking-widest mb-2"
            style={{ color: "#8B84A0" }}
          >
            Certificate of completion
          </p>
          <h1
            className="text-[24px] font-semibold mb-1"
            style={{ color: "#0e1430" }}
          >
            {certificate.studentName || studentName}
          </h1>
          <p className="text-[14px] mb-6" style={{ color: "#6B7280" }}>
            completed the {certificate.assessmentName}
          </p>

          <div className="flex items-center justify-center gap-8 mb-6">
            <div>
              <p
                className="text-[28px] font-semibold"
                style={{ color: "#3A0CA3" }}
              >
                {Math.round(certificate.overallScore)}%
              </p>
              <p className="text-[11.5px]" style={{ color: "#8B84A0" }}>
                Score
              </p>
            </div>
            <div className="w-px h-10" style={{ background: "#DDC9F0" }} />
            <div>
              <p
                className="text-[14px] font-medium"
                style={{ color: "#0e1430" }}
              >
                Top {100 - certificate.percentile}%
              </p>
              <p className="text-[11.5px]" style={{ color: "#8B84A0" }}>
                Percentile
              </p>
            </div>
            <div className="w-px h-10" style={{ background: "#DDC9F0" }} />
            <div>
              <p
                className="text-[14px] font-medium"
                style={{ color: "#0e1430" }}
              >
                {dateLabel}
              </p>
              <p className="text-[11.5px]" style={{ color: "#8B84A0" }}>
                Date earned
              </p>
            </div>
          </div>

          {/* Level & XP */}
          <div
            className="inline-flex items-center gap-2 text-[12px] font-medium px-3 py-1.5 rounded-full mb-4"
            style={{ background: "#EDE0FB", color: "#3A0CA3" }}
          >
            Level {certificate.level} · {certificate.levelName} ·{" "}
            {certificate.xp} XP
          </div>

          {/* Badges */}
          {certificate.badges.length > 0 && (
            <div className="flex justify-center gap-2 flex-wrap mt-2">
              {certificate.badges.map((badge, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded-full"
                  style={{ background: "#FCE3F1", color: "#7A1C54" }}
                  title={badge.description}
                >
                  {badge.name}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Topic breakdown */}
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
            {certificate.topicBreakdown.map((t) => (
              <div key={t.topic}>
                <div className="flex justify-between mb-1.5">
                  <span
                    className="text-[13.5px] font-medium"
                    style={{ color: "#0e1430" }}
                  >
                    {t.topic}
                  </span>
                  <span className="text-[13px]" style={{ color: "#8B84A0" }}>
                    {t.correct}/{t.total} · {Math.round(t.score)}%
                  </span>
                </div>
                <div
                  className="h-2 rounded-full"
                  style={{ background: "#EDE0FB" }}
                >
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${t.score}%`,
                      background: t.score >= 70 ? "#3A0CA3" : "#F52593",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Strengths */}
        {certificate.strengths.length > 0 && (
          <div
            className="rounded-xl p-6"
            style={{ background: "#FFFFFF", border: "1.5px solid #DDC9F0" }}
          >
            <h3
              className="text-[15px] font-semibold mb-3"
              style={{ color: "#0e1430" }}
            >
              Strengths
            </h3>
            <div className="flex flex-wrap gap-2">
              {certificate.strengths.map((s) => (
                <span
                  key={s.topic}
                  className="inline-flex items-center gap-1 text-[12.5px] font-medium px-3 py-1.5 rounded-full"
                  style={{ background: "#EDE0FB", color: "#3A0CA3" }}
                >
                  {s.topic} · {s.score}%
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 justify-center">
          <button
            type="button"
            onClick={onDownload}
            className="inline-flex items-center gap-2 text-[14px] font-semibold px-5 py-2.5 rounded-lg"
            style={{
              color: "#3A0CA3",
              background: "#FFFFFF",
              border: "1.5px solid #DDC9F0",
            }}
          >
            <Download size={15} />
            Download
          </button>
          <button
            type="button"
            onClick={onShare}
            className="inline-flex items-center gap-2 text-[14px] font-semibold px-5 py-2.5 rounded-lg"
            style={{ color: "#FFFFFF", background: "#3A0CA3" }}
          >
            <Share2 size={15} />
            Share
          </button>
        </div>

        {/* Certificate ID */}
        <p className="text-center text-[11px]" style={{ color: "#8B84A0" }}>
          Certificate ID: {certificate.id}
        </p>
      </div>
    </div>
  );
}

export default CertificateScreen;
