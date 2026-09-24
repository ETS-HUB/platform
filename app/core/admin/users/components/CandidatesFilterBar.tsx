import { Input, Select, InputNumber } from "antd";
import { Search } from "lucide-react";
import type {
  CandidateFilters,
  ExperienceLevel,
} from "@/apis/admin/users/types";

export function CandidatesFilterBar({
  filters,
  onChange,
}: {
  filters: CandidateFilters;
  onChange: (next: CandidateFilters) => void;
}) {
  return (
    <div className="flex items-center gap-2 mb-4 flex-wrap">
      <Input
        placeholder="Skill (e.g. React)"
        prefix={<Search size={14} className="text-gray-400" />}
        style={{ width: 180 }}
        size="large"
        value={filters.skill}
        onChange={(e) =>
          onChange({ ...filters, skill: e.target.value, page: 1 })
        }
        allowClear
      />
      <Input
        placeholder="Goal"
        style={{ width: 160 }}
        size="large"
        value={filters.goal}
        onChange={(e) =>
          onChange({ ...filters, goal: e.target.value, page: 1 })
        }
        allowClear
      />
      <Select
        allowClear
        placeholder="Experience"
        style={{ width: 150 }}
        size="large"
        value={filters.experienceLevel}
        onChange={(experienceLevel: ExperienceLevel) =>
          onChange({ ...filters, experienceLevel, page: 1 })
        }
        options={[
          { label: "Beginner", value: "BEGINNER" },
          { label: "Intermediate", value: "INTERMEDIATE" },
          { label: "Advanced", value: "ADVANCED" },
        ]}
      />
      <div className="flex items-center gap-1.5">
        <InputNumber
          placeholder="Min %"
          min={0}
          max={100}
          size="large"
          style={{ width: 90 }}
          value={filters.minScore}
          onChange={(v) =>
            onChange({ ...filters, minScore: v ?? undefined, page: 1 })
          }
        />
        <span className="text-[12px]" style={{ color: "#9CA3AF" }}>
          –
        </span>
        <InputNumber
          placeholder="Max %"
          min={0}
          max={100}
          size="large"
          style={{ width: 90 }}
          value={filters.maxScore}
          onChange={(v) =>
            onChange({ ...filters, maxScore: v ?? undefined, page: 1 })
          }
        />
      </div>
    </div>
  );
}
