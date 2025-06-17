import React from 'react';
import { useChat } from '../../contexts/ChatContext';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

const ChatInterface: React.FC = () => {
  const { activeChat, sendMessage, isLoading } = useChat();

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900">
      <MessageList messages={activeChat?.messages || []} />
      <MessageInput onSendMessage={sendMessage} isLoading={isLoading} />
    </div>
  );
};

export default ChatInterface;