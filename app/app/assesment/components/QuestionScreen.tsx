"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Clock, ArrowRight, CheckCircle } from "lucide-react";
import type { Question } from "@/apis/assessment/types";

interface QuestionScreenProps {
  questions: Question[];
  timeLimitMinutes: number;
  onAnswer: (
    questionId: string,
    selectedOption: string,
    timeTaken: number,
  ) => void;
  onComplete: () => void;
}

export function QuestionScreen({
  questions,
  timeLimitMinutes,
  onAnswer,
  onComplete,
}: QuestionScreenProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [answeredIds, setAnsweredIds] = useState<Set<string>>(new Set());
  const [timeLeft, setTimeLeft] = useState(timeLimitMinutes * 60);
  const questionStartRef = useRef(Date.now());

  const question = questions[currentIndex];
  const isLast = currentIndex === questions.length - 1;
  const totalAnswered = answeredIds.size;

  // Timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Auto-submit when timer expires
  useEffect(() => {
    if (timeLeft === 0) {
      onComplete();
    }
  }, [timeLeft, onComplete]);

  // Reset question start time when moving to a new question
  useEffect(() => {
    questionStartRef.current = Date.now();
    setSelectedOption(null);
  }, [currentIndex]);

  const handleNext = useCallback(() => {
    if (!selectedOption || !question) return;

    const timeTaken = Math.round(
      (Date.now() - questionStartRef.current) / 1000,
    );
    onAnswer(question.id, selectedOption, timeTaken);
    setAnsweredIds((prev) => new Set(prev).add(question.id));

    if (isLast) {
      onComplete();
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  }, [selectedOption, question, isLast, onAnswer, onComplete]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const timeWarning = timeLeft < 60;

  if (!question) return null;

  return (
    <div
      className="min-h-screen w-full flex flex-col px-4 py-8"
      style={{ background: "#F5EEFE" }}
    >
      {/* Top bar */}
      <div className="w-full max-w-2xl mx-auto flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <span
            className="text-[13px] font-medium px-2.5 py-1 rounded-full"
            style={{ background: "#EDE0FB", color: "#3A0CA3" }}
          >
            {currentIndex + 1} / {questions.length}
          </span>
          <span className="text-[12px]" style={{ color: "#8B84A0" }}>
            {question.topic} · {question.difficulty}
          </span>
        </div>

        <div
          className="flex items-center gap-1.5 text-[13px] font-medium px-3 py-1.5 rounded-full"
          style={{
            background: timeWarning ? "#FEE2E2" : "#EDE0FB",
            color: timeWarning ? "#DC2626" : "#3A0CA3",
          }}
        >
          <Clock size={13} />
          {formatTime(timeLeft)}
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-2xl mx-auto mb-8">
        <div className="h-1.5 rounded-full" style={{ background: "#EDE0FB" }}>
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${(totalAnswered / questions.length) * 100}%`,
              background: "#3A0CA3",
            }}
          />
        </div>
      </div>

      {/* Question card */}
      <div className="w-full max-w-2xl mx-auto flex-1 flex flex-col">
        <div
          className="rounded-xl p-6 sm:p-8 mb-6"
          style={{ background: "#FFFFFF", border: "1.5px solid #DDC9F0" }}
        >
          <div className="flex items-start gap-3 mb-6">
            <span
              className="text-[11px] font-bold px-2 py-0.5 rounded"
              style={{ background: "#EDE0FB", color: "#3A0CA3" }}
            >
              {question.points} pts
            </span>
          </div>

          <h2
            className="text-[17px] sm:text-[19px] font-medium leading-snug mb-8"
            style={{ color: "#0e1430" }}
          >
            {question.text}
          </h2>

          <div className="flex flex-col gap-3">
            {question.options.map((opt) => {
              const isSelected = selectedOption === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setSelectedOption(opt.id)}
                  className="w-full text-left flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all"
                  style={{
                    background: isSelected ? "#EDE0FB" : "#FAFAFA",
                    border: isSelected
                      ? "1.5px solid #3A0CA3"
                      : "1.5px solid #E5E7EB",
                  }}
                >
                  <span
                    className="w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-semibold shrink-0"
                    style={{
                      background: isSelected ? "#3A0CA3" : "#F3F4F6",
                      color: isSelected ? "#FFFFFF" : "#6B7280",
                    }}
                  >
                    {opt.id.toUpperCase()}
                  </span>
                  <span
                    className="text-[14px]"
                    style={{ color: isSelected ? "#3A0CA3" : "#374151" }}
                  >
                    {opt.text}
                  </span>
                  {isSelected && (
                    <CheckCircle
                      size={16}
                      className="ml-auto shrink-0"
                      style={{ color: "#3A0CA3" }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Next / Submit button */}
        <div className="flex justify-end">
          <button
            type="button"
            disabled={!selectedOption}
            onClick={handleNext}
            className="inline-flex items-center gap-2 text-[14px] font-semibold px-5 py-3 rounded-lg transition-all"
            style={{
              color: selectedOption ? "#FFFFFF" : "#B3A8C9",
              background: selectedOption ? "#3A0CA3" : "#EDE0FB",
              cursor: selectedOption ? "pointer" : "not-allowed",
            }}
          >
            {isLast ? "Submit Assessment" : "Next Question"}
            <ArrowRight size={15} strokeWidth={2.4} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default QuestionScreen;
