"use client";

import { useState } from "react";
import { Input, Empty } from "antd";
import { Search } from "lucide-react";
import { ConversationListItem } from "./ConversationListItem";
import type { ConversationListItem as ConversationType } from "@/apis/tutor/messages/types";

export function ConversationsList({
  conversations,
  activeConversationId,
  onlineUserIds,
  onSelect,
}: {
  conversations: ConversationType[];
  activeConversationId: string | null;
  onlineUserIds: Set<string>;
  onSelect: (conversationId: string) => void;
}) {
  const [search, setSearch] = useState("");

  const filtered = conversations.filter((c) =>
    `${c.otherUser.firstName} ${c.otherUser.lastName}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  return (
    <div
      className="flex flex-col h-full"
      style={{ borderRight: "1px solid #EDEDED" }}
    >
      <div
        className="px-4 py-3.5"
        style={{ borderBottom: "1px solid #EDEDED" }}
      >
        <Input
          prefix={<Search size={14} className="text-gray-400" />}
          placeholder="Search students"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          allowClear
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="py-10">
            <Empty description="No conversations" />
          </div>
        ) : (
          filtered.map((c) => (
            <ConversationListItem
              key={c.id}
              conversation={c}
              isActive={c.id === activeConversationId}
              isOnline={onlineUserIds.has(c.otherUser.id)}
              onClick={() => onSelect(c.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
