
import React, { useState, useRef } from 'react';
import { GeminiService } from '../services/geminiService';
import { backend } from '../services/backendService';
import { Bill } from '../types';

export const BirdyIdTab: React.FC<{ birdyId: string }> = ({ birdyId }) => {
  const [view, setView] = useState<'id' | 'manual' | 'online'>('id');
  const [isSyncing, setIsSyncing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [form, setForm] = useState({
    merchant: '',
    amount: '',
    items: '',
    category: 'Other' as Bill['category']
  });

  const handleGmailSync = async () => {
    setIsSyncing(true);
    // Simulation of scanning Gmail for keywords like "Order Confirmation"
    setTimeout(async () => {
      const demoEmailBody = "Thank you for your order at Myntra. Total: ₹2,499. Items: Roadster Men Shirt, Levi's Jeans. Order Date: May 26, 2024.";
      const data = await GeminiService.analyzeEmailText(demoEmailBody);
      
      if (data) {
        const newBill: Bill = {
          id: `B-SYNC-${Math.floor(Math.random() * 10000)}`,
          merchant: data.merchant || 'Myntra',
          amount: data.amount || 2499,
          date: new Date().toISOString().split('T')[0],
          category: (data.category as any) || 'Clothing',
          color: 'bg-pink-900',
          icon: 'M',
          items: data.items || [],
          returnUrl: 'https://www.myntra.com/my/orders',
          exchangeUrl: 'https://www.myntra.com/my/orders',
          status: 'active',
          returnWindowDays: 15,
          isOnlineOrder: true,
          orderStatus: 'Processing'
        };
        await backend.addBill(newBill);
        alert("Found 1 new bill from Myntra in your inbox!");
      }
      setIsSyncing(false);
    }, 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      const data = await GeminiService.analyzeReceiptImage(base64);
      
      if (data) {
        const newBill: Bill = {
          id: `B-UPLOAD-${Math.floor(Math.random() * 10000)}`,
          merchant: data.merchant || 'Uploaded Receipt',
          amount: data.amount || 0,
          date: data.date || new Date().toISOString().split('T')[0],
          category: (data.category as any) || 'Other',
          color: 'bg-zinc-800',
          icon: '↑',
          items: data.items || [],
          returnUrl: '#',
          exchangeUrl: '#',
          status: 'active',
          returnWindowDays: 14
        };
        await backend.addBill(newBill);
        alert(`Successfully imported bill from ${data.merchant}`);
      }
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col items-center px-6 pt-10 pb-40 min-h-screen">
      <div className="w-full flex justify-between items-center mb-10 px-2">
        <div className="flex items-center gap-2">
           <span className="text-blue-600 text-2xl font-black">🐦</span>
           <span className="text-lg font-black tracking-tighter uppercase">Add Receipt</span>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setView('manual')}
            className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${view === 'manual' ? 'bg-white text-black' : 'bg-zinc-900 text-white/40 border border-white/5'}`}
          >
            Manual
          </button>
          <button 
            onClick={() => setView('online')}
            className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${view === 'online' ? 'bg-blue-600 text-white shadow-lg' : 'bg-zinc-900 text-white/40 border border-white/5'}`}
          >
            Online
          </button>
        </div>
      </div>

      {view === 'id' && (
        <div className="w-full animate-fadeIn" onClick={() => setView('id')}>
          <div className="w-full bg-zinc-900/40 border border-white/5 rounded-[3rem] p-10 relative overflow-hidden flex flex-col items-center shadow-2xl">
            <div className="w-full mb-12">
              <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-3 block">Member ID</label>
              <h2 className="text-4xl font-black tracking-tighter text-white font-mono break-all leading-none">
                {birdyId.replace('.', '')}110245
              </h2>
            </div>
            <div className="w-full mb-16">
              <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-3 block">Account Name</label>
              <h3 className="text-2xl font-bold tracking-tight">Ishaan Verma</h3>
            </div>
            <div className="bg-white p-6 rounded-[2rem] shadow-2xl w-full flex flex-col items-center">
              <div className="bg-zinc-100 p-4 rounded-2xl mb-4 w-full flex items-center justify-center">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${birdyId}&bgcolor=ffffff`} 
                  alt="Birdy QR" 
                  className="w-full max-w-[200px] h-auto"
                />
              </div>
              <div className="w-full h-12 bg-zinc-100 rounded-lg overflow-hidden flex items-center justify-center py-2 px-4 gap-0.5 opacity-80">
                {Array.from({length: 40}).map((_, i) => (
                  <div key={i} className="bg-black flex-1" style={{ height: `${Math.random() * 60 + 40}%`, width: `${Math.random() > 0.5 ? '2px' : '1px'}` }}></div>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-8 text-center text-white/20 text-[10px] font-black uppercase tracking-[0.4em]">Tap navigation to switch modes</div>
        </div>
      )}

      {view === 'manual' && (
        <div className="w-full animate-fadeIn bg-zinc-900/40 border border-white/5 rounded-[3rem] p-8 shadow-2xl">
          <h2 className="text-2xl font-black tracking-tighter mb-8">Manual Bill</h2>
          {/* ... existing manual form code ... */}
          <div className="space-y-6">
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-2 block">Merchant</label>
              <input type="text" className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-5 text-white outline-none font-bold" value={form.merchant} onChange={e => setForm({...form, merchant: e.target.value})} />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-2 block">Amount (₹)</label>
              <input type="number" className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-5 text-white outline-none font-bold" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} />
            </div>
            <button className="w-full bg-white text-black py-5 rounded-[1.8rem] font-black uppercase text-xs tracking-[0.2em] shadow-2xl active:scale-95 transition-all">Add Bill</button>
          </div>
        </div>
      )}

      {view === 'online' && (
        <div className="w-full animate-fadeIn space-y-6">
          {/* Gmail One-Tap Sync */}
          <div className="bg-zinc-900/60 border border-white/5 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-black mb-1">Gmail One-Sync</h3>
                  <p className="text-white/40 text-[10px] uppercase font-black tracking-widest">Powered by Gemini AI</p>
                </div>
                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-400" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                </div>
              </div>
              <p className="text-white/50 text-[11px] leading-relaxed mb-8">
                Connect your Gmail to automatically find and import invoices from Amazon, Swiggy, Zomato, and more.
              </p>
              <button 
                onClick={handleGmailSync}
                disabled={isSyncing}
                className={`w-full py-5 rounded-[1.8rem] font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${isSyncing ? 'bg-zinc-800 text-white/40 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-500 shadow-xl shadow-blue-600/20'}`}
              >
                {isSyncing && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
                {isSyncing ? 'Scanning Inbox...' : 'Sync All Online Bills'}
              </button>
            </div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-red-600/5 blur-[60px] group-hover:bg-red-600/10 transition-all"></div>
          </div>

          {/* PDF / Screenshot Upload */}
          <div className="bg-zinc-900/60 border border-white/5 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-black mb-1">Import E-Invoice</h3>
                  <p className="text-white/40 text-[10px] uppercase font-black tracking-widest">PDF / Screenshot</p>
                </div>
                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center">
                   <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                </div>
              </div>
              <p className="text-white/50 text-[11px] leading-relaxed mb-8">
                Download an invoice from any store app and share it here. Our AI will extract all details instantly.
              </p>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*,.pdf" onChange={handleFileUpload} />
              <button 
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className={`w-full py-5 rounded-[1.8rem] font-black text-xs uppercase tracking-widest transition-all border border-white/10 hover:bg-white/5 ${isUploading ? 'opacity-50' : ''}`}
              >
                {isUploading ? 'Analyzing...' : 'Upload PDF or Image'}
              </button>
            </div>
          </div>

          {/* Birdy Sync Address */}
          <div className="bg-blue-600/10 border border-blue-500/20 p-8 rounded-[2.5rem] relative overflow-hidden">
            <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] mb-4">Your Custom Sync ID</h4>
            <div className="flex items-center justify-between gap-4">
              <span className="text-lg font-mono font-black tracking-tight">{birdyId.toLowerCase()}@birdy.me</span>
              <button className="text-blue-500 font-black text-[10px] uppercase tracking-widest bg-blue-500/10 px-4 py-2 rounded-xl">Copy</button>
            </div>
            <p className="mt-6 text-[11px] text-white/40 leading-relaxed">
              Use this address for online checkouts. Any receipt sent here is automatically added to your wallet.
            </p>
          </div>
        </div>
      )}

      <p className="mt-12 text-center text-white/20 text-[10px] font-black uppercase tracking-widest">End-to-End Encrypted Ledger</p>
    </div>
  );
};
