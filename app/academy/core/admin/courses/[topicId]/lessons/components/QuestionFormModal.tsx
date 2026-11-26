"use client";
import toast from "react-hot-toast";

import { useEffect, useState } from "react";
import { Modal, Input, Select, InputNumber, Radio, message } from "antd";
import { Plus, X } from "lucide-react";
import type {
  AdminLessonQuestion,
  AdminQuestionOption,
  Difficulty,
} from "@/apis/admin/lessons/types";

const OPTION_IDS = ["a", "b", "c", "d", "e", "f"];

export function QuestionFormModal({
  question,
  nextOrder,
  open,
  onClose,
  onSave,
}: {
  question: AdminLessonQuestion | null;
  nextOrder: number;
  open: boolean;
  onClose: () => void;
  onSave: (question: AdminLessonQuestion) => Promise<void>;
}) {
  const isEdit = !!question;
  const [text, setText] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>("MEDIUM");
  const [options, setOptions] = useState<AdminQuestionOption[]>([
    { id: "a", text: "", isCorrect: true },
    { id: "b", text: "", isCorrect: false },
  ]);
  const [explanation, setExplanation] = useState("");
  const [points, setPoints] = useState(10);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
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
  }, [question, open]);

  const isValid =
    text.trim().length > 0 &&
    options.every((o) => o.text.trim().length > 0) &&
    options.some((o) => o.isCorrect) &&
    options.length >= 2;

  const addOption = () => {
    if (options.length >= OPTION_IDS.length) return;
    const nextId = OPTION_IDS[options.length];
    setOptions([...options, { id: nextId, text: "", isCorrect: false }]);
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
      await onSave({
        id: question?.id,
        order: question?.order ?? nextOrder,
        difficulty,
        text: text.trim(),
        options,
        explanation: explanation.trim(),
        points,
      });
      toast.success(isEdit ? "Question updated" : "Question added");
      onClose();
    } catch {
      toast.error(
        isEdit ? "Failed to update question" : "Failed to add question",
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
      okText={isEdit ? "Save changes" : "Add question"}
      okButtonProps={{
        disabled: !isValid,
        loading: submitting,
        style: { background: "#3A0CA3" },
      }}
      title={isEdit ? "Edit question" : "Add question"}
      width={560}
    >
      <div className="flex flex-col gap-3 mt-4">
        <div>
          <label className="text-sm font-medium text-gray-600 mb-1 block">
            Question text
          </label>
          <Input.TextArea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={2}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium text-gray-600 mb-1 block">
              Difficulty
            </label>
            <Select
              value={difficulty}
              onChange={setDifficulty}
              style={{ width: "100%" }}
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
              style={{ width: "100%" }}
              size="large"
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
                className="flex items-center gap-1 text-[11.5px] font-semibold"
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
            placeholder="Shown to students after answering"
          />
        </div>
      </div>
    </Modal>
  );
}
