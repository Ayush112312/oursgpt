
import { GoogleGenAI } from "@google/genai";
import { Message, ImageStyle } from "../types";

/**
 * Gemini Service using the latest @google/genai SDK.
 * Optimized for Gemini 3 Pro models to provide high-quality text and image generation.
 */
export const geminiService = {
  async chat(messages: Message[], systemInstruction?: string): Promise<string> {
    // Use GEMINI_API_KEY as primary, fallback to API_KEY (from dialog)
    const apiKey = (process.env.GEMINI_API_KEY || process.env.API_KEY) as string;
    
    if (!apiKey) {
      throw new Error("Gemini API key is missing. Please connect your API key in settings or environment.");
    }
    
    // Create instance right before call to ensure the latest selected key is used.
    const ai = new GoogleGenAI({ apiKey });
    
    const contents: any[] = [];
    let lastRole: string | null = null;

    for (const msg of messages) {
      if (msg.content.startsWith('**Error:**')) continue;
      // Filter out empty messages and ensure alternating roles
      if (!msg.content && !msg.image) continue;
      if (msg.role === lastRole) continue;

      const parts: any[] = [];
      
      if (msg.image) {
        parts.push({
          inlineData: {
            mimeType: msg.image.mimeType,
            data: msg.image.data
          }
        });
      }
      
      if (msg.content && msg.content.trim()) {
        parts.push({ text: msg.content.trim() });
      }

      if (parts.length > 0) {
        contents.push({
          role: msg.role,
          parts: parts
        });
        lastRole = msg.role;
      }
    }

    // Model expects the last message to be from the 'user'
    if (contents.length > 0 && contents[contents.length - 1].role !== 'user') {
       contents.pop();
    }

    if (contents.length === 0) {
      return "Hello! I'm OursGPT. How can I assist you today?";
    }

    try {
      const response = await ai.models.generateContent({
        // Gemini 3.1 Pro for high-quality reasoning and coding
        model: 'gemini-3.1-pro-preview',
        contents,
        config: {
          systemInstruction: systemInstruction || "You are OursGPT, a highly intelligent and friendly AI assistant. Use Markdown for all formatting. Be concise, professional, and helpful.",
          temperature: 0.7,
          topP: 0.95,
        }
      });
      return response.text || "I'm sorry, I couldn't process that request.";
    } catch (error: any) {
      console.error("Gemini Chat API Error:", error);
      
      // If permission denied, it often means a project isn't set up or model isn't enabled
      if (error?.message?.includes("403") || error?.message?.includes("permission") || error?.message?.includes("not found")) {
        if (window.aistudio) {
          window.aistudio.openSelectKey();
        }
      }
      throw error;
    }
  },

  async *chatStream(messages: Message[], systemInstruction?: string): AsyncGenerator<string> {
    const apiKey = (process.env.GEMINI_API_KEY || process.env.API_KEY) as string;
    
    if (!apiKey) {
      throw new Error("Gemini API key is missing. Please connect your API key in settings or environment.");
    }
    
    const ai = new GoogleGenAI({ apiKey });
    const contents: any[] = [];
    let lastRole: string | null = null;

    for (const msg of messages) {
      if (msg.content.startsWith('**Error:**')) continue;
      if (!msg.content && !msg.image) continue;
      if (msg.role === lastRole) continue;

      const parts: any[] = [];
      if (msg.image) {
        parts.push({
          inlineData: {
            mimeType: msg.image.mimeType,
            data: msg.image.data
          }
        });
      }
      if (msg.content && msg.content.trim()) {
        parts.push({ text: msg.content.trim() });
      }

      if (parts.length > 0) {
        contents.push({
          role: msg.role,
          parts: parts
        });
        lastRole = msg.role;
      }
    }

    if (contents.length > 0 && contents[contents.length - 1].role !== 'user') {
       contents.pop();
    }

    if (contents.length === 0) {
      yield "Hello! I'm OursGPT. How can I assist you today?";
      return;
    }

    try {
      const responseStream = await ai.models.generateContentStream({
        model: 'gemini-3.1-pro-preview',
        contents,
        config: {
          systemInstruction: systemInstruction || "You are OursGPT, a highly intelligent and friendly AI assistant. Use Markdown for all formatting. Be concise, professional, and helpful.",
          temperature: 0.7,
          topP: 0.95,
        }
      });

      for await (const chunk of responseStream) {
        const text = chunk.text;
        if (text) {
          yield text;
        }
      }
    } catch (error: any) {
      console.error("Gemini Stream API Error:", error);
      if (error?.message?.includes("403") || error?.message?.includes("permission") || error?.message?.includes("not found")) {
        if (window.aistudio) {
          window.aistudio.openSelectKey();
        }
      }
      throw error;
    }
  },

  async generateImage(prompt: string, style: ImageStyle): Promise<string> {
    const apiKey = (process.env.GEMINI_API_KEY || process.env.API_KEY) as string;
    
    if (!apiKey) {
      throw new Error("Gemini API key is missing. Please connect your API key for image generation.");
    }

    const ai = new GoogleGenAI({ apiKey });
    
    const styleModifiers: Record<ImageStyle, string> = {
      realistic: "photorealistic, hyper-detailed, 8k, professional photography, highly detailed textures",
      anime: "modern high-quality anime style, vibrant colors, clean lines, digital art masterpiece",
      cinematic: "cinematic lighting, dramatic atmosphere, depth of field, movie still quality",
      '3D': "octane render, 3D stylized masterpiece, high fidelity, trending on artstation",
      illustration: "artistic digital illustration, creative concept art, professional quality"
    };

    const enhancedPrompt = `${prompt}. Style: ${styleModifiers[style]}. Masterpiece, high resolution, stunning visuals.`;

    try {
      // Using gemini-3.1-flash-image-preview for high-quality images
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-image-preview',
        contents: {
          parts: [{ text: enhancedPrompt }]
        },
        config: {
          imageConfig: {
            aspectRatio: "1:1",
            imageSize: "1K"
          }
        }
      });

      // Multimodal response: extract the image data from the parts
      const candidate = response.candidates?.[0];
      if (candidate?.content?.parts) {
        for (const part of candidate.content.parts) {
          if (part.inlineData) {
            return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
          }
        }
      }
      
      throw new Error("No image data was generated. The request might have been blocked or the prompt was too sensitive.");
    } catch (error: any) {
      console.error("Gemini Image API Error:", error);
      
      if (error?.message?.includes("403") || error?.message?.includes("not found")) {
        if (window.aistudio) {
          window.aistudio.openSelectKey();
        }
      }
      throw error;
    }
  }
};
