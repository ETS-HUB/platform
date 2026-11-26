import { ArrowLeft, Clock } from "lucide-react";

export function LessonHeader({
  courseName,
  title,
  order,
  duration,
  onBack,
}: {
  courseName?: string;
  title: string;
  order: number;
  duration: number;
  onBack: () => void;
}) {
  return (
    <div className="mb-6">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-2 text-base font-medium mb-4 transition-colors hover:text-[#3A0CA3] text-[#8B84A0]"
      >
        <ArrowLeft size={20} />
        {courseName ?? "Back to course"}
      </button>
      <div className="flex items-center gap-2 mb-1">
        <span className="text-base font-bold px-2 py-0.5 rounded-full bg-[#F5EEFE] text-[#3A0CA3]">
          Lesson {order}
        </span>
        <span className="inline-flex items-center gap-1 text-base text-[#8B84A0] font-medium">
          <Clock size={20} />
          {duration} min
        </span>
      </div>
      {/* <h1 className="text-2xl font-noto sm:text-3xl my-3 font-medium text-[#0e1430] tracking-wide">{title}</h1> */}
    </div>
  );
}
