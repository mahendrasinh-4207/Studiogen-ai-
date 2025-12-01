import { AspectRatio, AdStyle } from "./types";

export const ASPECT_RATIOS: AspectRatio[] = ["1:1", "3:4", "4:5", "4:3", "9:16", "16:9"];

export const AD_STYLES: AdStyle[] = [
  {
    id: 'cinematic_ultra_glow',
    name: 'Cinematic Ultra-Glow',
    description: 'Deep contrast, teal-gold lights, dramatic rim, volumetric atmosphere.'
  },
  {
    id: 'celebrity_spotlight',
    name: 'Celebrity Spotlight',
    description: 'Red-carpet lighting, warm key + cool rim, glossy reflection floor.'
  },
  {
    id: 'luxury_black_gold',
    name: 'Luxury Black-Gold',
    description: 'Matte black background, gold accents, premium shadow depth.'
  },
  {
    id: 'fantasy_dreamscape',
    name: 'Fantasy Dreamscape',
    description: 'Clouds, sparkles, ethereal light beams, magical ambiance.'
  },
  {
    id: 'nature_elemental',
    name: 'Nature Elemental',
    description: 'Water splashes, leaves, flowers, fireflies, sand, sunlight.'
  },
  {
    id: 'sci_fi_neon',
    name: 'Sci-Fi Neon Tech',
    description: 'Holograms, neon outlines, cyberpunk glow, tech particles.'
  },
  {
    id: 'humorous_creative',
    name: 'Humorous Creative',
    description: 'Playful angles, funny metaphors, exaggerated props.'
  },
  {
    id: 'animal_majestic',
    name: 'Animal-Inspired Majestic',
    description: 'Symbolic animals (lion, eagle), artistic silhouettes.'
  },
  {
    id: 'minimal_premium',
    name: 'Minimal Premium Studio',
    description: 'Softbox lighting, clean gradients, minimalist elegance.'
  }
];

export const HERO_AD_PROMPT = `
You are a world-class commercial photographer, art director, and creative visual effects maestro.
Your job is to generate ONE single, ultra-premium, scroll-stopping product advertisement image based on the attached INPUT_IMAGE.

The uploaded product must remain EXACTLY the same:
• DO NOT change its shape, color, logo, typography, size, texture, or printed details.
• Preserve the product with pixel-accurate fidelity.
• You MAY remove background cleanly and re-compose the product into any scene, but the product body itself must be untouched.

--- GOAL ---
Create ONE single “super ad” image that looks like it belongs to a multi-million-rupee global campaign.
Make it visually UNBELIEVABLE, iconic, stunning, stylish, and impossible to ignore.

--- STYLE INSTRUCTION ---
{{STYLE_INSTRUCTION}}

--- COMPOSITION RULES ---
• Product is the hero.
• Use dramatic lighting: rim light, glow, softbox reflections, cinematic depth.
• Natural shadow or reflection under the product.
• Ensure color harmony and aesthetic perfection.

--- TEXT TO ADD ON IMAGE (PREMIUM TYPOGRAPHY) ---
1) **Brand Name:** {{BRAND_NAME}}
   - Use ultra-modern fonts: sleek, bold, luxury serif, neon glow, or metallic.
   - Place with elegance.

2) **Price:** {{PRICE}}
   - Use stylish contrasting badge or typography.

3) **AI-Generated Tagline (6–8 words max)**
   - Must be bold, original, and emotionally striking.
   - Example tone: “Where imagination meets perfection.” or “Power that feels impossible.”
   - GENERATE A NEW UNIQUE TAGLINE.

--- TECHNICAL RULES ---
• Maximal realism or maximal surrealism is allowed.
• Maintain extremely high resolution and clarity.
• No watermarks, no borders.
• Use Nano Banana 3 Pro’s best detail rendering.

--- OUTPUT ---
Return ONE final image:
• Ultra-premium and Cinematic
• Product untouched
• Brand name + price + tagline added in world-class font design
• Background completely reimagined at a masterpiece level
`;