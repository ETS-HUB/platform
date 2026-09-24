import { Zap } from "lucide-react";
import type { LevelInfo } from "@/apis/profile/types";

export function LevelCard({ level }: { level: LevelInfo }) {
  const hasNext = level.nextLevel !== null;

  return (
    <div
      className="rounded-2xl p-6"
      style={{ background: "linear-gradient(135deg, #3A0CA3, #7408B3)" }}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <p
            className="text-[11px] font-bold uppercase tracking-widest mb-1"
            style={{ color: "#FFE866" }}
          >
            Level {level.level}
          </p>
          <h3 className="text-[22px] font-bold text-white">
            {level.levelName}
          </h3>
        </div>
        <div
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
          style={{ background: "rgba(255,255,255,0.15)" }}
        >
          <Zap size={14} fill="#FFE866" style={{ color: "#FFE866" }} />
          <span className="text-[13px] font-bold text-white">
            {level.xp} XP
          </span>
        </div>
      </div>

      {hasNext && level.nextLevel && (
        <div>
          <div
            className="flex items-center justify-between text-[11.5px] mb-1.5"
            style={{ color: "rgba(255,255,255,0.75)" }}
          >
            <span>
              {level.nextLevel.xpRemaining > 0
                ? `${level.nextLevel.xpRemaining} XP to ${level.nextLevel.name}`
                : `Ready to advance to ${level.nextLevel.name}`}
            </span>
            <span className="font-semibold text-white">
              {level.nextLevel.progress}%
            </span>
          </div>
          <div
            className="h-2 rounded-full"
            style={{ background: "rgba(255,255,255,0.2)" }}
          >
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${level.nextLevel.progress}%`,
                background: "#FFE866",
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
