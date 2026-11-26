import { Lock, ArrowLeft } from "lucide-react";

export function LockedLessonView({
  title,
  duration,
  lockReason,
  onBack,
}: {
  title: string;
  duration: number;
  lockReason?: string | null;
  onBack: () => void;
}) {
  return (
    <div className="flex flex-col items-center text-center py-24 max-w-md mx-auto">
      <div
        className="flex items-center justify-center rounded-full w-14 h-14 mb-4"
        style={{ background: "#F5EEFE" }}
      >
        <Lock size={22} style={{ color: "#3A0CA3" }} />
      </div>
      <h1 className="text-[20px] font-bold mb-1.5" style={{ color: "#0e1430" }}>
        {title}
      </h1>
      <p className="text-[13px] mb-1" style={{ color: "#8B84A0" }}>
        {duration} min
      </p>
      <p className="text-[13.5px] mb-6" style={{ color: "#6B7280" }}>
        {lockReason ?? "Complete the previous lesson to unlock this one."}
      </p>
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1.5 text-[13.5px] font-semibold px-5 py-2.5 rounded-full text-white transition-transform hover:scale-[1.03] active:scale-[0.97]"
        style={{ background: "#3A0CA3" }}
      >
        <ArrowLeft size={14} />
        Back to course
      </button>
    </div>
  );
}
