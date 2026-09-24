"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { io, type Socket } from "socket.io-client";
import type {
  ChatMessage,
  ParsedMessageContent,
} from "@/apis/tutor/messages/types";

function parseMsgContent(
  raw: Omit<ChatMessage, "parsed"> & { parsed?: ParsedMessageContent | null },
): ChatMessage {
  if (raw.parsed !== undefined) return raw as ChatMessage;
  let parsed: ParsedMessageContent | null = null;
  try {
    const p = JSON.parse(raw.content);
    if (p?.type === "image" || p?.type === "document") parsed = p;
  } catch {}
  return { ...raw, parsed };
}

export function useTutorChat({ token }: { token: string }) {
  const socketRef = useRef<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [onlineUserIds, setOnlineUserIds] = useState<Set<string>>(new Set());
  const [typingUserIds, setTypingUserIds] = useState<Set<string>>(new Set());
  const [incomingMessages, setIncomingMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    const socket = io("http://localhost:3000/chat", {
      auth: { token: `Bearer ${token}` },
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      setConnected(true);
      socket.emit("getOnlineUsers");
    });
    socket.on("disconnect", () => setConnected(false));

    socket.on(
      "newMessage",
      (
        msg: Omit<ChatMessage, "parsed"> & {
          parsed?: ParsedMessageContent | null;
        },
      ) => {
        setIncomingMessages((prev) => [...prev, parseMsgContent(msg)]);
      },
    );
    socket.on(
      "messageSent",
      (
        msg: Omit<ChatMessage, "parsed"> & {
          parsed?: ParsedMessageContent | null;
        },
      ) => {
        setIncomingMessages((prev) => [...prev, parseMsgContent(msg)]);
      },
    );

    socket.on("userOnline", ({ userId }: { userId: string }) => {
      setOnlineUserIds((prev) => new Set(prev).add(userId));
    });
    socket.on("userOffline", ({ userId }: { userId: string }) => {
      setOnlineUserIds((prev) => {
        const next = new Set(prev);
        next.delete(userId);
        return next;
      });
    });

    socket.on("userTyping", ({ userId }: { userId: string }) => {
      setTypingUserIds((prev) => new Set(prev).add(userId));
    });
    socket.on("userStopTyping", ({ userId }: { userId: string }) => {
      setTypingUserIds((prev) => {
        const next = new Set(prev);
        next.delete(userId);
        return next;
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [token]);

  const sendMessage = useCallback((recipientId: string, content: string) => {
    socketRef.current?.emit("sendMessage", { recipientId, content });
  }, []);

  const emitTyping = useCallback((recipientId: string) => {
    socketRef.current?.emit("typing", { recipientId });
  }, []);

  const emitStopTyping = useCallback((recipientId: string) => {
    socketRef.current?.emit("stopTyping", { recipientId });
  }, []);

  const markRead = useCallback((conversationId: string) => {
    socketRef.current?.emit("markRead", { conversationId });
  }, []);

  return {
    connected,
    onlineUserIds,
    typingUserIds,
    incomingMessages,
    sendMessage,
    emitTyping,
    emitStopTyping,
    markRead,
  };
}
