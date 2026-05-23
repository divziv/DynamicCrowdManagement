/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Users, Activity, ShieldAlert, CheckCircle, Flame, ArrowRightLeft, Radio } from 'lucide-react';
import { StadiumZone, StadiumIncident } from '../types';

interface DashboardMetricsProps {
  zones: StadiumZone[];
  incidents: StadiumIncident[];
  onTriggerGlobalDrill: () => void;
  isDrillActive: boolean;
}

/**
 * High-performance KPIs and Command Action header.
 * Displays overall stadium density, turnstile speeds, bottleneck rates, and alarm triggers.
 */
export default function DashboardMetrics({
  zones,
  incidents,
  onTriggerGlobalDrill,
  isDrillActive,
}: DashboardMetricsProps) {
  
  // Calculate total capacities & counts
  const totalCapacity = zones
    .filter((z) => z.category === 'stand')
    .reduce((acc, current) => acc + current.capacity, 0);

  const currentSpectators = zones
    .filter((z) => z.category === 'stand')
    .reduce((acc, current) => acc + current.currentCount, 0);

  const averageDensityPercentage = totalCapacity > 0 ? (currentSpectators / totalCapacity) * 100 : 0;

  // Calculate gate throughput (average entry speed across gates)
  const gates = zones.filter((z) => z.category === 'gate');
  const gateCapacitySum = gates.reduce((sum, g) => sum + g.capacity, 0);
  const gatesOccupancySum = gates.reduce((sum, g) => sum + g.currentCount, 0);
  
  const totalThroughputCount = gates.reduce((sum, g) => sum + g.throughputRate, 0);

  // Severe bottleneck calculations
  const totalBottlenecks = zones.filter((z) => z.dangerLevel === 'critical' || z.dangerLevel === 'high').length;

  const unresolvedIncidents = incidents.filter((inc) => inc.status !== 'resolved');

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="kpi-metrics-grid">
      
      {/* Metric 1: Live Occupancy */}
      <div className="bg-[#18181b] border border-[#27272a] p-4 rounded-[4px] shadow-lg flex items-center justify-between" id="metric-stadium-occupancy">
        <div className="space-y-1 flex-1 pr-2">
          <div className="text-[10px] uppercase text-[#71717a] tracking-wider mb-1 font-semibold flex items-center space-x-1.5 font-mono">
            <Users size={12} className="text-[#06b6d4]" />
            <span>Attendance Density</span>
          </div>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-2xl font-bold font-mono text-[#06b6d4] tracking-tight neon-glow-cyan">
              {currentSpectators.toLocaleString()}
            </span>
            <span className="text-[10px] text-[#71717a] font-mono">
              / {totalCapacity.toLocaleString()}
            </span>
          </div>
          {/* Custom micro progress meter */}
          <div className="w-full bg-[#27272a] h-1 rounded-sm overflow-hidden mt-2">
            <div 
              className={`h-full transition-all duration-500 ${
                averageDensityPercentage > 90 ? 'bg-[#ef4444]' :
                averageDensityPercentage > 75 ? 'bg-[#f59e0b]' : 'bg-[#22c55e]'
              }`}
              style={{ width: `${Math.min(100, averageDensityPercentage)}%` }}
            />
          </div>
          <p className="text-[10px] text-[#a1a1aa] mt-1.5 font-mono">
            Stadium is <strong className="text-slate-200">{averageDensityPercentage.toFixed(1)}%</strong> overall capacity
          </p>
        </div>
      </div>

      {/* Metric 2: Aggregate Entry Flow */}
      <div className="bg-[#18181b] border border-[#27272a] p-4 rounded-[4px] shadow-lg flex items-center justify-between" id="metric-turnstile-throughput">
        <div className="space-y-1 flex-1 pr-2">
          <div className="text-[10px] uppercase text-[#71717a] tracking-wider mb-1 font-semibold flex items-center space-x-1.5 font-mono">
            <ArrowRightLeft size={12} className="text-[#06b6d4]" />
            <span>Gate Throughput Speed</span>
          </div>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-2xl font-bold font-mono text-[#06b6d4] tracking-tight neon-glow-cyan">
              {totalThroughputCount}
            </span>
            <span className="text-[10px] text-[#06b6d4] font-mono font-medium ml-1">
              fans/min
            </span>
          </div>
          {/* Target design capability bar */}
          <div className="w-full bg-[#27272a] h-1 rounded-sm overflow-hidden mt-2">
            <div 
              className="h-full bg-[#06b6d4] transition-all duration-300"
              style={{ width: `${Math.min(100, (totalThroughputCount / 1500) * 100)}%` }}
            />
          </div>
          <p className="text-[10px] text-[#a1a1aa] mt-1.5 font-mono">
            Design entry constraint: <strong className="text-slate-200">1,500 f/m</strong>
          </p>
        </div>
      </div>

      {/* Metric 3: Active Bottlenecks Alert Counter */}
      <div className="bg-[#18181b] border border-[#27272a] p-4 rounded-[4px] shadow-lg flex items-center justify-between" id="metric-active-hotspots">
        <div className="space-y-1 flex-1 pr-2">
          <div className="text-[10px] uppercase text-[#71717a] tracking-wider mb-1 font-semibold flex items-center space-x-1.5 font-mono">
            <Activity size={12} className="text-[#06b6d4]" />
            <span>Bottleneck Hotspots</span>
          </div>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-2xl font-bold font-mono text-[#06b6d4] tracking-tight neon-glow-cyan">
              {totalBottlenecks}
            </span>
            <span className={`text-[9px] font-mono font-bold uppercase py-0.5 px-1.5 rounded ml-2 border ${
              totalBottlenecks > 2 ? 'bg-red-500/10 text-[#ef4444] border-red-500/20 animate-pulse' : 'bg-[#27272a]/40 text-[#a1a1aa] border-[#27272a]'
            }`}>
              {totalBottlenecks > 2 ? 'Action Req' : 'Standby'}
            </span>
          </div>
          {/* Status color-fill overlay */}
          <div className="w-full bg-[#27272a] h-1 rounded-sm overflow-hidden mt-2">
            <div 
              className={`h-full transition-all duration-300 ${
                totalBottlenecks > 3 ? 'bg-[#ef4444]' :
                totalBottlenecks > 1 ? 'bg-[#f59e0b]' : 'bg-[#22c55e]'
              }`}
              style={{ width: `${Math.min(100, (totalBottlenecks / 6) * 100)}%` }}
            />
          </div>
          <p className="text-[10px] text-[#a1a1aa] mt-1.5 font-mono">
            Zones &gt;80% occupancy threshold
          </p>
        </div>
      </div>

      {/* Metric 4: Command Center Actions */}
      <div className="bg-[#18181b] border border-[#27272a] p-3.5 rounded-[4px] shadow-lg flex flex-col justify-between" id="command-quick-actions">
        <div>
          <div className="text-[10px] uppercase text-[#71717a] tracking-wider mb-1.5 font-semibold flex items-center space-x-1.5 font-mono">
            <Radio size={12} className={isDrillActive ? 'text-[#ef4444] animate-pulse' : 'text-[#06b6d4]'} />
            <span className="tracking-wide">Emergency Air Control</span>
          </div>
          
          <button
            id="trigger-drill-btn"
            onClick={onTriggerGlobalDrill}
            className={`w-full py-1.5 px-2.5 text-[10px] font-bold font-mono rounded-[4px] flex items-center justify-center space-x-1.5 transition-all duration-150 border uppercase tracking-wider cursor-pointer ${
              isDrillActive
                ? 'bg-[#ef4444] hover:bg-red-600 border-[#ef4444] text-white animate-pulse'
                : 'bg-[#27272a] hover:bg-[#3f3f46] border-[#27272a] text-[#ef4444] hover:text-red-400'
            }`}
          >
            <ShieldAlert size={12} />
            <span>{isDrillActive ? 'Deactivate Alarms' : 'Trigger Drill Alarms'}</span>
          </button>
        </div>
        
        {/* Counter of active emergency incidents */}
        <div className="flex items-center justify-between text-[9px] font-mono mt-2 pt-1.5 border-t border-[#27272a] text-[#71717a]">
          <span>UNRESOLVED:</span>
          <span className={`font-bold ${unresolvedIncidents.length > 0 ? 'text-[#ef4444]' : 'text-[#22c55e]'}`}>
            {unresolvedIncidents.length} REPORTS
          </span>
        </div>
      </div>

    </div>
  );
}
