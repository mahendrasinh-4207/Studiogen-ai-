import React, { useState } from 'react';
import { searchTrends } from '../services/geminiService';

const TrendScout: React.FC = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ text: string | undefined; sources: any[] } | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;
    setLoading(true);
    setResult(null);
    try {
      const data = await searchTrends(query);
      setResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 h-full bg-gray-950 text-white overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <i className="fa-brands fa-google text-blue-500"></i> Trend Scout
        </h1>
        <p className="text-gray-400 mb-8">Use Google Search grounding to research market trends and competitor aesthetics.</p>

        <form onSubmit={handleSearch} className="flex gap-2 mb-8">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="E.g., What are the trending colors for luxury watches in 2025?"
            className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 focus:border-blue-500 outline-none"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50"
          >
            {loading ? <i className="fa-solid fa-spinner fa-spin"></i> : 'Research'}
          </button>
        </form>

        {result && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-gray-900 border border-gray-800 p-8 rounded-xl shadow-lg">
              <h3 className="text-lg font-bold text-blue-400 mb-6 border-b border-gray-800 pb-2">Gemini Market Insights</h3>
              <div className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                {result.text}
              </div>
            </div>

            {result.sources && result.sources.length > 0 && (
              <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl">
                <h3 className="text-sm font-bold text-gray-500 uppercase mb-4">Sources</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {result.sources.map((chunk, idx) => {
                     const web = chunk.web;
                     if (!web) return null;
                     return (
                      <li key={idx} className="flex items-start gap-3 p-3 bg-gray-850 rounded hover:bg-gray-800 transition">
                        <i className="fa-solid fa-link text-blue-500 mt-1 flex-shrink-0"></i>
                        <a href={web.uri} target="_blank" rel="noreferrer" className="text-blue-300 hover:underline text-sm break-all line-clamp-2">
                          {web.title}
                        </a>
                      </li>
                     );
                  })}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TrendScout;