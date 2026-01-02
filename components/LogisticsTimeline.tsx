
import React from 'react';
import { ShipmentStatus } from '../types';

interface LogisticsTimelineProps {
  shipments: ShipmentStatus[];
}

const LogisticsTimeline: React.FC<LogisticsTimelineProps> = ({ shipments }) => {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#0a0a0a] border border-gray-800 p-6 rounded-xl">
          <p className="text-gray-500 text-xs font-bold uppercase mb-1">Active Deliveries</p>
          <p className="text-2xl font-bold neon-teal">12</p>
        </div>
        <div className="bg-[#0a0a0a] border border-gray-800 p-6 rounded-xl">
          <p className="text-gray-500 text-xs font-bold uppercase mb-1">Average Transit</p>
          <p className="text-2xl font-bold text-white">4.2 hrs</p>
        </div>
        <div className="bg-[#0a0a0a] border border-gray-800 p-6 rounded-xl">
          <p className="text-gray-500 text-xs font-bold uppercase mb-1">Success Rate</p>
          <p className="text-2xl font-bold text-green-500">99.8%</p>
        </div>
      </div>

      <div className="relative">
        <div className="absolute left-[19px] top-0 bottom-0 w-0.5 bg-gray-800" />
        <div className="space-y-12">
          {shipments.map((s, idx) => (
            <div key={s.id} className="relative flex items-start gap-8 pl-12 group">
              <div className={`absolute left-0 w-10 h-10 rounded-full border-4 border-[#050505] z-10 flex items-center justify-center text-sm ${
                s.status === 'delivered' ? 'bg-green-500' :
                s.status === 'out-for-delivery' ? 'bg-teal-500 animate-pulse' :
                s.status === 'shipped' ? 'bg-blue-500' : 'bg-yellow-500'
              }`}>
                {s.status === 'delivered' ? '✓' : idx + 1}
              </div>
              <div className="flex-1 bg-[#0a0a0a] border border-gray-800 p-5 rounded-xl group-hover:border-teal-900 transition-colors">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-3 gap-2">
                  <div>
                    <span className="text-xs font-mono text-teal-500 mb-1 block">TRACKING ID: {s.id}</span>
                    <h4 className="text-lg font-bold text-white">Destination: {s.destination}</h4>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                    s.status === 'delivered' ? 'bg-green-500/10 text-green-500' :
                    s.status === 'out-for-delivery' ? 'bg-teal-500/10 text-teal-500' :
                    s.status === 'shipped' ? 'bg-blue-500/10 text-blue-500' : 'bg-yellow-500/10 text-yellow-500'
                  }`}>
                    {s.status.replace(/-/g, ' ')}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                  <div>
                    <p className="text-gray-500 mb-1">CURRENT LOCATION</p>
                    <p className="text-gray-300">{s.location}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-500 mb-1">LAST UPDATE</p>
                    <p className="text-gray-300">{s.timestamp}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LogisticsTimeline;
