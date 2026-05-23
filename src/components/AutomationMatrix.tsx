/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, Settings, Zap, Play, Volume2, Shield, 
  ToggleLeft, AlertOctagon, HelpCircle, Flame, BadgeCheck
} from 'lucide-react';
import { StadiumZone } from '../types';

interface AutomationMatrixProps {
  zones: StadiumZone[];
  isDrillActive: boolean;
  onTriggerGlobalDrill: () => void;
  onAddNotification: (message: string, severity: 'info' | 'warning' | 'error' | 'ai') => void;
  onModifyZoneDensity?: (zoneId: string, count: number) => void;
  onSpeak?: (msg: string) => void;
}

interface AutomationRule {
  id: string;
  name: string;
  metricType: 'gate_density' | 'temperature' | 'unresolved_incidents' | 'critical_overcrowding';
  threshold: number;
  isArmed: boolean;
  actionCode: string;
  description: string;
}

export default function AutomationMatrix({
  zones,
  isDrillActive,
  onTriggerGlobalDrill,
  onAddNotification,
  onSpeak,
}: AutomationMatrixProps) {
  // Configurable rules
  const [rules, setRules] = useState<AutomationRule[]>([
    {
      id: 'rule-01',
      name: 'Gate Turnstile Influx Rerouting Script',
      metricType: 'gate_density',
      threshold: 85, // percent
      isArmed: true,
      actionCode: 'ACTIVATE_TACTICAL_ROUTE_DEFLECTION_03',
      description: 'When any entry gate exceeds threshold, automatically redirect incoming fans to Gate F and light alternate path guides.'
    },
    {
      id: 'rule-02',
      name: 'Automatic Thermal Hydration Advisory',
      metricType: 'temperature',
      threshold: 32, // Celsius
      isArmed: true,
      actionCode: 'BROADCAST_PA_HYDRATION_ALERT',
      description: 'When temperature sensors exceed limit, launch water cafe cart dispatches, broadcast PA alerts, and alert medical stewards.'
    },
    {
      id: 'rule-03',
      name: 'Rapid Multi-Group Dispatch Siren',
      metricType: 'unresolved_incidents',
      threshold: 3, // incidents
      isArmed: false,
      actionCode: 'SOUND_GLOBAL_AUXILIARY_SIRENS',
      description: 'When outstanding active incidents exceed threshold, automatically sound stadium-wide sirens and engage backup rescue units.'
    },
    {
      id: 'rule-04',
      name: 'Sponsor Screen Override Command',
      metricType: 'critical_overcrowding',
      threshold: 92, // percent occupancy
      isArmed: true,
      actionCode: 'FLASH_EMERGENCY_EXIT_ROUTES_ON_ADS',
      description: 'If active stand occupancy rises past threshold, hijack marketing digital boards to show responsive emergency arrows instead.'
    }
  ]);

  // Simulated metrics sliders for sandboxing
  const [simGateDensity, setSimGateDensity] = useState<number>(75);
  const [simTemp, setSimTemp] = useState<number>(30);
  const [simActiveIncidents, setSimActiveIncidents] = useState<number>(1);
  const [simStandDensity, setSimStandDensity] = useState<number>(80);

  // Track fired log lists
  const [firedScripts, setFiredScripts] = useState<{
    id: string;
    ruleName: string;
    actionExecuted: string;
    timestamp: string;
  }[]>([]);

  // Watch simulated metrics against armed rules
  useEffect(() => {
    rules.forEach(rule => {
      if (!rule.isArmed) return;

      let crossed = false;
      let valChecked = 0;
      let unit = '';

      if (rule.metricType === 'gate_density') {
        crossed = simGateDensity > rule.threshold;
        valChecked = simGateDensity;
        unit = '%';
      } else if (rule.metricType === 'temperature') {
        crossed = simTemp > rule.threshold;
        valChecked = simTemp;
        unit = '°C';
      } else if (rule.metricType === 'unresolved_incidents') {
        crossed = simActiveIncidents >= rule.threshold;
        valChecked = simActiveIncidents;
        unit = ' logs';
      } else if (rule.metricType === 'critical_overcrowding') {
        crossed = simStandDensity > rule.threshold;
        valChecked = simStandDensity;
        unit = '%';
      }

      // If crossed and script not already marked as recently fired inside firedScripts list
      const alreadyFired = firedScripts.some(f => f.id === rule.id && (Date.now() - new Date(f.timestamp).getTime()) < 15000);
      
      if (crossed && !alreadyFired) {
        // Trigger automated action!
        const log = {
          id: rule.id,
          ruleName: rule.name,
          actionExecuted: rule.actionCode,
          timestamp: new Date().toISOString()
        };
        setFiredScripts(prev => [log, ...prev].slice(0, 10));

        // Execute specific actions
        onAddNotification(`AUTOMATION RULE FIRED: "${rule.name}" triggered dynamically!`, 'warning');
        
        if (rule.actionCode === 'SOUND_GLOBAL_AUXILIARY_SIRENS' && !isDrillActive) {
          onTriggerGlobalDrill();
        }

        // Voice TTS trigger
        if (onSpeak) {
          if (rule.actionCode === 'BROADCAST_PA_HYDRATION_ALERT') {
            onSpeak(`Attention. Temperature has reached ${valChecked} degrees. Hydration Cafe Carts are now fully active across all stands. Please stay hydrated.`);
          } else if (rule.actionCode === 'ACTIVATE_TACTICAL_ROUTE_DEFLECTION_03') {
            onSpeak(`Gate inflow congestion alert. Activating automatic rerouting lanes. Please dispatch stewards to alternative Gate F.`);
          } else if (rule.actionCode === 'FLASH_EMERGENCY_EXIT_ROUTES_ON_ADS') {
            onSpeak(`High crowd alert. Redirecting crowd through auxiliary corridors.`);
          }
        }
      }
    });
  }, [simGateDensity, simTemp, simActiveIncidents, simStandDensity, rules]);

  const toggleArm = (ruleId: string) => {
    setRules(prev => prev.map(r => r.id === ruleId ? { ...r, isArmed: !r.isArmed } : r));
    onAddNotification(`Automation configuration altered. Safeguard status updated.`, 'info');
  };

  const forceTriggerRule = (rule: AutomationRule) => {
    const log = {
      id: rule.id,
      ruleName: rule.name,
      actionExecuted: rule.actionCode,
      timestamp: new Date().toISOString()
    };
    setFiredScripts(prev => [log, ...prev]);
    onAddNotification(`RULE OVERRIDE VETO: Manual execution of "${rule.name}" completed.`, 'info');

    if (onSpeak) {
      onSpeak(`Executing automated tactical script: ${rule.actionCode.replace(/_/g, ' ')}`);
    }
  };

  // Automatically test a severe scenario to demonstrate full matrix capability
  const triggerCrisisTest = () => {
    setSimGateDensity(96);
    setSimTemp(34);
    setSimActiveIncidents(4);
    setSimStandDensity(95);
    onAddNotification(`CRITICAL EMERGENCY SIMULATED: Telemetry streams forced to red hazard limits. Automated matrices armed & responsive!`, 'error');
  };

  const resetSimValue = () => {
    setSimGateDensity(70);
    setSimTemp(28);
    setSimActiveIncidents(1);
    setSimStandDensity(65);
    onAddNotification(`Telemetry parameters normalized. Clear green standards reinstated.`, 'info');
  };

  return (
    <div className="space-y-4" id="automation-matrix-workspace">
      
      {/* Overview Block */}
      <div className="bg-[#18181b]/95 border border-[#27272a] p-4 rounded-[4px] shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-xs font-bold font-mono tracking-widest text-[#fafafa] uppercase flex items-center">
            ⚡ Automated Emergency Response Matrix
          </h3>
          <p className="text-[10.5px] text-[#a1a1aa] font-sans mt-0.5">
            Decentralized guardrails linking physical turnstile data and temperatures to active stadium dispatch rules.
          </p>
        </div>

        <div className="flex space-x-2">
          <button
            type="button"
            id="sim-crisis-btn"
            onClick={triggerCrisisTest}
            className="px-3 py-1.5 bg-[#ef4444] hover:bg-red-650 text-[#fafafa] text-[10px] font-mono tracking-wider font-bold rounded-[4px] uppercase border border-red-500/25 transition cursor-pointer"
          >
            Simulate Safety Incident
          </button>
          
          <button
            type="button"
            id="reset-sim-btn"
            onClick={resetSimValue}
            className="px-3 py-1.5 bg-zinc-805 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[10px] font-mono tracking-wider font-bold rounded-[4px] uppercase border border-[#27272a] transition cursor-pointer"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Rules Editor Panel */}
        <div className="lg:col-span-2 bg-[#18181b] border border-[#27272a] p-4 rounded-[4px] shadow-xl" id="matrix-rules-list">
          <div className="flex items-center space-x-2 border-b border-[#27272a] pb-2.5 mb-3.5">
            <Settings size={14} className="text-[#06b6d4]" />
            <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-[#fafafa]">Active Automation Directives</h4>
          </div>

          <div className="space-y-3">
            {rules.map((rule) => {
              return (
                <div 
                  key={rule.id} 
                  className={`p-3.5 rounded-[4px] border ${
                    rule.isArmed ? 'bg-[#09090b]/75 border-[#27272a]' : 'bg-zinc-950/20 border-[#27272a]/40 opacity-70'
                  } transition duration-150`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2 flex-wrap">
                        <span className={`text-[9px] font-mono font-bold px-1.5 py-0.25 rounded-sm ${
                          rule.isArmed ? 'bg-[#06b6d4]/10 text-[#06b6d4] border border-[#06b6d4]/15' : 'bg-zinc-800 text-zinc-500'
                        }`}>
                          {rule.isArmed ? 'ARMED & WATCHING' : 'DISARMED STATE'}
                        </span>
                        
                        <span className="text-[10px] font-mono font-bold text-zinc-300">
                          {rule.name}
                        </span>
                      </div>

                      <p className="text-[11px] text-zinc-400 font-sans">
                        {rule.description}
                      </p>
                    </div>

                    {/* Toggle button */}
                    <button
                      type="button"
                      onClick={() => toggleArm(rule.id)}
                      className={`text-[9px] font-mono font-bold px-2 py-1 rounded-[4px] uppercase tracking-wider transition duration-150 cursor-pointer ${
                        rule.isArmed ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/5 text-rose-400 border border-red-500/15'
                      }`}
                    >
                      {rule.isArmed ? 'Armed' : 'Disarmed'}
                    </button>
                  </div>

                  <div className="mt-3.5 pt-3.5 border-t border-[#27272a]/60 flex items-center justify-between flex-wrap gap-2 text-[10px]">
                    <div className="flex items-center space-x-1.5 text-zinc-500 font-mono">
                      <span>Trigger Threshold: </span>
                      <strong className="text-[#fafafa]">
                        {rule.threshold}
                        {rule.metricType === 'temperature' ? '°C' : '%'}
                      </strong>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-[9.5px] font-mono text-cyan-400 bg-cyan-950/40 px-1.5 py-0.25 rounded-sm border border-cyan-500/10">
                        {rule.actionCode}
                      </span>
                      
                      <button
                        type="button"
                        onClick={() => forceTriggerRule(rule)}
                        className="p-1 text-zinc-400 hover:text-[#fafafa] bg-zinc-800/65 hover:bg-zinc-800 transition rounded-sm border border-[#27272a] cursor-pointer"
                        title="Veto Trigger Script"
                      >
                        <Play size={10} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Diagnostic Simulator Sliders Board */}
        <div className="space-y-4">
          
          <div className="bg-[#18181b] border border-[#27272a] p-4 rounded-[4px] shadow-xl space-y-4" id="simulation-telemetry-panel">
            <div className="flex items-center space-x-2 border-b border-[#27272a] pb-2.5 mb-1.5">
              <Zap size={14} className="text-[#06b6d4]" />
              <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-[#fafafa]">Live Telemetry Sliders</h4>
            </div>

            {/* Slide 1: Inflow Density */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10.5px]">
                <span className="font-mono text-zinc-300">Turnstile Inflow Density:</span>
                <span className={`font-mono font-bold ${simGateDensity > 85 ? 'text-[#ef4444]' : 'text-cyan-400'}`}>
                  {simGateDensity}%
                </span>
              </div>
              <input 
                type="range"
                min="30"
                max="100"
                value={simGateDensity}
                onChange={(e) => setSimGateDensity(parseInt(e.target.value))}
                className="w-full h-1 bg-[#09090b] rounded-lg appearance-none cursor-pointer accent-[#06b6d4]"
              />
              <span className="text-[8.5px] text-zinc-500 block">Trigger point: 85% Overcapacity deflection script</span>
            </div>

            {/* Slide 2: Temp sensor */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10.5px]">
                <span className="font-mono text-zinc-300">Stadium Core Temperature:</span>
                <span className={`font-mono font-bold ${simTemp > 32 ? 'text-[#ef4444]' : 'text-cyan-400'}`}>
                  {simTemp}°C
                </span>
              </div>
              <input 
                type="range"
                min="20"
                max="40"
                value={simTemp}
                onChange={(e) => setSimTemp(parseInt(e.target.value))}
                className="w-full h-1 bg-[#09090b] rounded-lg appearance-none cursor-pointer accent-[#06b6d4]"
              />
              <span className="text-[8.5px] text-zinc-500 block">Trigger point: 32°C Thermal PA announcements</span>
            </div>

            {/* Slide 3: Incident queue volume */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10.5px]">
                <span className="font-mono text-zinc-300">Active Handlers Incident Logs:</span>
                <span className={`font-mono font-bold ${simActiveIncidents >= 3 ? 'text-[#ef4444]' : 'text-cyan-400'}`}>
                  {simActiveIncidents} logs
                </span>
              </div>
              <input 
                type="range"
                min="0"
                max="5"
                value={simActiveIncidents}
                onChange={(e) => setSimActiveIncidents(parseInt(e.target.value))}
                className="w-full h-1 bg-[#09090b] rounded-lg appearance-none cursor-pointer accent-[#06b6d4]"
              />
              <span className="text-[8.5px] text-zinc-500 block">Trigger point: 3 Unresolved emergency sirens trigger</span>
            </div>

            {/* Slide 4: Stand Congestion */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10.5px]">
                <span className="font-mono text-zinc-300">Stands Peak Seat Density:</span>
                <span className={`font-mono font-bold ${simStandDensity > 92 ? 'text-[#ef4444]' : 'text-cyan-400'}`}>
                  {simStandDensity}%
                </span>
              </div>
              <input 
                type="range"
                min="40"
                max="100"
                value={simStandDensity}
                onChange={(e) => setSimStandDensity(parseInt(e.target.value))}
                className="w-full h-1 bg-[#09090b] rounded-lg appearance-none cursor-pointer accent-[#06b6d4]"
              />
              <span className="text-[8.5px] text-zinc-500 block">Trigger point: 92% Corporate board exit routes overlay</span>
            </div>
          </div>

          {/* Fired log terminal */}
          <div className="bg-[#18181b] border border-[#27272a] p-4 rounded-[4px] shadow-xl flex-1 text-xs">
            <div className="flex items-center space-x-2 border-b border-[#27272a] pb-2 mb-2">
              <BadgeCheck size={14} className="text-[#22c55e]" />
              <h4 className="text-xs font-bold font-mono uppercase text-[#fafafa]">Script Automation Logs</h4>
            </div>

            <div className="space-y-2 max-h-[140px] overflow-y-auto font-mono text-[10px] pr-1">
              {firedScripts.length === 0 ? (
                <p className="text-zinc-500 py-6 text-center">Standby: Operations compliant. No automation rules triggered yet.</p>
              ) : (
                firedScripts.map((f, i) => (
                  <div key={i} className="p-2 bg-zinc-950/40 rounded border border-[#27272a]/60 space-y-1 text-[10.5px]">
                    <div className="flex justify-between text-[9px] text-[#06b6d4] font-bold">
                      <span>FIRED</span>
                      <span>{new Date(f.timestamp).toLocaleTimeString()}</span>
                    </div>
                    
                    <p className="text-zinc-200 truncate">{f.ruleName}</p>
                    <p className="text-[9.5px] text-[#a1a1aa] uppercase font-bold text-zinc-400 font-mono">CODE: {f.actionExecuted}</p>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
