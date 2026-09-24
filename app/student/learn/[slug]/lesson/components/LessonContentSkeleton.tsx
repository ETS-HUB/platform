import { Skeleton } from "antd";

export function LessonContentSkeleton() {
  return (
    <div className="p-10">
      {/* header */}
      <div className="mb-6">
        <Skeleton.Button
          active
          size="small"
          shape="round"
          style={{ width: 90, height: 28 }}
          className="mb-4"
        />
        <div className="flex items-center gap-2 mb-2">
          <Skeleton.Button
            active
            size="small"
            shape="round"
            style={{ width: 70, height: 20 }}
          />
          <Skeleton.Input
            active
            size="small"
            style={{ width: 60, height: 14 }}
          />
        </div>
        <Skeleton.Input
          active
          size="large"
          style={{ width: "55%", height: 28 }}
        />
      </div>

      {/* stepper */}
      <div className="flex items-center gap-1.5 mb-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex-1 flex flex-col gap-1.5">
            <Skeleton.Input
              active
              size="small"
              style={{ width: "100%", height: 6, borderRadius: 999 }}
            />
          </div>
        ))}
      </div>

      {/* content card */}
      <div
        className="rounded-2xl p-6"
        style={{ background: "#FFFFFF", border: "1.5px solid #EDE0FB" }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Skeleton.Avatar active size={28} shape="circle" />
          <Skeleton.Input
            active
            size="small"
            style={{ width: 140, height: 16 }}
          />
        </div>
        <Skeleton
          active
          title={false}
          paragraph={{ rows: 5, width: ["100%", "95%", "88%", "100%", "60%"] }}
        />
      </div>

      {/* nav row */}
      <div className="flex items-center justify-between mt-6">
        <Skeleton.Input
          active
          size="small"
          style={{ width: 70, height: 32, borderRadius: 999 }}
        />
        <Skeleton.Button
          active
          size="default"
          shape="round"
          style={{ width: 110, height: 40 }}
        />
      </div>
    </div>
  );
}
