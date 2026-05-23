/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  AlertTriangle, Shield, CheckCircle, Radio, Sparkles, Send, 
  Search, Users, Zap, UserPlus, HeartHandshake, Loader2, ArrowRightCircle
} from 'lucide-react';
import { StadiumIncident, StadiumZone, AICrowdAdvice, IncidentType, SeverityLevel } from '../types';

interface IncidentControlProps {
  incidents: StadiumIncident[];
  zones: StadiumZone[];
  onAddIncident: (incident: Omit<StadiumIncident, 'id' | 'timestamp'>) => void;
  onModifyIncidentStatus: (id: string, nextStatus: StadiumIncident['status']) => void;
  onGetAIAdvice: (bottleneckSituation: string) => void;
  aiAdvice: AICrowdAdvice | null;
  isAILoading: boolean;
}

/**
 * Triage and emergency dispatch center component.
 * Allows operators to create issues, coordinate first-aid personnel, and retrieve
 * AI-powered tactical crowd rerouting advice from Gemini.
 */
export default function IncidentControl({
  incidents,
  zones,
  onAddIncident,
  onModifyIncidentStatus,
  onGetAIAdvice,
  aiAdvice,
  isAILoading,
}: IncidentControlProps) {
  // Incident Form state
  const [newTitle, setNewTitle] = useState<string>('');
  const [newType, setNewType] = useState<IncidentType>('overcrowding');
  const [newSeverity, setNewSeverity] = useState<SeverityLevel>('minor');
  const [newZoneId, setNewZoneId] = useState<string>(zones[0]?.id || '');
  const [newDesc, setNewDesc] = useState<string>('');
  const [assignedTeam, setAssignedTeam] = useState<string>('');

  // AI manual input scene
  const [aiPromptOverride, setAiPromptOverride] = useState<string>('');

  const activeIncidents = incidents.filter((i) => i.status !== 'resolved');
  const closedIncidents = incidents.filter((i) => i.status === 'resolved');

  /**
   * Dispatches form fields, triggers parents additions hook and clears selectors.
   */
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDesc.trim()) return;

    onAddIncident({
      title: newTitle,
      type: newType,
      severity: newSeverity,
      zoneId: newZoneId,
      description: newDesc,
      status: 'reported',
      assignedStaff: assignedTeam.trim() ? [assignedTeam] : ['Emergency Volunteers Squad Z'],
    });

    // Reset controls
    setNewTitle('');
    setNewDesc('');
    setAssignedTeam('');
  };

  /**
   * Generates custom prompt for Gemini combining actual real-time numbers.
   */
  const handleTriggerAIAdvice = (incident: OptionalIncident) => {
    let situationText = '';
    if (incident) {
      situationText = `Active Incident: "${incident.title}" of severity level "${incident.severity}". Location affected: ${incident.zoneName}. Description: ${incident.description}.`;
    } else if (aiPromptOverride.trim()) {
      situationText = aiPromptOverride;
    } else {
      // General overview bottleneck advisory
      const congestedZones = zones.filter((z) => z.dangerLevel === 'critical' || z.dangerLevel === 'high');
      if (congestedZones.length > 0) {
        situationText = `Multiple bottlenecks detected: ${congestedZones.map(z => `${z.name} has occupancy ${Math.round((z.currentCount / z.capacity) * 100)}% with outflow of ${z.throughputRate} fans/min`).join(', ')}. Optimize route structures.`;
      } else {
        situationText = `Stadium is operating at normal parameters. Optimize routine pre-match ingress across central and club gates.`;
      }
    }

    onGetAIAdvice(situationText);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4" id="incident-command-workspace">
      
      {/* Col 1: Active Triage Logs & Handlers */}
      <div className="xl:col-span-2 space-y-4">
        <div className="bg-[#18181b] border border-[#27272a] rounded-[4px] p-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-[#27272a] pb-2.5 mb-3.5">
            <div className="flex items-center space-x-2">
              <Shield size={14} className="text-[#ef4444]" />
              <h3 className="text-xs font-bold font-mono uppercase tracking-wide text-zinc-200">Active Matchday Triage Queue ({activeIncidents.length})</h3>
            </div>
            <span className="text-[8px] uppercase font-mono tracking-widest bg-rose-500/10 text-rose-400 py-0.5 px-2 rounded-[4px] border border-rose-500/20 animate-pulse">
              Live Monitoring
            </span>
          </div>

          {activeIncidents.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-zinc-500 space-y-1.5">
              <CheckCircle size={28} className="text-[#22c55e]" />
              <p className="text-xs font-mono uppercase tracking-wider">Operations Standby: Green Ledger</p>
              <p className="text-[10px] text-zinc-400 font-sans">All gates, turnstiles, and stands are within tolerable limits.</p>
            </div>
          ) : (
            <div className="space-y-3.5 max-h-[380px] overflow-y-auto pr-1">
              {activeIncidents.map((incident) => {
                const associatedZone = zones.find((z) => z.id === incident.zoneId);
                const zoneName = associatedZone ? associatedZone.name : 'Unknown Sector';

                return (
                  <div 
                    key={incident.id} 
                    id={`incident-card-${incident.id}`}
                    className={`p-3 rounded-[4px] border transition-all duration-200 ${
                      incident.severity === 'critical' || incident.severity === 'major'
                        ? 'bg-red-950/20 border-red-500/30'
                        : 'bg-[#09090b]/55 border-[#27272a]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2 flex-wrap">
                          <span className={`text-[9px] uppercase font-mono px-1.5 py-0.5 rounded-sm font-bold ${
                            incident.severity === 'critical' ? 'bg-red-500/20 text-red-400' :
                            incident.severity === 'major' ? 'bg-orange-500/20 text-orange-400' :
                            incident.severity === 'moderate' ? 'bg-[#f59e0b]/20 text-[#f59e0b]' :
                            'bg-zinc-800 text-[#a1a1aa]'
                          }`}>
                            {incident.severity} &middot; {incident.type}
                          </span>
                          <span className="text-[10.5px] font-bold font-mono tracking-wider text-[#06b6d4]">
                            {zoneName}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-zinc-100 font-sans">{incident.title}</h4>
                        <p className="text-[10.5px] text-[#a1a1aa] leading-normal font-sans">{incident.description}</p>
                      </div>

                      {/* Speed status modifier state machine */}
                      <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded-sm bg-[#1c1c1e] text-zinc-300 border border-[#27272a]">
                        {incident.status}
                      </span>
                    </div>

                    {/* Personnel dispatches & command buttons */}
                    <div className="mt-3 pt-3 border-t border-[#27272a] flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono">
                      <div className="flex items-center space-x-1.5 text-[#a1a1aa]">
                        <HeartHandshake size={11} className="text-[#06b6d4]" />
                        <span>Dispatched Team: <strong className="text-[#fafafa]">{incident.assignedStaff.join(', ')}</strong></span>
                      </div>

                      <div className="flex items-center space-x-1.5">
                        {incident.status === 'reported' && (
                          <button
                            id={`dispatch-btn-${incident.id}`}
                            onClick={() => onModifyIncidentStatus(incident.id, 'dispatched')}
                            className="bg-[#06b6d4]/10 hover:bg-[#06b6d4]/20 text-[#06b6d4] border border-[#06b6d4]/25 py-0.5 px-2 rounded-[4px] text-[9px] font-bold uppercase transition"
                          >
                            Dispatch Team
                          </button>
                        )}
                        {incident.status === 'dispatched' && (
                          <button
                            id={`resolving-btn-${incident.id}`}
                            onClick={() => onModifyIncidentStatus(incident.id, 'resolving')}
                            className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/25 py-0.5 px-2 rounded-[4px] text-[9px] font-bold uppercase transition"
                          >
                            Mark Resolving
                          </button>
                        )}
                        {incident.status !== 'resolved' && (
                          <button
                            id={`resolve-btn-${incident.id}`}
                            onClick={() => onModifyIncidentStatus(incident.id, 'resolved')}
                            className="bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/20 py-0.5 px-2 rounded-[4px] text-[9px] font-bold uppercase transition cursor-pointer"
                          >
                            Close Incident
                          </button>
                        )}

                        {/* Direct AI trigger specific to this bottleneck */}
                        <button
                          id={`ai-dispatch-${incident.id}`}
                          onClick={() => handleTriggerAIAdvice({
                            title: incident.title,
                            severity: incident.severity,
                            description: incident.description,
                            zoneName
                          })}
                          className="bg-[#06b6d4]/20 hover:bg-[#06b6d4]/40 text-[#06b6d4] border border-[#06b6d4]/30 py-0.5 px-2 rounded-[4px] text-[9px] font-black flex items-center space-x-1 transition ml-0.5 cursor-pointer uppercase"
                        >
                          <Sparkles size={10} className="text-cyan-300 animate-pulse" />
                          <span>AI Mitigate</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Declarative New Incident Entry Form */}
        <div className="bg-[#18181b] border border-[#27272a] rounded-[4px] p-4 shadow-xl">
          <div className="flex items-center space-x-2 border-b border-[#27272a] pb-2.5 mb-3.5">
            <Radio size={14} className="text-[#06b6d4] animate-pulse" />
            <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-200">Register Urgent Security/Triage Case</h3>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-3" id="incident-registration-form">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] text-[#71717a] font-bold font-mono uppercase">Incident Call Title</label>
                <input
                  type="text"
                  placeholder="e.g. South Turnstile RFID Reader Inoperative"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-[#09090b] border border-[#27272a] px-2.5 py-1.5 rounded-[4px] text-zinc-100 text-[11px] focus:outline-none focus:border-[#06b6d4] font-sans"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-[#71717a] font-bold font-mono uppercase">Mobilized Responder Team</label>
                <input
                   type="text"
                  placeholder="e.g. Volunteers Guild 5 & Medics B"
                  value={assignedTeam}
                  onChange={(e) => setAssignedTeam(e.target.value)}
                  className="w-full bg-[#09090b] border border-[#27272a] px-2.5 py-1.5 rounded-[4px] text-zinc-100 text-[11px] focus:outline-none focus:border-[#06b6d4] font-sans"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] text-[#71717a] font-bold font-mono uppercase">Triage Hazard Type</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as IncidentType)}
                  className="w-full bg-[#09090b] border border-[#27272a] px-2.5 py-1.5 rounded-[4px] text-zinc-100 text-[11px] focus:outline-none focus:border-[#06b6d4]"
                >
                  <option value="overcrowding">Overcrowding Surge</option>
                  <option value="medical">Medical Heat Collapse</option>
                  <option value="security">Physical Altercation</option>
                  <option value="structural">Structural Walkway Block</option>
                  <option value="fire">Thermal Hazard / Fire</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-[#71717a] font-bold font-mono uppercase">Threat Severity Scale</label>
                <select
                  value={newSeverity}
                  onChange={(e) => setNewSeverity(e.target.value as SeverityLevel)}
                  className="w-full bg-[#09090b] border border-[#27272a] px-2.5 py-1.5 rounded-[4px] text-zinc-100 text-[11px] focus:outline-none focus:border-[#06b6d4]"
                >
                  <option value="minor">Minor Hazard</option>
                  <option value="moderate">Moderate Triage</option>
                  <option value="major">Major Threat</option>
                  <option value="critical">Critical Alarm</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-[#71717a] font-bold font-mono uppercase">Impacted Sector</label>
                <select
                  value={newZoneId}
                  onChange={(e) => setNewZoneId(e.target.value)}
                  className="w-full bg-[#09090b] border border-[#27272a] px-2.5 py-1.5 rounded-[4px] text-zinc-100 text-[11px] focus:outline-none focus:border-[#06b6d4]"
                >
                  {zones.map((zone) => (
                    <option key={zone.id} value={zone.id}>
                      {zone.name} ({zone.dangerLevel})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-[#71717a] font-bold font-mono uppercase">Critical Scene Analysis & Details</label>
              <textarea
                rows={3}
                placeholder="Give exact description of bottleneck coordinates..."
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                className="w-full bg-[#09090b] border border-[#27272a] px-2.5 py-1.5 rounded-[4px] text-zinc-100 text-[11px] focus:outline-none focus:border-[#06b6d4] font-sans"
                required
              />
            </div>

            <button
              type="submit"
              id="submit-incident-btn"
              className="w-full py-2 bg-[#06b6d4] hover:bg-[#0891b2] text-[#09090b] font-bold rounded-[4px] text-[10px] font-mono tracking-wider uppercase transition shadow-lg cursor-pointer"
            >
              Dispatch Mobilization Order
            </button>
          </form>
        </div>
      </div>

      {/* Col 2: Gemini AI Co-Pilot Tactical Rerouting Desk */}
      <div className="space-y-4">
        <div className="bg-[#18181b] border border-[#27272a] rounded-[4px] p-4 shadow-3xl text-zinc-200 flex flex-col h-full justify-between min-h-[460px]">
          
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-[#27272a] pb-2.5">
              <div className="flex items-center space-x-2">
                <div className="px-1.5 py-0.5 bg-[#06b6d4]/10 rounded-sm border border-[#06b6d4]/20 text-[#06b6d4] flex items-center space-x-1 text-[9px] font-bold tracking-wider">
                  <Sparkles size={11} className="animate-pulse" />
                  <span>GEMINI TACTICAL HELM</span>
                </div>
              </div>
              <span className="text-[9px] font-mono text-zinc-500">v2.0 Flash Core</span>
            </div>

            <p className="text-[10.5px] leading-relaxed text-[#a1a1aa] font-sans">
              Aggregates historical gate parameters and current ticket turnstile volumes to formulate micro-containment or exit rerouting plans under real constraints.
            </p>

            {/* Custom Scenario Prompt Area */}
            <div className="space-y-1.5 pt-1">
              <label className="text-[9px] text-[#71717a] font-bold font-mono uppercase tracking-wide">Enter Custom Scenario Description</label>
              <div className="relative">
                <textarea
                  rows={2}
                  placeholder="e.g. Turnstile reader fault... Exit lines surging rapidly"
                  value={aiPromptOverride}
                  onChange={(e) => setAiPromptOverride(e.target.value)}
                  className="w-full bg-[#09090b] border border-[#27272a] p-2.5 pr-10 rounded-[4px] text-zinc-100 text-[11px] focus:outline-none focus:border-[#06b6d4] font-sans"
                />
                <button
                  id="send-ai-prompt"
                  onClick={() => handleTriggerAIAdvice(null)}
                  disabled={isAILoading}
                  className="absolute bottom-2.5 right-2 text-[#06b6d4] hover:text-cyan-400 disabled:text-zinc-600 cursor-pointer"
                  title="Query AI Helm"
                >
                  {isAILoading ? (
                    <Loader2 size={13} className="animate-spin" />
                  ) : (
                    <ArrowRightCircle size={15} />
                  )}
                </button>
              </div>
            </div>

            {/* Quick-Prompt Suggestions */}
            <div className="flex flex-wrap gap-1.5">
              {[
                'Exit Optimization',
                'Reader Failure',
                'Weather Incursion'
              ].map((pill, i) => (
                <button
                  key={i}
                  id={`ai-preset-${i}`}
                  onClick={() => setAiPromptOverride(pill)}
                  className="text-[9px] font-mono px-2 py-0.5 rounded-sm bg-[#1c1c1e] text-[#a1a1aa] border border-[#27272a] hover:text-[#06b6d4] hover:border-[#06b6d4] transition duration-150 cursor-pointer uppercase"
                >
                  {pill}
                </button>
              ))}
            </div>
          </div>

          {/* Prompt result render */}
          <div className="mt-4 flex-1 bg-[#09090b]/60 p-3 rounded-[4px] border border-[#27272a]/80 overflow-y-auto max-h-[340px] text-[10.5px] space-y-2.5 relative shadow-inner font-mono">
            {isAILoading ? (
              <div className="h-40 flex flex-col items-center justify-center space-y-2.5 text-zinc-500">
                <Loader2 size={20} className="animate-spin text-[#06b6d4]" />
                <p className="text-[9px] font-mono text-center animate-pulse tracking-wide">
                  GEMINI IS STREAMING CRITICAL MITIGATION MATRIX...<br />
                  CALCULATING EVAC PATHWAYS & STAFF CODES.
                </p>
              </div>
            ) : aiAdvice ? (
              <div className="space-y-2.5 animate-[fadeIn_0.3s_ease]">
                <div className="flex items-center justify-between text-[9px] font-mono text-[#06b6d4] font-bold border-b border-[#27272a]/50 pb-1.5 uppercase">
                  <span>MITIGATION FORMED</span>
                  <span>SAFETY RATING: {aiAdvice.urgencyScore}%</span>
                </div>
                
                <div className="space-y-2 font-sans">
                  <div>
                    <h5 className="font-bold text-zinc-200 text-[10px] font-mono uppercase tracking-wider">Target Area</h5>
                    <p className="text-zinc-400 text-[10.5px]">{aiAdvice.bottleneckLocation}</p>
                  </div>
                  <div>
                    <h5 className="font-bold text-[#fafafa] text-[10px] font-mono uppercase tracking-wider">Directives</h5>
                    <p className="text-[#a1a1aa] leading-relaxed text-[10.5px] whitespace-pre-line font-normal">{aiAdvice.tacticalPlan}</p>
                  </div>
                  <div className="bg-[#06b6d4]/5 border border-[#06b6d4]/10 p-2 rounded-[4px] text-[10px] text-zinc-300 font-mono">
                    <span className="font-bold text-[#06b6d4] uppercase">PA Alert: </span>
                    {aiAdvice.suggestedAction}
                  </div>
                </div>

                <div className="text-[8px] font-mono text-zinc-600 text-right">
                  Synthesized at {new Date(aiAdvice.timestamp).toLocaleTimeString()}
                </div>
              </div>
            ) : (
              <div className="h-40 flex flex-col items-center justify-center text-[#71717a] text-center space-y-1">
                <Sparkles size={16} className="text-[#3f3f46] animate-pulse" />
                <p className="text-[10px] font-bold uppercase tracking-wider">Helm Standby</p>
                <p className="text-[9.5px] text-[#71717a] font-sans">Provide scenario parameters or click "AI Mitigate" to receive live procedures.</p>
              </div>
            )}
          </div>

        </div>
      </div>

    </div>
  );
}

// Minimal type mapping interface to support prompt dispatch formats
interface OptionalIncident {
  title: string;
  severity: string;
  description: string;
  zoneName: string;
}
