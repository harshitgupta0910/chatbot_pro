import React, { useEffect, useRef } from 'react';
import { Message } from '../../types';
import { Bot, User, AlertCircle, Zap } from 'lucide-react';

interface MessageListProps {
  messages: Message[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="relative mb-6">
            <Bot className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600" />
            <Zap className="w-6 h-6 absolute -top-1 -right-1 text-blue-500 animate-pulse" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Start a conversation with DeepSeek R1
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Ask me anything! I'm powered by DeepSeek's advanced reasoning model via OpenRouter.
          </p>
          <div className="text-xs text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
            <p className="mb-2 font-medium">💡 I excel at:</p>
            <div className="grid grid-cols-2 gap-1 text-left">
              <p>• Complex reasoning</p>
              <p>• Code analysis</p>
              <p>• Math problems</p>
              <p>• Creative writing</p>
              <p>• Research tasks</p>
              <p>• Problem solving</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex items-start space-x-3 ${
            message.isBot ? 'justify-start' : 'justify-end'
          }`}
        >
          {message.isBot && (
            <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-full flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
          )}
          
          <div
            className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-3 rounded-2xl ${
              message.isBot
                ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                : 'bg-gradient-to-r from-blue-500 to-emerald-500 text-white'
            }`}
          >
            {message.isTyping ? (
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-xs text-gray-500">DeepSeek is thinking...</span>
              </div>
            ) : (
              <>
                <div className="text-sm leading-relaxed whitespace-pre-wrap">
                  {message.content}
                </div>
                
                {/* Show error indicator for error messages */}
                {message.isBot && (message.content.includes('error') || message.content.includes('Error') || message.content.includes('apologize')) && (
                  <div className="flex items-center mt-2 text-xs text-orange-600 dark:text-orange-400">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    <span>Service issue detected</span>
                  </div>
                )}
                
                {/* Show model indicator for successful responses */}
                {message.isBot && !message.content.includes('error') && !message.content.includes('Error') && !message.content.includes('apologize') && (
                  <div className="flex items-center mt-2 text-xs text-blue-600 dark:text-blue-400">
                    <Zap className="w-3 h-3 mr-1" />
                    <span>DeepSeek R1</span>
                  </div>
                )}
              </>
            )}
            
            {!message.isTyping && (
              <p
                className={`text-xs mt-2 ${
                  message.isBot
                    ? 'text-gray-500 dark:text-gray-400'
                    : 'text-blue-100'
                }`}
              >
                {message.timestamp.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            )}
          </div>

          {!message.isBot && (
            <div className="flex-shrink-0 w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-gray-600 dark:text-gray-300" />
            </div>
          )}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;