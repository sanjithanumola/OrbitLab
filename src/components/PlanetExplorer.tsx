import React, { useState, useEffect, useRef } from 'react';
import { PlanetData } from '../types';
import { PLANETS_DATA, SUN_DATA, PLUTO_DWARF_PLANET } from '../data/planets';
import {
  ChevronLeft,
  ChevronRight,
  Globe2,
  Compass,
  BarChart3,
  Bookmark,
  BookmarkCheck,
  Target,
  Sparkles,
  Thermometer,
  Layers,
  Wind,
  Info,
  Calendar,
  Weight,
  Maximize2
} from 'lucide-react';

interface PlanetExplorerProps {
  initialPlanetId?: string;
  onFollowInSim: (planet: PlanetData) => void;
  onExploreMoons: (planetId: string) => void;
  onComparePlanet: (planet: PlanetData) => void;
  bookmarkedIds: string[];
  onToggleBookmark: (planetId: string) => void;
}

export const PlanetExplorer: React.FC<PlanetExplorerProps> = ({
  initialPlanetId = 'earth',
  onFollowInSim,
  onExploreMoons,
  onComparePlanet,
  bookmarkedIds,
  onToggleBookmark,
}) => {
  const allBodies: PlanetData[] = [SUN_DATA, ...PLANETS_DATA, PLUTO_DWARF_PLANET];
  const [selectedPlanetIndex, setSelectedPlanetIndex] = useState(() => {
    const idx = allBodies.findIndex(p => p.id === initialPlanetId);
    return idx >= 0 ? idx : 3; // Earth default
  });

  const planet = allBodies[selectedPlanetIndex];
  const isBookmarked = bookmarkedIds.includes(planet.id);

  // 3D Canvas visual sphere preview
  const sphereCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = sphereCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let rotation = 0;

    const renderSphere = () => {
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

      const cx = width / 2;
      const cy = height / 2;
      const radius = Math.min(width, height) * 0.36;

      // Draw planet body
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.clip();

      // Base color
      ctx.fillStyle = planet.colors.base;
      ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

      // Rotating atmospheric bands / texture strips
      ctx.save();
      ctx.translate(cx, cy);
      // Tilt slightly
      ctx.rotate(planet.inclinationDeg * 0.05);

      const bandCount = 14;
      for (let i = -bandCount; i <= bandCount; i++) {
        const bandY = (i / bandCount) * radius;
        const wave = Math.sin(rotation + i * 0.5) * 4;
        ctx.fillStyle = i % 2 === 0 ? planet.colors.accent : planet.colors.atmosphere;
        ctx.globalAlpha = 0.28;
        ctx.fillRect(-radius, bandY + wave, radius * 2, radius / bandCount);
      }
      ctx.restore();

      // Atmospheric shading (spherical lighting gradient)
      const lightGrad = ctx.createRadialGradient(
        cx - radius * 0.4,
        cy - radius * 0.4,
        radius * 0.1,
        cx,
        cy,
        radius
      );
      lightGrad.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
      lightGrad.addColorStop(0.5, 'rgba(0, 0, 0, 0)');
      lightGrad.addColorStop(1, 'rgba(0, 0, 0, 0.88)');
      ctx.fillStyle = lightGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore(); // end clip

      // Outer atmospheric glow rim
      ctx.beginPath();
      ctx.arc(cx, cy, radius + 2, 0, Math.PI * 2);
      ctx.strokeStyle = planet.colors.atmosphere;
      ctx.lineWidth = 3;
      ctx.globalAlpha = 0.5;
      ctx.stroke();
      ctx.globalAlpha = 1.0;

      // Draw Rings if present (Saturn or Uranus)
      if (planet.hasRings) {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(planet.id === 'uranus' ? 1.5 : 0.4);

        // Ring outer
        ctx.beginPath();
        ctx.ellipse(0, 0, radius * 2.1, radius * 0.65, 0, 0, Math.PI * 2);
        ctx.strokeStyle = planet.id === 'saturn' ? 'rgba(234, 179, 8, 0.7)' : 'rgba(103, 232, 249, 0.4)';
        ctx.lineWidth = 8;
        ctx.stroke();

        // Inner Cassini ring
        ctx.beginPath();
        ctx.ellipse(0, 0, radius * 1.6, radius * 0.45, 0, 0, Math.PI * 2);
        ctx.strokeStyle = planet.id === 'saturn' ? 'rgba(254, 240, 138, 0.5)' : 'rgba(6, 182, 212, 0.3)';
        ctx.lineWidth = 4;
        ctx.stroke();
        ctx.restore();
      }

      ctx.restore();

      // Rotate planet
      rotation += 0.012;
      animId = requestAnimationFrame(renderSphere);
    };

    animId = requestAnimationFrame(renderSphere);
    return () => cancelAnimationFrame(animId);
  }, [planet]);

  const handlePrev = () => {
    setSelectedPlanetIndex(prev => (prev === 0 ? allBodies.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedPlanetIndex(prev => (prev === allBodies.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-6 space-y-6 animate-fade-in">
      {/* Top Selector Ribbon */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2 no-scrollbar border-b border-cyan-500/15">
        <div className="flex items-center gap-1.5">
          {allBodies.map((b, idx) => {
            const isCurrent = idx === selectedPlanetIndex;
            return (
              <button
                key={b.id}
                onClick={() => setSelectedPlanetIndex(idx)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  isCurrent
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-sm shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-slate-200 bg-slate-900/60 hover:bg-slate-800'
                }`}
              >
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: b.colors.base }} />
                <span>{b.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Profile Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Visual & Quick Actions (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="glass-panel rounded-2xl p-6 relative overflow-hidden flex flex-col items-center justify-center min-h-[380px]">
            {/* Header / Bookmark */}
            <div className="w-full flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/30">
                {planet.type}
              </span>
              <button
                onClick={() => onToggleBookmark(planet.id)}
                className={`p-2 rounded-lg border transition-all ${
                  isBookmarked
                    ? 'bg-amber-500/20 text-amber-300 border-amber-400/40'
                    : 'bg-slate-900/60 text-slate-400 border-white/5 hover:text-white'
                }`}
                title={isBookmarked ? 'Remove bookmark' : 'Bookmark this planet'}
                aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark planet'}
              >
                {isBookmarked ? <BookmarkCheck className="w-4 h-4 fill-current" /> : <Bookmark className="w-4 h-4" />}
              </button>
            </div>

            {/* Interactive Rotating Sphere Canvas */}
            <div className="relative w-full aspect-square max-w-[280px]">
              <canvas
                ref={sphereCanvasRef}
                className="w-full h-full block"
                title={`${planet.name} procedural rotating representation`}
              />
            </div>

            {/* Navigation Carousel Buttons */}
            <div className="flex items-center justify-between w-full mt-4 pt-4 border-t border-white/5">
              <button
                onClick={handlePrev}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-white/5 text-xs font-medium transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Prev</span>
              </button>

              <div className="text-center">
                <span className="text-lg font-bold text-white block leading-tight">{planet.name}</span>
                <span className="text-xs text-slate-400 italic">{planet.latinName}</span>
              </div>

              <button
                onClick={handleNext}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-white/5 text-xs font-medium transition-colors"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => onFollowInSim(planet)}
              className="flex flex-col items-center justify-center p-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white shadow-md shadow-cyan-600/25 transition-all text-xs font-semibold text-center"
            >
              <Target className="w-4 h-4 mb-1" />
              <span>Follow Orbit</span>
            </button>

            <button
              onClick={() => onExploreMoons(planet.id)}
              className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 transition-all text-xs font-semibold text-center"
            >
              <Compass className="w-4 h-4 mb-1 text-cyan-400" />
              <span>Moons ({planet.knownMoons})</span>
            </button>

            <button
              onClick={() => onComparePlanet(planet)}
              className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 transition-all text-xs font-semibold text-center"
            >
              <BarChart3 className="w-4 h-4 mb-1 text-amber-400" />
              <span>Compare</span>
            </button>
          </div>
        </div>

        {/* Right Astronomical Fact Sheet & Scientific Properties (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Summary Banner */}
          <div className="glass-panel rounded-2xl p-5">
            <h2 className="text-xl font-extrabold text-white mb-2 flex items-center gap-2">
              <span>{planet.name}</span>
              <span className="text-xs font-mono font-normal text-slate-400 px-2 py-0.5 rounded bg-slate-800/80">
                Order: #{planet.orderFromSun} from Sun
              </span>
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">{planet.description}</p>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="glass-panel-subtle rounded-xl p-3 border border-white/5">
              <span className="text-[10px] text-slate-400 block uppercase font-mono">Diameter</span>
              <span className="text-base font-bold text-white font-mono">{planet.diameterKm.toLocaleString()}</span>
              <span className="text-[11px] text-slate-400 ml-1">km</span>
            </div>

            <div className="glass-panel-subtle rounded-xl p-3 border border-white/5">
              <span className="text-[10px] text-slate-400 block uppercase font-mono">Mass</span>
              <span className="text-base font-bold text-white font-mono">{planet.massKg}</span>
              <span className="text-[10px] text-cyan-400 block">({planet.massEarthRatio}x Earth)</span>
            </div>

            <div className="glass-panel-subtle rounded-xl p-3 border border-white/5">
              <span className="text-[10px] text-slate-400 block uppercase font-mono">Gravity</span>
              <span className="text-base font-bold text-white font-mono">{planet.gravityMps2}</span>
              <span className="text-[11px] text-slate-400 ml-1">m/s²</span>
            </div>

            <div className="glass-panel-subtle rounded-xl p-3 border border-white/5">
              <span className="text-[10px] text-slate-400 block uppercase font-mono">Avg Distance (AU)</span>
              <span className="text-base font-bold text-white font-mono">{planet.semiMajorAxisAU}</span>
              <span className="text-[11px] text-slate-400 ml-1">AU</span>
            </div>

            <div className="glass-panel-subtle rounded-xl p-3 border border-white/5">
              <span className="text-[10px] text-slate-400 block uppercase font-mono">Orbital Period</span>
              <span className="text-base font-bold text-white font-mono">
                {planet.orbitalPeriodYears > 0 ? `${planet.orbitalPeriodYears} yr` : 'N/A'}
              </span>
              <span className="text-[10px] text-slate-400 block">({planet.orbitalPeriodDays} days)</span>
            </div>

            <div className="glass-panel-subtle rounded-xl p-3 border border-white/5">
              <span className="text-[10px] text-slate-400 block uppercase font-mono">Mean Temperature</span>
              <span className="text-base font-bold text-white font-mono">{planet.avgTempC} °C</span>
              <span className="text-[10px] text-slate-400 block font-mono">({planet.avgTempK} K)</span>
            </div>
          </div>

          {/* Atmosphere & Composition Section */}
          <div className="glass-panel rounded-2xl p-5 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-1.5">
              <Wind className="w-3.5 h-3.5" />
              <span>Atmosphere & Composition</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">{planet.atmosphere}</p>

            {/* Atmosphere Gas Breakdown Bar */}
            {planet.atmosphereGases.length > 0 && (
              <div className="space-y-1.5 pt-2">
                <div className="h-3 w-full rounded-full overflow-hidden flex bg-slate-900 border border-white/10">
                  {planet.atmosphereGases.map((gas, i) => {
                    const colors = ['bg-cyan-500', 'bg-blue-600', 'bg-amber-500', 'bg-emerald-500', 'bg-purple-500'];
                    return (
                      <div
                        key={gas.name}
                        className={`h-full ${colors[i % colors.length]}`}
                        style={{ width: `${Math.min(100, Math.max(2, gas.percentage))}%` }}
                        title={`${gas.name}: ${gas.percentage}%`}
                      />
                    );
                  })}
                </div>
                <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-300">
                  {planet.atmosphereGases.map((gas, i) => {
                    const dotColors = ['bg-cyan-500', 'bg-blue-600', 'bg-amber-500', 'bg-emerald-500', 'bg-purple-500'];
                    return (
                      <div key={gas.name} className="flex items-center gap-1">
                        <div className={`w-2 h-2 rounded-full ${dotColors[i % dotColors.length]}`} />
                        <span>{gas.name}</span>
                        <span className="font-mono text-slate-400">({gas.percentage}%)</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="pt-2 border-t border-white/5">
              <span className="text-[11px] font-bold text-slate-200 block mb-1">Geological Core & Mantle:</span>
              <p className="text-xs text-slate-400 leading-relaxed">{planet.composition}</p>
            </div>
          </div>

          {/* Distinctive Features & Educational Facts */}
          <div className="glass-panel rounded-2xl p-5 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Distinctive Astronomical Facts</span>
            </h3>

            <div className="space-y-2">
              {planet.facts.map((fact, idx) => (
                <div key={idx} className="flex items-start gap-2.5 bg-slate-900/50 p-3 rounded-xl border border-white/5 text-xs text-slate-300">
                  <div className="w-5 h-5 rounded-md bg-amber-500/10 text-amber-400 font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </div>
                  <p className="leading-relaxed">{fact}</p>
                </div>
              ))}
            </div>

            {/* Moons source validation note */}
            <div className="text-[10px] text-slate-500 pt-1 flex items-center gap-1">
              <Info className="w-3 h-3" />
              <span>Official moon count verified via {planet.moonsSourceDate}. Data calibrated to NASA Planetary Fact Sheets.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
