import { Skeleton } from "antd";

export function LessonSidebarSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="flex flex-col">
      <Skeleton.Input
        active
        size="small"
        style={{ width: 110, height: 12 }}
        className="mb-4 ml-1"
      />
      <div className="flex flex-col">
        {Array.from({ length: rows }).map((_, i) => {
          const isLast = i === rows - 1;
          return (
            <div key={i} className="flex gap-3">
              <div className="flex flex-col items-center">
                <Skeleton.Avatar active size={22} shape="circle" />
                {!isLast && (
                  <div
                    className="w-[2px] flex-1 my-0.5"
                    style={{ minHeight: 24, background: "#F0F0F0" }}
                  />
                )}
              </div>
              <div className="flex-1 pb-6 pr-2 pt-0.5">
                <Skeleton.Input
                  active
                  size="small"
                  style={{ width: `${70 - (i % 3) * 10}%`, height: 13 }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
