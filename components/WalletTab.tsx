
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
      alert("This window is closed.");
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
      className={`relative w-full rounded-[2.5rem] p-6 card-stack-transition cursor-pointer wallet-card-shadow ${bill.color} border border-white/10 overflow-hidden 
        ${isExpanded ? 'z-[100] scale-[1.02] mb-10' : 'z-[10] mb-[-120px] active:scale-[0.98]'} 
        ${isDimmed && !isExpanded ? 'opacity-20 blur-[2px]' : 'opacity-100'}`}
      style={{
        transform: !isExpanded ? `translateY(0) scale(${1 - (index * 0.01)})` : 'translateY(0) scale(1)',
        marginTop: isExpanded ? '10px' : '0',
      }}
    >
      {/* Dynamic Status Badges */}
      {!isExpanded && (
        <div className="absolute top-5 right-6 flex flex-col items-end gap-1.5">
          {bill.isOnlineOrder && (
            <div className="bg-blue-600/90 text-[7px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md backdrop-blur-sm">ONLINE</div>
          )}
          <div className={`${isWindowOpen ? 'bg-emerald-500' : 'bg-red-500'} text-white px-2 py-0.5 rounded-md text-[7px] font-black uppercase tracking-widest`}>
            {isWindowOpen ? 'Open' : 'Closed'}
          </div>
        </div>
      )}

      {/* Card Header */}
      <div className="flex justify-between items-start mb-12">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-2xl font-black backdrop-blur-xl border border-white/10">
            {bill.icon}
          </div>
          <div>
            <h3 className="font-black text-xl leading-none mb-1 tracking-tight">{bill.merchant}</h3>
            <p className="text-white/30 text-[9px] uppercase font-black tracking-widest">{bill.date}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-black text-2xl tracking-tighter leading-none mb-1">₹{Math.round(bill.amount).toLocaleString('en-IN')}</p>
          <span className="text-[8px] font-black uppercase text-white/40 tracking-widest">{bill.category}</span>
        </div>
      </div>

      {isExpanded && (
        <div className="mt-4 animate-fadeIn space-y-6">
          {/* Tracking Status for Online Orders */}
          {bill.isOnlineOrder && (
            <div className="bg-white/5 border border-white/5 rounded-3xl p-5">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[9px] font-black uppercase text-blue-400">Order Progress</span>
                <span className="text-[9px] font-bold text-white/30">{bill.orderStatus}</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500" 
                  style={{ width: bill.orderStatus === 'Delivered' ? '100%' : '60%' }}
                ></div>
              </div>
            </div>
          )}

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-black/20 p-4 rounded-[1.8rem] text-center border border-white/5">
              <span className="text-[7px] font-black text-white/30 uppercase tracking-[0.2em] mb-1 block">Return Window</span>
              <span className={`text-xs font-black ${isWindowOpen ? 'text-emerald-400' : 'text-red-400'}`}>
                {isWindowOpen ? `${daysLeft} DAYS LEFT` : 'CLOSED'}
              </span>
            </div>
            <div className="bg-black/20 p-4 rounded-[1.8rem] text-center border border-white/5">
              <span className="text-[7px] font-black text-white/30 uppercase tracking-[0.2em] mb-1 block">Reward Points</span>
              <span className="text-xs font-black text-amber-400">+12 BIRDY</span>
            </div>
          </div>

          {/* Item List */}
          <div className="bg-black/30 rounded-[2rem] p-6 border border-white/5">
            <h4 className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] mb-4">Line Items</h4>
            <div className="space-y-3">
              {bill.items.map((item, i) => (
                <div key={i} className="flex justify-between items-center">
                  <span className="text-white/70 font-medium text-sm">{item.name}</span>
                  <span className="text-white font-black text-sm">₹{item.price.toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>
            <div className="mt-5 pt-5 border-t border-white/5 flex justify-between items-end">
              <div>
                <p className="text-[8px] font-black uppercase text-white/20 mb-1">Total Due</p>
                <span className="text-3xl font-black tracking-tighter">₹{bill.amount.toLocaleString('en-IN')}</span>
              </div>
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=BIRDY-${bill.id}`} 
                className="w-14 h-14 rounded-lg bg-white p-1"
                alt="QR"
              />
            </div>
          </div>

          {/* Mobile-Optimized Action Buttons */}
          <div className="flex flex-col gap-3">
            <div className="flex gap-3">
              <button 
                onClick={(e) => handleAction(e, 'return')}
                disabled={!isWindowOpen || loading}
                className={`flex-1 py-5 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest transition-all ${isWindowOpen ? 'bg-white/10 text-white border border-white/10' : 'bg-black/20 text-white/20 border border-transparent'}`}
              >
                Return Item
              </button>
              <button 
                onClick={(e) => handleAction(e, 'exchange')}
                disabled={!isWindowOpen || loading}
                className={`flex-1 py-5 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest transition-all ${isWindowOpen ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'bg-black/20 text-white/20 border border-transparent'}`}
              >
                Exchange
              </button>
            </div>
            <button 
              onClick={(e) => { e.stopPropagation(); onExpand(null); }}
              className="w-full py-4 text-white/20 font-black text-[9px] uppercase tracking-widest hover:text-white/40"
            >
              Close Receipt
            </button>
          </div>
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
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">Loading Ledger</p>
      </div>
    );
  }

  return (
    <div className="px-6 pt-8 pb-32">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-black tracking-tighter">My Wallet</h1>
          <p className="text-white/30 text-[9px] font-black uppercase tracking-widest mt-1">Smart Digital Invoices</p>
        </div>
        <button 
          onClick={() => setActiveTab('id')}
          className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 active:scale-90 transition-transform"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"></path></svg>
        </button>
      </div>
      
      <div className="flex flex-col">
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
        <div className="mt-24 text-center">
          <p className="text-white/10 text-[9px] font-black uppercase tracking-[0.5em]">India's Paperless Future</p>
        </div>
      )}
    </div>
  );
};
