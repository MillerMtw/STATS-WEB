import React from 'react';

interface MetricCardProps {
  label: string;
  value: string | number;
  trend?: {
    value: number;
    isUp: boolean;
  };
  icon: React.ReactNode;
}

const MetricCard: React.FC<MetricCardProps> = ({ label, value, trend, icon }) => {
  return (
    <div className="group bg-[#09090b] rounded-xl p-6 md:p-8 hover:bg-[#0c0c0e] border border-[#18181b] transition-all duration-500 relative overflow-hidden shadow-lg">
      {/* Subtle background glow */}
      <div className={`absolute -right-4 -top-4 w-32 h-32 rounded-full blur-3xl transition-all duration-700 ${trend?.isUp ? 'bg-emerald-500/5' : 'bg-rose-500/5'}`}></div>
      
      <div className="flex justify-between items-start mb-8 md:mb-10 relative z-10">
        <div className="flex items-center gap-3 md:gap-4 text-zinc-500 group-hover:text-zinc-300 transition-colors">
          <span className="w-5 h-5 opacity-70 flex-shrink-0">{icon}</span>
          <span className="text-[10px] md:text-xs font-bold tracking-widest uppercase opacity-80">{label}</span>
        </div>
        {trend && (
          <div className={`flex items-center px-2 py-0.5 rounded-md text-[10px] font-black ${trend.isUp ? 'text-[#10b981] bg-[#10b981]/10' : 'text-rose-500 bg-rose-500/10'}`}>
            <span className="mr-1">{trend.isUp ? '↑' : '↓'}</span>
            {trend.value}%
          </div>
        )}
      </div>
      
      <div className="flex items-center justify-between relative z-10">
        <div className="text-4xl md:text-5xl font-bold tracking-tight text-white transition-transform duration-500">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </div>
        
        {/* Sparkline SVG */}
        <div className="w-20 md:w-24 h-10 md:h-12 opacity-80">
           <svg viewBox="0 0 100 40" className="w-full h-full" preserveAspectRatio="none">
              <path
                d={trend?.isUp 
                  ? "M 0 30 C 20 30, 40 10, 60 25 S 80 5, 100 15" 
                  : "M 0 10 C 20 10, 40 30, 60 15 S 80 35, 100 25"
                }
                fill="none"
                stroke={trend?.isUp ? "#10b981" : "#f43f5e"}
                strokeWidth="3"
                strokeLinecap="round"
              />
           </svg>
        </div>
      </div>
    </div>
  );
};

export default MetricCard;