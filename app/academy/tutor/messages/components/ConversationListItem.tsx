import type { ConversationListItem as ConversationType } from "@/apis/tutor/messages/types";

function formatRelativeDate(dateStr: string) {
  const diffDays = Math.floor(
    (Date.now() - new Date(dateStr).getTime()) / 86400000,
  );
  if (diffDays === 0)
    return new Date(dateStr).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  return new Date(dateStr).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

export function ConversationListItem({
  conversation,
  isActive,
  isOnline,
  onClick,
}: {
  conversation: ConversationType;
  isActive: boolean;
  isOnline: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors"
      style={{ background: isActive ? "#F5EEFE" : "transparent" }}
    >
      <div className="relative shrink-0">
        <img
          src={
            conversation.otherUser.avatar ||
            `https://api.dicebear.com/7.x/avataaars/svg?seed=${conversation.otherUser.firstName}`
          }
          alt=""
          className="w-10 h-10 rounded-full object-cover"
        />
        <span
          className="absolute bottom-0 right-0 rounded-full"
          style={{
            width: 9,
            height: 9,
            background: isOnline ? "#22C55E" : "#D1D5DB",
            border: "2px solid #FFFFFF",
          }}
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p
            className="text-[13px] font-semibold truncate"
            style={{ color: isActive ? "#3A0CA3" : "#0e1430" }}
          >
            {conversation.otherUser.firstName} {conversation.otherUser.lastName}
          </p>
          {conversation.lastMessage && (
            <span
              className="text-[10.5px] shrink-0"
              style={{ color: "#9CA3AF" }}
            >
              {formatRelativeDate(conversation.lastMessage.createdAt)}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between gap-2">
          <p
            className="text-[12px] truncate"
            style={{
              color: conversation.unreadCount > 0 ? "#374151" : "#9CA3AF",
              fontWeight: conversation.unreadCount > 0 ? 600 : 400,
            }}
          >
            {conversation.lastMessage?.content ?? "No messages yet"}
          </p>
          {conversation.unreadCount > 0 && (
            <span
              className="flex items-center justify-center rounded-full text-[10px] font-bold text-white shrink-0"
              style={{
                minWidth: 18,
                height: 18,
                padding: "0 4px",
                background: "#3A0CA3",
              }}
            >
              {conversation.unreadCount}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
