import { Tag } from "antd";
import type { Difficulty } from "@/apis/admin/questions/types";

const COLOR: Record<Difficulty, string> = {
  EASY: "green",
  MEDIUM: "orange",
  HARD: "red",
};

export function DifficultyTag({ difficulty }: { difficulty: Difficulty }) {
  return (
    <Tag style={{ fontSize: "14px" }} color={COLOR[difficulty]} bordered={false}>
      {difficulty}
    </Tag>
  );
}
