
import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, X, Sparkles } from 'lucide-react';
import { Message, ChatThread } from '../types';
import { MessageBubble } from './MessageBubble';
import { geminiService } from '../services/geminiService';

interface ChatViewProps {
  activeThread: ChatThread | null;
  onUpdateMessages: (messages: Message[]) => void;
  onNewChat: () => void;
}

export const ChatView: React.FC<ChatViewProps> = ({ activeThread, onUpdateMessages, onNewChat }) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [attachedImage, setAttachedImage] = useState<{ data: string, mimeType: string } | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeThread?.messages, isLoading]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Data = event.target?.result as string;
        const data = base64Data.split(',')[1];
        setAttachedImage({ data, mimeType: file.type });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSend = async () => {
    if ((!input.trim() && !attachedImage) || isLoading) return;

    // If no active thread, trigger creation
    if (!activeThread) {
      onNewChat();
      // We rely on the parent state update to provide the thread.
      // For immediate response, we can't easily 'wait' for props in the same function call.
      // However, App.tsx handles this by setting activeThreadId. 
      // The user will see a new chat start.
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: Date.now(),
      image: attachedImage || undefined
    };

    const currentMessages = activeThread?.messages || [];
    const updatedMessages = [...currentMessages, userMessage];
    
    onUpdateMessages(updatedMessages);
    
    const prevInput = input;
    const prevImage = attachedImage;
    
    setInput('');
    setAttachedImage(null);
    setIsLoading(true);

    try {
      const aiMessageId = (Date.now() + 1).toString();
      let fullResponse = '';
      
      // Initialize the AI message in the UI
      const initialAiMessage: Message = {
        id: aiMessageId,
        role: 'model',
        content: '',
        timestamp: Date.now(),
        isStreaming: true
      };
      
      const messagesWithAi = [...updatedMessages, initialAiMessage];
      onUpdateMessages(messagesWithAi);

      const stream = geminiService.chatStream(updatedMessages);
      
      for await (const chunk of stream) {
        fullResponse += chunk;
        // Update the specific AI message with new content
        onUpdateMessages([...updatedMessages, { 
          ...initialAiMessage, 
          content: fullResponse 
        }]);
      }

      // Final update to mark streaming as complete
      onUpdateMessages([...updatedMessages, { 
        ...initialAiMessage, 
        content: fullResponse, 
        isStreaming: false 
      }]);
    } catch (error: any) {
      console.error("Chat sending error:", error);
      setInput(prevInput);
      setAttachedImage(prevImage);

      const errorText = error?.message || "Internal Service Error";
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: `**Error:** I encountered an issue processing your request (${errorText}). Please ensure your API key is configured correctly.`,
        timestamp: Date.now()
      };
      onUpdateMessages([...updatedMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-900 relative">
      {!activeThread?.messages.length && !isLoading && (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-700">
          <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-950 rounded-3xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-8 shadow-inner">
            <Sparkles size={40} />
          </div>
          <h2 className="text-3xl font-bold mb-3 tracking-tight">How can I help you today?</h2>
          <p className="text-gray-500 dark:text-zinc-400 max-w-md mb-10 text-lg">
            Experience the power of OursGPT for writing, coding, or exploring ideas.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl px-4">
            {[
              "Explain quantum physics like I'm five",
              "Write a short story about a time traveler",
              "What's the best way to learn React?",
              "Help me plan a 3-day trip to Tokyo"
            ].map((text, i) => (
              <button
                key={i}
                onClick={() => {
                  setInput(text);
                  document.querySelector('textarea')?.focus();
                }}
                className="p-5 text-sm text-left border border-gray-200 dark:border-zinc-800 rounded-2xl hover:bg-gray-50 dark:hover:bg-zinc-800 hover:border-indigo-200 dark:hover:border-indigo-900/50 transition-all duration-200 shadow-sm"
              >
                {text}
              </button>
            ))}
          </div>
        </div>
      )}

      {(activeThread?.messages.length || isLoading) ? (
        <div ref={scrollRef} className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-6 space-y-6">
          <div className="max-w-3xl mx-auto w-full space-y-8">
            {activeThread?.messages.map(msg => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            {isLoading && (
              <div className="flex justify-start animate-in fade-in slide-in-from-left-2 duration-300">
                <div className="flex gap-3 max-w-[85%]">
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center bg-zinc-800 text-zinc-400">
                    <Sparkles size={16} />
                  </div>
                  <div className="bg-gray-100 dark:bg-zinc-800 rounded-2xl rounded-tl-none px-4 py-3 text-gray-700 dark:text-zinc-300">
                    <div className="typing-indicator flex gap-1">
                      <span></span><span></span><span></span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : null}

      <div className="p-4 md:p-6 bg-gradient-to-t from-white via-white dark:from-zinc-900 dark:via-zinc-900 to-transparent">
        <div className="max-w-3xl mx-auto relative">
          {attachedImage && (
            <div className="mb-4 relative inline-block group">
              <img 
                src={`data:${attachedImage.mimeType};base64,${attachedImage.data}`} 
                className="h-24 w-24 object-cover rounded-2xl border-2 border-indigo-500 shadow-lg"
                alt="Upload preview"
              />
              <button 
                onClick={() => setAttachedImage(null)}
                className="absolute -top-3 -right-3 p-1.5 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          )}
          
          <div className="relative group">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message OursGPT..."
              className="w-full pl-12 pr-14 py-4 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 focus:border-indigo-500/50 focus:bg-white dark:focus:bg-zinc-800 rounded-[24px] resize-none min-h-[64px] max-h-48 custom-scrollbar transition-all shadow-sm focus:shadow-md outline-none"
              rows={1}
            />
            
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute left-4 bottom-[18px] p-1.5 text-gray-400 hover:text-indigo-500 transition-colors"
              title="Attach Image"
            >
              <Paperclip size={20} />
            </button>
            
            <button
              onClick={handleSend}
              disabled={isLoading || (!input.trim() && !attachedImage)}
              className={`absolute right-3.5 bottom-3 p-2.5 rounded-2xl transition-all duration-200 ${
                input.trim() || attachedImage
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 active:scale-90'
                : 'text-gray-300 dark:text-zinc-600 cursor-not-allowed'
              }`}
            >
              <Send size={20} />
            </button>
            
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
          </div>
          <p className="mt-3 text-[11px] text-center text-gray-400 dark:text-zinc-500">
            OursGPT may provide inaccurate info. Verify its outputs.
          </p>
        </div>
      </div>
    </div>
  );
};
