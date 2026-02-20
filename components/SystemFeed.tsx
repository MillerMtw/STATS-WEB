
import React from 'react';

const SystemFeed: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12 mb-8">
      {/* Latency Card */}
      <div className="bg-[#09090b] border border-[#18181b] p-5 rounded-xl flex items-center justify-between group hover:border-[#10b981]/30 transition-colors">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/5 border border-emerald-500/10 flex items-center justify-center">
            <svg className="w-4 h-4 text-[#10b981]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest">Network Latency</p>
            <p className="text-sm font-mono font-bold text-zinc-300">24.2 <span className="text-[10px] text-zinc-600 font-normal">ms</span></p>
          </div>
        </div>
        <div className="flex gap-1">
          <div className="w-1 h-3 bg-[#10b981] rounded-full"></div>
          <div className="w-1 h-2 bg-[#10b981]/40 rounded-full mt-1"></div>
          <div className="w-1 h-1 bg-[#10b981]/20 rounded-full mt-2"></div>
        </div>
      </div>

      {/* API Status */}
      <div className="bg-[#09090b] border border-[#18181b] p-5 rounded-xl flex items-center gap-4 group hover:border-[#10b981]/30 transition-colors">
        <div className="w-8 h-8 rounded-lg bg-emerald-500/5 border border-emerald-500/10 flex items-center justify-center">
          <svg className="w-4 h-4 text-[#10b981]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
          </svg>
        </div>
        <div>
          <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest">API Endpoint</p>
          <div className="flex items-center gap-2">
             <span className="text-sm font-mono font-bold text-zinc-300 uppercase">Operational</span>
             <span className="w-1.5 h-1.5 bg-[#10b981] rounded-full animate-pulse"></span>
          </div>
        </div>
      </div>

      {/* Database Health */}
      <div className="bg-[#09090b] border border-[#18181b] p-5 rounded-xl flex items-center gap-4 group hover:border-[#10b981]/30 transition-colors">
        <div className="w-8 h-8 rounded-lg bg-emerald-500/5 border border-emerald-500/10 flex items-center justify-center">
          <svg className="w-4 h-4 text-[#10b981]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
          </svg>
        </div>
        <div>
          <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest">Database Node</p>
          <p className="text-sm font-mono font-bold text-zinc-300 uppercase">Synchronized</p>
        </div>
      </div>

      {/* Traffic Load */}
      <div className="bg-[#09090b] border border-[#18181b] p-5 rounded-xl flex items-center gap-4 group hover:border-[#10b981]/30 transition-colors">
        <div className="w-8 h-8 rounded-lg bg-emerald-500/5 border border-emerald-500/10 flex items-center justify-center">
          <svg className="w-4 h-4 text-[#10b981]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <div>
          <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest">System Load</p>
          <p className="text-sm font-mono font-bold text-zinc-300 uppercase">Optimal (12%)</p>
        </div>
      </div>
    </div>
  );
};

export default SystemFeed;
