
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
    setTimeout(async () => {
      const demoEmailBody = "Thank you for your order at Myntra. Total: ₹2,499. Items: Roadster Men Shirt. Order Date: May 26, 2024.";
      const data = await GeminiService.analyzeEmailText(demoEmailBody);
      if (data) {
        const newBill: Bill = {
          id: `B-SYNC-${Math.floor(Math.random() * 10000)}`,
          merchant: data.merchant || 'Myntra',
          amount: data.amount || 2499,
          date: new Date().toISOString().split('T')[0],
          category: (data.category as any) || 'Clothing',
          color: 'bg-zinc-800',
          icon: 'M',
          items: data.items || [],
          returnUrl: '#',
          exchangeUrl: '#',
          status: 'active',
          returnWindowDays: 15,
          isOnlineOrder: true,
          orderStatus: 'Processing'
        };
        await backend.addBill(newBill);
        alert("Synced 1 new invoice!");
      }
      setIsSyncing(false);
    }, 1500);
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
          id: `B-UP-${Math.floor(Math.random() * 10000)}`,
          merchant: data.merchant || 'Invoice',
          amount: data.amount || 0,
          date: data.date || new Date().toISOString().split('T')[0],
          category: (data.category as any) || 'Other',
          color: 'bg-zinc-900',
          icon: '↑',
          items: data.items || [],
          returnUrl: '#',
          exchangeUrl: '#',
          status: 'active',
          returnWindowDays: 14
        };
        await backend.addBill(newBill);
        alert(`Extracted: ${data.merchant}`);
      }
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleManualSubmit = async () => {
    if (!form.merchant || !form.amount) return;
    const newBill: Bill = {
      id: `B-MAN-${Math.floor(Math.random() * 10000)}`,
      merchant: form.merchant,
      amount: parseFloat(form.amount),
      date: new Date().toISOString().split('T')[0],
      category: form.category,
      color: 'bg-blue-900',
      icon: form.merchant.charAt(0).toUpperCase(),
      items: [],
      returnUrl: '#',
      exchangeUrl: '#',
      status: 'active',
      returnWindowDays: 14
    };
    await backend.addBill(newBill);
    setView('id');
    setForm({ merchant: '', amount: '', items: '', category: 'Other' });
    alert("Bill Added");
  };

  return (
    <div className="flex flex-col min-h-full px-6 pt-4 pb-32 overflow-y-auto custom-scroll">
      {/* View Switcher - Tab Style */}
      <div className="flex bg-zinc-900/50 p-1 rounded-2xl mb-8 border border-white/5">
        {[
          { id: 'id', label: 'Birdy ID' },
          { id: 'manual', label: 'Quick Add' },
          { id: 'online', label: 'Sync' }
        ].map(t => (
          <button 
            key={t.id}
            onClick={() => setView(t.id as any)}
            className={`flex-1 py-3 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all ${view === t.id ? 'bg-blue-600 text-white shadow-lg' : 'text-white/30'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {view === 'id' && (
        <div className="flex-1 flex flex-col items-center animate-fadeIn">
          <div className="w-full bg-zinc-900/40 border border-white/5 rounded-[3rem] p-8 relative overflow-hidden flex flex-col items-center text-center">
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-8">Birdy Pass</h2>
            
            <div className="bg-white p-6 rounded-[2.5rem] shadow-2xl mb-8">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${birdyId}`} 
                className="w-48 h-48"
                alt="QR"
              />
              <p className="mt-4 text-black text-[10px] font-black tracking-tighter uppercase">{birdyId}</p>
            </div>

            <div className="space-y-1 mb-8">
              <h3 className="text-2xl font-black tracking-tight uppercase">Ishaan Verma</h3>
              <p className="text-white/30 text-[9px] font-black uppercase tracking-widest">Global Member Since 2024</p>
            </div>

            <div className="w-full bg-white/5 rounded-2xl p-4 border border-white/5">
              <p className="text-[9px] font-bold text-white/50 leading-relaxed uppercase tracking-widest">
                Retailer: Scan this ID at checkout to receive your digital invoice instantly.
              </p>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 blur-[50px]"></div>
          </div>
        </div>
      )}

      {view === 'manual' && (
        <div className="animate-fadeIn space-y-6">
          <div className="bg-zinc-900/40 rounded-[2.5rem] p-8 border border-white/5 space-y-5">
            <h3 className="text-xl font-black tracking-tight">Bill Details</h3>
            <div className="space-y-4">
              <div>
                <label className="text-[9px] font-black uppercase text-white/20 tracking-widest block mb-2">Merchant Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Starbucks"
                  className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-5 text-white outline-none font-bold"
                  value={form.merchant}
                  onChange={e => setForm({...form, merchant: e.target.value})}
                />
              </div>
              <div>
                <label className="text-[9px] font-black uppercase text-white/20 tracking-widest block mb-2">Total Amount (₹)</label>
                <input 
                  type="number" 
                  inputMode="decimal"
                  placeholder="0.00"
                  className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-5 text-white outline-none font-bold text-lg"
                  value={form.amount}
                  onChange={e => setForm({...form, amount: e.target.value})}
                />
              </div>
              <div>
                <label className="text-[9px] font-black uppercase text-white/20 tracking-widest block mb-2">Category</label>
                <select 
                  className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-5 text-white outline-none font-bold appearance-none"
                  value={form.category}
                  onChange={e => setForm({...form, category: e.target.value as any})}
                >
                  <option>Other</option>
                  <option>Groceries</option>
                  <option>Clothing</option>
                  <option>Electronics</option>
                  <option>Dining</option>
                </select>
              </div>
            </div>
            <button 
              onClick={handleManualSubmit}
              className="w-full bg-white text-black py-5 rounded-[1.8rem] font-black uppercase text-[10px] tracking-widest shadow-xl active:opacity-80"
            >
              Save to Wallet
            </button>
          </div>
        </div>
      )}

      {view === 'online' && (
        <div className="animate-fadeIn space-y-5">
          <div 
            onClick={handleGmailSync}
            className="bg-zinc-900/40 rounded-[2rem] p-6 border border-white/5 active:scale-[0.98] transition-transform cursor-pointer"
          >
            <div className="flex justify-between items-center mb-4">
              <div className="w-12 h-12 bg-red-500/10 rounded-2xl flex items-center justify-center">
                <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
              </div>
              {isSyncing && <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>}
            </div>
            <h3 className="text-lg font-black tracking-tight">Sync Gmail Invoices</h3>
            <p className="text-white/40 text-[10px] mt-1 leading-relaxed">AI will scan your inbox for order confirmations from Myntra, Swiggy, etc.</p>
          </div>

          <div 
            onClick={() => fileInputRef.current?.click()}
            className="bg-zinc-900/40 rounded-[2rem] p-6 border border-white/5 active:scale-[0.98] transition-transform cursor-pointer"
          >
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*,.pdf" onChange={handleFileUpload} />
            <div className="flex justify-between items-center mb-4">
              <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
              </div>
              {isUploading && <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>}
            </div>
            <h3 className="text-lg font-black tracking-tight">Scan E-Invoice</h3>
            <p className="text-white/40 text-[10px] mt-1 leading-relaxed">Upload a PDF or screenshot of any invoice. Birdy AI will extract the data.</p>
          </div>

          <div className="bg-blue-600/10 rounded-[2rem] p-6 border border-blue-500/20">
            <h4 className="text-[8px] font-black uppercase text-blue-400 tracking-widest mb-3">Your Sync Mailbox</h4>
            <div className="bg-black/40 py-4 px-5 rounded-2xl font-mono text-sm font-bold flex justify-between items-center">
              <span>{birdyId.toLowerCase()}@birdy.me</span>
              <button className="text-[8px] font-black text-blue-400 bg-blue-400/10 px-2 py-1 rounded">COPY</button>
            </div>
          </div>
        </div>
      )}
      
      <p className="mt-12 text-center text-white/10 text-[8px] font-black uppercase tracking-[0.5em]">Global ID • 256-bit Encrypted</p>
    </div>
  );
};
