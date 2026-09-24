"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  Clock,
  ListChecks,
  Zap,
  GraduationCap,
  ArrowRight,
  ChevronRight,
} from "lucide-react";

import type { RootState } from "@/store";
import {
  useGetAssessmentConfigsQuery,
  useStartAssessmentMutation,
  useSubmitAnswerMutation,
  useCompleteAssessmentMutation,
  useGenerateAiReportMutation,
  useCheckBadgesMutation,
  useGetCertificateQuery,
  useGetPercentileQuery,
} from "@/apis/assessment/assessmentService";
import type { PercentileResponse } from "@/apis/assessment/assessmentService";
import type {
  AssessmentConfig,
  AssessmentTrack,
  AssessmentDifficulty,
  StartAssessmentResponse,
  CompleteResponse,
  AiReportData,
  Badge,
  Certificate,
} from "@/apis/assessment/types";
import { QuestionScreen } from "./components/QuestionScreen";
import { StartingScreen } from "./components/StartingScreen";
import { ScoreScreen } from "./components/ScoreScreen";
import { AiReportScreen } from "./components/AiReportScreen";
import { BadgeScreen } from "./components/BadgeScreen";
import { CertificateScreen } from "./components/CertificateScreen";
import { ResultsScreen } from "./components/ResultsScreen";

type Step =
  | "pick"
  | "starting"
  | "questions"
  | "score"
  | "results"
  | "ai-report"
  | "badges"
  | "certificate";

