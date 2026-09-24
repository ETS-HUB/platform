import { Drawer, Tag } from "antd";
import { X, Trophy, ClipboardCheck, Dumbbell } from "lucide-react";
import { RoleTag } from "./RoleTag";
import { StatusTag } from "./StatusTag";
import type { AdminUserDetail } from "@/apis/admin/users/types";

export function UserDetailDrawer({
  user,
  open,
  onClose,
}: {
  user: AdminUserDetail | null;
  open: boolean;
  onClose: () => void;
}) {
  if (!user) return null;

  return (
    <Drawer
      open={open}
      onClose={onClose}
      width={420}
      closable={false}
      styles={{ body: { padding: 0 } }}
    >
      <div
        className="flex items-center justify-between px-5 py-4"
        style={{ borderBottom: "1px solid #EDEDED" }}
      >
        <div className="flex items-center gap-2">
          <RoleTag role={user.role} />
          <StatusTag isActive={user.isActive} />
        </div>
        <button type="button" onClick={onClose}>
          <X size={18} style={{ color: "#8A8A8A" }} />
        </button>
      </div>

      <div className="px-5 py-5">
        <h2 className="text-[18px] font-bold" style={{ color: "#0e1430" }}>
          {user.firstName} {user.lastName}
        </h2>
        <p className="text-[12.5px]" style={{ color: "#8B84A0" }}>
          {user.email}
        </p>
        <p className="text-[11px] mt-1" style={{ color: "#9CA3AF" }}>
          Joined{" "}
          {new Date(user.createdAt).toLocaleDateString(undefined, {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </p>

        {!user.profile ? (
          <p className="text-[12.5px] mt-6" style={{ color: "#9CA3AF" }}>
            No student profile — this account has no learning activity.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3 mt-5">
              <div
                className="rounded-xl p-3.5"
                style={{ background: "#F5EEFE" }}
              >
                <p
                  className="text-[18px] font-bold"
                  style={{ color: "#3A0CA3" }}
                >
                  {user.profile.xp} XP
                </p>
                <p className="text-[11px]" style={{ color: "#8B84A0" }}>
                  Level {user.profile.level}
                </p>
              </div>
              <div
                className="rounded-xl p-3.5"
                style={{ background: "#FAFAFA" }}
              >
                <p
                  className="text-[12.5px] font-semibold truncate"
                  style={{ color: "#374151" }}
                >
                  {user.profile.experienceLevel.charAt(0) +
                    user.profile.experienceLevel.slice(1).toLowerCase()}
                </p>
                <p className="text-[11px]" style={{ color: "#9CA3AF" }}>
                  {user.profile.goal}
                </p>
              </div>
            </div>

            {user.profile.badges.length > 0 && (
              <div className="mt-5">
                <h3
                  className="text-[11px] font-bold uppercase tracking-wide mb-2 flex items-center gap-1.5"
                  style={{ color: "#8A8A8A" }}
                >
                  <Trophy size={11} /> Badges
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {user.profile.badges.map((b) => (
                    <Tag
                      key={b.id}
                      bordered={false}
                      style={{ background: "#FFFBEB", color: "#92400E" }}
                    >
                      {b.name}
                    </Tag>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-5">
              <h3
                className="text-[11px] font-bold uppercase tracking-wide mb-2 flex items-center gap-1.5"
                style={{ color: "#8A8A8A" }}
              >
                <ClipboardCheck size={11} /> Assessment attempts
              </h3>
              {user.assessmentAttempts.length === 0 ? (
                <p className="text-[12px]" style={{ color: "#9CA3AF" }}>
                  No attempts yet.
                </p>
              ) : (
                <div className="flex flex-col gap-1.5">
                  {user.assessmentAttempts.map((a) => {
                    const color =
                      a.score >= 70
                        ? "#059669"
                        : a.score >= 40
                          ? "#D97706"
                          : "#DC2626";
                    return (
                      <div
                        key={a.id}
                        className="flex items-center justify-between text-[12.5px] py-1.5"
                      >
                        <span style={{ color: "#374151" }}>
                          {a.config.name}
                        </span>
                        <span className="font-bold" style={{ color }}>
                          {a.score}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="mt-5">
              <h3
                className="text-[11px] font-bold uppercase tracking-wide mb-2 flex items-center gap-1.5"
                style={{ color: "#8A8A8A" }}
              >
                <Dumbbell size={11} /> Practice sessions
              </h3>
              {user.practiceSessions.length === 0 ? (
                <p className="text-[12px]" style={{ color: "#9CA3AF" }}>
                  No sessions yet.
                </p>
              ) : (
                <div className="flex flex-col gap-1.5">
                  {user.practiceSessions.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between text-[12.5px] py-1.5"
                    >
                      <span style={{ color: "#374151" }}>
                        {new Date(p.completedAt).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                      <span
                        className="font-medium"
                        style={{ color: "#6B7280" }}
                      >
                        {p.score}/{p.totalQuestions}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </Drawer>
  );
}
