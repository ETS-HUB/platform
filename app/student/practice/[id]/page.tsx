"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Skeleton } from "antd";
import { PriorityBadge } from "../components/PriorityBadge";
import { ScoreTrendChart } from "../components/ScoreTrendChart";
import { SessionHistoryList } from "../components/SessionHistoryList";
import { SessionCountPicker } from "../components/SessionCountPicker";
import { PracticeQuestionCard } from "../components/PracticeQuestionCard";
import { SessionCompleteScreen } from "../components/SessionCompleteScreen";
import type {
  PracticeStartResponse,
  PracticeAnswerResponse,
  PracticeCompleteResponse,
  PracticeSession,
} from "@/apis/student/types";
import Header from "@/components/ui/Header";
import {
  useGetPracticeTopicsQuery,
  useStartPracticeMutation,
  useSubmitPracticeAnswerMutation,
  useCompletePracticeMutation,
  useGetPracticeHistoryQuery,
  useGetPracticeProgressQuery,
} from "@/apis/student/studentService";

type ViewState = "overview" | "session" | "complete";

export default function PracticeDetailPage() {
  const router = useRouter();
  const params = useParams();
  const topicId = params.id as string;

  // Data queries
  const { data: topics = [], isLoading: topicsLoading } =
    useGetPracticeTopicsQuery();
  const { data: historyData, isLoading: historyLoading } =
    useGetPracticeHistoryQuery();
  const { data: progressData, isLoading: progressLoading } =
    useGetPracticeProgressQuery(topicId, {
      skip: !topicId,
    });

  // Mutations
  const [startPractice] = useStartPracticeMutation();
  const [submitAnswer] = useSubmitPracticeAnswerMutation();
  const [completePractice] = useCompletePracticeMutation();

  // Derive topic from topics list
  const topic = topics.find((t) => t.id === topicId) ?? null;

  // Filter history to this topic
  const history = (historyData?.sessions ?? []).filter(
    (s): s is PracticeSession => s.topicId === topicId,
  );
  const progress = progressData ?? { totalSessions: 0, progress: [] };

  // Session state
  const [view, setView] = useState<ViewState>("overview");
  const [session, setSession] = useState<PracticeStartResponse | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [completeResult, setCompleteResult] =
    useState<PracticeCompleteResponse | null>(null);

  const handleStart = async (count: number) => {
    if (!topicId) return;
    try {
      const data = await startPractice({ topicId, count }).unwrap();
      setSession(data);
      setQuestionIndex(0);
      setCorrectCount(0);
      setView("session");
    } catch (err) {
      console.error("Failed to start practice session:", err);
    }
  };

  const handleAnswer = async (
    questionId: string,
    selectedOptionId: string,
  ): Promise<PracticeAnswerResponse> => {
    try {
      const result = await submitAnswer({
        questionId,
        selectedOption: selectedOptionId,
      }).unwrap();
      if (result.isCorrect) setCorrectCount((c) => c + 1);
      return result;
    } catch {
      return {
        isCorrect: false,
        correctAnswer: "",
        explanation: "Failed to submit. Please try again.",
        points: 0,
      };
    }
  };

  const handleNext = async () => {
    if (!session) return;

    if (questionIndex + 1 < session.totalQuestions) {
      setQuestionIndex((i) => i + 1);
      return;
    }

    // Last question — complete the session
    try {
      const result = await completePractice({
        sessionId: session.sessionId,
        correctAnswers: correctCount,
      }).unwrap();
      setCompleteResult(result);
      setView("complete");
    } catch (err) {
      console.error("Failed to complete session:", err);
    }
  };

  const handleBackToTopic = () => {
    setSession(null);
    setCompleteResult(null);
    setView("overview");
  };

  const isLoading = topicsLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen w-full">
        <div
          className="rounded-2xl p-6"
          style={{ background: "#FFFFFF", border: "1.5px solid #EDE0FB" }}
        >
          <Skeleton active paragraph={{ rows: 4 }} />
        </div>
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <p className="text-sm text-gray-500">Topic not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full">
      <button
        type="button"
        onClick={() =>
          view === "overview"
            ? router.push("/student/practice")
            : handleBackToTopic()
        }
        className="flex items-center gap-1.5 cursor-pointer hover:scale-105 transition-transform text-base font-medium mb-5"
        style={{ color: "#8A8A8A" }}
      >
        <ArrowLeft size={20} />
        {view === "overview" ? "All topics" : "Exit session"}
      </button>

      {view === "overview" && (
        <>
          <div className="mb-6">
            <PriorityBadge priority={topic.recommendedPriority} />
            <Header
              title={topic.name}
              subtitle={`${topic._count.questions} questions · ${progress.totalSessions} sessions completed`}
            />
          </div>

          <div
            className="rounded-2xl p-6 mb-6"
            style={{ background: "#FFFFFF", border: "1.5px solid #EDE0FB" }}
          >
            <h3
              className="text-[13px] font-bold mb-3"
              style={{ color: "#0e1430" }}
            >
              Score trend
            </h3>
            {progressLoading ? (
              <Skeleton active paragraph={{ rows: 2 }} />
            ) : (
              <ScoreTrendChart progress={progress.progress} />
            )}
          </div>

          <div className="mb-6">
            <SessionCountPicker
              maxAvailable={topic._count.questions}
              onStart={handleStart}
            />
          </div>

          <div
            className="rounded-2xl p-6"
            style={{ background: "#FFFFFF", border: "1.5px solid #EDE0FB" }}
          >
            <h3 className="text-sm font-semibold mb-2 text-[#0e1430] uppercase tracking-wide">
              Recent sessions
            </h3>
            {historyLoading ? (
              <Skeleton active paragraph={{ rows: 3 }} />
            ) : (
              <SessionHistoryList sessions={history} />
            )}
          </div>
        </>
      )}

      {view === "session" && session && (
        <PracticeQuestionCard
          key={session.questions[questionIndex].id}
          question={session.questions[questionIndex]}
          questionNumber={questionIndex + 1}
          totalQuestions={session.totalQuestions}
          onAnswer={handleAnswer}
          onNext={handleNext}
        />
      )}

      {view === "complete" && completeResult && (
        <SessionCompleteScreen
          result={completeResult}
          previousBest={topic.lastScore}
          onRetry={() => handleStart(completeResult.totalQuestions)}
          onBackToTopic={handleBackToTopic}
        />
      )}
    </div>
  );
}
