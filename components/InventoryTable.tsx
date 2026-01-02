
import React, { useState } from 'react';
import { InventoryItem } from '../types';
import { geminiService } from '../services/geminiService';

interface InventoryTableProps {
  items: InventoryItem[];
  onActionComplete: (msg: string) => void;
}

const InventoryTable: React.FC<InventoryTableProps> = ({ items, onActionComplete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      const result = await geminiService.suggestInventoryActions(items);
      setAnalysisResult(result);
      onActionComplete("AI Inventory Analysis completed.");
    } catch (e) {
      onActionComplete("AI Inventory Analysis failed.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="relative w-full md:w-96">
          <input 
            type="text" 
            placeholder="Search inventory..." 
            className="w-full bg-[#0a0a0a] border border-gray-800 rounded-lg px-4 py-2 text-sm focus:border-teal-500 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button 
          onClick={handleAnalyze}
          disabled={isAnalyzing}
          className="bg-teal-600 hover:bg-teal-500 disabled:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
        >
          {isAnalyzing ? "Analyzing..." : "AI Health Check"}
        </button>
      </div>

      {analysisResult && (
        <div className="bg-teal-900/10 border border-teal-900/30 p-4 rounded-lg text-sm text-teal-200 font-mono">
          <div className="flex justify-between mb-2">
            <span className="font-bold text-teal-500">Core Intelligence Analysis:</span>
            <button onClick={() => setAnalysisResult(null)} className="text-gray-500 hover:text-white">✕</button>
          </div>
          <p>{analysisResult}</p>
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border border-gray-800">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#0a0a0a] text-gray-500 uppercase text-[10px] tracking-widest font-bold">
            <tr>
              <th className="px-6 py-4">Item Name</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">In Stock</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {filteredItems.map(item => (
              <tr key={item.id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-200">{item.name}</td>
                <td className="px-6 py-4 text-gray-400">{item.category}</td>
                <td className="px-6 py-4">
                  <span className={item.stock < item.minThreshold ? 'text-red-400' : 'text-gray-300'}>
                    {item.stock}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-300">${item.price.toFixed(2)}</td>
                <td className="px-6 py-4">
                  {item.stock < item.minThreshold ? (
                    <span className="px-2 py-1 rounded bg-red-900/20 text-red-400 text-xs border border-red-900/30">Low Stock</span>
                  ) : (
                    <span className="px-2 py-1 rounded bg-green-900/20 text-green-400 text-xs border border-green-900/30">Healthy</span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-teal-500 hover:text-teal-400 text-xs font-bold uppercase tracking-widest">Update</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryTable;
