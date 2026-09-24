export interface ChatUser {
  id: string;
  firstName: string;
  lastName: string;
  avatar: string | null;
  role: string;
}

export interface ChatLastMessage {
  content: string;
  createdAt: string;
  isFromMe: boolean;
}

export interface Conversation {
  conversationId: string;
  otherUser: ChatUser;
  lastMessage: ChatLastMessage | null;
  unreadCount: number;
}

export interface ChatMessage {
  id: string;
  content: string;
  senderId: string;
  createdAt: string;
  isFromMe: boolean;
}

export interface MessagesResponse {
  messages: ChatMessage[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface UnreadCountResponse {
  unreadCount: number;
}

export interface SendMessagePayload {
  recipientId: string;
  content: string;
}
