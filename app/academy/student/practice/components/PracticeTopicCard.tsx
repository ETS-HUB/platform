import { ChevronRight, HelpCircle } from "lucide-react";
import { PriorityBadge } from "./PriorityBadge";
import type { PracticeTopic } from "@/apis/student/types";

export function PracticeTopicCard({
  topic,
  onClick,
}: {
  topic: PracticeTopic;
  onClick: () => void;
}) {
  const attempted = topic.lastScore !== null;
  const scoreColor = !attempted
    ? "#9CA3AF"
    : topic.lastScore! >= 70
      ? "#059669"
      : topic.lastScore! >= 40
        ? "#D97706"
        : "#DC2626";

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full cursor-pointer bg-white border-[#EDE0FB] text-left flex items-center justify-between gap-4 rounded-2xl p-5 transition-shadow hover:shadow-md"
    >
      <div className="flex flex-col gap-2 min-w-0">
        <PriorityBadge priority={topic.recommendedPriority} />
        <h3
          className="text-base font-semibold truncate text-[#0e1430]"
        >
          {topic.name}
        </h3>
        <span
          className="inline-flex items-center gap-1.5 text-sm text-[#8B84A0]"
        >
          <HelpCircle size={12} />
          {topic._count.questions} questions available
        </span>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <div className="flex flex-col items-end capitalize">
          <span
            className="text-[20px] font-bold leading-none"
            style={{ color: scoreColor }}
          >
            {attempted ? `${topic.lastScore}%` : "—"}
          </span>
          <span className="text-xs mt-1 text-gray-500">
            {attempted ? "last score" : "not attempted"}
          </span>
        </div>
        <ChevronRight size={18} style={{ color: "#C9BEDD" }} />
      </div>
    </button>
  );
}
