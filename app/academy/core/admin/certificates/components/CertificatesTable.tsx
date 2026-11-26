import { Table } from "antd";
import { ShieldOff, ExternalLink } from "lucide-react";
import { GradeTag } from "./GradeTag";
import { CriteriaBreakdown } from "./CriteriaBreakdown";
import type { AdminCertificate } from "@/apis/admin/certificates/types";
import Link from "next/link";

export function CertificatesTable({
  certificates,
  loading,
  pagination,
  onPageChange,
  onRevoke,
}: {
  certificates: AdminCertificate[];
  loading: boolean;
  pagination: { page: number; limit: number; total: number };
  onPageChange: (page: number) => void;
  onRevoke: (cert: AdminCertificate) => void;
}) {
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
            className="w-8 h-8 rounded-full object-cover"
          />
          <div>
            <p className="text-base font-semibold" style={{ color: "#0e1430" }}>
              {c.user.firstName} {c.user.lastName}
            </p>
            <p className="text-sm text-gray-500">{c.user.email}</p>
          </div>
        </div>
      ),
    },
    {
      title: "Course",
      key: "course",
      render: (_: unknown, c: AdminCertificate) => (
        <div>
          <p className="text-base font-medium" style={{ color: "#374151" }}>
            {c.topic.name}
          </p>
          {c.topic.parent && (
            <p className="text-sm text-gray-500">{c.topic.parent.name}</p>
          )}
        </div>
      ),
    },
    {
      title: "Grade",
      dataIndex: "overallGrade",
      key: "overallGrade",
      width: 80,
      render: (g: AdminCertificate["overallGrade"]) => <GradeTag grade={g} />,
    },
    {
      title: "Certificate ID",
      dataIndex: "certificateId",
      key: "certificateId",
      render: (id: string) => (
        <span className="text-sm font-mono text-gray-500" style={{ letterSpacing: 0.5 }}>
          {id}
        </span>
      ),
    },
    {
      title: "Issued",
      dataIndex: "issuedAt",
      key: "issuedAt",
      width: 110,
      render: (d: string) => (
        <span className="text-sm text-gray-500">
          {new Date(d).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      ),
    },
    {
      title: "",
      key: "actions",
      width: 100,
      render: (_: unknown, c: AdminCertificate) => (
        <div className="flex items-center gap-1">
          <Link
            href={`/certificates/verify/${c.certificateId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-full hover:bg-gray-100"
            title="View public verification page"
          >
            <ExternalLink size={16} style={{ color: "#6B7280" }} />
          </Link>
          <button
            type="button"
            onClick={() => onRevoke(c)}
            className="p-1.5 cursor-pointer rounded-full hover:bg-red-50"
            title="Revoke"
          >
            <ShieldOff size={16} style={{ color: "#DC2626" }} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <Table
      dataSource={certificates}
      columns={columns}
      rowKey="id"
      loading={loading}
      expandable={{
        expandedRowRender: (c) => (
          <div className="py-2 px-4">
            <CriteriaBreakdown cert={c} />
          </div>
        ),
      }}
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
