"use client";
import toast from "react-hot-toast";

import { useState } from "react";
import { Button, Select, Modal, message } from "antd";import { useAdminModal } from "@/hooks/useAdminModal";

import { Plus, UploadCloud } from "lucide-react";
import { QuestionsTable } from "./components/QuestionsTable";
import { QuestionFormModal } from "./components/QuestionFormModal";
import { BulkUploadModal } from "./components/BulkUploadModal";
import type {
  AdminQuestion,
  Difficulty,
  CreateQuestionPayload,
  BulkUploadResult,
} from "@/apis/admin/questions/types";
import {
  useGetQuestionsQuery,
  useCreateQuestionMutation,
  useBulkCreateQuestionsMutation,
  useUpdateQuestionMutation,
  useDeleteQuestionMutation,
} from "@/apis/admin/questions/questionsService";
import { useGetTopicsQuery } from "@/apis/admin/courses/coursesService";
import Header from "@/components/ui/Header";
import { getApiError } from "@/lib/apiError";

export default function AdminQuestionsPage() {
  const modal = useAdminModal();
  const [topicFilter, setTopicFilter] = useState<string | undefined>();
  const [difficultyFilter, setDifficultyFilter] = useState<
    Difficulty | undefined
  >();
  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<AdminQuestion | null>(
    null,
  );
  const [bulkOpen, setBulkOpen] = useState(false);

  const { data: topicsData = [] } = useGetTopicsQuery();
  const { data: questionsData, isLoading } = useGetQuestionsQuery({
    topicId: topicFilter,
    difficulty: difficultyFilter,
    page,
    limit: 50,
  });
  const [createQuestion] = useCreateQuestionMutation();
  const [bulkCreate] = useBulkCreateQuestionsMutation();
  const [updateQuestion] = useUpdateQuestionMutation();
  const [deleteQuestion] = useDeleteQuestionMutation();

  const questions = questionsData?.questions ?? [];
  const pagination = questionsData?.pagination ?? {
    page: 1,
    limit: 50,
    total: 0,
  };
  const topics = topicsData.flatMap((cat) =>
    (cat.children ?? []).map((c) => ({ id: c.id, name: c.name })),
  );

  const handleSaveQuestion = async (
    id: string | null,
    payload: CreateQuestionPayload,
  ) => {
    try {
      if (id) {
        await updateQuestion({ id, payload }).unwrap();
        toast.success("Question updated");
      } else {
        await createQuestion(payload).unwrap();
        toast.success("Question created");
      }
    } catch (err) {
      toast.error(getApiError(err, "Failed to save question"));
    }
  };

  const handleDelete = (q: AdminQuestion) => {
    modal.confirm({
      title: "Delete this question?",
      content:
        "This question will be soft-deleted and removed from the assessment bank.",
      okText: "Delete",
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await deleteQuestion(q.id).unwrap();
          toast.success("Question deleted");
        } catch (err) {
          toast.error(getApiError(err, "Failed to delete question"));
        }
      },
    });
  };

  const handleBulkUpload = async (
    bulkQuestions: CreateQuestionPayload[],
  ): Promise<BulkUploadResult> => {
    try {
      const result = await bulkCreate({ questions: bulkQuestions }).unwrap();
      toast.success(`${result.uploaded} questions uploaded`);
      return result;
    } catch (err) {
      toast.error(getApiError(err, "Bulk upload failed"));
      return { uploaded: 0, questions: [] };
    }
  };

  return (
    <div className="min-h-screen w-full">
      <div className="flex items-start justify-between mb-6">
        <Header
          title="Assessment bank"
          subtitle={`${pagination.total} question${pagination.total === 1 ? "" : "s"} across all topics.`}
        />
        <div className="flex items-center gap-2">
          <Button
            icon={<UploadCloud size={14} />}
            onClick={() => setBulkOpen(true)}
          >
            Bulk upload
          </Button>
          <Button
            icon={<Plus size={14} />}
            onClick={() => {
              setEditingQuestion(null);
              setFormOpen(true);
            }}
            style={{ background: "#3A0CA3", color: "#FFFFFF" }}
          >
            New question
          </Button>
        </div>
      </div>
      <div className="flex items-center gap-2 mb-4">
        <Select
          allowClear
          size="large"
          placeholder="All topics"
          style={{ width: 180 }}
          value={topicFilter}
          onChange={(v) => {
            setTopicFilter(v);
            setPage(1);
          }}
          options={topics.map((t) => ({ label: t.name, value: t.id }))}
        />
        <Select
          allowClear
          size="large"
          placeholder="All difficulties"
          style={{ width: 160 }}
          value={difficultyFilter}
          onChange={(v) => {
            setDifficultyFilter(v);
            setPage(1);
          }}
          options={[
            { label: "Easy", value: "EASY" },
            { label: "Medium", value: "MEDIUM" },
            { label: "Hard", value: "HARD" },
          ]}
        />
      </div>
      <QuestionsTable
        questions={questions}
        loading={isLoading}
        pagination={pagination}
        onPageChange={setPage}
        onEdit={(q) => {
          setEditingQuestion(q);
          setFormOpen(true);
        }}
        onDelete={handleDelete}
      />
      <QuestionFormModal
        question={editingQuestion}
        topics={topics}
        defaultTopicId={topicFilter}
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSave={handleSaveQuestion}
      />
      <BulkUploadModal
        open={bulkOpen}
        onClose={() => setBulkOpen(false)}
        onUpload={handleBulkUpload}
      />
    </div>
  );
}
