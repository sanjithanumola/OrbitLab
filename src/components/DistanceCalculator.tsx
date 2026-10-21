import React, { useState } from 'react';
import { PlanetData } from '../types';
import { PLANETS_DATA, SUN_DATA } from '../data/planets';
import {
  convertAuToKm,
  convertKmToAu,
  convertKmToMiles,
  calculateLightTime,
  calculateSynodicPeriodDays
} from '../utils/astronomy';
import {
  ArrowRightLeft,
  Sparkles,
  Info,
  Clock,
  Radio,
  Compass,
  Zap
} from 'lucide-react';

interface DistanceCalculatorProps {
  simulationTimeDays: number;
}

export const DistanceCalculator: React.FC<DistanceCalculatorProps> = ({ simulationTimeDays }) => {
  const allBodies: PlanetData[] = [SUN_DATA, ...PLANETS_DATA];

  const [originId, setOriginId] = useState<string>('earth');
  const [destId, setDestId] = useState<string>('mars');

  const origin = allBodies.find(b => b.id === originId) || PLANETS_DATA[2]; // Earth
  const dest = allBodies.find(b => b.id === destId) || PLANETS_DATA[3]; // Mars

  // 1. Theoretical Average Distances
  const r1AU = origin.semiMajorAxisAU;
  const r2AU = dest.semiMajorAxisAU;

  // Closest approach (opposition / alignment on same side)
  const minDistanceAU = Math.abs(r1AU - r2AU);
  // Farthest distance (superior conjunction / opposite sides of the Sun)
  const maxDistanceAU = r1AU + r2AU;
  // Average separation
  const avgDistanceAU = (minDistanceAU + maxDistanceAU) / 2;

  // 2. Instantaneous Simulated Distance
  // Calculate current angular positions of both bodies in radians
  const angle1 = origin.orbitalPeriodDays > 0
    ? (simulationTimeDays * (2 * Math.PI / origin.orbitalPeriodDays)) % (2 * Math.PI)
    : 0;
  const angle2 = dest.orbitalPeriodDays > 0
    ? (simulationTimeDays * (2 * Math.PI / dest.orbitalPeriodDays)) % (2 * Math.PI)
    : 0;

  // Coordinates in 2D plane (AU)
  const x1 = Math.cos(angle1) * r1AU;
  const y1 = Math.sin(angle1) * r1AU;
  const x2 = Math.cos(angle2) * r2AU;
  const y2 = Math.sin(angle2) * r2AU;

  const dx = x2 - x1;
  const dy = y2 - y1;
  const instantaneousAU = Math.sqrt(dx * dx + dy * dy);

  // Conversions for instantaneous distance
  const currentKm = convertAuToKm(instantaneousAU);
  const currentMiles = convertKmToMiles(currentKm);
  const lightTime = calculateLightTime(currentKm);

  // Synodic period between them (if neither is the Sun)
  const synodicPeriod = origin.orbitalPeriodDays > 0 && dest.orbitalPeriodDays > 0
    ? calculateSynodicPeriodDays(origin.orbitalPeriodDays, dest.orbitalPeriodDays)
    : 0;

  const handleSwap = () => {
    setOriginId(destId);
    setDestId(originId);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="border-b border-cyan-500/15 pb-4">
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <ArrowRightLeft className="w-6 h-6 text-cyan-400" />
          <span>Astronomical Distance & Light-Time Calculator</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Compute instantaneous and average separation between Solar System bodies with radio propagation delays and synodic recurrence.
        </p>
      </div>

      {/* Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-11 items-center gap-4 glass-panel rounded-2xl p-5">
        {/* Origin Selector */}
        <div className="md:col-span-5 space-y-1.5">
          <label className="text-[11px] font-mono uppercase text-slate-400 block font-semibold">
            Origin Body
          </label>
          <select
            value={originId}
            onChange={(e) => setOriginId(e.target.value)}
            className="w-full p-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-cyan-400"
          >
            {allBodies.map(b => (
              <option key={b.id} value={b.id} disabled={b.id === destId}>
                {b.name} ({b.semiMajorAxisAU > 0 ? `${b.semiMajorAxisAU} AU` : 'Center'})
              </option>
            ))}
          </select>
        </div>

        {/* Swap Button */}
        <div className="md:col-span-1 flex justify-center">
          <button
            onClick={handleSwap}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-white/10 shadow-md transition-transform hover:scale-105"
            title="Swap Origin and Destination"
            aria-label="Swap bodies"
          >
            <ArrowRightLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Destination Selector */}
        <div className="md:col-span-5 space-y-1.5">
          <label className="text-[11px] font-mono uppercase text-slate-400 block font-semibold">
            Destination Body
          </label>
          <select
            value={destId}
            onChange={(e) => setDestId(e.target.value)}
            className="w-full p-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-cyan-400"
          >
            {allBodies.map(b => (
              <option key={b.id} value={b.id} disabled={b.id === originId}>
                {b.name} ({b.semiMajorAxisAU > 0 ? `${b.semiMajorAxisAU} AU` : 'Center'})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Results Display */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Instantaneous Simulated Distance Card (7 Cols) */}
        <div className="lg:col-span-7 glass-panel rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/30">
                Live Simulation Geometry
              </span>
              <h2 className="text-xl font-bold text-white mt-1">
                Current Separation: {origin.name} ⟷ {dest.name}
              </h2>
            </div>
            <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" title="Live calculated" />
          </div>

          {/* Large Numbers Display */}
          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-slate-900/80 border border-cyan-500/20">
              <span className="text-[11px] text-slate-400 font-mono block uppercase">Astronomical Units</span>
              <div className="text-3xl sm:text-4xl font-extrabold text-cyan-300 font-mono tracking-tight">
                {instantaneousAU.toFixed(4)} <span className="text-lg font-normal text-slate-400">AU</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5">
                <span className="text-[10px] text-slate-400 font-mono block uppercase">Kilometers (km)</span>
                <span className="text-lg sm:text-xl font-bold text-white font-mono">
                  {Math.round(currentKm).toLocaleString()}
                </span>
                <span className="text-xs text-slate-400 ml-1">km</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5">
                <span className="text-[10px] text-slate-400 font-mono block uppercase">Miles (mi)</span>
                <span className="text-lg sm:text-xl font-bold text-white font-mono">
                  {Math.round(currentMiles).toLocaleString()}
                </span>
                <span className="text-xs text-slate-400 ml-1">mi</span>
              </div>
            </div>
          </div>

          {/* Light-Time and Radio Communications Delay */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-950/50 to-slate-900/80 border border-indigo-500/30 flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-300 shrink-0">
              <Radio className="w-5 h-5 text-indigo-400 animate-pulse" />
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold text-white block">Speed-of-Light Transmission Delay:</span>
              <div className="text-base font-extrabold text-indigo-300 font-mono">
                {lightTime.formatted} <span className="text-xs font-normal text-slate-400">(one-way)</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                A two-way radio round-trip command ping sent to a spacecraft at this distance takes{' '}
                <strong className="text-white">{(lightTime.totalSeconds * 2 / 60).toFixed(2)} minutes</strong>. Real-time joystick control is physically impossible.
              </p>
            </div>
          </div>
        </div>

        {/* Extremes, Orbit Geometry & Synodic Science (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-panel rounded-2xl p-6 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-cyan-400" />
              <span>Concentric Orbital Range</span>
            </h3>

            <div className="space-y-2.5 font-mono text-xs">
              <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-emerald-400 uppercase block font-semibold">Minimum Distance</span>
                  <span className="text-slate-400 text-[10px]">Opposition / Closest approach</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-emerald-300">{minDistanceAU.toFixed(3)} AU</span>
                  <span className="text-[10px] text-slate-400 block">
                    (~{Math.round(convertAuToKm(minDistanceAU)).toLocaleString()} km)
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-500/30 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-rose-400 uppercase block font-semibold">Maximum Distance</span>
                  <span className="text-slate-400 text-[10px]">Conjunction / Opposite sides</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-rose-300">{maxDistanceAU.toFixed(3)} AU</span>
                  <span className="text-[10px] text-slate-400 block">
                    (~{Math.round(convertAuToKm(maxDistanceAU)).toLocaleString()} km)
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block">Average Separation</span>
                  <span className="text-slate-500 text-[10px]">Mean geometric separation</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-slate-200">{avgDistanceAU.toFixed(3)} AU</span>
                  <span className="text-[10px] text-slate-400 block">
                    (~{Math.round(convertAuToKm(avgDistanceAU)).toLocaleString()} km)
                  </span>
                </div>
              </div>

              {synodicPeriod > 0 && synodicPeriod !== Infinity && (
                <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-amber-400 uppercase block font-semibold">Synodic Alignment Period</span>
                    <span className="text-slate-400 text-[10px]">Launch window cycle frequency</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-amber-300">{synodicPeriod.toFixed(1)} days</span>
                    <span className="text-[10px] text-slate-400 block">
                      ({(synodicPeriod / 30.4).toFixed(1)} months)
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="glass-panel-subtle rounded-2xl p-4 text-xs text-slate-300 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Why does the distance change?</strong> Planets travel at different orbital angular velocities according to Kepler’s Third Law. The inner planet continuously overtakes the outer planet, causing the line-of-sight distance to oscillate between opposition and conjunction.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
