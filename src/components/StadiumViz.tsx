/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  HelpCircle, RefreshCw, ZoomIn, ZoomOut, AlertTriangle, 
  Flame, Stethoscope, Compass, Layers, Phone, Info, CheckCircle
} from 'lucide-react';
import { StadiumZone, StadiumIncident, AccessibilitySettings } from '../types';

interface StadiumVizProps {
  zones: StadiumZone[];
  selectedZoneId: string | null;
  onSelectZone: (zoneId: string) => void;
  incidents: StadiumIncident[];
  accessibility: AccessibilitySettings;
  onAddNotification: (message: string, severity: 'info' | 'warning' | 'error' | 'ai') => void;
}

interface ServiceLocation {
  id: string;
  name: string;
  symbol: string;
  color: string;
  contact: string;
  status: string;
  cx: number;
  cy: number;
  description: string;
}

/**
 * Interactive Stadium 2D Plan / 3D Spatial visual layout.
 * Supports toggling high-density heatmaps and a detailed Services Layer
 * (Washrooms, Food Cafe, Security, Pavilions, Emergency Contacts).
 */
export default function StadiumViz({
  zones,
  selectedZoneId,
  onSelectZone,
  incidents,
  accessibility,
  onAddNotification,
}: StadiumVizProps) {
  const [zoomScale, setZoomScale] = useState<number>(1);
  const [showFlowLines, setShowFlowLines] = useState<boolean>(true);
  
  // Layer Mode: 'heatmap' (Crowd density) or 'services' (Toilet, Food, Security hubs)
  const [activeLayer, setActiveLayer] = useState<'heatmap' | 'services'>('heatmap');
  
  // 3D Isometric View Mode state
  const [is3DMode, setIs3DMode] = useState<boolean>(false);

  // Selected Service Location State
  const [selectedService, setSelectedService] = useState<ServiceLocation | null>(null);

  // Define static markers for vital stadium services (Toilets, Carts, Security, Pavilions)
  const STADIUM_SERVICES: ServiceLocation[] = [
    { 
      id: 'srv-01', 
      name: 'North Concourse Washroom Restrooms', 
      symbol: '🚻', 
      color: 'bg-indigo-600', 
      contact: 'Volunteer Unit Alpha 1 (Staff Radio #4)', 
      status: 'Clean & Fully Operational', 
      cx: 270, 
      cy: 110,
      description: 'Double accessible WC cubicles, automatic water supply, parent change rooms.'
    },
    { 
      id: 'srv-02', 
      name: 'South Concourse VIP Washroom Restrooms', 
      symbol: '🚻', 
      color: 'bg-indigo-600', 
      contact: 'Cleaning Shift Supervisor (Staff Radio #9)', 
      status: 'Clean & High Inflow', 
      cx: 270, 
      cy: 430,
      description: 'Equipped with wheelchair support rails & tactile guides near Gate D ramp.'
    },
    { 
      id: 'srv-03', 
      name: 'East Plaza Premium Food Cafe Cart', 
      symbol: '🍔', 
      color: 'bg-amber-600', 
      contact: 'Vendors Association Center', 
      status: 'High Fan Queue (12 Min Wait)', 
      cx: 395, 
      cy: 270,
      description: 'Gourmet crickets wrap, samosa express, cold energy beverages, sponsor cola flasks.'
    },
    { 
      id: 'srv-04', 
      name: 'West Wing Express Fan Cafe Cart', 
      symbol: '🍔', 
      color: 'bg-amber-600', 
      contact: 'Vendors Association Center', 
      status: 'Nominal Operations', 
      cx: 145, 
      cy: 270,
      description: 'Quick-munch chips, popcorn bar, organic water refill stand.'
    },
    { 
      id: 'srv-05', 
      name: 'Gate A Tactical Incident Security Room', 
      symbol: '🛡️', 
      color: 'bg-emerald-600', 
      contact: 'Local Duty Sergeant (Ext 401)', 
      status: 'Armed & On Alert Standby', 
      cx: 270, 
      cy: 35,
      description: 'Police dispatcher center, crowd surveillance monitors, field communications control.'
    },
    { 
      id: 'srv-06', 
      name: 'Gate D South Security Guard Station', 
      symbol: '🛡️', 
      color: 'bg-emerald-600', 
      contact: 'Quick Response Squad B (Ext 404)', 
      status: 'Ready for Quick Deploy', 
      cx: 270, 
      cy: 505,
      description: 'Backup safety shields, local stadium barrier locks, volunteer walkie register.'
    },
    { 
      id: 'srv-07', 
      name: 'Players Area Pavilions & Media Restricted Deck', 
      symbol: '🏏', 
      color: 'bg-purple-600', 
      contact: 'High Commissioner Security Agent (Ext 901)', 
      status: 'Secure Restriction Confirmed', 
      cx: 215, 
      cy: 240,
      description: 'Players changing locker box, national commentary box, medical recovery ice tubs.'
    },
    { 
      id: 'srv-08', 
      name: 'Sponsors & VIP Legendary Pavilion Box', 
      symbol: '✨', 
      color: 'bg-rose-600', 
      contact: 'Brand Hospitality Host', 
      status: '100% Occupied VIP Deck', 
      cx: 325, 
      cy: 240,
      description: 'State dignitaries area, team owners terrace lounge, direct lift linkage to Gate E.'
    },
  ];

  // Vital Live Emergency hotline list
  const EMERGENCY_CONTACTS = [
    { title: '🚑 Medic Triage Dispatcher', tel: '+1-555-CRIC-911', note: 'Red Cross & paramedics team' },
    { title: '🔥 Stadium Fire Control Room', tel: '+1-555-FIRE-SAFE', note: 'Perimeter fire sprinkler locks' },
    { title: '🔒 Core Security Command Deck', tel: '+1-555-CMD-CEN', note: 'Loudspeaker PA broadcast' },
  ];

  const getHeatmapColor = (level: string, isSelected: boolean) => {
    if (accessibility.highContrast) {
      switch (level) {
        case 'low': return isSelected ? '#1e293b' : '#334155';
        case 'medium': return isSelected ? '#eab308' : '#ca8a04';
        case 'high': return isSelected ? '#ef4444' : '#b91c1c';
        case 'critical': return isSelected ? '#ffffff' : '#f43f5e';
        default: return '#1e293b';
      }
    }

    if (activeLayer === 'services') {
      // Keep stands elegant dark slate when focusing on Services Layer
      return isSelected ? '#3f3f46' : '#1e1b4b/20';
    }

    switch (level) {
      case 'low': return isSelected ? '#059669' : '#10b981';
      case 'medium': return isSelected ? '#d97706' : '#f59e0b';
      case 'high': return isSelected ? '#dc2626' : '#ef4444';
      case 'critical': return isSelected ? '#991b1b' : '#300202';
      default: return '#475569';
    }
  };

  const getIncidentForZone = (zoneId: string) => {
    return incidents.find((inc) => inc.zoneId === zoneId && inc.status !== 'resolved');
  };

  const renderIncidentIcon = (type: string) => {
    switch (type) {
      case 'medical': return <Stethoscope size={11} className="text-white" />;
      case 'fire': return <Flame size={11} className="text-white animate-bounce" />;
      default: return <AlertTriangle size={11} className="text-white" />;
    }
  };

  const getSimulationStyle = () => {
    switch (accessibility.colorBlindMode) {
      case 'protanopia': return { filter: 'url(#protanopia-filter)' };
      case 'deuteranopia': return { filter: 'url(#deuteranopia-filter)' };
      case 'achromatopsia': return { filter: 'url(#achromatopsia-filter)' };
      default: return {};
    }
  };

  // Helper to render beautiful Extruded 3D Isometric Columns on SVG
  const render3DHoverTower = (cx: number, cy: number, zoneLevel: string, heightVal: number) => {
    const towerWidth = 14;
    const towerHeight = heightVal; // based on occupancy danger index

    // Resolve color shades for isometric face shading
    let topColor = '#38bdf8';
    let rightColor = '#0284c7';
    let leftColor = '#0369a1';

    if (zoneLevel === 'critical') {
      topColor = '#ef4444'; rightColor = '#b91c1c'; leftColor = '#991b1b';
    } else if (zoneLevel === 'high') {
      topColor = '#f97316'; rightColor = '#ea580c'; leftColor = '#c2410c';
    } else if (zoneLevel === 'medium') {
      topColor = '#eab308'; rightColor = '#ca8a04'; leftColor = '#a16207';
    } else {
      topColor = '#22c55e'; rightColor = '#16a34a'; leftColor = '#15803d';
    }

    return (
      <g className="transition-all duration-300 transform-gpu pointer-events-none" id={`tower-prism-${cx}-${cy}`}>
        {/* Left isometric Face polygon */}
        <polygon 
          points={`${cx - towerWidth},${cy} ${cx},${cy + towerWidth/2} ${cx},${cy - towerHeight + towerWidth/2} ${cx - towerWidth},${cy - towerHeight}`}
          fill={leftColor}
          opacity="0.9"
        />
        {/* Right isometric Face polygon */}
        <polygon 
          points={`${cx},${cy + towerWidth/2} ${cx + towerWidth},${cy} ${cx + towerWidth},${cy - towerHeight} ${cx},${cy - towerHeight + towerWidth/2}`}
          fill={rightColor}
          opacity="0.9"
        />
        {/* Top isometric Lid face */}
        <polygon 
          points={`${cx},${cy - towerHeight + towerWidth/2} ${cx + towerWidth},${cy - towerHeight} ${cx},${cy - towerHeight - towerWidth/2} ${cx - towerWidth},${cy - towerHeight}`}
          fill={topColor}
        />
        {/* Beacon light on top of tower */}
        <circle cx={cx} cy={cy - towerHeight} r="3" fill="#ffffff" className="animate-ping" />
      </g>
    );
  };

  return (
    <div className="bg-[#18181b] border border-[#27272a] rounded-[4px] p-4 shadow-2xl relative flex flex-col h-full" id="stadium-visualizer-container">
      
      {/* 1. Header with Mode Controls */}
      <div className="flex flex-wrap items-center justify-between mb-3.5 gap-3">
        <div>
          <h3 className="text-[11px] font-bold font-mono tracking-widest text-[#fafafa] uppercase flex items-center">
            {is3DMode ? '📊 3D Isometric Spatial Perspective' : '🏟️ Stadium Command Overlay'}
          </h3>
          <p className="text-[10px] text-slate-400 font-mono">
            {activeLayer === 'heatmap' ? 'Crowd Density Heatmap & Flows' : 'Facilities Management Layers'}
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          {/* Layer switcher */}
          <div className="flex bg-[#09090b] border border-[#27272a] rounded-[4px] p-0.5">
            <button
              onClick={() => setActiveLayer('heatmap')}
              className={`px-2 py-0.5 text-[9px] font-mono rounded-[4px] font-bold transition duration-150 cursor-pointer ${
                activeLayer === 'heatmap' ? 'bg-[#06b6d4]/10 text-[#06b6d4] border border-[#06b6d4]/20' : 'text-slate-400 hover:text-white'
              }`}
            >
              CROWD DENSITY
            </button>
            <button
              onClick={() => setActiveLayer('services')}
              className={`px-2 py-0.5 text-[9px] font-mono rounded-[4px] font-bold transition duration-150 cursor-pointer ${
                activeLayer === 'services' ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/20' : 'text-slate-400 hover:text-white'
              }`}
            >
              SERVICES LAYER
            </button>
          </div>

          {/* Perspective 3D skew switch */}
          <button
            id="toggle-3d-skew"
            onClick={() => setIs3DMode(!is3DMode)}
            className={`px-2 py-0.5 rounded-[4px] text-[9px] font-mono border transition duration-150 cursor-pointer flex items-center space-x-1 ${
              is3DMode 
                ? 'bg-purple-600/20 border-purple-500 text-purple-300 font-bold' 
                : 'bg-[#27272a] border-[#27272a] text-slate-400 hover:text-white'
            }`}
          >
            <Compass size={11} className={is3DMode ? 'animate-spin' : ''} />
            <span>{is3DMode ? 'PERSPECTIVE: 3D' : 'OVERHEAD: 2D'}</span>
          </button>

          <button
            id="toggle-flow-vectors"
            onClick={() => setShowFlowLines(!showFlowLines)}
            className={`px-2 py-0.5 rounded-[4px] text-[9px] font-mono border transition duration-150 cursor-pointer ${
              showFlowLines 
                ? 'bg-[#06b6d4]/10 border-[#06b6d4] text-[#06b6d4] font-bold' 
                : 'bg-[#27272a] border-[#27272a] text-slate-400 hover:text-white'
            }`}
          >
            VECTORS
          </button>
          
          <div className="flex items-center bg-[#27272a] rounded-[4px] border border-[#27272a] p-0.5">
            <button
              id="zoom-out-btn"
              onClick={() => setZoomScale(Math.max(0.7, zoomScale - 0.15))}
              className="p-1 hover:bg-[#3f3f46] rounded-[4px] text-zinc-400 hover:text-white transition cursor-pointer"
            >
              <ZoomOut size={11} />
            </button>
            <span className="text-[9px] font-mono px-1 text-slate-350">{Math.round(zoomScale * 100)}%</span>
            <button
              id="zoom-in-btn"
              onClick={() => setZoomScale(Math.min(1.5, zoomScale + 0.15))}
              className="p-1 hover:bg-[#3f3f46] rounded-[4px] text-zinc-400 hover:text-white transition cursor-pointer"
            >
              <ZoomIn size={11} />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Layout Render Window */}
      <div 
        className="flex-1 min-h-[360px] max-h-[490px] bg-[#09090b] rounded-[4px] border border-[#27272a] relative overflow-hidden flex items-center justify-center p-4"
        style={getSimulationStyle()}
      >
        {/* Legendary Legend Box */}
        {activeLayer === 'heatmap' ? (
          <div className="absolute top-3 left-3 bg-[#18181b]/95 border border-[#27272a] rounded-[4px] p-2.5 space-y-1 z-10 text-[8.5px] font-mono text-zinc-400 shadow-md">
            <div className="text-[9px] font-bold text-slate-200 uppercase tracking-wider mb-1">Density Legend</div>
            <div className="flex items-center space-x-1.5 animate-[fadeIn_0.3s_ease]">
              <span className="w-2 h-2 rounded-sm bg-[#10b981] inline-block"></span>
              <span>Low (&lt;60%)</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-sm bg-[#f59e0b] inline-block"></span>
              <span>Warning (60-80%)</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-sm bg-[#ef4444] inline-block"></span>
              <span>Critical (80-95%)</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-sm bg-[#991b1b] border border-white/20 inline-block animate-pulse"></span>
              <span>Overcrowded (&gt;95%)</span>
            </div>
          </div>
        ) : (
          <div className="absolute top-3 left-3 bg-[#18181b]/95 border border-[#27272a] rounded-[4px] p-2.5 space-y-1 z-10 text-[8.5px] font-mono text-zinc-400 shadow-md">
            <div className="text-[9px] font-bold text-indigo-400 uppercase tracking-wider mb-1">Services Directory</div>
            <div className="flex items-center space-x-1.5">
              <span>🚻</span><span>Toilet Restroom</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span>🍔</span><span>Cafe / Food cart</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span>🛡️</span><span>Tactical Security Post</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span>🏏</span><span>Players & Pavilions Area</span>
            </div>
          </div>
        )}

        {/* 3D Isometric Skew transformation container */}
        <div 
          className="w-full h-full max-w-[420px] max-h-[420px] flex items-center justify-center"
          style={{ 
            transform: `scale(${zoomScale}) ${is3DMode ? 'perspective(900px) rotateX(46deg) rotateY(-5deg) rotateZ(-26deg)' : ''}`,
            transformStyle: is3DMode ? 'preserve-3d' : 'flat',
            filter: `drop-shadow(0 ${is3DMode ? '35' : '15'}px ${is3DMode ? '45' : '20'}px rgba(0, 0, 0, 0.75))`,
            transition: 'transform 0.7s cubic-bezier(0.19, 1, 0.22, 1)'
          }}
        >
          <svg
            viewBox="0 0 540 540"
            className="w-full h-full select-none"
            id="stadium-vector-svg"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Outer perimeter fence boundary */}
            <circle cx="270" cy="270" r="240" fill="none" stroke="#10172a" strokeWidth="2" strokeDasharray="6 4" />
            <circle cx="270" cy="270" r="215" fill="none" stroke="#334155" strokeWidth="1" />

            {/* Kinetic flow directions (Animated dashed routes) */}
            {showFlowLines && (
              <>
                <path d="M 270,10 L 270,110" fill="none" stroke={activeLayer === 'services' ? '#1e293b' : '#312e81'} strokeWidth="1.5" strokeDasharray="5 5" className="animate-[dash_6s_linear_infinite]" style={{ strokeDashoffset: '100px' } as any} />
                <path d="M 270,530 L 270,430" fill="none" stroke={activeLayer === 'services' ? '#1e293b' : '#312e81'} strokeWidth="1.5" strokeDasharray="5 5" className="animate-[dash_6s_linear_infinite]" />
                <path d="M 460,110 L 370,180" fill="none" stroke={activeLayer === 'services' ? '#1e293b' : '#312e81'} strokeWidth="1.5" strokeDasharray="5 5" className="animate-[dash_6s_linear_infinite]" />
                <path d="M 460,430 L 370,360" fill="none" stroke={activeLayer === 'services' ? '#1e293b' : '#312e81'} strokeWidth="1.5" strokeDasharray="5 5" className="animate-[dash_6s_linear_infinite]" />
                <path d="M 80,115 L 170,180" fill="none" stroke={activeLayer === 'services' ? '#1e293b' : '#312e81'} strokeWidth="1.5" strokeDasharray="5 5" className="animate-[dash_6s_linear_infinite]" />
                <path d="M 80,425 L 170,360" fill="none" stroke={activeLayer === 'services' ? '#1e293b' : '#312e81'} strokeWidth="1.5" strokeDasharray="5 5" className="animate-[dash_6s_linear_infinite]" />

                {/* Internal Circular Carousel Flows */}
                <circle cx="270" cy="270" r="160" fill="none" stroke="#6366f1" strokeWidth="1" strokeDasharray="6 12" className="opacity-20 animate-[spin_40s_linear_infinite]" />
                <circle cx="270" cy="270" r="120" fill="none" stroke="#475569" strokeWidth="1" strokeDasharray="10 8" className="opacity-15 animate-[spin_32s_linear_infinite_reverse]" />
              </>
            )}

            {/* Inner Playing outfield & pitch */}
            <circle cx="270" cy="270" r="95" fill={accessibility.highContrast ? '#020617' : '#14532d'} stroke="#1e3a1f" strokeWidth="3" />
            <line x1="270" y1="230" x2="270" y2="310" stroke="#166534" strokeWidth="1.5" />
            <circle cx="270" cy="270" r="65" fill="none" stroke="#15803d" strokeWidth="1" strokeDasharray="3 3" />
            <rect x="264" y="247" width="12" height="46" rx="2" fill={accessibility.highContrast ? '#1e293b' : '#d97706'} />

            {/* Render Stand Zones and Gates on mapped polygons & circles */}
            {zones.map((zone) => {
              const cx = zone.coordinateX * 5.4;
              const cy = zone.coordinateY * 5.4;
              const isSelected = selectedZoneId === zone.id;
              const cellColor = getHeatmapColor(zone.dangerLevel, isSelected);
              const isCritical = zone.dangerLevel === 'critical' || zone.dangerLevel === 'high';

              if (zone.category === 'stand') {
                let startAngle = 0;
                let endAngle = 0;

                if (zone.id.includes('north-l1')) { startAngle = -120; endAngle = -60; }
                else if (zone.id.includes('north-l2')) { startAngle = -135; endAngle = -45; startAngle = startAngle - 4; endAngle = endAngle + 4; }
                else if (zone.id.includes('east-l1')) { startAngle = -30; endAngle = 30; }
                else if (zone.id.includes('east-l2')) { startAngle = -45; endAngle = 45; }
                else if (zone.id.includes('south-l1')) { startAngle = 60; endAngle = 120; }
                else if (zone.id.includes('south-l2')) { startAngle = 45; endAngle = 135; }
                else if (zone.id.includes('west-club')) { startAngle = 150; endAngle = 210; }
                else if (zone.id.includes('west-l2')) { startAngle = 135; endAngle = 225; }

                const getRad = (deg: number) => (deg - 90) * Math.PI / 180;
                const isL2 = zone.id.includes('l2') || zone.id.includes('pavilion');
                const innerRadius = isL2 ? 175 : 125;
                const outerRadius = isL2 ? 210 : 165;

                const x1 = 270 + innerRadius * Math.cos(getRad(startAngle));
                const y1 = 270 + innerRadius * Math.sin(getRad(startAngle));
                const x2 = 270 + innerRadius * Math.cos(getRad(endAngle));
                const y2 = 270 + innerRadius * Math.sin(getRad(endAngle));
                const x3 = 270 + outerRadius * Math.cos(getRad(endAngle));
                const y3 = 270 + outerRadius * Math.sin(getRad(endAngle));
                const x4 = 270 + outerRadius * Math.cos(getRad(startAngle));
                const y4 = 270 + outerRadius * Math.sin(getRad(startAngle));

                const pathData = `
                  M ${x1} ${y1} 
                  A ${innerRadius} ${innerRadius} 0 0 1 ${x2} ${y2} 
                  L ${x3} ${y3} 
                  A ${outerRadius} ${outerRadius} 0 0 0 ${x4} ${y4} 
                  Z
                `;

                return (
                  <g key={zone.id} className="cursor-pointer group" onClick={() => onSelectZone(zone.id)}>
                    <path
                      d={pathData}
                      fill={cellColor}
                      fillOpacity={activeLayer === 'services' ? '0.1' : '0.9'}
                      stroke={isSelected ? '#ffffff' : activeLayer === 'services' ? '#18181b' : '#09090b'}
                      strokeWidth={isSelected ? '2.5' : '1'}
                      className="transition-colors duration-300"
                    />
                    
                    {isCritical && activeLayer === 'heatmap' && (
                      <path d={pathData} fill="none" stroke="#cf0000" strokeWidth="1.5" className="animate-ping opacity-25 pointer-events-none" />
                    )}

                    {/* Stand Label */}
                    <text
                      x={cx}
                      y={cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill={activeLayer === 'services' ? '#3f3f46' : accessibility.highContrast ? '#ffffff' : '#fafafa'}
                      className="text-[9px] font-mono leading-none font-bold opacity-80 pointer-events-none"
                    >
                      {zone.name.split(' ')[0][0]}
                    </text>
                  </g>
                );
              }

              // rendering Gates
              if (zone.category === 'gate') {
                return (
                  <g key={zone.id} className="cursor-pointer group" onClick={() => onSelectZone(zone.id)}>
                    <circle
                      cx={cx}
                      cy={cy}
                      r="12"
                      fill={cellColor}
                      fillOpacity={activeLayer === 'services' ? '0.15' : '0.95'}
                      stroke={isSelected ? '#ffffff' : '#27272a'}
                      strokeWidth={isSelected ? '2.5' : '1.5'}
                      className="transition-all duration-200"
                    />
                    <text
                      x={cx}
                      y={cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill={activeLayer === 'services' ? '#52525b' : '#ffffff'}
                      className="text-[8px] font-sans font-bold pointer-events-none"
                    >
                      {zone.name.split(' ')[1]}
                    </text>
                  </g>
                );
              }

              return null;
            })}

            {/* 3. 3D Spatial isometric relative density prisms:
                 ONLY rendered on the overhead map if is3DMode is enabled!
                 This raises high luminous pillars proportional to high and critical crowd density. */}
            {is3DMode && activeLayer === 'heatmap' && zones.map((zone) => {
              if (zone.category !== 'stand' && zone.category !== 'gate') return null;
              
              const cx = zone.coordinateX * 5.4;
              const cy = zone.coordinateY * 5.4;
              
              // Scale height based on currentCount / capacity (0 to 60px height)
              const densityFactor = (zone.currentCount / zone.capacity);
              const towerHeightHeight = Math.min(65, Math.max(12, densityFactor * 55));
              
              return (
                <g key={`tower-${zone.id}`}>
                  {render3DHoverTower(cx, cy, zone.dangerLevel, towerHeightHeight)}
                </g>
              );
            })}

            {/* 4. Active Emergency Incident markers */}
            {activeLayer === 'heatmap' && zones.map((zone) => {
              const incident = getIncidentForZone(zone.id);
              if (!incident) return null;

              const cx = zone.coordinateX * 5.4;
              const cy = zone.coordinateY * 5.4;

              return (
                <g key={`siren-${incident.id}`} className="cursor-pointer animate-bounce" onClick={() => onSelectZone(zone.id)}>
                  <circle cx={cx} cy={is3DMode ? cy - 35 : cy - 20} r="14" fill="#ef4444" className="animate-ping opacity-45" />
                  <g transform={`translate(${cx - 10}, ${is3DMode ? cy - 45 : cy - 30})`}>
                    <rect width="20" height="20" rx="4" fill="#ef4444" stroke="#ffffff" strokeWidth="1.5" />
                    <foreignObject x="4" y="4" width="12" height="12">
                      <div className="flex items-center justify-center w-full h-full">
                        {renderIncidentIcon(incident.type)}
                      </div>
                    </foreignObject>
                  </g>
                </g>
              );
            })}

            {/* 5. Services & Vital Locations Layer: Toilets, Carts, Security, Player area */}
            {activeLayer === 'services' && STADIUM_SERVICES.map((srv) => {
              const isSelected = selectedService?.id === srv.id;
              return (
                <g 
                  key={srv.id} 
                  className="cursor-pointer group"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedService(srv);
                    onAddNotification(`Services map inspection: ${srv.name} highlighted!`, 'info');
                  }}
                >
                  <circle 
                    cx={srv.cx} 
                    cy={srv.cy} 
                    r={isSelected ? "18" : "13"} 
                    className="fill-[#18181b] stroke-[#818cf8] stroke-[2] transition-all hover:stroke-indigo-400 group-hover:scale-110"
                    id={`srv-node-${srv.id}`}
                  />
                  {/* Subtle pulsing background for selected node */}
                  {isSelected && (
                    <circle cx={srv.cx} cy={srv.cy} r="25" fill="none" stroke="#818cf8" strokeWidth="1" className="animate-ping" />
                  )}
                  {/* Emoji symbol */}
                  <text 
                    x={srv.cx} 
                    y={srv.cy + 1} 
                    textAnchor="middle" 
                    dominantBaseline="middle" 
                    className="text-[12px] select-none pointer-events-none"
                  >
                    {srv.symbol}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* 3. Service details card or sector drawer */}
      <div className="mt-4 bg-slate-950/40 p-3 rounded-lg border border-slate-800 flex flex-wrap gap-4 items-center justify-between min-h-[46px]" id="visualizer-selection-indicator">
        
        {/* If Services Layer is active and a service is selected, show details */}
        {activeLayer === 'services' && selectedService ? (
          <div className="flex items-center justify-between w-full animate-[fadeIn_0.4s_ease-out]">
            <div className="space-y-1 max-w-xl">
              <div className="flex items-center space-x-2">
                <span className="text-[14px]">
                  {selectedService.symbol}
                </span>
                <strong className="text-zinc-100 text-xs font-sans uppercase tracking-wide">{selectedService.name}</strong>
                <span className="text-[9px] bg-indigo-600/10 text-indigo-400 px-1.5 py-0.25 rounded-md border border-indigo-500/20 font-mono">
                  {selectedService.status}
                </span>
              </div>
              <p className="text-[10px] text-slate-300">
                {selectedService.description}
              </p>
              <p className="text-[9.5px] text-indigo-300 font-mono">
                📞 Ground Contact Officer: <strong className="text-zinc-100">{selectedService.contact}</strong>
              </p>
            </div>
            
            <button
              onClick={() => setSelectedService(null)}
              className="text-[9px] font-mono hover:text-[#06b6d4] transition uppercase py-1 px-2.5 bg-[#27272a] hover:bg-[#3f3f46] rounded-[4px] border border-[#27272a]"
            >
              Clear Node
            </button>
          </div>
        ) : activeLayer === 'services' ? (
          <div className="flex items-center space-x-2 text-[#818cf8] animate-[fadeIn_0.3s_ease]">
            <Info size={14} className="shrink-0 text-indigo-400" />
            <span className="text-[10.5px] font-sans">
              <strong>Interactive Services active on map</strong>: Click any 🚻 Washroom, 🍔 Food cafe, or 🛡️ Security center icon directly above on the stadium map to inspect state logs and direct contact dials.
            </span>
          </div>
        ) : selectedZoneId ? (
          // Crowd Heatmap sector details code
          (() => {
            const z = zones.find((item) => item.id === selectedZoneId);
            if (!z) return <span className="text-xs text-slate-500">Target zone index invalid.</span>;
            
            const activeIncident = getIncidentForZone(z.id);
            const percentage = Math.round((z.currentCount / z.capacity) * 100);

            return (
              <div className="flex items-center justify-between w-full">
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-semibold text-slate-200">{z.name}</span>
                    <span className={`text-[9px] uppercase font-mono px-2 py-0.25 rounded-md ${
                      z.dangerLevel === 'critical' ? 'bg-red-500/20 text-red-400 font-bold border border-red-500/30' :
                      z.dangerLevel === 'high' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/20' :
                      z.dangerLevel === 'medium' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/20' :
                      'bg-emerald-500/20 text-emerald-400 border border-emerald-500/10'
                    }`}>
                      {z.dangerLevel} Density &middot; {percentage}%
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-sans">
                    Live Headcount: <strong className="text-slate-200">{z.currentCount.toLocaleString()}</strong> / Max {z.capacity.toLocaleString()} seats | Throughput Rate: <strong className="text-slate-200">{z.throughputRate}</strong> fans per minute.
                  </p>
                </div>

                {activeIncident && (
                  <div className="bg-red-950/60 border border-red-500/40 text-red-200 px-3 py-1 rounded-md text-[10px] font-mono animate-pulse flex items-center space-x-1.5 ml-2">
                    <AlertTriangle size={11} className="text-red-400" />
                    <span>Active {activeIncident.type.toUpperCase()} alert</span>
                  </div>
                )}
              </div>
            );
          })()
        ) : (
          <div className="flex items-center space-x-2 text-slate-500">
            <HelpCircle size={14} className="shrink-0" />
            <span className="text-xs">Click any sector or entry gate on the stadium mesh to display critical live statistics.</span>
          </div>
        )}
      </div>

      {/* 4. Live Emergency Direct-Dial Hotline Desk */}
      <div className="mt-3.5 bg-rose-950/10 border border-rose-500/10 rounded-sm p-3 space-y-2" id="emergency-hotline-registry">
        <div className="flex items-center justify-between text-[10px] font-mono text-rose-400 font-bold border-b border-rose-500/10 pb-1">
          <span className="flex items-center space-x-1.5">
            <Phone size={11} className="animate-pulse" />
            <span>CRITICAL EMERGENCY DIRECT-DIAL TELEPHONY HOTLINES</span>
          </span>
          <span className="text-[8px] bg-red-600/10 text-red-500 px-1 rounded font-normal">SECURE CHANNELS ONLY</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-[10px] font-mono">
          {EMERGENCY_CONTACTS.map((c, i) => (
            <div key={i} className="flex items-center justify-between bg-zinc-950/40 p-2 border border-slate-800/60 rounded-[3px]">
              <div>
                <p className="text-[#a1a1aa] text-[9.5px] font-sans font-semibold leading-none">{c.title}</p>
                <p className="text-[8.5px] text-zinc-500 mt-1 leading-none">{c.note}</p>
              </div>
              <a 
                href={`tel:${c.tel}`}
                onClick={(e) => {
                  e.preventDefault();
                  onAddNotification(`Simulating phone link dial to ${c.title}... Dialing: ${c.tel}`, 'warning');
                }}
                className="text-[#06b6d4] hover:text-[#22d3ee] underline font-bold"
              >
                {c.tel}
              </a>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
