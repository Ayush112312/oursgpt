
import React from 'react';
import { Trash2, Sun, Moon, Database, HelpCircle, Key, ExternalLink } from 'lucide-react';

interface SettingsProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
  onClearHistory: () => void;
}

// The Window interface already contains the correctly typed 'aistudio' property (AIStudio type).
// Manual declaration is removed to avoid duplicate/conflicting property errors and modifier mismatches.

export const Settings: React.FC<SettingsProps> = ({ isDarkMode, toggleTheme, onClearHistory }) => {
  const handleClearHistory = () => {
    if (window.confirm("Are you sure you want to clear all chat and image history? This cannot be undone.")) {
      onClearHistory();
      localStorage.clear();
      window.location.reload();
    }
  };

  const handleSelectKey = async () => {
    try {
      await window.aistudio.openSelectKey();
    } catch (e) {
      console.error("Failed to open key selector", e);
    }
  };

  return (
    <div className="h-full bg-white dark:bg-zinc-900 overflow-y-auto custom-scrollbar">
      <div className="max-w-2xl mx-auto p-4 md:p-8 space-y-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        
        <div className="space-y-6">
          <section className="space-y-4">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">API Configuration</h2>
            <div className="p-4 rounded-2xl border border-gray-200 dark:border-zinc-800 space-y-4 bg-indigo-50/30 dark:bg-indigo-900/10">
              <div className="flex items-start gap-3">
                <Key size={20} className="text-indigo-600 dark:text-indigo-400 mt-1" />
                <div className="flex-1">
                  <p className="font-medium">Paid API Project</p>
                  <p className="text-xs text-gray-500 dark:text-zinc-400 mb-4">
                    If you are experiencing "Quota Exceeded" (429) errors, please select a paid Google Cloud project key.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button 
                      onClick={handleSelectKey}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-colors flex items-center gap-2"
                    >
                      Connect Paid Key
                    </button>
                    <a 
                      href="https://ai.google.dev/gemini-api/docs/billing" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-xs font-bold hover:bg-gray-50 transition-colors flex items-center gap-2"
                    >
                      Billing Docs <ExternalLink size={12} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Appearance</h2>
            <div className="flex items-center justify-between p-4 rounded-2xl border border-gray-200 dark:border-zinc-800">
              <div className="flex items-center gap-3">
                {isDarkMode ? <Moon size={20} className="text-indigo-400" /> : <Sun size={20} className="text-orange-400" />}
                <div>
                  <p className="font-medium">Dark Mode</p>
                  <p className="text-xs text-gray-500">Toggle light and dark themes</p>
                </div>
              </div>
              <button 
                onClick={toggleTheme}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isDarkMode ? 'bg-indigo-600' : 'bg-gray-200'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isDarkMode ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Data & Privacy</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 rounded-2xl border border-gray-200 dark:border-zinc-800">
                <div className="flex items-center gap-3">
                  <Database size={20} className="text-gray-400" />
                  <div>
                    <p className="font-medium">Clear All Data</p>
                    <p className="text-xs text-gray-500">Delete all chats, images and local preferences</p>
                  </div>
                </div>
                <button 
                  onClick={handleClearHistory}
                  className="px-4 py-2 bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 rounded-xl text-xs font-bold hover:bg-red-100 transition-colors"
                >
                  Clear Data
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
