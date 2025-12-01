import React, { useState } from 'react';
import { analyzeProduct } from '../services/geminiService';

const ProductAnalyzer: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [analysis, setAnalysis] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0];
      setFile(f);
      const reader = new FileReader();
      reader.onload = (ev) => setPreview(ev.target?.result as string);
      reader.readAsDataURL(f);
      setAnalysis('');
    }
  };

  const handleAnalyze = async () => {
    if (!preview) return;
    setLoading(true);
    try {
      const result = await analyzeProduct(
        preview, 
        "Act as a senior creative director. Analyze this product image. Provide specific visual directions and target audience identification."
      );
      setAnalysis(result || "No analysis returned.");
    } catch (e) {
      console.error(e);
      setAnalysis("Error analyzing image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 h-full bg-gray-950 text-white overflow-y-auto">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h1 className="text-3xl font-bold mb-4 text-emerald-400">
            <i className="fa-solid fa-microscope mr-2"></i>Product Audit
          </h1>
          <p className="text-gray-400 mb-6">
            Leverage Gemini 3 Pro's thinking capabilities to critique your raw photography before editing.
          </p>
          
          <div className="border-2 border-dashed border-gray-700 rounded-xl p-8 text-center hover:border-emerald-500 transition-colors mb-6 group">
            <input type="file" onChange={handleFileChange} className="hidden" id="analyze-upload" accept="image/*" />
            <label htmlFor="analyze-upload" className="cursor-pointer block">
              {preview ? (
                <img src={preview} alt="Audit" className="max-h-80 mx-auto rounded shadow-lg" />
              ) : (
                <div className="text-gray-500 py-20 group-hover:text-emerald-500 transition-colors">
                   <i className="fa-solid fa-file-image text-5xl mb-4"></i>
                   <p className="text-lg">Upload Product Photo</p>
                </div>
              )}
            </label>
          </div>

          <button
            onClick={handleAnalyze}
            disabled={!preview || loading}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
              !preview || loading
                ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white hover:shadow-lg hover:shadow-emerald-900/50'
            }`}
          >
            {loading ? <><i className="fa-solid fa-brain fa-bounce mr-2"></i> Analyzing...</> : 'Start Audit'}
          </button>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 h-fit min-h-[600px] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-green-300"></div>
          <h2 className="text-xl font-bold mb-6 text-gray-200 flex items-center gap-2">
            <i className="fa-solid fa-clipboard-check text-emerald-500"></i> Director's Report
          </h2>
          
          {analysis ? (
             <div className="text-gray-300 whitespace-pre-wrap leading-relaxed text-sm">
               {analysis}
             </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[500px] text-gray-600">
              {loading ? (
                <>
                  <i className="fa-solid fa-network-wired text-5xl mb-4 text-emerald-500/50 animate-pulse"></i>
                  <p>Reasoning...</p>
                </>
              ) : (
                <>
                  <i className="fa-solid fa-lightbulb text-5xl mb-4 opacity-20"></i>
                  <p>AI critique and strategy will appear here.</p>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductAnalyzer;