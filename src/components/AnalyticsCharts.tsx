/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BarChart3, LineChart, TrendingUp, ShieldAlert } from 'lucide-react';
import { generateSeedHistoricalMetrics } from '../data/stadium-mesh';
import { StadiumZone } from '../types';

interface AnalyticsChartsProps {
  zones: StadiumZone[];
}

/**
 * Custom SVG-based interactive analytics rendering module.
 * Bypasses third-party chart compatibility limits, producing ultra-high-fidelity,
 * fully responsive, pure-SVG layouts with smooth vector transitions and hover cards.
 */
export default function AnalyticsCharts({ zones }: AnalyticsChartsProps) {
  const dataset = generateSeedHistoricalMetrics();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Focus only on Stands for density comparisons
  const stands = zones.filter((z) => z.category === 'stand');
  const maxStandCount = Math.max(...stands.map((s) => s.currentCount), 10000);

  // SVG dimensions for main trend line graph (viewBox="0 0 540 240")
  const svgW = 540;
  const svgH = 240;
  const paddingX = 50;
  const paddingY = 30;
  const chartW = svgW - paddingX * 2;
  const chartH = svgH - paddingY * 2;

  // Find max values in dataset for scaling
  const maxThroughput = Math.max(...dataset.map((d) => d.gateThroughputSpeed), 1);
  const maxAttendance = Math.max(...dataset.map((d) => d.attendanceCount), 1);

  /**
   * Translates data coords dynamically into SVG viewBox elements.
   */
  const getLineCoordinates = (val: number, max: number) => {
    const yRatio = val / max;
    return chartH - yRatio * chartH + paddingY;
  };

  // Generate line paths for Throughput Speed (Cyan)
  const linePoints = dataset.map((d, index) => {
    const x = paddingX + (index / (dataset.length - 1)) * chartW;
    const y = getLineCoordinates(d.gateThroughputSpeed, maxThroughput);
    return { x, y };
  });

  const pathD = linePoints.length > 0 
    ? `M ${linePoints[0].x} ${linePoints[0].y} ` + linePoints.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ')
    : '';

  const areaD = linePoints.length > 0
    ? `${pathD} L ${linePoints[linePoints.length - 1].x} ${chartH + paddingY} L ${linePoints[0].x} ${chartH + paddingY} Z`
    : '';

  return (
    <div className="space-y-4" id="analytics-grid-workspace">
      
      {/* KPI Overviews Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Peak Flow Card */}
        <div className="bg-[#18181b] border border-[#27272a] p-4 rounded-[4px] shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-[#71717a] font-mono tracking-widest uppercase font-bold">Turnstile Peak Spike</span>
            <TrendingUp size={13} className="text-[#22c55e] animate-pulse" />
          </div>
          <div className="flex items-baseline space-x-1.5">
            <h4 className="text-xl font-bold font-mono text-slate-100">1,200</h4>
            <span className="text-[9px] text-[#22c55e] font-mono">F/M EXITS</span>
          </div>
          <p className="text-[11px] text-[#a1a1aa] mt-1.5 font-sans">
            Peak load expected during final exit dispersal following last match over sequence.
          </p>
        </div>

        {/* Triage Event Spikes */}
        <div className="bg-[#18181b] border border-[#27272a] p-4 rounded-[4px] shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-[#71717a] font-mono tracking-widest uppercase font-bold">Triage Incident Rate</span>
            <ShieldAlert size={13} className="text-[#f59e0b]" />
          </div>
          <div className="flex items-baseline space-x-1.5">
            <h4 className="text-xl font-bold font-mono text-slate-100">2.4</h4>
            <span className="text-[9px] text-zinc-500 font-mono">INCIDENTS/HR</span>
          </div>
          <p className="text-[11px] text-[#a1a1aa] mt-1.5 font-sans">
            Average heat dehydration triage is closely following match temperature curve (33°C).
          </p>
        </div>

        {/* Efficiency Index */}
        <div className="bg-[#18181b] border border-[#27272a] p-4 rounded-[4px] shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-[#71717a] font-mono tracking-widest uppercase font-bold">Routing Clearance Score</span>
            <span className="text-[8px] bg-emerald-500/10 text-emerald-400 py-0.5 px-1.5 rounded-[4px] border border-emerald-500/20 font-mono font-bold">94% EFF</span>
          </div>
          <div className="flex items-baseline space-x-1.5">
            <h4 className="text-xl font-bold font-mono text-slate-100">92.4</h4>
            <span className="text-[9px] text-[#06b6d4] font-mono">INDEX PTS</span>
          </div>
          <p className="text-[11px] text-[#a1a1aa] mt-1.5 font-sans">
            Calculated routing efficiency scorecard based on dynamically updated gate alternatives.
          </p>
        </div>

      </div>

      {/* Responsive Core Charts Visuals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Chart A: Throughput Trend Area */}
        <div className="bg-[#18181b] border border-[#27272a] p-4 rounded-[4px] shadow-2xl flex flex-col justify-between" id="chart-throughput-trend">
          <div className="flex items-center justify-between border-b border-[#27272a] pb-2.5 mb-3">
            <div className="flex items-center space-x-2">
              <LineChart size={14} className="text-[#06b6d4]" />
              <span className="text-xs font-bold font-mono uppercase tracking-wider text-[#fafafa]">Matchday Flow Timeline (Gate Speed / min)</span>
            </div>
            <span className="text-[9px] text-zinc-500 font-mono">Update: Live</span>
          </div>

          <div className="relative w-full overflow-x-auto">
            <svg viewBox="0 0 540 240" className="w-full min-w-[400px] h-full" id="svg-trend-line">
              {/* Background grid lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
                const y = paddingY + chartH * ratio;
                const valueLabel = Math.round(maxThroughput * (1 - ratio));
                return (
                  <g key={`grid-y-${i}`}>
                    <line x1={paddingX} y1={y} x2={svgW - paddingX} y2={y} stroke="#27272a" strokeDasharray="3 3" strokeWidth="1" />
                    <text x={paddingX - 10} y={y + 3} textAnchor="end" fill="#52525b" className="text-[8px] font-mono">{valueLabel}</text>
                  </g>
                );
              })}

              {/* Area Underline shading */}
              <path d={areaD} fill="url(#cyan-grad)" className="opacity-15" />

              {/* Plotted Path Lines */}
              <path d={pathD} fill="none" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

              {/* Interactive Hover Nodes */}
              {linePoints.map((p, idx) => {
                const isHovered = hoveredIndex === idx;
                return (
                  <g key={`nodes-${idx}`} onMouseEnter={() => setHoveredIndex(idx)} onMouseLeave={() => setHoveredIndex(null)} className="cursor-pointer">
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r={isHovered ? '6' : '3.5'}
                      fill={isHovered ? '#22d3ee' : '#06b6d4'}
                      stroke="#18181b"
                      strokeWidth="1.5"
                    />
                    
                    {/* Tick label under X Axis */}
                    {idx % 2 === 0 && (
                      <text x={p.x} y={svgH - 10} textAnchor="middle" fill="#52525b" className="text-[8px] font-mono">
                        {dataset[idx].timeLabel.split(' ')[0]}
                      </text>
                    )}
                  </g>
                );
              })}

              {/* SVG Gradients definitions */}
              <defs>
                <linearGradient id="cyan-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Interactive display card linking hovered timestamp */}
          <div className="mt-3 bg-[#09090b]/50 p-2 rounded-[4px] border border-[#27272a] flex items-center justify-between min-h-[36px]">
            {hoveredIndex !== null ? (
              <div className="flex justify-between w-full text-[10px] font-mono">
                <span className="text-[#fafafa] font-bold">{dataset[hoveredIndex].timeLabel}</span>
                <span className="text-[#06b6d4]">Flowrate: <strong>{dataset[hoveredIndex].gateThroughputSpeed} F/M</strong></span>
                <span className="text-[#71717a]">Total Attendance: <strong>{dataset[hoveredIndex].attendanceCount.toLocaleString()}</strong></span>
              </div>
            ) : (
              <p className="text-[9px] text-[#52525b] font-mono text-center w-full uppercase tracking-wider">Hover timeline nodes to view deep match phase indexes.</p>
            )}
          </div>
        </div>

        {/* Chart B: Live Stand Load Bars */}
        <div className="bg-[#18181b] border border-[#27272a] p-4 rounded-[4px] shadow-2xl flex flex-col justify-between" id="chart-stand-loads">
          <div className="flex items-center justify-between border-b border-[#27272a] pb-2.5 mb-3">
            <div className="flex items-center space-x-2">
              <BarChart3 size={14} className="text-[#06b6d4]" />
              <span className="text-xs font-bold font-mono uppercase tracking-wider text-[#fafafa]">Current Occupancy Load comparison (by Stand)</span>
            </div>
            <span className="text-[8px] text-[#06b6d4] font-mono font-bold uppercase tracking-widest bg-[#06b6d4]/10 border border-[#06b6d4]/20 py-0.5 px-2 rounded-[4px]">Real-time</span>
          </div>

          {/* Bar Chart list */}
          <div className="space-y-3">
            {stands.map((stand) => {
              const currentPercent = (stand.currentCount / stand.capacity) * 100;
              const barColorClass = currentPercent > 90 ? 'bg-[#ef4444]' :
                                    currentPercent > 75 ? 'bg-[#f59e0b]' : 'bg-[#22c55e]';

              return (
                <div key={stand.id} className="space-y-1">
                  <div className="flex items-center justify-between text-[10.5px]">
                    <span className="font-bold text-[#fafafa] font-sans">{stand.name}</span>
                    <span className="font-mono text-zinc-400 text-[10px]">
                      <strong className="text-slate-200">{stand.currentCount.toLocaleString()}</strong> / {stand.capacity.toLocaleString()} seats
                      <span className={`ml-1.5 font-bold ${
                        currentPercent > 90 ? 'text-[#ef4444]' :
                        currentPercent > 75 ? 'text-[#f59e0b]' : 'text-[#22c55e]'
                      }`}>
                          ({currentPercent.toFixed(0)}%)
                      </span>
                    </span>
                  </div>
                  
                  {/* Visual Progress bar representation */}
                  <div className="w-full bg-[#09090b] h-2 rounded-[4px] overflow-hidden relative border border-[#27272a]/30">
                    <div 
                      className={`h-full rounded-sm transition-all duration-500 relative ${barColorClass}`}
                      style={{ width: `${currentPercent}%` }}
                    >
                      {/* Gloss Overlay */}
                      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-[shimmer_2s_infinite]" />
                    </div>
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
