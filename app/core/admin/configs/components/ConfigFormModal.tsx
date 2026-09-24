"use client";
import toast from "react-hot-toast";

import { useEffect, useState } from "react";
import { Modal, Input, InputNumber, Select, Switch, message } from "antd";
import { DistributionModeEditor } from "./DistributionModeEditor";
import type {
  AssessmentConfig,
  ConfigPayload,
  DistributionMode,
} from "@/apis/admin/configs/types";

const TRACK_OPTIONS = [
  { label: "Frontend", value: "frontend" },
  { label: "Backend", value: "backend" },
  { label: "Full Stack", value: "fullstack" },
];

export function ConfigFormModal({
  config,
  topics,
  open,
  onClose,
  onSave,
}: {
  config: AssessmentConfig | null;
  topics: { id: string; name: string }[];
  open: boolean;
  onClose: () => void;
  onSave: (id: string | null, payload: ConfigPayload) => Promise<void>;
}) {
  const isEdit = !!config;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [track, setTrack] = useState<string | undefined>();
  const [totalQuestions, setTotalQuestions] = useState(20);
  const [timeLimitMinutes, setTimeLimitMinutes] = useState(25);
  const [isBoothMode, setIsBoothMode] = useState(false);
  const [mode, setMode] = useState<DistributionMode>("random");
  const [topicDistribution, setTopicDistribution] = useState<
    Record<string, number>
  >({});
  const [difficultyDistribution, setDifficultyDistribution] = useState<
    Record<"EASY" | "MEDIUM" | "HARD", number>
  >({
    EASY: 0,
    MEDIUM: 0,
    HARD: 0,
  });
  const [fallbackDifficulty, setFallbackDifficulty] = useState<
    "EASY" | "MEDIUM" | "HARD" | undefined
  >();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setName(config?.name ?? "");
    setDescription(config?.description ?? "");
    setTrack(config?.track);
    setTotalQuestions(config?.totalQuestions ?? 20);
    setTimeLimitMinutes(config?.timeLimitMinutes ?? 25);
    setIsBoothMode(config?.isBoothMode ?? false);
    setMode(
      config?.topicDistribution
        ? "topic"
        : config?.difficultyDistribution
          ? "difficulty"
          : "random",
    );
    setTopicDistribution(config?.topicDistribution ?? {});
    setDifficultyDistribution(
      config?.difficultyDistribution ?? { EASY: 0, MEDIUM: 0, HARD: 0 },
    );
    setFallbackDifficulty(config?.difficulty ?? undefined);
  }, [config, open]);

  // admin/configs/ConfigFormModal.tsx — corrected submit logic

  useEffect(() => {
    setMode(
      config?.topicDistribution
        ? "topic"
        : config?.difficultyDistribution
          ? "difficulty"
          : "none",
    );
    // ...rest unchanged
  }, [config, open]);

  const topicAllocated = Object.values(topicDistribution).reduce(
    (a, b) => a + b,
    0,
  );
  const difficultyAllocated = Object.values(difficultyDistribution).reduce(
    (a, b) => a + b,
    0,
  );

  // submit is now blocked on mismatch, not just visually flagged
  const isValid =
    name.trim().length > 0 &&
    !!track &&
    totalQuestions > 0 &&
    timeLimitMinutes > 0 &&
    (mode === "none" ||
      (mode === "topic" && topicAllocated === totalQuestions) ||
      (mode === "difficulty" && difficultyAllocated === totalQuestions));

  const handleSubmit = async () => {
    if (!isValid) return;
    setSubmitting(true);
    try {
      const payload: ConfigPayload = {
        name: name.trim(),
        description: description.trim() || undefined,
        track: track!,
        totalQuestions,
        timeLimitMinutes,
        isBoothMode,
        // explicit null on whichever mode is inactive — required so PATCH
        // actually clears a previously-set distribution, not just omits the field
        topicDistribution: mode === "topic" ? topicDistribution : null,
        difficultyDistribution:
          mode === "difficulty" ? difficultyDistribution : null,
        ...(mode === "none" &&
          fallbackDifficulty && { difficulty: fallbackDifficulty }),
      };
      await onSave(config?.id ?? null, payload);
      toast.success(isEdit ? "Config updated" : "Config created");
      onClose();
    } catch {
      toast.error(
        isEdit ? "Failed to update config" : "Failed to create config",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      onOk={handleSubmit}
      okButtonProps={{
        disabled: !isValid,
        loading: submitting,
        style: { background: "#3A0CA3" },
      }}
      okText={
        mode === "topic" && topicAllocated !== totalQuestions
          ? `Allocate ${totalQuestions - topicAllocated > 0 ? totalQuestions - topicAllocated + " more" : Math.abs(totalQuestions - topicAllocated) + " fewer"}`
          : mode === "difficulty" && difficultyAllocated !== totalQuestions
            ? `Allocate ${totalQuestions - difficultyAllocated > 0 ? totalQuestions - difficultyAllocated + " more" : Math.abs(totalQuestions - difficultyAllocated) + " fewer"}`
            : isEdit
              ? "Save changes"
              : "Create config"
      }
      title={isEdit ? "Edit assessment config" : "New assessment config"}
      width={560}
    >
      <div className="flex flex-col gap-3 mt-4">
        <div>
          <label className="text-sm font-medium text-gray-600 mb-1 block">
            Name
          </label>
          <Input
            value={name}
            size="large"
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Frontend Developer Assessment"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-600 mb-1 block">
            Description
          </label>
          <Input.TextArea
            value={description}
            size="large"
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="text-sm font-medium text-gray-600 mb-1 block">
              Track
            </label>
            <Select
              value={track}
              onChange={setTrack}
              size="large"
              style={{ width: "100%" }}
              options={TRACK_OPTIONS}
              placeholder="Select track"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 mb-1 block">
              Total questions
            </label>
            <InputNumber
              value={totalQuestions}
              onChange={(v) => setTotalQuestions(v ?? 20)}
              size="large"
              min={1}
              style={{ width: "100%" }}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 mb-1 block">
              Time limit (min)
            </label>
            <InputNumber
              value={timeLimitMinutes}
              onChange={(v) => setTimeLimitMinutes(v ?? 25)}
              size="large"
              min={1}
              style={{ width: "100%" }}
            />
          </div>
        </div>

        <DistributionModeEditor
          mode={mode}
          onModeChange={setMode}
          totalQuestions={totalQuestions}
          topics={topics}
          topicDistribution={topicDistribution}
          onTopicDistributionChange={setTopicDistribution}
          difficultyDistribution={difficultyDistribution}
          onDifficultyDistributionChange={setDifficultyDistribution}
          fallbackDifficulty={fallbackDifficulty}
          onFallbackDifficultyChange={setFallbackDifficulty}
        />

        <div className="flex items-center bg-[#FAFAFA] justify-between rounded-lg px-3.5 py-2.5 mt-1">
          <div>
            <p className="text-sm font-medium text-[#374151]">
              Booth mode
            </p>
            <p className="text-xs text-[#9CA3AF]">
              Used for event/booth registration — hidden from the regular
              student assessment list
            </p>
          </div>
          <Switch checked={isBoothMode} onChange={setIsBoothMode} />
        </div>
      </div>
    </Modal>
  );
}
