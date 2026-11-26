"use client";

import { useState } from "react";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import type {
  PracticeQuestion,
  PracticeAnswerResponse,
} from "@/apis/student/types";
import { Button } from "@/components";

const DIFFICULTY_COLOR: Record<PracticeQuestion["difficulty"], string> = {
  EASY: "#059669",
  MEDIUM: "#D97706",
  HARD: "#DC2626",
};

export function PracticeQuestionCard({
  question,
  questionNumber,
  totalQuestions,
  onAnswer,
  onNext,
}: {
  question: PracticeQuestion;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (
    questionId: string,
    selectedOptionId: string,
  ) => Promise<PracticeAnswerResponse>;
  onNext: () => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "submitting" | "answered">(
    "idle",
  );
  const [result, setResult] = useState<PracticeAnswerResponse | null>(null);

  const handleSelect = async (optionId: string) => {
    if (status !== "idle") return;
    setSelected(optionId);
    setStatus("submitting");
    const res = await onAnswer(question.id, optionId);
    setResult(res);
    setStatus("answered");
  };

  const isLast = questionNumber === totalQuestions;

  return (
    <div
      className="rounded-2xl p-6 font-noto"
      style={{ background: "#FFFFFF", border: "1.5px solid #EDE0FB" }}
    >
      {/* progress */}
      <div className="flex items-center gap-1.5 mb-5">
        {Array.from({ length: totalQuestions }).map((_, i) => (
          <div
            key={i}
            className="flex-1 h-1.5 rounded-full"
            style={{ background: i < questionNumber ? "#3A0CA3" : "#EDE0FB" }}
          />
        ))}
      </div>

      <div className="flex items-center gap-2 mb-4">
        <span className="text-base font-medium text-[#8B84A0] tracking-wide">
          Question {questionNumber} of {totalQuestions}
        </span>
        {/* <span
          className="text-sm font-semibold uppercase px-2 py-0.5 rounded-full"
          style={{
            color: DIFFICULTY_COLOR[question.difficulty],
            background: `${DIFFICULTY_COLOR[question.difficulty]}15`,
          }}
        >
          {question.difficulty}
        </span> */}
      </div>

      <p className="text-lg font-medium mb-5 leading-snug">{question.text}</p>

      <div className="flex flex-col gap-2 mb-2">
        {question.options.map((opt) => {
          const isSelected = selected === opt.id;
          const isCorrectOption =
            status === "answered" && result?.correctAnswer === opt.id;
          const isWrongSelected =
            status === "answered" && isSelected && !result?.isCorrect;

          let borderColor = "#E5E7EB";
          let bg = "#FFFFFF";
          let textColor = "#374151";

          if (isCorrectOption) {
            borderColor = "#059669";
            bg = "#F0FDF4";
            textColor = "#059669";
          } else if (isWrongSelected) {
            borderColor = "#DC2626";
            bg = "#FEF2F2";
            textColor = "#DC2626";
          } else if (isSelected && status === "submitting") {
            borderColor = "#3A0CA3";
          }

          return (
            <button
              key={opt.id}
              type="button"
              disabled={status !== "idle"}
              onClick={() => handleSelect(opt.id)}
              className="flex items-center justify-between text-left text-base px-4 py-3 rounded-xl transition-colors disabled:cursor-default"
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
              {isCorrectOption && (
                <CheckCircle2 size={16} style={{ color: "#059669" }} />
              )}
              {isWrongSelected && (
                <XCircle size={16} style={{ color: "#DC2626" }} />
              )}
            </button>
          );
        })}
      </div>

      {status === "answered" && result && (
        <>
          <div
            className="mt-3 rounded-lg p-3 text-sm leading-relaxed"
            style={{
              background: result.isCorrect ? "#F0FDF4" : "#FEF2F2",
              color: result.isCorrect ? "#166534" : "#991B1B",
            }}
          >
            <span className="font-semibold">
              {result.isCorrect
                ? `Correct — +${result.points} XP`
                : "Not quite"}{" "}
              ·{" "}
            </span>
            {result.explanation}
          </div>
          <Button
            type="button"
            onClick={onNext}
            variant="outline"
            size="lg"
            fullWidth
            className="mt-5"
          >
            {isLast ? "See results" : "Next question"}
          </Button>
        </>
      )}
    </div>
  );
}
