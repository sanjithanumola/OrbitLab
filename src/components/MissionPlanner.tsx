import React, { useState, useEffect, useRef } from 'react';
import { PlanetData } from '../types';
import { PLANETS_DATA } from '../data/planets';
import { calculateHohmannTransfer } from '../utils/astronomy';
import {
  Rocket,
  Compass,
  ArrowRight,
  Info,
  Calendar,
  Sparkles,
  Flame,
  CheckCircle2,
  Clock,
  Play,
  RotateCcw
} from 'lucide-react';

interface MissionPlannerProps {
  onUnlockAchievement: (id: string) => void;
}

export const MissionPlanner: React.FC<MissionPlannerProps> = ({ onUnlockAchievement }) => {
  const [originId, setOriginId] = useState<string>('earth');
  const [destId, setDestId] = useState<string>('mars');
  const [isSimulatingFlight, setIsSimulatingFlight] = useState<boolean>(true);

  const origin = PLANETS_DATA.find(p => p.id === originId) || PLANETS_DATA[2]; // Earth
  const dest = PLANETS_DATA.find(p => p.id === destId) || PLANETS_DATA[3]; // Mars

  const transfer = calculateHohmannTransfer(origin, dest);

  // Trigger achievement
  useEffect(() => {
    onUnlockAchievement('mission_commander');
  }, [onUnlockAchievement]);

  // Transfer Trajectory Canvas
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const flightProgressRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let lastTime = performance.now();

    const render = (now: number) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      if (isSimulatingFlight) {
        // Full transfer flight loops every ~8 seconds
        flightProgressRef.current = (flightProgressRef.current + dt * 0.12) % 1.0;
      }

      const dpr = window.devicePixelRatio || 1;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      // Deep space background
      ctx.fillStyle = '#050818';
      ctx.fillRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;

      // Scale orbits to canvas size
      const maxAU = Math.max(transfer.r1AU, transfer.r2AU) * 1.25;
      const scale = (Math.min(width, height) * 0.42) / maxAU;

      const r1Px = transfer.r1AU * scale;
      const r2Px = transfer.r2AU * scale;
      const atPx = transfer.transferSemiMajorAxisAU * scale;

      // 1. Draw Central Sun
      const sunGrad = ctx.createRadialGradient(cx, cy, 2, cx, cy, 14);
      sunGrad.addColorStop(0, '#ffffff');
      sunGrad.addColorStop(0.4, '#fbbf24');
      sunGrad.addColorStop(1, '#ea580c');
      ctx.fillStyle = sunGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, 12, 0, Math.PI * 2);
      ctx.fill();

      // Sun corona
      ctx.beginPath();
      ctx.arc(cx, cy, 22, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(245, 158, 11, 0.15)';
      ctx.fill();

      // 2. Draw Origin Circular Orbit
      ctx.beginPath();
      ctx.arc(cx, cy, r1Px, 0, Math.PI * 2);
      ctx.strokeStyle = origin.colors.atmosphere;
      ctx.lineWidth = 1.5;
      ctx.setLineDash([3, 3]);
      ctx.stroke();

      // 3. Draw Destination Circular Orbit
      ctx.beginPath();
      ctx.arc(cx, cy, r2Px, 0, Math.PI * 2);
      ctx.strokeStyle = dest.colors.atmosphere;
      ctx.lineWidth = 1.5;
      ctx.setLineDash([3, 3]);
      ctx.stroke();
      ctx.setLineDash([]);

      // 4. Draw Hohmann Transfer Ellipse Arc
      // For transfer, perihelion is at (cx + r1Px, cy) and aphelion is at (cx - r2Px, cy)
      // Ellipse center is at cx + (r1Px - r2Px)/2
      const ellipseCenterX = cx + (r1Px - r2Px) / 2;
      const ellipseCenterY = cy;
      const semiMajorPx = (r1Px + r2Px) / 2;
      const cDist = Math.abs(r2Px - r1Px) / 2;
      const semiMinorPx = Math.sqrt(Math.max(1, semiMajorPx * semiMajorPx - cDist * cDist));

      ctx.beginPath();
      ctx.ellipse(ellipseCenterX, ellipseCenterY, semiMajorPx, semiMinorPx, 0, 0, Math.PI);
      ctx.strokeStyle = '#22d3ee';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // 5. Positions along Flight Path:
      // Spacecraft travels along the half-ellipse from angle 0 to PI
      const frac = flightProgressRef.current;
      const shipTheta = frac * Math.PI;
      const shipX = ellipseCenterX + Math.cos(shipTheta) * semiMajorPx;
      const shipY = ellipseCenterY + Math.sin(shipTheta) * semiMinorPx;

      // Origin planet position: started at (cx + r1Px, cy) at t=0
      // Moves at angular rate omega1 = sqrt(mu / r1^3)
      const omega1Ratio = 1.0; // relative angular speed
      const originAngle = frac * Math.PI * Math.pow(transfer.transferSemiMajorAxisAU / transfer.r1AU, 1.5);
      const originX = cx + Math.cos(originAngle) * r1Px;
      const originY = cy + Math.sin(originAngle) * r1Px;

      // Destination planet position: at t=0, started at angle (PI - destCoverage)
      // and arrives exactly at PI at t_transfer!
      const destCoverage = Math.PI * Math.pow(transfer.transferSemiMajorAxisAU / transfer.r2AU, 1.5);
      const destStartAngle = Math.PI - destCoverage;
      const destAngle = destStartAngle + frac * destCoverage;
      const destX = cx + Math.cos(destAngle) * r2Px;
      const destY = cy + Math.sin(destAngle) * r2Px;

      // Draw Origin Planet Body
      ctx.beginPath();
      ctx.arc(originX, originY, 7, 0, Math.PI * 2);
      ctx.fillStyle = origin.colors.base;
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Draw Destination Planet Body
      ctx.beginPath();
      ctx.arc(destX, destY, 7, 0, Math.PI * 2);
      ctx.fillStyle = dest.colors.base;
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Draw Spacecraft
      ctx.beginPath();
      ctx.arc(shipX, shipY, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.strokeStyle = '#22d3ee';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Spacecraft exhaust flame trail
      if (frac < 0.1 || frac > 0.9) {
        ctx.beginPath();
        ctx.arc(shipX, shipY, 7, 0, Math.PI * 2);
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // Labels on canvas
      ctx.font = "11px 'Plus Jakarta Sans', sans-serif";
      ctx.textAlign = 'left';
      ctx.fillStyle = origin.colors.atmosphere;
      ctx.fillText(`${origin.name} (Departure)`, originX + 10, originY + 4);

      ctx.fillStyle = dest.colors.atmosphere;
      ctx.fillText(`${dest.name} (Arrival Rendezvous)`, destX + 10, destY + 4);

      ctx.font = "10px 'JetBrains Mono', monospace";
      ctx.fillStyle = '#22d3ee';
      ctx.fillText(`Spacecraft: ${(frac * 100).toFixed(0)}% Flight Progress`, shipX + 10, shipY - 6);

      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [transfer, origin, dest, isSimulatingFlight]);

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="border-b border-cyan-500/15 pb-4">
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <Rocket className="w-6 h-6 text-cyan-400" />
          <span>Interplanetary Mission & Hohmann Transfer Planner</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Compute idealized minimum-energy Hohmann transfer orbits, travel times, required Δv impulse burns, and planetary launch phase angles.
        </p>
      </div>

      {/* Origin & Destination Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 glass-panel rounded-2xl p-5">
        <div className="space-y-1.5">
          <label className="text-xs font-mono uppercase text-slate-400 block font-semibold">
            1. Departure Planet (Origin)
          </label>
          <select
            value={originId}
            onChange={(e) => setOriginId(e.target.value)}
            className="w-full p-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-cyan-400"
          >
            {PLANETS_DATA.map(p => (
              <option key={p.id} value={p.id} disabled={p.id === destId}>
                {p.name} ({p.semiMajorAxisAU} AU)
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-mono uppercase text-slate-400 block font-semibold">
            2. Arrival Target (Destination)
          </label>
          <select
            value={destId}
            onChange={(e) => setDestId(e.target.value)}
            className="w-full p-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-cyan-400"
          >
            {PLANETS_DATA.map(p => (
              <option key={p.id} value={p.id} disabled={p.id === originId}>
                {p.name} ({p.semiMajorAxisAU} AU)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Grid: Schematic Canvas (7 Cols) + Calculations HUD (5 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Animated Transfer Canvas */}
        <div className="lg:col-span-7 flex flex-col gap-3">
          <div className="relative w-full aspect-[16/11] bg-slate-950 rounded-2xl border border-cyan-500/20 overflow-hidden shadow-2xl">
            <canvas ref={canvasRef} className="w-full h-full block" />

            {/* Flight Pause / Resume Button */}
            <div className="absolute bottom-3 left-3 flex items-center gap-2 z-10">
              <button
                onClick={() => setIsSimulatingFlight(!isSimulatingFlight)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-md transition-colors"
              >
                {isSimulatingFlight ? 'Pause Flight' : 'Resume Flight'}
              </button>
              <button
                onClick={() => { flightProgressRef.current = 0; }}
                className="p-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-white/10"
                title="Restart Trajectory"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 text-center font-mono">
            Cyan Ellipse: Hohmann Transfer Trajectory Arc (Sun at Focus)
          </div>
        </div>

        {/* Calculated Mission Metrics */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-panel rounded-2xl p-5 space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-2">
              <Compass className="w-4 h-4" />
              <span>Trajectory Flight Profile</span>
            </h2>

            {/* Travel Time */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-cyan-500/25">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">One-Way Travel Time</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono mt-0.5">
                {Math.round(transfer.travelTimeDays)} <span className="text-sm text-cyan-400">Earth Days</span>
              </div>
              <span className="text-xs text-slate-400 font-mono block mt-1">
                (~{(transfer.travelTimeDays / 30.4).toFixed(1)} months / {transfer.travelTimeYears.toFixed(2)} years)
              </span>
            </div>

            {/* Delta-V Burns Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="bg-slate-900/60 p-3 rounded-xl border border-white/5">
                <span className="text-[10px] text-slate-400 block uppercase">Δv₁ Departure Burn</span>
                <span className="text-base font-bold text-amber-300">{transfer.deltaV1Kms.toFixed(2)} km/s</span>
                <span className="text-[10px] text-slate-400 block">Heliocentric injection</span>
              </div>

              <div className="bg-slate-900/60 p-3 rounded-xl border border-white/5">
                <span className="text-[10px] text-slate-400 block uppercase">Δv₂ Arrival Burn</span>
                <span className="text-base font-bold text-amber-300">{transfer.deltaV2Kms.toFixed(2)} km/s</span>
                <span className="text-[10px] text-slate-400 block">Rendezvous circularization</span>
              </div>
            </div>

            {/* Total Delta-V */}
            <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 flex items-center justify-between font-mono text-xs">
              <span className="text-slate-300 font-semibold uppercase">Total Heliocentric Δv:</span>
              <span className="text-sm font-bold text-cyan-300">{transfer.totalDeltaVKms.toFixed(2)} km/s</span>
            </div>

            {/* Required Planetary Alignment Phase Angle */}
            <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-xs">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-indigo-300">Required Departure Phase Angle:</span>
                <span className="font-mono font-bold text-white text-sm">{transfer.phaseAngleDeg.toFixed(1)}°</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                At the moment of rocket ignition, {dest.name} must lead {origin.name} by precisely {transfer.phaseAngleDeg.toFixed(1)}° along its orbit for the spacecraft to intercept it.
              </p>
            </div>

            {/* Launch Window Frequency */}
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 text-xs flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-200 block">Launch Window Recurrence:</span>
                <span className="text-[11px] text-slate-400">Synodic period</span>
              </div>
              <div className="text-right font-mono">
                <span className="font-bold text-amber-400 text-sm">{Math.round(transfer.synodicPeriodDays)} days</span>
                <span className="text-[10px] text-slate-500 block">
                  (~{(transfer.synodicPeriodDays / 30.4).toFixed(1)} months)
                </span>
              </div>
            </div>
          </div>

          {/* Scientific Assumptions & Limitations Disclaimer */}
          <div className="glass-panel-subtle rounded-2xl p-4 text-xs text-slate-400 space-y-1.5">
            <span className="font-bold text-slate-200 flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-cyan-400" />
              <span>Scientific Assumptions & Engineering Caveats</span>
            </span>
            <ul className="list-disc pl-4 space-y-1 text-[11px] leading-relaxed">
              {transfer.assumptions.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
