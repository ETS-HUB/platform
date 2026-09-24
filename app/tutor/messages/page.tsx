"use client";

import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Skeleton } from "antd";
import { ConversationsList } from "./components/ConversationsList";
import { MessageThread } from "./components/MessageThread";
import { useTutorChat } from "@/hooks/useTutorChat";
import {
  useGetConversationsQuery,
  useGetMessagesQuery,
  useMarkReadMutation,
} from "@/apis/chat/chatService";
import { uploadFile } from "@/apis/upload/uploadService";
import type {
  ConversationListItem,
  ChatMessage,
  ParsedMessageContent,
} from "@/apis/tutor/messages/types";
import type { RootState } from "@/store";

export default function TutorMessagesPage() {
  const { accessToken } = useSelector((s: RootState) => s.tokens);
  const currentUserId = useSelector((s: RootState) => s.auth.user?.id ?? "");

  // ── Socket ────────────────────────────────────────────────────────────────
  const {
    connected,
    onlineUserIds,
    typingUserIds,
    incomingMessages,
    sendMessage,
    emitTyping,
    emitStopTyping,
    markRead: socketMarkRead,
  } = useTutorChat({ token: accessToken ?? "" });

  // ── REST: conversations list ──────────────────────────────────────────────
  const { data: rawConversations = [], isLoading: loadingConvs } =
    useGetConversationsQuery();

  // Map API Conversation → local ConversationListItem shape
  const conversations: ConversationListItem[] = useMemo(
    () =>
      rawConversations.map((c) => ({
        id: c.conversationId,
        otherUser: {
          id: c.otherUser.id,
          firstName: c.otherUser.firstName,
          lastName: c.otherUser.lastName,
          avatar: c.otherUser.avatar,
        },
        lastMessage: c.lastMessage
          ? {
              content: c.lastMessage.content,
              createdAt: c.lastMessage.createdAt,
              senderId: c.lastMessage.isFromMe ? currentUserId : c.otherUser.id,
            }
          : null,
        unreadCount: c.unreadCount,
      })),
    [rawConversations, currentUserId],
  );

  const [activeConversationId, setActiveConversationId] = useState<
    string | null
  >(null);

  // Auto-select first conversation once loaded
  useEffect(() => {
    if (!activeConversationId && conversations.length > 0) {
      setActiveConversationId(conversations[0].id);
    }
  }, [conversations, activeConversationId]);

  // ── REST: message history for active conversation ─────────────────────────
  const { data: messagesData, isLoading: loadingMessages } =
    useGetMessagesQuery(
      { conversationId: activeConversationId! },
      { skip: !activeConversationId },
    );

  const activeConversation =
    conversations.find((c) => c.id === activeConversationId) ?? null;

  // Map API ChatMessage → local ChatMessage shape, then merge with socket messages
  const baseMessages: ChatMessage[] = useMemo(() => {
    if (!messagesData?.messages) return [];
    return messagesData.messages.map((m) => {
      let parsed: ParsedMessageContent | null = null;
      try {
        const p = JSON.parse(m.content);
        if (p?.type === "image" || p?.type === "document") parsed = p;
      } catch {}
      return {
        id: m.id,
        conversationId: activeConversationId!,
        senderId: m.isFromMe
          ? currentUserId
          : (activeConversation?.otherUser.id ?? ""),
        recipientId: m.isFromMe
          ? (activeConversation?.otherUser.id ?? "")
          : currentUserId,
        content: m.content,
        parsed,
        createdAt: m.createdAt,
        isRead: true,
      };
    });
  }, [messagesData, activeConversationId, currentUserId, activeConversation]);

  // Socket messages routed into the active conversation
  const [socketMessagesByConv, setSocketMessagesByConv] = useState<
    Record<string, ChatMessage[]>
  >({});

  useEffect(() => {
    incomingMessages.forEach((msg) => {
      setSocketMessagesByConv((prev) => ({
        ...prev,
        [msg.conversationId]: [...(prev[msg.conversationId] ?? []), msg],
      }));
    });
  }, [incomingMessages]);

  const activeMessages: ChatMessage[] = useMemo(() => {
    if (!activeConversationId) return [];
    const socketMsgs = socketMessagesByConv[activeConversationId] ?? [];
    // Deduplicate by id — REST history may overlap with socket confirmations
    const seen = new Set<string>();
    return [...baseMessages, ...socketMsgs].filter((m) => {
      if (seen.has(m.id)) return false;
      seen.add(m.id);
      return true;
    });
  }, [baseMessages, socketMessagesByConv, activeConversationId]);

  // ── Mark read ─────────────────────────────────────────────────────────────
  const [markReadRest] = useMarkReadMutation();

  useEffect(() => {
    if (!activeConversationId) return;
    socketMarkRead(activeConversationId);
    markReadRest(activeConversationId);
  }, [activeConversationId, socketMarkRead, markReadRest]);

  // ── Send ──────────────────────────────────────────────────────────────────
  const handleSend = (content: string) => {
    if (!activeConversation) return;
    sendMessage(activeConversation.otherUser.id, content);
  };

  const handleSendFile = async (file: File) => {
    if (!activeConversation || !accessToken) return;
    const folder = file.type.startsWith("image/")
      ? "submissions"
      : "submissions";
    const { url } = await uploadFile(file, accessToken, folder);
    const content = JSON.stringify({
      type: file.type.startsWith("image/") ? "image" : "document",
      url,
      fileName: file.name,
      fileSize: file.size,
    });
    sendMessage(activeConversation.otherUser.id, content);
  };

  return (
    <div className="h-screen w-full grid grid-cols-[300px_1fr]">
      {loadingConvs ? (
        <div className="p-4">
          <Skeleton active paragraph={{ rows: 6 }} />
        </div>
      ) : (
        <ConversationsList
          conversations={conversations}
          activeConversationId={activeConversationId}
          onlineUserIds={onlineUserIds}
          onSelect={setActiveConversationId}
        />
      )}

      {activeConversation ? (
        loadingMessages ? (
          <div className="p-6">
            <Skeleton active paragraph={{ rows: 8 }} />
          </div>
        ) : (
          <MessageThread
            otherUser={activeConversation.otherUser}
            isOnline={onlineUserIds.has(activeConversation.otherUser.id)}
            isTyping={typingUserIds.has(activeConversation.otherUser.id)}
            messages={activeMessages}
            currentUserId={currentUserId}
            onSend={handleSend}
            onSendFile={handleSendFile}
            onTypingChange={(typing) =>
              typing
                ? emitTyping(activeConversation.otherUser.id)
                : emitStopTyping(activeConversation.otherUser.id)
            }
          />
        )
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-[13px]" style={{ color: "#9CA3AF" }}>
            {loadingConvs ? "" : "Select a conversation"}
          </p>
        </div>
      )}

      {!connected && accessToken && (
        <div
          className="fixed bottom-4 left-4 text-[11px] px-3 py-1.5 rounded-full"
          style={{ background: "#FEF2F2", color: "#DC2626" }}
        >
          Reconnecting...
        </div>
      )}
    </div>
  );
}
