
import React, { useState } from 'react';
import { WalletTab } from './components/WalletTab';
import { BirdyIdTab } from './components/BirdyIdTab';
import { AnalyticsTab } from './components/AnalyticsTab';
import { ProfileTab } from './components/ProfileTab';
import { TabType, User, Notification } from './types';
import { MOCK_NOTIFICATIONS } from './constants';

const MOCK_USER: User = {
  id: 'u1',
  birdyId: 'BIRDY.9988',
  name: 'Ishaan Verma',
  email: 'ishaan@birdy.in',
  phone: '+91 98765 43210',
  treesSaved: 28,
  points: 1450,
  // Added missing syncEmail property to fix TypeScript error
  syncEmail: 'ishaan.v@birdy.id'
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('wallet');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [phone, setPhone] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-black flex flex-col px-8 py-12 justify-between">
        <div className="text-center mt-12">
          <div className="w-24 h-24 bg-blue-600 rounded-[2.2rem] mx-auto mb-8 flex items-center justify-center text-5xl shadow-2xl shadow-blue-600/40 animate-pulse">🐦</div>
          <h1 className="text-6xl font-black tracking-tighter mb-3">Birdy</h1>
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">India's Smart Bill Wallet</p>
        </div>

        <div className="w-full max-w-sm mx-auto space-y-8">
          <div className="space-y-4">
            <div className="relative group">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500 font-black border-r border-zinc-800 pr-4">+91</span>
              <input 
                type="tel" 
                placeholder="Mobile Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-zinc-900/40 border border-zinc-800 rounded-[1.5rem] py-5 pl-20 pr-6 text-white focus:outline-none focus:border-blue-500 focus:bg-zinc-900 transition-all font-black text-lg tracking-tight"
              />
            </div>
            <button 
              onClick={() => setIsLoggedIn(true)}
              className="w-full bg-blue-600 text-white py-5 rounded-[1.5rem] font-black shadow-2xl shadow-blue-600/30 active:scale-95 transition-all text-sm uppercase tracking-widest"
            >
              Get Secure OTP
            </button>
          </div>

          <div className="flex items-center gap-6 py-2">
            <div className="flex-1 h-[1px] bg-zinc-800"></div>
            <span className="text-zinc-700 text-[10px] font-black uppercase tracking-[0.3em]">Secure Login</span>
            <div className="flex-1 h-[1px] bg-zinc-800"></div>
          </div>

          <button 
            onClick={() => setIsLoggedIn(true)}
            className="w-full bg-zinc-900/50 text-white py-5 rounded-[1.5rem] font-black border border-white/5 flex items-center justify-center gap-4 hover:bg-zinc-800 transition-all active:scale-95"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google Auth
          </button>
        </div>

        <p className="text-zinc-800 text-[9px] text-center uppercase font-black tracking-[0.4em] leading-relaxed">
          Made in India • Paperless v1.2.5
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black max-w-lg mx-auto relative shadow-2xl overflow-hidden flex flex-col">
      {/* Header */}
      <header className="px-6 py-8 flex justify-between items-center sticky top-0 bg-black/95 backdrop-blur-3xl z-[500] border-b border-white/5">
        <div 
          onClick={() => setActiveTab('profile')}
          className="flex items-center gap-4 cursor-pointer active:scale-95 transition-all"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-900 rounded-[1.3rem] flex items-center justify-center text-xl font-black shadow-2xl shadow-blue-600/30 ring-1 ring-white/10">
            {MOCK_USER.name.charAt(0)}
          </div>
          <div>
            <h4 className="font-black text-lg tracking-tight leading-none mb-1">{MOCK_USER.name}</h4>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.8)]"></span>
              <p className="text-white/30 text-[9px] font-black uppercase tracking-widest">{MOCK_USER.birdyId}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-3 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all active:scale-90"
          >
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-black"></span>
            <svg className="w-6 h-6 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
          </button>
        </div>
      </header>

      {/* Notifications Panel */}
      {showNotifications && (
        <div className="fixed top-[100px] left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-zinc-900 border border-white/10 rounded-[2.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.8)] z-[1001] animate-fadeIn p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-black tracking-tight">Activity</h3>
            <button onClick={() => setShowNotifications(false)} className="text-white/30 text-[10px] font-black uppercase tracking-widest hover:text-white">Clear</button>
          </div>
          <div className="space-y-3">
            {MOCK_NOTIFICATIONS.map(notif => (
              <div key={notif.id} className="p-4 bg-white/5 rounded-2xl border border-white/5">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-bold text-sm">{notif.title}</h4>
                  <span className="text-[8px] text-white/30 font-black uppercase">{notif.time}</span>
                </div>
                <p className="text-[11px] text-white/50 leading-relaxed">{notif.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Content */}
      <main className="flex-1 overflow-y-auto custom-scroll">
        {activeTab === 'wallet' && <WalletTab setActiveTab={setActiveTab} />}
        {activeTab === 'id' && <BirdyIdTab birdyId={MOCK_USER.birdyId} />}
        {activeTab === 'analytics' && <AnalyticsTab />}
        {activeTab === 'profile' && <ProfileTab user={MOCK_USER} />}
      </main>

      {/* Navigation */}
      <nav className="fixed bottom-10 left-1/2 -translate-x-1/2 w-[90%] max-w-sm bg-zinc-900/90 backdrop-blur-3xl border border-white/10 rounded-[3.5rem] p-3 flex justify-between items-center z-[1000] safe-area-bottom shadow-[0_20px_50px_rgba(0,0,0,1)]">
        {[
          { id: 'wallet', label: 'Wallet', icon: 'M21 18V19C21 20.1 20.1 21 19 21H5C3.89 21 3 20.1 3 19V5C3 3.9 3.89 3 5 3H19C20.1 3 21 3.9 21 5V6H12C10.89 6 10 6.89 10 8V16C10 17.11 10.89 18 12 18H21ZM12 16H22V8H12V16ZM16 13.5C15.17 13.5 14.5 12.83 14.5 12C14.5 11.17 15.17 10.5 16 10.5C16.83 10.5 17.5 11.17 17.5 12C17.5 12.83 16.83 13.5 16 13.5Z' },
          { id: 'id', label: 'ID', icon: 'M17 1H7c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2zM7 19V5h10v14H7zm3-8h4v2h-4v-2zm0 4h4v2h-4v-2zm0-8h4v2h-4V7z' },
          { id: 'analytics', label: 'Insights', icon: 'M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z' }
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabType)}
            className={`flex-1 flex flex-col items-center justify-center py-5 rounded-[3rem] transition-all duration-500 ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-2xl shadow-blue-600/50 scale-105' : 'text-white/20 hover:text-white/40'}`}
          >
            <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d={tab.icon}/></svg>
            <span className="text-[9px] font-black uppercase mt-1.5 tracking-[0.2em]">{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default App;
