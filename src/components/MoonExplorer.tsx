import React, { useState, useEffect, useRef } from 'react';
import { MoonData } from '../types';
import { MOONS_DATA } from '../data/moons';
import { PLANETS_DATA } from '../data/planets';
import {
  Search,
  Compass,
  Bookmark,
  BookmarkCheck,
  Rocket,
  Info,
  Orbit,
  Sparkles,
  ChevronRight
} from 'lucide-react';

interface MoonExplorerProps {
  initialPlanetFilter?: string;
  bookmarkedMoonIds: string[];
  onToggleBookmark: (moonId: string) => void;
}

export const MoonExplorer: React.FC<MoonExplorerProps> = ({
  initialPlanetFilter,
  bookmarkedMoonIds,
  onToggleBookmark,
}) => {
  const [selectedPlanetFilter, setSelectedPlanetFilter] = useState<string>(initialPlanetFilter || 'all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedMoonId, setSelectedMoonId] = useState<string>('moon');

  const filteredMoons = MOONS_DATA.filter(moon => {
    const matchesPlanet = selectedPlanetFilter === 'all' || moon.parentPlanetId === selectedPlanetFilter;
    const matchesSearch = moon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          moon.parentPlanetName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPlanet && matchesSearch;
  });

  const selectedMoon = MOONS_DATA.find(m => m.id === selectedMoonId) || filteredMoons[0] || MOONS_DATA[0];
  const parentPlanet = PLANETS_DATA.find(p => p.id === selectedMoon.parentPlanetId);
  const isBookmarked = bookmarkedMoonIds.includes(selectedMoon.id);

  // Mini canvas showing simplified orbit around parent planet
  const orbitCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = orbitCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let angle = 0;

    const render = () => {
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
      const orbitR = Math.min(width, height) * 0.38;

      // Draw orbit path
      ctx.beginPath();
      ctx.arc(cx, cy, orbitR, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw Parent Planet in Center
      const planetColor = parentPlanet ? parentPlanet.colors.base : '#2563eb';
      const planetR = Math.min(width, height) * 0.14;

      const pGrad = ctx.createRadialGradient(cx - planetR * 0.3, cy - planetR * 0.3, 2, cx, cy, planetR);
      pGrad.addColorStop(0, '#ffffff');
      pGrad.addColorStop(0.5, planetColor);
      pGrad.addColorStop(1, '#000000');

      ctx.beginPath();
      ctx.arc(cx, cy, planetR, 0, Math.PI * 2);
      ctx.fillStyle = pGrad;
      ctx.fill();

      // Parent planet label
      ctx.font = "11px 'Plus Jakarta Sans', sans-serif";
      ctx.fillStyle = '#cbd5e1';
      ctx.textAlign = 'center';
      ctx.fillText(selectedMoon.parentPlanetName, cx, cy + planetR + 14);

      // Draw Orbiting Moon
      const moonX = cx + Math.cos(angle) * orbitR;
      const moonY = cy + Math.sin(angle) * orbitR;
      const moonR = 6;

      ctx.beginPath();
      ctx.arc(moonX, moonY, moonR, 0, Math.PI * 2);
      ctx.fillStyle = selectedMoon.color;
      ctx.fill();

      // Moon subtle glow
      ctx.beginPath();
      ctx.arc(moonX, moonY, moonR + 2, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Moon label
      ctx.font = "10px 'Plus Jakarta Sans', sans-serif";
      ctx.fillStyle = '#38bdf8';
      ctx.fillText(selectedMoon.name, moonX, moonY - 10);

      ctx.restore();

      // Orbital speed roughly scaled inversely to period
      const speed = Math.min(0.06, Math.max(0.008, 0.04 / Math.abs(selectedMoon.orbitalPeriodDays)));
      angle += speed;

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [selectedMoon, parentPlanet]);

  const planetOptions = [
    { id: 'all', label: 'All Planets' },
    { id: 'earth', label: 'Earth' },
    { id: 'mars', label: 'Mars' },
    { id: 'jupiter', label: 'Jupiter' },
    { id: 'saturn', label: 'Saturn' },
    { id: 'uranus', label: 'Uranus' },
    { id: 'neptune', label: 'Neptune' },
    { id: 'pluto', label: 'Pluto (Dwarf)' },
  ];

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-6 space-y-6 animate-fade-in">
      {/* Header and Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-cyan-500/15 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Compass className="w-6 h-6 text-cyan-400" />
            <span>Moon Explorer & Natural Satellites</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Explore prominent moons across the Solar System, their parent orbits, oceans, and robotic exploration history.
          </p>
        </div>

        {/* Search bar */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search moon name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900/80 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
        </div>
      </div>

      {/* Parent Planet Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {planetOptions.map((opt) => (
          <button
            key={opt.id}
            onClick={() => setSelectedPlanetFilter(opt.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              selectedPlanetFilter === opt.id
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-sm shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200 bg-slate-900/60'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Two Column Layout: Moon Cards List (4 Cols) + Selected Moon Detailed Hub (8 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Moon Directory List */}
        <div className="lg:col-span-5 space-y-2 max-h-[640px] overflow-y-auto pr-1">
          {filteredMoons.length === 0 ? (
            <div className="glass-panel rounded-xl p-8 text-center text-slate-400 text-xs">
              No natural satellites found matching your search.
            </div>
          ) : (
            filteredMoons.map((moon) => {
              const isSelected = moon.id === selectedMoon.id;
              return (
                <button
                  key={moon.id}
                  onClick={() => setSelectedMoonId(moon.id)}
                  className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-cyan-950/40 border-cyan-400/50 shadow-md shadow-cyan-500/10'
                      : 'bg-slate-900/60 border-white/5 hover:bg-slate-900/90 hover:border-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full shadow-sm shrink-0"
                      style={{ backgroundColor: moon.color }}
                    />
                    <div>
                      <span className="text-sm font-bold text-white block">{moon.name}</span>
                      <span className="text-[11px] text-cyan-400">orbits {moon.parentPlanetName}</span>
                    </div>
                  </div>

                  <div className="text-right font-mono text-[11px] text-slate-400">
                    <div>{moon.diameterKm.toLocaleString()} km</div>
                    <div className="text-[10px] text-slate-500">{Math.abs(moon.orbitalPeriodDays).toFixed(1)} d</div>
                  </div>
                </button>
              );
            })
          )}

          <div className="text-[10px] text-slate-500 p-2 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 shrink-0" />
            <span>Note: Highlights major historically documented moons. Over 290 total natural satellites are confirmed in our Solar System.</span>
          </div>
        </div>

        {/* Right Selected Moon Profile & Orbital Canvas */}
        <div className="lg:col-span-7 space-y-4">
          <div className="glass-panel rounded-2xl p-6 relative overflow-hidden">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/30">
                  Natural Satellite
                </span>
                <h2 className="text-2xl font-extrabold text-white mt-1">{selectedMoon.name}</h2>
                <p className="text-xs text-slate-400">
                  Parent body: <strong className="text-slate-200">{selectedMoon.parentPlanetName}</strong>
                </p>
              </div>

              <button
                onClick={() => onToggleBookmark(selectedMoon.id)}
                className={`p-2.5 rounded-xl border transition-all ${
                  isBookmarked
                    ? 'bg-amber-500/20 text-amber-300 border-amber-400/40'
                    : 'bg-slate-900/80 text-slate-400 border-white/10 hover:text-white'
                }`}
                title={isBookmarked ? 'Remove bookmark' : 'Bookmark this moon'}
                aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark moon'}
              >
                {isBookmarked ? <BookmarkCheck className="w-5 h-5 fill-current" /> : <Bookmark className="w-5 h-5" />}
              </button>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed mb-4">
              {selectedMoon.description}
            </p>

            {/* Orbit Around Parent Planet Canvas */}
            <div className="relative w-full aspect-[2/1] max-h-52 bg-slate-950/70 rounded-xl border border-white/5 overflow-hidden mb-4 flex items-center justify-center">
              <canvas
                ref={orbitCanvasRef}
                className="w-full h-full block"
                title={`Simplified orbit of ${selectedMoon.name} around ${selectedMoon.parentPlanetName}`}
              />
              <div className="absolute top-2 left-2 text-[10px] font-mono text-slate-400 bg-slate-900/80 px-2 py-0.5 rounded border border-white/5">
                Simulated Orbital Path
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="glass-panel-subtle p-3 rounded-xl border border-white/5">
                <span className="text-[10px] text-slate-400 uppercase font-mono block">Diameter</span>
                <span className="text-base font-bold text-white font-mono">{selectedMoon.diameterKm.toLocaleString()}</span>
                <span className="text-[11px] text-slate-400 ml-1">km</span>
              </div>

              <div className="glass-panel-subtle p-3 rounded-xl border border-white/5">
                <span className="text-[10px] text-slate-400 uppercase font-mono block">Orbital Period</span>
                <span className="text-base font-bold text-white font-mono">{Math.abs(selectedMoon.orbitalPeriodDays)}</span>
                <span className="text-[11px] text-slate-400 ml-1">days</span>
                {selectedMoon.orbitalPeriodDays < 0 && (
                  <span className="text-[9px] text-amber-400 block font-mono">Retrograde!</span>
                )}
              </div>

              <div className="glass-panel-subtle p-3 rounded-xl border border-white/5">
                <span className="text-[10px] text-slate-400 uppercase font-mono block">Distance from Planet</span>
                <span className="text-base font-bold text-white font-mono">{selectedMoon.orbitalDistanceKm.toLocaleString()}</span>
                <span className="text-[11px] text-slate-400 ml-1">km</span>
              </div>
            </div>

            {/* Composition & Surface */}
            <div className="mb-4 bg-slate-900/50 p-3 rounded-xl border border-white/5">
              <span className="text-xs font-bold text-slate-200 block mb-1">Composition & Surface Morphology:</span>
              <p className="text-xs text-slate-400 leading-relaxed">{selectedMoon.composition}</p>
            </div>

            {/* Key Facts */}
            <div className="space-y-2 mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Remarkable Characteristics</span>
              </span>
              {selectedMoon.facts.map((fact, idx) => (
                <div key={idx} className="flex items-start gap-2 bg-slate-900/40 p-2.5 rounded-lg border border-white/5 text-xs text-slate-300">
                  <div className="w-4 h-4 rounded bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center shrink-0 text-[10px]">
                    {idx + 1}
                  </div>
                  <p>{fact}</p>
                </div>
              ))}
            </div>

            {/* Exploration Missions */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-1 mb-2">
                <Rocket className="w-3.5 h-3.5" />
                <span>Exploration & Robotic Missions</span>
              </span>
              <div className="flex flex-wrap gap-2">
                {selectedMoon.missions.map((mission, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2.5 py-1 rounded-lg bg-indigo-950/60 border border-indigo-500/30 text-indigo-200 font-mono"
                  >
                    {mission}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
