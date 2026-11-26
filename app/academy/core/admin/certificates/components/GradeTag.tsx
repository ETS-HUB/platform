import { Tag } from "antd";
import type { Grade } from "@/apis/admin/certificates/types";

const GRADE_COLOR: Record<Grade, string> = {
  A: "green",
  B: "blue",
  "B-": "gold",
  C: "orange",
};

export function GradeTag({ grade }: { grade: Grade }) {
  return (
    <Tag
      color={GRADE_COLOR[grade]}
      bordered={false}
      style={{ fontWeight: 600, fontSize: 14 }}
    >
      {grade}
    </Tag>
  );
}
