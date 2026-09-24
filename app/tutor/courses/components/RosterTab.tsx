"use client";

import { useState } from "react";
import { Table } from "antd";
import { StudentProgressDrawer } from "./StudentProgressDrawer";
import type { RosterStudent } from "@/apis/tutor/courses/types";
import { useGetTopicStudentsQuery } from "@/apis/tutor/tutorService";

export function RosterTab({ topicId }: { topicId: string }) {
  const [page, setPage] = useState(1);
  const [viewingStudent, setViewingStudent] = useState<RosterStudent | null>(
    null,
  );

  const { data, isLoading } = useGetTopicStudentsQuery({
    topicId,
    page,
    limit: 20,
  });
  const students = data?.students ?? [];
  const pagination = data?.pagination ?? { page: 1, limit: 20, total: 0 };
  const totalEnrolled = data?.totalEnrolled ?? 0;

  const columns = [
    {
      title: "Student",
      key: "student",
      render: (_: unknown, s: RosterStudent) => (
        <div className="flex items-center gap-2.5">
          <img
            src={
              s.avatar ||
              `https://api.dicebear.com/7.x/avataaars/svg?seed=${s.firstName}`
            }
            alt=""
            className="w-8 h-8 rounded-full object-cover"
          />
          <span
            className="text-[13px] font-medium"
            style={{ color: "#0e1430" }}
          >
            {s.firstName} {s.lastName}
          </span>
        </div>
      ),
    },
    {
      title: "Enrolled",
      dataIndex: "enrolledAt",
      key: "enrolledAt",
      render: (d: string) => (
        <span className="text-[12.5px]" style={{ color: "#6B7280" }}>
          {new Date(d).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      ),
    },
  ];

  return (
    <div>
      <p className="text-[13px] mb-3" style={{ color: "#6B7280" }}>
        {totalEnrolled} students enrolled — click a student to view their
        progress
      </p>

      <Table
        dataSource={students}
        columns={columns}
        rowKey="id"
        loading={isLoading}
        onRow={(record) => ({
          onClick: () => setViewingStudent(record),
          style: { cursor: "pointer" },
        })}
        pagination={{
          current: pagination.page,
          pageSize: pagination.limit,
          total: pagination.total,
          onChange: setPage,
          showSizeChanger: false,
        }}
      />

      <StudentProgressDrawer
        student={viewingStudent}
        topicId={topicId}
        onClose={() => setViewingStudent(null)}
      />
    </div>
  );
}
