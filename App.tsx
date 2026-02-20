
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { fetchStats } from './services/dataService';
import { StatsData, HistoricalPoint } from './types';
import MetricCard from './components/MetricCard';
import RevenueChart from './components/RevenueChart';
import ActivityBarChart from './components/ActivityBarChart';

const countryNameToCode: { [key: string]: string } = {
  'united states': 'us',
  'mexico': 'mx',
  'canada': 'ca',
  'brazil': 'br',
  'united kingdom': 'gb',
  'germany': 'de',
  'france': 'fr',
  'india': 'in',
  'china': 'cn',
  'japan': 'jp',
  'australia': 'au',
};
const getCountryCode = (name: string) => countryNameToCode[name.toLowerCase()] || null;

const App: React.FC = () => {
  const [data, setData] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activityHistory, setActivityHistory] = useState<HistoricalPoint[]>([]);
  
  const [trends, setTrends] = useState({
    online: { value: 0, isUp: true },
    today: { value: 0, isUp: true },
    newUsers: { value: 0, isUp: true },
    allTime: { value: 0, isUp: true },
  });

  const prevDataRef = useRef<StatsData | null>(null);
  const dataRef = useRef<StatsData | null>(null);
  dataRef.current = data;

  const updateHistory = useCallback((stats: StatsData) => {
    const historyStr = localStorage.getItem('activityHistory') || '{}';
    const historyData: Record<string, { value: number, secondary: number }> = JSON.parse(historyStr);

    const today = new Date();
    const todayKey = today.toISOString().split('T')[0];

    const todaysPreviousPeak = historyData[todayKey]?.secondary || 0;
    historyData[todayKey] = {
      value: stats.online,
      secondary: Math.max(todaysPreviousPeak, stats.online, stats.today),
    };

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);
    for (const key in historyData) {
      if (new Date(key) < sevenDaysAgo) {
        delete historyData[key];
      }
    }
    localStorage.setItem('activityHistory', JSON.stringify(historyData));

    const newChartData: HistoricalPoint[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      
      const dateKey = date.toISOString().split('T')[0];
      const dayLabel = date.toLocaleDateString('en-US', { weekday: 'short' });
      
      const dayData = historyData[dateKey];
      
      newChartData.push({
        time: dayLabel,
        value: (dateKey === todayKey) ? stats.online : (dayData?.value || 0),
        secondary: dayData?.secondary || 0,
      });
    }
    setActivityHistory(newChartData);
  }, []);

  const refreshData = useCallback(async () => {
    setIsSyncing(true);
    try {
      const stats = await fetchStats();
      
      if (stats.online === 0 && stats.allTime === 0 && stats.countries.length === 0) {
        if (!dataRef.current) {
          setError("Cluster connection timed out.");
        }
      } else {
        if (prevDataRef.current) {
          setTrends(prevTrends => {
            const calculateTrend = (key: keyof typeof trends, current: number, prev: number) => {
              if (current === prev) return prevTrends[key];
              if (prev === 0) return { value: current > 0 ? 100 : 0, isUp: current > 0 };
              const percentageChange = Math.abs(((current - prev) / prev) * 100);
              return {
                value: parseFloat(percentageChange.toFixed(1)),
                isUp: current >= prev,
              };
            };

            return {
              online: calculateTrend('online', stats.online, prevDataRef.current!.online),
              today: calculateTrend('today', stats.today, prevDataRef.current!.today),
              newUsers: calculateTrend('newUsers', stats.newUsers, prevDataRef.current!.newUsers),
              allTime: calculateTrend('allTime', stats.allTime, prevDataRef.current!.allTime),
            };
          });
        }
        
        setData(stats);
        updateHistory(stats);
        setError(null);
        prevDataRef.current = stats;
      }
    } catch (e) {
      setError("Synchronizer failure.");
    } finally {
      setLoading(false);
      setTimeout(() => setIsSyncing(false), 1000);
    }
  }, [updateHistory]);

  useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, 8000);
    return () => clearInterval(interval);
  }, [refreshData]);

  if (loading && !data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black">
        <div className="w-10 h-10 border-[3px] border-zinc-900 border-t-[#10b981] rounded-full animate-spin"></div>
      </div>
    );
  }

  const MIN_DISPLAY_COUNTRIES = 9;
  const realCountries = data?.countries || [];
  const ghostsNeeded = Math.max(0, MIN_DISPLAY_COUNTRIES - realCountries.length);

  return (
    <div className="min-h-screen p-4 md:p-12 md:pb-2 lg:px-24 bg-black text-white selection:bg-[#10b981]/30 relative overflow-hidden">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 relative z-10">
        <div className="flex items-center gap-4 md:gap-6">
          <div className="w-16 h-16 bg-zinc-900/50 border border-zinc-800 rounded-2xl flex items-center justify-center shadow-2xl group hover:scale-110 hover:border-[#10b981]/50 transition-all duration-300 flex-shrink-0">
             <svg className="w-10 h-10 text-[#10b981]" viewBox="0 0 24 24" fill="currentColor">
               <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71L12 2z" />
             </svg>
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white uppercase">Apex <span className="text-[#10b981]">Stats</span></h1>
              <div className="px-3 py-1 bg-zinc-900/50 border border-[#18181b] rounded-lg flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${isSyncing ? 'bg-[#10b981] animate-pulse' : 'bg-[#10b981]'}`}></span>
                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                  {isSyncing ? 'Syncing' : 'Live'}
                </span>
              </div>
            </div>
            <p className="text-[10px] text-[#10b981]/80 uppercase font-black mt-1 tracking-widest">discord.gg/8tNNZUEDHP</p>
          </div>
        </div>
        
        <div className="flex items-center justify-between md:justify-end gap-4 border-t border-[#18181b] pt-4 md:border-none md:pt-0">
           <div className="text-left md:text-right min-w-[120px]">
              <p className="text-[9px] text-zinc-600 uppercase font-black mb-1">Last Update</p>
              <p className="text-sm font-mono font-medium text-zinc-300">
                {data ? new Date(data.lastUpdated).toLocaleTimeString([], { hour12: false }) : '--:--:--'}
              </p>
           </div>
           <button 
             onClick={refreshData} 
             className="p-3 bg-[#09090b] border border-[#18181b] rounded-xl hover:bg-zinc-900 transition-all duration-300 shadow-lg group"
           >
             <svg className={`w-5 h-5 text-zinc-500 group-hover:text-white transition-colors ${isSyncing ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
             </svg>
           </button>
        </div>
      </header>

      <main className="space-y-6 md:space-y-8 relative z-10">
        {data && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
              <MetricCard 
                label="Active Now" 
                value={data.online} 
                trend={trends.online} 
                icon={<svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>} 
              />
              <MetricCard 
                label="Daily Users" 
                value={data.today} 
                trend={trends.today} 
                icon={<svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v12a2 2 0 002 2z" /></svg>} 
              />
              <MetricCard 
                label="New Users" 
                value={data.newUsers} 
                trend={trends.newUsers} 
                icon={<svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>} 
              />
              <MetricCard 
                label="Total Users" 
                value={data.allTime} 
                trend={trends.allTime} 
                icon={<svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>} 
              />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-8">
              <div className="xl:col-span-2">
                <RevenueChart 
                  data={activityHistory} 
                  title="ACTIVE GRAPH" 
                  subtitle="USING NOW THE SCRIPT" 
                  trend={trends.online}
                />
              </div>
              <div className="xl:col-span-1">
                 <ActivityBarChart data={activityHistory} isTrendUp={trends.online.isUp} />
              </div>
            </div>

            <section className="bg-[#09090b] rounded-xl p-6 md:p-12 border border-[#18181b] relative overflow-hidden group shadow-2xl">
                <div className="mb-8 relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h2 className="text-sm md:text-base font-black uppercase tracking-tight text-white">TOP COUNTRIES</h2>
                        <p className="text-[10px] md:text-[12px] text-zinc-600 font-bold mt-1 uppercase tracking-tight">COUNTRIES MOST USE THE SCRIPT</p>
                    </div>
                    <div className="px-4 py-2 bg-[#10b981]/10 border border-[#10b981]/20 rounded-xl w-fit">
                       <span className="text-[10px] md:text-[11px] font-black text-[#10b981] uppercase tracking-widest">Countries: {data.countries.length}</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 md:gap-6 relative z-10">
                    {realCountries.map((c, i) => {
                        const code = getCountryCode(c.name);
                        return (
                            <div key={`real-${i}`} className="group bg-zinc-950/80 p-5 md:p-7 rounded-2xl border border-[#18181b] hover:bg-zinc-900/40 transition-all duration-300 flex flex-col justify-center gap-6 h-40">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4 md:gap-5">
                                        <div className="w-14 h-9 bg-zinc-900 rounded-lg border border-zinc-800/50 overflow-hidden shadow-2xl flex-shrink-0">
                                            {code ? (
                                                <img src={`https://flagcdn.com/w160/${code}.png`} alt={c.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full bg-zinc-800"></div>
                                            )}
                                        </div>
                                        <div className="flex flex-col justify-center">
                                          <span className="block text-base font-black uppercase tracking-tight text-zinc-100 group-hover:text-white transition-colors">{c.name}</span>
                                          <span className="text-[11px] font-black text-[#10b981] uppercase tracking-widest mt-0.5">{c.percentage}%</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                      <span className="text-3xl font-black text-[#10b981] group-hover:text-white transition-colors">{c.count}</span>
                                      <span className="block text-[9px] font-black text-zinc-600 uppercase tracking-tighter mt-1">USERS</span>
                                    </div>
                                </div>
                                <div className="relative w-full">
                                    <div className="overflow-hidden h-1.5 text-xs flex rounded-full bg-zinc-900">
                                        <div 
                                          style={{ width: `${c.percentage}%` }}
                                          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-[#10b981] transition-all duration-1000 ease-in-out"
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {[...Array(ghostsNeeded)].map((_, i) => (
                        <div key={`ghost-${i}`} className="group bg-zinc-950/20 p-5 md:p-7 rounded-2xl border border-zinc-900/50 flex flex-col justify-center gap-6 h-40 opacity-40 grayscale">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-5">
                                    <div className="w-14 h-9 bg-zinc-900/50 rounded-lg border border-zinc-800/20 overflow-hidden flex items-center justify-center">
                                       <div className="w-4 h-4 rounded-full border border-zinc-800 animate-pulse"></div>
                                    </div>
                                    <div>
                                      <span className="block text-base font-bold uppercase tracking-tight text-zinc-800">-------</span>
                                      <span className="text-[11px] font-bold text-zinc-900 uppercase tracking-widest">-- %</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                  <span className="text-3xl font-black text-zinc-900">--</span>
                                  <span className="block text-[9px] font-bold text-zinc-900 uppercase">PENDING</span>
                                </div>
                            </div>
                            <div className="relative w-full">
                                <div className="overflow-hidden h-1.5 text-xs flex rounded-full bg-zinc-950">
                                    <div className="w-0 bg-zinc-900"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
          </>
        )}
      </main>
      <div className="h-4"></div>
    </div>
  );
};

export default App;
