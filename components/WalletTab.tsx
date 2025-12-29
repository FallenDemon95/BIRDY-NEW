
import React, { useState, useEffect } from 'react';
import { Bill, TabType } from '../types';
import { backend } from '../services/backendService';

const WalletCard: React.FC<{ 
  bill: Bill, 
  index: number, 
  isExpanded: boolean, 
  onExpand: (id: string | null) => void,
  isDimmed: boolean
}> = ({ 
  bill, index, isExpanded, onExpand, isDimmed
}) => {
  const [loading, setLoading] = useState(false);

  const calculateDaysLeft = () => {
    const purchaseDate = new Date(bill.date);
    const today = new Date();
    const diffTime = today.getTime() - purchaseDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, bill.returnWindowDays - diffDays);
  };

  const daysLeft = calculateDaysLeft();
  const isWindowOpen = daysLeft > 0;

  const handleAction = async (e: React.MouseEvent, type: 'return' | 'exchange') => {
    e.stopPropagation();
    if (!isWindowOpen) {
      alert("This request is no longer available as the window has closed.");
      return;
    }
    setLoading(true);
    try {
      const url = await backend.processAction(bill.id, type);
      window.open(url, '_blank');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      onClick={() => onExpand(isExpanded ? null : bill.id)}
      className={`relative w-full rounded-[2.8rem] p-7 transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1) cursor-pointer wallet-card-shadow ${bill.color} border border-white/10 overflow-hidden 
        ${isExpanded ? 'z-[100] scale-[1.04] mb-12' : 'z-[10] mb-[-100px] hover:translate-y-[-12px]'} 
        ${isDimmed && !isExpanded ? 'opacity-30 blur-[1px]' : 'opacity-100'}`}
      style={{
        transform: !isExpanded ? `translateY(0) scale(${1 - (index * 0.01)})` : 'translateY(0) scale(1)',
        marginTop: isExpanded ? '20px' : '0',
      }}
    >
      {/* Labels / Badges */}
      {!isExpanded && (
        <div className="absolute top-5 right-8 flex gap-2">
          {bill.isOnlineOrder && (
            <div className="bg-blue-600/90 text-white px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-lg backdrop-blur-md">
              <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
              Synced
            </div>
          )}
          <div className={`${isWindowOpen ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'bg-red-500'} text-white px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5`}>
            <div className={`w-1 h-1 bg-white rounded-full ${isWindowOpen ? 'animate-ping' : ''}`}></div>
            {isWindowOpen ? 'Return Window' : 'Closed'}
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-start mb-10 pt-2">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-[1.4rem] bg-white/10 flex items-center justify-center text-3xl font-black backdrop-blur-2xl border border-white/20">
            {bill.icon}
          </div>
          <div>
            <h3 className="font-bold text-2xl leading-none mb-1.5">{bill.merchant}</h3>
            <p className="text-white/40 text-[10px] uppercase font-black tracking-[0.2em]">{bill.date}</p>
          </div>
        </div>
        <div className="text-right pt-2">
          <p className="font-black text-3xl tracking-tighter leading-none mb-1.5">₹{bill.amount.toLocaleString('en-IN')}</p>
          <span className="text-[9px] font-black uppercase bg-black/30 px-3 py-1 rounded-full text-white/60 border border-white/10">{bill.category}</span>
        </div>
      </div>

      {isExpanded && (
        <div className="mt-6 animate-fadeIn space-y-8">
          {/* Online Info Section */}
          {bill.isOnlineOrder && (
            <div className="bg-blue-600/10 border border-blue-500/20 p-6 rounded-[2rem] space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black uppercase text-blue-400 tracking-widest">Order Sync Tracking</span>
                <span className="text-[10px] font-bold text-white/40 font-mono">{bill.trackingId || 'AUTO-SYNC'}</span>
              </div>
              <div className="relative h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="absolute left-0 top-0 h-full bg-blue-500 transition-all duration-1000" 
                  style={{ width: bill.orderStatus === 'Shipped' ? '40%' : bill.orderStatus === 'Delivered' ? '100%' : '70%' }}
                ></div>
              </div>
              <div className="flex justify-between text-[10px] font-black uppercase text-white/20">
                <span>Ordered</span>
                <span className={bill.orderStatus === 'Delivered' ? 'text-blue-400' : ''}>Delivered</span>
              </div>
            </div>
          )}

          {/* Policy Display */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-black/30 p-5 rounded-3xl border border-white/5 flex flex-col items-center">
              <span className="text-[8px] font-black text-white/30 uppercase tracking-[0.3em] mb-2">Policy Clock</span>
              <div className="flex flex-col items-center">
                <span className={`text-sm font-black ${isWindowOpen ? 'text-emerald-400' : 'text-red-400'}`}>
                  {isWindowOpen ? 'WINDOW OPEN' : 'CLOSED'}
                </span>
                <span className="text-[9px] text-white/40 font-bold">{daysLeft} Days Left</span>
              </div>
            </div>
            <div className="bg-black/30 p-5 rounded-3xl border border-white/5 flex flex-col items-center">
              <span className="text-[8px] font-black text-white/30 uppercase tracking-[0.3em] mb-2">Eco-Impact</span>
              <div className="flex flex-col items-center">
                <span className="text-sm font-black text-emerald-400">
                  +2 POINTS
                </span>
                <span className="text-[9px] text-white/40 font-bold">Paperless Sync</span>
              </div>
            </div>
          </div>

          {/* Receipt View */}
          <div className="bg-black/40 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/10 shadow-inner">
            <div className="flex justify-between items-center mb-6">
               <h4 className="text-[11px] font-black text-white/30 uppercase tracking-[0.4em]">Inventory</h4>
               {bill.isOnlineOrder && <span className="bg-blue-500/20 text-blue-400 text-[8px] px-2 py-1 rounded-md font-black">E-RECEIPT</span>}
            </div>
            {bill.items.length > 0 ? bill.items.map((item, i) => (
              <div key={i} className="flex justify-between items-center mb-4 last:mb-0">
                <span className="text-white/70 font-bold text-base">{item.name}</span>
                <span className="text-white font-black tracking-tight">₹{item.price.toLocaleString('en-IN')}</span>
              </div>
            )) : (
              <p className="text-white/20 text-center py-4 font-bold text-xs">Extraction in progress...</p>
            )}
            <div className="pt-6 border-t border-white/10 mt-6">
                <p className="text-[10px] font-black uppercase text-white/20 tracking-widest mb-1">Total Billing</p>
                <span className="text-4xl font-black tracking-tighter">₹{bill.amount.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="flex gap-4">
            <button 
              onClick={(e) => handleAction(e, 'return')}
              disabled={loading || !isWindowOpen}
              className={`flex-1 py-5 rounded-[1.8rem] font-black text-xs uppercase tracking-[0.2em] transition-all border border-white/10 active:scale-95 
                ${isWindowOpen ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-zinc-900 text-white/20 cursor-not-allowed'}`}
            >
              Return Portal
            </button>
            <button 
              onClick={(e) => handleAction(e, 'exchange')}
              disabled={loading || !isWindowOpen}
              className={`flex-1 py-5 rounded-[1.8rem] font-black text-xs uppercase tracking-[0.2em] transition-all active:scale-95
                ${isWindowOpen ? 'bg-blue-600 text-white shadow-2xl shadow-blue-600/40 hover:bg-blue-500' : 'bg-zinc-900 text-white/20 cursor-not-allowed'}`}
            >
              Exchange
            </button>
          </div>

          <button 
            onClick={(e) => { e.stopPropagation(); onExpand(null); }}
            className="w-full text-center text-white/20 text-[11px] font-black uppercase tracking-[0.4em] py-6 hover:text-white/40 transition-colors"
          >
            Collapse Wallet
          </button>
        </div>
      )}
    </div>
  );
};

export const WalletTab: React.FC<{ setActiveTab: (tab: TabType) => void }> = ({ setActiveTab }) => {
  const [bills, setBills] = useState<Bill[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    const data = await backend.getBills();
    setBills(data);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-8">
        <div className="w-20 h-20 bg-blue-600/20 rounded-full flex items-center justify-center">
           <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <div className="text-center">
          <p className="text-white/40 font-black uppercase tracking-[0.4em] text-[10px] mb-2">Securing your vault</p>
          <p className="text-white/10 font-bold text-[8px] uppercase tracking-widest">Connected to Birdy Sync v2.0</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 pt-6 pb-64 relative">
      <div className="flex justify-between items-end mb-16 px-2">
        <div>
          <h1 className="text-6xl font-black tracking-tighter mb-2">Wallet</h1>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.5)]"></span>
            <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.3em] leading-none">Smart Ledger</p>
          </div>
        </div>
        <button 
          onClick={() => setActiveTab('id')}
          className="w-14 h-14 bg-zinc-900 rounded-[1.4rem] flex items-center justify-center border border-white/10 hover:bg-zinc-800 transition-all active:scale-90 shadow-2xl"
        >
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"></path></svg>
        </button>
      </div>
      
      <div className={`relative flex flex-col ${expandedId ? 'gap-0' : 'pb-40'}`}>
        {bills.map((bill, index) => (
          <WalletCard 
            key={bill.id} 
            bill={bill} 
            index={index} 
            isExpanded={expandedId === bill.id}
            isDimmed={expandedId !== null && expandedId !== bill.id}
            onExpand={setExpandedId}
          />
        ))}
      </div>
      
      {!expandedId && (
        <div className="mt-20 text-center opacity-20">
          <p className="text-white text-[11px] font-black uppercase tracking-[0.5em] mb-4">India's Smart Ledger</p>
          <div className="w-1 h-12 bg-gradient-to-b from-white to-transparent mx-auto rounded-full"></div>
        </div>
      )}
    </div>
  );
};
