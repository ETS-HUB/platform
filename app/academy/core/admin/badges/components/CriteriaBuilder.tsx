import { Select, InputNumber } from "antd";
import type { BadgeCriteria, BadgeCriteriaType } from "@/apis/admin/badges/types";

export function CriteriaBuilder({
  criteria,
  onChange,
  topics,
}: {
  criteria: BadgeCriteria;
  onChange: (next: BadgeCriteria) => void;
  topics: { id: string; name: string }[];
}) {
  const setType = (type: BadgeCriteriaType) => {
    // reset fields not relevant to the new type — avoids submitting stale
    // leftover values from a previously-selected criteria type
    if (type === "quiz_score")
      onChange({ type, topic: undefined, minScore: 75 });
    if (type === "practice_count") onChange({ type, count: 10 });
    if (type === "overall_score") onChange({ type, minScore: 90 });
  };

  return (
    <div className="rounded-xl p-4" style={{ background: "#FAFAFA" }}>
      <label className="text-sm font-medium text-gray-600 mb-2 block">
        Earned by
      </label>
      <Select
        value={criteria.type}
        onChange={setType}
        size="large"
        style={{ width: "100%", marginBottom: 12 }}
        options={[
          {
            label: "Scoring X%+ on a specific topic's quizzes",
            value: "quiz_score",
          },
          { label: "Completing X practice sessions", value: "practice_count" },
          {
            label: "Scoring X%+ overall (across all topics)",
            value: "overall_score",
          },
        ]}
      />

      {criteria.type === "quiz_score" && (
        <div className="flex items-center gap-3">
          <Select
            placeholder="Topic"
            size="large"
            style={{ flex: 1 }}
            value={criteria.topic}
            onChange={(topic) => onChange({ ...criteria, topic })}
            options={topics.map((t) => ({ label: t.name, value: t.name }))}
          />
          <div className="flex items-center gap-1.5 shrink-0">
            <InputNumber
              value={criteria.minScore}
              onChange={(v) => onChange({ ...criteria, minScore: v ?? 75 })}
              min={1}
              max={100}
              style={{ width: 80 }}
              size="large"
            />
            <span className="text-[12.5px]" style={{ color: "#6B7280" }}>
              % min
            </span>
          </div>
        </div>
      )}

      {criteria.type === "practice_count" && (
        <div className="flex items-center gap-2">
          <InputNumber
            value={criteria.count}
            onChange={(v) => onChange({ ...criteria, count: v ?? 10 })}
            min={1}
            size="large"
            style={{ width: 100 }}
          />
          <span className="text-[12.5px]" style={{ color: "#6B7280" }}>
            practice sessions completed
          </span>
        </div>
      )}

      {criteria.type === "overall_score" && (
        <div className="flex items-center gap-2">
          <InputNumber
            value={criteria.minScore}
            onChange={(v) => onChange({ ...criteria, minScore: v ?? 90 })}
            min={1}
            size="large"
            max={100}
            style={{ width: 100 }}
          />
          <span className="text-[12.5px]" style={{ color: "#6B7280" }}>
            % overall average
          </span>
        </div>
      )}
    </div>
  );
}
