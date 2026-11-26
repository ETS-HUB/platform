import { TYPE_META } from "@/apis/roadmap/tutor/meta";
import type { LearningItem } from "@/apis/roadmap/tutor/types";

export default function ContentCard({
  item,
  onClick,
}: {
  item: LearningItem;
  onClick?: (item: LearningItem) => void;
}) {
  const meta = TYPE_META[item.type];
  const Icon = meta.icon;
  const pct = item.progress
    ? Math.round((item.progress.done / Math.max(item.progress.total, 1)) * 100)
    : null;

  return (
    <button
      type="button"
      onClick={() => onClick?.(item)}
      className="group flex h-full flex-col rounded-2xl border bg-white p-5 text-left transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#3A0CA3]/10"
      style={{ borderColor: "#EDE0FB" }}
    >
      <span
        className="inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold"
        style={{ background: meta.tint, color: meta.color }}
      >
        <Icon size={12} />
        {meta.label}
      </span>

      <h3 className="mt-3 text-[15.5px] font-bold" style={{ color: "#0e1430" }}>
        {item.title}
      </h3>
      <p
        className="mt-1.5 line-clamp-2 flex-1 text-[13px] leading-relaxed"
        style={{ color: "#6B7280" }}
      >
        {item.description}
      </p>

      <div className="mt-4">
        {pct !== null ? (
          <>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#F3E8FF]">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${pct}%`, background: meta.color }}
              />
            </div>
            <div
              className="mt-2 flex justify-between text-[11.5px]"
              style={{ color: "#9CA3AF" }}
            >
              <span>
                {item.progress!.done} of {item.progress!.total} done
              </span>
              <span>{item.createdAt}</span>
            </div>
          </>
        ) : (
          <div
            className="flex items-center gap-2 text-[12px]"
            style={{ color: "#9CA3AF" }}
          >
            {item.author && (
              <>
                <span
                  className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold"
                  style={{ background: "#F3E8FF", color: "#7C3AED" }}
                >
                  {item.author.name[0]}
                </span>
                <span style={{ color: "#4B5563" }}>{item.author.name}</span>
                <span>·</span>
              </>
            )}
            <span>{item.createdAt}</span>
          </div>
        )}
      </div>
    </button>
  );
}
