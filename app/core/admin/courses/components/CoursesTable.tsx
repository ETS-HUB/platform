import { Dropdown, Table, Tag, type MenuProps } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import { Plus, Pencil } from "lucide-react";
import { DeleteTopicButton } from "./DeleteTopicButton";
import type { CourseNode } from "@/apis/admin/courses/types";

export function CoursesTable({
  categories,
  onEditCategory,
  onEditCourse,
  onEditCourseLessons,
  onAddCourse,
  onDelete,
}: {
  categories: CourseNode[];
  onEditCategory: (category: CourseNode) => void;
  onEditCourse: (course: CourseNode) => void;
  onEditCourseLessons: (course: CourseNode) => void;
  onAddCourse: (parentId: string) => void;
  onDelete: (id: string) => Promise<void>;
}) {
  const columns = [
    {
      title: "Name",
      key: "name",
      render: (_: unknown, node: CourseNode) => {
        const isCategory = node.parentId === null;
        return (
          <div className="flex items-center gap-2">
            {node.imageUrl ? (
              <img
                src={node.imageUrl}
                alt={node.name}
                className="w-6 h-6 rounded object-contain"
              />
            ) : null}
            <span
              className="font-semibold"
              style={{
                fontSize: isCategory ? 15 : 14.5,
                color: isCategory ? "#0e1430" : "#374151",
              }}
            >
              {node.name}
            </span>
            {isCategory && (
              <Tag color="purple" bordered={false} style={{ fontSize: 14 }}>
                Category
              </Tag>
            )}
            {!isCategory && node.isSequential && (
              <Tag
                bordered={false}
                style={{
                  fontSize: 14,
                  background: "#F5F5F5",
                  color: "#6B7280",
                }}
              >
                Sequential
              </Tag>
            )}
          </div>
        );
      },
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (desc: string | null) => (
        <span
          className="text-sm"
          style={{ color: desc ? "#6B7280" : "#C4C4C4" }}
        >
          {desc || "—"}
        </span>
      ),
    },
    {
      title: "Questions",
      key: "questions",
      width: 110,
      render: (_: unknown, node: CourseNode) =>
        node.parentId === null ? (
          <span style={{ color: "#C4C4C4" }}>—</span>
        ) : (
          <span
            className="text-base font-semibold"
            style={{ color: node._count.questions > 0 ? "#3A0CA3" : "#C4C4C4" }}
          >
            {node._count.questions}
          </span>
        ),
    },
    {
      title: "Min. score",
      key: "minQuizScore",
      width: 100,
      render: (_: unknown, node: CourseNode) =>
        node.parentId !== null && node.minQuizScore != null ? (
          <span className="text-base text-[#6B7280]">{node.minQuizScore}%</span>
        ) : (
          <span style={{ color: "#C4C4C4" }}>—</span>
        ),
    },
    {
      title: "",
      key: "actions",
      width: 120,
      render: (_: unknown, node: CourseNode) => {
        const isCategory = node.parentId === null;

        const courseMenu: MenuProps["items"] = [
          {
            key: "details",
            label: "Edit Course Details",
          },
          {
            key: "lessons",
            label: "Edit Course Lessons",
          },
          {
            type: "divider",
          },
          {
            key: "delete",
            label: <span className="text-red-500">Delete Course</span>,
          },
        ];

        const handleCourseMenuClick: MenuProps["onClick"] = ({ key }) => {
          switch (key) {
            case "details":
              onEditCourse(node);
              break;

            case "lessons":
              onEditCourseLessons(node); // create/pass this handler
              break;

            case "delete":
              onDelete(node.id);
              break;
          }
        };

        return (
          <div className="flex items-center gap-1">
            {isCategory ? (
              <>
                <button
                  type="button"
                  onClick={() => onAddCourse(node.id)}
                  className="p-1.5 rounded-full hover:bg-gray-100"
                  title="Add course"
                >
                  <Plus size={16} style={{ color: "#3A0CA3" }} />
                </button>

                <button
                  type="button"
                  onClick={() => onEditCategory(node)}
                  className="p-1.5 rounded-full hover:bg-gray-100"
                  title="Edit category"
                >
                  <Pencil size={16} style={{ color: "#6B7280" }} />
                </button>

                <DeleteTopicButton node={node} isCategory onDelete={onDelete} />
              </>
            ) : (
              <Dropdown
                menu={{
                  items: courseMenu,
                  onClick: handleCourseMenuClick,
                }}
                trigger={["click"]}
              >
                <button
                  type="button"
                  className="p-1.5 rounded-full hover:bg-gray-100"
                >
                  <MoreOutlined className="text-base" />
                </button>
              </Dropdown>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <Table
      dataSource={categories}
      columns={columns}
      rowKey="id"
      pagination={false}
      expandable={{ defaultExpandAllRows: true }}
    />
  );
}
