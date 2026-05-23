/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PlayCircle, Sparkles, AlertOctagon, Undo, ShieldAlert, BadgeCheck, Zap } from 'lucide-react';

interface HappyPathDemoProps {
  currentStep: number;
  onSetStep: (step: number) => void;
  onResetDemo: () => void;
}

/**
 * Highly strategic Matchday Pitch Walkthrough wizard.
 * Enables clicking curated stages of a stadium crisis to show off flawless live demo recovery.
 */
export default function HappyPathDemo({
  currentStep,
  onSetStep,
  onResetDemo,
}: HappyPathDemoProps) {
  const steps = [
    {
      index: 1,
      title: 'Phase 1: Gates Ingress Surge',
      badge: 'STRESS TEST',
      description: 'Pre-match peak crowd. North Gate A turnstile readers clog up. Visual Heatmaps trigger flashing red bottlenecks.',
      accent: 'text-amber-400 border-amber-500/20 bg-amber-500/5',
    },
    {
      index: 2,
      title: 'Phase 2: Emergency Siren Triage',
      badge: 'ALARM ACTIVE',
      description: 'A spectator collapses in North Stand L1 due to high humidity. Alarms flash on the stadium vector grid.',
      accent: 'text-red-400 border-red-500/20 bg-red-500/5',
    },
    {
      index: 3,
      title: 'Phase 3: Deep Gemini Rerouting',
      badge: 'AI DISPATCH',
      description: 'Operator triggers Gemini Co-Pilot. Flash 3.5 digests real-time crowd numbers and returns tactical evacuation pathways.',
      accent: 'text-indigo-400 border-indigo-500/20 bg-indigo-500/5',
    },
    {
      index: 4,
      title: 'Phase 4: Full Safe Clearance',
      badge: 'HAPPY ENDING',
      description: 'All safety gates clear of bottlenecks, emergency dispatch settles incident, overall stadium grid returns to stable green checkmarks.',
      accent: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5',
    }
  ];

  return (
    <div className="bg-[#18181b] border border-[#27272a] rounded-[4px] p-4 shadow-2xl space-y-3.5" id="happy-path-deck">
      
      {/* Wizard Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#27272a] pb-2.5">
        <div className="flex items-center space-x-2">
          <div className="p-1 px-2.5 bg-[#06b6d4]/10 text-[#06b6d4] rounded-[4px] border border-[#06b6d4]/20 text-[10px] font-mono flex items-center space-x-1.5 font-bold animate-pulse">
            <Zap size={11} className="text-[#22d3ee]" />
            <span>PITCH MODULE</span>
          </div>
          <h4 className="text-[11px] font-bold font-sans text-slate-100 uppercase tracking-widest">MATCHDAY CRISIS DIRECTIVES</h4>
        </div>

        <button
          id="btn-scen-reset"
          onClick={onResetDemo}
          className="text-[9px] font-mono flex items-center space-x-1 py-1 px-2 bg-[#27272a] hover:bg-[#3f3f46] border border-[#27272a] text-slate-300 hover:text-white rounded-[4px] transition cursor-pointer"
        >
          <Undo size={11} />
          <span>Reset Outfield</span>
        </button>
      </div>

      <p className="text-[11px] text-[#a1a1aa] leading-relaxed max-w-4xl font-sans">
        Programmed step-by-step presentation scenario. Deliver a flawless pitch by marching through these chronological phases. Each step alters stadium telemetry to demonstrate real-time containment:
      </p>

      {/* Grid of step buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {steps.map((st) => {
          const isActive = currentStep === st.index;
          return (
            <button
              key={st.index}
              id={`scenario-step-${st.index}`}
              onClick={() => onSetStep(st.index)}
              className={`text-left p-3.5 rounded-[4px] border flex flex-col justify-between h-full transition-all duration-300 relative group cursor-pointer ${
                isActive
                  ? 'bg-[#09090b] border-[#06b6d4] shadow-md ring-1 ring-[#06b6d4]/20'
                  : 'bg-[#09090b]/40 border-[#27272a] hover:border-[#3f3f46] hover:bg-[#18181b]/40'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[8px] font-mono uppercase px-1.5 py-0.5 rounded font-black border ${st.accent}`}>
                    {st.badge}
                  </span>
                  
                  {isActive && (
                    <span className="w-2 h-2 rounded-full bg-[#06b6d4] animate-ping inline-block" />
                  )}
                </div>

                <h5 className={`text-xs font-bold leading-tight ${isActive ? 'text-[#06b6d4]' : 'text-slate-200 group-hover:text-slate-100'}`}>
                  {st.title}
                </h5>
                <p className="text-[10px] text-[#a1a1aa] mt-1.5 leading-normal">
                  {st.description}
                </p>
              </div>

              {/* Step indicator flag */}
              <div className="mt-3 pt-2 border-t border-[#27272a]/40 w-full flex items-center justify-between text-[9px] font-mono text-[#71717a]">
                <span>STAGE 0{st.index}</span>
                <span className={isActive ? 'text-[#06b6d4] font-bold' : ''}>
                  {isActive ? 'Simulating' : 'Prepare'}
                </span>
              </div>
            </button>
          );
        })}
      </div>

    </div>
  );
}
