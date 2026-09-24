"use client";

import React from "react";
import { Trophy, ArrowRight } from "lucide-react";
import type { CompleteResponse } from "@/apis/assessment/types";

interface ScoreScreenProps {
  result: CompleteResponse;
  onContinue: () => void;
}

export function ScoreScreen({ result, onContinue }: ScoreScreenProps) {
  const topicList = Object.values(result.topicScores);

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center px-4 py-12"
      style={{ background: "#F5EEFE" }}
    >
      <div className="w-full max-w-2xl flex flex-col gap-6">
        <div
          className="flex items-start gap-3 rounded-xl px-4 py-3"
          style={{ background: "#FCE3F1", border: "1px solid #F3B8D8" }}
        >
          <p
            className="text-[13px] leading-relaxed"
            style={{ color: "#7A1C54" }}
          >
            Your results are now visible to recruiters searching for your
            skills.
          </p>
        </div>

        <div
          className="rounded-xl p-6 text-center"
          style={{ background: "#FFFFFF", border: "1.5px solid #DDC9F0" }}
        >
          <div
            className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-4"
            style={{ background: "#EDE0FB" }}
          >
            <Trophy size={24} style={{ color: "#3A0CA3" }} />
          </div>
          <p
            className="text-[13px] font-medium mb-1"
            style={{ color: "#6B7280" }}
          >
            Overall score
          </p>
          <p
            className="text-[40px] font-semibold leading-none mb-1"
            style={{ color: "#0e1430" }}
          >
            {Math.round(result.percentageScore)}%
          </p>
          <p className="text-[13px]" style={{ color: "#8B84A0" }}>
            {result.totalScore} of {result.maxScore} points
          </p>
        </div>

        <div
          className="rounded-xl p-6"
          style={{ background: "#FFFFFF", border: "1.5px solid #DDC9F0" }}
        >
          <h3
            className="text-[15px] font-semibold mb-4"
            style={{ color: "#0e1430" }}
          >
            By topic
          </h3>
          <div className="flex flex-col gap-4">
            {topicList.map((t) => (
              <div key={t.topicName}>
                <div className="flex justify-between mb-1.5">
                  <span
                    className="text-[13.5px] font-medium"
                    style={{ color: "#0e1430" }}
                  >
                    {t.topicName}
                  </span>
                  <span className="text-[13px]" style={{ color: "#8B84A0" }}>
                    {t.correct}/{t.total} · {Math.round(t.percentage)}%
                  </span>
                </div>
                <div
                  className="h-2 rounded-full"
                  style={{ background: "#EDE0FB" }}
                >
                  <div
                    className="h-full rounded-full"
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

        <button
          type="button"
          onClick={onContinue}
          className="inline-flex items-center justify-center gap-2 text-[14px] font-semibold px-5 py-3 rounded-lg self-center"
          style={{ color: "#FFFFFF", background: "#3A0CA3" }}
        >
          See your personalized report
          <ArrowRight size={15} strokeWidth={2.4} />
        </button>
      </div>
    </div>
  );
}

export default ScoreScreen;
