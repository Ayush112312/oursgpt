
import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { AppRoute, ChatThread } from '../types';
import { Menu, X, Sun, Moon } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentRoute: AppRoute;
  setCurrentRoute: (route: AppRoute) => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
  threads: ChatThread[];
  activeThreadId: string | null;
  setActiveThreadId: (id: string | null) => void;
  onNewChat: () => void;
  onDeleteThread: (id: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  currentRoute,
  setCurrentRoute,
  isDarkMode,
  toggleTheme,
  threads,
  activeThreadId,
  setActiveThreadId,
  onNewChat,
  onDeleteThread
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-white dark:bg-zinc-950 transition-colors duration-200">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 lg:hidden backdrop-blur-sm" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <Sidebar 
          currentRoute={currentRoute}
          setCurrentRoute={(r) => { setCurrentRoute(r); setIsSidebarOpen(false); }}
          threads={threads}
          activeThreadId={activeThreadId}
          setActiveThreadId={(id) => { setActiveThreadId(id); setIsSidebarOpen(false); setCurrentRoute(AppRoute.CHAT); }}
          onNewChat={onNewChat}
          onDeleteThread={onDeleteThread}
        />
      </aside>

      {/* Main Content */}
      <div className="flex flex-col flex-1 min-w-0 relative">
        {/* Header */}
        <header className="flex items-center justify-between h-14 px-4 border-b border-gray-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 -ml-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 lg:hidden text-gray-600 dark:text-zinc-400"
            >
              <Menu size={20} />
            </button>
            <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
              OursGPT
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-600 dark:text-zinc-400 transition-colors"
              aria-label="Toggle Theme"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </header>

        {/* View Content */}
        <main className="flex-1 overflow-hidden bg-white dark:bg-zinc-900">
          {children}
        </main>
      </div>
    </div>
  );
};