// ---------------------------------------------------------------------------
// Config Picker
// ---------------------------------------------------------------------------
function AssessmentPicker({
  configs,
  loading,
  onContinue,
  onSkip,
}: {
  configs: AssessmentConfig[];
  loading: boolean;
  onContinue: (config: AssessmentConfig) => void;
  onSkip: () => void;
}) {
  const activeConfigs = useMemo(
    () => configs.filter((c) => c.isActive),
    [configs],
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = activeConfigs.find((c) => c.id === selectedId) || null;

  const stubNumber = (i: number) => String(i + 1).padStart(2, "0");

  if (loading) {
    return (
      <div
        className="min-h-screen w-full flex items-center justify-center px-4"
        style={{ background: "#F5EEFE" }}
      >
        <div className="text-center">
          <div
            className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-5 animate-pulse"
            style={{ background: "#EDE0FB" }}
          >
            <GraduationCap size={22} style={{ color: "#3A0CA3" }} />
          </div>
          <p className="text-[14px]" style={{ color: "#6B7280" }}>
            Loading assessments...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center px-4 py-12"
      style={{ background: "#F5EEFE" }}
    >
      <div className="w-full max-w-2xl">
        <div className="mb-8">
          <div
            className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.14em] uppercase px-2.5 py-1 rounded-full mb-4"
            style={{ color: "#3A0CA3", background: "#EDE0FB" }}
          >
            <GraduationCap size={13} strokeWidth={2.4} />
            Skill Assessment
          </div>
          <h1 className="text-[28px] font-lora sm:text-[32px] leading-tight mb-2 font-semibold">
            Choose your assessment
          </h1>
          <p className="text-[15px]" style={{ color: "#6B7280" }}>
            Pick the one that matches your time today. You can only take one
            right now.
          </p>
        </div>

        <div className="flex flex-col gap-4 mb-8">
          {activeConfigs.map((cfg, i) => {
            const isSelected = cfg.id === selectedId;
            return (
              <button
                key={cfg.id}
                type="button"
                onClick={() => setSelectedId(cfg.id)}
                aria-pressed={isSelected}
                className="group relative text-left w-full rounded-xl transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                style={{
                  background: "#FFFFFF",
                  border: isSelected
                    ? "1.5px solid #3A0CA3"
                    : "1.5px solid #DDC9F0",
                  boxShadow: isSelected
                    ? "0 4px 18px rgba(58,12,163,0.18)"
                    : "0 1px 2px rgba(20,20,20,0.03)",
                  outlineColor: "#3A0CA3",
                }}
              >
                <div className="flex items-stretch">
                  <div
                    className="w-1.5 rounded-l-xl transition-colors"
                    style={{
                      background: isSelected ? "#3A0CA3" : "transparent",
                    }}
                  />
                  <div className="flex-1 flex items-center gap-4 px-5 py-4">
                    <div
                      className="hidden sm:flex flex-col items-center justify-center w-11 h-11 rounded-lg shrink-0"
                      style={{
                        background: isSelected ? "#EDE0FB" : "#F5F4F0",
                        color: isSelected ? "#3A0CA3" : "#9CA3AF",
                        fontSize: 13,
                        fontWeight: 600,
                      }}
                    >
                      {stubNumber(i)}
                    </div>

                    <div
                      className="hidden sm:block self-stretch w-px"
                      style={{
                        backgroundImage:
                          "repeating-linear-gradient(to bottom, #DDC9F0 0, #DDC9F0 4px, transparent 4px, transparent 9px)",
                      }}
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3
                          className="text-[16px] font-semibold truncate"
                          style={{ color: "#0e1430" }}
                        >
                          {cfg.name}
                        </h3>
                        {cfg.isBoothMode && (
                          <span
                            className="inline-flex items-center gap-1 text-[10.5px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full"
                            style={{ color: "#F52593", background: "#FCE3F1" }}
                          >
                            <Zap size={10} strokeWidth={3} />
                            Booth
                          </span>
                        )}
                      </div>
                      <p
                        className="text-[13.5px] leading-snug mb-2"
                        style={{ color: "#6B7280" }}
                      >
                        {cfg.description}
                      </p>
                      <div
                        className="flex items-center gap-4 text-[12.5px]"
                        style={{ color: "#8B84A0" }}
                      >
                        <span className="inline-flex items-center gap-1">
                          <ListChecks size={13} />
                          {cfg.totalQuestions} questions
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Clock size={13} />
                          {cfg.timeLimitMinutes} min
                        </span>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center justify-center w-8">
                      {isSelected ? (
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center"
                          style={{
                            background: "#3A0CA3",
                            transform: "rotate(-6deg)",
                          }}
                        >
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <path
                              d="M5 13l4 4L19 7"
                              stroke="white"
                              strokeWidth="3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                      ) : (
                        <ChevronRight
                          size={16}
                          className="opacity-0 group-hover:opacity-40 transition-opacity"
                          style={{ color: "#0e1430" }}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={onSkip}
            className="text-[14px] font-medium px-4 py-2.5 rounded-lg transition-colors hover:bg-black/5"
            style={{ color: "#6B7280" }}
          >
            Skip for now
          </button>

          <button
            type="button"
            disabled={!selected}
            onClick={() => selected && onContinue(selected)}
            className="inline-flex items-center gap-2 text-[14px] font-semibold px-5 py-2.5 rounded-lg transition-all"
            style={{
              color: selected ? "#FFFFFF" : "#B3A8C9",
              background: selected ? "#3A0CA3" : "#EDE0FB",
              cursor: selected ? "pointer" : "not-allowed",
            }}
          >
            Continue
            <ArrowRight size={15} strokeWidth={2.4} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Assessment Page (orchestrator)
// ---------------------------------------------------------------------------
export default function AssessmentPage() {
  const router = useRouter();
  const { accessToken } = useSelector((state: RootState) => state.tokens);
  const { user } = useSelector((state: RootState) => state.auth);

  const [step, setStep] = useState<Step>("pick");
  const [selectedConfig, setSelectedConfig] = useState<AssessmentConfig | null>(
    null,
  );
  const [attemptData, setAttemptData] =
    useState<StartAssessmentResponse | null>(null);
  const [result, setResult] = useState<CompleteResponse | null>(null);
  const [aiReport, setAiReport] = useState<AiReportData | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [percentile, setPercentile] = useState<PercentileResponse | null>(null);
  const [resultsLoading, setResultsLoading] = useState(false);

  // RTK Query
  const { data: configs = [], isLoading: configsLoading } =
    useGetAssessmentConfigsQuery(undefined, {
      skip: !accessToken,
    });

  // Mutations
  const [startAssessmentMut] = useStartAssessmentMutation();
  const [submitAnswerMut] = useSubmitAnswerMutation();
  const [completeAssessmentMut] = useCompleteAssessmentMutation();
  const [generateAiReportMut] = useGenerateAiReportMutation();
  const [checkBadgesMut] = useCheckBadgesMutation();

  // Start assessment
  const handleStart = useCallback(
    async (config: AssessmentConfig) => {
      setSelectedConfig(config);
      setStep("starting");
      try {
        const data = await startAssessmentMut(config.id).unwrap();
        setAttemptData(data);
        setStep("questions");
      } catch (err) {
        console.error("Failed to start assessment:", err);
        toast.error("Failed to start assessment. Please try again.");
        setStep("pick");
      }
    },
    [startAssessmentMut],
  );

  // Submit an answer
  const handleAnswer = useCallback(
    (questionId: string, selectedOption: string, timeTaken: number) => {
      if (!attemptData) return;
      submitAnswerMut({
        attemptId: attemptData.attemptId,
        data: { questionId, selectedOption, timeTaken },
      }).catch((err) => {
        console.error("Failed to submit answer:", err);
      });
    },
    [attemptData, submitAnswerMut],
  );

  // Complete assessment
  const handleComplete = useCallback(async () => {
    if (!attemptData) return;
    setStep("starting");
    try {
      const completeResult = await completeAssessmentMut(
        attemptData.attemptId,
      ).unwrap();
      setResult(completeResult);
      setStep("score");
    } catch (err) {
      console.error("Failed to complete assessment:", err);
      toast.error("Failed to submit assessment.");
      setStep("questions");
    }
  }, [attemptData, completeAssessmentMut]);

  // Fetch results (badges + certificate + percentile)
  const handleResults = useCallback(async () => {
    if (!attemptData) return;
    setStep("results");
    setResultsLoading(true);

    try {
      const badgeList = await checkBadgesMut(attemptData.attemptId)
        .unwrap()
        .catch(() => [] as Badge[]);
      setBadges(badgeList);
    } catch {
      setBadges([]);
    }

    // Certificate and percentile are queries — fetch via lazy approach
    try {
      const certRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/gamification/certificate/${attemptData.attemptId}`,
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );
      if (certRes.ok) {
        const certData = await certRes.json();
        setCertificate(certData.certificate);
      }
    } catch {
      /* ignore */
    }

    try {
      const percRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/assessment/attempt/${attemptData.attemptId}/percentile`,
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );
      if (percRes.ok) {
        const percData = await percRes.json();
        setPercentile(percData);
      }
    } catch {
      /* ignore */
    }

    setResultsLoading(false);
  }, [attemptData, accessToken, checkBadgesMut]);

  // Generate AI report
  const handleAiReport = useCallback(async () => {
    if (!attemptData) return;
    setStep("ai-report");
    setAiLoading(true);
    try {
      const report = await generateAiReportMut(attemptData.attemptId).unwrap();
      setAiReport(report);
    } catch (err) {
      console.error("Failed to generate AI report:", err);
      toast.error("AI report generation failed.");
    } finally {
      setAiLoading(false);
    }
  }, [attemptData, generateAiReportMut]);

  // Skip to dashboard
  const handleSkip = () => {
    router.replace("/student/dashboard");
  };

  const handleDownload = () => {
    toast.success("Certificate download coming soon!");
  };

  const handleShare = () => {
    toast.success("Sharing feature coming soon!");
  };

  // Render based on step
  switch (step) {
    case "pick":
      return (
        <AssessmentPicker
          configs={configs}
          loading={configsLoading}
          onContinue={handleStart}
          onSkip={handleSkip}
        />
      );

    case "starting":
      return (
        <StartingScreen configName={selectedConfig?.name || "Assessment"} />
      );

    case "questions":
      if (!attemptData) return null;
      return (
        <QuestionScreen
          questions={attemptData.questions}
          timeLimitMinutes={attemptData.timeLimitMinutes}
          onAnswer={handleAnswer}
          onComplete={handleComplete}
        />
      );

    case "score":
      if (!result) return null;
      return <ScoreScreen result={result} onContinue={handleResults} />;

    case "results":
      return (
        <ResultsScreen
          loading={resultsLoading}
          result={result}
          badges={badges}
          certificate={certificate}
          percentile={percentile}
          studentName={user ? `${user.firstName} ${user.lastName}` : "Student"}
          onDone={handleSkip}
        />
      );

    case "ai-report":
      return (
        <AiReportScreen
          loading={aiLoading}
          report={aiReport}
          onContinue={handleResults}
          onRetry={handleAiReport}
        />
      );

    case "badges":
      return (
        <BadgeScreen loading={false} badges={badges} onContinue={handleSkip} />
      );

    case "certificate":
      return (
        <CertificateScreen
          loading={false}
          certificate={certificate}
          studentName={user ? `${user.firstName} ${user.lastName}` : "Student"}
          onDownload={handleDownload}
          onShare={handleShare}
        />
      );

    default:
      return null;
  }
}
