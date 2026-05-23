/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  ShieldAlert, UserCheck, Shield, Key, CheckSquare, 
  Settings, Users, ClipboardList, Info, Sparkles, Building, Briefcase
} from 'lucide-react';

export type UserRole = 'admin' | 'ops' | 'security' | 'volunteers' | 'managers' | 'sponsors';

interface RoleCenterProps {
  activeRole: UserRole;
  onChangeRole: (role: UserRole, userName: string) => void;
  currentUserName: string;
}

export default function RoleCenter({
  activeRole,
  onChangeRole,
  currentUserName,
}: RoleCenterProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole>(activeRole);
  const [typedName, setTypedName] = useState<string>(currentUserName);
  const [isLogged, setIsLogged] = useState<boolean>(true);
  const [successMsg, setSuccessMsg] = useState<string>('');

  // Interactive task lists state
  const [tasks, setTasks] = useState({
    admin: [
      { id: 'ad-1', text: 'Calibrate AWS and Edge telemetry, sync turnstiles', done: true },
      { id: 'ad-2', text: 'Audit security rules for automated physical gates open', done: false },
      { id: 'ad-3', text: 'Publish emergency protocol parameters to mobile endpoints', done: true },
    ],
    ops: [
      { id: 'op-1', text: 'Verify online booking transaction server metrics', done: true },
      { id: 'op-2', text: 'Launch Gate E overflow turnstile lane scans', done: false },
      { id: 'op-3', text: 'Coordinate team jersey and souvenir kit counters at Gate D', done: false },
    ],
    security: [
      { id: 'sc-1', text: 'Deploy local usher units to clear East Gallery Bottleneck B', done: false },
      { id: 'sc-2', text: 'Sync radio logs with Red Cross dehydrated squad paramedics', done: true },
      { id: 'sc-3', text: 'Arm automated crowd safety evacuation routing thresholds', done: true },
    ],
    volunteers: [
      { id: 'vo-1', text: 'Establish wheelchair accessibility guidance ramp F', done: true },
      { id: 'vo-2', text: 'Distribute flags and cheering kits to Family sections', done: false },
      { id: 'vo-3', text: 'Report any localized heat exhaustion or hydration requests', done: false },
    ],
    managers: [
      { id: 'mg-1', text: 'Clear VIP Pavilion buffet lists and press credentials', done: true },
      { id: 'mg-2', text: 'Confirm players locker-room ventilation state & backup power', done: true },
      { id: 'mg-3', text: 'Coordinate with match umpires on thermal delays weather updates', done: false },
    ],
    sponsors: [
      { id: 'sp-1', text: 'Authorize digital advertisement board stadium triggers', done: true },
      { id: 'sp-2', text: 'Restock premium catering booths & refreshment carts', done: false },
      { id: 'sp-3', text: 'Check VIP hospitality corporate boxes HVAC metrics', done: false },
    ]
  });

  const toggleTask = (roleKey: UserRole, taskId: string) => {
    setTasks(prev => ({
      ...prev,
      [roleKey]: prev[roleKey].map(t => t.id === taskId ? { ...t, done: !t.done } : t)
    }));
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedName) return;
    onChangeRole(selectedRole, typedName);
    setIsLogged(true);
    setSuccessMsg(`Access Granted: ${typedName.toUpperCase()} authenticated as ${selectedRole.toUpperCase()}`);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  // Role Metadata
  const roleSpecs = {
    admin: {
      title: 'Administrator (Command Chief)',
      color: 'border-[#ef4444] text-[#ef4444]',
      bg: 'bg-red-500/5',
      desc: 'Oversees the entire stadium lifecycle. Sets system thresholds, triggers live drills, and manages network integrations.',
      authority: 'Level-5 (Global Master Console Overrides)'
    },
    ops: {
      title: 'Operations Team (Flow & Box Office)',
      color: 'border-[#06b6d4] text-[#06b6d4]',
      bg: 'bg-cyan-500/5',
      desc: 'Controls ticketing counters, turnstiles scanning operations, queue speeds, and inventory of giveaway kits.',
      authority: 'Level-3 (Ticketing, Gates & Turnstiles Control)'
    },
    security: {
      title: 'Security Command Desk (Tactical Helm)',
      color: 'border-orange-500 text-orange-400',
      bg: 'bg-orange-500/5',
      desc: 'Responders dispatch coordinator. Handles medical emergency queues, fire alarms, and automated crisis triggers.',
      authority: 'Level-4 (Emergency Dispatch & Automated Deflections)'
    },
    volunteers: {
      title: 'Volunteers and Field Stewards',
      color: 'border-emerald-500 text-emerald-400',
      bg: 'bg-emerald-500/5',
      desc: 'First point of spectator assistance. Manages stadium swags distribution and localized crowd assistance requests.',
      authority: 'Level-1 (Field Reporting & Kit Distribution)'
    },
    managers: {
      title: 'Team and Stadium Venue Managers',
      color: 'border-indigo-500 text-indigo-400',
      bg: 'bg-indigo-500/5',
      desc: 'Manages player areas, pavilions, cricket pitch ground restrictions, match umpire calls, and emergency telemetry.',
      authority: 'Level-2 (Players Arena, Pavilion & Team Logistics)'
    },
    sponsors: {
      title: 'Sponsors & Hospitality Stewards',
      color: 'border-amber-500 text-amber-300',
      bg: 'bg-amber-500/5',
      desc: 'Controls luxury suites hospitality, food catering carts, sponsor displays, and promotional screen events.',
      authority: 'Level-2 (Refreshment Carts & Corporate Suites)'
    }
  };

  return (
    <div className="space-y-4" id="role-workspace-grid">
      
      {/* Selection Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Profile Login Box */}
        <div className="bg-[#18181b] border border-[#27272a] p-4 rounded-[4px] shadow-xl flex flex-col justify-between" id="role-auth-card">
          <div>
            <div className="flex items-center space-x-2 border-b border-[#27272a] pb-2 mb-3.5">
              <Key size={14} className="text-[#06b6d4]" />
              <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-200">Secure Access Desk</h3>
            </div>
            
            <form onSubmit={handleLoginSubmit} className="space-y-3">
              <div>
                <label className="text-[10px] text-[#71717a] font-bold font-mono uppercase block mb-1">Select Command Role</label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                  className="w-full bg-[#09090b] border border-[#27272a] px-2.5 py-1.5 rounded-[4px] text-zinc-100 text-[11px] focus:outline-none focus:border-[#06b6d4]"
                >
                  <option value="admin">Admin / System Chief</option>
                  <option value="ops">Ops Team (Box Office)</option>
                  <option value="security">Security Team (Emergency)</option>
                  <option value="volunteers">Volunteers Team (Field Guide)</option>
                  <option value="managers">Team Manager (Pavilions)</option>
                  <option value="sponsors">Sponsors Desk (Catering)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-[#71717a] font-bold font-mono uppercase block mb-1">User Credentials (Name)</label>
                <input
                  type="text"
                  value={typedName}
                  onChange={(e) => setTypedName(e.target.value)}
                  placeholder="e.g. Inspector Miller"
                  className="w-full bg-[#09090b] border border-[#27272a] px-2.5 py-1.5 rounded-[4px] text-zinc-100 text-[11px] focus:outline-none focus:border-[#06b6d4] font-sans"
                  required
                />
              </div>

              <button
                type="submit"
                id="authenticate-role-btn"
                className="w-full py-1.5 bg-[#06b6d4] hover:bg-[#0891b2] text-[#09090b] font-bold rounded-[4px] text-[10px] font-mono tracking-wider uppercase transition cursor-pointer"
              >
                Authenticate Role Session
              </button>
            </form>
          </div>

          <div className="mt-4 pt-3 border-t border-[#27272a] text-[9.5px] font-mono text-zinc-500">
            <p>Authentication token utilizes secure offline browser caching. Session activity conforms to stadium audit mandates.</p>
          </div>
        </div>

        {/* Current Active Clearance Profile details */}
        <div className="bg-[#18181b] border border-[#27272a] p-4 rounded-[4px] shadow-xl lg:col-span-2 flex flex-col justify-between" id="active-profile-card">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-[#27272a] pb-2">
              <div className="flex items-center space-x-2">
                <UserCheck size={14} className="text-[#06b6d4]" />
                <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-200">Active Profile Terminal</h3>
              </div>
              <span className="text-[9px] font-mono bg-zinc-800 text-zinc-400 py-0.5 px-2 rounded-[4px]">
                Active: {activeRole.toUpperCase()}
              </span>
            </div>

            {successMsg && (
              <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono rounded-[4px] animate-pulse">
                {successMsg}
              </div>
            )}

            <div className={`p-4 rounded-[4px] border ${roleSpecs[activeRole].color} ${roleSpecs[activeRole].bg} space-y-2`}>
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-black uppercase tracking-wide font-mono select-all">
                  {roleSpecs[activeRole].title}
                </h4>
                <span className="text-[9px] font-mono bg-black/40 px-2 py-0.5 rounded-sm">
                  {roleSpecs[activeRole].authority}
                </span>
              </div>
              
              <p className="text-[11px] text-zinc-300 leading-relaxed font-sans">
                {roleSpecs[activeRole].desc}
              </p>
              
              <div className="text-[10px] text-zinc-400 font-mono flex items-center space-x-1">
                <span>Terminal User: </span>
                <strong className="text-zinc-100 text-xs font-bold font-sans"> {currentUserName || 'No Active Account'}</strong>
              </div>
            </div>
          </div>

          <div className="text-[10px] font-mono bg-[#09090b]/55 p-2 rounded-[4px] border border-[#27272a] flex justify-between">
            <span className="text-zinc-500">Security Clearance Audited:</span>
            <span className="text-cyan-400 font-bold">YES &middot; READY</span>
          </div>
        </div>

      </div>

      {/* Role Tasks list Checklist for each user */}
      <div className="bg-[#18181b] border border-[#27272a] p-4 rounded-[4px] shadow-2xl" id="role-checklist-desk">
        <div className="flex items-center space-x-2 border-b border-[#27272a] pb-2.5 mb-3.5">
          <ClipboardList size={14} className="text-[#06b6d4]" />
          <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-[#fafafa]">Role-Specific Operational Runbook checklists</h4>
        </div>

        <p className="text-[11px] text-[#a1a1aa] mb-4">
          Each team follows custom protocols. Mark off items as you secure each sector to maintain continuous stadium green rating status.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(Object.keys(tasks) as UserRole[]).map((roleKey) => {
            const roleDetails = roleSpecs[roleKey];
            const isSelf = roleKey === activeRole;
            return (
              <div 
                key={roleKey} 
                className={`p-3 rounded-[4px] border ${
                  isSelf ? 'bg-[#09090b]/80 border-[#06b6d4]' : 'bg-[#09090b]/30 border-[#27272a] opacity-60'
                }`}
              >
                <div className="flex justify-between items-center border-b border-[#27272a] pb-1.5 mb-2.5">
                  <span className="text-[9.5px] uppercase font-bold text-zinc-300 font-mono tracking-wider">
                    {roleKey} Runbook {isSelf && '★'}
                  </span>
                  
                  <span className="text-[8px] uppercase tracking-widest font-mono text-zinc-500">
                    {tasks[roleKey].filter(t => t.done).length} / {tasks[roleKey].length} COMPLETE
                  </span>
                </div>

                <div className="space-y-1.5">
                  {tasks[roleKey].map((task) => (
                    <label 
                      key={task.id} 
                      className={`flex items-start space-x-2 text-[10.5px] p-1.5 rounded-sm transition cursor-pointer ${
                        task.done ? 'text-zinc-500 line-through bg-zinc-950/20' : 'text-zinc-200 hover:bg-[#18181b]/50'
                      }`}
                    >
                      <input 
                        type="checkbox"
                        checked={task.done}
                        onChange={() => toggleTask(roleKey, task.id)}
                        className="mt-0.5 border-[#27272a] text-[#06b6d4] focus:ring-0 cursor-pointer"
                      />
                      <span className="font-sans leading-tight">{task.text}</span>
                    </label>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
