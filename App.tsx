
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { ChatView } from './components/ChatView';
import { ImageGeneratorView } from './components/ImageGeneratorView';
import { About } from './components/About';
import { Privacy } from './components/Privacy';
import { Settings } from './components/Settings';
import { AppRoute, ChatThread, Message } from './types';
import { Key, Sparkles, ShieldCheck, Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [currentRoute, setCurrentRoute] = useState<AppRoute>(AppRoute.CHAT);
  const [hasKey, setHasKey] = useState<boolean | null>(null);
  
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('theme');
      return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
    } catch (e) {
      return false;
    }
  });
  
  const [threads, setThreads] = useState<ChatThread[]>(() => {
    try {
      const saved = localStorage.getItem('threads');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  
  const [activeThreadId, setActiveThreadId] = useState<string | null>(() => {
    try {
      return localStorage.getItem('activeThreadId');
    } catch (e) {
      return null;
    }
  });

  // Check for API Key selection on mount
  useEffect(() => {
    const checkKey = async () => {
      // If GEMINI_API_KEY is already in process.env, we can skip the selection
      if (process.env.GEMINI_API_KEY) {
        setHasKey(true);
        return;
      }

      if (window.aistudio) {
        const selected = await window.aistudio.hasSelectedApiKey();
        setHasKey(selected);
      } else {
        // Fallback for non-AI Studio environments
        setHasKey(true);
      }
    };
    checkKey();
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('threads', JSON.stringify(threads));
  }, [threads]);

  useEffect(() => {
    if (activeThreadId) {
      localStorage.setItem('activeThreadId', activeThreadId);
    } else {
      localStorage.removeItem('activeThreadId');
    }
  }, [activeThreadId]);

  const toggleTheme = () => setIsDarkMode(prev => !prev);

  const handleSelectKey = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      // Assume success as per guidelines to avoid race condition
      setHasKey(true);
    }
  };

  const handleNewChat = () => {
    const newId = Date.now().toString();
    const newThread: ChatThread = {
      id: newId,
      title: 'New Chat',
      messages: [],
      updatedAt: Date.now()
    };
    setThreads(prev => [newThread, ...prev]);
    setActiveThreadId(newId);
    setCurrentRoute(AppRoute.CHAT);
  };

  const updateThreadMessages = (id: string, messages: Message[]) => {
    setThreads(prev => prev.map(t => {
      if (t.id === id) {
        const title = messages[0]?.content.slice(0, 30) || 'New Chat';
        return { ...t, messages, title: t.messages.length === 0 ? title : t.title, updatedAt: Date.now() };
      }
      return t;
    }));
  };

  const deleteThread = (id: string) => {
    setThreads(prev => prev.filter(t => t.id !== id));
    if (activeThreadId === id) {
      setActiveThreadId(null);
    }
  };

  // Entry guard screen
  if (hasKey === false) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-zinc-950 p-6">
        <div className="max-w-md w-full bg-white dark:bg-zinc-900 rounded-[32px] p-8 shadow-2xl border border-gray-100 dark:border-zinc-800 text-center space-y-8 animate-in zoom-in-95 duration-500">
          <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center text-white mx-auto shadow-xl shadow-indigo-500/20">
            <Sparkles size={40} />
          </div>
          <div className="space-y-3">
            <h1 className="text-3xl font-bold tracking-tight">Welcome to OursGPT</h1>
            <p className="text-gray-500 dark:text-zinc-400">
              To access high-performance Pro models for chat and images, please select your API key.
            </p>
          </div>
          <div className="space-y-4">
            <button
              onClick={handleSelectKey}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold transition-all shadow-lg flex items-center justify-center gap-3 active:scale-95"
            >
              <Key size={20} />
              Connect API Key
            </button>
            <a 
              href="https://ai.google.dev/gemini-api/docs/billing" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block text-xs text-indigo-500 hover:underline"
            >
              Learn about billing and paid projects
            </a>
          </div>
          <div className="pt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
            <ShieldCheck size={14} />
            <span>Secure connection via Google AI Studio</span>
          </div>
        </div>
      </div>
    );
  }

  if (hasKey === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <Loader2 className="animate-spin text-indigo-500" size={32} />
      </div>
    );
  }

  const activeThread = threads.find(t => t.id === activeThreadId) || null;

  return (
    <Layout
      currentRoute={currentRoute}
      setCurrentRoute={setCurrentRoute}
      isDarkMode={isDarkMode}
      toggleTheme={toggleTheme}
      threads={threads}
      activeThreadId={activeThreadId}
      setActiveThreadId={setActiveThreadId}
      onNewChat={handleNewChat}
      onDeleteThread={deleteThread}
    >
      {currentRoute === AppRoute.CHAT && (
        <ChatView 
          activeThread={activeThread} 
          onUpdateMessages={(msgs) => activeThreadId && updateThreadMessages(activeThreadId, msgs)}
          onNewChat={handleNewChat}
        />
      )}
      {currentRoute === AppRoute.IMAGE_GEN && <ImageGeneratorView />}
      {currentRoute === AppRoute.ABOUT && <About />}
      {currentRoute === AppRoute.PRIVACY && <Privacy />}
      {currentRoute === AppRoute.SETTINGS && (
        <Settings 
          isDarkMode={isDarkMode} 
          toggleTheme={toggleTheme} 
          onClearHistory={() => {
            setThreads([]);
            localStorage.removeItem('threads');
            localStorage.removeItem('activeThreadId');
            localStorage.removeItem('image_history');
          }} 
        />
      )}
    </Layout>
  );
};

export default App;
