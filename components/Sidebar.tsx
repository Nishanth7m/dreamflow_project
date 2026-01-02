
import React from 'react';
import { AGENTS } from '../constants';

const Sidebar: React.FC = () => {
  return (
    <aside className="w-20 md:w-64 bg-[#0a0a0a] border-r border-gray-800 flex flex-col h-screen sticky top-0">
      <div className="p-6 border-b border-gray-800 flex items-center justify-center md:justify-start gap-3">
        <div className="w-8 h-8 rounded bg-teal-500 flex items-center justify-center font-bold text-black">O</div>
        <h1 className="hidden md:block text-xl font-bold tracking-tight neon-teal">OpsFlow</h1>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <div>
          <h2 className="hidden md:block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 px-2">Live Agents</h2>
          <div className="space-y-4">
            {AGENTS.map((agent) => (
              <div key={agent.name} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-900 transition-colors group">
                <div className="relative">
                  <span className="text-2xl">{agent.icon}</span>
                  <span className={`absolute -bottom-1 -right-1 w-3 h-3 border-2 border-[#0a0a0a] rounded-full ${
                    agent.status === 'active' ? 'bg-green-500' : 
                    agent.status === 'busy' ? 'bg-yellow-500' : 'bg-gray-500'
                  }`} />
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-300 group-hover:text-white">{agent.name}</p>
                  <p className="text-[10px] text-gray-500 capitalize">{agent.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-gray-800">
        <div className="hidden md:block bg-gray-900/50 p-3 rounded-lg text-xs text-gray-400">
          <p>System Status: <span className="text-green-500">Normal</span></p>
          <p>Core Intelligence: <span className="text-teal-500">V3.1 Online</span></p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
