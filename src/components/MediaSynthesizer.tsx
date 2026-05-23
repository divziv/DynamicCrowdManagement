/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Volume2, Play, Music, Radio, Sparkles, VolumeX, Sliders, PlayCircle, Disc, Headphones
} from 'lucide-react';

interface MediaSynthesizerProps {
  onAddNotification: (message: string, severity: 'info' | 'warning' | 'error' | 'ai') => void;
  onSpeak?: (msg: string) => void;
}

export default function MediaSynthesizer({
  onAddNotification,
  onSpeak,
}: MediaSynthesizerProps) {
  // TTS State
  const [ttsText, setTtsText] = useState<string>('Attention. Alternate exit pathways are now open near Gate F to clear concourse bottlenecks.');
  const [voicePitch, setVoicePitch] = useState<number>(1.0);
  const [voiceRate, setVoiceRate] = useState<number>(1.0);

  // Audio syntehsizer properties
  const [waveShape, setWaveShape] = useState<OscillatorType>('sine');
  const [decSeconds, setDecSeconds] = useState<number>(0.5);

  /**
   * Universal procedural synthesizer. Generates real acoustic sound waves
   * inside the user's browser without requiring slow, external asset files.
   */
  const synthesizeAcousticSound = (freqs: number[], duration = 0.5, type: OscillatorType = 'sine', modulation = false) => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      freqs.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.type = idx === 1 && type === 'sine' ? 'triangle' : type;
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

        if (modulation) {
          // Alarm oscillator frequency sweeping modulation
          osc.frequency.linearRampToValueAtTime(freq * 1.5, audioCtx.currentTime + duration);
        }

        gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

        osc.start(audioCtx.currentTime);
        osc.stop(audioCtx.currentTime + duration + 0.1);
      });
      
    } catch (e) {
      console.warn('Web Audio activation locked until explicit interaction.', e);
    }
  };

  // Preset Instrument Sounds
  const triggerInstrument = (instrument: 'dhol' | 'trumpet' | 'airhorn' | 'clap') => {
    switch (instrument) {
      case 'dhol': // Low deep acoustic drum beats
        synthesizeAcousticSound([90, 110], 0.4, 'triangle');
        setTimeout(() => synthesizeAcousticSound([85, 100], 0.3, 'triangle'), 150);
        onAddNotification('CHEER SOUND: Tribal Dhol beats played! 🥁', 'info');
        break;
      case 'trumpet': // Elevated brass fanfares
        synthesizeAcousticSound([523.25, 659.25], 0.5, 'sawtooth');
        setTimeout(() => synthesizeAcousticSound([659.25, 783.99], 0.6, 'sawtooth'), 200);
        onAddNotification('CHEER SOUND: Metallic Trumpet fanfare triggered! 🎺', 'info');
        break;
      case 'airhorn': // High modulating blast
        synthesizeAcousticSound([180, 220], 0.8, 'sawtooth', true);
        onAddNotification('CHEER SOUND: APL Stadium Airhorn active! 📢', 'warning');
        break;
      case 'clap': // Short rapid acoustic snaps
        synthesizeAcousticSound([900], 0.08, 'sine');
        setTimeout(() => synthesizeAcousticSound([930], 0.08, 'sine'), 80);
        setTimeout(() => synthesizeAcousticSound([880], 0.09, 'sine'), 160);
        onAddNotification('CHEER SOUND: Triple cricket clap generated! 👏', 'info');
        break;
    }
  };

  // Composed Cheer Jingle notes player
  const playJingleSequence = (seq: string) => {
    const notes: Record<string, number> = {
      'C': 261.63, 'D': 293.66, 'E': 329.63, 'F': 349.23, 'G': 392.00, 'A': 440.00, 'B': 493.88, 'C5': 523.25
    };

    let sequenceNotes: string[] = [];
    if (seq === 'ipl-cheer') {
      sequenceNotes = ['C', 'F', 'A', 'G', 'F', 'C5', 'A', 'G'];
      onAddNotification('JINGLE MAKER: Playback "Agentic Premier League Anthem"!', 'ai');
    } else if (seq === 'victory') {
      sequenceNotes = ['E', 'G', 'B', 'G', 'A', 'E', 'G', 'C5'];
      onAddNotification('JINGLE MAKER: Playback "Stadium Victory Chant"!', 'ai');
    } else {
      sequenceNotes = ['C', 'D', 'E', 'G', 'A', 'B', 'C5', 'C5'];
      onAddNotification('JINGLE MAKER: Playback default rising scale!', 'info');
    }

    sequenceNotes.forEach((char, idx) => {
      setTimeout(() => {
        const freq = notes[char] || 261.63;
        synthesizeAcousticSound([freq], decSeconds, waveShape);
      }, idx * 180);
    });
  };

  // Keyboard notes trigger
  const playSingleNote = (freq: number, label: string) => {
    synthesizeAcousticSound([freq], decSeconds, waveShape);
    onAddNotification(`Synthesized Note Freq: ${freq} Hz (${label})`, 'info');
  };

  // Custom TTS Vocalizer
  const executeTtsBroadcast = () => {
    if (!ttsText.trim()) return;

    onAddNotification(`TTS BROADCAST AUDITED: "${ttsText}" vocalized.`, 'info');

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(ttsText);
      utterance.pitch = voicePitch;
      utterance.rate = voiceRate;
      window.speechSynthesis.speak(utterance);
    } else {
      onAddNotification('Vocal synthesizer unsupported inside browser iframe context.', 'warning');
    }
  };

  // Prebaked security advisories trigger
  const triggerPrebakedTts = (mode: 'evac' | 'hydration' | 'delay' | 'welcome') => {
    let script = '';
    if (mode === 'evac') {
      script = 'STADIUM EMERGENCY SIRENS ACTIVE. Emergency staff proceed to Gate D. Evacutating crowds safely to backup southern zones.';
    } else if (mode === 'hydration') {
      script = 'Extreme heat warning at stands. Hydrate abundantly at closest cafe catering kiosks in Ground Concourse levels.';
    } else if (mode === 'delay') {
      script = 'Match play was momentarily delayed. Please locate closest bathroom amenities or secure players pavilion pathways.';
    } else {
      script = 'Welcome to the match center, Agentic Premier League live telemetry sync initiated. Safe seating practices active.';
    }

    setTtsText(script);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(script);
      utterance.pitch = voicePitch;
      utterance.rate = voiceRate;
      window.speechSynthesis.speak(utterance);
    }
    onAddNotification(`TTS BROADCAST ADVISORY: Script loaded and spoken.`, 'warning');
  };

  return (
    <div className="space-y-4" id="media-synthesizer-workspace">
      
      {/* Top row split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* TTS Vocal Desk Card */}
        <div className="bg-[#18181b] border border-[#27272a] p-4 rounded-[4px] shadow-xl flex flex-col justify-between" id="tts-vocalizer-card">
          <div className="space-y-3.5">
            <div className="flex items-center space-x-2 border-b border-[#27272a] pb-2.5">
              <Radio size={14} className="text-[#06b6d4] animate-pulse" />
              <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-200">Public PA Vocalizer (Text-to-Speech)</h3>
            </div>

            <p className="text-[11px] text-[#a1a1aa] leading-normal font-sans">
              Type custom directions or safety emergency commands. Operates via HTML5 SpeechSynthesis to issue vocal alerts to all stands.
            </p>

            <div className="space-y-3">
              <div>
                <textarea
                  rows={3}
                  value={ttsText}
                  onChange={(e) => setTtsText(e.target.value)}
                  placeholder="Enter PA alert announcement..."
                  className="w-full bg-[#09090b] border border-[#27272a] p-2.5 rounded-[4px] text-zinc-100 text-[11px] focus:outline-none focus:border-[#06b6d4] font-sans"
                />
              </div>

              {/* Sliders */}
              <div className="grid grid-cols-2 gap-3 pb-1">
                <div className="space-y-1">
                  <div className="flex justify-between text-[9.5px] font-mono text-zinc-500">
                    <span>Voice Pitch Index:</span>
                    <span>{voicePitch}x</span>
                  </div>
                  <input 
                    type="range"
                    min="0.5"
                    max="1.5"
                    step="0.1"
                    value={voicePitch}
                    onChange={(e) => setVoicePitch(parseFloat(e.target.value))}
                    className="w-full h-1 bg-[#09090b] accent-[#06b6d4] appearance-none"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[9.5px] font-mono text-zinc-500">
                    <span>Speed Velocity:</span>
                    <span>{voiceRate}x</span>
                  </div>
                  <input 
                    type="range"
                    min="0.6"
                    max="1.6"
                    step="0.1"
                    value={voiceRate}
                    onChange={(e) => setVoiceRate(parseFloat(e.target.value))}
                    className="w-full h-1 bg-[#09090b] accent-[#06b6d4] appearance-none"
                  />
                </div>
              </div>

              {/* Launch triggers */}
              <div className="flex space-x-2">
                <button
                  type="button"
                  id="vocalize-speak-btn"
                  onClick={executeTtsBroadcast}
                  className="flex-1 py-1.5 bg-[#06b6d4] hover:bg-[#0891b2] text-[#09090b] font-bold rounded-[4px] text-[10px] font-mono tracking-wider uppercase transition flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <Volume2 size={12} />
                  <span>Broadcast Custom Script</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick loading prebaked bulletins */}
          <div className="mt-4 pt-3 border-t border-[#27272a]">
            <p className="text-[9px] uppercase font-mono tracking-wider text-[#71717a] pb-2 font-bold">Standard Safety Advisories Presets</p>
            <div className="flex flex-wrap gap-1">
              {[
                { id: 'welcome', label: 'Match Welcome', tone: 'info' },
                { id: 'hydration', label: 'Heat advisory', tone: 'warning' },
                { id: 'welcome', label: 'Facility status', tone: 'info' },
                { id: 'evac', label: 'SIREN EVACUATE', tone: 'error' }
              ].map((pill, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => triggerPrebakedTts(pill.id as any)}
                  className="text-[9px] font-mono px-2 py-1 rounded bg-[#1c1c1e] text-[#a1a1aa] border border-[#27272a] hover:text-[#06b6d4] hover:border-[#06b6d4] uppercase cursor-pointer"
                >
                  {pill.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Dynamic Sounds & Cheering Synthesizer Card */}
        <div className="bg-[#18181b] border border-[#27272a] p-4 rounded-[4px] shadow-xl flex flex-col justify-between" id="cheer-sound-board">
          <div className="space-y-3.5">
            <div className="flex items-center space-x-2 border-b border-[#27272a] pb-2.5">
              <Music size={14} className="text-[#06b6d4]" />
              <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-200">Cheer sound & jingles Synthesizer</h3>
            </div>

            <p className="text-[11px] text-[#a1a1aa] leading-normal font-sans">
              Compose custom cheering sounds and melodies for APL matches natively using oscillators. Adjust decay, waveforms, and tap preset pads.
            </p>

            <div className="space-y-3">
              {/* Preset buttons */}
              <div>
                <label className="text-[10px] text-[#71717a] font-bold font-mono uppercase block mb-1.5">Interactive Cheer Instruments Pads</label>
                <div className="grid grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => triggerInstrument('dhol')}
                    className="py-2.5 bg-[#09090b] border border-[#27272a] hover:border-cyan-400 text-[#fafafa] rounded-[4px] flex flex-col items-center justify-center space-y-1 transition text-[10px] uppercase font-mono cursor-pointer"
                  >
                    <span>🥁 Beats</span>
                    <span className="text-[8.5px] text-zinc-500">Dhol</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => triggerInstrument('trumpet')}
                    className="py-2.5 bg-[#09090b] border border-[#27272a] hover:border-cyan-400 text-[#fafafa] rounded-[4px] flex flex-col items-center justify-center space-y-1 transition text-[10px] uppercase font-mono cursor-pointer"
                  >
                    <span>🎺 Brass</span>
                    <span className="text-[8.5px] text-zinc-500">Trumpet</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => triggerInstrument('airhorn')}
                    className="py-2.5 bg-[#09090b] border border-orange-500/30 hover:border-orange-400 text-[#fafafa] rounded-[4px] flex flex-col items-center justify-center space-y-1 transition text-[10px] uppercase font-mono cursor-pointer"
                  >
                    <span>📢 Horn</span>
                    <span className="text-[8.5px] text-[#f59e0b]">Airhorn</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => triggerInstrument('clap')}
                    className="py-2.5 bg-[#09090b] border border-[#27272a] hover:border-cyan-400 text-[#fafafa] rounded-[4px] flex flex-col items-center justify-center space-y-1 transition text-[10px] uppercase font-mono cursor-pointer"
                  >
                    <span>👏 Clapping</span>
                    <span className="text-[8.5px] text-zinc-500">Snaps</span>
                  </button>
                </div>
              </div>

              {/* Slider for decay */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="space-y-1">
                  <div className="flex justify-between text-[9.5px] font-mono text-zinc-500">
                    <span>Synthesizer decay:</span>
                    <span>{decSeconds}s</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="1.5"
                    step="0.1"
                    value={decSeconds}
                    onChange={(e) => setDecSeconds(parseFloat(e.target.value))}
                    className="w-full h-1 bg-[#09090b] accent-[#06b6d4] appearance-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9.5px] font-mono text-zinc-500 block">Oscillator Waveform</label>
                  <select
                    value={waveShape}
                    onChange={(e) => setWaveShape(e.target.value as OscillatorType)}
                    className="w-full bg-[#09090b] border border-[#27272a] px-2 py-0.5 rounded-[4px] text-zinc-300 text-[10px] focus:outline-none"
                  >
                    <option value="sine">Pure Sine Wave</option>
                    <option value="triangle">Triangle Waveform</option>
                    <option value="sawtooth">Sawtooth Cheer Brass</option>
                    <option value="square">Digital Retro Chiptune</option>
                  </select>
                </div>
              </div>

            </div>
          </div>

          <div className="text-[9px] font-mono text-zinc-500 pt-2.5 mt-2.5 border-t border-[#27272a] text-center uppercase">
            Web Audio Synthesizer works fully offline & instant
          </div>
        </div>

      </div>

      {/* APL Note keyboard & Sequencer */}
      <div className="bg-[#18181b] border border-[#27272a] p-4 rounded-[4px] shadow-2xl" id="audio-piano-keyboard">
        <div className="flex items-center justify-between border-b border-[#27272a] pb-2.5 mb-3.5">
          <div className="flex items-center space-x-2">
            <Sliders size={14} className="text-[#06b6d4]" />
            <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-[#fafafa]">Piano Soundboard & Jingle compositions</h4>
          </div>

          <div className="flex space-x-1">
            <button
              type="button"
              onClick={() => playJingleSequence('ipl-cheer')}
              className="px-2 py-0.5 bg-[#06b6d4]/10 hover:bg-[#06b6d4]/20 text-[#06b6d4] border border-[#06b6d4]/30 rounded-sm text-[9px] font-bold uppercase transition cursor-pointer"
            >
              Play APL Anthem 🏏
            </button>
            
            <button
              type="button"
              onClick={() => playJingleSequence('victory')}
              className="px-2 py-0.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/20 rounded-sm text-[9px] font-bold uppercase transition cursor-pointer"
            >
              Play Victory Tune 🏆
            </button>
          </div>
        </div>

        {/* Note keys row */}
        <div className="grid grid-cols-8 gap-1 pl-1">
          {[
            { label: 'C4', freq: 261.63, sub: 'Low C' },
            { label: 'D4', freq: 293.66, sub: 'Re' },
            { label: 'E4', freq: 329.63, sub: 'Mi' },
            { label: 'F4', freq: 349.23, sub: 'Fa' },
            { label: 'G4', freq: 392.00, sub: 'So' },
            { label: 'A4', freq: 440.00, sub: 'La' },
            { label: 'B4', freq: 493.88, sub: 'Ti' },
            { label: 'C5', freq: 523.25, sub: 'High C' }
          ].map((key, index) => (
            <button
              key={key.label}
              type="button"
              onClick={() => playSingleNote(key.freq, key.label)}
              className="p-3 bg-zinc-900 border-t border-x border-[#27272a] border-b-4 border-b-cyan-500 hover:border-b-[#22d3ee] flex flex-col items-center justify-between min-h-[64px] transition text-[10.5px] font-mono hover:bg-zinc-805 hover:bg-zinc-800 cursor-pointer"
            >
              <span className="text-zinc-500 font-bold">{index + 1}</span>
              <strong className="text-slate-100">{key.label}</strong>
              <span className="text-[8px] text-zinc-500">{key.sub}</span>
            </button>
          ))}
        </div>

        <p className="text-[10px] text-zinc-500 font-mono mt-3 text-center">
          Compose your own cheering sequences. Notes play based on {waveShape.toUpperCase()} wave specifications.
        </p>
      </div>

    </div>
  );
}
