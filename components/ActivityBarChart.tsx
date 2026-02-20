
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { HistoricalPoint } from '../types';

interface ActivityBarChartProps {
  data: HistoricalPoint[];
  isTrendUp?: boolean;
}

const ActivityBarChart: React.FC<ActivityBarChartProps> = ({ data, isTrendUp = true }) => {
  const color = isTrendUp ? '#10b981' : '#f43f5e';

  const maxValueInData = data.length > 0 ? Math.max(...data.map(d => d.secondary)) : 0;
  const domainMax = Math.max(50, Math.ceil((maxValueInData + 5) / 10) * 10);
  const tickCount = (domainMax / 10) + 1;

  return (
    <div className="bg-[#09090b] rounded-xl p-6 md:p-8 h-[300px] md:h-full flex flex-col relative overflow-hidden group border border-[#18181b] shadow-2xl">
      <div className={`absolute -top-12 -right-12 w-32 h-32 ${isTrendUp ? 'bg-emerald-500/5' : 'bg-rose-500/5'} rounded-full blur-[40px] pointer-events-none`}></div>

      <div className="flex items-center justify-between mb-8 md:mb-10 relative z-10">
        <div>
          <h3 className="text-sm md:text-base font-black uppercase tracking-tight text-white">EXECUTIONS PEAK</h3>
          <p className="text-[10px] md:text-[12px] text-zinc-600 font-bold mt-1 uppercase tracking-tight">TOP EXECUTIONS OF THE WEEK</p>
        </div>
        <div className={`p-2 rounded-lg relative overflow-hidden ${isTrendUp ? 'bg-[#10b981]/10' : 'bg-rose-500/10'}`}>
           <svg className={`w-4 h-4 relative z-10 ${isTrendUp ? 'text-[#10b981]' : 'text-rose-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
           </svg>
        </div>
      </div>

      <div className="flex-1 w-full min-h-0 relative z-10 chart-container">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 0, right: 0, left: -30, bottom: 0 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#18181b" />
            <XAxis 
              dataKey="time" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#3f3f46', fontSize: 9, fontWeight: 700 }} 
              dy={12}
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
              cursor={{ fill: 'transparent' }}
              contentStyle={{ backgroundColor: '#000', border: '1px solid #18181b', borderRadius: '8px' }}
              itemStyle={{ color: '#fff', fontSize: '11px', fontWeight: 'bold' }}
              labelStyle={{ display: 'none' }}
              formatter={(value: any) => [value, 'Users']}
            />
            <Bar 
              dataKey="secondary" 
              fill={color}
              radius={[4, 4, 0, 0]}
              barSize={16}
              animationDuration={1000}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ActivityBarChart;
