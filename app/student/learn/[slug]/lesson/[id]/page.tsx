"use client";

import { useRouter, useParams } from "next/navigation";
import { LessonHeader } from "../components/LessonHeader";
import { LockedLessonView } from "../components/LockedLessonView";
import { ContentBlockRenderer } from "../components/ContentBlockRenderer";
import { LessonQuiz } from "../components/LessonQuiz";
import { CompleteLessonBar } from "../components/CompleteLessonBar";
import { useMemo, useState } from "react";
import { BlockStepper } from "../components/BlockStepper";
import { ChevronLeft, ChevronRight, PanelLeft, X, Loader2 } from "lucide-react";
import { LessonSidebar } from "../components/LessonSidebar";
import {
  useGetLessonQuery,
  useAnswerLessonQuestionMutation,
  useCompleteLessonMutation,
  useGetTopicProgressQuery,
} from "@/apis/lessons/lessonsService";
import { useGetCourseDetailQuery } from "@/apis/dashboard/dashboardService";
import { ChatWidget } from "@/components/chat/ChatWidget";
import type { NavLessonItem, AnswerResult } from "@/apis/lessons/types";
import { LessonCompleteCTA } from "../components/LessonCompleteCTA";
import { Button } from "@/components";
import { LessonSidebarSkeleton } from "../components/LessonSidebarSkeleton";
import { LessonContentSkeleton } from "../components/LessonContentSkeleton";

const PAGINATE_THRESHOLD = 3;

