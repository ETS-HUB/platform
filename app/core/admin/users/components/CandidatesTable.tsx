import { Table } from "antd";
import type {
  CandidateListItem,
  UsersPagination,
} from "@/apis/admin/users/types";

export function CandidatesTable({
  candidates,
  pagination,
  loading,
  onPageChange,
}: {
  candidates: CandidateListItem[];
  pagination: UsersPagination;
  loading: boolean;
  onPageChange: (page: number) => void;
}) {
  const columns = [
    {
      title: "Name",
      key: "name",
      render: (_: unknown, c: CandidateListItem) => (
        <div>
          <p className="text-base font-semibold text-[#0e1430]">
            {c.user.firstName} {c.user.lastName}
          </p>
          <p className="text-xs text-gray-500">{c.user.email}</p>
        </div>
      ),
    },
    {
      title: "Goal",
      key: "goal",
      render: (_: unknown, c: CandidateListItem) => (
        <span className="text-sm text-gray-600">{c.goal}</span>
      ),
    },
    {
      title: "Level",
      key: "level",
      render: (_: unknown, c: CandidateListItem) => (
        <span className="text-sm font-medium text-[#3A0CA3]">
          Lv {c.level} · {c.xp} XP
        </span>
      ),
    },
    {
      title: "Experience",
      key: "experience",
      render: (_: unknown, c: CandidateListItem) => (
        <span className="text-sm text-gray-600 capitalize">
          {c.experienceLevel.toLowerCase()}
        </span>
      ),
    },
    {
      title: "Latest score",
      key: "score",
      render: (_: unknown, c: CandidateListItem) => {
        const latest = c.user.assessmentAttempts?.[0];
        if (!latest) return <span style={{ color: "#C4C4C4" }}>—</span>;
        const score = Math.round(latest.percentageScore);
        const color =
          score >= 70 ? "#059669" : score >= 40 ? "#D97706" : "#DC2626";
        return (
          <span className="text-base font-semibold" style={{ color }}>
            {score}%
          </span>
        );
      },
    },
    {
      title: "Badges",
      key: "badges",
      render: (_: unknown, c: CandidateListItem) =>
        c.badges.length === 0 ? (
          <span style={{ color: "#C4C4C4" }}>—</span>
        ) : (
          <div className="flex flex-wrap gap-1">
            {c.badges.slice(0, 3).map((b) => (
              <span
                key={b.id}
                className="text-[11px] px-2 py-0.5 rounded-full font-medium"
                style={{ background: "#FCE3F1", color: "#7A1C54" }}
                title={b.description}
              >
                {b.name}
              </span>
            ))}
            {c.badges.length > 3 && (
              <span className="text-[11px]" style={{ color: "#8B84A0" }}>
                +{c.badges.length - 3}
              </span>
            )}
          </div>
        ),
    },
  ];

  return (
    <Table
      dataSource={candidates}
      columns={columns}
      rowKey="id"
      loading={loading}
      pagination={{
        current: pagination.page,
        pageSize: pagination.limit,
        total: pagination.total,
        onChange: onPageChange,
        showSizeChanger: false,
      }}
    />
  );
}
