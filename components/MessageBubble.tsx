
import React from 'react';
import { Message } from '../types';
import { User, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
      <div className={`flex gap-3 max-w-[85%] ${isUser ? 'flex-row-reverse' : ''}`}>
        <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
          isUser 
          ? 'bg-indigo-100 text-indigo-600' 
          : 'bg-zinc-800 text-zinc-400'
        }`}>
          {isUser ? <User size={16} /> : <Sparkles size={16} />}
        </div>
        
        <div className="flex flex-col gap-2">
          {message.image && (
            <div className={`overflow-hidden rounded-2xl border border-gray-100 dark:border-zinc-800 ${isUser ? 'ml-auto' : ''}`}>
              <img 
                src={`data:${message.image.mimeType};base64,${message.image.data}`} 
                alt="Attached" 
                className="max-h-60 max-w-full object-cover"
              />
            </div>
          )}
          
          {message.content && (
            <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed markdown-content relative ${
              isUser 
              ? 'bg-indigo-600 text-white rounded-tr-none' 
              : 'bg-gray-100 dark:bg-zinc-800 text-gray-800 dark:text-zinc-200 rounded-tl-none'
            }`}
            >
              <div className="prose dark:prose-invert prose-sm max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {message.content}
                </ReactMarkdown>
              </div>
              {message.isStreaming && (
                <span className="inline-block w-1.5 h-4 ml-1 bg-indigo-500 dark:bg-indigo-400 animate-pulse align-middle" />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
