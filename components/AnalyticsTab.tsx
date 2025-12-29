
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { LEADERBOARD_DATA } from '../constants';

const data = [
  { name: 'Mon', spend: 4000 },
  { name: 'Tue', spend: 12000 },
  { name: 'Wed', spend: 8000 },
  { name: 'Thu', spend: 15000 },
  { name: 'Fri', spend: 5000 },
  { name: 'Sat', spend: 25000 },
  { name: 'Sun', spend: 18000 },
];

export const AnalyticsTab: React.FC = () => {
  return (
    <div className="px-6 pt-6 pb-32">
      <h2 className="text-3xl font-black tracking-tighter mb-8">Insights</h2>
      
      <div className="bg-zinc-900/50 rounded-[2rem] p-6 mb-6 border border-white/5">
        <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-6">Spending Trend (₹)</h3>
        <div className="h-[220px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#222" />
              <XAxis dataKey="name" stroke="#444" fontSize={10} fontWeight="bold" tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '16px', fontSize: '12px' }}
                itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                cursor={{ stroke: '#3b82f6', strokeWidth: 2 }}
              />
              <Area type="monotone" dataKey="spend" stroke="#3b82f6" fillOpacity={1} fill="url(#colorSpend)" strokeWidth={4} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-3xl p-5">
          <p className="text-emerald-500 text-[10px] font-black uppercase tracking-widest mb-1">Trees Saved</p>
          <div className="flex items-end gap-1">
            <p className="text-3xl font-black">28.4</p>
            <p className="text-xs text-emerald-500/60 font-bold pb-1">units</p>
          </div>
        </div>
        <div className="bg-blue-950/20 border border-blue-500/20 rounded-3xl p-5">
          <p className="text-blue-500 text-[10px] font-black uppercase tracking-widest mb-1">Cashback</p>
          <div className="flex items-end gap-1">
            <p className="text-3xl font-black">₹450</p>
            <p className="text-xs text-blue-500/60 font-bold pb-1">earned</p>
          </div>
        </div>
      </div>

      <div className="bg-zinc-900/50 rounded-[2.5rem] p-6 border border-white/5 shadow-2xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="text-xl font-black">Top Savers</h3>
            <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest">Delhi NCR Region</p>
          </div>
          <span className="text-[10px] text-blue-400 font-black bg-blue-400/10 px-4 py-2 rounded-full uppercase tracking-widest border border-blue-400/20">Rewards 🎁</span>
        </div>
        <div className="space-y-3">
          {LEADERBOARD_DATA.map((entry) => (
            <div key={entry.rank} className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${entry.name === 'You' ? 'bg-blue-600 shadow-xl shadow-blue-600/20 border-none' : 'bg-white/5 border border-white/5'}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm ${entry.rank <= 3 ? (entry.name === 'You' ? 'bg-white/20 text-white' : 'bg-amber-500/20 text-amber-500') : 'text-white/40'}`}>
                {entry.rank}
              </div>
              <div className="flex-1">
                <p className="font-bold text-sm leading-none mb-1">{entry.name}</p>
                <p className={`text-[9px] font-black uppercase tracking-tighter ${entry.name === 'You' ? 'text-white/60' : 'text-white/20'}`}>{entry.birdyId}</p>
              </div>
              <div className="text-right">
                <p className="font-black text-lg leading-none mb-0.5">{entry.treesSaved}</p>
                <p className={`text-[8px] uppercase font-black ${entry.name === 'You' ? 'text-white/60' : 'text-emerald-500'}`}>Trees</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
