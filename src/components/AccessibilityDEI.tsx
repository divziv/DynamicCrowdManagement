/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Accessibility, Eye, Volume2, Type, SunMoon, CheckCircle2 } from 'lucide-react';
import { AccessibilitySettings, ColorBlindMode } from '../types';

interface AccessibilityDEIProps {
  settings: AccessibilitySettings;
  updateSettings: (newSettings: Partial<AccessibilitySettings>) => void;
  announceToScreen: (message: string) => void;
}

/**
 * Renders an advanced, WCAG-compliant accessibility workspace.
 * Features full simulation filters, type sizing, contrast enhancements, and speech playback.
 */
export default function AccessibilityDEI({
  settings,
  updateSettings,
  announceToScreen,
}: AccessibilityDEIProps) {
  
  /**
   * Triggers audible state changes to demonstrate active acoustic cueing feedback.
   */
  const playPing = () => {
    if (settings.audioPings) {
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // high tone
        gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.4);

        oscillator.start(audioCtx.currentTime);
        oscillator.stop(audioCtx.currentTime + 0.4);
      } catch (err) {
        console.warn('Web Audio check: Context unable to instantiate until interaction.', err);
      }
    }
  };

  /**
   * Helper to switch font sizing scale and announce changes.
   */
  const handleScaleToggle = (scale: 'normal' | 'large' | 'extra-large') => {
    updateSettings({ textScale: scale });
    announceToScreen(`Text scaling adjusted to ${scale} mode.`);
    playPing();
  };

  /**
   * Helper to update color blind overlay or high contrast and announce.
   */
  const handleColorBlindChange = (mode: ColorBlindMode) => {
    updateSettings({ colorBlindMode: mode });
    announceToScreen(`Simulation filter changed to ${mode}.`);
    playPing();
  };

  /**
   * Test screen reader aloud utilizing modern SpeechSynthesis browser modules.
   */
  const testSpeechSynth = () => {
    const textToRead = "Acoustic Triage active. Current stadium level: South Gate 1 is critical density, alternate exit routings enabled via gate C. Keep clear of central walkways.";
    announceToScreen(textToRead);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Acoustic feedback speech synthesizer isn't supported inside this browser environment.");
    }
  };

  return (
    <div className="bg-[#18181b] border border-[#27272a] rounded-[4px] p-4 shadow-2xl space-y-6" id="dei-control-panel">
      
      {/* Dynamic SVG Filter Definitions - Rendered once, hidden, used by CSS filter URLs */}
      <svg className="hidden" aria-hidden="true" width="0" height="0">
        <defs>
          <filter id="protanopia-filter">
            <feColorMatrix
              type="matrix"
              values="0.567, 0.433, 0.000, 0.000, 0.000
                      0.558, 0.442, 0.000, 0.000, 0.000
                      0.000, 0.242, 0.758, 0.000, 0.000
                      0.000, 0.000, 0.000, 1.000, 0.000"
            />
          </filter>
          <filter id="deuteranopia-filter">
            <feColorMatrix
              type="matrix"
              values="0.625, 0.375, 0.000, 0.000, 0.000
                      0.700, 0.300, 0.000, 0.000, 0.000
                      0.000, 0.300, 0.700, 0.000, 0.000
                      0.000, 0.000, 0.000, 1.000, 0.000"
            />
          </filter>
          <filter id="achromatopsia-filter">
            <feColorMatrix
              type="matrix"
              values="0.299, 0.587, 0.114, 0.000, 0.000
                      0.299, 0.587, 0.114, 0.000, 0.000
                      0.299, 0.587, 0.114, 0.000, 0.000
                      0.000, 0.000, 0.000, 1.000, 0.000"
            />
          </filter>
        </defs>
      </svg>

      <div className="flex items-center justify-between border-b border-[#27272a] pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="p-1.5 bg-[#06b6d4]/10 rounded-[4px] text-[#06b6d4]">
            <Accessibility size={16} className="animate-pulse" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-100 font-sans tracking-wide uppercase">Accessibility & DEI Command</h3>
            <p className="text-[10px] text-slate-400 font-mono">WCAG AA Standard Compliance Toggles</p>
          </div>
        </div>
        <span className="text-[8px] uppercase font-mono tracking-widest bg-emerald-500/10 text-emerald-400 py-0.5 px-2 rounded-[4px] border border-emerald-500/20">
          Actively Calibrated
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Color Blindness Simulation Controls */}
        <div className="space-y-4">
          <label className="flex items-center text-sm font-semibold text-slate-200">
            <Eye size={16} className="mr-2 text-indigo-400" />
            Color-Blind Vision Mode Simulators
          </label>
          <p className="text-xs text-slate-400 leading-relaxed leading-normal">
            Select a mode to transform colors across the interactive 3D/2D heatmaps. This guarantees crowd safety warnings are recognizable regardless of color deficiencies.
          </p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'none', label: 'Standard RGB' },
              { id: 'protanopia', label: 'Protanopia (Red Def.)' },
              { id: 'deuteranopia', label: 'Deuteranopia (Green Def.)' },
              { id: 'achromatopsia', label: 'Achromatopsia (Mono)' },
            ].map((mode) => (
              <button
                key={mode.id}
                id={`btn-cb-${mode.id}`}
                onClick={() => handleColorBlindChange(mode.id as ColorBlindMode)}
                className={`py-2 px-3 text-left rounded-lg text-xs font-mono transition-all duration-200 border ${
                  settings.colorBlindMode === mode.id
                    ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 shadow-md'
                    : 'bg-slate-800/50 border-slate-700/80 hover:border-slate-600 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{mode.label}</span>
                  {settings.colorBlindMode === mode.id && <CheckCircle2 size={12} className="text-indigo-400" />}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Text Scaling & Interactive Contrast */}
        <div className="space-y-4">
          <label className="flex items-center text-sm font-semibold text-slate-200">
            <Type size={16} className="mr-2 text-indigo-400" />
            Text & Readability Scaling
          </label>
          <p className="text-xs text-slate-400 leading-relaxed">
            Increase typography hierarchy scales to aid visual coordination across terminal units and volunteer tablets.
          </p>
          
          <div className="flex bg-slate-800/40 p-1.5 rounded-xl border border-slate-800">
            {[
              { id: 'normal', label: 'Normal (100%)' },
              { id: 'large', label: 'Large (120%)' },
              { id: 'extra-large', label: 'Max (140%)' },
            ].map((scale) => (
              <button
                key={scale.id}
                id={`btn-ts-${scale.id}`}
                onClick={() => handleScaleToggle(scale.id as 'normal' | 'large' | 'extra-large')}
                className={`flex-1 py-1.5 text-center rounded-lg text-xs transition-all duration-200 ${
                  settings.textScale === scale.id
                    ? 'bg-indigo-600 text-white font-medium shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {scale.label}
              </button>
            ))}
          </div>

          {/* High Contrast Toggle Switch */}
          <div className="flex items-center justify-between p-3.5 bg-slate-800/30 rounded-xl border border-slate-800/60">
            <div className="flex items-center space-x-3">
              <SunMoon size={18} className="text-indigo-400" />
              <div>
                <p className="text-xs font-semibold text-slate-100">Absolute Contrast Override</p>
                <p className="text-[10px] text-slate-500 font-mono">Forces strict deep charcoal & high lumens</p>
              </div>
            </div>
            <button
              id="btn-high-contrast"
              onClick={() => {
                updateSettings({ highContrast: !settings.highContrast });
                announceToScreen(`Contrast override set to ${!settings.highContrast ? 'active' : 'inactive'}.`);
                playPing();
              }}
              className={`w-11 h-6 rounded-full transition-colors relative duration-200 flex items-center p-0.5 ${
                settings.highContrast ? 'bg-indigo-600' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200 ${
                  settings.highContrast ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

        </div>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-800/80">
        
        {/* Acoustic Triage Sound Settings */}
        <div className="space-y-4">
          <label className="flex items-center text-sm font-semibold text-slate-200">
            <Volume2 size={16} className="mr-2 text-indigo-400" />
            Audio Triage Auditing
          </label>
          <p className="text-xs text-slate-400 leading-relaxed">
            Acoustic cueing allows operators with lower-range visual capabilities to audit density status via automated pitch frequencies.
          </p>
          <div className="flex items-center justify-between p-3.5 bg-slate-800/30 rounded-xl border border-slate-800/60">
            <div>
              <p className="text-xs font-semibold text-slate-100">Interactive Audio Beeps</p>
              <p className="text-[10px] text-slate-500 font-mono">Bleep tone occurs upon sector hover and toggles</p>
            </div>
            <button
              id="btn-audio-beeps"
              onClick={() => {
                const updated = !settings.audioPings;
                updateSettings({ audioPings: updated });
                if (updated) {
                  // Wait to let users click and build context
                  setTimeout(() => {
                    playPing();
                  }, 50);
                }
              }}
              className={`w-11 h-6 rounded-full transition-colors relative duration-200 flex items-center p-0.5 ${
                settings.audioPings ? 'bg-indigo-600' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200 ${
                  settings.audioPings ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Screen Reader Synthesizer (DEI Proof of Concept) */}
        <div className="space-y-4">
          <label className="flex flex-col text-sm font-semibold text-slate-200">
            <span>Acoustic Speech Synthesis (Screen Reader)</span>
            <span className="text-[10px] text-slate-500 font-mono mt-0.5">Test auditory announcements</span>
          </label>
          <p className="text-xs text-slate-400 leading-relaxed">
            Synthesize and play aloud tactical instructions for volunteers or ground operators utilizing hands-free audio announcements on matchdays.
          </p>
          <button
            id="btn-test-screen-reader"
            onClick={testSpeechSynth}
            className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-indigo-600/10 hover:bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 rounded-xl text-xs font-semibold transition duration-150"
          >
            <Volume2 size={16} className="animate-bounce" />
            <span>Generate & Speak Aloud Triage Message</span>
          </button>
        </div>

      </div>

    </div>
  );
}