export default function LessonDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const lessonId = params.id as string;
  const slug = params.slug as string;

  const { data: lesson, isLoading: lessonLoading } = useGetLessonQuery(
    lessonId,
    {
      skip: !lessonId,
    },
  );

  const { data: courseDetail } = useGetCourseDetailQuery(slug, {
    skip: !slug,
  });

  const { data: progressData, isLoading: progressLoading } =
    useGetTopicProgressQuery(slug, {
      skip: !slug,
    });

  const [answerMutation] = useAnswerLessonQuestionMutation();
  const [completeMutation] = useCompleteLessonMutation();

  // Build nav lessons from progress data
  const navLessons: NavLessonItem[] = useMemo(() => {
    if (!progressData?.lessons) return [];
    return progressData.lessons.map((l) => ({
      id: l.id || `lesson-${l.order}`,
      order: l.order,
      title: l.title,
      status: l.isCompleted
        ? "completed"
        : l.id === lessonId || l.order === lesson?.order
          ? "current"
          : "locked",
    }));
  }, [progressData, lessonId, lesson?.order]);

  // Get tutor from course detail
  const tutor = courseDetail?.tutors?.[0] || null;

  const sortedBlocks = lesson
    ? [...lesson.contentBlocks].sort((a, b) => a.order - b.order)
    : [];
  const hasQuiz = lesson ? lesson.questions.length > 0 : false;
  const shouldPaginate = sortedBlocks.length >= PAGINATE_THRESHOLD;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [visited, setVisited] = useState<Set<number>>(new Set([0]));
  const [navOpen, setNavOpen] = useState(false);

  const totalSteps = sortedBlocks.length + (hasQuiz ? 1 : 0);
  const isQuizStep = currentIndex === sortedBlocks.length;
  const isLastStep = currentIndex === totalSteps - 1;
  // const [currentIndex, setCurrentIndex] = useState(0);
  const [maxReached, setMaxReached] = useState(0);

  const goTo = (index: number) => {
    if (index > maxReached + 1) return; // hard stop — can't skip via URL manipulation either
    setCurrentIndex(index);
    setMaxReached((prev) => Math.max(prev, index));
  };
  // const goTo = (index: number) => {
  //   setCurrentIndex(index);
  //   setVisited((prev) => new Set(prev).add(index));
  //   setNavOpen(false);
  // };

  const [correctCount, setCorrectCount] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);

  const handleAnswer = async (
    questionId: string,
    selectedOptionId: string,
  ): Promise<AnswerResult> => {
    try {
      const result = await answerMutation({
        lessonId,
        questionId,
        selectedOption: selectedOptionId,
      }).unwrap();

      // Track score for lesson completion
      setTotalAnswered((prev) => prev + 1);
      if (result.isCorrect) {
        setCorrectCount((prev) => prev + 1);
      }

      return result;
    } catch {
      return {
        isCorrect: false,
        correctAnswer: "",
        explanation: "Failed to submit answer. Please try again.",
        points: 0,
      };
    }
  };

  const [nextLessonId, setNextLessonId] = useState<string | null>(null);

  const handleComplete = async () => {
    try {
      // Calculate score as percentage of correct answers
      const score =
        totalAnswered > 0
          ? Math.round((correctCount / totalAnswered) * 100)
          : 100; // If no questions answered, default to 100 (content-only lesson)

      const result = await completeMutation({ lessonId, score }).unwrap();
      if (result.nextLesson) {
        setNextLessonId(result.nextLesson?.id);
      }
      return { xpEarned: result.xpEarned };
    } catch {
      return { xpEarned: 0 };
    }
  };

  const handleGoNext = () => {
    if (nextLessonId) {
      router.push(`/student/learn/${slug}/lesson/${nextLessonId}`);
    } else {
      router.push(`/student/learn/${slug}`);
    }
  };

  const handleLessonSelect = (selectedLessonId: string) => {
    router.push(`/student/learn/${slug}/lesson/${selectedLessonId}`);
  };

  return (
    <div className="h-screen w-full grid grid-cols-1 lg:grid-cols-[450px_1fr]">
      <div
        className="hidden lg:block overflow-y-auto px-5 py-6"
        style={{ borderRight: "1px solid #EDEDED" }}
      >
        {progressLoading ? (
          <LessonSidebarSkeleton />
        ) : (
          <LessonSidebar
            lessons={navLessons}
            activeLessonId={lessonId}
            onSelect={handleLessonSelect}
          />
        )}
      </div>

      <div className="overflow-y-auto">
        {lessonLoading || !lesson ? (
          <LessonContentSkeleton />
        ) : lesson.isLocked ? (
          <div className="min-h-full w-full flex items-center justify-center">
            <LockedLessonView
              title={lesson.title}
              duration={lesson.duration}
              lockReason={lesson.lockReason}
              onBack={() => router.push(`/student/learn/${slug}`)}
            />
          </div>
        ) : (
          <div className="p-10">
            {/* mobile toolbar */}
            <div className="flex items-center justify-between lg:hidden mb-2">
              <button
                type="button"
                onClick={() => setNavOpen(true)}
                className="flex items-center gap-1.5 text-[12.5px] font-medium px-3 py-1.5 rounded-full"
                style={{ background: "#F5EEFE", color: "#3A0CA3" }}
              >
                <PanelLeft size={13} />
                Lessons
              </button>
            </div>

            <LessonHeader
              courseName={lesson.topic?.name || courseDetail?.course?.name}
              title={lesson.title}
              order={lesson.order}
              duration={lesson.duration}
              onBack={() => router.push(`/student/learn/${slug}`)}
            />

            {shouldPaginate ? (
              <>
                <BlockStepper
                  blocks={sortedBlocks}
                  hasQuiz={hasQuiz}
                  currentIndex={currentIndex}
                  maxReached={maxReached}
                  onSelect={goTo}
                />

                {!isQuizStep && (
                  <ContentBlockRenderer
                    block={sortedBlocks[currentIndex]}
                    onAnswer={handleAnswer}
                  />
                )}
                {isQuizStep && (
                  <LessonQuiz
                    questions={lesson.questions}
                    onAnswer={handleAnswer}
                  />
                )}

                {isLastStep && (
                  <LessonCompleteCTA
                    calculatedScore={totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : null}
                    totalPossiblePoints={totalAnswered}
                    onComplete={handleComplete}
                    hasNextLesson={!!nextLessonId}
                    onGoNext={handleGoNext}
                    courseId={slug}
                  />
                )}

                <div className="flex items-center justify-between mt-2">
                  <button
                    type="button"
                    disabled={currentIndex === 0}
                    onClick={() => goTo(currentIndex - 1)}
                    className="flex items-center gap-1 text-base font-medium px-4 py-2 rounded-full disabled:opacity-0"
                    style={{ color: "#3A0CA3" }}
                  >
                    <ChevronLeft size={15} />
                    Previous
                  </button>

                  {!isLastStep && (
                    <Button
                      type="button"
                      variant="outline"
                      size="lg"
                      onClick={() => goTo(currentIndex + 1)}
                    >
                      Continue
                      <ChevronRight size={15} />
                    </Button>
                  )}
                </div>
              </>
            ) : (
              <>
                {sortedBlocks.map((block) => (
                  <ContentBlockRenderer
                    key={block.order}
                    block={block}
                    onAnswer={handleAnswer}
                  />
                ))}
                <LessonQuiz
                  questions={lesson.questions}
                  onAnswer={handleAnswer}
                />
                <LessonCompleteCTA
                  calculatedScore={null}
                  totalPossiblePoints={0}
                  onComplete={handleComplete}
                  hasNextLesson={!!nextLessonId}
                  onGoNext={handleGoNext}
                    courseId={slug}
                />
              </>
            )}
          </div>
        )}
        {/* <div className="fixed bottom-4 left-0 right-0 lg:left-[300px] px-4">
          <div className="max-w-2xl mx-auto">
            <CompleteLessonBar
              visitedSteps={visited.size}
              totalPossiblePoints={totalAnswered}
              onComplete={handleComplete}
              hasNextLesson={!!nextLessonId}
              onGoNext={handleGoNext}
                    courseId={slug}
            />
          </div>
        </div> */}
      </div>

      {/* mobile lesson nav drawer */}
      {navOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="w-72 bg-white h-full overflow-y-auto px-5 py-6 shadow-xl">
            <div className="flex justify-end mb-2">
              <button type="button" onClick={() => setNavOpen(false)}>
                <X size={18} style={{ color: "#8A8A8A" }} />
              </button>
            </div>
            <LessonSidebar
              lessons={navLessons}
              activeLessonId={lessonId}
              onSelect={handleLessonSelect}
            />
          </div>
          <div
            className="flex-1"
            style={{ background: "rgba(0,0,0,0.3)" }}
            onClick={() => setNavOpen(false)}
          />
        </div>
      )}

      {/* Floating chat widget — talks to assigned tutor */}
      {tutor && (
        <ChatWidget
          recipientId={tutor.id}
          recipientName={`${tutor.firstName} ${tutor.lastName}`}
          recipientAvatar={tutor.avatar}
        />
      )}
    </div>
  );
}
