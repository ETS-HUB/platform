"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  ChevronRight,
  RotateCcw,
  Trophy,
} from "lucide-react";

import { useGetContentQuery } from "@/apis/ai/aiService";
import type { QuizQuestion, AiQuizContent } from "@/apis/ai/types";
import RoadmapNav from "@/app/roadmap/[slug]/components/RoadmapNav";
import HomeFooter from "@/app/(marketing)/components/HomeFooter";

const DIFFICULTY_STYLE: Record<string, { bg: string; color: string }> = {
  EASY: { bg: "#DCFCE7", color: "#166534" },
  MEDIUM: { bg: "#FEF9C3", color: "#854D0E" },
  HARD: { bg: "#FEE2E2", color: "#991B1B" },
};

const OPTION_LETTERS = ["a", "b", "c", "d"] as const;

function QuestionCard({
  question,
  index,
  total,
  onAnswer,
}: {
  question: QuizQuestion;
  index: number;
  total: number;
  onAnswer: (optionId: string) => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const submitted = selected !== null;
  const isCorrect = selected === question.correctAnswer;
  const diff = DIFFICULTY_STYLE[question.difficulty] ?? DIFFICULTY_STYLE.MEDIUM;

  const handleSelect = (id: string) => {
    if (submitted) return;
    setSelected(id);
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-center justify-between">
        <span className="text-[13px]" style={{ color: "#6B7280" }}>
          Question {index + 1} of {total}
        </span>
        <span
          className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
          style={{ background: diff.bg, color: diff.color }}
        >
          {question.difficulty}
        </span>
      </div>

      <div className="mb-6 h-1.5 w-full overflow-hidden rounded-full bg-[#F3E8FF]">
        <div
          className="h-full rounded-full transition-all"
          style={{
            width: `${((index + 1) / total) * 100}%`,
            background: "#3A0CA3",
          }}
        />
      </div>

      <div
        className="mb-5 rounded-2xl border bg-white p-6"
        style={{ borderColor: "#EDE0FB" }}
      >
        <p
          className="text-[16px] font-semibold leading-relaxed"
          style={{ color: "#0e1430" }}
        >
          {question.text}
        </p>

        {question.codeBlock && (
          <pre
            className="mt-4 overflow-x-auto rounded-xl p-4 text-[13px] leading-relaxed"
            style={{ background: "#1E1B4B", color: "#E9D5FF" }}
          >
            <code>{question.codeBlock.code}</code>
          </pre>
        )}
      </div>

      <div className="space-y-3">
        {question.options.map((opt) => {
          const isSelected = selected === opt.id;
          const isAnswer = opt.id === question.correctAnswer;
          let borderColor = "#EDE0FB";
          let bgColor = "#FFFFFF";
          let textColor = "#374151";

          if (submitted) {
            if (isAnswer) {
              borderColor = "#16A34A";
              bgColor = "#F0FDF4";
              textColor = "#166534";
            } else if (isSelected && !isAnswer) {
              borderColor = "#DC2626";
              bgColor = "#FFF1F2";
              textColor = "#991B1B";
            }
          } else if (isSelected) {
            borderColor = "#3A0CA3";
            bgColor = "#F3E8FF";
          }

          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => handleSelect(opt.id)}
              disabled={submitted}
              className="flex w-full items-center gap-4 rounded-xl border-2 p-4 text-left transition-all disabled:cursor-default"
              style={{ borderColor, background: bgColor }}
            >
              <span
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[13px] font-bold"
                style={{
                  background:
                    submitted && isAnswer
                      ? "#16A34A"
                      : submitted && isSelected
                        ? "#DC2626"
                        : isSelected
                          ? "#3A0CA3"
                          : "#F3E8FF",
                  color:
                    submitted && (isAnswer || isSelected)
                      ? "#fff"
                      : isSelected
                        ? "#fff"
                        : "#3A0CA3",
                }}
              >
                {opt.id.toUpperCase()}
              </span>
              <span
                className="flex-1 text-[14px] font-medium"
                style={{ color: textColor }}
              >
                {opt.text}
              </span>
              {submitted && isAnswer && (
                <CheckCircle2 size={18} style={{ color: "#16A34A" }} />
              )}
              {submitted && isSelected && !isAnswer && (
                <XCircle size={18} style={{ color: "#DC2626" }} />
              )}
            </button>
          );
        })}
      </div>

      {submitted && (
        <div
          className="mt-5 rounded-xl border p-4"
          style={{
            borderColor: isCorrect ? "#86EFAC" : "#FCA5A5",
            background: isCorrect ? "#F0FDF4" : "#FFF1F2",
          }}
        >
          <p
            className="mb-1 text-[13px] font-semibold"
            style={{ color: isCorrect ? "#16A34A" : "#DC2626" }}
          >
            {isCorrect ? "✓ Correct!" : "✗ Incorrect"}
          </p>
          <p
            className="text-[13.5px] leading-relaxed"
            style={{ color: "#374151" }}
          >
            {question.explanation}
          </p>
        </div>
      )}

      {submitted && (
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={() => onAnswer(selected!)}
            className="flex items-center gap-2 rounded-full px-6 py-2.5 text-[13.5px] font-semibold text-white"
            style={{ background: "linear-gradient(135deg, #3A0CA3, #7C3AED)" }}
          >
            {index + 1 < total ? (
              <>
                Next <ChevronRight size={15} />
              </>
            ) : (
              <>
                Finish <Trophy size={15} />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

function ResultScreen({
  score,
  total,
  onRetry,
}: {
  score: number;
  total: number;
  onRetry: () => void;
}) {
  const pct = Math.round((score / total) * 100);
  const color = pct >= 70 ? "#16A34A" : pct >= 40 ? "#D97706" : "#DC2626";

  return (
    <div className="mx-auto max-w-md py-16 text-center">
      <div
        className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full text-[32px] font-extrabold"
        style={{ background: "#F3E8FF", color }}
      >
        {pct}%
      </div>
      <h2 className="text-[24px] font-extrabold" style={{ color: "#0e1430" }}>
        {pct >= 70
          ? "Great job! 🎉"
          : pct >= 40
            ? "Good effort! 📚"
            : "Keep practising! 💪"}
      </h2>
      <p className="mt-2 text-[14.5px]" style={{ color: "#6B7280" }}>
        You got {score} out of {total} questions correct.
      </p>

      <div
        className="mx-auto mt-8 max-w-xs rounded-2xl border p-5"
        style={{ borderColor: "#EDE0FB" }}
      >
        <div className="h-3 w-full overflow-hidden rounded-full bg-[#F3E8FF]">
          <div
            className="h-full rounded-full"
            style={{ width: `${pct}%`, background: color }}
          />
        </div>
        <div
          className="mt-3 flex justify-between text-[12.5px]"
          style={{ color: "#9CA3AF" }}
        >
          <span>{score} correct</span>
          <span>{total - score} wrong</span>
        </div>
      </div>

      <button
        type="button"
        onClick={onRetry}
        className="mt-8 flex items-center gap-2 rounded-full px-6 py-3 text-[13.5px] font-semibold text-white mx-auto"
        style={{ background: "linear-gradient(135deg, #3A0CA3, #7C3AED)" }}
      >
        <RotateCcw size={14} />
        Try Again
      </button>
    </div>
  );
}

export default function AiQuizPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: content, isLoading } = useGetContentQuery(id, { skip: !id });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [attempt, setAttempt] = useState(0); // key for remounting on retry

  const handleAnswer = (selectedId: string) => {
    const quiz = content?.content as AiQuizContent | undefined;
    if (!quiz) return;
    const q = quiz.questions[currentIndex];
    if (selectedId === q.correctAnswer) setScore((s) => s + 1);

    if (currentIndex + 1 >= quiz.questions.length) {
      setFinished(true);
    } else {
      setCurrentIndex((i) => i + 1);
    }
  };

  const handleRetry = () => {
    setCurrentIndex(0);
    setScore(0);
    setFinished(false);
    setAttempt((a) => a + 1);
  };

  if (isLoading) {
    return (
      <div
        className="min-h-screen flex flex-col"
        style={{ background: "#FAFAFA" }}
      >
        <section className="relative overflow-hidden bg-[#151c31]/95">
          <RoadmapNav />
          <div className="relative max-w-4xl mx-auto px-6 pt-28 pb-14 text-center">
            <div
              className="h-10 w-64 mx-auto rounded-lg animate-pulse"
              style={{ background: "rgba(255,255,255,0.15)" }}
            />
          </div>
        </section>
        <div className="flex-1 flex items-center justify-center">
          <div
            className="inline-block w-10 h-10 rounded-full border-4 border-solid animate-spin"
            style={{
              borderColor: "#3A0CA3 transparent transparent transparent",
            }}
          />
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-[14px]" style={{ color: "#9CA3AF" }}>
          Quiz not found.
        </p>
      </div>
    );
  }

  const quiz = content.content as AiQuizContent;
  const questions = quiz?.questions ?? [];

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#151c31]/95 font-family-outfit">
        <RoadmapNav />
        <div
          className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full opacity-20 blur-3xl"
          style={{ background: "#A78BFA" }}
        />
        <div className="relative mx-auto max-w-4xl px-6 pt-28 pb-14 sm:pt-32 sm:pb-20">
          <button
            type="button"
            onClick={() => router.back()}
            className="mb-6 flex items-center gap-1.5 text-[13px] font-medium transition-colors hover:text-white"
            style={{ color: "rgba(255,255,255,0.6)" }}
          >
            <ArrowLeft size={14} />
            Back
          </button>
          <span
            className="inline-flex items-center text-[12px] font-semibold px-3 py-1 rounded-full mb-5"
            style={{
              background: "rgba(255,255,255,0.14)",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.25)",
            }}
          >
            AI Quiz
          </span>
          <h1 className="mt-3 text-[28px] font-extrabold leading-tight tracking-tight text-white sm:text-[38px]">
            {content.title}
          </h1>
          <p
            className="mt-2 text-[14px]"
            style={{ color: "rgba(255,255,255,0.65)" }}
          >
            {questions.length} questions · Multiple choice
          </p>
        </div>
      </section>

      <div className="min-h-screen bg-[#FAFAFA] px-4 py-10 sm:px-6">
        {questions.length === 0 ? (
          <p className="text-center text-[14px]" style={{ color: "#9CA3AF" }}>
            No questions found in this quiz.
          </p>
        ) : finished ? (
          <ResultScreen
            score={score}
            total={questions.length}
            onRetry={handleRetry}
          />
        ) : (
          <QuestionCard
            key={`${attempt}-${currentIndex}`}
            question={questions[currentIndex]}
            index={currentIndex}
            total={questions.length}
            onAnswer={handleAnswer}
          />
        )}
      </div>

      <HomeFooter />
    </>
  );
}
