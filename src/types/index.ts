export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Message {
  id: string;
  content: string;
  isBot: boolean;
  timestamp: Date;
  isTyping?: boolean;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface ChatState {
  chats: Chat[];
  activeChat: Chat | null;
  isLoading: boolean;
}

export interface PromptTemplate {
  id: string;
  title: string;
  content: string;
  category: string;
}