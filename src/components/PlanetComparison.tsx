import React, { useState } from 'react';
import { PlanetData } from '../types';
import { PLANETS_DATA } from '../data/planets';
import {
  BarChart3,
  RotateCcw,
  Sparkles,
  Layers,
  Scale,
  Info,
  Check
} from 'lucide-react';

interface PlanetComparisonProps {
  initialPlanet?: PlanetData;
}

type MetricKey = 'diameterKm' | 'massEarthRatio' | 'gravityMps2' | 'orbitalPeriodYears' | 'semiMajorAxisAU' | 'avgTempC';

interface MetricInfo {
  key: MetricKey;
  label: string;
  unit: string;
  description: string;
  canBeLogarithmic: boolean;
  earthValue: number;
}

const METRICS: MetricInfo[] = [
  {
    key: 'diameterKm',
    label: 'Equatorial Diameter',
    unit: 'km',
    description: 'Physical size across the equator. Jupiter (139,820 km) is 11 times wider than Earth.',
    canBeLogarithmic: true,
    earthValue: 12742,
  },
  {
    key: 'massEarthRatio',
    label: 'Mass (Relative to Earth)',
    unit: 'M⊕',
    description: 'Total planetary mass compared to Earth (1.0). Gas giants comprise over 99% of all planetary mass.',
    canBeLogarithmic: true,
    earthValue: 1.0,
  },
  {
    key: 'gravityMps2',
    label: 'Surface Gravity',
    unit: 'm/s²',
    description: 'Gravitational acceleration at the surface or 1-bar cloud deck level. On Earth it is 9.8 m/s².',
    canBeLogarithmic: false,
    earthValue: 9.807,
  },
  {
    key: 'orbitalPeriodYears',
    label: 'Orbital Period (Year Length)',
    unit: 'Earth Years',
    description: 'Time required to complete one full revolution around the Sun. Dictated strictly by Kepler’s Third Law.',
    canBeLogarithmic: true,
    earthValue: 1.0,
  },
  {
    key: 'semiMajorAxisAU',
    label: 'Distance from Sun',
    unit: 'AU',
    description: 'Average orbital semi-major axis (1 AU = 149.6 million km). Neptune is 30x farther than Earth.',
    canBeLogarithmic: false,
    earthValue: 1.0,
  },
  {
    key: 'avgTempC',
    label: 'Mean Temperature',
    unit: '°C',
    description: 'Average temperature at the surface (terrestrial) or 1-bar atmospheric pressure level (gas giants).',
    canBeLogarithmic: false,
    earthValue: 15,
  },
];

