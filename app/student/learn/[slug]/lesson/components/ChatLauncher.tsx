import { MessageCircle } from "lucide-react";

export function ChatLauncher({
  tutorAvatar,
  unreadCount,
  onOpen,
}: {
  tutorAvatar: string;
  unreadCount: number;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2 pl-1.5 pr-4 py-1.5 rounded-full shadow-lg transition-transform hover:scale-[1.04] active:scale-[0.97]"
      style={{ background: "#FFFFFF", border: "1.5px solid #EDE0FB" }}
    >
      <div className="relative shrink-0">
        <img
          src={tutorAvatar}
          alt=""
          className="w-9 h-9 rounded-full object-cover"
        />
        {unreadCount > 0 && (
          <span
            className="absolute -top-1 -right-1 flex items-center justify-center rounded-full text-[10px] font-bold text-white"
            style={{
              width: 17,
              height: 17,
              background: "#F52593",
              border: "2px solid #FFFFFF",
            }}
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </div>
      <div className="flex flex-col items-start leading-tight">
        <span
          className="text-[12.5px] font-semibold"
          style={{ color: "#0e1430" }}
        >
          Message tutor
        </span>
        <span className="text-[10.5px]" style={{ color: "#9CA3AF" }}>
          Usually replies within a few hours
        </span>
      </div>
      <MessageCircle size={15} style={{ color: "#3A0CA3" }} className="ml-1" />
    </button>
  );
}
