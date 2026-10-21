import React from 'react';
import { ScaleMode } from '../types';
import {
  Play,
  Pause,
  RotateCcw,
  FastForward,
  Rewind,
  Calendar,
  Layers,
  Tag,
  CircleDot,
  Gauge
} from 'lucide-react';

interface SimulationControlsProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  speedMultiplier: number;
  onChangeSpeed: (speed: number) => void;
  simulationTimeDays: number;
  onStepTime: (days: number) => void;
  onResetTime: () => void;
  scaleMode: ScaleMode;
  onToggleScaleMode: (mode: ScaleMode) => void;
  showOrbits: boolean;
  onToggleOrbits: () => void;
  showLabels: boolean;
  onToggleLabels: () => void;
  showAsteroidBelt: boolean;
  onToggleAsteroidBelt: () => void;
}

export const SimulationControls: React.FC<SimulationControlsProps> = ({
  isPlaying,
  onTogglePlay,
  speedMultiplier,
  onChangeSpeed,
  simulationTimeDays,
  onStepTime,
  onResetTime,
  scaleMode,
  onToggleScaleMode,
  showOrbits,
  onToggleOrbits,
  showLabels,
  onToggleLabels,
  showAsteroidBelt,
  onToggleAsteroidBelt,
}) => {
  // Format simulated date starting from today (2026-10-21)
  const baseDate = new Date(2026, 9, 21); // Oct 21, 2026
  const currentDate = new Date(baseDate.getTime() + simulationTimeDays * 86400000);
  const formattedDate = currentDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const speedPresets = [0.2, 1, 5, 20, 60];

  return (
    <div className="w-full bg-[#050818]/95 backdrop-blur-xl border-t border-cyan-500/20 px-3 lg:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs z-30 select-none">
      {/* 1. Playback & Step Controls */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        <button
          onClick={onTogglePlay}
          className={`flex items-center justify-center w-9 h-9 rounded-xl font-bold shadow-md transition-all ${
            isPlaying
              ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/30'
              : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-500/30'
          }`}
          title={isPlaying ? 'Pause Simulation (Space)' : 'Play Simulation (Space)'}
          aria-label={isPlaying ? 'Pause simulation' : 'Play simulation'}
        >
          {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
        </button>

        <button
          onClick={onResetTime}
          className="p-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-white/5 transition-colors"
          title="Reset to Starting Date"
          aria-label="Reset simulation time"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        {/* Step buttons */}
        <div className="flex items-center gap-1 bg-slate-900/60 p-1 rounded-lg border border-white/5">
          <button
            onClick={() => onStepTime(-30)}
            className="px-2 py-1 rounded hover:bg-white/10 text-slate-300 font-mono text-[11px]"
            title="Step Back 30 Days"
          >
            -30d
          </button>
          <button
            onClick={() => onStepTime(1)}
            className="px-2 py-1 rounded hover:bg-white/10 text-slate-300 font-mono text-[11px]"
            title="Step Forward 1 Day"
          >
            +1d
          </button>
          <button
            onClick={() => onStepTime(30)}
            className="px-2 py-1 rounded hover:bg-white/10 text-slate-300 font-mono text-[11px]"
            title="Step Forward 1 Month (30 Days)"
          >
            +1m
          </button>
          <button
            onClick={() => onStepTime(365)}
            className="px-2 py-1 rounded hover:bg-white/10 text-slate-300 font-mono text-[11px]"
            title="Step Forward 1 Year (365 Days)"
          >
            +1y
          </button>
        </div>
      </div>

      {/* 2. Simulated Date Display */}
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/70 border border-white/5">
        <Calendar className="w-3.5 h-3.5 text-cyan-400" />
        <div className="font-mono text-slate-200">
          <span className="font-bold">{formattedDate}</span>
          <span className="text-slate-400 text-[11px] ml-2">
            (T+{Math.round(simulationTimeDays)} d)
          </span>
        </div>
      </div>

      {/* 3. Speed Multiplier Slider & Presets */}
      <div className="flex items-center gap-2.5">
        <Gauge className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-slate-400 text-[11px] hidden sm:inline">Speed:</span>

        <input
          type="range"
          min="0.1"
          max="80"
          step="0.5"
          value={speedMultiplier}
          onChange={(e) => onChangeSpeed(parseFloat(e.target.value))}
          className="w-20 sm:w-28 accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
          aria-label="Simulation speed multiplier"
        />

        <span className="font-mono text-cyan-300 text-[11px] w-12 text-right">
          {speedMultiplier.toFixed(1)}x
        </span>

        {/* Quick Speed Presets */}
        <div className="hidden md:flex items-center gap-1 bg-slate-900/60 p-0.5 rounded-lg border border-white/5">
          {speedPresets.map(preset => (
            <button
              key={preset}
              onClick={() => onChangeSpeed(preset)}
              className={`px-1.5 py-0.5 rounded text-[10px] font-mono transition-colors ${
                Math.abs(speedMultiplier - preset) < 0.1
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {preset}x
            </button>
          ))}
        </div>
      </div>

      {/* 4. Display Toggles & Scale Mode */}
      <div className="flex items-center gap-2">
        {/* Scale Mode Switcher */}
        <div className="flex items-center bg-slate-900/80 p-0.5 rounded-lg border border-white/10">
          <button
            onClick={() => onToggleScaleMode('overview')}
            className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
              scaleMode === 'overview'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Optimized aesthetic spacing for all 8 planets"
          >
            Overview
          </button>
          <button
            onClick={() => onToggleScaleMode('scale-aware')}
            className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
              scaleMode === 'scale-aware'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Proportional astronomical distance scale"
          >
            Scale-Aware
          </button>
        </div>

        {/* Orbits Toggle */}
        <button
          onClick={onToggleOrbits}
          className={`p-1.5 rounded-lg border transition-colors ${
            showOrbits ? 'bg-cyan-950/70 border-cyan-500/40 text-cyan-300' : 'bg-slate-900/60 border-white/5 text-slate-500'
          }`}
          title="Toggle Orbital Paths"
          aria-label="Toggle orbital lines"
        >
          <CircleDot className="w-3.5 h-3.5" />
        </button>

        {/* Labels Toggle */}
        <button
          onClick={onToggleLabels}
          className={`p-1.5 rounded-lg border transition-colors ${
            showLabels ? 'bg-cyan-950/70 border-cyan-500/40 text-cyan-300' : 'bg-slate-900/60 border-white/5 text-slate-500'
          }`}
          title="Toggle Planet Labels"
          aria-label="Toggle planet names"
        >
          <Tag className="w-3.5 h-3.5" />
        </button>

        {/* Asteroid Belt Toggle */}
        <button
          onClick={onToggleAsteroidBelt}
          className={`p-1.5 rounded-lg border transition-colors ${
            showAsteroidBelt ? 'bg-cyan-950/70 border-cyan-500/40 text-cyan-300' : 'bg-slate-900/60 border-white/5 text-slate-500'
          }`}
          title="Toggle Asteroid Belt Particles"
          aria-label="Toggle asteroid belt"
        >
          <Layers className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
