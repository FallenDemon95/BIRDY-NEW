
import React from 'react';
import { User } from '../types';

export const ProfileTab: React.FC<{ user: User }> = ({ user }) => {
  return (
    <div className="px-6 pt-10 pb-40">
      <div className="flex flex-col items-center mb-12">
        <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-blue-900 rounded-[2.5rem] flex items-center justify-center text-5xl font-black shadow-2xl mb-6 ring-4 ring-white/5">
          {user.name.charAt(0)}
        </div>
        <h2 className="text-4xl font-black tracking-tighter mb-1">{user.name}</h2>
        <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.3em]">{user.birdyId}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-10">
        <div className="bg-zinc-900/50 p-6 rounded-[2rem] border border-white/5 text-center">
          <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-2">Points</p>
          <p className="text-2xl font-black text-blue-400">{user.points.toLocaleString()}</p>
        </div>
        <div className="bg-zinc-900/50 p-6 rounded-[2rem] border border-white/5 text-center">
          <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-2">Trees Saved</p>
          <p className="text-2xl font-black text-emerald-400">{user.treesSaved}</p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-[11px] font-black text-white/20 uppercase tracking-[0.4em] px-2 mb-4">Account Details</h3>
        
        <div className="bg-zinc-900/40 rounded-3xl p-6 border border-white/5 space-y-6">
          <div className="flex justify-between items-center">
            <span className="text-sm font-bold text-white/40">Phone</span>
            <span className="text-sm font-black">{user.phone}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-bold text-white/40">Email</span>
            <span className="text-sm font-black">{user.email}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-bold text-white/40">Country</span>
            <span className="text-sm font-black">India 🇮🇳</span>
          </div>
        </div>

        <button className="w-full bg-white/5 hover:bg-white/10 py-5 rounded-3xl font-black text-xs uppercase tracking-widest transition-all border border-white/5 flex items-center justify-center gap-3">
          <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
          Sign Out
        </button>
      </div>

      <p className="text-center text-[9px] font-black text-white/10 uppercase tracking-[0.5em] mt-20">Birdy Smart Ledger • Version 1.2.5</p>
    </div>
  );
};
