/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Route, MapPin, Navigation, Signal, CheckCircle2, ArrowRight, ToggleLeft, ToggleRight } from 'lucide-react';
import { StadiumZone, RouteInstruction } from '../types';

interface RouteOptimizerProps {
  zones: StadiumZone[];
}

/**
 * Interactive Route Optimization & Crowd Deflection desk.
 * Auto-detects dense clusters or gating backlogs and configures active diversion arrows.
 */
export default function RouteOptimizer({ zones }: RouteOptimizerProps) {
  // Mock Route Instructions matching key bottlenecks
  const [instructions, setInstructions] = useState<RouteInstruction[]>([
    {
      id: 'route-01',
      sourceZoneId: 'gate-a', // Overcrowded Gate A
      destinationZoneId: 'gate-f', // Nearby Rapid exit/entry
      currentStatus: 'active',
      description: 'Deflect incoming spectator lines on the North Plaza towards Gate F (West North) bypass turnstiles.',
      divertedFlow: 45,
      safetyRating: 92,
    },
    {
      id: 'route-02',
      sourceZoneId: 'stand-south-l1', // Crowded stand
      destinationZoneId: 'gate-c', // Nearby exit route
      currentStatus: 'standby',
      description: 'Activate concourse signage directing South stand Level 1 guests to vacate via Gate C (Express East).',
      divertedFlow: 0,
      safetyRating: 88,
    }
  ]);

  const [activeNotification, setActiveNotification] = useState<string | null>(null);

  /**
   * Toggles route redirection status.
   */
  const handleToggleRoute = (routeId: string) => {
    setInstructions(prev => prev.map(inst => {
      if (inst.id === routeId) {
        const nextStatus = inst.currentStatus === 'active' ? 'standby' : 'active';
        
        // Show status brief toast
        setActiveNotification(`Action Corridor "${inst.id}" updated to ${nextStatus.toUpperCase()}`);
        setTimeout(() => setActiveNotification(null), 3000);

        return {
          ...inst,
          currentStatus: nextStatus,
          divertedFlow: nextStatus === 'active' ? 45 : 0
        };
      }
      return inst;
    }));
  };

  // Find actual bottlenecks matching zones
  const activeBottlenecks = zones.filter((z) => z.dangerLevel === 'critical' || z.dangerLevel === 'high');

  return (
    <div className="space-y-6" id="route-optimization-desk">
      
      {/* Toast Event Alerts */}
      {activeNotification && (
        <div className="fixed bottom-6 right-6 bg-indigo-605 bg-indigo-650 border border-indigo-500 text-slate-100 py-3 px-5 rounded-xl shadow-2xl flex items-center space-x-2 z-50 text-xs font-semibold animate-bounce duration-300">
          <Signal size={14} className="text-white animate-pulse" />
          <span>{activeNotification}</span>
        </div>
      )}

      {/* Main Panel Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left section: Automatic Bottleneck Detection Engine */}
        <div className="lg:col-span-1 bg-[#18181b] border border-[#27272a] rounded-[4px] p-4 shadow-2xl space-y-3.5">
          <div className="flex items-center space-x-2 border-b border-[#27272a] pb-2.5">
            <Route size={14} className="text-[#06b6d4]" />
            <h3 className="text-[11px] font-bold font-mono tracking-widest text-[#fafafa] uppercase">AI Bottleneck Detection</h3>
          </div>

          <p className="text-[11px] text-[#a1a1aa] leading-relaxed font-sans">
            Telemetry scanners cross-examine turnstile exit/entry limits. The following sectors are currently triggering alert overrides:
          </p>

          <div className="space-y-3">
            {activeBottlenecks.length === 0 ? (
              <div className="p-4 bg-[#09090b]/40 rounded-[4px] border border-[#27272a] text-center text-[10px] text-slate-500 font-mono">
                No acute congestion triggers active.
              </div>
            ) : (
              activeBottlenecks.map((b) => {
                const isGate = b.category === 'gate';
                const capacityPercent = (b.currentCount / b.capacity) * 100;

                return (
                  <div key={b.id} className="p-3 bg-[#09090b]/60 rounded-[4px] border border-[#ef4444]/15 flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center space-x-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#ef4444] animate-ping"></span>
                        <h4 className="text-[11px] font-bold text-slate-200">{b.name}</h4>
                      </div>
                      <p className="text-[10px] text-slate-400 font-mono">
                        {isGate ? 'Gate Inbound' : 'Stand Density'}: <strong className="text-slate-100">{capacityPercent.toFixed(0)}%</strong>
                      </p>
                    </div>

                    <span className="text-[8px] font-mono py-0.5 px-1.5 bg-[#ef4444]/10 text-[#ef4444] font-bold border border-[#ef4444]/20 rounded-[4px]">
                      CLOGGED ({b.throughputRate} P/M)
                    </span>
                  </div>
                );
              })
            )}
          </div>

          <div className="bg-[#09090b]/40 border border-[#27272a] rounded-[4px] p-3 space-y-1.5 mt-4 text-[9px] font-mono leading-normal text-slate-400">
            <div className="text-[10.5px] font-bold text-slate-300">Throughput Formula Index:</div>
            <p>Throughput index is determined as actual inflow rate over nominal flow barrier (Nominal limit = 250 fans/min).</p>
          </div>
        </div>

        {/* Right Section: Active Deflection Corridors */}
        <div className="lg:col-span-2 bg-[#18181b] border border-[#27272a] rounded-[4px] p-4 shadow-2xl space-y-3.5">
          <div className="flex items-center justify-between border-b border-[#27272a] pb-2.5">
            <div className="flex items-center space-x-2">
              <Navigation size={14} className="text-[#06b6d4]" />
              <h3 className="text-[11px] font-bold font-mono tracking-widest text-[#fafafa] uppercase">Active Crowd Deflection Route Plans</h3>
            </div>
            <span className="text-[9px] uppercase font-mono tracking-widest bg-[#22c55e]/10 text-[#22c55e] py-0.5 px-2 rounded-[4px] border border-[#22c55e]/20">
              Corridor Lock
            </span>
          </div>

          <p className="text-[11px] text-[#a1a1aa] leading-relaxed font-sans">
            Create bypass routes to distribute crowds towards under-utilized gates or external metro parking decks instantly.
          </p>

          <div className="space-y-3.5" id="deflection-route-cards">
            {instructions.map((inst) => {
              const src = zones.find((z) => z.id === inst.sourceZoneId);
              const dest = zones.find((z) => z.id === inst.destinationZoneId);

              return (
                <div 
                  key={inst.id} 
                  id={`route-card-${inst.id}`}
                  className={`p-3.5 rounded-[4px] border transition-all duration-300 ${
                    inst.currentStatus === 'active'
                      ? 'bg-[#09090b] border-[#06b6d4]/40 shadow-sm'
                      : 'bg-[#09090b]/20 border-[#27272a]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      
                      {/* Connection Route visual bar */}
                      <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold text-slate-100">
                        <span className="text-[#06b6d4] uppercase font-mono tracking-wider text-[10px]">{inst.id}</span>
                        <span className="text-[#3f3f46] text-[10px] font-mono">|</span>
                        <span className="flex items-center bg-[#27272a] px-2 py-0.5 rounded-[4px] text-[10px] text-slate-350 font-mono">
                          <MapPin size={9} className="mr-1 text-[#71717a]" />
                          {src?.name || inst.sourceZoneId}
                        </span>
                        <ArrowRight size={11} className="text-[#71717a]" />
                        <span className="flex items-center bg-[#06b6d4]/10 px-2 py-0.5 rounded-[4px] text-[10px] text-[#06b6d4] border border-[#06b6d4]/20 font-mono">
                          <MapPin size={9} className="mr-1 text-[#06b6d4]" />
                          {dest?.name || inst.destinationZoneId}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-300 leading-relaxed font-sans">{inst.description}</p>
                      
                      {/* Stats metrics of deflection */}
                      <div className="flex items-center space-x-6 pt-1 text-[9px] font-mono text-[#71717a]">
                        <span>Diverted Flow Rate: <strong className="text-slate-200">{inst.divertedFlow}%</strong></span>
                        <span>Clearance Index: <strong className="text-[#22c55e]">{inst.safetyRating}/100</strong></span>
                      </div>
                    </div>

                    {/* Switch Toggle State slider */}
                    <button
                      id={`btn-toggle-route-${inst.id}`}
                      onClick={() => handleToggleRoute(inst.id)}
                      className="text-[#71717a] hover:text-[#fafafa] transition duration-150 p-1 cursor-pointer"
                    >
                      {inst.currentStatus === 'active' ? (
                        <ToggleRight size={32} className="text-[#06b6d4]" />
                      ) : (
                        <ToggleLeft size={32} className="text-[#52525b]" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>

    </div>
  );
}
