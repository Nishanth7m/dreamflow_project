
import React, { useState } from 'react';
import { geminiService } from '../services/geminiService';
import { MarketingContent } from '../types';

interface MarketingSuiteProps {
  onActionComplete: (msg: string) => void;
}

const MarketingSuite: React.FC<MarketingSuiteProps> = ({ onActionComplete }) => {
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [content, setContent] = useState<MarketingContent | null>(null);

  const handleGenerate = async () => {
    if (!input.trim()) return;
    setIsGenerating(true);
    try {
      const res = await geminiService.generateMarketing(input);
      setContent(res);
      onActionComplete(`Marketing campaign generated for: ${input.slice(0, 20)}...`);
    } catch (e) {
      onActionComplete("Marketing generation failed.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
      {/* Input Side */}
      <div className="bg-[#0a0a0a] border border-gray-800 p-6 rounded-xl space-y-6">
        <div>
          <h3 className="text-lg font-bold text-white mb-2">Campaign Brief</h3>
          <p className="text-sm text-gray-500 mb-4">Describe the product or announcement you want to promote.</p>
          <textarea 
            className="w-full h-48 bg-[#050505] border border-gray-800 rounded-lg p-4 text-sm text-gray-200 focus:border-teal-500 outline-none resize-none"
            placeholder="e.g. We are launching a new organic blueberry matcha latte this weekend. 20% off for the first 50 customers..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <input type="checkbox" checked readOnly className="accent-teal-500" />
            <span className="text-xs text-gray-400">Include Instagram Post</span>
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" checked readOnly className="accent-teal-500" />
            <span className="text-xs text-gray-400">Include Professional Email</span>
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" checked readOnly className="accent-teal-500" />
            <span className="text-xs text-gray-400">Include Twitter Update</span>
          </div>
        </div>
        <button 
          onClick={handleGenerate}
          disabled={isGenerating || !input.trim()}
          className="w-full bg-teal-600 hover:bg-teal-500 disabled:bg-gray-700 text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
        >
          {isGenerating ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Intelligence at work...
            </>
          ) : "Generate Assets"}
        </button>
      </div>

      {/* Preview Side */}
      <div className="bg-[#0a0a0a] border border-gray-800 rounded-xl overflow-y-auto max-h-[600px] p-6 space-y-8">
        {!content && !isGenerating ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-12 space-y-4">
            <div className="text-4xl">✨</div>
            <p className="text-gray-600 text-sm font-mono">Input your brief on the left to see AI-generated marketing magic.</p>
          </div>
        ) : isGenerating ? (
          <div className="space-y-8 animate-pulse">
            {[1, 2, 3].map(i => (
              <div key={i} className="space-y-3">
                <div className="h-4 w-24 bg-gray-800 rounded"></div>
                <div className="h-32 w-full bg-gray-900 rounded"></div>
              </div>
            ))}
          </div>
        ) : content && (
          <>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-pink-500 uppercase tracking-widest">Instagram Feed</span>
                <button className="text-[10px] text-teal-500 hover:underline">Copy Content</button>
              </div>
              <div className="bg-[#050505] border border-gray-800 p-4 rounded-lg text-sm text-gray-300 font-mono leading-relaxed whitespace-pre-wrap italic">
                {content.instagram}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Direct Email</span>
                <button className="text-[10px] text-teal-500 hover:underline">Copy HTML</button>
              </div>
              <div className="bg-[#050505] border border-gray-800 p-4 rounded-lg text-sm text-gray-300 font-mono leading-relaxed whitespace-pre-wrap">
                {content.email}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Twitter / X</span>
                <button className="text-[10px] text-teal-500 hover:underline">Tweet Now</button>
              </div>
              <div className="bg-[#050505] border border-gray-800 p-4 rounded-lg text-sm text-gray-300 font-mono leading-relaxed">
                {content.twitter}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MarketingSuite;
