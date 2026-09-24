"use client";
import toast from "react-hot-toast";

import { useState } from "react";
import { Select, Button, Modal, message } from "antd";
import { useAdminModal } from "@/hooks/useAdminModal";

import { UserPlus, X } from "lucide-react";
import {
  useGetTopicTutorsQuery,
  useAssignTutorMutation,
  useRemoveTutorMutation,
} from "@/apis/admin/lessons/lessonsService";

// Available tutors come from admin users (role=TUTOR). Using inline type here
// since this is the only consumer — no need for a separate type file.
interface TutorOption {
  id: string;
  name: string;
}

export function TutorAssignmentPanel({
  topicId,
  availableTutors = [],
}: {
  topicId: string;
  availableTutors?: TutorOption[];
}) {
  const modal = useAdminModal();
  const { data: assigned = [], isLoading } = useGetTopicTutorsQuery(topicId, {
    skip: !topicId,
  });
  const [assignTutor] = useAssignTutorMutation();
  const [removeTutor] = useRemoveTutorMutation();

  const [selectedTutorId, setSelectedTutorId] = useState<string | undefined>();
  const [assigning, setAssigning] = useState(false);

  const availableToAdd = availableTutors.filter(
    (t) => !assigned.some((a) => a.id === t.id),
  );

  const handleAssign = async () => {
    if (!selectedTutorId) return;
    setAssigning(true);
    try {
      await assignTutor({ tutorId: selectedTutorId, topicId }).unwrap();
      setSelectedTutorId(undefined);
      toast.success("Tutor assigned");
    } catch {
      toast.error("Failed to assign tutor");
    } finally {
      setAssigning(false);
    }
  };

  const handleRemove = (tutor: (typeof assigned)[number]) => {
    modal.confirm({
      title: `Remove ${tutor.firstName} ${tutor.lastName} from this course?`,
      content: "They'll lose access to student conversations for this course.",
      okText: "Remove",
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await removeTutor({ tutorId: tutor.id, topicId }).unwrap();
          toast.success("Tutor removed");
        } catch {
          toast.error("Failed to remove tutor");
        }
      },
    });
  };

  return (
    <div
      className="rounded-2xl p-6"
      style={{ background: "#FFFFFF", border: "1.5px solid #EDE0FB" }}
    >
      <h3
        className="text-[13px] font-bold uppercase tracking-wide mb-4"
        style={{ color: "#8A8A8A" }}
      >
        Assigned tutors
      </h3>

      {isLoading ? (
        <p className="text-[12.5px] mb-4" style={{ color: "#9CA3AF" }}>
          Loading...
        </p>
      ) : assigned.length === 0 ? (
        <p className="text-[12.5px] mb-4" style={{ color: "#9CA3AF" }}>
          No tutors assigned yet.
        </p>
      ) : (
        <div className="flex flex-col gap-2 mb-4">
          {assigned.map((tutor) => (
            <div
              key={tutor.id}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl"
              style={{ background: "#FAFAFA" }}
            >
              <img
                src={
                  tutor.avatar ||
                  `https://api.dicebear.com/7.x/avataaars/svg?seed=${tutor.firstName}`
                }
                alt=""
                className="w-8 h-8 rounded-full object-cover"
              />
              <span
                className="text-[13px] font-medium flex-1"
                style={{ color: "#374151" }}
              >
                {tutor.firstName} {tutor.lastName}
              </span>
              <button type="button" onClick={() => handleRemove(tutor)}>
                <X size={14} style={{ color: "#9CA3AF" }} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2">
        <Select
          placeholder="Select a tutor to assign"
          style={{ flex: 1 }}
          value={selectedTutorId}
          onChange={setSelectedTutorId}
          options={availableToAdd.map((t) => ({ label: t.name, value: t.id }))}
          notFoundContent={
            availableToAdd.length === 0
              ? "All tutors already assigned"
              : undefined
          }
        />
        <Button
          icon={<UserPlus size={13} />}
          disabled={!selectedTutorId}
          loading={assigning}
          onClick={handleAssign}
          style={{ background: "#3A0CA3", color: "#FFFFFF" }}
        >
          Assign
        </Button>
      </div>
    </div>
  );
}
