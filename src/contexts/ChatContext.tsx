import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Chat, Message, ChatState } from '../types';
import { chatService } from '../services/chatService';
import { nanoid } from 'nanoid';

interface ChatContextType extends ChatState {
  createChat: () => void;
  selectChat: (chatId: string) => void;
  sendMessage: (content: string) => Promise<void>;
  deleteChat: (chatId: string) => void;
  exportChat: (chatId: string) => void;
  clearHistory: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

type ChatAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_CHATS'; payload: Chat[] }
  | { type: 'ADD_CHAT'; payload: Chat }
  | { type: 'SELECT_CHAT'; payload: string }
  | { type: 'ADD_MESSAGE'; payload: { chatId: string; message: Message } }
  | { type: 'UPDATE_MESSAGE'; payload: { chatId: string; messageId: string; message: Partial<Message> } }
  | { type: 'DELETE_CHAT'; payload: string }
  | { type: 'CLEAR_HISTORY' };

const chatReducer = (state: ChatState, action: ChatAction): ChatState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_CHATS':
      return { ...state, chats: action.payload };
    case 'ADD_CHAT': {
      const newChats = [action.payload, ...state.chats];
      return { ...state, chats: newChats, activeChat: action.payload };
    }
    case 'SELECT_CHAT': {
      const chat = state.chats.find(c => c.id === action.payload);
      return { ...state, activeChat: chat || null };
    }
    case 'ADD_MESSAGE': {
      const updatedChats = state.chats.map(chat => {
        if (chat.id === action.payload.chatId) {
          return {
            ...chat,
            messages: [...chat.messages, action.payload.message],
            updatedAt: new Date(),
          };
        }
        return chat;
      });
      const activeChat = state.activeChat?.id === action.payload.chatId
        ? { ...state.activeChat, messages: [...state.activeChat.messages, action.payload.message] }
        : state.activeChat;
      return { ...state, chats: updatedChats, activeChat };
    }
    case 'UPDATE_MESSAGE': {
      const updatedChats = state.chats.map(chat => {
        if (chat.id === action.payload.chatId) {
          return {
            ...chat,
            messages: chat.messages.map(msg => 
              msg.id === action.payload.messageId 
                ? { ...msg, ...action.payload.message }
                : msg
            ),
          };
        }
        return chat;
      });
      const activeChat = state.activeChat?.id === action.payload.chatId
        ? {
            ...state.activeChat,
            messages: state.activeChat.messages.map(msg => 
              msg.id === action.payload.messageId 
                ? { ...msg, ...action.payload.message }
                : msg
            ),
          }
        : state.activeChat;
      return { ...state, chats: updatedChats, activeChat };
    }
    case 'DELETE_CHAT': {
      const filteredChats = state.chats.filter(chat => chat.id !== action.payload);
      const activeChat = state.activeChat?.id === action.payload ? null : state.activeChat;
      
      // Clear conversation history for deleted chat
      chatService.clearConversationHistory(action.payload);
      
      return { ...state, chats: filteredChats, activeChat };
    }
    case 'CLEAR_HISTORY':
      chatService.clearAllConversations();
      return { ...state, chats: [], activeChat: null };
    default:
      return state;
  }
};

const initialState: ChatState = {
  chats: [],
  activeChat: null,
  isLoading: false,
};

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  React.useEffect(() => {
    const savedChats = localStorage.getItem('chats');
    if (savedChats) {
      const chats = JSON.parse(savedChats).map((chat: any) => ({
        ...chat,
        createdAt: new Date(chat.createdAt),
        updatedAt: new Date(chat.updatedAt),
        messages: chat.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        })),
      }));
      dispatch({ type: 'SET_CHATS', payload: chats });
    }
  }, []);

  React.useEffect(() => {
    if (state.chats.length > 0) {
      localStorage.setItem('chats', JSON.stringify(state.chats));
    }
  }, [state.chats]);

  const createChat = () => {
    const newChat: Chat = {
      id: nanoid(),
      title: 'New Chat',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    dispatch({ type: 'ADD_CHAT', payload: newChat });
  };

  const selectChat = (chatId: string) => {
    dispatch({ type: 'SELECT_CHAT', payload: chatId });
  };

  const sendMessage = async (content: string) => {
    if (!state.activeChat) return;

    const userMessage: Message = {
      id: nanoid(),
      content,
      isBot: false,
      timestamp: new Date(),
    };

    dispatch({ type: 'ADD_MESSAGE', payload: { chatId: state.activeChat.id, message: userMessage } });
    dispatch({ type: 'SET_LOADING', payload: true });

    // Update chat title based on first message
    if (state.activeChat.messages.length === 0) {
      const updatedChats = state.chats.map(chat => 
        chat.id === state.activeChat?.id 
          ? { ...chat, title: content.slice(0, 30) + (content.length > 30 ? '...' : '') }
          : chat
      );
      dispatch({ type: 'SET_CHATS', payload: updatedChats });
    }

    // Add typing indicator
    const typingMessage: Message = {
      id: nanoid(),
      content: '',
      isBot: true,
      timestamp: new Date(),
      isTyping: true,
    };

    dispatch({ type: 'ADD_MESSAGE', payload: { chatId: state.activeChat.id, message: typingMessage } });

    try {
      // Use the chat ID for conversation context
      const response = await chatService.sendMessage(content, state.activeChat.id);
      
      // Update typing message with actual response
      dispatch({ 
        type: 'UPDATE_MESSAGE', 
        payload: { 
          chatId: state.activeChat.id, 
          messageId: typingMessage.id, 
          message: { content: response, isTyping: false } 
        } 
      });
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Update typing message with error response
      dispatch({ 
        type: 'UPDATE_MESSAGE', 
        payload: { 
          chatId: state.activeChat.id, 
          messageId: typingMessage.id, 
          message: { 
            content: error instanceof Error ? error.message : 'Sorry, I encountered an error. Please try again.',
            isTyping: false 
          } 
        } 
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const deleteChat = (chatId: string) => {
    dispatch({ type: 'DELETE_CHAT', payload: chatId });
  };

  const exportChat = (chatId: string) => {
    const chat = state.chats.find(c => c.id === chatId);
    if (!chat) return;

    const exportData = {
      title: chat.title,
      createdAt: chat.createdAt,
      messages: chat.messages.map(msg => ({
        content: msg.content,
        isBot: msg.isBot,
        timestamp: msg.timestamp,
      })),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-${chat.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearHistory = () => {
    localStorage.removeItem('chats');
    dispatch({ type: 'CLEAR_HISTORY' });
  };

  return (
    <ChatContext.Provider value={{
      ...state,
      createChat,
      selectChat,
      sendMessage,
      deleteChat,
      exportChat,
      clearHistory,
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};