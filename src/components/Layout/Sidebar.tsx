import React, { useState } from 'react';
import { useChat } from '../../contexts/ChatContext';
import { Plus, MessageSquare, Trash2, Download, Search, Settings } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { chats, activeChat, createChat, selectChat, deleteChat, exportChat, clearHistory } = useChat();
  const [searchTerm, setSearchTerm] = useState('');
  const [showSettings, setShowSettings] = useState(false);

  const filteredChats = chats.filter(chat =>
    chat.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chat.messages.some(msg => msg.content.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleCreateChat = () => {
    createChat();
    onClose();
  };

  const handleSelectChat = (chatId: string) => {
    selectChat(chatId);
    onClose();
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed lg:static inset-y-0 left-0 z-50 w-80 bg-white dark:bg-gray-900 
          border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={handleCreateChat}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-emerald-500 text-white rounded-lg hover:from-blue-600 hover:to-emerald-600 transition-all duration-200 transform hover:scale-105"
            >
              <Plus className="w-4 h-4" />
              <span>New Chat</span>
            </button>
          </div>

          {/* Search */}
          <div className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search chats..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto px-4">
            {filteredChats.length === 0 ? (
              <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>{searchTerm ? 'No chats found' : 'No chats yet'}</p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredChats.map((chat) => (
                  <div key={chat.id} className="group relative">
                    <button
                      onClick={() => handleSelectChat(chat.id)}
                      className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                        activeChat?.id === chat.id
                          ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700'
                          : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 dark:text-white truncate">
                            {chat.title}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                            {chat.messages.length > 0 
                              ? chat.messages[chat.messages.length - 1].content
                              : 'Empty chat'
                            }
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                            {chat.updatedAt.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </button>
                    
                    {/* Chat actions */}
                    <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          exportChat(chat.id);
                        }}
                        className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
                        title="Export chat"
                      >
                        <Download className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm('Delete this chat?')) {
                            deleteChat(chat.id);
                          }
                        }}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                        title="Delete chat"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Settings */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="w-full flex items-center space-x-2 px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>
            
            {showSettings && (
              <div className="mt-2 space-y-2">
                <button
                  onClick={() => {
                    if (window.confirm('Clear all chat history?')) {
                      clearHistory();
                      setShowSettings(false);
                    }
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  Clear All Chats
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;