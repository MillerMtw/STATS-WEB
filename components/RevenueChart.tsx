
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { HistoricalPoint } from '../types';

interface RevenueChartProps {
  data: HistoricalPoint[];
  title?: string;
  subtitle?: string;
  trend?: {
    value: number;
    isUp: boolean;
  };
}

const RevenueChart: React.FC<RevenueChartProps> = ({ data, title, subtitle, trend }) => {
  const isUp = trend ? trend.isUp : true;
  const color = isUp ? '#10b981' : '#f43f5e'; 
  const gradientId = "colorValueDynamic";

  const maxValueInData = data.length > 0 ? Math.max(...data.map(d => d.value)) : 0;
  const domainMax = Math.max(50, Math.ceil((maxValueInData + 5) / 10) * 10);
  const tickCount = (domainMax / 10) + 1;

  return (
    <div className="bg-[#09090b] rounded-xl p-6 md:p-8 h-[320px] md:h-[400px] flex flex-col relative overflow-hidden group border border-[#18181b] shadow-2xl">
      <div className={`absolute -top-12 -right-12 w-32 h-32 ${isUp ? 'bg-emerald-500/5' : 'bg-rose-500/5'} rounded-full blur-[40px] pointer-events-none`}></div>
      
      <div className="flex justify-between items-start mb-4 md:mb-6 relative z-10">
        <div>
          <h3 className="text-sm md:text-base font-black uppercase tracking-tight text-white">{title || 'ACTIVE GRAPH'}</h3>
          <p className="text-[10px] md:text-[12px] text-zinc-600 font-bold mt-1 uppercase tracking-tight">{subtitle || 'USING NOW THE SCRIPT'}</p>
        </div>
        
        <div className={`flex items-center gap-2 px-3 py-1 rounded-lg border ${isUp ? 'border-emerald-500/10 bg-emerald-500/5' : 'border-rose-500/10 bg-rose-500/5'}`}>
           <span className={`w-1.5 h-1.5 md:w-2 h-2 rounded-full ${isUp ? 'bg-[#10b981]' : 'bg-rose-500'} ${isUp ? 'animate-pulse' : ''}`}></span>
           <span className={`text-[9px] md:text-[10px] font-black uppercase tracking-widest ${isUp ? 'text-[#10b981]' : 'text-rose-500'}`}>
             Live
           </span>
        </div>
      </div>

      <div className="flex-1 w-full min-h-0 relative z-10 mt-2 md:mt-4 chart-container">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.15}/>
                <stop offset="100%" stopColor={color} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#18181b" />
            <XAxis 
              dataKey="time" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#3f3f46', fontSize: 9, fontWeight: 700 }} 
              dy={15}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#3f3f46', fontSize: 10, fontWeight: 600 }}
              domain={[0, domainMax]}
              tickCount={tickCount}
              allowDataOverflow={false}
              allowDecimals={false}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#000', border: '1px solid #18181b', borderRadius: '8px' }}
              itemStyle={{ color: '#fff', fontSize: '11px', fontWeight: 'bold' }}
              labelStyle={{ color: '#71717a', fontSize: '9px', textTransform: 'uppercase' }}
              cursor={{ stroke: '#27272a', strokeWidth: 1 }}
            />
            <Area 
              type="monotone" 
              dataKey="value"
              name="Active"
              stroke={color} 
              strokeWidth={3}
              fillOpacity={1} 
              fill={`url(#${gradientId})`} 
              activeDot={{ r: 4, strokeWidth: 0, fill: color }}
              animationDuration={1000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueChart;
