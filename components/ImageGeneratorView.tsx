
import React, { useState } from 'react';
import { Sparkles, Download, Wand2, Loader2, Image as ImageIcon, AlertCircle, Key } from 'lucide-react';
import { ImageStyle, GeneratedImage } from '../types';
import { geminiService } from '../services/geminiService';

const STYLES: { id: ImageStyle; name: string; preview: string }[] = [
  { id: 'realistic', name: 'Realistic', preview: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=200&h=200&fit=crop' },
  { id: 'anime', name: 'Anime', preview: 'https://images.unsplash.com/photo-1578632292335-df3abbb0d586?w=200&h=200&fit=crop' },
  { id: 'cinematic', name: 'Cinematic', preview: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=200&h=200&fit=crop' },
  { id: '3D', name: '3D Render', preview: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=200&h=200&fit=crop' },
  { id: 'illustration', name: 'Illustration', preview: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&h=200&fit=crop' },
];

export const ImageGeneratorView: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<ImageStyle>('realistic');
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [history, setHistory] = useState<GeneratedImage[]>(() => {
    try {
      const saved = localStorage.getItem('image_history');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to parse image history", e);
      return [];
    }
  });
  const [currentImage, setCurrentImage] = useState<string | null>(null);

  const handleSelectKey = async () => {
    try {
      await window.aistudio.openSelectKey();
      setErrorMessage(null);
    } catch (e) {
      console.error("Failed to open key selector", e);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    setCurrentImage(null);
    setErrorMessage(null);
    
    try {
      const imageUrl = await geminiService.generateImage(prompt, selectedStyle);
      setCurrentImage(imageUrl);
      
      const newGen: GeneratedImage = {
        id: Date.now().toString(),
        url: imageUrl,
        prompt: prompt,
        style: selectedStyle,
        timestamp: Date.now()
      };
      
      const newHistory = [newGen, ...history];
      setHistory(newHistory);
      localStorage.setItem('image_history', JSON.stringify(newHistory));
    } catch (error: any) {
      console.error("Image generation error:", error);
      let msg = error?.message || "Failed to generate image.";
      
      if (msg.includes("429") || msg.includes("quota")) {
        msg = "Quota exhausted on Free Tier. Please connect a paid API key for high-quality image generation.";
      } else if (msg.includes("404") || msg.includes("not found")) {
        msg = "The image generation model was not found. Please select a valid paid API key.";
      }
      
      setErrorMessage(msg);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadImage = (url: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-900 overflow-y-auto custom-scrollbar">
      <div className="max-w-5xl mx-auto w-full p-4 md:p-8 space-y-8">
        <div className="space-y-2 text-center md:text-left">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Image Generator</h1>
          <p className="text-gray-500 dark:text-zinc-400">High-fidelity visuals powered by Gemini 3 Pro.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-4">
              <label className="text-sm font-semibold text-gray-700 dark:text-zinc-300 block">Prompt</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe what you want to see..."
                className="w-full p-4 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-2xl h-40 resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none shadow-sm"
              />
            </div>

            <div className="space-y-4">
              <label className="text-sm font-semibold text-gray-700 dark:text-zinc-300 block">Style</label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {STYLES.map(style => (
                  <button
                    key={style.id}
                    onClick={() => setSelectedStyle(style.id)}
                    className={`flex flex-col items-center gap-1 group transition-all ${
                      selectedStyle === style.id ? 'scale-105' : 'opacity-70 grayscale hover:grayscale-0 hover:opacity-100'
                    }`}
                  >
                    <div className={`w-full aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedStyle === style.id ? 'border-indigo-600 shadow-md' : 'border-transparent'
                    }`}>
                      <img src={style.preview} className="w-full h-full object-cover" alt={style.name} />
                    </div>
                    <span className={`text-[10px] font-medium ${
                      selectedStyle === style.id ? 'text-indigo-600' : 'text-gray-500'
                    }`}>
                      {style.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className={`flex items-center justify-center gap-2 w-full py-4 rounded-2xl font-bold transition-all ${
                isGenerating || !prompt.trim()
                ? 'bg-gray-100 dark:bg-zinc-800 text-gray-400 dark:text-zinc-600 cursor-not-allowed'
                : 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/20 hover:bg-indigo-700 active:scale-[0.98]'
              }`}
            >
              {isGenerating ? (
                <><Loader2 className="animate-spin" size={20} /> Generating...</>
              ) : (
                <><Wand2 size={20} /> Generate Artwork</>
              )}
            </button>

            {errorMessage && (
              <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 space-y-3">
                <div className="flex gap-3 text-red-600 dark:text-red-400 text-sm font-medium">
                  <AlertCircle size={18} className="flex-shrink-0" />
                  <p>{errorMessage}</p>
                </div>
                {(errorMessage.includes("Quota") || errorMessage.includes("not found")) && (
                  <button 
                    onClick={handleSelectKey}
                    className="w-full py-2 bg-white dark:bg-zinc-800 border border-red-200 dark:border-red-900/50 rounded-lg text-xs font-bold text-red-600 dark:text-red-400 flex items-center justify-center gap-2 hover:bg-red-50 transition-colors"
                  >
                    <Key size={14} /> Connect Paid API Key
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="lg:col-span-7 flex flex-col items-center justify-center bg-gray-50 dark:bg-zinc-950 rounded-3xl border border-dashed border-gray-300 dark:border-zinc-800 min-h-[400px] overflow-hidden relative shadow-inner">
            {isGenerating ? (
              <div className="flex flex-col items-center gap-4 p-8 text-center">
                <div className="relative">
                  <div className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center text-indigo-500 animate-pulse">
                    <Sparkles size={40} />
                  </div>
                  <div className="absolute -top-1 -right-1">
                    <Loader2 className="animate-spin text-indigo-400" size={24} />
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-gray-700 dark:text-zinc-300">AI is dreaming up your image...</p>
                  <p className="text-xs text-gray-400">High-quality 1K generation in progress</p>
                </div>
              </div>
            ) : currentImage ? (
              <div className="w-full h-full group relative animate-in zoom-in-95 duration-500">
                <img src={currentImage} className="w-full h-full object-contain" alt="Generated" />
                <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex justify-between items-center">
                  <span className="text-white text-sm font-medium px-3 py-1 bg-white/20 backdrop-blur-md rounded-lg">
                    {selectedStyle}
                  </span>
                  <button 
                    onClick={() => downloadImage(currentImage, `oursgpt-${Date.now()}.png`)}
                    className="p-3 bg-white text-indigo-600 rounded-full shadow-lg hover:scale-110 transition-transform"
                  >
                    <Download size={20} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4 text-gray-400 dark:text-zinc-600 text-center px-6">
                <div className="p-6 bg-gray-100 dark:bg-zinc-900 rounded-full">
                  <ImageIcon size={64} strokeWidth={1} />
                </div>
                <div>
                  <p className="font-medium">Ready to create?</p>
                  <p className="text-sm opacity-60">Describe your masterpiece and click generate.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {history.length > 0 && (
          <div className="space-y-6 pt-10 border-t border-gray-100 dark:border-zinc-800">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Sparkles size={20} className="text-indigo-500" />
              Recent Creations
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {history.map(item => (
                <div key={item.id} className="group relative aspect-square rounded-2xl overflow-hidden border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800 transition-all hover:-translate-y-1 hover:shadow-xl">
                  <img src={item.url} className="w-full h-full object-cover" alt={item.prompt} />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end gap-2 text-left">
                    <p className="text-white text-[10px] line-clamp-2 font-medium leading-tight">{item.prompt}</p>
                    <button 
                      onClick={() => downloadImage(item.url, `oursgpt-${item.id}.png`)}
                      className="w-full py-1.5 bg-white text-zinc-900 rounded-lg text-xs font-bold hover:bg-gray-100 transition-colors flex items-center justify-center gap-1"
                    >
                      <Download size={14} /> Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
