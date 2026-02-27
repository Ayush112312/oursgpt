
import React from 'react';
import { Cpu, Zap, Globe, Shield } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="h-full bg-white dark:bg-zinc-900 overflow-y-auto custom-scrollbar">
      <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">OursGPT</h1>
          <p className="text-xl text-gray-500 dark:text-zinc-400">The next generation of AI-human collaboration.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-6 rounded-3xl bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-800 space-y-4">
            <div className="w-12 h-12 bg-indigo-500/10 text-indigo-500 rounded-2xl flex items-center justify-center">
              <Cpu size={24} />
            </div>
            <h3 className="text-xl font-bold">Advanced Intelligence</h3>
            <p className="text-gray-500 dark:text-zinc-400 leading-relaxed">
              Powered by Gemini, OursGPT understands context, solves complex problems, and assists with multimodal tasks including image recognition.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-800 space-y-4">
            <div className="w-12 h-12 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center">
              <Zap size={24} />
            </div>
            <h3 className="text-xl font-bold">Lightning Fast</h3>
            <p className="text-gray-500 dark:text-zinc-400 leading-relaxed">
              Experience near-instant responses with our optimized architecture, designed for real-time productivity and creative workflows.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-800 space-y-4">
            <div className="w-12 h-12 bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center">
              <Globe size={24} />
            </div>
            <h3 className="text-xl font-bold">Multimodal Creativity</h3>
            <p className="text-gray-500 dark:text-zinc-400 leading-relaxed">
              Beyond text, OursGPT creates stunning visuals and analyzes images to bridge the gap between ideas and high-fidelity reality.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-800 space-y-4">
            <div className="w-12 h-12 bg-rose-500/10 text-rose-500 rounded-2xl flex items-center justify-center">
              <Shield size={24} />
            </div>
            <h3 className="text-xl font-bold">Private & Secure</h3>
            <p className="text-gray-500 dark:text-zinc-400 leading-relaxed">
              We prioritize your privacy. All your interaction history is stored locally on your device, giving you complete control.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
