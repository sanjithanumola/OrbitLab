import React from 'react';
import { UserProgress } from '../types';
import { AppSettings, ACHIEVEMENTS } from '../utils/storage';
import { PLANETS_DATA, SUN_DATA, PLUTO_DWARF_PLANET } from '../data/planets';
import { MOONS_DATA } from '../data/moons';
import {
  X,
  Volume2,
  VolumeX,
  Sliders,
  Sparkles,
  Trophy,
  Bookmark,
  ExternalLink,
  BookOpen,
  RotateCcw,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { cosmicAudio } from '../utils/audio';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
  userProgress: UserProgress;
  onResetProgress: () => void;
  onSelectPlanet: (id: string) => void;
  onSelectMoon: (id: string) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  userProgress,
  onResetProgress,
  onSelectPlanet,
  onSelectMoon,
}) => {
  if (!isOpen) return null;

  const handleVolumeChange = (vol: number) => {
    cosmicAudio.setVolume(vol);
    onUpdateSettings({ ...settings, soundVolume: vol });
  };

  const handleToggleSound = () => {
    const nextState = !settings.soundEnabled;
    if (nextState) {
      cosmicAudio.start();
    } else {
      cosmicAudio.stop();
    }
    onUpdateSettings({ ...settings, soundEnabled: nextState });
  };

  const allPlanets = [SUN_DATA, ...PLANETS_DATA, PLUTO_DWARF_PLANET];
  const bookmarkedPlanets = allPlanets.filter(p => userProgress.bookmarkedPlanetIds.includes(p.id));
  const bookmarkedMoons = MOONS_DATA.filter(m => userProgress.bookmarkedMoonIds.includes(m.id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="glass-panel w-full max-w-2xl max-h-[90vh] rounded-2xl flex flex-col overflow-hidden shadow-2xl border border-cyan-500/30">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-white">Settings, Achievements & Sources</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Scrollable Area */}
        <div className="overflow-y-auto p-6 space-y-6 text-xs text-slate-300">
          {/* 1. Progress and Level Bar */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-indigo-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-indigo-400 font-semibold block">
                  Current Explorer Rank
                </span>
                <span className="text-base font-extrabold text-white">
                  {userProgress.levelTitle} (Level {userProgress.level})
                </span>
              </div>
              <span className="font-mono text-cyan-300 font-bold text-sm">{userProgress.xp} Total XP</span>
            </div>

            {/* Achievements Grid */}
            <div className="pt-2 border-t border-white/5">
              <span className="text-[11px] font-bold text-slate-300 block mb-2 uppercase font-mono">
                Unlocked Achievements ({userProgress.unlockedAchievements.length} / {ACHIEVEMENTS.length})
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {ACHIEVEMENTS.map(ach => {
                  const unlocked = userProgress.unlockedAchievements.includes(ach.id);
                  return (
                    <div
                      key={ach.id}
                      className={`p-2.5 rounded-xl border text-xs space-y-0.5 transition-all ${
                        unlocked
                          ? 'bg-amber-950/30 border-amber-500/40 text-amber-200'
                          : 'bg-slate-900/30 border-white/5 text-slate-500 opacity-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white">{ach.title}</span>
                        {unlocked && <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />}
                      </div>
                      <p className="text-[10px] text-slate-400 leading-tight">{ach.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 2. Audio & Accessibility Controls */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-1.5">
              <Volume2 className="w-4 h-4" />
              <span>Audio & Accessibility Preferences</span>
            </h3>

            {/* Audio Toggle */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/60 border border-white/5">
              <div>
                <span className="font-bold text-white block">Cosmic Ambient Synthesizer</span>
                <p className="text-slate-400 text-[11px]">Procedural warm harmonic drone synthesized via Web Audio API.</p>
              </div>
              <button
                onClick={handleToggleSound}
                className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-colors ${
                  settings.soundEnabled
                    ? 'bg-cyan-500 text-slate-950'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {settings.soundEnabled ? 'Enabled' : 'Muted'}
              </button>
            </div>

            {/* Volume Slider */}
            {settings.soundEnabled && (
              <div className="p-3.5 rounded-xl bg-slate-900/40 border border-white/5 flex items-center gap-3">
                <span className="text-slate-400 font-mono text-[11px] w-14">Volume:</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={settings.soundVolume}
                  onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                />
                <span className="font-mono text-cyan-300 text-xs w-10 text-right">
                  {Math.round(settings.soundVolume * 100)}%
                </span>
              </div>
            )}

            {/* Reduced Motion Toggle */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/60 border border-white/5">
              <div>
                <span className="font-bold text-white block">Reduced Motion Mode</span>
                <p className="text-slate-400 text-[11px]">Limits heavy zoom animations and rapid particle flickers.</p>
              </div>
              <input
                type="checkbox"
                checked={settings.reducedMotion}
                onChange={(e) => onUpdateSettings({ ...settings, reducedMotion: e.target.checked })}
                className="w-4 h-4 rounded accent-cyan-400 cursor-pointer"
              />
            </div>
          </div>

          {/* 3. Bookmarks Directory */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
              <Bookmark className="w-4 h-4" />
              <span>Bookmarked Celestial Bodies</span>
            </h3>

            {bookmarkedPlanets.length === 0 && bookmarkedMoons.length === 0 ? (
              <p className="text-slate-500 italic">No bodies bookmarked yet. Click the bookmark icon in Planet or Moon Explorer!</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {bookmarkedPlanets.map(p => (
                  <button
                    key={p.id}
                    onClick={() => { onClose(); onSelectPlanet(p.id); }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-950/60 border border-cyan-500/30 text-cyan-200 hover:bg-cyan-900/50"
                  >
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.colors.base }} />
                    <span>{p.name}</span>
                  </button>
                ))}
                {bookmarkedMoons.map(m => (
                  <button
                    key={m.id}
                    onClick={() => { onClose(); onSelectMoon(m.id); }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-950/60 border border-indigo-500/30 text-indigo-200 hover:bg-indigo-900/50"
                  >
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: m.color }} />
                    <span>{m.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 4. Scientific References and Assumptions Documentation */}
          <div className="p-4 rounded-xl bg-slate-900/50 border border-white/10 space-y-2">
            <h4 className="font-bold text-white flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Scientific Sources & Reference Standards</span>
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              OrbitLab uses calibrated planetary parameters from official astronomical reference standards:
            </p>
            <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-400">
              <li><strong>NASA Planetary Fact Sheets:</strong> Mass, equatorial diameter, surface gravity, mean temperatures, and orbital semi-major axes (Dr. David R. Williams, NASA Goddard Space Flight Center).</li>
              <li><strong>IAU 2006 General Assembly (Resolution 5A):</strong> Dwarf planet classification criteria and official nomenclature definitions.</li>
              <li><strong>IAU Minor Planet Center (2024):</strong> Verified satellite counts (Jupiter: 95, Saturn: 146, Uranus: 28, Neptune: 16).</li>
              <li><strong>Hohmann Transfer Trajectory:</strong> Walter Hohmann, <em>Die Erreichbarkeit der Himmelskörper</em> (1925), idealized two-body coplanar approximation.</li>
              <li><strong>Kepler’s Laws of Planetary Motion:</strong> Johannes Kepler, <em>Astronomia Nova</em> (1609) &amp; <em>Harmonices Mundi</em> (1619).</li>
            </ul>
          </div>

          {/* 5. Reset Learning Data */}
          <div className="pt-2 flex justify-between items-center border-t border-white/5">
            <button
              onClick={() => {
                if (window.confirm('Reset your XP, achievements, and bookmarked celestial bodies?')) {
                  onResetProgress();
                }
              }}
              className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 p-2 rounded-lg hover:bg-rose-950/30 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Learning Progress</span>
            </button>

            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
