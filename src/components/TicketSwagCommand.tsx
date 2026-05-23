/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  CreditCard, Ticket, CheckSquare, Sparkles, ShoppingBag, 
  AlertCircle, Users, QrCode, RefreshCw 
} from 'lucide-react';

interface TicketBooking {
  id: string;
  holderName: string;
  category: 'VIP' | 'General' | 'Pundits Box' | 'Premium';
  assignedGate: string;
  isVerified: boolean;
  seatNumber: string;
  hasKitReceived: boolean;
}

interface TicketSwagCommandProps {
  onAddNotification: (msg: string, severity: 'info' | 'warning' | 'error' | 'ai') => void;
  onIncrementGateCount: (gateId: string, amount: number) => void;
}

export default function TicketSwagCommand({
  onAddNotification,
  onIncrementGateCount,
}: TicketSwagCommandProps) {
  // Ticket Registry state
  const [bookings, setBookings] = useState<TicketBooking[]>([
    { id: 'TC-9241', holderName: 'Aishwarya Sen', category: 'VIP', assignedGate: 'gate-e', isVerified: true, seatNumber: 'A-12', hasKitReceived: true },
    { id: 'TC-8503', holderName: 'George McCourt', category: 'General', assignedGate: 'gate-a', isVerified: false, seatNumber: 'N-56', hasKitReceived: false },
    { id: 'TC-4721', holderName: 'Li Wei Chen', category: 'Premium', assignedGate: 'gate-d', isVerified: true, seatNumber: 'S-22', hasKitReceived: false },
    { id: 'TC-1092', holderName: 'Fatima Al-Sudairy', category: 'Pundits Box', assignedGate: 'gate-f', isVerified: false, seatNumber: 'W-04', hasKitReceived: false },
  ]);

  // Booking Form fields
  const [newName, setNewName] = useState('');
  const [newCat, setNewCat] = useState<'VIP' | 'General' | 'Pundits Box' | 'Premium'>('General');
  const [newGate, setNewGate] = useState('gate-a');

  // Scanner Simulator states
  const [scanInput, setScanInput] = useState('');
  const [scanResult, setScanResult] = useState<TicketBooking | null | 'notfound'>(null);
  const [isScanning, setIsScanning] = useState(false);

  // Swag & Kit supply meters (merchandise tracking at gates)
  const [kits, setKits] = useState([
    { id: 'kit-01', item: '🏏 Team India Cheering Flag', gate: 'Gate A', stock: 15, max: 200, unit: 'Flags' },
    { id: 'kit-02', item: '📣 Heavy Blowout Cheering Horns', gate: 'Gate D', stock: 85, max: 150, unit: 'Horns' },
    { id: 'kit-03', item: '👕 Fan Tribe Jerseys (L/M)', gate: 'Gate B', stock: 120, max: 150, unit: 'Jerseys' },
    { id: 'kit-04', item: '🔋 Portable Solar Ingress Fans', gate: 'Gate C', stock: 4, max: 100, unit: 'Fans' }, // Low stock alarm!
    { id: 'kit-05', item: '🥤 Brand Sponsor Water Flasks', gate: 'Gate E', stock: 190, max: 200, unit: 'Flasks' }
  ]);

  /**
   * Action: Register dynamic booking online
   */
  const handleCreateBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newTicket: TicketBooking = {
      id: `TC-${Math.floor(1000 + Math.random() * 9000)}`,
      holderName: newName,
      category: newCat,
      assignedGate: newGate,
      isVerified: false,
      seatNumber: `${newCat[0]}-${Math.floor(10 + Math.random() * 89)}`,
      hasKitReceived: false
    };

    setBookings(prev => [newTicket, ...prev]);
    onAddNotification(`E-Ticket ${newTicket.id} successfully booked for ${newName}!`, 'info');
    
    // Reset Form
    setNewName('');
  };

  /**
   * Action: Scan / Verify Voucher
   */
  const handleVerifyTicket = (id: string) => {
    setBookings(prev => prev.map(t => {
      if (t.id === id) {
        if (!t.isVerified) {
          onAddNotification(`Ticket verified successfully: Check-in approved for ${t.holderName} at ${t.assignedGate.toUpperCase()}`, 'info');
          // Increment actual gate count
          onIncrementGateCount(t.assignedGate, 1);
        }
        return { ...t, isVerified: true };
      }
      return t;
    }));
  };

  /**
   * Action: Distribute Swags
   */
  const handleDeliverKit = (ticketId: string) => {
    setBookings(prev => prev.map(t => {
      if (t.id === ticketId) {
        if (!t.hasKitReceived) {
          onAddNotification(`Cheering Swags & Kit handed over to ${t.holderName}. Enjoy the match!`, 'info');
        }
        return { ...t, hasKitReceived: true };
      }
      return t;
    }));
  };

  /**
   * Action: Bulk refill swag items
   */
  const handleRefillSwag = (kitId: string) => {
    setKits(prev => prev.map(k => {
      if (k.id === kitId) {
        onAddNotification(`Restocked ${k.item} counter near ${k.gate}. Inventory restored.`, 'info');
        return { ...k, stock: k.max };
      }
      return k;
    }));
  };

  /**
   * Quick scanner simulator look up
   */
  const triggerScanCode = (code: string) => {
    setIsScanning(true);
    setScanResult(null);
    setTimeout(() => {
      const match = bookings.find(b => b.id.toLowerCase() === code.trim().toLowerCase());
      if (match) {
        setScanResult(match);
        handleVerifyTicket(match.id);
      } else {
        setScanResult('notfound');
      }
      setIsScanning(false);
    }, 800);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4" id="ticket-swag-manager">
      
      {/* Col 1: Online Ticket Booking & Counters */}
      <div className="bg-[#18181b] border border-[#27272a] rounded-[4px] p-4 shadow-xl flex flex-col justify-between">
        <div>
          <div className="flex items-center space-x-2 border-b border-[#27272a] pb-2.5 mb-3.5">
            <Ticket size={14} className="text-[#06b6d4]" />
            <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-zinc-100">Live Ticket Counter booking</h3>
          </div>

          <p className="text-[10.5px] text-[#a1a1aa] mb-4 font-sans">
            Issue spectator entry passes dynamically. Newly booked electronic tickets appear instantly in our verify ledger.
          </p>

          <form onSubmit={handleCreateBooking} className="space-y-3">
            <div className="space-y-1">
              <label className="text-[9px] text-[#71717a] font-bold font-mono uppercase">Spectator Holder Name</label>
              <input
                type="text"
                placeholder="e.g. Rohini Sharma"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full bg-[#09090b] border border-[#27272a] px-2.5 py-1.5 rounded-[4px] text-zinc-100 text-[11px] focus:outline-none focus:border-[#06b6d4] font-sans"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[9px] text-[#71717a] font-bold font-mono uppercase">Ticket Class</label>
                <select
                  value={newCat}
                  onChange={(e) => setNewCat(e.target.value as any)}
                  className="w-full bg-[#09090b] border border-[#27272a] px-2 py-1.5 rounded-[4px] text-zinc-100 text-[11px] focus:outline-none focus:border-[#06b6d4]"
                >
                  <option value="General">General Stand</option>
                  <option value="Premium">Premium Club</option>
                  <option value="VIP">VIP Lounge</option>
                  <option value="Pundits Box">Pundits Box</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] text-[#71717a] font-bold font-mono uppercase">Assigned Entrance</label>
                <select
                  value={newGate}
                  onChange={(e) => setNewGate(e.target.value)}
                  className="w-full bg-[#09090b] border border-[#27272a] px-2 py-1.5 rounded-[4px] text-zinc-100 text-[11px] focus:outline-none focus:border-[#06b6d4]"
                >
                  <option value="gate-a">Gate A (North)</option>
                  <option value="gate-b">Gate B (East-N)</option>
                  <option value="gate-c">Gate C (East-S)</option>
                  <option value="gate-d">Gate D (South)</option>
                  <option value="gate-e">Gate E (West-S)</option>
                  <option value="gate-f">Gate F (West-N)</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-1.5 bg-[#06b6d4] hover:bg-[#0891b2] text-[#09090b] font-bold rounded-[4px] text-[10px] font-mono tracking-wider uppercase transition cursor-pointer"
            >
              Issue Digital Matchday Ticket
            </button>
          </form>
        </div>

        {/* Dynamic Verification QR Scanner simulation */}
        <div className="mt-4 pt-4 border-t border-[#27272a] space-y-2">
          <div className="flex items-center space-x-1.5">
            <QrCode size={12} className="text-[#06b6d4] animate-pulse" />
            <span className="text-[9.5px] font-mono font-bold uppercase tracking-wider text-slate-300">Voucher Scan & RFID check-in</span>
          </div>

          <div className="flex space-x-1.5">
            <input
              type="text"
              placeholder="Voucher ID (e.g. TC-8503)"
              value={scanInput}
              onChange={(e) => setScanInput(e.target.value)}
              className="flex-1 bg-[#09090b] border border-[#27272a] px-2.5 py-1 rounded-[4px] text-zinc-100 text-[11px] font-mono focus:outline-none focus:border-[#06b6d4]"
            />
            <button
              onClick={() => triggerScanCode(scanInput)}
              className="px-3 bg-[#27272a] hover:bg-[#3f3f46] text-zinc-200 border border-[#27272a] hover:border-[#3f3f46] text-[10px] font-mono rounded-[4px] transition flex items-center space-x-1 cursor-pointer"
            >
              {isScanning ? (
                <RefreshCw size={11} className="animate-spin" />
              ) : (
                <span>SCAN VOUCHER</span>
              )}
            </button>
          </div>

          {/* Render result feed */}
          {scanResult && (
            <div className={`p-2 rounded-[4px] text-[9.5px] font-mono border ${
              scanResult === 'notfound' 
                ? 'bg-rose-950/20 border-rose-500/20 text-rose-300' 
                : 'bg-emerald-950/20 border-emerald-500/20 text-emerald-300'
            }`}>
              {scanResult === 'notfound' ? (
                <span>⚠️ Ticket ID unrecognized. Double check digits.</span>
              ) : (
                <div className="flex justify-between items-center">
                  <span>✅ {scanResult.holderName} : Seat {scanResult.seatNumber} APPROVED at Gate {scanResult.assignedGate.toUpperCase().split('-')[1]}</span>
                  <span className="bg-[#22c55e]/10 px-1 rounded text-[8px] uppercase">MATCH</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Col 2: Swag & Fan-Kit Supply Depots */}
      <div className="bg-[#18181b] border border-[#27272a] rounded-[4px] p-4 shadow-xl space-y-3.5">
        <div className="flex items-center space-x-2 border-b border-[#27272a] pb-2.5">
          <ShoppingBag size={14} className="text-[#06b6d4]" />
          <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-zinc-100">Swags & Kit Distribution center</h3>
        </div>

        <p className="text-[10.5px] text-[#a1a1aa] font-sans">
          Track cheer items, flags, and jerseys distributed at gate checkpoints. Critical low supply triggers alert notifications.
        </p>

        <div className="space-y-3">
          {kits.map((k) => {
            const isLow = k.stock < 15;
            const percentage = (k.stock / k.max) * 100;
            return (
              <div key={k.id} className="p-2.5 bg-[#09090b]/50 border border-[#27272a] rounded-[4px] space-y-1.5">
                <div className="flex items-center justify-between text-[10.5px]">
                  <span className="font-bold text-slate-100 font-sans">{k.item}</span>
                  <span className="font-mono text-[9.5px] text-zinc-400">({k.gate})</span>
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400">
                  <div className="flex items-center space-x-1.5">
                    <span className={isLow ? 'text-[#ef4444] font-bold animate-pulse' : 'text-slate-300'}>
                      {k.stock} / {k.max} {k.unit}
                    </span>
                    {isLow && (
                      <span className="text-[8px] bg-[#ef4444]/10 text-[#ef4444] px-1 py-0.25 rounded-sm border border-[#ef4444]/20 font-bold uppercase tracking-wider">
                        CRITICAL REFILL REQUIRED
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => handleRefillSwag(k.id)}
                    className="hover:text-[#06b6d4] transition duration-150 decoration-none underline cursor-pointer text-[9px] uppercase"
                  >
                    Load Shipment
                  </button>
                </div>

                {/* Progress bar visual */}
                <div className="w-full bg-[#18181b] h-1 rounded-full overflow-hidden border border-[#27272a]/20">
                  <div 
                    className={`h-full transition-all duration-300 ${
                      isLow ? 'bg-[#ef4444]' : percentage < 50 ? 'bg-[#f59e0b]' : 'bg-[#06b6d4]'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Col 3: General Ticket Holder Registry */}
      <div className="bg-[#18181b] border border-[#27272a] rounded-[4px] p-4 shadow-xl space-y-3.5 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between border-b border-[#27272a] pb-2.5 mb-2.5">
            <div className="flex items-center space-x-2">
              <Users size={14} className="text-[#06b6d4]" />
              <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-zinc-100">Verify Check-In Grid ({bookings.length})</h3>
            </div>
            <span className="text-[8px] font-mono text-zinc-500 uppercase">Live Audit</span>
          </div>

          <div className="space-y-2 max-h-[190px] overflow-y-auto pr-1">
            {bookings.map((b) => (
              <div 
                key={b.id} 
                className={`p-2 rounded-[4px] border flex flex-col space-y-1.5 transition ${
                  b.isVerified 
                    ? 'bg-[#09090b]/40 border-[#27272a]/80' 
                    : 'bg-amber-950/10 border-[#f59e0b]/20'
                }`}
              >
                <div className="flex items-center justify-between text-[10.5px]">
                  <div className="flex items-center space-x-1.5">
                    <span className="font-mono text-zinc-400 font-bold">{b.id}</span>
                    <strong className="text-zinc-100 font-sans">{b.holderName}</strong>
                  </div>
                  <span className={`text-[8px] font-mono px-1 py-0.25 rounded-sm uppercase ${
                    b.category === 'VIP' ? 'bg-[#06b6d4]/10 text-[#06b6d4]' :
                    b.category === 'Premium' ? 'bg-[#a855f7]/10 text-purple-400' : 'bg-zinc-800 text-zinc-400'
                  }`}>
                    {b.category}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[9.5px] font-mono text-zinc-400">
                  <span>Entrance: <strong>{b.assignedGate.toUpperCase().split('-')[1]}</strong> &bull; Seat: <strong>{b.seatNumber}</strong></span>
                  <div className="flex space-x-2">
                    
                    {/* Action - Verify Check-in */}
                    {!b.isVerified ? (
                      <button
                        onClick={() => handleVerifyTicket(b.id)}
                        className="text-[#f59e0b] hover:text-[#fbbf24] hover:underline"
                      >
                        Verify Reader
                      </button>
                    ) : (
                      <span className="text-emerald-400 font-bold uppercase tracking-wider">Checked In</span>
                    )}

                    <span>&bull;</span>

                    {/* Action - Kit Swag Received */}
                    {!b.hasKitReceived ? (
                      <button
                        onClick={() => handleDeliverKit(b.id)}
                        disabled={!b.isVerified}
                        className={`font-bold ${b.isVerified ? 'text-[#06b6d4] hover:underline' : 'text-zinc-600 cursor-not-allowed'}`}
                      >
                        Issue Swag
                      </button>
                    ) : (
                      <span className="text-[#06b6d4] uppercase">Swag Issued</span>
                    )}

                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live counter statistic banner */}
        <div className="bg-[#09090b] border border-[#27272a] p-2.5 rounded-[4px] text-[10px] font-mono flex items-center justify-between text-[#71717a]">
          <span>RFID VALIDATED GATE INGRESS RATE:</span>
          <span className="text-[#fafafa] font-bold">
            {bookings.filter(b => b.isVerified).length} / {bookings.length} TICKETS ({(bookings.filter(b => b.isVerified).length / bookings.length * 100).toFixed(0)}%)
          </span>
        </div>

      </div>

    </div>
  );
}
