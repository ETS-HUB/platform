import { ClipboardCheck } from "lucide-react";
import type { LessonQuestion, AnswerResult } from "@/apis/lessons/types";
import { InlineQuestion } from "./InlineQuestion";

export function LessonQuiz({
  questions,
  onAnswer,
}: {
  questions: LessonQuestion[];
  onAnswer: (
    questionId: string,
    selectedOptionId: string,
  ) => Promise<AnswerResult>;
}) {
  if (questions.length === 0) return null;

  return (
    <div
      className="rounded-2xl p-6 mb-4"
      style={{ background: "#F5EEFE", border: "1.5px solid #DDC9F0" }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ClipboardCheck size={17} style={{ color: "#3A0CA3" }} />
          <h3 className="text-[15px] font-bold" style={{ color: "#0e1430" }}>
            Lesson quiz
          </h3>
        </div>
        <span className="text-[12px] font-medium" style={{ color: "#8B84A0" }}>
          {questions.length} {questions.length === 1 ? "question" : "questions"}
        </span>
      </div>
      <div className="flex flex-col gap-3">
        {questions.map((q, i) => (
          <InlineQuestion
            key={q.id}
            question={q}
            index={i + 1}
            onAnswer={onAnswer}
          />
        ))}
      </div>
    </div>
  );
}
