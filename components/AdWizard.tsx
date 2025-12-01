import React, { useState } from 'react';
import { GeneratedImage, AspectRatio, AdStyle } from '../types';
import { generateHeroAd } from '../services/geminiService';
import { AD_STYLES, ASPECT_RATIOS } from '../constants';

const AdWizard: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [brand, setBrand] = useState('');
  const [price, setPrice] = useState('');
  const [heroAspectRatio, setHeroAspectRatio] = useState<AspectRatio>('9:16');
  const [selectedStyle, setSelectedStyle] = useState<AdStyle | null>(null);
  
  const [status, setStatus] = useState<'idle' | 'generating' | 'complete'>('idle');
  const [result, setResult] = useState<GeneratedImage | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0];
      setFile(f);
      const reader = new FileReader();
      reader.onload = (ev) => setPreview(ev.target?.result as string);
      reader.readAsDataURL(f);
    }
  };

  const addLog = (msg: string) => setLogs(prev => [...prev, msg]);

  const handleGenerate = async () => {
    if (!preview || !brand || !price) return;
    setStatus('generating');
    setLogs([]);
    setResult(null);

    try {
      addLog("Initializing Nano Banana 3 Pro (Gemini 3 Pro)...");
      
      if (selectedStyle) {
         addLog(`Applying style: ${selectedStyle.name}...`);
      } else {
         addLog("AI is selecting the best style for your product...");
      }

      const generatedBase64 = await generateHeroAd(preview, brand, price, heroAspectRatio, selectedStyle);
      
      if (generatedBase64) {
        setResult({
          id: Date.now().toString(),
          url: generatedBase64,
          style: selectedStyle ? selectedStyle.name : 'AI Optimized',
          aspectRatio: heroAspectRatio,
          prompt: 'Masterpiece generation'
        });
        addLog("Super Ad generated successfully.");
      } else {
        addLog("Failed to generate Super Ad.");
      }

      setStatus('complete');
      addLog("Generation complete!");

    } catch (error) {
      console.error(error);
      addLog("Error during generation. Please check console.");
      setStatus('idle');
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-950 text-white overflow-y-auto p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500 mb-2">
          <i className="fa-solid fa-wand-magic-sparkles mr-3"></i>Ad Wizard
        </h1>
        <p className="text-gray-400">Generate professional, ultra-premium marketing assets.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Configuration */}
        <div className="lg:col-span-4 bg-gray-850 p-6 rounded-xl border border-gray-750 h-fit sticky top-4">
          <h2 className="text-xl font-semibold mb-6">Configuration</h2>
          
          {/* Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-400 mb-2">Product Image</label>
            <div className="relative border-2 border-dashed border-gray-600 hover:border-pink-500 rounded-lg p-4 transition-colors text-center cursor-pointer group">
               <input type="file" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept="image/*" />
               {preview ? (
                 <img src={preview} alt="Preview" className="mx-auto h-48 object-contain rounded" />
               ) : (
                 <div className="py-8">
                   <i className="fa-solid fa-cloud-arrow-up text-3xl mb-2 text-gray-500 group-hover:text-pink-500 transition-colors"></i>
                   <p className="text-sm text-gray-400">Drop image here</p>
                 </div>
               )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Brand Name</label>
              <input 
                type="text" 
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full bg-gray-950 border border-gray-700 rounded p-2 focus:border-pink-500 outline-none transition"
                placeholder="Ex: Aura"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Price</label>
              <input 
                type="text" 
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full bg-gray-950 border border-gray-700 rounded p-2 focus:border-pink-500 outline-none transition"
                placeholder="$129"
              />
            </div>
          </div>

          <div className="mb-6">
             <label className="block text-sm text-gray-400 mb-2">Aspect Ratio</label>
             <div className="flex flex-wrap gap-2">
               {ASPECT_RATIOS.map((r) => (
                 <button
                   key={r}
                   onClick={() => setHeroAspectRatio(r)}
                   className={`px-3 py-1 rounded text-xs transition-colors border border-transparent ${
                     heroAspectRatio === r 
                     ? 'bg-pink-600 text-white' 
                     : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:border-gray-600'
                   }`}
                 >
                   {r}
                 </button>
               ))}
             </div>
          </div>

          <div className="mb-8">
             <label className="block text-sm text-gray-400 mb-2">Style (Optional)</label>
             <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                <button
                    onClick={() => setSelectedStyle(null)}
                    className={`text-left px-3 py-3 rounded text-sm transition-all border flex items-center ${
                      selectedStyle === null
                      ? 'bg-purple-900/50 border-purple-500 text-white'
                      : 'bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700'
                    }`}
                  >
                    <span className="font-bold">✨ AI Auto-Select</span>
                </button>
               {AD_STYLES.map((s) => (
                 <button
                   key={s.id}
                   onClick={() => setSelectedStyle(s)}
                   className={`text-left px-3 py-3 rounded text-sm transition-all border ${
                     selectedStyle?.id === s.id
                     ? 'bg-pink-900/50 border-pink-500 text-white'
                     : 'bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700'
                   }`}
                 >
                   <span className="font-bold block">{s.name}</span>
                 </button>
               ))}
             </div>
          </div>

          <button 
            onClick={handleGenerate}
            disabled={status === 'generating' || !preview}
            className={`w-full py-4 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${
              status === 'generating' || !preview 
              ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
              : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-lg hover:shadow-pink-900/50 text-white hover:scale-[1.02]'
            }`}
          >
            {status === 'generating' ? (
              <><i className="fa-solid fa-spinner fa-spin"></i> Designing...</>
            ) : (
              <><i className="fa-solid fa-star"></i> Generate Super Ad</>
            )}
          </button>

          {/* Logs */}
          {logs.length > 0 && (
            <div className="mt-6 bg-gray-950 p-3 rounded text-xs text-gray-400 font-mono h-32 overflow-y-auto border border-gray-800">
              {logs.map((log, i) => <div key={i}>> {log}</div>)}
            </div>
          )}
        </div>

        {/* Right Column: Results */}
        <div className="lg:col-span-8 flex flex-col">
          <h2 className="text-xl font-semibold mb-6">Generated Masterpiece</h2>
          <div className="flex-1 bg-gray-900/50 border border-gray-800 rounded-xl flex items-center justify-center min-h-[600px] overflow-hidden relative">
            {result ? (
              <div className="relative group w-full h-full flex items-center justify-center p-4">
                 <img src={result.url} alt="Result" className="max-w-full max-h-[800px] object-contain shadow-2xl rounded-lg" />
                 
                 <div className="absolute bottom-8 right-8 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <a href={result.url} download={`super_ad_${brand}.png`} className="bg-white text-black px-6 py-3 rounded-full font-bold shadow-lg hover:bg-gray-200 transition-colors">
                      <i className="fa-solid fa-download mr-2"></i> Download High-Res
                    </a>
                 </div>
              </div>
            ) : (
              <div className="text-center text-gray-600">
                <div className="w-24 h-24 rounded-full bg-gray-800 mx-auto mb-4 flex items-center justify-center">
                   <i className="fa-solid fa-image text-3xl opacity-50"></i>
                </div>
                <p className="text-lg">Your generated ad will appear here.</p>
                <p className="text-sm opacity-50 mt-2">Select your settings on the left to begin.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdWizard;