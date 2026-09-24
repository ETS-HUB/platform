"use client";
import toast from "react-hot-toast";

import { useState } from "react";
import { Button } from "antd";
import { useAdminModal } from "@/hooks/useAdminModal";
import { Plus } from "lucide-react";
import { TracksTable } from "./components/TracksTable";
import { TrackFormModal } from "./components/TrackFormModal";
import type { Track, TrackPayload } from "@/apis/admin/tracks/types";
import {
  useGetAllTracksQuery,
  useCreateTrackMutation,
  useUpdateTrackMutation,
  useDeleteTrackMutation,
} from "@/apis/admin/tracks/tracksService";
import Header from "@/components/ui/Header";
import { getApiError } from "@/lib/apiError";

export default function AdminTracksPage() {
  const modal = useAdminModal();
  const [formOpen, setFormOpen] = useState(false);
  const [editingTrack, setEditingTrack] = useState<Track | null>(null);

  const { data: tracks = [] } = useGetAllTracksQuery();
  const [createTrack] = useCreateTrackMutation();
  const [updateTrack] = useUpdateTrackMutation();
  const [deleteTrack] = useDeleteTrackMutation();

  const handleSave = async (id: string | null, payload: TrackPayload) => {
    try {
      if (id) {
        await updateTrack({ id, payload }).unwrap();
        toast.success("Track updated");
      } else {
        await createTrack(payload).unwrap();
        toast.success("Track created");
      }
    } catch (err) {
      toast.error(getApiError(err, "Failed to save track"));
    }
  };

  // Toggle active state via PATCH { isActive }
  const handleToggleActive = (track: Track) => {
    const isDeactivating = track.isActive;
    modal.confirm({
      title: isDeactivating
        ? `Deactivate "${track.name}"?`
        : `Reactivate "${track.name}"?`,
      content: isDeactivating
        ? "Students won't see this track as an option until it's reactivated."
        : "This track will become visible to students again.",
      okText: isDeactivating ? "Deactivate" : "Reactivate",
      okButtonProps: { danger: isDeactivating },
      onOk: async () => {
        try {
          await updateTrack({
            id: track.id,
            payload: { isActive: !track.isActive },
          }).unwrap();
          toast.success(
            isDeactivating ? "Track deactivated" : "Track reactivated",
          );
        } catch (err) {
          toast.error(getApiError(err, "Failed to update track"));
        }
      },
    });
  };

  // Hard-delete via DELETE /api/tracks/:id
  const handleDelete = (track: Track) => {
    modal.confirm({
      title: `Permanently delete "${track.name}"?`,
      content:
        "This will remove the track and all associated data. Students currently on this track will lose their track assignment. This cannot be undone.",
      okText: "Delete",
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await deleteTrack(track.id).unwrap();
          toast.success("Track deleted");
        } catch (err) {
          toast.error(getApiError(err, "Failed to delete track"));
        }
      },
    });
  };

  return (
    <div className="min-h-screen w-full">
      <div className="flex items-start justify-between mb-6">
        <Header
          title="Tracks"
          subtitle="Career paths students can align their learning goal to."
        />
        <Button
          icon={<Plus size={14} />}
          onClick={() => {
            setEditingTrack(null);
            setFormOpen(true);
          }}
          style={{ background: "#3A0CA3", color: "#FFFFFF" }}
        >
          New track
        </Button>
      </div>
      <TracksTable
        tracks={tracks}
        onEdit={(t) => {
          setEditingTrack(t);
          setFormOpen(true);
        }}
        onToggleActive={handleToggleActive}
        onDelete={handleDelete}
      />
      <TrackFormModal
        track={editingTrack}
        existingSlugs={tracks.map((t) => t.slug)}
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}
