import React, { useState } from 'react';
import { generateHighQualityImage } from '../services/geminiService';
import { AspectRatio, ImageSize } from '../types';
import { ASPECT_RATIOS } from '../constants';

const CreativeStudio: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("1:1");
  const [size, setSize] = useState<ImageSize>("2K");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt) return;
    setIsGenerating(true);
    setGeneratedImage(null);
    try {
      const img = await generateHighQualityImage(prompt, aspectRatio, size);
      setGeneratedImage(img);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-8 h-full bg-gray-950 text-white overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 mb-2">
            Creative Studio
          </h1>
          <p className="text-gray-400">Generate high-fidelity assets (up to 4K) using Nano Banana Pro (Gemini 3 Pro).</p>
        </div>

        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6 shadow-xl mb-8">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the image you want to create in vivid detail..."
            className="w-full bg-gray-950 text-white p-4 rounded-xl border border-gray-700 focus:border-purple-500 outline-none h-32 resize-none mb-6"
          />

          <div className="flex flex-wrap gap-6 mb-6">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Aspect Ratio</label>
              <div className="flex flex-wrap gap-2">
                {ASPECT_RATIOS.map((r) => (
                  <button
                    key={r}
                    onClick={() => setAspectRatio(r)}
                    className={`px-3 py-1 rounded text-sm transition-colors ${
                      aspectRatio === r ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Resolution</label>
              <div className="flex gap-2">
                {(["1K", "2K", "4K"] as ImageSize[]).map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`px-3 py-1 rounded text-sm transition-colors ${
                      size === s ? 'bg-pink-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt}
            className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all ${
              isGenerating || !prompt
                ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:scale-[1.01] hover:shadow-lg shadow-purple-900/50'
            }`}
          >
            {isGenerating ? <i className="fa-solid fa-circle-notch fa-spin"></i> : <i className="fa-solid fa-paintbrush"></i>}
            Create Masterpiece
          </button>
        </div>

        {generatedImage && (
          <div className="bg-black rounded-xl overflow-hidden border border-gray-800 shadow-2xl animate-fade-in">
            <div className="p-2 flex justify-between items-center bg-gray-900">
               <span className="text-xs text-gray-400 px-2">{size} • {aspectRatio}</span>
               <a href={generatedImage} download="masterpiece.png" className="text-gray-300 hover:text-white px-2">
                 <i className="fa-solid fa-download"></i>
               </a>
            </div>
            <img src={generatedImage} alt="Generated" className="w-full h-auto" />
          </div>
        )}
      </div>
    </div>
  );
};

export default CreativeStudio;