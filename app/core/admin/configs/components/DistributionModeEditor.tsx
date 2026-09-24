"use client";

import { Radio, InputNumber, Select } from "antd";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import type { DistributionMode } from "@/apis/admin/configs/types";

interface Props {
  mode: DistributionMode;
  onModeChange: (mode: DistributionMode) => void;
  totalQuestions: number;
  topics: { id: string; name: string }[];
  topicDistribution: Record<string, number>;
  onTopicDistributionChange: (dist: Record<string, number>) => void;
  difficultyDistribution: Record<"EASY" | "MEDIUM" | "HARD", number>;
  onDifficultyDistributionChange: (
    dist: Record<"EASY" | "MEDIUM" | "HARD", number>,
  ) => void;
  fallbackDifficulty?: "EASY" | "MEDIUM" | "HARD";
  onFallbackDifficultyChange: (
    d: "EASY" | "MEDIUM" | "HARD" | undefined,
  ) => void;
}

function AllocationIndicator({
  allocated,
  total,
}: {
  allocated: number;
  total: number;
}) {
  const remaining = total - allocated;
  const color =
    remaining === 0 ? "#059669" : remaining < 0 ? "#DC2626" : "#D97706";
  const bg =
    remaining === 0 ? "#F0FDF4" : remaining < 0 ? "#FEF2F2" : "#FFF3E0";

  return (
    <div
      className="flex items-center gap-1.5 text-sm font-medium px-2.5 py-1 rounded-full w-fit"
      style={{ background: bg, color }}
    >
      {allocated} / {total} questions allocated
      {remaining > 0 && ` — ${remaining} unassigned`}
      {remaining < 0 && ` — ${Math.abs(remaining)} over limit`}
    </div>
  );
}
function SumIndicator({ sum, total }: { sum: number; total: number }) {
  const matches = sum === total;
  return (
    <div
      className="flex items-center gap-1.5 text-sm font-medium px-2.5 py-1 rounded-full w-fit"
      style={{
        background: matches ? "#F0FDF4" : "#FFF3E0",
        color: matches ? "#059669" : "#D97706",
      }}
    >
      {matches ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
      {sum} / {total} questions assigned
    </div>
  );
}

export function DistributionModeEditor({
  mode,
  onModeChange,
  totalQuestions,
  topics,
  topicDistribution,
  onTopicDistributionChange,
  difficultyDistribution,
  onDifficultyDistributionChange,
  fallbackDifficulty,
  onFallbackDifficultyChange,
}: Props) {
  const topicSum = Object.values(topicDistribution).reduce((a, b) => a + b, 0);
  const difficultySum = Object.values(difficultyDistribution).reduce(
    (a, b) => a + b,
    0,
  );

  const availableTopics = topics.filter((t) => !(t.id in topicDistribution));

  return (
    <div>
      <label className="text-sm font-medium text-gray-600 mb-2 block">
        How should questions be selected?
      </label>
      <Radio.Group
        value={mode}
        onChange={(e) => onModeChange(e.target.value)}
        className="mb-3"
      >
        <Radio.Button value="topic">By topic</Radio.Button>
        <Radio.Button value="difficulty">By difficulty</Radio.Button>
        <Radio.Button value="random">Random</Radio.Button>
      </Radio.Group>

      {mode === "topic" && (
        <div className="rounded-xl p-4" style={{ background: "#FAFAFA" }}>
          <AllocationIndicator allocated={topicSum} total={totalQuestions} />
          <div className="flex flex-col gap-2 mt-3">
            {Object.entries(topicDistribution).map(([topicId, count]) => {
              const topic = topics.find((t) => t.id === topicId);
              return (
                <div key={topicId} className="flex items-center gap-2">
                  <span className="text-sm text-[#374151] flex-1">
                    {topic?.name ?? topicId}
                  </span>
                  <InputNumber
                    value={count}
                    min={0}
                    size="large"
                    style={{ width: 90 }}
                    onChange={(v) =>
                      onTopicDistributionChange({
                        ...topicDistribution,
                        [topicId]: v ?? 0,
                      })
                    }
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const next = { ...topicDistribution };
                      delete next[topicId];
                      onTopicDistributionChange(next);
                    }}
                    className="text-sm font-medium text-[#DC2626] cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              );
            })}
          </div>
          {availableTopics.length > 0 && (
            <Select
              placeholder="Add a topic..."
              style={{ width: "100%", marginTop: 10 }}
              value={undefined}
              size="large"
              onChange={(topicId: string) =>
                onTopicDistributionChange({
                  ...topicDistribution,
                  [topicId]: 1,
                })
              }
              options={availableTopics.map((t) => ({
                label: t.name,
                value: t.id,
              }))}
            />
          )}
        </div>
      )}

      {mode === "difficulty" && (
        <div className="rounded-xl p-4" style={{ background: "#FAFAFA" }}>
          <AllocationIndicator
            allocated={difficultySum}
            total={totalQuestions}
          />
          <div className="grid grid-cols-3 gap-3 mt-3">
            {(["EASY", "MEDIUM", "HARD"] as const).map((level) => (
              <div key={level}>
                <label
                  className="text-sm text-gray-500 font-medium mb-1 block"
                >
                  {level.charAt(0) + level.slice(1).toLowerCase()}
                </label>
                <InputNumber
                  value={difficultyDistribution[level]}
                  min={0}
                  size="large"
                  style={{ width: "100%" }}
                  onChange={(v) =>
                    onDifficultyDistributionChange({
                      ...difficultyDistribution,
                      [level]: v ?? 0,
                    })
                  }
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {mode === "random" && (
        <div className="rounded-xl p-4 bg-[#FAFAFA]">
          <p className="text-sm text-gray-500 mb-3" style={{ color: "#6B7280" }}>
            Questions are picked randomly across all topics. {totalQuestions}{" "}
            question{totalQuestions === 1 ? "" : "s"} total.
          </p>
          <label
            className="text-sm text-gray-500 font-medium mb-1 block"
            style={{ color: "#8B84A0" }}
          >
            Restrict to a difficulty (optional)
          </label>
          <Select
            allowClear
            placeholder="Any difficulty"
            style={{ width: 180 }}
            size="large"
            value={fallbackDifficulty}
            onChange={onFallbackDifficultyChange}
            options={[
              { label: "Easy", value: "EASY" },
              { label: "Medium", value: "MEDIUM" },
              { label: "Hard", value: "HARD" },
            ]}
          />
        </div>
      )}
    </div>
  );
}
