/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Volume2, Music, Play, Square, Sliders, Sparkles, 
  RefreshCw, HelpCircle, Radio, Plus, Trash2, Speaker 
} from 'lucide-react';

interface JingleNote {
  freq: number;
  label: string;
  duration: number; // in seconds
}

export default function StadiumCheerSynth({
  onAddNotification
}: {
  onAddNotification: (msg: string, severity: 'info' | 'warning' | 'error' | 'ai') => void;
}) {
  // Synthesizer configuration
  const [waveType, setWaveType] = useState<OscillatorType>('sawtooth');
  const [bpm, setBpm] = useState<number>(124);
  const [masterVolume, setMasterVolume] = useState<number>(0.15); // safe range

  // Custom Sequence steps
  const [melody, setMelody] = useState<JingleNote[]>([
    { freq: 261.63, label: 'C4', duration: 0.25 },
    { freq: 329.63, label: 'E4', duration: 0.25 },
    { freq: 392.00, label: 'G4', duration: 0.25 },
    { freq: 523.25, label: 'C5', duration: 0.50 },
  ]);

  const [isPlayingSequence, setIsPlayingSequence] = useState<boolean>(false);
  const [activeNoteIdx, setActiveNoteIdx] = useState<number | null>(null);

  // Common pre-configured notes for the dropdown builder
  const AVAILABLE_NOTES = [
    { freq: 261.63, label: 'C4 (Dhoni Root)' },
    { freq: 293.66, label: 'D4 (Tempo Rise)' },
    { freq: 329.63, label: 'E4 (Pitch Mid)' },
    { freq: 349.23, label: 'F4 (Subdominant)' },
    { freq: 392.00, label: 'G4 (Dominant)' },
    { freq: 440.00, label: 'A4 (Cheer Peak)' },
    { freq: 493.88, label: 'B4 (Tension Lead)' },
    { freq: 523.25, label: 'C5 (High Boundary)' },
    { freq: 587.33, label: 'D5 (High Boundary Pro)' },
  ];

  const [selectedNoteFreq, setSelectedNoteFreq] = useState<number>(AVAILABLE_NOTES[0].freq);
  const [selectedNoteDur, setSelectedNoteDur] = useState<number>(0.25);

  /**
   * Helper: Instantiate safe AudioContext
   */
  const getAudioContext = () => {
    return new (window.AudioContext || (window as any).webkitAudioContext)();
  };

  /**
   * Synthesize: 🏟️ Stadium Crowd Roar / Noise Sweep
   */
  const playCrowdRoar = () => {
    try {
      const ctx = getAudioContext();
      
      // Generate standard white noise
      const bufferSize = ctx.sampleRate * 2.5; // 2.5 second duration
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = buffer;

      // Filter sweeps (low pass sweeping upwards to simulate crowd wave rumble)
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(100, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(1500, ctx.currentTime + 1.2);

      // Volume envelope (gradual rise, peak, slow fade out)
      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(masterVolume * 0.8, ctx.currentTime + 0.8);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.5);

      noiseSource.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);

      noiseSource.start();
      onAddNotification("Soundboard triggered: Simulated Crowd Cheering loop active.", "info");
    } catch (e) {
      console.warn("Synth blocked until interaction", e);
    }
  };

  /**
   * Synthesize: 🎺 Classic Air Horn (Aggressive multi-oscillators)
   */
  const playAirHorn = () => {
    try {
      const ctx = getAudioContext();
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const osc3 = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc1.type = 'sawtooth';
      osc2.type = 'sawtooth';
      osc3.type = 'square';

      // Traditional air horn harmonics
      osc1.frequency.setValueAtTime(220, ctx.currentTime);
      osc2.frequency.setValueAtTime(223, ctx.currentTime); // slightly detuned of chorus
      osc3.frequency.setValueAtTime(330, ctx.currentTime);

      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(masterVolume, ctx.currentTime + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.85);

      osc1.connect(gainNode);
      osc2.connect(gainNode);
      osc3.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc1.start();
      osc2.start();
      osc3.start();

      osc1.stop(ctx.currentTime + 0.9);
      osc2.stop(ctx.currentTime + 0.9);
      osc3.stop(ctx.currentTime + 0.9);

      onAddNotification("Soundboard triggered: 📣 Classic Bleacher Brass Horn.", "info");
    } catch (e) {
      console.warn("Synth blocked", e);
    }
  };

  /**
   * Synthesize: 🥁 Heavy Boundary Low Kick Drum
   */
  const playBoundaryDrum = () => {
    try {
      const ctx = getAudioContext();
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = 'sine';
      // Pitch drop sweep from 140Hz down to 20Hz for a deep chest thump!
      osc.frequency.setValueAtTime(140, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);

      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(masterVolume * 1.5, ctx.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.45);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch (e) {
      console.warn(e);
    }
  };

  /**
   * Play dynamic custom jingle notes sequentially in-time (Sequencer)
   */
  const playCustomMelodySequence = async () => {
    if (isPlayingSequence) return;
    setIsPlayingSequence(true);
    onAddNotification("Arpeggiator active: playing specialized custom cheering jingle...", "info");

    try {
      const ctx = getAudioContext();
      let startTime = ctx.currentTime;

      melody.forEach((note, index) => {
        // Schedule nodes sequentially
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();

        osc.type = waveType;
        osc.frequency.setValueAtTime(note.freq, startTime);

        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(masterVolume, startTime + 0.02);
        gainNode.gain.setValueAtTime(masterVolume, startTime + note.duration - 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + note.duration);

        osc.connect(gainNode);
        gainNode.connect(ctx.destination);

        // Visual tracking sync timeouts
        const delayMs = (startTime - ctx.currentTime) * 1000;
        setTimeout(() => {
          setActiveNoteIdx(index);
        }, Math.max(0, delayMs));

        osc.start(startTime);
        osc.stop(startTime + note.duration);

        startTime += note.duration;
      });

      // Reset after full sequence has finished playing
      const totalDurationSecs = melody.reduce((sum, n) => sum + n.duration, 0);
      setTimeout(() => {
        setIsPlayingSequence(false);
        setActiveNoteIdx(null);
        onAddNotification("Custom cheerleader loop finished playing.", "info");
      }, totalDurationSecs * 1000 + 100);

    } catch (e) {
      console.warn(e);
      setIsPlayingSequence(false);
    }
  };

  /**
   * Builder: add custom notes to arpeggio list
   */
  const addNewNoteToSequence = () => {
    const matchingNote = AVAILABLE_NOTES.find(n => n.freq === selectedNoteFreq);
    if (!matchingNote) return;

    const newJingle: JingleNote = {
      freq: selectedNoteFreq,
      label: matchingNote.label.split(' ')[0],
      duration: selectedNoteDur
    };

    setMelody(prev => [...prev, newJingle]);
  };

  /**
   * Builder: remove a note
   */
  const deleteNoteIndex = (idx: number) => {
    setMelody(prev => prev.filter((_, i) => i !== idx));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4" id="cheer-soundboard-workspace">
      
      {/* Col 1: Instantly Playable Stadium Soundboard Board */}
      <div className="bg-[#18181b] border border-[#27272a] rounded-[4px] p-4 shadow-xl flex flex-col justify-between">
        <div>
          <div className="flex items-center space-x-2 border-b border-[#27272a] pb-2.5 mb-3">
            <Volume2 size={14} className="text-[#06b6d4]" />
            <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-zinc-100">Crowd Cheer Jingle soundboard</h3>
          </div>

          <p className="text-[10.5px] text-[#a1a1aa] mb-3.5 font-sans">
            Trigger simulated physical crowd responses and air horn sweeps across stadium sound systems to amplify fan excitement.
          </p>

          <div className="space-y-2.5">
            {/* Pad A: Crowd Roar */}
            <button
              onClick={playCrowdRoar}
              className="w-full p-3 bg-gradient-to-r from-emerald-950/40 to-slate-900 border border-emerald-500/20 hover:border-emerald-500/40 text-emerald-400 rounded-[4px] text-left flex items-center justify-between cursor-pointer group transition"
            >
              <div>
                <h4 className="text-xs font-bold font-sans uppercase">🏟️ Stadium Crowd Roar</h4>
                <p className="text-[9px] text-[#71717a] font-mono group-hover:text-zinc-400">Low sweep pink noise generator</p>
              </div>
              <Speaker size={16} className="text-emerald-500 animate-[pulse_1.5s_infinite]" />
            </button>

            {/* Pad B: Air Horn */}
            <button
              onClick={playAirHorn}
              className="w-full p-3 bg-gradient-to-r from-orange-950/40 to-slate-900 border border-orange-500/20 hover:border-orange-500/40 text-orange-400 rounded-[4px] text-left flex items-center justify-between cursor-pointer group transition"
            >
              <div>
                <h4 className="text-xs font-bold font-sans uppercase">📣 Bleacher Brass Horn</h4>
                <p className="text-[9px] text-[#71717a] font-mono group-hover:text-zinc-400">Detuned multi-sine sawtooth stack</p>
              </div>
              <Radio size={16} className="text-orange-500 group-hover:animate-bounce" />
            </button>

            {/* Pad C: Kick Drum */}
            <button
              onClick={playBoundaryDrum}
              className="w-full p-3 bg-gradient-to-r from-cyan-950/30 to-slate-900 border border-cyan-500/15 hover:border-cyan-500/40 text-cyan-400 rounded-[4px] text-left flex items-center justify-between cursor-pointer group transition"
            >
              <div>
                <h4 className="text-xs font-bold font-sans uppercase">🥁 Boundary Bass Drum</h4>
                <p className="text-[9px] text-[#71717a] font-mono group-hover:text-zinc-400">Sub-bass frequency pitch sweep drop</p>
              </div>
              <Music size={14} className="text-[#06b6d4]" />
            </button>
          </div>
        </div>

        {/* Master Gain Slider */}
        <div className="mt-4 pt-3.5 border-t border-[#27272a] space-y-1.5">
          <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400">
            <span>MASTER CHEER VOLUME GAIN:</span>
            <span>{Math.round(masterVolume * 100)}%</span>
          </div>
          <input
            type="range"
            min="0.05"
            max="0.45"
            step="0.05"
            value={masterVolume}
            onChange={(e) => setMasterVolume(parseFloat(e.target.value))}
            className="w-full accent-[#06b6d4] bg-zinc-800 h-1 rounded-sm cursor-pointer"
          />
        </div>
      </div>

      {/* Col 2: Custom Jingle Sequencer & Tone Synthesizer */}
      <div className="bg-[#18181b] border border-[#27272a] rounded-[4px] p-4 shadow-xl flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between border-b border-[#27272a] pb-2.5 mb-2.5">
            <div className="flex items-center space-x-2">
              <Sliders size={14} className="text-[#06b6d4]" />
              <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-zinc-100">Synthesizer parameters</h3>
            </div>
            <Sparkles size={11} className="text-cyan-400 animate-pulse" />
          </div>

          <p className="text-[10.5px] text-[#a1a1aa] mb-4 font-sans animate-[fadeIn_0.5s_ease]">
            Construct custom arpeggio jingles for the giant stadium advertising screens to rally fans. Customize waveforms and note step times.
          </p>

          <div className="space-y-3">
            {/* Waveform Selector */}
            <div className="space-y-1">
              <label className="text-[9px] text-[#71717a] font-bold font-mono uppercase">Cheering wave generator type</label>
              <div className="grid grid-cols-4 gap-1.5">
                {(['sine', 'sawtooth', 'square', 'triangle'] as OscillatorType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => setWaveType(type)}
                    className={`py-1 text-[9.5px] font-mono rounded-sm border capitalize transition cursor-pointer ${
                      waveType === type 
                        ? 'bg-[#06b6d4]/10 border-[#06b6d4] text-[#06b6d4] font-bold' 
                        : 'bg-[#09090b] border-[#27272a] text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Step creator parameters */}
            <div className="p-3 bg-[#09090b] border border-[#27272a] rounded-[4px] space-y-2.5">
              <h4 className="text-[9px] font-mono text-zinc-300 uppercase font-black">Append New Melody Step</h4>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <span className="text-[8px] text-[#71717a] font-bold uppercase block">Pitch Note</span>
                  <select
                    value={selectedNoteFreq}
                    onChange={(e) => setSelectedNoteFreq(parseFloat(e.target.value))}
                    className="w-full bg-[#18181b] border border-[#27272a] p-1 rounded-[4px] text-zinc-100 text-[10px]"
                  >
                    {AVAILABLE_NOTES.map((n) => (
                      <option key={n.freq} value={n.freq}>{n.label}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <span className="text-[8px] text-[#71717a] font-bold uppercase block">Beat Duration</span>
                  <select
                    value={selectedNoteDur}
                    onChange={(e) => setSelectedNoteDur(parseFloat(e.target.value))}
                    className="w-full bg-[#18181b] border border-[#27272a] p-1 rounded-[4px] text-zinc-100 text-[10px]"
                  >
                    <option value="0.125">1/8 Beat (0.12s)</option>
                    <option value="0.25">1/4 Beat (0.25s)</option>
                    <option value="0.5">1/2 Beat (0.50s)</option>
                    <option value="1.0">Whole Beat (1.00s)</option>
                  </select>
                </div>
              </div>

              <button
                type="button"
                onClick={addNewNoteToSequence}
                className="w-full py-1 bg-[#27272a] hover:bg-[#3f3f46] text-zinc-200 hover:text-white border border-[#27272a] text-[9px] font-mono font-bold uppercase rounded-sm flex items-center justify-center space-x-1 cursor-pointer"
              >
                <Plus size={10} />
                <span>Add Note to Sequence</span>
              </button>
            </div>
          </div>
        </div>

        {/* Play Sequence Button */}
        <button
          onClick={playCustomMelodySequence}
          disabled={melody.length === 0 || isPlayingSequence}
          className="w-full mt-4 py-2 bg-[#06b6d4] hover:bg-[#0891b2] text-[#09090b] font-bold rounded-[4px] text-[10px] font-mono uppercase flex items-center justify-center space-x-2 disabled:bg-zinc-800 disabled:text-zinc-600 disabled:cursor-not-allowed cursor-pointer"
        >
          {isPlayingSequence ? (
            <>
              <RefreshCw size={11} className="animate-spin" />
              <span>PLAYING MELODY SECTOR...</span>
            </>
          ) : (
            <>
              <Play size={11} fill="currentColor" />
              <span>PLAY CUSTOM JINGLE LOOP ({melody.length} STEPS)</span>
            </>
          )}
        </button>
      </div>

      {/* Col 3: Visual Step Sequencer & List */}
      <div className="bg-[#18181b] border border-[#27272a] rounded-[4px] p-4 shadow-xl space-y-3 flex flex-col justify-between">
        <div>
          <div className="flex items-center space-x-2 border-b border-[#27272a] pb-2.5 mb-2.5">
            <Music size={14} className="text-[#06b6d4]" />
            <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-zinc-100">Jingle notes sequence</h3>
          </div>

          <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1">
            {melody.length === 0 ? (
              <div className="py-12 text-center text-[10px] text-zinc-600 font-mono border border-dashed border-[#27272a] rounded-[4px]">
                Melody empty. Insert steps above.
              </div>
            ) : (
              melody.map((note, index) => {
                const isActive = activeNoteIdx === index;
                return (
                  <div 
                    key={index} 
                    className={`p-2 rounded-[4px] border flex items-center justify-between text-[10.5px] font-mono ${
                      isActive 
                        ? 'bg-[#06b6d4]/10 border-[#06b6d4] text-[#06b6d4] font-black animate-pulseScale' 
                        : 'bg-[#09090b]/50 border-[#27272a] text-zinc-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-[9px] text-zinc-500 font-bold">#{index + 1}</span>
                      <span className="font-bold">{note.label}</span>
                      <span className="text-[9px] text-[#71717a]">({note.freq.toFixed(1)} Hz)</span>
                    </div>

                    <div className="flex items-center space-x-3.5">
                      <span className="text-[9.5px] text-zinc-500">{note.duration}s</span>
                      <button
                        onClick={() => deleteNoteIndex(index)}
                        disabled={isPlayingSequence}
                        className="text-zinc-500 hover:text-[#ef4444] disabled:opacity-30 cursor-pointer"
                        title="Delete note"
                      >
                        <Trash2 size={11} />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Small tips ledger */}
        <div className="bg-[#09090b]/40 border border-[#27272a] p-2.5 rounded-[4px] text-[9.5px] tracking-normal font-sans text-[#71717a] leading-normal flex items-start space-x-1.5">
          <HelpCircle size={12} className="text-[#06b6d4] shrink-0 mt-0.5" />
          <span>Note: Jingles are synthesized programmatically. Select custom sound loops to cheer up fans or play alarms!</span>
        </div>
      </div>

    </div>
  );
}
