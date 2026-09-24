import type { Difficulty } from "@/apis/resources/types";

const LEVELS: Record<Difficulty, number> = { EASY: 1, MEDIUM: 2, HARD: 3 };
const COLORS: Record<Difficulty, string> = {
  EASY: "#059669",
  MEDIUM: "#D97706",
  HARD: "#DC2626",
};

export function DifficultyDot({ difficulty }: { difficulty: Difficulty }) {
  const level = LEVELS[difficulty];
  const color = COLORS[difficulty];

  return (
    <span className="inline-flex items-center gap-2">
      <span className="flex items-center gap-0.5">
        {[1, 2, 3].map((i) => (
          <span
            key={i}
            className="rounded-full"
            style={{
              width: 10,
              height: 10,
              background: i <= level ? color : "#E5E7EB",
            }}
          />
        ))}
      </span>
      <span className="text-sm font-medium" style={{ color }}>
        {difficulty.charAt(0) + difficulty.slice(1).toLowerCase()}
      </span>
    </span>
  );
}
