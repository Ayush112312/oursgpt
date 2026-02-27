
import React from 'react';
import { AppRoute, ChatThread } from '../types';
import { 
  MessageSquarePlus, 
  Image as ImageIcon, 
  Settings, 
  Info, 
  ShieldCheck, 
  Trash2,
  Clock
} from 'lucide-react';

interface SidebarProps {
  currentRoute: AppRoute;
  setCurrentRoute: (route: AppRoute) => void;
  threads: ChatThread[];
  activeThreadId: string | null;
  setActiveThreadId: (id: string | null) => void;
  onNewChat: () => void;
  onDeleteThread: (id: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentRoute,
  setCurrentRoute,
  threads,
  activeThreadId,
  setActiveThreadId,
  onNewChat,
  onDeleteThread
}) => {
  return (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-950 border-r border-gray-200 dark:border-zinc-800 p-3">
      {/* New Chat Button */}
      <button
        onClick={onNewChat}
        className="flex items-center gap-3 w-full px-4 py-3 mb-4 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
      >
        <MessageSquarePlus size={18} />
        New Chat
      </button>

      {/* Main Navigation */}
      <nav className="space-y-1 mb-6">
        <button
          onClick={() => setCurrentRoute(AppRoute.IMAGE_GEN)}
          className={`flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium rounded-xl transition-colors ${
            currentRoute === AppRoute.IMAGE_GEN 
            ? 'bg-gray-100 dark:bg-zinc-800 text-gray-900 dark:text-white' 
            : 'text-gray-600 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-900'
          }`}
        >
          <ImageIcon size={18} />
          Image Generator
        </button>
      </nav>

      {/* History Section */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-gray-500 dark:text-zinc-500 uppercase tracking-wider">
          <Clock size={12} />
          History
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-1 py-2">
          {threads.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <p className="text-xs text-gray-400 dark:text-zinc-600">No recent conversations</p>
            </div>
          ) : (
            threads.map(thread => (
              <div
                key={thread.id}
                className={`group flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all cursor-pointer ${
                  activeThreadId === thread.id
                  ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400'
                  : 'text-gray-600 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-900'
                }`}
                onClick={() => setActiveThreadId(thread.id)}
              >
                <div className="flex-1 truncate font-medium">
                  {thread.title}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteThread(thread.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-500 transition-opacity"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="pt-4 mt-auto border-t border-gray-100 dark:border-zinc-800 space-y-1">
        <button
          onClick={() => setCurrentRoute(AppRoute.ABOUT)}
          className={`flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium rounded-xl transition-colors ${
            currentRoute === AppRoute.ABOUT 
            ? 'bg-gray-100 dark:bg-zinc-800 text-gray-900 dark:text-white' 
            : 'text-gray-600 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-900'
          }`}
        >
          <Info size={18} />
          About OursGPT
        </button>
        <button
          onClick={() => setCurrentRoute(AppRoute.PRIVACY)}
          className={`flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium rounded-xl transition-colors ${
            currentRoute === AppRoute.PRIVACY 
            ? 'bg-gray-100 dark:bg-zinc-800 text-gray-900 dark:text-white' 
            : 'text-gray-600 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-900'
          }`}
        >
          <ShieldCheck size={18} />
          Privacy
        </button>
        <button
          onClick={() => setCurrentRoute(AppRoute.SETTINGS)}
          className={`flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium rounded-xl transition-colors ${
            currentRoute === AppRoute.SETTINGS 
            ? 'bg-gray-100 dark:bg-zinc-800 text-gray-900 dark:text-white' 
            : 'text-gray-600 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-900'
          }`}
        >
          <Settings size={18} />
          Settings
        </button>
      </div>
    </div>
  );
};
