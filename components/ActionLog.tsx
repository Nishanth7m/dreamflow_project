
import React from 'react';
import { ActionLogEntry } from '../types';

interface ActionLogProps {
  logs: ActionLogEntry[];
}

const ActionLog: React.FC<ActionLogProps> = ({ logs }) => {
  return (
    <div className="bg-[#0a0a0a] border-t border-gray-800 p-4 h-48 overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Action Timeline</h3>
          <span className="text-[10px] text-teal-500 font-mono">LIVE FEED ACTIVE</span>
        </div>
        <div className="space-y-2">
          {logs.length === 0 ? (
            <div className="text-gray-600 text-sm font-mono py-4 text-center">No actions recorded in this session.</div>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="flex items-start gap-4 text-xs font-mono border-l-2 border-teal-900 pl-3 py-1 hover:bg-white/5 transition-colors">
                <span className="text-gray-500 shrink-0">{log.timestamp}</span>
                <span className={`uppercase font-bold shrink-0 ${
                  log.type === 'inventory' ? 'text-blue-400' :
                  log.type === 'invoice' ? 'text-purple-400' :
                  log.type === 'marketing' ? 'text-orange-400' : 'text-green-400'
                }`}>[{log.type}]</span>
                <span className="text-gray-300">{log.message}</span>
                <span className={`ml-auto px-2 py-0.5 rounded ${
                  log.status === 'completed' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'
                }`}>
                  {log.status}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ActionLog;
