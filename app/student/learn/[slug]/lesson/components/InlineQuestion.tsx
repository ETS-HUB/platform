"use client";

import { useState } from "react";
import { CheckCircle2, XCircle, Loader2, RotateCcw } from "lucide-react";
import type { AnswerResult, LessonQuestion } from "@/apis/lessons/types";

interface InlineQuestionProps {
  question: LessonQuestion;
  index?: number;
  onAnswer: (
    questionId: string,
    selectedOptionId: string,
  ) => Promise<AnswerResult>;
}

const DIFFICULTY_COLOR: Record<LessonQuestion["difficulty"], string> = {
  EASY: "#059669",
  MEDIUM: "#D97706",
  HARD: "#DC2626",
};

type QuestionStatus = "idle" | "submitting" | "first_wrong" | "answered";

export function InlineQuestion({
  question,
  index,
  onAnswer,
}: InlineQuestionProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [status, setStatus] = useState<QuestionStatus>("idle");
  const [result, setResult] = useState<AnswerResult | null>(null);
  const [attempts, setAttempts] = useState(0);

  const handleSelect = async (optionId: string) => {
    if (status === "submitting" || status === "answered") return;

    setSelected(optionId);
    setStatus("submitting");

    try {
      const res = await onAnswer(question.id, optionId);
      setAttempts((prev) => prev + 1);

      if (res.isCorrect) {
        // Correct on any attempt — lock and show success
        setResult(res);
        setStatus("answered");
      } else if (attempts === 0) {
        // First wrong attempt — allow one retry
        setResult(res);
        setStatus("first_wrong");
      } else {
        // Second wrong attempt — lock and reveal answer
        setResult(res);
        setStatus("answered");
      }
    } catch {
      setStatus(attempts > 0 ? "first_wrong" : "idle");
      setSelected(null);
    }
  };

  const handleRetry = () => {
    setSelected(null);
    setStatus("idle");
    // Keep result for reference but allow re-selection
  };

  const isLocked = status === "answered" || status === "submitting";

  return (
    <div
      className="rounded-xl p-4"
      style={{ background: "#FAFAFA", border: "1px solid #E5E7EB" }}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <p className="text-lg font-noto font-medium leading-snug text-[#0e1430]">
          {index != null ? `${index}. ` : ""}
          {question.text}
        </p>
        {/* <div className="flex items-center gap-1.5 shrink-0">
          <span
            className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full"
            style={{
              color: DIFFICULTY_COLOR[question.difficulty],
              background: `${DIFFICULTY_COLOR[question.difficulty]}15`,
            }}
          >
            {question.difficulty}
          </span>
          <span
            className="text-[11px] font-semibold text-[#8B84A0]"
          >
            {question.points} pts
          </span>
        </div> */}
      </div>

      <div className="flex flex-col gap-2">
        {question.options.map((opt) => {
          const isSelected = selected === opt.id;
          const isCorrectOption =
            status === "answered" && result?.correctAnswer === opt.id;
          const isWrongSelected =
            isSelected &&
            (status === "answered" || status === "first_wrong") &&
            !result?.isCorrect;

          let borderColor = "#E5E7EB";
          let bg = "#FFFFFF";
          let textColor = "#374151";

          if (status === "answered" && isCorrectOption) {
            borderColor = "#059669";
            bg = "#F0FDF4";
            textColor = "#059669";
          } else if (isWrongSelected && status === "answered") {
            borderColor = "#DC2626";
            bg = "#FEF2F2";
            textColor = "#DC2626";
          } else if (isWrongSelected && status === "first_wrong") {
            borderColor = "#D97706";
            bg = "#FFFBEB";
            textColor = "#D97706";
          } else if (isSelected && status === "submitting") {
            borderColor = "#3A0CA3";
          }

          return (
            <button
              key={opt.id}
              type="button"
              disabled={isLocked}
              onClick={() => handleSelect(opt.id)}
              className="flex items-center justify-between font-noto text-left text-base px-3.5 py-2.5 rounded-lg transition-colors disabled:cursor-default"
              style={{
                border: `1.5px solid ${borderColor}`,
                background: bg,
                color: textColor,
              }}
            >
              <span>{opt.text}</span>
              {isSelected && status === "submitting" && (
                <Loader2
                  size={14}
                  className="animate-spin"
                  style={{ color: "#3A0CA3" }}
                />
              )}
              {status === "answered" && isCorrectOption && (
                <CheckCircle2 size={15} style={{ color: "#059669" }} />
              )}
              {isWrongSelected && status === "answered" && (
                <XCircle size={15} style={{ color: "#DC2626" }} />
              )}
            </button>
          );
        })}
      </div>

      {status === "first_wrong" && result && (
        <div className="mt-3 rounded-lg p-3 flex items-center justify-between">
          <p className="text-base leading-relaxed">
            <span className="font-semibold">Not quite.</span> You have one more
            try.
          </p>
          <button
            type="button"
            onClick={handleRetry}
            className="flex items-center gap-1 cursor-pointer text-sm bg-[#4a0570]/50 text-white font-semibold px-3 py-1.5 rounded-full shrink-0"
          >
            <RotateCcw size={14} />
            Try again
          </button>
        </div>
      )}

      {/* Final answer revealed */}
      {status === "answered" && result && (
        <div
          className="mt-3 rounded-lg p-3 text-base leading-relaxed"
          style={{
            background: result.isCorrect ? "#F0FDF4" : "#FEF2F2",
            color: result.isCorrect ? "#166534" : "#991B1B",
          }}
        >
          <span className="font-semibold">
            {result.isCorrect ? `Correct! +${result.points} XP` : "Incorrect"}{" "}
            ·{" "}
          </span>
          {result.explanation}
        </div>
      )}
    </div>
  );
}
