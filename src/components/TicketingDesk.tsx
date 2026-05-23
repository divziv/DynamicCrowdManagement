/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  CreditCard, CheckCircle2, AlertTriangle, QrCode, ShoppingBag, 
  BarChart2, Smartphone, Terminal, Users, Search, PlusCircle, UserCheck, Trash2
} from 'lucide-react';
import { StadiumZone } from '../types';

interface TicketingDeskProps {
  zones: StadiumZone[];
  onBookTicketCountAdjustment: (zoneId: string, count: number) => void;
  onAddNotification: (message: string, severity: 'info' | 'warning' | 'error' | 'ai') => void;
}

interface TicketRecord {
  id: string;
  holderName: string;
  zoneId: string;
  zoneName: string;
  seatCategory: 'general' | 'fan-zone' | 'vip-suite';
  seatPrice: number;
  status: 'valid' | 'scanned' | 'revoked';
  timestamp: string;
  isOnline: boolean;
}

export default function TicketingDesk({
  zones,
  onBookTicketCountAdjustment,
  onAddNotification
}: TicketingDeskProps) {
  // Live Ticket Store
  const [tickets, setTickets] = useState<TicketRecord[]>([
    {
      id: 'TCK-55291-B',
      holderName: 'Devon Conway',
      zoneId: 'stand-north-l1',
      zoneName: 'North Stand (Level 1)',
      seatCategory: 'fan-zone',
      seatPrice: 75,
      status: 'valid',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      isOnline: true
    },
    {
      id: 'TCK-88121-R',
      holderName: 'Sarah Taylor',
      zoneId: 'stand-west-club',
      zoneName: 'Members Club Stand',
      seatCategory: 'vip-suite',
      seatPrice: 250,
      status: 'valid',
      timestamp: new Date(Date.now() - 1800000).toISOString(),
      isOnline: true
    },
    {
      id: 'TCK-10902-S',
      holderName: 'Marcus Stoinis',
      zoneId: 'stand-south-l1',
      zoneName: 'South Stand (Level 1)',
      seatCategory: 'general',
      seatPrice: 40,
      status: 'scanned',
      timestamp: new Date(Date.now() - 1200000).toISOString(),
      isOnline: false
    }
  ]);

  // Swags and giveaways inventory tracking
  const [swagInventory, setSwagInventory] = useState([
    { id: 'sw-jersey', name: 'Agentic APL Jersey', total: 5000, distributed: 2840, type: 'Jerseys' },
    { id: 'sw-horn', name: 'APL Stadium Air-horn', total: 10000, distributed: 7550, type: 'Noisemakers' },
    { id: 'sw-flag', name: 'APL Cheering Banner Flag', total: 15000, distributed: 11200, type: 'Banners' },
    { id: 'sw-cap', name: 'APL Sun Visor Cap', total: 6000, distributed: 4900, type: 'Caps' }
  ]);

  // Form Booking State
  const [bookName, setBookName] = useState<string>('');
  const [bookZoneId, setBookZoneId] = useState<string>('stand-north-l1');
  const [bookCategory, setBookCategory] = useState<'general' | 'fan-zone' | 'vip-suite'>('fan-zone');
  const [bookIsOnline, setBookIsOnline] = useState<boolean>(true);

  // Scan & Verify simulator codes state
  const [scannedIdInput, setScannedIdInput] = useState<string>('');
  const [verificationFeedback, setVerificationFeedback] = useState<{
    success: boolean;
    msg: string;
    ticket?: TicketRecord;
  } | null>(null);

  // Filter lists
  const standsOnly = zones.filter(z => z.category === 'stand');

  // Compute Prices
  const getTicketPrice = (category: 'general' | 'fan-zone' | 'vip-suite') => {
    switch (category) {
      case 'general': return 40;
      case 'fan-zone': return 75;
      case 'vip-suite': return 250;
    }
  };

  const handleBookTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookName) return;

    const targetZone = zones.find(z => z.id === bookZoneId);
    if (!targetZone) return;

    // Check capacity thresholds
    if (targetZone.currentCount >= targetZone.capacity) {
      onAddNotification(`Booking Deflated: ${targetZone.name} is fully packed. Choose another stand!`, 'error');
      return;
    }

    const price = getTicketPrice(bookCategory);
    const newId = `TCK-${Math.floor(10000 + Math.random() * 90000)}-${targetZone.name[0].toUpperCase()}`;

    const newTicket: TicketRecord = {
      id: newId,
      holderName: bookName,
      zoneId: bookZoneId,
      zoneName: targetZone.name,
      seatCategory: bookCategory,
      seatPrice: price,
      status: 'valid',
      timestamp: new Date().toISOString(),
      isOnline: bookIsOnline
    };

    setTickets(prev => [newTicket, ...prev]);

    // Automatically trigger crowd delta adjustment in primary App state!
    onBookTicketCountAdjustment(bookZoneId, 1);
    onAddNotification(`CONGRATS: Ticket ${newId} booked for ${bookName} in ${targetZone.name}. Capacity updated!`, 'info');
    
    // Reset fields
    setBookName('');
  };

  const handleScanVerify = (ticketId: string) => {
    const rawId = ticketId.trim();
    if (!rawId) return;

    const tIndex = tickets.findIndex(t => t.id === rawId);
    if (tIndex === -1) {
      setVerificationFeedback({
        success: false,
        msg: `ERROR: Ticket credentials "${rawId}" not found in turnstiles gateway registry.`
      });
      onAddNotification(`VERIFICATION DENIED: Invalid card signature: "${rawId}"`, 'error');
      return;
    }

    const matchedT = tickets[tIndex];
    if (matchedT.status === 'scanned') {
      setVerificationFeedback({
        success: false,
        msg: `WARNING: Fraud Alert! Ticket ${rawId} was already scanned at turnstiles previously! Double entry flagged.`,
        ticket: matchedT
      });
      onAddNotification(`FRAUD WARNING: Duplicate entry attempt with Ticket: ${rawId}`, 'warning');
      return;
    }

    if (matchedT.status === 'revoked') {
      setVerificationFeedback({
        success: false,
        msg: `REVOKED: This ticket was cancelled by operators or payment flagged. Access Deficit.`,
        ticket: matchedT
      });
      return;
    }

    // Success scan! Update state
    const updatedTickets = [...tickets];
    updatedTickets[tIndex] = { ...matchedT, status: 'scanned' };
    setTickets(updatedTickets);

    setVerificationFeedback({
      success: true,
      msg: `VERIFIED: Welcome, ${matchedT.holderName}! Access approved for ${matchedT.zoneName}. Seating level: ${matchedT.seatCategory.toUpperCase()}`,
      ticket: updatedTickets[tIndex]
    });

    onAddNotification(`TURNSTILE CAPTURED: Ticket ${rawId} scanned. Gate inflow registered.`, 'info');
  };

  const handleCancelTicket = (id: string) => {
    setTickets(prev => prev.filter(t => t.id !== id));
    onAddNotification(`Ticket entry cancelled & refunded.`, 'info');
  };

  const claimSwagKits = (swId: string, delta: number) => {
    setSwagInventory(prev => prev.map(s => {
      if (s.id === swId) {
        const nextDist = Math.min(s.total, s.distributed + delta);
        if (nextDist === s.total) {
          onAddNotification(`GIVEAWAY WARNING: Swags stock of ${s.name} is fully exhausted!`, 'warning');
        }
        return { ...s, distributed: nextDist };
      }
      return s;
    }));
  };

  return (
    <div className="space-y-4" id="ticketing-dashboard-workspace">
      
      {/* KPI Cards for ticket summaries */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4" id="ticket-stats-bar">
        <div className="bg-[#18181b] border border-[#27272a] p-3.5 rounded-[4px] shadow-sm">
          <p className="text-[9px] uppercase font-mono tracking-widest text-[#71717a] font-bold">Registry Volume</p>
          <div className="flex items-baseline space-x-1 mt-1">
            <h4 className="text-xl font-bold font-mono text-zinc-100">{tickets.length}</h4>
            <span className="text-[10px] text-zinc-400 font-mono">Issued cards</span>
          </div>
        </div>

        <div className="bg-[#18181b] border border-[#27272a] p-3.5 rounded-[4px] shadow-sm">
          <p className="text-[9px] uppercase font-mono tracking-widest text-[#71717a] font-bold">Online Ratio</p>
          <div className="flex items-baseline space-x-1 mt-1">
            <h4 className="text-xl font-bold font-mono text-zinc-100">
              {tickets.length > 0 ? ((tickets.filter(t => t.isOnline).length / tickets.length) * 100).toFixed(0) : '0'}%
            </h4>
            <span className="text-[10px] text-[#06b6d4] font-mono">Mobile booking</span>
          </div>
        </div>

        <div className="bg-[#18181b] border border-[#27272a] p-3.5 rounded-[4px] shadow-sm">
          <p className="text-[9px] uppercase font-mono tracking-widest text-[#71717a] font-bold">Turnstiles scanned</p>
          <div className="flex items-baseline space-x-1 mt-1">
            <h4 className="text-xl font-bold font-mono text-emerald-400">
              {tickets.filter(t => t.status === 'scanned').length}
            </h4>
            <span className="text-[10px] text-zinc-400 font-mono">/ {tickets.length} Checked</span>
          </div>
        </div>

        <div className="bg-[#18181b] border border-[#27272a] p-3.5 rounded-[4px] shadow-sm">
          <p className="text-[9px] uppercase font-mono tracking-widest text-[#71717a] font-bold">Box-Office Income</p>
          <div className="flex items-baseline space-x-1 mt-1">
            <h4 className="text-xl font-bold font-mono text-amber-400">
              ${tickets.reduce((sum, t) => sum + t.seatPrice, 0)}
            </h4>
            <span className="text-[10px] text-[#71717a] font-mono">USD Revenue</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Ticket booking portal card */}
        <div className="bg-[#18181b] border border-[#27272a] p-4 rounded-[4px] shadow-xl" id="boxoffice-booking-portal">
          <div className="flex items-center space-x-2 border-b border-[#27272a] pb-2.5 mb-3.5">
            <CreditCard size={14} className="text-[#06b6d4]" />
            <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-200">APL Box Office Desk</h3>
          </div>

          <form onSubmit={handleBookTicket} className="space-y-3">
            <div>
              <label className="text-[10px] text-[#71717a] font-bold font-mono uppercase block mb-1">Fan / Spectator Name</label>
              <input
                type="text"
                value={bookName}
                onChange={(e) => setBookName(e.target.value)}
                placeholder="e.g. Liam Livingstone"
                className="w-full bg-[#09090b] border border-[#27272a] px-2.5 py-1.5 rounded-[4px] text-zinc-100 text-[11px] focus:outline-none focus:border-[#06b6d4] font-sans"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-[#71717a] font-bold font-mono uppercase block mb-1">Assigned Stand</label>
                <select
                  value={bookZoneId}
                  onChange={(e) => setBookZoneId(e.target.value)}
                  className="w-full bg-[#09090b] border border-[#27272a] px-2.5 py-1.5 rounded-[4px] text-zinc-100 text-[11px] focus:outline-none focus:border-[#06b6d4]"
                >
                  {standsOnly.map(z => {
                    const occupancy = Math.round((z.currentCount / z.capacity) * 100);
                    return (
                      <option key={z.id} value={z.id}>
                        {z.name.split(' (')[0]} ({occupancy}%)
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="text-[10px] text-[#71717a] font-bold font-mono uppercase block mb-1">Trophy Tier</label>
                <select
                  value={bookCategory}
                  onChange={(e) => setBookCategory(e.target.value as any)}
                  className="w-full bg-[#09090b] border border-[#27272a] px-2.5 py-1.5 rounded-[4px] text-zinc-100 text-[11px] focus:outline-none focus:border-[#06b6d4]"
                >
                  <option value="general">General ($40)</option>
                  <option value="fan-zone">Fan-Zone ($75)</option>
                  <option value="vip-suite">VIP Suite ($250)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[10px] text-[#71717a] font-bold font-mono uppercase block mb-1">Booking origin channel</label>
              <div className="flex space-x-3.5 pt-1">
                <label className="flex items-center space-x-1.5 text-xs text-zinc-300 font-sans cursor-pointer">
                  <input
                    type="radio"
                    checked={bookIsOnline}
                    onChange={() => setBookIsOnline(true)}
                    className="border-[#27272a] text-[#06b6d4] focus:ring-0"
                  />
                  <span>Online Web/iOS App</span>
                </label>
                <label className="flex items-center space-x-1.5 text-xs text-zinc-300 font-sans cursor-pointer">
                  <input
                    type="radio"
                    checked={!bookIsOnline}
                    onChange={() => setBookIsOnline(false)}
                    className="border-[#27272a] text-[#06b6d4] focus:ring-0"
                  />
                  <span>Onsite Ticket Window</span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              id="confirm-ticket-issue"
              className="w-full py-2 bg-[#06b6d4] hover:bg-[#0891b2] text-[#09090b] font-bold rounded-[4px] text-[10px] font-mono tracking-wider uppercase transition shadow-lg cursor-pointer"
            >
              Print Ticket Receipt
            </button>
          </form>
        </div>

        {/* Barcode RFID E-Ticket Scanner simulator */}
        <div className="bg-[#18181b] border border-[#27272a] p-4 rounded-[4px] shadow-xl flex flex-col justify-between" id="turnstile-scanner-portal">
          <div>
            <div className="flex items-center space-x-2 border-b border-[#27272a] pb-2.5 mb-3.5 font-mono">
              <QrCode size={14} className="text-[#06b6d4]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">Gates Scanner Terminal</h3>
            </div>

            <p className="text-[11px] text-[#a1a1aa] mb-3">
              Spectator entry requires scanning. Enter or select any ticket barcode from the list to trigger turnstile admission loops.
            </p>

            <div className="space-y-3">
              <div className="flex space-x-1.5">
                <input
                  type="text"
                  value={scannedIdInput}
                  onChange={(e) => setScannedIdInput(e.target.value)}
                  placeholder="e.g. TCK-55291-B"
                  className="flex-1 bg-[#09090b] border border-[#27272a] px-2.5 py-1.5 rounded-[4px] text-zinc-100 text-[11px] focus:outline-none focus:border-[#06b6d4] font-mono"
                />
                
                <button
                  type="button"
                  id="scan-ticket-btn"
                  onClick={() => handleScanVerify(scannedIdInput)}
                  className="px-3.5 bg-zinc-800 hover:bg-[#27272a] text-[#fafafa] font-bold text-[10px] font-mono uppercase tracking-wider rounded-[4px] border border-[#27272a] transition duration-150 cursor-pointer"
                >
                  Scan
                </button>
              </div>

              {/* Quick Pick Ticket helper */}
              <div className="flex wrap gap-1 pb-1">
                <span className="text-[8.5px] text-[#71717a] font-mono uppercase mr-1 mt-1">Registry:</span>
                {tickets.slice(0, 3).map(t => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      setScannedIdInput(t.id);
                      handleScanVerify(t.id);
                    }}
                    className={`text-[9.5px] font-mono px-1.5 py-0.5 rounded-sm border ${
                      t.status === 'scanned' 
                        ? 'bg-zinc-950 border-[#27272a] text-zinc-600 line-through' 
                        : 'bg-zinc-800 border-zinc-700 text-[#06b6d4] hover:border-[#06b6d4]'
                    }`}
                  >
                    {t.id.split('-')[1]}
                  </button>
                ))}
              </div>

              {/* Verification diagnostic board */}
              <div className="bg-[#09090b]/80 p-3 rounded-[4px] border border-[#212124] min-h-[96px] text-xs font-mono relative">
                <div className="text-[8.5px] text-zinc-500 uppercase pb-1.5 border-b border-[#212124] flex justify-between">
                  <span>RFID Diagnostic Screen</span>
                  <span>IP: 10.0.18.243</span>
                </div>

                {verificationFeedback ? (
                  <div className="space-y-1.5 pt-2 animate-[fadeIn_0.2s_ease]">
                    <div className="flex items-center space-x-1">
                      {verificationFeedback.success ? (
                        <CheckCircle2 size={13} className="text-[#22c55e]" />
                      ) : (
                        <AlertTriangle size={13} className="text-[#ef4444]" />
                      )}
                      
                      <strong className={verificationFeedback.success ? 'text-emerald-400 uppercase tracking-wider text-[10px]' : 'text-[#ef4444] uppercase tracking-wider text-[10px]'}>
                        {verificationFeedback.success ? 'SCAN_SUCCESS' : 'SCAN_REJECTED'}
                      </strong>
                    </div>

                    <p className="text-[10.5px] text-zinc-300 leading-tight">
                      {verificationFeedback.msg}
                    </p>
                  </div>
                ) : (
                  <div className="pt-4 flex flex-col items-center justify-center text-zinc-600">
                    <Terminal size={18} className="animate-pulse mb-1" />
                    <span className="text-[9.5px] tracking-wide">WAITING FOR TICKET BEACON...</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <p className="text-[9px] font-mono text-zinc-500 pt-2.5 mt-2.5 border-t border-[#27272a] text-center uppercase">
            Scanner automatically registers entrance increments
          </p>
        </div>

        {/* Swags and kits tracker desk */}
        <div className="bg-[#18181b] border border-[#27272a] p-4 rounded-[4px] shadow-xl flex flex-col justify-between" id="swags-kit-giveaways">
          <div>
            <div className="flex items-center space-x-2 border-b border-[#27272a] pb-2.5 mb-3.5">
              <ShoppingBag size={14} className="text-[#06b6d4]" />
              <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-200">Swags & Cheer Kits</h3>
            </div>

            <p className="text-[11px] text-[#a1a1aa] mb-4">
              Authorized volunteers distribute souvenirs, caps, and noise-makers to valid ticket holders at gates.
            </p>

            <div className="space-y-3">
              {swagInventory.map(item => {
                const percent = (item.distributed / item.total) * 100;
                return (
                  <div key={item.id} className="space-y-1">
                    <div className="flex justify-between items-center text-[10.5px]">
                      <span className="font-bold text-[#fafafa]">{item.name}</span>
                      <span className="text-[9px] text-[#71717a] font-mono">
                        {item.distributed.toLocaleString()} / {item.total.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-[#09090b] h-1.5 rounded-[4px] overflow-hidden border border-[#27272a]/40">
                        <div 
                          className="h-full bg-cyan-400 rounded-sm"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      
                      <div className="flex space-x-1">
                        <button
                          type="button"
                          onClick={() => claimSwagKits(item.id, 100)}
                          className="px-1 py-0.25 bg-zinc-800 text-[8.5px] text-zinc-300 border border-zinc-700 hover:text-cyan-400 hover:border-cyan-400 rounded-sm cursor-pointer"
                        >
                          +100
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3.5 border-t border-[#27272a] bg-[#06b6d4]/5 p-2 rounded-sm text-[9.5px] font-mono text-cyan-400">
            <strong>Cheer Kits Ratio: </strong> Live dispatchers verify stadium seat numbers coordinate flags before handover.
          </div>
        </div>

      </div>

      {/* Database registry log display */}
      <div className="bg-[#18181b] border border-[#27272a] p-4 rounded-[4px] shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#27272a] pb-2.5 mb-3.5">
          <div className="flex items-center space-x-2">
            <Users size={14} className="text-[#06b6d4]" />
            <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-[#fafafa]">Issued Ticket ledger Index ({tickets.length})</h4>
          </div>
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-xs text-zinc-300 font-mono">
            <thead className="bg-[#09090b] text-[10px] text-zinc-500 uppercase border-b border-[#27272a]">
              <tr>
                <th className="p-2">Ticket ID</th>
                <th className="p-2">Holder Name</th>
                <th className="p-2">Zone Seating</th>
                <th className="p-2 font-sans">Tier</th>
                <th className="p-2">Cost</th>
                <th className="p-2">Channel</th>
                <th className="p-2">Status</th>
                <th className="p-2 text-right">Actions</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-[#27272a]/50">
              {tickets.map(t => (
                <tr key={t.id} className="hover:bg-zinc-900/40">
                  <td className="p-2 text-slate-100 font-bold">{t.id}</td>
                  <td className="p-2 font-sans font-medium text-zinc-200">{t.holderName}</td>
                  <td className="p-2 text-[#06b6d4]">{t.zoneName}</td>
                  <td className="p-2 font-sans uppercase text-[10px] bg-zinc-800/20 px-1 py-0.5 rounded-sm inline-block my-1.5">{t.seatCategory}</td>
                  <td className="p-2 text-amber-400">${t.seatPrice}</td>
                  <td className="p-2">
                    <span className={`text-[9px] uppercase font-sans ${t.isOnline ? 'text-cyan-400' : 'text-zinc-500'}`}>
                      {t.isOnline ? 'Online' : 'Onsite'}
                    </span>
                  </td>
                  <td className="p-2">
                    <span className={`text-[9px] uppercase px-1.5 py-0.25 rounded-md ${
                      t.status === 'valid' ? 'bg-[#06b6d4]/10 text-cyan-400 border border-cyan-400/20' :
                      t.status === 'scanned' ? 'bg-[#22c55e]/10 text-emerald-400 border border-emerald-500/20' :
                      'bg-zinc-800 text-zinc-500'
                    }`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="p-2 text-right">
                    <button
                      type="button"
                      onClick={() => handleCancelTicket(t.id)}
                      className="text-zinc-500 hover:text-red-400 transition cursor-pointer p-1"
                      title="Revoke / Refund"
                    >
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
