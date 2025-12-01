export enum AppView {
  AD_WIZARD = 'AD_WIZARD',
  CREATIVE_STUDIO = 'CREATIVE_STUDIO',
  TREND_SCOUT = 'TREND_SCOUT',
  PRODUCT_ANALYZER = 'PRODUCT_ANALYZER'
}

export type AspectRatio = "1:1" | "3:4" | "4:5" | "4:3" | "9:16" | "16:9";
export type ImageSize = "1K" | "2K" | "4K";

export interface AdStyle {
  id: string;
  name: string;
  description: string;
}

export interface GeneratedImage {
  id: string;
  url: string;
  style: string;
  aspectRatio: AspectRatio;
  prompt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  sources?: { uri: string; title: string }[];
}

export enum ModelTier {
  FLASH = 'gemini-2.5-flash',
  FLASH_LITE = 'gemini-flash-lite-latest',
  FLASH_IMAGE = 'gemini-2.5-flash-image',
  PRO_THINKING = 'gemini-3-pro-preview',
  PRO_IMAGE = 'gemini-3-pro-image-preview',
}