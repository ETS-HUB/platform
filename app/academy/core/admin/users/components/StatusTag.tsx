import { Tag } from "antd";

export function StatusTag({ isActive }: { isActive: boolean }) {
  return (
    <Tag
      className="text-sm! font-medium"
      color={isActive ? "green" : "default"}
      bordered={false}
    >
      {isActive ? "Active" : "Deactivated"}
    </Tag>
  );
}