export const PlanetComparison: React.FC<PlanetComparisonProps> = ({ initialPlanet }) => {
  // Selected planet IDs to compare (default Earth, Mars, Jupiter)
  const [selectedIds, setSelectedIds] = useState<string[]>(() => {
    if (initialPlanet && !['earth', 'mars', 'jupiter'].includes(initialPlanet.id)) {
      return ['earth', initialPlanet.id, 'jupiter'];
    }
    return ['earth', 'mars', 'jupiter'];
  });

  const [activeMetricKey, setActiveMetricKey] = useState<MetricKey>('diameterKm');
  const [useLogScale, setUseLogScale] = useState<boolean>(false);

  const activeMetric = METRICS.find(m => m.key === activeMetricKey) || METRICS[0];

  const togglePlanet = (id: string) => {
    if (selectedIds.includes(id)) {
      if (selectedIds.length <= 2) return; // Keep at least 2 for comparison
      setSelectedIds(selectedIds.filter(pId => pId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const setPreset = (ids: string[]) => {
    setSelectedIds(ids);
  };

  const selectedPlanets = PLANETS_DATA.filter(p => selectedIds.includes(p.id));

  // Determine chart maximum for scaling
  const values = selectedPlanets.map(p => {
    const val = p[activeMetricKey] as number;
    return val;
  });

  const rawMax = Math.max(...values, activeMetric.earthValue);
  const rawMin = Math.min(...values);

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-cyan-500/15 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-cyan-400" />
            <span>Planet Comparison Laboratory</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Compare planetary dimensions, mass, surface gravity, temperatures, and orbital periods with scientific scaling.
          </p>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setPreset(PLANETS_DATA.map(p => p.id))}
            className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-white/5 text-xs font-medium transition-colors"
          >
            All 8 Planets
          </button>
          <button
            onClick={() => setPreset(['mercury', 'venus', 'earth', 'mars'])}
            className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-white/5 text-xs font-medium transition-colors"
          >
            Rocky Terrestrials
          </button>
          <button
            onClick={() => setPreset(['jupiter', 'saturn', 'uranus', 'neptune'])}
            className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-white/5 text-xs font-medium transition-colors"
          >
            Gas & Ice Giants
          </button>
          <button
            onClick={() => setPreset(['earth', 'mars'])}
            className="px-2.5 py-1.5 rounded-lg bg-cyan-950/70 hover:bg-cyan-900/50 text-cyan-300 border border-cyan-500/30 text-xs font-medium transition-colors"
          >
            Earth vs Mars
          </button>
        </div>
      </div>

      {/* Planet Selection Pills */}
      <div className="glass-panel rounded-2xl p-4 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Select Worlds to Compare ({selectedPlanets.length} active)
          </span>
          <button
            onClick={() => setSelectedIds(['earth', 'mars', 'jupiter'])}
            className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Default</span>
          </button>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          {PLANETS_DATA.map((p) => {
            const isChecked = selectedIds.includes(p.id);
            return (
              <button
                key={p.id}
                onClick={() => togglePlanet(p.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  isChecked
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/50 shadow-sm shadow-cyan-500/20'
                    : 'bg-slate-900/40 text-slate-400 border-white/5 hover:text-slate-200'
                }`}
              >
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.colors.base }} />
                <span>{p.name}</span>
                {isChecked && <Check className="w-3 h-3 text-cyan-400" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Metric Selector Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {METRICS.map((m) => {
            const isActive = m.key === activeMetricKey;
            return (
              <button
                key={m.key}
                onClick={() => setActiveMetricKey(m.key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {m.label}
              </button>
            );
          })}
        </div>

        {/* Logarithmic Scale Toggle if applicable */}
        {activeMetric.canBeLogarithmic && (
          <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer bg-slate-900/80 px-3 py-1.5 rounded-xl border border-white/10">
            <input
              type="checkbox"
              checked={useLogScale}
              onChange={(e) => setUseLogScale(e.target.checked)}
              className="rounded accent-cyan-400"
            />
            <span className="font-medium">Logarithmic Scale (log₁₀)</span>
          </label>
        )}
      </div>

      {/* Main Interactive Bar Chart Display */}
      <div className="glass-panel rounded-2xl p-6 space-y-6">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span>{activeMetric.label}</span>
            <span className="text-xs font-mono text-cyan-400 px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/30">
              Unit: {activeMetric.unit}
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">{activeMetric.description}</p>
        </div>

        {/* Dynamic Visual Bars */}
        <div className="space-y-4">
          {selectedPlanets.map((planet) => {
            const val = planet[activeMetricKey] as number;

            // Compute bar width percentage
            let barPct = 0;
            if (activeMetricKey === 'avgTempC') {
              // Temperature can be negative (-220 to 465)
              const tempRange = 700; // -230 to 470
              barPct = Math.max(4, ((val + 230) / tempRange) * 100);
            } else if (useLogScale && activeMetric.canBeLogarithmic) {
              // Log scale: log10(val)
              const safeVal = Math.max(0.001, val);
              const minLog = Math.log10(0.01);
              const maxLog = Math.log10(Math.max(10, rawMax));
              const currentLog = Math.log10(safeVal);
              barPct = Math.max(5, ((currentLog - minLog) / (maxLog - minLog)) * 100);
            } else {
              // Linear scale
              barPct = Math.max(3, (val / (rawMax || 1)) * 100);
            }

            // Ratio relative to Earth
            const ratioToEarth = val / (activeMetric.earthValue || 1);

            return (
              <div key={planet.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 font-semibold text-white">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: planet.colors.base }} />
                    <span>{planet.name}</span>
                    <span className="text-[10px] text-slate-400 font-normal">({planet.type})</span>
                  </div>

                  <div className="flex items-center gap-3 font-mono">
                    <span className="text-cyan-300 font-bold">
                      {val.toLocaleString()} {activeMetric.unit}
                    </span>
                    <span className="text-[10px] text-slate-400 w-16 text-right">
                      {planet.id === 'earth' ? '1.0x (ref)' : `${ratioToEarth.toFixed(2)}x Earth`}
                    </span>
                  </div>
                </div>

                {/* Bar */}
                <div className="h-4 w-full bg-slate-900/80 rounded-full overflow-hidden p-0.5 border border-white/5 flex items-center">
                  <div
                    className="h-full rounded-full transition-all duration-500 shadow-sm"
                    style={{
                      width: `${Math.min(100, Math.max(3, barPct))}%`,
                      backgroundColor: planet.colors.base,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Comparative Insight Explanation */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 flex items-start gap-3">
          <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-300 space-y-1">
            <span className="font-bold text-white block">Astrophysical Insight:</span>
            {activeMetricKey === 'diameterKm' && (
              <p>
                The gas giant Jupiter is over 11 times Earth's diameter, while rocky Mercury is only 38% the width of Earth. You could fit over 1,300 Earths inside the volume of Jupiter!
              </p>
            )}
            {activeMetricKey === 'massEarthRatio' && (
              <p>
                Jupiter possesses 318 times the mass of Earth. Mass differences in the Solar System span four orders of magnitude, which is why a logarithmic scale is invaluable for comparing terrestrial planets to giant gas worlds.
              </p>
            )}
            {activeMetricKey === 'gravityMps2' && (
              <p>
                Despite Saturn having 95 times Earth's mass, its surface gravity (10.44 m/s²) is only 1.06x Earth’s because its low density balloons its radius, placing cloud tops far from its center of mass.
              </p>
            )}
            {activeMetricKey === 'orbitalPeriodYears' && (
              <p>
                Orbital period scales according to Kepler’s Third Law ($T \propto a^{1.5}$). While Mercury whips around the Sun in just 88 days, distant Neptune takes 165 Earth years to complete a single orbital circuit.
              </p>
            )}
            {activeMetricKey === 'semiMajorAxisAU' && (
              <p>
                The inner Solar System is tightly clustered (Mercury to Mars all fit inside 1.5 AU), while the outer Solar System is vastly spread out (Neptune orbits at 30 AU, ~4.5 billion km away).
              </p>
            )}
            {activeMetricKey === 'avgTempC' && (
              <p>
                Venus is hotter than Mercury despite being nearly twice as far from the Sun, proving that atmospheric greenhouse trapping (96.5% CO₂) can dominate over raw solar radiative flux.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
