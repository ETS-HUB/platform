import { Input, InputNumber, Switch } from "antd";

export interface LessonMeta {
  title: string;
  description: string;
  order: number;
  duration: number;
  isPublished: boolean;
}

export function LessonMetaForm({
  value,
  onChange,
}: {
  value: LessonMeta;
  onChange: (next: LessonMeta) => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div>
        <label className="text-sm sm:text-base font-medium text-gray-600 mb-1 block">
          Title
        </label>
        <Input
          value={value.title}
          size="large"
          onChange={(e) => onChange({ ...value, title: e.target.value })}
          placeholder="e.g. Variables & Data Types"
        />
      </div>
      <div>
        <label className="text-sm sm:text-base font-medium text-gray-600 mb-1 block">
          Description
        </label>
        <Input.TextArea
          size="large"
          value={value.description}
          onChange={(e) => onChange({ ...value, description: e.target.value })}
          rows={2}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm sm:text-base font-medium text-gray-600 mb-1 block">
            Order
          </label>
          <InputNumber
            size="large"
            value={value.order}
            onChange={(v) => onChange({ ...value, order: v ?? 1 })}
            min={1}
            style={{ width: "100%" }}
          />
        </div>
        <div>
          <label className="text-sm sm:text-base font-medium text-gray-600 mb-1 block">
            Duration (min)
          </label>
          <InputNumber
            size="large"
            value={value.duration}
            onChange={(v) => onChange({ ...value, duration: v ?? 5 })}
            min={1}
            style={{ width: "100%" }}
          />
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between rounded-lg px-3.5 py-2.5 bg-[#FAFAFA] border border-[#EDE0FB]">
        <div>
          <p className="text-base text-[#374151] font-medium">
            Published
          </p>
          <p className="text-base" style={{ color: "#9CA3AF" }}>
            Draft lessons are only visible to admin/tutor
          </p>
        </div>
        <Switch
          checked={value.isPublished}
          onChange={(isPublished) => onChange({ ...value, isPublished })}
        />
      </div>
    </div>
  );
}
