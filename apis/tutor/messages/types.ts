// Inferred shapes — no exact JSON sample given for conversation/message objects.
// Field names are best-guess based on the earlier ChatWidget build and standard
// conventions; confirm against real payloads before treating as final.

export interface ChatUser {
  id: string;
  firstName: string;
  lastName: string;
  avatar: string | null;
}

export interface ConversationListItem {
  id: string; // conversationId
  otherUser: ChatUser;
  lastMessage: { content: string; createdAt: string; senderId: string } | null;
  unreadCount: number;
}

export interface ParsedMessageContent {
  type: "image" | "document";
  url: string;
  fileName: string;
  fileSize?: number;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  recipientId: string;
  content: string;
  parsed: ParsedMessageContent | null;
  createdAt: string;
  isRead: boolean;
}
