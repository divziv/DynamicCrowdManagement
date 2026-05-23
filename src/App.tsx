/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  BarChart3, LayoutDashboard, Shield, Shuffle, 
  Settings, Bell, AlertTriangle, PlayCircle, Loader2, Sparkles, CheckCircle2, Volume2, CreditCard, Zap, Music
} from 'lucide-react';
import { 
  StadiumZone, StadiumIncident, AICrowdAdvice, 
  StadiumNotification, AccessibilitySettings 
} from './types';
import { INITIAL_ZONES, INITIAL_INCIDENTS } from './data/stadium-mesh';

// Import modular sub-components
import StadiumViz from './components/StadiumViz';
import DashboardMetrics from './components/DashboardMetrics';
import AnalyticsCharts from './components/AnalyticsCharts';
import IncidentControl from './components/IncidentControl';
import RouteOptimizer from './components/RouteOptimizer';
import AccessibilityDEI from './components/AccessibilityDEI';
import HappyPathDemo from './components/HappyPathDemo';

// Newly added modular components
import RoleCenter, { UserRole } from './components/RoleCenter';
import TicketingDesk from './components/TicketingDesk';
import AutomationMatrix from './components/AutomationMatrix';
import MediaSynthesizer from './components/MediaSynthesizer';

export default function App() {
  // Navigation active tab - expanded with newly requested operations
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'ticketing' | 'automation' | 'mediacenter' | 'roles' | 'analytics' | 'incidents' | 'routing' | 'accessibility'
  >('dashboard');

  // Core datasets
  const [zones, setZones] = useState<StadiumZone[]>(INITIAL_ZONES);
  const [incidents, setIncidents] = useState<StadiumIncident[]>(INITIAL_INCIDENTS);
  
  // Selection references
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);

  // Gemini AI advice states
  const [aiAdvice, setAiAdvice] = useState<AICrowdAdvice | null>(null);
  const [isAILoading, setIsAILoading] = useState<boolean>(false);

  // Global alarms state
  const [isDrillActive, setIsDrillActive] = useState<boolean>(false);

  // Walkthrough step
  const [demoStep, setDemoStep] = useState<number>(1);

  // Identity / role credentials
  const [activeRole, setActiveRole] = useState<UserRole>('admin');
  const [currentUserName, setCurrentUserName] = useState<string>('Officer Miller');

  // Multi Stadium Support
  const [stadiumId, setStadiumId] = useState<'bengaluru' | 'london' | 'melbourne'>('bengaluru');

  // Notifications stacking logs
  const [notifications, setNotifications] = useState<StadiumNotification[]>([
    { id: 'not-01', message: 'Command Center active. Telemetry linked to local turnstiles grid.', severity: 'info', timestamp: new Date().toISOString() }
  ]);

  // Accessibility configuration
  const [accessibility, setAccessibility] = useState<AccessibilitySettings>({
    textScale: 'normal',
    highContrast: false,
    colorBlindMode: 'none',
    screenReaderActive: false,
    audioPings: false,
  });

  // Scale capacities and current spectators based on stadium selection
  useEffect(() => {
    let multiplier = 1.0;
    let prefix = 'Agentic Oval - ';
    if (stadiumId === 'london') {
      multiplier = 0.42;
      prefix = "Lord's - ";
    } else if (stadiumId === 'melbourne') {
      multiplier = 1.35;
      prefix = 'Melbourne MCG - ';
    }

    setZones(INITIAL_ZONES.map(z => {
      const scaledCap = Math.round(z.capacity * multiplier);
      const scaledCount = Math.round(Math.min(scaledCap * 0.95, z.currentCount * multiplier));
      const ratio = scaledCount / scaledCap;
      let targetLevel = z.dangerLevel;
      if (ratio > 0.9) targetLevel = 'critical';
      else if (ratio > 0.75) targetLevel = 'high';
      else if (ratio > 0.6) targetLevel = 'medium';
      else targetLevel = 'low';

      return {
        ...z,
        name: z.name.includes(' - ') ? prefix + z.name.split(' - ')[1] : prefix + z.name,
        capacity: scaledCap,
        currentCount: scaledCount,
        dangerLevel: targetLevel
      };
    }));

    addNotification(`MATRIX RESYNCOING: Calibrated credentials for ${stadiumId.toUpperCase()} match center.`, 'info');
    speakScreenReader(`Command center switched to ${stadiumId} stadium.`);
  }, [stadiumId]);

  /**
   * Appends an event log message to the operator alerts marquee.
   */
  const addNotification = (message: string, severity: StadiumNotification['severity']) => {
    const newLog: StadiumNotification = {
      id: `not-${Date.now()}`,
      message,
      severity,
      timestamp: new Date().toISOString()
    };
    setNotifications(prev => [newLog, ...prev].slice(0, 8)); // keep last 8 logs
  };

  /**
   * Accessible browser Vocalizer (Text-to-Speech) utilizing SpeechSynthesis.
   */
  const speakScreenReader = (message: string) => {
    if (accessibility.screenReaderActive && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(message);
      window.speechSynthesis.speak(utterance);
    }
  };

  /**
   * Triggers or silences the emergency stadium alarm.
   */
  const handleToggleDrillAlarm = () => {
    const nextDrill = !isDrillActive;
    setIsDrillActive(nextDrill);
    addNotification(
      nextDrill 
        ? 'STADIUM DRILL ACTIVE: Sounding auxiliary crowd evacuation sirens!' 
        : 'Stadiuim drill halted. Normal dispatch rosters resumed.',
      nextDrill ? 'error' : 'info'
    );
    speakScreenReader(nextDrill ? 'Attention. Stadium-wide safety evacuation drill active. Please locate closest escape stairs.' : 'Emergency alarm resolved.');
  };

  /**
   * Adds a newly registered triage incident.
   */
  const handleAddIncident = (newInc: Omit<StadiumIncident, 'id' | 'timestamp'>) => {
    const incident: StadiumIncident = {
      ...newInc,
      id: `inc-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    setIncidents(prev => [incident, ...prev]);
    addNotification(`NEW ALERT REPORTED: "${incident.title}" registered in our safety queue.`, 'warning');
    speakScreenReader(`New triage incident reported: ${incident.title}. Location: ${incident.zoneId}.`);
    
    // Auto-select the corresponding sector to highlight it
    setSelectedZoneId(incident.zoneId);
  };

  /**
   * Resolving/Dispatch status updater.
   */
  const handleModifyIncidentStatus = (id: string, nextStatus: StadiumIncident['status']) => {
    setIncidents(prev => prev.map((inc) => {
      if (inc.id === id) {
        addNotification(`Incident status updated: "${inc.title}" set to ${nextStatus.toUpperCase()}`, 'info');
        return { ...inc, status: nextStatus };
      }
      return inc;
    }));
  };

  /**
   * Triggers the Gemini Flash backend command agent strategy suggestions.
   */
  const handleGetGeneralAIAdvice = async (situation: string) => {
    setIsAILoading(true);
    setAiAdvice(null);
    addNotification('Dispatching telemetry packet to Gemini AI agent advisor...', 'ai');

    try {
      const response = await fetch('/api/mitigate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ situation }),
      });

      if (!response.ok) {
        throw new Error('Server returned an error status.');
      }

      const advice: AICrowdAdvice = await response.json();
      setAiAdvice(advice);
      addNotification(`Gemini Advisor formulated strategic containment coordinates. Urgency core index: ${advice.urgencyScore}%`, 'ai');
      speakScreenReader(`Safety plan formulated by Gemini. Primary advice: ${advice.suggestedAction}`);
    } catch (err: any) {
      console.error(err);
      addNotification('API connection failed. Loading local fallback advisor core.', 'warning');
    } finally {
      setIsAILoading(false);
    }
  };

  // Run a slow background simulation tick to keep attendance metrics looking live and fluid!
  useEffect(() => {
    const interval = setInterval(() => {
      // Tick only stands & gates counts +/- 5 people to show dynamic telemetry
      setZones(prev => prev.map(zone => {
        if (zone.id === 'pitch-arena') return zone;
        
        const delta = Math.floor(Math.random() * 11) - 5; // -5 to +5
        const updatedCount = Math.max(10, Math.min(zone.capacity, zone.currentCount + delta));
        
        let targetLevel = zone.dangerLevel;
        const ratio = updatedCount / zone.capacity;
        if (ratio > 0.9) targetLevel = 'critical';
        else if (ratio > 0.75) targetLevel = 'high';
        else if (ratio > 0.6) targetLevel = 'medium';
        else targetLevel = 'low';

        return {
          ...zone,
          currentCount: updatedCount,
          dangerLevel: targetLevel,
          throughputRate: Math.max(0, Math.min(zone.maxThroughputRate, zone.throughputRate + (delta > 0 ? 2 : -2)))
        };
      }));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  /**
   * Adjust zone counts directly when tickets are booked
   */
  const handleBookTicketCountAdjustment = (zoneId: string, count: number) => {
    setZones(prev => prev.map(z => {
      if (z.id === zoneId) {
        const nextCount = Math.min(z.capacity, z.currentCount + count);
        const ratio = nextCount / z.capacity;
        let dl: StadiumZone['dangerLevel'] = 'low';
        if (ratio > 0.9) dl = 'critical';
        else if (ratio > 0.75) dl = 'high';
        else if (ratio > 0.6) dl = 'medium';

        return {
          ...z,
          currentCount: nextCount,
          dangerLevel: dl
        };
      }
      return z;
    }));
  };

  /**
   * Voice speaking proxy wrapper
   */
  const handleVoiceSpeak = (message: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(message);
      window.speechSynthesis.speak(utterance);
    }
  };

  /**
   * Trigger state transformations mapped to presentation scenario wizard buttons.
   */
  const handleSetDemoStep = (step: number) => {
    setDemoStep(step);

    if (step === 1) {
      // PREGAME INGRESS GATES SURGE
      setZones(prev => prev.map(z => {
        if (z.id === 'gate-a') return { ...z, currentCount: z.capacity - 50, dangerLevel: 'critical', throughputRate: 240 };
        if (z.id === 'stand-north-l1') return { ...z, currentCount: z.capacity - 150, dangerLevel: 'high', throughputRate: 150 };
        if (z.id === 'stand-south-l1') return { ...z, currentCount: z.capacity - 100, dangerLevel: 'critical', throughputRate: 215 };
        return z;
      }));
      
      // Keep only Turnstile jam incident
      setIncidents(INITIAL_INCIDENTS.filter(i => i.id === 'inc-02'));
      setAiAdvice(null);
      setIsDrillActive(false);
      addNotification('STAGE 1 INSTANTIATED: Turnstiles backlogged at Gate A. Density alerts active.', 'warning');
      speakScreenReader('Stage 1 active. Pre match queue backlog registered near Gate A.');
    }

    else if (step === 2) {
      // EMERGENCY HEAT COLLAPSE SIREN
      setZones(prev => prev.map(z => {
        if (z.id === 'gate-a') return { ...z, currentCount: z.capacity - 50, dangerLevel: 'critical' };
        if (z.id === 'stand-north-l1') return { ...z, currentCount: z.capacity - 150, dangerLevel: 'high' };
        return z;
      }));
      
      // Ensure Medical and turnstile incident is active
      const medicalInc = INITIAL_INCIDENTS.find(i => i.id === 'inc-01')!;
      const turnstileInc = INITIAL_INCIDENTS.find(i => i.id === 'inc-02')!;
      setIncidents([medicalInc, turnstileInc]);
      setAiAdvice(null);
      setIsDrillActive(true); // Sound sirens!
      
      addNotification('STAGE 2 INSTANTIATED: Triage alarm triggered. Emergency volunteers dispatched to Stand North.', 'error');
      speakScreenReader('Stage 2 active. Emergency medical dispatch sounding. North Stand Level 1 sector B.');
      setSelectedZoneId('stand-north-l1'); // Highlight sector
    }

    else if (step === 3) {
      // DEEP GEMINI CO-COMMAND STRATEGY DISPATCH
      setZones(prev => prev.map(z => {
        if (z.id === 'gate-a') return { ...z, currentCount: z.capacity - 50, dangerLevel: 'critical' };
        return z;
      }));

      // Trigger automatic strategy response call
      handleGetGeneralAIAdvice('Turnstile failure at northern Gate A creating line congestion. Heat advisory warning at Stand North Level 1.');
      addNotification('STAGE 3 INSTANTIATED: Querying Gemini model details for strategic detours.', 'ai');
    }

    else if (step === 4) {
      // FULL SAFE METRICS RECOVERY DISPERSAL
      setZones(prev => prev.map(z => {
        // Return everybody to comfortable levels
        if (z.id === 'gate-a') return { ...z, currentCount: Math.round(z.capacity * 0.35), dangerLevel: 'low', throughputRate: 40 };
        if (z.id === 'stand-north-l1') return { ...z, currentCount: Math.round(z.capacity * 0.5), dangerLevel: 'low', throughputRate: 50 };
        if (z.id === 'stand-south-l1') return { ...z, currentCount: Math.round(z.capacity * 0.45), dangerLevel: 'low', throughputRate: 35 };
        return { ...z, currentCount: Math.round(z.capacity * 0.4), dangerLevel: 'low' };
      }));

      // Mark all incidents as Resolved
      setIncidents(prev => prev.map(i => ({ ...i, status: 'resolved' })));
      setIsDrillActive(false);
      setAiAdvice({
        id: 'mock-reco-final',
        bottleneckLocation: 'None (Clear Operational Ledgers)',
        tacticalPlan: '1. Exit flows successfully deflected via auxiliary southern paths.\n2. Triage incident safely de-escalated.\n3. Operational ledger returned to Safe Standby.',
        suggestedAction: 'Perfect operational recovery accomplished.',
        urgencyScore: 10,
        timestamp: new Date().toISOString()
      });

      addNotification('STAGE 4 INSTANTIATED: Complete safe dispersal. All telemetry normalized.', 'info');
      speakScreenReader('Stage 4 complete. Strategic crowd deflection complete. telemetries stable.');
    }
  };

  /**
   * Resets overall telemetry to base template variables.
   */
  const handleResetTelemetryObj = () => {
    setZones(INITIAL_ZONES);
    setIncidents(INITIAL_INCIDENTS);
    setAiAdvice(null);
    setIsDrillActive(false);
    setSelectedZoneId(null);
    setDemoStep(1);
    addNotification('Stadium ledger and spectator density values reset to baseline settings.', 'info');
    speakScreenReader('Stadium dashboard reset to initial match phase.');
  };

  const handleSetRoleFromLogin = (role: UserRole, userName: string) => {
    setActiveRole(role);
    setCurrentUserName(userName);
    addNotification(`CLEARANCE COMPLETED: Credentials set as ${userName.toUpperCase()} (${role.toUpperCase()})`, 'info');
  };

  return (
    <div 
      className={`min-h-screen font-sans transition-all duration-300 flex flex-col justify-between ${
        accessibility.highContrast ? 'bg-black text-white' : 'bg-slate-950 text-slate-100'
      } ${
        accessibility.textScale === 'large' ? 'text-lg' :
        accessibility.textScale === 'extra-large' ? 'text-xl' : 'text-sm'
      }`}
      id="app-root-shell"
    >
      
      {/* Dynamic Global Warning Banner */}
      {isDrillActive && (
        <div className="bg-rose-600 border-b border-rose-500 py-2.5 px-4 text-center text-xs font-mono font-bold tracking-wider text-white animate-pulse flex items-center justify-center space-x-2 z-40 relative">
          <AlertTriangle size={15} className="animate-spin" />
          <span>STADIUM EMERGENCY SIRENS ACTIVE &middot; GLOBAL COORDINATION TEAM REGISTERED: {currentUserName.toUpperCase()} &middot; REDIRECT PATHS LINKED</span>
        </div>
      )}

      {/* Main Container */}
      <div className="w-full max-w-7xl mx-auto px-4 py-5 flex-1 flex flex-col space-y-6">
        
        {/* Navigation & Brand Header */}
        <header className="flex flex-col md:flex-row items-center justify-between pb-4 border-b border-slate-850 gap-4" id="primary-header">
          <div className="flex items-center space-x-3.5">
            <div className="p-2.5 bg-indigo-600 text-white rounded-xl shadow-md ring-1 ring-white/10 flex items-center justify-center">
              <Shield size={24} className="animate-[spin_20s_linear_infinite]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-black font-sans text-slate-100 tracking-tight">Agentic Premier League</h1>
                <span className="text-[9px] font-mono bg-indigo-600/10 text-indigo-400 py-0.5 px-2 rounded-full border border-indigo-500/25">
                  SECURE PORTAL
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">🏏 Stadium Crowd Management &middot; Role Access &amp; Ticket Box Office</p>
            </div>
          </div>

          {/* Quick Header Switcher Controls */}
          <div className="flex items-center space-x-2 flex-wrap">
            {/* Stadium Selector */}
            <div className="flex items-center space-x-1 bg-slate-900 border border-slate-800 p-1 rounded-lg">
              <span className="text-[9px] text-[#71717a] font-mono uppercase font-bold px-1.5">Stadium:</span>
              <select
                id="stadium-selector-top"
                value={stadiumId}
                onChange={(e) => setStadiumId(e.target.value as any)}
                className="bg-black border-none text-[10.5px] font-mono text-cyan-400 focus:outline-none cursor-pointer py-0.5 px-1 rounded"
              >
                <option value="bengaluru">Bengaluru Arena</option>
                <option value="london">Lord's Classic</option>
                <option value="melbourne">Melbourne MCG</option>
              </select>
            </div>

            {/* Active Role Quick Indicator */}
            <div className="flex items-center space-x-1.5 bg-[#18181b] border border-[#27272a] p-1 rounded-lg">
              <span className="text-[9px] text-zinc-500 font-mono uppercase font-bold px-1">Identity:</span>
              <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded uppercase ${
                activeRole === 'admin' ? 'bg-red-500/10 text-red-400' :
                activeRole === 'ops' ? 'bg-cyan-500/10 text-cyan-400' :
                activeRole === 'security' ? 'bg-orange-500/10 text-orange-400' :
                activeRole === 'volunteers' ? 'bg-emerald-500/10 text-emerald-400' :
                'bg-zinc-800 text-zinc-300'
              }`} title="Switch role in 'Security Runbooks' tab">
                👤 {currentUserName.split(' ')[0]} ({activeRole})
              </span>
            </div>
          </div>
        </header>

        {/* Global tab category switcher bar */}
        <div className="flex overflow-x-auto pb-1" id="sub-navigation-container">
          <nav className="flex space-x-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800 w-full md:w-auto" id="tabs-navigation-strip">
            {[
              { id: 'dashboard', label: 'Triage Dashboard', icon: LayoutDashboard },
              { id: 'ticketing', label: 'Box Office & Tickets', icon: CreditCard },
              { id: 'automation', label: 'Safety Trigger Matrix', icon: Zap },
              { id: 'mediacenter', label: 'Vocalizer & Sounds', icon: Music },
              { id: 'roles', label: 'Security Runbooks', icon: Shield },
              { id: 'analytics', label: 'Match Statistics', icon: BarChart3 },
              { id: 'incidents', label: 'Triage Queue', icon: AlertTriangle },
              { id: 'routing', label: 'Route Deflections', icon: Shuffle },
              { id: 'accessibility', label: 'DEI Toggles', icon: Settings },
            ].map((t) => {
              const TabIcon = t.icon;
              const isHighlight = t.id === 'ticketing' || t.id === 'automation' || t.id === 'mediacenter';
              return (
                <button
                  key={t.id}
                  id={`tab-${t.id}`}
                  onClick={() => {
                    setActiveTab(t.id as any);
                    speakScreenReader(`Navigating to ${t.label} tab.`);
                  }}
                  className={`flex items-center space-x-1.5 py-1.5 px-2.5 text-xs font-semibold rounded-lg transition duration-150 cursor-pointer whitespace-nowrap ${
                    activeTab === t.id
                      ? 'bg-indigo-600 text-white shadow-md'
                      : isHighlight 
                      ? 'text-cyan-400 hover:text-cyan-300 hover:bg-slate-800/40 border border-cyan-400/15'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                >
                  <TabIcon size={13} />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Dashboard Tickers KPI row */}
        <DashboardMetrics 
          zones={zones}
          incidents={incidents}
          onTriggerGlobalDrill={handleToggleDrillAlarm}
          isDrillActive={isDrillActive}
        />

        {/* Real-time Match marquee tickers / Event Alerts logs */}
        <section className="bg-slate-950/60 p-3 rounded-lg border border-slate-850 flex items-center justify-between text-xs font-mono relative overflow-hidden" id="event-ticker-marquee">
          <div className="flex items-center space-x-2 text-indigo-400 font-semibold animate-pulse">
            <span className="w-2 h-2 rounded-full bg-indigo-500" />
            <span>CRITICAL LOG:</span>
          </div>
          
          <div className="flex-1 px-4 truncate text-slate-300 text-[11px]">
            {notifications.length > 0 ? (
              <span className="animate-[slideIn_0.3s_ease]">
                [{new Date(notifications[0].timestamp).toLocaleTimeString()}] &middot; {notifications[0].message}
              </span>
            ) : (
              <span>Telemetry fully linked. Secure egress tracking active.</span>
            )}
          </div>

          <span className="text-[10px] text-slate-500 uppercase tracking-widest hidden md:inline ml-2">
            STADIUM ID: {stadiumId.toUpperCase()} &middot; REGISTRY ENTRANCE: SAFE
          </span>
        </section>

        {/* Active Tab View routers */}
        <main className="flex-1" id="main-content-canvas">
          
          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <StadiumViz 
                  zones={zones}
                  selectedZoneId={selectedZoneId}
                  onSelectZone={(id) => {
                    setSelectedZoneId(id);
                    const z = zones.find(item => item.id === id);
                    if (z) {
                      addNotification(`Check Sector: Tracked metrics core values of ${z.name}`, 'info');
                      speakScreenReader(`${z.name}. Capacity is ${z.capacity}. Current attendance density is ${Math.round((z.currentCount / z.capacity) * 100)} percent.`);
                    }
                  }}
                  incidents={incidents}
                  accessibility={accessibility}
                  onAddNotification={addNotification}
                />
              </div>

              {/* Quick Info & Live Incident Triage strip side-pane */}
              <div className="bg-slate-900 border border-slate-850 rounded-xl p-5 shadow-xl flex flex-col justify-between space-y-4" id="ingress-gateways-breakdown">
                <div>
                  <h4 className="text-sm font-bold text-slate-200 border-b border-slate-800 pb-2 mb-3">Ingress Turnstiles Density</h4>
                  <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                    {zones
                      .filter(z => z.category === 'gate')
                      .map(gate => {
                        const usageRatio = gate.currentCount / gate.capacity;
                        return (
                          <div key={gate.id} className="flex items-center justify-between p-2.5 bg-slate-950/40 rounded-lg border border-slate-850/80">
                            <div>
                              <p className="text-xs font-bold text-slate-200">{gate.name}</p>
                              <p className="text-[10px] text-slate-400 font-mono">Inflow: <strong>{gate.throughputRate} fans/min</strong></p>
                            </div>

                            <div className="text-right">
                              <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                                usageRatio > 0.9 ? 'bg-red-500/10 text-red-400 font-black' :
                                usageRatio > 0.7 ? 'bg-amber-500/10 text-amber-300' : 'bg-emerald-500/10 text-emerald-400'
                              }`}>
                                {Math.round(usageRatio * 100)}% Used
                              </span>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>

                <div className="bg-indigo-950/15 border border-indigo-500/20 p-3.5 rounded-lg text-xs space-y-2 mt-4 text-slate-350">
                  <div className="flex items-center space-x-2 text-indigo-400 font-bold">
                    <Sparkles size={13} className="animate-pulse" />
                    <span>APL Operations Deck:</span>
                  </div>
                  <p className="leading-snug text-[11px]">
                    To simulate online bookings and manual ticket counters, click the <strong>Box Office &amp; Tickets</strong> tab. To tweak live sirens or automatic dispatch parameters, visit <strong>Safety Trigger Matrix</strong>.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ticketing' && (
            <TicketingDesk
              zones={zones}
              onBookTicketCountAdjustment={handleBookTicketCountAdjustment}
              onAddNotification={addNotification}
            />
          )}

          {activeTab === 'automation' && (
            <AutomationMatrix
              zones={zones}
              isDrillActive={isDrillActive}
              onTriggerGlobalDrill={handleToggleDrillAlarm}
              onAddNotification={addNotification}
              onSpeak={handleVoiceSpeak}
            />
          )}

          {activeTab === 'mediacenter' && (
            <MediaSynthesizer
              onAddNotification={addNotification}
              onSpeak={handleVoiceSpeak}
            />
          )}

          {activeTab === 'roles' && (
            <RoleCenter
              activeRole={activeRole}
              onChangeRole={handleSetRoleFromLogin}
              currentUserName={currentUserName}
            />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsCharts zones={zones} />
          )}

          {activeTab === 'incidents' && (
            <IncidentControl 
              incidents={incidents}
              zones={zones}
              onAddIncident={handleAddIncident}
              onModifyIncidentStatus={handleModifyIncidentStatus}
              onGetAIAdvice={handleGetGeneralAIAdvice}
              aiAdvice={aiAdvice}
              isAILoading={isAILoading}
            />
          )}

          {activeTab === 'routing' && (
            <RouteOptimizer zones={zones} />
          )}

          {activeTab === 'accessibility' && (
            <AccessibilityDEI 
              settings={accessibility}
              updateSettings={(newSet) => setAccessibility(prev => ({ ...prev, ...newSet }))}
              announceToScreen={(msg) => addNotification(`A11y Vocalizer Alert: ${msg}`, 'info')}
            />
          )}
        </main>

        {/* Live Presentation walkthrough wizard panel permanently docked on footer for outstanding demo execution */}
        <section className="pt-6" id="presentation-wizard-section">
          <HappyPathDemo 
            currentStep={demoStep}
            onSetStep={handleSetDemoStep}
            onResetDemo={handleResetTelemetryObj}
          />
        </section>

      </div>

      {/* Global Command Footer */}
      <footer className="py-4 border-t border-slate-900 bg-slate-950 px-4 text-center text-[10px] text-slate-500 font-mono" id="app-footer-credits">
        <p>&copy; 2026 Google Cloud Agentic Premier League Command Panel &middot; High Density UI &middot; Designed for Ingress, Ticketing, Safety &amp; ADA DEI Compliance.</p>
      </footer>

    </div>
  );
}
