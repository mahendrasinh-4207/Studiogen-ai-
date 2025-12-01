import { GoogleGenAI } from "@google/genai";
import { ModelTier, AspectRatio, AdStyle } from "../types";
import { HERO_AD_PROMPT } from "../constants";

const getAIClient = async () => {
  // Directly use the environment variable for API key
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

// Helper to extract image data from response
const extractImageFromResponse = (response: any): string | null => {
  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  return null;
};

// 1. Generate Hero Ad (Super Ad)
export const generateHeroAd = async (
  imageBase64: string,
  brand: string,
  price: string,
  aspectRatio: AspectRatio = "9:16",
  style: AdStyle | null = null
): Promise<string | null> => {
  const ai = await getAIClient();
  const cleanBase64 = imageBase64.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');

  // Construct Style Instruction
  let styleInstruction = "Choose the MOST IMPACTFUL possible style. Blend aesthetics like Cinematic, Luxury, Fantasy, or Neon. Choose the one that produces the **single most breathtaking result.**";
  
  if (style) {
    styleInstruction = `
    User has selected style: **${style.name}**.
    Description: ${style.description}.
    You MUST generate the image strictly in this style. This affects background, lighting, and mood only. Product must remain untouched.
    `;
  }

  // Fill in the template
  const prompt = HERO_AD_PROMPT
    .replace('{{BRAND_NAME}}', brand)
    .replace('{{PRICE}}', price)
    .replace('{{STYLE_INSTRUCTION}}', styleInstruction);

  const contents = {
    parts: [
      { inlineData: { mimeType: 'image/png', data: cleanBase64 } },
      { text: prompt }
    ]
  };

  // Map 4:5 to 3:4 if needed, or send as is. gemini-3-pro-image-preview handles standard ratios. 
  // If 4:5 fails in testing, we can map to "3:4" here. We will pass it through.
  let targetRatio = aspectRatio;
  if (aspectRatio === '4:5') targetRatio = '3:4'; // Fallback mapping for safety, as 3:4 is physically close to 4:5

  try {
    // Attempt with PRO model
    const response = await ai.models.generateContent({
      model: ModelTier.PRO_IMAGE,
      contents: contents,
      config: {
        imageConfig: {
          aspectRatio: targetRatio,
          imageSize: '2K' 
        }
      }
    });
    return extractImageFromResponse(response);

  } catch (e: any) {
    console.warn("Hero Ad: Pro model failed, falling back to Flash.", e);
    
    if (e.toString().includes('403') || e.message?.includes('PERMISSION_DENIED') || e.status === 403) {
      try {
        const response = await ai.models.generateContent({
          model: ModelTier.FLASH_IMAGE,
          contents: contents,
          config: {
            imageConfig: {
              aspectRatio: targetRatio,
            }
          }
        });
        return extractImageFromResponse(response);
      } catch (fallbackError) {
        console.error("Hero Ad: Flash model also failed", fallbackError);
      }
    }
  }
  return null;
};

// 2. Generate New Image (Creative Studio)
export const generateHighQualityImage = async (
  prompt: string,
  aspectRatio: string,
  size: "1K" | "2K" | "4K"
): Promise<string | null> => {
  const ai = await getAIClient();

  // Handle 4:5 mapping
  let targetRatio = aspectRatio;
  if (aspectRatio === '4:5') targetRatio = '3:4';

  try {
    const response = await ai.models.generateContent({
      model: ModelTier.PRO_IMAGE,
      contents: { parts: [{ text: prompt }] },
      config: {
        imageConfig: {
          aspectRatio: targetRatio,
          imageSize: size
        }
      }
    });
    return extractImageFromResponse(response);

  } catch (e: any) {
    console.warn("Creative Studio: Pro model failed, falling back to Flash.", e);

    if (e.toString().includes('403') || e.message?.includes('PERMISSION_DENIED') || e.status === 403) {
      try {
        const response = await ai.models.generateContent({
          model: ModelTier.FLASH_IMAGE,
          contents: { parts: [{ text: prompt }] },
          config: {
            imageConfig: {
              aspectRatio: targetRatio,
            }
          }
        });
        return extractImageFromResponse(response);
      } catch (fallbackError) {
         console.error("Creative Studio: Flash model also failed", fallbackError);
      }
    }
  }
  return null;
};

// 3. Trend Scout (Search Grounding)
export const searchTrends = async (query: string) => {
  const ai = await getAIClient();
  
  const systemInstruction = `
    You are a market research expert. 
    Provide a MINIMAL, PRECISE, and HIGHLY USEFUL analysis.
    Do not write long paragraphs. Use clear headers and bullet points.
    Structure:
    * Key Trends
    * Competitor Aesthetics
    * Actionable Direction
  `;

  const response = await ai.models.generateContent({
    model: ModelTier.FLASH, 
    contents: query,
    config: {
      tools: [{ googleSearch: {} }],
      systemInstruction: systemInstruction
    }
  });

  return {
    text: response.text,
    sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
  };
};

// 4. Product Analyzer (Thinking Model + Vision)
export const analyzeProduct = async (imageBase64: string, question: string) => {
  const ai = await getAIClient();
  const cleanBase64 = imageBase64.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');

  const prompt = `
    ${question}
    
    FORMATTING RULES:
    - Keep output MINIMAL, PRECISE, and HIGHLY USEFUL.
    - Use headers and bullet points.
    - No fluff. Direct actionable advice only.
  `;

  const response = await ai.models.generateContent({
    model: ModelTier.PRO_THINKING,
    contents: {
      parts: [
        { inlineData: { mimeType: 'image/png', data: cleanBase64 } },
        { text: prompt }
      ]
    },
    config: {
      thinkingConfig: { thinkingBudget: 4096 }
    }
  });

  return response.text;
};