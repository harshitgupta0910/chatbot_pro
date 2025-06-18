import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, Sparkles } from 'lucide-react';
import { promptTemplates } from '../../data/promptTemplates';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, isLoading }) => {
  const [message, setMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [inputHistory, setInputHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    const savedHistory = localStorage.getItem('inputHistory');
    if (savedHistory) {
      setInputHistory(JSON.parse(savedHistory));
    }

    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setMessage(prev => prev + transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      const newHistory = [message, ...inputHistory.slice(0, 49)]; // Keep last 50
      setInputHistory(newHistory);
      localStorage.setItem('inputHistory', JSON.stringify(newHistory));
      
      onSendMessage(message.trim());
      setMessage('');
      setHistoryIndex(-1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    } else if (e.key === 'ArrowUp' && inputHistory.length > 0) {
      e.preventDefault();
      const newIndex = Math.min(historyIndex + 1, inputHistory.length - 1);
      setHistoryIndex(newIndex);
      setMessage(inputHistory[newIndex]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setMessage(inputHistory[newIndex]);
      } else {
        setHistoryIndex(-1);
        setMessage('');
      }
    }
  };

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const useTemplate = (template: string) => {
    setMessage(template);
    setShowTemplates(false);
    textareaRef.current?.focus();
  };

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [message]);

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
      {/* Template suggestions */}
      {showTemplates && (
        <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Prompt Templates
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {promptTemplates.map((template) => (
              <button
                key={template.id}
                onClick={() => useTemplate(template.content)}
                className="text-left p-2 text-sm bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                <div className="font-medium text-gray-900 dark:text-white">
                  {template.title}
                </div>
                <div className="text-gray-500 dark:text-gray-400">
                  {template.category}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex items-end space-x-2">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message... (Press ↑ for history)"
            className="w-full px-4 py-3 pr-12 border border-gray-200 dark:border-gray-600 rounded-xl text-blue-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none max-h-30"
            rows={1}
            disabled={isLoading}
          />
          
          {/* Voice input button */}
          {recognitionRef.current && (
            <button
              type="button"
              onClick={toggleVoiceInput}
              className={`absolute right-3 top-3 p-1 rounded-full transition-colors ${
                isListening
                  ? 'text-red-500 bg-red-50 dark:bg-red-900/20'
                  : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
              }`}
              title={isListening ? 'Stop listening' : 'Start voice input'}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={() => setShowTemplates(!showTemplates)}
          className="p-3 text-gray-400 hover:text-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-xl transition-colors"
          title="Show prompt templates"
        >
          <Sparkles className="w-5 h-5" />
        </button>

        <button
          type="submit"
          disabled={!message.trim() || isLoading}
          className="p-3 bg-gradient-to-r from-blue-500 to-emerald-500 text-white rounded-xl hover:from-blue-600 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>

      {isListening && (
        <div className="mt-2 flex items-center space-x-2 text-red-500">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-sm">Listening...</span>
        </div>
      )}
    </div>
  );
};

export default MessageInput;