"use client";

import { Skeleton } from "antd";

export function CourseCardSkeleton() {
  return (
    <div
      className="relative rounded-2xl p-6 pr-8 flex items-center justify-between gap-6 w-full overflow-hidden"
      style={{
        background: "#FBFAFE",
        border: "1.5px solid #EDE0FB",
        minHeight: "180px",
      }}
    >
      <div className="flex flex-col gap-3 w-full max-w-[62%]">
        <Skeleton.Button
          active
          size="small"
          shape="round"
          style={{ width: 90, height: 20 }}
        />

        <div className="flex items-center gap-2.5 mt-1">
          <Skeleton.Avatar active size={22} shape="circle" />
          <Skeleton.Input active size="small" style={{ width: 140 }} />
        </div>

        <div className="flex items-center gap-4 mt-1">
          <Skeleton.Input
            active
            size="small"
            style={{ width: 70, height: 14 }}
          />
          <Skeleton.Input
            active
            size="small"
            style={{ width: 50, height: 14 }}
          />
        </div>

        <div className="max-w-[220px] mt-1 w-full">
          <div className="flex justify-between mb-1.5">
            <Skeleton.Input
              active
              size="small"
              style={{ width: 60, height: 12 }}
            />
            <Skeleton.Input
              active
              size="small"
              style={{ width: 28, height: 12 }}
            />
          </div>
          <Skeleton.Input
            active
            size="small"
            style={{ width: "100%", height: 6, borderRadius: 999 }}
          />
        </div>
      </div>

      <Skeleton.Avatar
        active
        shape="circle"
        size={90}
        style={{ position: "absolute", right: -10, bottom: -20, opacity: 0.6 }}
      />
    </div>
  );
}
