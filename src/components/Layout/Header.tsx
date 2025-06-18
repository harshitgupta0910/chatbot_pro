import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Moon, Sun, LogOut, MessageSquare } from 'lucide-react';

interface HeaderProps {
  onToggleSidebar?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="relative h-16 border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
  <div className="h-full flex items-center justify-between px-4 relative">
    {/* Left - Logo and Toggle */}
    <div className="flex items-center space-x-4">
      <button
        onClick={onToggleSidebar}
        className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        <MessageSquare className="w-5 h-5" />
      </button>

      <div className="flex items-center space-x-2">
  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-lg flex items-center justify-center">
          <MessageSquare className="w-4 h-4 text-white" />
        </div>
  <span className="text-xl font-extrabold bg-gradient-to-r from-blue-500 via-emerald-500 to-blue-500 bg-clip-text text-transparent animate-text">
    Harshit's bot
  </span>
</div>
    </div>

    {/* Center - Placeholder for name */}
    
    {/* Center - Name */}
   {/* <div className="absolute left-1/2 transform -translate-x-1/2">
  <span className="text-xl font-extrabold bg-gradient-to-r from-indigo-500 via-pink-500 to-orange-500 bg-clip-text text-transparent animate-text">
   Harshit's bot
  </span>
</div> */}


    {/* Right - Theme toggle and user */}
    <div className="flex items-center space-x-2">
      <button
        onClick={toggleTheme}
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>

      <div className="flex items-center space-x-3">
        <div className="hidden sm:block text-right">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {user?.name}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {user?.email}
          </p>
        </div>
        <button
          onClick={logout}
          className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors"
          title="Logout"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </div>
  </div>
</header>

  );
};

export default Header;