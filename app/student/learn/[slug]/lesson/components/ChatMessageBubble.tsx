export interface NavLessonItem {
  id: string;
  order: number;
  title: string;
  status: "completed" | "current" | "locked";
}

export interface ChatMessage {
  id: string;
  senderName: string;
  senderAvatar: string;
  isOwn: boolean;
  mentionedUser?: string;
  text: string;
  timestamp: string;
}

export function ChatMessageBubble({ message }: { message: ChatMessage }) {
  return (
    <div
      className={`flex items-end gap-2 ${message.isOwn ? "flex-row-reverse" : ""}`}
    >
      <img
        src={message.senderAvatar}
        alt={message.senderName}
        className="w-7 h-7 rounded-full object-cover shrink-0"
      />
      <div
        className={`flex flex-col gap-1 max-w-[78%] ${message.isOwn ? "items-end" : "items-start"}`}
      >
        <div
          className="text-[13px] leading-relaxed px-3.5 py-2.5 rounded-2xl"
          style={{
            background: message.isOwn ? "#DCEBFF" : "#F3F4F6",
            color: "#1A1A1A",
            borderBottomRightRadius: message.isOwn ? 4 : 16,
            borderBottomLeftRadius: message.isOwn ? 16 : 4,
          }}
        >
          {message.mentionedUser && (
            <span
              className="inline-block text-[12px] font-semibold px-1.5 py-0.5 rounded-md mr-1"
              style={{ background: "#3A0CA3", color: "#FFFFFF" }}
            >
              @{message.mentionedUser}
            </span>
          )}
          {message.text}
        </div>
        <span className="text-[10.5px] px-1" style={{ color: "#9CA3AF" }}>
          {message.timestamp}
        </span>
      </div>
    </div>
  );
}
