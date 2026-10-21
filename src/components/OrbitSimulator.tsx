import React, { useState, useEffect, useRef } from 'react';
import {
  calculateOrbitalPeriodYears,
  calculateOrbitalExtremes,
  calculateOrbitalSpeedKms,
  solveKeplerEquation,
  trueAnomalyFromEccentricAnomaly,
  convertAuToKm
} from '../utils/astronomy';
import {
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Gauge,
  Sliders,
  Layers,
  Info,
  Activity
} from 'lucide-react';

interface OrbitSimulatorProps {
  onUnlockAchievement: (id: string) => void;
}

export const OrbitSimulator: React.FC<OrbitSimulatorProps> = ({ onUnlockAchievement }) => {
  // Simulator Parameters
  const [semiMajorAxisAU, setSemiMajorAxisAU] = useState<number>(2.0); // AU
  const [eccentricity, setEccentricity] = useState<number>(0.45); // [0, 0.85]
  const [centralMass, setCentralMass] = useState<number>(1.0); // Solar masses
  const [simSpeed, setSimSpeed] = useState<number>(1.0);
  const [showTrails, setShowTrails] = useState<boolean>(true);
  const [showSweepArea, setShowSweepArea] = useState<boolean>(true);
  const [showVelocityVector, setShowVelocityVector] = useState<boolean>(true);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  // Time accumulator
  const timeSecRef = useRef<number>(0);
  const trailsRef = useRef<{ x: number; y: number }[]>([]);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Calculated orbital extremes & period
  const { perihelionAU, aphelionAU, semiMinorAxisAU } = calculateOrbitalExtremes(semiMajorAxisAU, eccentricity);
  const periodYears = calculateOrbitalPeriodYears(semiMajorAxisAU, centralMass);
  const periodDays = periodYears * 365.25;

  // Award achievement when user sets an eccentric orbit
  useEffect(() => {
    if (eccentricity > 0.4) {
      onUnlockAchievement('kepler_disciple');
    }
  }, [eccentricity, onUnlockAchievement]);

  // Main Canvas Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let lastTimestamp = performance.now();

    const render = (now: number) => {
      const dt = (now - lastTimestamp) / 1000;
      lastTimestamp = now;

      if (isPlaying) {
        // Advance simulation time in Earth years
        timeSecRef.current += (dt * simSpeed * 0.4);
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

      // Deep space background with subtle grid
      ctx.fillStyle = '#050818';
      ctx.fillRect(0, 0, width, height);

      // Draw faint coordinate grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.lineWidth = 1;
      const step = 40;
      for (let x = 0; x < width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Center and scale
      // The Primary (Sun) is at Focus 1. Let Focus 1 be at (width * 0.45, height * 0.5)
      const primaryX = width * 0.45;
      const primaryY = height * 0.5;

      // Scale factor: pixels per AU
      // Make max extent fit nicely
      const maxExtAU = Math.max(aphelionAU, semiMajorAxisAU * 1.5, 3);
      const pxPerAU = Math.min((width * 0.42) / maxExtAU, (height * 0.4) / (semiMinorAxisAU || 1));

      const aPx = semiMajorAxisAU * pxPerAU;
      const bPx = semiMinorAxisAU * pxPerAU;
      const cPx = aPx * eccentricity; // distance from center of ellipse to focus

      // Ellipse Center is offset to the left of the primary focus by cPx
      const ellipseCenterX = primaryX - cPx;
      const ellipseCenterY = primaryY;

      // 1. Draw Elliptical Orbit Path
      ctx.beginPath();
      ctx.ellipse(ellipseCenterX, ellipseCenterY, aPx, bPx, 0, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.5)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Major and Minor Axis lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(ellipseCenterX - aPx, ellipseCenterY);
      ctx.lineTo(ellipseCenterX + aPx, ellipseCenterY);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(ellipseCenterX, ellipseCenterY - bPx);
      ctx.lineTo(ellipseCenterX, ellipseCenterY + bPx);
      ctx.stroke();
      ctx.setLineDash([]);

      // 2. Mark Perihelion and Aphelion
      const periX = primaryX + aPx * (1 - eccentricity);
      const periY = primaryY;
      const aphX = primaryX - aPx * (1 + eccentricity);
      const aphY = primaryY;

      // Perihelion point (Closest)
      ctx.fillStyle = '#22c55e';
      ctx.beginPath();
      ctx.arc(periX, periY, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.font = "10px 'JetBrains Mono', monospace";
      ctx.fillText(`Perihelion: ${perihelionAU.toFixed(2)} AU`, periX + 8, periY - 6);

      // Aphelion point (Farthest)
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(aphX, aphY, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillText(`Aphelion: ${aphelionAU.toFixed(2)} AU`, aphX - 110, aphY - 6);

      // 3. Compute Current Satellite Position via Kepler's Equation
      // Mean Anomaly M = 2 * PI * (t / periodYears)
      const meanAnomaly = ((timeSecRef.current / (periodYears || 1)) * 2 * Math.PI) % (2 * Math.PI);
      const eccentricAnomaly = solveKeplerEquation(meanAnomaly, eccentricity);
      const trueAnomaly = trueAnomalyFromEccentricAnomaly(eccentricAnomaly, eccentricity);

      // Radius from primary in AU: r = a * (1 - e^2) / (1 + e * cos(nu))
      const rAU = (semiMajorAxisAU * (1 - eccentricity * eccentricity)) / (1 + eccentricity * Math.cos(trueAnomaly));
      const currentRadiusPx = rAU * pxPerAU;

      const planetX = primaryX + Math.cos(trueAnomaly) * currentRadiusPx;
      const planetY = primaryY + Math.sin(trueAnomaly) * currentRadiusPx;

      // Instantaneous orbital speed via Vis-Viva equation
      const currentSpeedKms = calculateOrbitalSpeedKms(
        convertAuToKm(rAU),
        convertAuToKm(semiMajorAxisAU)
      );

      // 4. Kepler's Second Law Area Sweep Wedge
      if (showSweepArea) {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(primaryX, primaryY);
        // sweep sector of previous 0.25 radians
        const sweepAngleStart = trueAnomaly - 0.28;
        const steps = 15;
        for (let i = 0; i <= steps; i++) {
          const nuStep = sweepAngleStart + (0.28 * i) / steps;
          const rStep = (semiMajorAxisAU * (1 - eccentricity * eccentricity)) / (1 + eccentricity * Math.cos(nuStep)) * pxPerAU;
          ctx.lineTo(primaryX + Math.cos(nuStep) * rStep, primaryY + Math.sin(nuStep) * rStep);
        }
        ctx.closePath();
        ctx.fillStyle = 'rgba(234, 179, 8, 0.15)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(234, 179, 8, 0.4)';
        ctx.stroke();
        ctx.restore();
      }

      // 5. Draw Orbital Trails
      if (showTrails) {
        trailsRef.current.push({ x: planetX, y: planetY });
        if (trailsRef.current.length > 90) {
          trailsRef.current.shift();
        }

        ctx.strokeStyle = 'rgba(34, 211, 238, 0.4)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        trailsRef.current.forEach((pt, i) => {
          if (i === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        });
        ctx.stroke();
      } else {
        trailsRef.current = [];
      }

      // 6. Draw Velocity Vector
      if (showVelocityVector) {
        // Tangent velocity vector angle: gamma = trueAnomaly + PI/2 + flight_path_angle
        // Flight path angle: tan(gamma_f) = (e * sin(nu)) / (1 + e * cos(nu))
        const flightPathAngle = Math.atan2(eccentricity * Math.sin(trueAnomaly), 1 + eccentricity * Math.cos(trueAnomaly));
        const velocityAngle = trueAnomaly + Math.PI / 2 + flightPathAngle;
        const vectorLength = (currentSpeedKms / 12) * 12; // Scaled length

        const vx = planetX + Math.cos(velocityAngle) * vectorLength;
        const vy = planetY + Math.sin(velocityAngle) * vectorLength;

        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(planetX, planetY);
        ctx.lineTo(vx, vy);
        ctx.stroke();

        // Arrow head
        const arrowAngle = Math.PI / 6;
        ctx.beginPath();
        ctx.moveTo(vx, vy);
        ctx.lineTo(
          vx - 6 * Math.cos(velocityAngle - arrowAngle),
          vy - 6 * Math.sin(velocityAngle - arrowAngle)
        );
        ctx.moveTo(vx, vy);
        ctx.lineTo(
          vx - 6 * Math.cos(velocityAngle + arrowAngle),
          vy - 6 * Math.sin(velocityAngle + arrowAngle)
        );
        ctx.stroke();
      }

      // 7. Draw Primary Central Sun at Focus
      const sunGrad = ctx.createRadialGradient(primaryX, primaryY, 2, primaryX, primaryY, 20);
      sunGrad.addColorStop(0, '#ffffff');
      sunGrad.addColorStop(0.3, '#fbbf24');
      sunGrad.addColorStop(1, '#ea580c');
      ctx.fillStyle = sunGrad;
      ctx.beginPath();
      ctx.arc(primaryX, primaryY, 14, 0, Math.PI * 2);
      ctx.fill();

      // Primary label
      ctx.font = "10px 'Plus Jakarta Sans', sans-serif";
      ctx.fillStyle = '#fde68a';
      ctx.textAlign = 'center';
      ctx.fillText(`Primary (${centralMass} M☉)`, primaryX, primaryY + 24);

      // 8. Draw Orbiting Planet Body
      const planetGrad = ctx.createRadialGradient(planetX - 3, planetY - 3, 1, planetX, planetY, 8);
      planetGrad.addColorStop(0, '#e0f2fe');
      planetGrad.addColorStop(0.6, '#0284c7');
      planetGrad.addColorStop(1, '#0369a1');

      ctx.fillStyle = planetGrad;
      ctx.beginPath();
      ctx.arc(planetX, planetY, 8, 0, Math.PI * 2);
      ctx.fill();

      // Atmospheric outer ring
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Live Speed & Distance HUD above planet
      ctx.font = "10px 'JetBrains Mono', monospace";
      ctx.fillStyle = '#ffffff';
      ctx.fillText(`${currentSpeedKms.toFixed(1)} km/s`, planetX, planetY - 14);

      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [
    semiMajorAxisAU,
    eccentricity,
    centralMass,
    simSpeed,
    showTrails,
    showSweepArea,
    showVelocityVector,
    isPlaying,
    perihelionAU,
    aphelionAU,
    semiMinorAxisAU,
    periodYears,
  ]);

  const setPreset = (a: number, e: number, name: string) => {
    setSemiMajorAxisAU(a);
    setEccentricity(e);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="border-b border-cyan-500/15 pb-4">
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <Activity className="w-6 h-6 text-cyan-400" />
          <span>Keplerian Orbital Mechanics Laboratory</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Adjust semi-major axis (a), eccentricity (e), and primary mass (M) to explore Kepler’s Laws and the Vis-Viva equation in real-time.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Interactive Simulation Canvas (8 Cols) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="relative w-full aspect-[16/10] bg-slate-950 rounded-2xl border border-cyan-500/25 overflow-hidden shadow-2xl">
            <canvas ref={canvasRef} className="w-full h-full block" />

            {/* In-canvas overlay badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
              <div className="bg-[#050818]/85 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-xs">
                <span className="text-slate-400 font-mono text-[10px] uppercase block">Orbital Period (T)</span>
                <span className="text-cyan-300 font-bold font-mono text-sm">
                  {periodYears.toFixed(3)} Earth Years
                </span>
                <span className="text-slate-400 text-[10px] font-mono ml-1.5">
                  ({periodDays.toFixed(1)} days)
                </span>
              </div>
            </div>

            {/* Play/Pause & Reset Overlay Button */}
            <div className="absolute bottom-3 left-3 flex items-center gap-2 z-10">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-md transition-colors"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                <span>{isPlaying ? 'Pause' : 'Resume'}</span>
              </button>

              <button
                onClick={() => { timeSecRef.current = 0; trailsRef.current = []; }}
                className="p-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-white/10"
                title="Reset Orbit Position"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Quick Real-World Orbital Presets */}
          <div className="glass-panel rounded-xl p-3 flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="font-semibold text-slate-300 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Real-World Presets:</span>
            </span>

            <div className="flex flex-wrap items-center gap-1.5">
              <button
                onClick={() => setPreset(1.0, 0.017, 'Earth')}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/5"
              >
                Earth (Near-Circular, e=0.017)
              </button>
              <button
                onClick={() => setPreset(0.387, 0.206, 'Mercury')}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/5"
              >
                Mercury (e=0.206)
              </button>
              <button
                onClick={() => setPreset(1.524, 0.093, 'Mars')}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/5"
              >
                Mars (e=0.093)
              </button>
              <button
                onClick={() => setPreset(3.5, 0.72, 'Comet-Like')}
                className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/40"
              >
                Comet-Like (High e=0.72)
              </button>
            </div>
          </div>
        </div>

        {/* Right Interactive Controls & Scientific Calculations (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="glass-panel rounded-2xl p-5 space-y-5">
            <h2 className="text-sm font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-1.5">
              <Sliders className="w-4 h-4" />
              <span>Orbital Parameters</span>
            </h2>

            {/* Slider 1: Semi-Major Axis (a) */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-medium">Semi-Major Axis (a)</span>
                <span className="text-cyan-400 font-mono font-bold">{semiMajorAxisAU.toFixed(2)} AU</span>
              </div>
              <input
                type="range"
                min="0.3"
                max="6.0"
                step="0.05"
                value={semiMajorAxisAU}
                onChange={(e) => setSemiMajorAxisAU(parseFloat(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
              <span className="text-[10px] text-slate-500 block">Controls orbital distance and determines period via T² ∝ a³.</span>
            </div>

            {/* Slider 2: Eccentricity (e) */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-medium">Eccentricity (e)</span>
                <span className="text-cyan-400 font-mono font-bold">{eccentricity.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="0.85"
                step="0.01"
                value={eccentricity}
                onChange={(e) => setEccentricity(parseFloat(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
              <span className="text-[10px] text-slate-500 block">0.00 = perfect circle, &gt;0.70 = extreme stretched ellipse.</span>
            </div>

            {/* Slider 3: Primary Body Mass */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-medium">Primary Star Mass (M)</span>
                <span className="text-amber-400 font-mono font-bold">{centralMass.toFixed(1)} M☉</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="3.0"
                step="0.1"
                value={centralMass}
                onChange={(e) => setCentralMass(parseFloat(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
              <span className="text-[10px] text-slate-500 block">Higher primary mass creates stronger gravitational pull and faster orbits.</span>
            </div>

            {/* Slider 4: Simulation Speed */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-medium">Speed Multiplier</span>
                <span className="text-slate-200 font-mono font-bold">{simSpeed.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="4.0"
                step="0.2"
                value={simSpeed}
                onChange={(e) => setSimSpeed(parseFloat(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
            </div>

            {/* Visualization Toggles */}
            <div className="space-y-2 pt-2 border-t border-white/5">
              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showSweepArea}
                  onChange={(e) => setShowSweepArea(e.target.checked)}
                  className="rounded accent-cyan-400"
                />
                <span>Kepler’s 2nd Law (Area Sweep Sector)</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showVelocityVector}
                  onChange={(e) => setShowVelocityVector(e.target.checked)}
                  className="rounded accent-cyan-400"
                />
                <span>Velocity Vector Arrow (Vis-Viva Equation)</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showTrails}
                  onChange={(e) => setShowTrails(e.target.checked)}
                  className="rounded accent-cyan-400"
                />
                <span>Show Orbital Past Trails</span>
              </label>
            </div>
          </div>

          {/* Mathematical & Physical Formulation Card */}
          <div className="glass-panel rounded-2xl p-5 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-cyan-400" />
              <span>Kepler’s Third Law Formulation</span>
            </h3>

            <div className="p-3 rounded-xl bg-slate-950/80 font-mono text-center text-cyan-300 text-xs border border-white/5">
              T² = (4π² · a³) / (G · M)
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="bg-slate-900/60 p-2 rounded-lg">
                <span className="text-[10px] text-slate-400 block uppercase">Perihelion (rp)</span>
                <span className="text-slate-200 font-bold">{perihelionAU.toFixed(2)} AU</span>
              </div>
              <div className="bg-slate-900/60 p-2 rounded-lg">
                <span className="text-[10px] text-slate-400 block uppercase">Aphelion (ra)</span>
                <span className="text-slate-200 font-bold">{aphelionAU.toFixed(2)} AU</span>
              </div>
              <div className="bg-slate-900/60 p-2 rounded-lg">
                <span className="text-[10px] text-slate-400 block uppercase">Semi-Minor (b)</span>
                <span className="text-slate-200 font-bold">{semiMinorAxisAU.toFixed(2)} AU</span>
              </div>
              <div className="bg-slate-900/60 p-2 rounded-lg">
                <span className="text-[10px] text-slate-400 block uppercase">Ratio (ra / rp)</span>
                <span className="text-slate-200 font-bold">{(aphelionAU / (perihelionAU || 1)).toFixed(2)}x</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed pt-1">
              Notice that as eccentricity approaches 0, the ellipse becomes a circle and the planet moves at constant velocity. High eccentricity causes intense acceleration at perihelion!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
