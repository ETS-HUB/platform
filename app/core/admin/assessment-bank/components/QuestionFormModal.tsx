"use client";
import toast from "react-hot-toast";

import { useEffect, useState } from "react";
import { Modal, Input, Select, InputNumber, Radio, message } from "antd";
import { Plus, X } from "lucide-react";
import type {
  AdminQuestion,
  QuestionOption,
  Difficulty,
  CreateQuestionPayload,
} from "@/apis/admin/questions/types";

const OPTION_IDS = ["a", "b", "c", "d", "e", "f"];

export function QuestionFormModal({
  question,
  topics,
  defaultTopicId,
  open,
  onClose,
  onSave,
}: {
  question: AdminQuestion | null; // null = create mode
  topics: { id: string; name: string }[];
  defaultTopicId?: string;
  open: boolean;
  onClose: () => void;
  onSave: (id: string | null, payload: CreateQuestionPayload) => Promise<void>;
}) {
  const isEdit = !!question;

  const [topicId, setTopicId] = useState<string | undefined>(defaultTopicId);
  const [text, setText] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>("MEDIUM");
  const [options, setOptions] = useState<QuestionOption[]>([
    { id: "a", text: "", isCorrect: true },
    { id: "b", text: "", isCorrect: false },
  ]);
  const [explanation, setExplanation] = useState("");
  const [points, setPoints] = useState(10);
  const [timeLimit, setTimeLimit] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setTopicId(question?.topicId ?? defaultTopicId);
    setText(question?.text ?? "");
    setDifficulty(question?.difficulty ?? "MEDIUM");
    setOptions(
      question?.options ?? [
        { id: "a", text: "", isCorrect: true },
        { id: "b", text: "", isCorrect: false },
      ],
    );
    setExplanation(question?.explanation ?? "");
    setPoints(question?.points ?? 10);
    setTimeLimit(question?.timeLimit ?? null);
  }, [question, defaultTopicId, open]);

  const isValid =
    !!topicId &&
    text.trim().length > 0 &&
    options.every((o) => o.text.trim().length > 0) &&
    options.some((o) => o.isCorrect) &&
    options.length >= 2 &&
    explanation.trim().length > 0;

  const addOption = () => {
    if (options.length >= OPTION_IDS.length) return;
    setOptions([
      ...options,
      { id: OPTION_IDS[options.length], text: "", isCorrect: false },
    ]);
  };

  const removeOption = (id: string) => {
    if (options.length <= 2) return;
    setOptions(options.filter((o) => o.id !== id));
  };

  const setCorrect = (id: string) => {
    setOptions(options.map((o) => ({ ...o, isCorrect: o.id === id })));
  };

  const handleSubmit = async () => {
    if (!isValid) return;
    setSubmitting(true);
    try {
      await onSave(question?.id ?? null, {
        topicId: topicId!,
        difficulty,
        text: text.trim(),
        options,
        explanation: explanation.trim(),
        points,
        timeLimit: timeLimit ?? undefined,
      });
      toast.success(isEdit ? "Question updated" : "Question created");
      onClose();
    } catch {
      toast.error(
        isEdit ? "Failed to update question" : "Failed to create question",
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
      okText={isEdit ? "Save changes" : "Create question"}
      okButtonProps={{
        disabled: !isValid,
        loading: submitting,
        style: { background: "#3A0CA3" },
      }}
      title={isEdit ? "Edit question" : "New question"}
      width={580}
    >
      <div className="flex flex-col gap-3 mt-4">
        <div>
          <label className="text-sm font-medium text-gray-600 mb-1 block">
            Topic
          </label>
          <Select
            value={topicId}
            onChange={setTopicId}
            size="large"
            style={{ width: "100%" }}
            placeholder="Select a topic"
            options={topics.map((t) => ({ label: t.name, value: t.id }))}
            disabled={isEdit} // question's topic ties to which pool it belongs to — move via delete+recreate, not edit
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600 mb-1 block">
            Question text
          </label>
          <Input.TextArea
            value={text}
            size="large"
            onChange={(e) => setText(e.target.value)}
            rows={2}
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="text-sm font-medium text-gray-600 mb-1 block">
              Difficulty
            </label>
            <Select
              value={difficulty}
              onChange={setDifficulty}
              style={{ width: "100%" }}
              size="large"
              options={[
                { label: "Easy", value: "EASY" },
                { label: "Medium", value: "MEDIUM" },
                { label: "Hard", value: "HARD" },
              ]}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 mb-1 block">
              Points
            </label>
            <InputNumber
              value={points}
              onChange={(v) => setPoints(v ?? 10)}
              min={1}
              size="large"
              style={{ width: "100%" }}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 mb-1 block">
              Time limit (sec)
            </label>
            <InputNumber
              value={timeLimit}
              onChange={setTimeLimit}
              min={5}
              size="large"
              style={{ width: "100%" }}
              placeholder="None"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-sm font-medium text-gray-600">
              Options (select the correct one)
            </label>
            {options.length < OPTION_IDS.length && (
              <button
                type="button"
                onClick={addOption}
                className="flex items-center gap-1 text-sm cursor-pointer font-semibold"
                style={{ color: "#3A0CA3" }}
              >
                <Plus size={11} /> Add option
              </button>
            )}
          </div>
          <Radio.Group
            value={options.find((o) => o.isCorrect)?.id}
            onChange={(e) => setCorrect(e.target.value)}
            className="w-full"
          >
            <div className="flex flex-col gap-2">
              {options.map((opt) => (
                <div key={opt.id} className="flex items-center gap-2">
                  <Radio value={opt.id} />
                  <Input
                    value={opt.text}
                    onChange={(e) =>
                      setOptions(
                        options.map((o) =>
                          o.id === opt.id ? { ...o, text: e.target.value } : o,
                        ),
                      )
                    }
                    placeholder={`Option ${opt.id.toUpperCase()}`}
                    size="large"
                  />
                  {options.length > 2 && (
                    <button type="button" onClick={() => removeOption(opt.id)}>
                      <X size={14} style={{ color: "#9CA3AF" }} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </Radio.Group>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600 mb-1 block">
            Explanation
          </label>
          <Input.TextArea
            value={explanation}
            onChange={(e) => setExplanation(e.target.value)}
            rows={2}
            size="large"
            placeholder="Shown to students after answering"
          />
        </div>
      </div>
    </Modal>
  );
}
