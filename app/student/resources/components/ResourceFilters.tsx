"use client";

import { Select } from "antd";
import type {
  ResourceType,
  Difficulty,
  LearningStyle,
} from "@/apis/resources/types";

interface FilterState {
  topicId?: string;
  type?: ResourceType;
  difficulty?: Difficulty;
  learningStyle?: LearningStyle;
}

export function ResourceFilters({
  topics,
  value,
  onChange,
}: {
  topics: { id: string; name: string }[];
  value: FilterState;
  onChange: (next: FilterState) => void;
}) {
  const hasFilters =
    value.topicId || value.type || value.difficulty || value.learningStyle;

  return (
    <div className="flex items-center gap-2 flex-wrap mb-6">
      <Select
        allowClear
        showSearch
        placeholder="Course"
        style={{ width: 180 }}
        value={value.topicId}
        onChange={(v) => onChange({ ...value, topicId: v })}
        filterOption={(input, opt) =>
          ((opt?.label as string) ?? "")
            .toLowerCase()
            .includes(input.toLowerCase())
        }
        options={topics.map((t) => ({ label: t.name, value: t.id }))}
      />
      <Select
        allowClear
        placeholder="Type"
        style={{ width: 150 }}
        value={value.type}
        onChange={(v) => onChange({ ...value, type: v })}
        options={[
          { label: "Tutorial", value: "TUTORIAL" },
          { label: "Video", value: "VIDEO" },
          { label: "Article", value: "ARTICLE" },
          { label: "Exercise", value: "EXERCISE" },
          { label: "Documentation", value: "DOCUMENTATION" },
        ]}
      />
      <Select
        allowClear
        placeholder="Difficulty"
        style={{ width: 130 }}
        value={value.difficulty}
        onChange={(v) => onChange({ ...value, difficulty: v })}
        options={[
          { label: "Easy", value: "EASY" },
          { label: "Medium", value: "MEDIUM" },
          { label: "Hard", value: "HARD" },
        ]}
      />
      <Select
        allowClear
        placeholder="Learning style"
        style={{ width: 160 }}
        value={value.learningStyle}
        onChange={(v) => onChange({ ...value, learningStyle: v })}
        options={[
          { label: "Visual", value: "VISUAL" },
          { label: "Reading", value: "READING" },
          { label: "Hands-on", value: "HANDS_ON" },
        ]}
      />
      {hasFilters && (
        <button
          type="button"
          onClick={() => onChange({})}
          className="text-[12.5px] font-medium px-3 py-1"
          style={{ color: "#3A0CA3" }}
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
