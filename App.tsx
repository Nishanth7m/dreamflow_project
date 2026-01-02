
import React, { useState, useCallback } from 'react';
import { ViewType, ActionLogEntry, InventoryItem } from './types';
import { INITIAL_INVENTORY, INITIAL_SHIPMENTS } from './constants';
import Sidebar from './components/Sidebar';
import ActionLog from './components/ActionLog';
import InventoryTable from './components/InventoryTable';
import CameraCapture from './components/CameraCapture';
import MarketingSuite from './components/MarketingSuite';
import LogisticsTimeline from './components/LogisticsTimeline';
import { geminiService } from './services/geminiService';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [logs, setLogs] = useState<ActionLogEntry[]>([]);
  const [inventory] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const isAdvanced = geminiService.hasAiKey();

  const addLog = useCallback((type: ActionLogEntry['type'], message: string) => {
    const newLog: ActionLogEntry = {
      id: Math.random().toString(36).substring(7),
      type,
      message,
      timestamp: new Date().toLocaleTimeString([], { hour12: false }),
      status: 'completed'
    };
    setLogs(prev => [newLog, ...prev]);
  }, []);

  const renderQuickActions = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {[
        { id: 'inventory', icon: '📦', title: 'Update Inventory', desc: 'Monitor stock levels and run health checks.', color: 'blue' },
        { id: 'invoice', icon: '📄', title: 'Scan Documents', desc: 'Extract data from invoices using computer vision.', color: 'purple' },
        { id: 'marketing', icon: '📣', title: 'Marketing Suite', desc: 'Generate campaign copy for social and email.', color: 'orange' },
        { id: 'logistics', icon: '🚚', title: 'Logistics Fleet', desc: 'Track shipments and delivery status in real-time.', color: 'green' }
      ].map((action) => (
        <div 
          key={action.id}
          onClick={() => setCurrentView(action.id as ViewType)}
          className="bg-[#0a0a0a] border border-gray-800 rounded-2xl p-8 cursor-pointer neon-bg-hover transition-all group relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
             <span className="text-6xl">{action.icon}</span>
          </div>
          <div className={`w-12 h-12 rounded-xl bg-${action.color}-500/10 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform relative z-10`}>
            {action.icon}
          </div>
          <h3 className="text-xl font-bold mb-2 relative z-10">{action.title}</h3>
          <p className="text-gray-500 text-sm relative z-10">{action.desc}</p>
        </div>
      ))}
    </div>
  );

  const renderContent = () => {
    switch (currentView) {
      case 'inventory':
        return <InventoryTable items={inventory} onActionComplete={(m) => addLog('inventory', m)} />;
      case 'invoice':
        return <CameraCapture onActionComplete={(m) => addLog('invoice', m)} />;
      case 'marketing':
        return <MarketingSuite onActionComplete={(m) => addLog('marketing', m)} />;
      case 'logistics':
        return <LogisticsTimeline shipments={INITIAL_SHIPMENTS} />;
      default:
        return renderQuickActions();
    }
  };

  return (
    <div className="flex min-h-screen bg-[#050505] overflow-hidden text-slate-200">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-gray-800 flex items-center justify-between px-8 bg-[#0a0a0a]/50 backdrop-blur-md sticky top-0 z-50">
          <div className="flex items-center gap-4">
            {currentView !== 'dashboard' && (
              <button 
                onClick={() => setCurrentView('dashboard')}
                className="text-teal-500 hover:text-teal-400 text-xs font-black uppercase tracking-tighter flex items-center gap-2 px-3 py-1.5 border border-teal-500/20 rounded-md bg-teal-500/5"
              >
                ← Return to Hub
              </button>
            )}
            <h2 className="text-sm font-mono text-gray-500 uppercase tracking-[0.2em] font-bold">
              {currentView === 'dashboard' ? 'OpsFlow System Overview' : `Module: ${currentView.toUpperCase()}`}
            </h2>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden md:flex flex-col items-end">
              <div className="flex items-center gap-2">
                 <span className={`w-2 h-2 rounded-full ${isAdvanced ? 'bg-teal-500 shadow-[0_0_10px_#14b8a6]' : 'bg-blue-500 shadow-[0_0_10px_#3b82f6]'}`} />
                 <p className="text-[10px] text-gray-500 font-mono uppercase font-bold">
                   System: {isAdvanced ? 'Advanced (AI)' : 'Standard (Local)'}
                 </p>
              </div>
              <p className="text-[11px] font-bold text-gray-400">SESSION_LIVE_STABLE</p>
            </div>
            <div className="w-9 h-9 rounded-lg bg-gray-900 border border-gray-800 flex items-center justify-center text-teal-500 shadow-inner">
               <span className="text-lg font-black italic">O</span>
            </div>
          </div>
        </header>

        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto h-full">
            {renderContent()}
          </div>
        </main>

        <ActionLog logs={logs} />
        
        <footer className="bg-[#050505] border-t border-gray-900 py-4 px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] font-mono text-gray-600 tracking-[0.2em] uppercase">
            &copy; {new Date().getFullYear()} OpsFlow Core Intelligence | Secured Deployment
          </p>
          <div className="flex items-center gap-6 text-[9px] font-mono text-gray-700 uppercase tracking-widest font-bold">
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Latency: Low</span>
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Privacy: Enabled</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default App;
