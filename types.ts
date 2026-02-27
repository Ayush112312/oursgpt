
export type Role = 'user' | 'model';

export interface MessagePart {
  text?: string;
  inlineData?: {
    mimeType: string;
    data: string;
  };
}

export interface Message {
  id: string;
  role: Role;
  content: string;
  timestamp: number;
  image?: {
    data: string;
    mimeType: string;
  };
  isStreaming?: boolean;
}

export interface ChatThread {
  id: string;
  title: string;
  messages: Message[];
  updatedAt: number;
}

export type ImageStyle = 'realistic' | 'anime' | 'cinematic' | '3D' | 'illustration';

export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  style: ImageStyle;
  timestamp: number;
}

export enum AppRoute {
  CHAT = 'chat',
  IMAGE_GEN = 'image-gen',
  ABOUT = 'about',
  PRIVACY = 'privacy',
  SETTINGS = 'settings'
}

declare global {
  interface Window {
    aistudio: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}
