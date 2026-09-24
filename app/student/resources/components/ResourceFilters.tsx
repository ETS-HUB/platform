"use client";

import { Select } from "antd";
import type { ResourceType, Difficulty } from "@/apis/resources/types";

interface FilterState {
  topicId?: string;
  type?: ResourceType;
  difficulty?: Difficulty;
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
  return (
    <div className="flex items-center gap-2 flex-wrap mb-6">
      <Select
        allowClear
        placeholder="Topic"
        style={{ width: 160 }}
        value={value.topicId}
        onChange={(v) => onChange({ ...value, topicId: v })}
        options={topics.map((t) => ({ label: t.name, value: t.id }))}
      />
      <Select
        allowClear
        placeholder="Type"
        style={{ width: 140 }}
        value={value.type}
        onChange={(v) => onChange({ ...value, type: v })}
        options={[
          { label: "Tutorial", value: "TUTORIAL" },
          { label: "Video", value: "VIDEO" },
          { label: "Documentation", value: "DOCUMENTATION" },
        ]}
      />
      <Select
        allowClear
        placeholder="Difficulty"
        style={{ width: 140 }}
        value={value.difficulty}
        onChange={(v) => onChange({ ...value, difficulty: v })}
        options={[
          { label: "Easy", value: "EASY" },
          { label: "Medium", value: "MEDIUM" },
          { label: "Hard", value: "HARD" },
        ]}
      />
      {(value.topicId || value.type || value.difficulty) && (
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
