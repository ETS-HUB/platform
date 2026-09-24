"use client";
import toast from "react-hot-toast";

import { useState } from "react";
import { Table, Select, Tag, Pagination } from "antd";
import { ShieldOff } from "lucide-react";
import { useAdminModal } from "@/hooks/useAdminModal";
import type { AdminCertificate, Grade } from "@/apis/admin/certificates/types";
import {
  useGetAdminCertificatesQuery,
  useRevokeCertificateMutation,
} from "@/apis/admin/certificates/certificatesService";
import { useGetTopicsQuery } from "@/apis/admin/courses/coursesService";
import { useGetAdminUsersQuery } from "@/apis/admin/users/usersService";
import type { CourseNode } from "@/apis/admin/courses/types";
import Header from "@/components/ui/Header";
import { getApiError } from "@/lib/apiError";

const PAGE_SIZE = 20;

const GRADE_COLORS: Record<Grade, string> = {
  A: "green",
  B: "blue",
  "B-": "cyan",
  C: "orange",
};

export default function AdminCertificatesPage() {
  const modal = useAdminModal();

  const [topicFilter, setTopicFilter] = useState<string | undefined>();
  const [userFilter, setUserFilter] = useState<string | undefined>();
  const [gradeFilter, setGradeFilter] = useState<Grade | undefined>();
  const [page, setPage] = useState(1);

  const { data, isLoading } = useGetAdminCertificatesQuery({
    topicId: topicFilter,
    userId: userFilter,
    grade: gradeFilter,
    page,
    limit: PAGE_SIZE,
  });

  const { data: topicsData = [] } = useGetTopicsQuery();
  const { data: usersData } = useGetAdminUsersQuery({ page: 1, limit: 100 });

  const [revoke] = useRevokeCertificateMutation();

  const certificates = data?.certificates ?? [];
  const pagination = data?.pagination;

  const allTopics = topicsData.flatMap((cat: CourseNode) =>
    (cat.children ?? []).map((c: CourseNode) => ({
      id: c.id,
      label: `${cat.name} › ${c.name}`,
    })),
  );

  const allUsers = (usersData?.users ?? []).map((u) => ({
    id: u.id,
    label: `${u.firstName} ${u.lastName} (${u.email})`,
  }));

  const handleRevoke = (cert: AdminCertificate) => {
    modal.confirm({
      title: `Revoke certificate for ${cert.user.firstName} ${cert.user.lastName}?`,
      content: `This will permanently remove their "${cert.topic.name}" certificate. This cannot be undone.`,
      okText: "Revoke",
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await revoke({
            topicId: cert.topic.name,
            userId: cert.user.id,
          }).unwrap();
          toast.success("Certificate revoked");
        } catch (err) {
          toast.error(getApiError(err, "Failed to revoke certificate"));
        }
      },
    });
  };

  const resetFilters = () => {
    setTopicFilter(undefined);
    setUserFilter(undefined);
    setGradeFilter(undefined);
    setPage(1);
  };

  const columns = [
    {
      title: "Student",
      key: "student",
      render: (_: unknown, c: AdminCertificate) => (
        <div className="flex items-center gap-2.5">
          <img
            src={
              c.user.avatar ||
              `https://api.dicebear.com/7.x/avataaars/svg?seed=${c.user.firstName}`
            }
            alt=""
            className="w-8 h-8 rounded-full object-cover shrink-0"
          />
          <div>
            <p className="text-sm font-semibold text-gray-900">
              {c.user.firstName} {c.user.lastName}
            </p>
            <p className="text-xs text-gray-400">{c.user.email}</p>
          </div>
        </div>
      ),
    },
    {
      title: "Course",
      key: "course",
      render: (_: unknown, c: AdminCertificate) => (
        <div>
          <p className="text-sm font-medium text-gray-800">{c.topic.name}</p>
          {c.topic.parent && (
            <p className="text-xs text-gray-400">{c.topic.parent.name}</p>
          )}
        </div>
      ),
    },
    {
      title: "Grade",
      key: "grade",
      width: 80,
      render: (_: unknown, c: AdminCertificate) => (
        <Tag color={GRADE_COLORS[c.overallGrade]} bordered={false}>
          {c.overallGrade}
        </Tag>
      ),
    },
    {
      title: "Score",
      key: "score",
      width: 100,
      render: (_: unknown, c: AdminCertificate) => (
        <span className="text-sm text-gray-600">
          {c.averageQuizScore.toFixed(1)}%
        </span>
      ),
    },
    {
      title: "Progress",
      key: "progress",
      width: 140,
      render: (_: unknown, c: AdminCertificate) => (
        <span className="text-xs text-gray-500">
          {c.lessonsCompleted}/{c.totalLessons} lessons
          {c.totalProjects > 0
            ? ` · ${c.projectsApproved}/${c.totalProjects} projects`
            : ""}
        </span>
      ),
    },
    {
      title: "Issued",
      dataIndex: "issuedAt",
      key: "issuedAt",
      width: 110,
      render: (d: string) => (
        <span className="text-xs text-gray-500">
          {new Date(d).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      ),
    },
    {
      title: "Cert ID",
      dataIndex: "certificateId",
      key: "certificateId",
      width: 130,
      render: (id: string) => (
        <span className="text-xs font-mono text-gray-400 truncate block max-w-[120px]">
          {id}
        </span>
      ),
    },
    {
      title: "",
      key: "actions",
      width: 60,
      render: (_: unknown, c: AdminCertificate) => (
        <button
          type="button"
          onClick={() => handleRevoke(c)}
          className="p-1.5 rounded-full hover:bg-red-50 cursor-pointer"
          title="Revoke certificate"
        >
          <ShieldOff size={15} style={{ color: "#DC2626" }} />
        </button>
      ),
    },
  ];

  return (
    <div className="min-h-screen w-full">
      <div className="flex items-start justify-between mb-6">
        <Header
          title="Certificates"
          subtitle={
            pagination
              ? `${pagination.total} certificate${pagination.total === 1 ? "" : "s"} issued`
              : "Issued certificates across all courses."
          }
        />
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <Select
          allowClear
          showSearch
          placeholder="All courses"
          style={{ width: 240 }}
          size="large"
          value={topicFilter}
          onChange={(v) => {
            setTopicFilter(v);
            setPage(1);
          }}
          filterOption={(input, opt) =>
            ((opt?.label as string) ?? "")
              .toLowerCase()
              .includes(input.toLowerCase())
          }
          options={allTopics.map((t) => ({ label: t.label, value: t.id }))}
        />
        <Select
          allowClear
          showSearch
          placeholder="All students"
          style={{ width: 240 }}
          size="large"
          value={userFilter}
          onChange={(v) => {
            setUserFilter(v);
            setPage(1);
          }}
          filterOption={(input, opt) =>
            ((opt?.label as string) ?? "")
              .toLowerCase()
              .includes(input.toLowerCase())
          }
          options={allUsers.map((u) => ({ label: u.label, value: u.id }))}
        />
        <Select
          allowClear
          placeholder="All grades"
          style={{ width: 130 }}
          size="large"
          value={gradeFilter}
          onChange={(v) => {
            setGradeFilter(v);
            setPage(1);
          }}
          options={[
            { label: "A", value: "A" },
            { label: "B", value: "B" },
            { label: "B-", value: "B-" },
            { label: "C", value: "C" },
          ]}
        />
        {(topicFilter || userFilter || gradeFilter) && (
          <button
            type="button"
            onClick={resetFilters}
            className="text-xs text-gray-400 hover:text-gray-600 underline"
          >
            Clear filters
          </button>
        )}
      </div>

      <Table
        dataSource={certificates}
        columns={columns}
        rowKey="certificateId"
        loading={isLoading}
        pagination={false}
        locale={{ emptyText: "No certificates match the current filters." }}
      />

      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <Pagination
            current={page}
            total={pagination.total}
            pageSize={PAGE_SIZE}
            onChange={(p) => setPage(p)}
          />
        </div>
      )}
    </div>
  );
}
