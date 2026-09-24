"use client";

import { useState } from "react";
import { Select } from "antd";
import type { RecentActivityItem } from "@/apis/admin/analytics/types";

function formatRelativeDate(dateStr: string) {
  const diffDays = Math.floor(
    (Date.now() - new Date(dateStr).getTime()) / 86400000,
  );
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return new Date(dateStr).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

export function RecentActivityFeed({
  activity,
  limit,
  onLimitChange,
}: {
  activity: RecentActivityItem[];
  limit: number;
  onLimitChange: (limit: number) => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3
          className="text-[13px] font-bold uppercase tracking-wide"
          style={{ color: "#8A8A8A" }}
        >
          Recent activity
        </h3>
        <Select
          value={limit}
          onChange={onLimitChange}
          size="middle"
          style={{ width: 90 }}
          options={[
            { label: "Last 3", value: 3 },
            { label: "Last 5", value: 5 },
            { label: "Last 10", value: 10 },
          ]}
        />
      </div>

      {activity.length === 0 ? (
        <p className="text-[12.5px] py-4" style={{ color: "#9CA3AF" }}>
          No recent completions.
        </p>
      ) : (
        <div className="flex flex-col">
          {activity.map((item, i) => {
            const color =
              item.score >= 70
                ? "#059669"
                : item.score >= 40
                  ? "#D97706"
                  : "#DC2626";
            return (
              <div
                key={i}
                className="flex items-center justify-between py-3"
                style={{
                  borderBottom:
                    i < activity.length - 1 ? "1px solid #F2F2F2" : "none",
                }}
              >
                <div className="min-w-0">
                  <p className="text-base font-medium truncate text-gray-700">
                    {item.studentName}
                  </p>
                  <p className="text-sm truncate text-gray-500">
                    {item.assessment} · {formatRelativeDate(item.completedAt)}
                  </p>
                </div>
                <span
                  className="text-base font-bold shrink-0 ml-3"
                  style={{ color }}
                >
                  {item.score}%
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
