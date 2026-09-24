import { PartyPopper, RotateCcw, ArrowLeft } from "lucide-react";
import type { PracticeCompleteResponse } from "@/apis/student/types";
import Image from "next/image";
import { IMAGES } from "@/constants/images";

export function SessionCompleteScreen({
  result,
  previousBest,
  onRetry,
  onBackToTopic,
}: {
  result: PracticeCompleteResponse;
  previousBest: number | null;
  onRetry: () => void;
  onBackToTopic: () => void;
}) {
  const color =
    result.percentage >= 70
      ? "#059669"
      : result.percentage >= 40
        ? "#D97706"
        : "#DC2626";
  const improved = previousBest !== null && result.percentage > previousBest;

  return (
    <div
      className="rounded-2xl p-8 flex flex-col items-center text-center"
      style={{ background: "#FFFFFF", border: "1.5px solid #EDE0FB" }}
    >
      {result.percentage < 70 ? (
        <div className="mb-4">
          <Image
            src={IMAGES.LowScoreImage}
            width={160}
            height={160}
            alt="Session complete"
          />
        </div>
      ) : (
        <div
          className="flex items-center justify-center rounded-full w-14 h-14 mb-4"
          style={{ background: `${color}15` }}
        >
          <PartyPopper size={24} style={{ color }} />
        </div>
      )}

      <p className="text-base font-medium mb-1" style={{ color: "#8B84A0" }}>
        Session complete
      </p>
      <p className="text-[40px] font-bold leading-none mb-2" style={{ color }}>
        {result.percentage}%
      </p>
      <p className="text-base mb-1" style={{ color: "#6B7280" }}>
        {result.correctAnswers}/{result.totalQuestions} correct · +
        {result.xpEarned} XP
      </p>

      {improved && (
        <span
          className="inline-block text-[11.5px] font-semibold px-3 py-1 rounded-full mt-2"
          style={{ background: "#F0FDF4", color: "#059669" }}
        >
          ↑ Improved from {previousBest}%
        </span>
      )}

      <div className="flex items-center gap-2 mt-6 w-full">
        <button
          type="button"
          onClick={onBackToTopic}
          className="flex-1 cursor-pointer flex items-center justify-center gap-1.5 text-[13.5px] font-medium py-2.5 rounded-full"
          style={{ border: "1.5px solid #EDE0FB", color: "#3A0CA3" }}
        >
          <ArrowLeft size={14} />
          Back
        </button>
        <button
          type="button"
          onClick={onRetry}
          className="flex-1 cursor-pointer flex items-center justify-center gap-1.5 text-[13.5px] font-semibold py-2.5 rounded-full text-white"
          style={{ background: "#3A0CA3" }}
        >
          <RotateCcw size={14} />
          Practice again
        </button>
      </div>
    </div>
  );
}
