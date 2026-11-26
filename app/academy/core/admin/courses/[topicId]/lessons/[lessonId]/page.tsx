"use client";
import toast from "react-hot-toast";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button, Spin } from "antd";
import { useAdminModal } from "@/hooks/useAdminModal";

import { ArrowLeft, Plus } from "lucide-react";
import { LessonMetaForm, type LessonMeta } from "../components/LessonMetaForm";
import { ContentBlockList } from "../components/ContentBlockList";
import { ContentBlockFormModal } from "../components/ContentBlockFormModal";
import { QuestionList } from "../components/QuestionList";
import { QuestionFormModal } from "../components/QuestionFormModal";
import type {
  AdminContentBlock,
  AdminLessonQuestion,
} from "@/apis/admin/lessons/types";
import {
  useGetAdminLessonDetailQuery,
  useUpdateLessonMutation,
  useAddContentBlockMutation,
  useUpdateContentBlockMutation,
  useDeleteContentBlockMutation,
  useAddLessonQuestionMutation,
  useUpdateLessonQuestionMutation,
  useDeleteLessonQuestionMutation,
} from "@/apis/admin/lessons/lessonsService";
import { getApiError } from "@/lib/apiError";

export default function EditLessonPage() {
  const modal = useAdminModal();
  const router = useRouter();
  const params = useParams();
  const topicId = params.topicId as string;
  const lessonId = params.lessonId as string;

  const { data: lesson, isLoading } = useGetAdminLessonDetailQuery(lessonId, {
    skip: !lessonId,
  });
  const [updateLesson] = useUpdateLessonMutation();
  const [addBlock] = useAddContentBlockMutation();
  const [updateBlock] = useUpdateContentBlockMutation();
  const [deleteBlock] = useDeleteContentBlockMutation();
  const [addQuestion] = useAddLessonQuestionMutation();
  const [updateQuestion] = useUpdateLessonQuestionMutation();
  const [deleteQuestion] = useDeleteLessonQuestionMutation();

  const [meta, setMeta] = useState<LessonMeta | null>(null);
  const [blocks, setBlocks] = useState<AdminContentBlock[]>([]);
  const [questions, setQuestions] = useState<AdminLessonQuestion[]>([]);
  const [blockModalOpen, setBlockModalOpen] = useState(false);
  const [editingBlock, setEditingBlock] = useState<AdminContentBlock | null>(
    null,
  );
  const [questionModalOpen, setQuestionModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] =
    useState<AdminLessonQuestion | null>(null);
  const [savingMeta, setSavingMeta] = useState(false);
  const [metaDirty, setMetaDirty] = useState(false);

  useEffect(() => {
    if (!lesson) return;
    setMeta({
      title: lesson.title,
      description: lesson.description,
      order: lesson.order,
      duration: lesson.duration,
      isPublished: lesson.isPublished,
    });
    setBlocks(lesson.contentBlocks);
    setQuestions(lesson.questions);
  }, [lesson]);

  const handleMetaChange = (next: LessonMeta) => {
    setMeta(next);
    setMetaDirty(true);
  };

  const handleSaveMeta = async () => {
    if (!meta?.title.trim()) {
      toast.error("Title is required");
      return;
    }
    setSavingMeta(true);
    try {
      await updateLesson({ id: lessonId, payload: meta }).unwrap();
      toast.success("Lesson details saved");
      setMetaDirty(false);
    } catch (err) {
      toast.error(getApiError(err, "Failed to save lesson details"));
    } finally {
      setSavingMeta(false);
    }
  };

  const handleSaveBlock = async (block: AdminContentBlock) => {
    try {
      if (block.id) {
        const updated = await updateBlock({
          blockId: block.id,
          payload: block,
        }).unwrap();
        setBlocks((prev) => prev.map((b) => (b.id === block.id ? updated : b)));
        toast.success("Block saved");
      } else {
        const { id: _, ...payload } = block as any;
        const created = await addBlock({ lessonId, payload }).unwrap();
        setBlocks((prev) => [...prev, created]);
        toast.success("Block added");
      }
    } catch (err) {
      toast.error(getApiError(err, "Failed to save block"));
    }
  };

  const handleDeleteBlock = async (block: AdminContentBlock) => {
    modal.confirm({
      title: "Delete this content block?",
      okText: "Delete",
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          if (block.id) await deleteBlock(block.id).unwrap();
          setBlocks((prev) => prev.filter((b) => b !== block));
          toast.success("Block deleted");
        } catch (err) {
          toast.error(getApiError(err, "Failed to delete block"));
        }
      },
    });
  };

  const handleReorderBlocks = (fromIndex: number, toIndex: number) => {
    setBlocks((prev) => {
      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next.map((b, i) => ({ ...b, order: i }));
    });
  };

  const handleSaveQuestion = async (q: AdminLessonQuestion) => {
    try {
      if (q.id) {
        const updated = await updateQuestion({
          questionId: q.id,
          payload: q,
        }).unwrap();
        setQuestions((prev) =>
          prev.map((existing) => (existing.id === q.id ? updated : existing)),
        );
        toast.success("Question saved");
      } else {
        const { id: _, ...payload } = q as any;
        const created = await addQuestion({ lessonId, payload }).unwrap();
        setQuestions((prev) => [...prev, created]);
        toast.success("Question added");
      }
    } catch (err) {
      toast.error(getApiError(err, "Failed to save question"));
    }
  };

  const handleDeleteQuestion = async (q: AdminLessonQuestion) => {
    modal.confirm({
      title: "Delete this question?",
      okText: "Delete",
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          if (q.id) await deleteQuestion(q.id).unwrap();
          setQuestions((prev) => prev.filter((existing) => existing !== q));
          toast.success("Question deleted");
        } catch (err) {
          toast.error(getApiError(err, "Failed to delete question"));
        }
      },
    });
  };

  if (isLoading || !meta)
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <Spin />
      </div>
    );

  return (
    <div className="min-h-screen w-full">
      <button
        type="button"
        onClick={() => router.push(`/core/admin/courses/${topicId}/lessons`)}
        className="flex items-center text-[#8A8A8A] gap-1.5 text-sm cursor-pointer font-medium mb-5"
      >
        <ArrowLeft size={14} />
        Back to lessons
      </button>
      <h1 className="text-2xl font-semibold mb-6 text-[#0e1430]">
        Edit lesson
      </h1>

      <div className="rounded-2xl p-6 mb-6 bg-white border border-[#EDE0FB]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm text-[#8A8A8A] font-semibold uppercase tracking-wide">
            Details
          </h3>
          {metaDirty && (
            <Button
              size="small"
              type="primary"
              loading={savingMeta}
              onClick={handleSaveMeta}
              style={{ background: "#3A0CA3" }}
            >
              Save details
            </Button>
          )}
        </div>
        <LessonMetaForm value={meta} onChange={handleMetaChange} />
      </div>

      <div className="rounded-2xl p-6 mb-6 bg-white border border-[#EDE0FB]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-[#8A8A8A]">
            Content blocks ({blocks.length})
          </h3>
          <Button
            size="middle"
            icon={<Plus size={16} />}
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

      <div className="rounded-2xl p-6 mb-6 bg-white border border-[#EDE0FB]">
        <div className="flex items-center justify-between mb-4">
          <h3
            className="text-[13px] font-bold uppercase tracking-wide"
            style={{ color: "#8A8A8A" }}
          >
            Questions ({questions.length})
          </h3>
          <Button
            size="middle"
            icon={<Plus size={16} />}
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

      <ContentBlockFormModal
        block={editingBlock}
        nextOrder={blocks.length}
        open={blockModalOpen}
        onClose={() => setBlockModalOpen(false)}
        onSave={handleSaveBlock}
      />
      <QuestionFormModal
        question={editingQuestion}
        nextOrder={questions.length}
        open={questionModalOpen}
        onClose={() => setQuestionModalOpen(false)}
        onSave={handleSaveQuestion}
      />
    </div>
  );
}
