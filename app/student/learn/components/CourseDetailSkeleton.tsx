"use client";

import { Skeleton } from "antd";

export function CourseDetailSkeleton() {
  return (
    <div className="min-h-screen w-full">
      <div>
        {/* breadcrumb */}
        <div className="flex items-center gap-3 mb-6">
          <Skeleton.Button
            active
            size="small"
            shape="round"
            style={{ width: 80, height: 32 }}
          />
          <Skeleton.Input
            active
            size="small"
            style={{ width: 40, height: 14 }}
          />
          <Skeleton.Input
            active
            size="small"
            style={{ width: 90, height: 14 }}
          />
        </div>

        {/* hero */}
        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8 mb-10">
          <Skeleton.Node
            active
            style={{ width: "100%", height: 200, borderRadius: 16 }}
          >
            {" "}
          </Skeleton.Node>

          <div className="flex flex-col gap-3">
            <Skeleton.Button
              active
              size="small"
              shape="round"
              style={{ width: 100, height: 24 }}
            />
            <Skeleton.Input
              active
              size="large"
              style={{ width: "70%", height: 30 }}
            />
            <div className="flex flex-col gap-2 mt-1">
              <Skeleton.Input
                active
                size="small"
                style={{ width: "95%", height: 14 }}
              />
              <Skeleton.Input
                active
                size="small"
                style={{ width: "80%", height: 14 }}
              />
            </div>

            <div className="flex items-center gap-4 mt-2">
              <Skeleton.Input
                active
                size="small"
                style={{ width: 80, height: 14 }}
              />
              <Skeleton.Input
                active
                size="small"
                style={{ width: 70, height: 14 }}
              />
            </div>

            <div className="flex items-center gap-3 mt-1">
              <Skeleton.Input
                active
                size="small"
                style={{ width: 120, height: 14 }}
              />
              <Skeleton.Avatar active size={28} shape="circle" />
            </div>

            <div className="max-w-sm mt-2 w-full">
              <Skeleton.Input
                active
                size="small"
                style={{ width: "100%", height: 8, borderRadius: 999 }}
              />
            </div>

            <div className="flex items-center gap-3 mt-3">
              <Skeleton.Button
                active
                size="default"
                shape="round"
                style={{ width: 150, height: 42 }}
              />
              <Skeleton.Avatar
                active
                size={40}
                shape="square"
                style={{ borderRadius: 8 }}
              />
            </div>
          </div>
        </div>

        {/* body: lessons + sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_520px] gap-8">
          <div>
            <Skeleton.Input
              active
              size="small"
              style={{ width: 140, height: 14 }}
              className="mb-4"
            />
            <div className="flex flex-col gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 px-5 py-3.5 rounded-xl"
                  style={{ background: "#FAFAFA", border: "1px solid #E5E7EB" }}
                >
                  <Skeleton.Avatar active size={18} shape="circle" />
                  <div className="flex-1 flex flex-col gap-1.5">
                    <Skeleton.Input
                      active
                      size="small"
                      style={{ width: "50%", height: 14 }}
                    />
                    <Skeleton.Input
                      active
                      size="small"
                      style={{ width: "30%", height: 12 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-5">
            {[130, 160, 180].map((h, i) => (
              <div
                key={i}
                className="rounded-xl p-5"
                style={{ border: "1.5px solid #EDE0FB" }}
              >
                <Skeleton
                  active
                  title={{ width: 100 }}
                  paragraph={{ rows: 2, width: ["100%", "60%"] }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
