import React, { useState, useRef, useEffect } from 'react';
import { ViewMode, UserProgress } from '../types';
import {
  Orbit,
  Globe2,
  Compass,
  BarChart3,
  Rocket,
  HelpCircle,
  BookOpen,
  Volume2,
  VolumeX,
  Settings,
  RotateCcw,
  Sparkles,
  ArrowRightLeft,
  ChevronDown,
  Menu,
  X,
  FlaskConical,
  GraduationCap
} from 'lucide-react';

interface NavbarProps {
  currentView: ViewMode;
  onSelectView: (view: ViewMode) => void;
  userProgress: UserProgress;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenSettings: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onSelectView,
  userProgress,
  soundEnabled,
  onToggleSound,
  onOpenSettings,
}) => {
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);
  const [learnDropdownOpen, setLearnDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toolsRef = useRef<HTMLDivElement>(null);
  const learnRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (toolsRef.current && !toolsRef.current.contains(e.target as Node)) {
        setToolsDropdownOpen(false);
      }
      if (learnRef.current && !learnRef.current.contains(e.target as Node)) {
        setLearnDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const allNavItems: { id: ViewMode; label: string; shortLabel: string; icon: React.ReactNode; category: 'core' | 'lab' | 'learn' }[] = [
    { id: 'simulation', label: 'Solar System', shortLabel: 'Solar System', icon: <Orbit className="w-3.5 h-3.5" />, category: 'core' },
    { id: 'planet-explorer', label: 'Planets', shortLabel: 'Planets', icon: <Globe2 className="w-3.5 h-3.5" />, category: 'core' },
    { id: 'moon-explorer', label: 'Moons', shortLabel: 'Moons', icon: <Compass className="w-3.5 h-3.5" />, category: 'core' },
    { id: 'orbit-simulator', label: 'Orbit Simulator', shortLabel: 'Orbit Lab', icon: <RotateCcw className="w-3.5 h-3.5" />, category: 'lab' },
    { id: 'planet-comparison', label: 'Planet Comparison', shortLabel: 'Compare', icon: <BarChart3 className="w-3.5 h-3.5" />, category: 'lab' },
    { id: 'distance-calculator', label: 'Distance Calculator', shortLabel: 'Distances', icon: <ArrowRightLeft className="w-3.5 h-3.5" />, category: 'lab' },
    { id: 'mission-planner', label: 'Mission Planner', shortLabel: 'Missions', icon: <Rocket className="w-3.5 h-3.5" />, category: 'lab' },
    { id: 'space-quiz', label: 'Space Quiz', shortLabel: 'Quiz', icon: <HelpCircle className="w-3.5 h-3.5" />, category: 'learn' },
    { id: 'discoveries', label: 'Discoveries', shortLabel: 'Learn', icon: <BookOpen className="w-3.5 h-3.5" />, category: 'learn' },
  ];

  const labItems = allNavItems.filter(i => i.category === 'lab');
  const learnItems = allNavItems.filter(i => i.category === 'learn');
  const isLabActive = labItems.some(i => i.id === currentView);
  const isLearnActive = learnItems.some(i => i.id === currentView);

  const handleNavClick = (id: ViewMode) => {
    onSelectView(id);
    setToolsDropdownOpen(false);
    setLearnDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full h-14 border-b border-cyan-500/15 bg-[#050818]/95 backdrop-blur-md px-3 sm:px-4 lg:px-6 transition-all select-none">
      <div className="max-w-7xl mx-auto h-full flex items-center justify-between gap-2">
        {/* Left: Logo & Brand */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={() => handleNavClick('simulation')}
            className="flex items-center gap-2 group text-left focus:outline-none focus:ring-2 focus:ring-cyan-400 rounded-lg py-1 px-1.5"
            aria-label="OrbitLab Home"
          >
            <div className="relative flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-indigo-600 shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <Orbit className="w-4 h-4 text-white animate-spin-slow" />
              <div className="absolute -inset-0.5 rounded-lg bg-gradient-to-r from-cyan-400 to-indigo-500 opacity-20 blur group-hover:opacity-60 transition duration-300" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold tracking-tight text-white text-base sm:text-lg font-mono">
                ORBIT<span className="text-cyan-400">LAB</span>
              </span>
              <span className="hidden sm:inline-block text-[9px] font-mono font-bold uppercase px-1 py-0.2 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
                v1.0
              </span>
            </div>
          </button>
        </div>

        {/* Center: Uncompressed Desktop Navigation */}
        {/* Full Expanded Row for Large Screens (>= 1240px) */}
        <nav className="hidden 2xl:flex items-center gap-0.5 bg-slate-900/70 p-1 rounded-xl border border-white/5" aria-label="Main Navigation">
          {allNavItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-400/40 shadow-sm shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                {item.icon}
                <span>{item.shortLabel}</span>
              </button>
            );
          })}
        </nav>

        {/* Smart Compact Hub Navigation for Mid Screens (768px to 1239px) */}
        <nav className="hidden md:flex 2xl:hidden items-center gap-1 bg-slate-900/70 p-1 rounded-xl border border-white/5">
          <button
            onClick={() => handleNavClick('simulation')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              currentView === 'simulation'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-sm shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <Orbit className="w-3.5 h-3.5" />
            <span>Solar System</span>
          </button>

          <button
            onClick={() => handleNavClick('planet-explorer')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              currentView === 'planet-explorer'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-sm shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <Globe2 className="w-3.5 h-3.5" />
            <span>Planets</span>
          </button>

          <button
            onClick={() => handleNavClick('moon-explorer')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              currentView === 'moon-explorer'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-sm shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Moons</span>
          </button>

          {/* Tools Dropdown */}
          <div ref={toolsRef} className="relative">
            <button
              onClick={() => { setToolsDropdownOpen(!toolsDropdownOpen); setLearnDropdownOpen(false); }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                isLabActive
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <FlaskConical className="w-3.5 h-3.5" />
              <span>Lab Tools</span>
              <ChevronDown className="w-3 h-3 ml-0.5" />
            </button>

            {toolsDropdownOpen && (
              <div className="absolute top-full left-0 mt-1.5 w-48 bg-[#0a0f24] border border-cyan-500/30 rounded-xl p-1.5 shadow-2xl z-50 animate-fade-in space-y-0.5">
                {labItems.map(item => (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-left transition-colors ${
                      currentView === item.id
                        ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                        : 'text-slate-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Learn Dropdown */}
          <div ref={learnRef} className="relative">
            <button
              onClick={() => { setLearnDropdownOpen(!learnDropdownOpen); setToolsDropdownOpen(false); }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                isLearnActive
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Learn</span>
              <ChevronDown className="w-3 h-3 ml-0.5" />
            </button>

            {learnDropdownOpen && (
              <div className="absolute top-full right-0 mt-1.5 w-44 bg-[#0a0f24] border border-cyan-500/30 rounded-xl p-1.5 shadow-2xl z-50 animate-fade-in space-y-0.5">
                {learnItems.map(item => (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-left transition-colors ${
                      currentView === item.id
                        ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                        : 'text-slate-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Mobile View Title Button (< 768px) */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-white/10 text-xs text-cyan-300 font-semibold"
          >
            <Menu className="w-3.5 h-3.5" />
            <span className="capitalize">{allNavItems.find(i => i.id === currentView)?.label || 'Menu'}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>
        </div>

        {/* Right Tools: XP badge, Audio, Settings */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* XP Badge */}
          <div
            onClick={onOpenSettings}
            className="cursor-pointer flex items-center gap-1.5 px-2 py-1 rounded-lg bg-indigo-950/60 border border-indigo-500/30 text-indigo-200 hover:bg-indigo-900/40 transition-colors"
            title={`${userProgress.levelTitle} - Click to see achievements`}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter') onOpenSettings(); }}
            aria-label={`Rank: ${userProgress.levelTitle}, ${userProgress.xp} XP`}
          >
            <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
            <div className="text-left leading-none font-mono text-[11px]">
              <span className="text-white font-semibold">Lv.{userProgress.level}</span>
              <span className="text-slate-400 ml-1 hidden sm:inline">{userProgress.xp} XP</span>
            </div>
          </div>

          {/* Audio toggle button */}
          <button
            onClick={onToggleSound}
            className={`p-1.5 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-cyan-400 ${
              soundEnabled
                ? 'bg-cyan-950/70 text-cyan-300 border-cyan-500/40 shadow-sm shadow-cyan-500/20'
                : 'bg-slate-900/60 text-slate-400 border-white/5 hover:text-slate-200 hover:bg-white/5'
            }`}
            title={soundEnabled ? 'Mute ambient cosmic audio' : 'Play ambient cosmic soundscape'}
            aria-label={soundEnabled ? 'Mute ambient sound' : 'Enable ambient sound'}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-cyan-400 animate-pulse" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>

          {/* Quick Return to Simulation if elsewhere */}
          {currentView !== 'simulation' && (
            <button
              onClick={() => handleNavClick('simulation')}
              className="hidden lg:flex items-center gap-1 px-2 py-1 rounded-lg bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/40 text-xs font-medium transition-all"
              aria-label="Return to Solar System Simulation"
            >
              <Orbit className="w-3 h-3" />
              <span>Sim</span>
            </button>
          )}

          {/* Settings modal trigger */}
          <button
            onClick={onOpenSettings}
            className="p-1.5 rounded-lg bg-slate-900/60 text-slate-400 border border-white/5 hover:text-slate-200 hover:bg-white/5 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400"
            title="Settings & References"
            aria-label="Settings and scientific references"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Mobile Drawer Dropdown (< 768px) */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-14 left-0 right-0 bg-[#070b1e]/98 backdrop-blur-2xl border-b border-cyan-500/25 p-3 shadow-2xl z-50 animate-fade-in max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-1.5">
            {allNavItems.map(item => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2 p-2.5 rounded-xl border text-left text-xs transition-colors ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/50 font-bold'
                      : 'bg-slate-900/60 text-slate-300 border-white/5 hover:bg-slate-800'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
