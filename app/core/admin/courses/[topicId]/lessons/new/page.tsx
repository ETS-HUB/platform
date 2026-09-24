"use client";
import toast from "react-hot-toast";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button, message } from "antd";
import { ArrowLeft, Plus } from "lucide-react";
import { LessonMetaForm, type LessonMeta } from "../components/LessonMetaForm";
import { ContentBlockList } from "../components/ContentBlockList";
import { ContentBlockFormModal } from "../components/ContentBlockFormModal";
import { QuestionList } from "../components/QuestionList";
import { QuestionFormModal } from "../components/QuestionFormModal";
import type {
  AdminContentBlock,
  AdminLessonQuestion,
  CreateLessonPayload,
} from "@/apis/admin/lessons/types";
import { useCreateLessonMutation } from "@/apis/admin/lessons/lessonsService";

export default function NewLessonPage() {
  const router = useRouter();
  const params = useParams();
  const topicId = params.topicId as string;

  const [createLesson] = useCreateLessonMutation();

  const [meta, setMeta] = useState<LessonMeta>({
    title: "",
    description: "",
    order: 1,
    duration: 15,
    isPublished: false,
  });

  const [blocks, setBlocks] = useState<AdminContentBlock[]>([]);
  const [questions, setQuestions] = useState<AdminLessonQuestion[]>([]);

  const [blockModalOpen, setBlockModalOpen] = useState(false);
  const [editingBlock, setEditingBlock] = useState<AdminContentBlock | null>(
    null,
  );

  const [questionModalOpen, setQuestionModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] =
    useState<AdminLessonQuestion | null>(null);

  const [saving, setSaving] = useState(false);

  const handleSaveBlock = (block: AdminContentBlock) => {
    setBlocks((prev) =>
      editingBlock
        ? prev.map((b) => (b === editingBlock ? block : b))
        : [...prev, block],
    );
    setEditingBlock(null);
  };

  const handleDeleteBlock = async (block: AdminContentBlock) => {
    setBlocks((prev) => prev.filter((b) => b !== block));
  };

  const handleReorderBlocks = (fromIndex: number, toIndex: number) => {
    setBlocks((prev) => {
      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next.map((b, i) => ({ ...b, order: i }));
    });
  };

  const handleSaveQuestion = (q: AdminLessonQuestion) => {
    setQuestions((prev) =>
      editingQuestion
        ? prev.map((existing) => (existing === editingQuestion ? q : existing))
        : [...prev, q],
    );
    setEditingQuestion(null);
  };

  const handleDeleteQuestion = async (q: AdminLessonQuestion) => {
    setQuestions((prev) => prev.filter((existing) => existing !== q));
  };

  const handleCreate = async () => {
    if (!meta.title.trim()) {
      toast.error("Title is required");
      return;
    }
    setSaving(true);
    try {
      const payload: CreateLessonPayload = {
        topicId,
        ...meta,
        contentBlocks: blocks,
        questions,
      };
      await createLesson(payload).unwrap();
      toast.success("Lesson created");
      router.push(`/core/admin/courses/${topicId}/lessons`);
    } catch {
      toast.error("Failed to create lesson");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen w-full">
      <button
        type="button"
        onClick={() => router.push(`/core/admin/courses/${topicId}/lessons`)}
        className="flex cursor-pointer text-[#8A8A8A] items-center gap-1.5 text-sm font-medium mb-5"
      >
        <ArrowLeft size={14} />
        Back to lessons
      </button>

      <h1 className="text-2xl text-[#0e1430] font-semibold mb-6">
        New lesson
      </h1>

      <div
        className="rounded-2xl p-6 mb-6"
        style={{ background: "#FFFFFF", border: "1.5px solid #EDE0FB" }}
      >
        <h3
          className="text-[13px] font-bold uppercase tracking-wide mb-4"
          style={{ color: "#8A8A8A" }}
        >
          Details
        </h3>
        <LessonMetaForm value={meta} onChange={setMeta} />
      </div>

      <div
        className="rounded-2xl p-6 mb-6"
        style={{ background: "#FFFFFF", border: "1.5px solid #EDE0FB" }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3
            className="text-[13px] font-bold uppercase tracking-wide"
            style={{ color: "#8A8A8A" }}
          >
            Content blocks ({blocks.length})
          </h3>
          <Button
            size="small"
            icon={<Plus size={12} />}
            onClick={() => {
              setEditingBlock(null);
              setBlockModalOpen(true);
            }}
          >
            Add block
          </Button>
        </div>
        <ContentBlockList
          blocks={blocks}
          onEdit={(b) => {
            setEditingBlock(b);
            setBlockModalOpen(true);
          }}
          onDelete={handleDeleteBlock}
          onReorder={handleReorderBlocks}
        />
      </div>

      <div
        className="rounded-2xl p-6 mb-6"
        style={{ background: "#FFFFFF", border: "1.5px solid #EDE0FB" }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3
            className="text-[13px] font-bold uppercase tracking-wide"
            style={{ color: "#8A8A8A" }}
          >
            Questions ({questions.length})
          </h3>
          <Button
            size="small"
            icon={<Plus size={12} />}
            onClick={() => {
              setEditingQuestion(null);
              setQuestionModalOpen(true);
            }}
          >
            Add question
          </Button>
        </div>
        <QuestionList
          questions={questions}
          onEdit={(q) => {
            setEditingQuestion(q);
            setQuestionModalOpen(true);
          }}
          onDelete={handleDeleteQuestion}
        />
      </div>

      <div className="flex justify-end">
        <Button
          type="primary"
          loading={saving}
          onClick={handleCreate}
          style={{ background: "#3A0CA3" }}
        >
          Create lesson
        </Button>
      </div>

      <ContentBlockFormModal
        block={editingBlock}
        nextOrder={blocks.length}
        open={blockModalOpen}
        onClose={() => setBlockModalOpen(false)}
        onSave={async (b) => handleSaveBlock(b)}
      />
      <QuestionFormModal
        question={editingQuestion}
        nextOrder={questions.length}
        open={questionModalOpen}
        onClose={() => setQuestionModalOpen(false)}
        onSave={async (q) => handleSaveQuestion(q)}
      />
    </div>
  );
}
