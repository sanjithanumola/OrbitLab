import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ViewMode, ScaleMode, PlanetData, UserProgress } from './types';
import { Navbar } from './components/Navbar';
import { SolarSystemCanvas } from './components/SolarSystemCanvas';
import { SimulationControls } from './components/SimulationControls';
import { PlanetExplorer } from './components/PlanetExplorer';
import { MoonExplorer } from './components/MoonExplorer';
import { OrbitSimulator } from './components/OrbitSimulator';
import { PlanetComparison } from './components/PlanetComparison';
import { DistanceCalculator } from './components/DistanceCalculator';
import { MissionPlanner } from './components/MissionPlanner';
import { SpaceQuiz } from './components/SpaceQuiz';
import { Discoveries } from './components/Discoveries';
import { SettingsModal } from './components/SettingsModal';
import {
  loadUserProgress,
  saveUserProgress,
  addXpAndAchievement,
  loadSettings,
  saveSettings,
  AppSettings,
  DEFAULT_SETTINGS
} from './utils/storage';
import { cosmicAudio } from './utils/audio';

export default function App() {
  // Navigation & View State
  const [currentView, setCurrentView] = useState<ViewMode>('simulation');
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  // User Settings & Persistence
  const [settings, setSettings] = useState<AppSettings>(() => loadSettings());
  const [userProgress, setUserProgress] = useState<UserProgress>(() => loadUserProgress());

  // Simulation State
  const [simulationTimeDays, setSimulationTimeDays] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(2.0); // Earth days per real second
  const [scaleMode, setScaleMode] = useState<ScaleMode>('overview');
  const [showOrbits, setShowOrbits] = useState<boolean>(settings.showOrbits);
  const [showLabels, setShowLabels] = useState<boolean>(settings.showLabels);
  const [showAsteroidBelt, setShowAsteroidBelt] = useState<boolean>(settings.showAsteroidBelt);

  // Planet Selection and Follow Camera
  const [selectedPlanetId, setSelectedPlanetId] = useState<string | null>('earth');
  const [followSelected, setFollowSelected] = useState<boolean>(false);

  // Targets for cross-tab jumps
  const [explorerPlanetId, setExplorerPlanetId] = useState<string>('earth');
  const [comparisonPlanet, setComparisonPlanet] = useState<PlanetData | undefined>(undefined);
  const [moonPlanetFilter, setMoonPlanetFilter] = useState<string>('all');

  // Elapsed real-time loop for smooth date progression (immune to tab throttling jumps)
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    const loop = (now: number) => {
      const dtSeconds = Math.min(0.1, (now - lastTime) / 1000); // Clamp dt to prevent tab throttling explosion
      lastTime = now;

      if (isPlaying) {
        setSimulationTimeDays(prev => prev + dtSeconds * speedMultiplier * 10);
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, speedMultiplier]);

  // Keyboard navigation & accessibility shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (['INPUT', 'SELECT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        setIsPlaying(prev => !prev);
      } else if (e.key === '[' || e.key === '{') {
        setSpeedMultiplier(prev => Math.max(0.2, prev * 0.7));
      } else if (e.key === ']' || e.key === '}') {
        setSpeedMultiplier(prev => Math.min(80, prev * 1.4));
      } else if (e.key === 'Escape') {
        if (isSettingsOpen) {
          setIsSettingsOpen(false);
        } else if (selectedPlanetId) {
          setSelectedPlanetId(null);
          setFollowSelected(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSettingsOpen, selectedPlanetId]);

  // Audio Toggle
  const handleToggleSound = useCallback(() => {
    const nextState = !settings.soundEnabled;
    if (nextState) {
      cosmicAudio.start();
    } else {
      cosmicAudio.stop();
    }
    const updated = { ...settings, soundEnabled: nextState };
    setSettings(updated);
    saveSettings(updated);
  }, [settings]);

  // Update Settings
  const handleUpdateSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  // Add XP and Achievements
  const handleAddXp = useCallback((xp: number, achievementId?: string) => {
    setUserProgress(prev => {
      const { updated } = addXpAndAchievement(prev, xp, achievementId);
      return updated;
    });
  }, []);

  const handleUnlockAchievement = useCallback((id: string) => {
    setUserProgress(prev => {
      const { updated } = addXpAndAchievement(prev, 40, id);
      return updated;
    });
  }, []);

  // Bookmark Toggles
  const handleTogglePlanetBookmark = (id: string) => {
    const isBookmarked = userProgress.bookmarkedPlanetIds.includes(id);
    const newIds = isBookmarked
      ? userProgress.bookmarkedPlanetIds.filter(pId => pId !== id)
      : [...userProgress.bookmarkedPlanetIds, id];

    const updated = { ...userProgress, bookmarkedPlanetIds: newIds };
    setUserProgress(updated);
    saveUserProgress(updated);
  };

  const handleToggleMoonBookmark = (id: string) => {
    const isBookmarked = userProgress.bookmarkedMoonIds.includes(id);
    const newIds = isBookmarked
      ? userProgress.bookmarkedMoonIds.filter(mId => mId !== id)
      : [...userProgress.bookmarkedMoonIds, id];

    const updated = { ...userProgress, bookmarkedMoonIds: newIds };
    setUserProgress(updated);
    saveUserProgress(updated);
  };

  const handleCompleteTopic = (id: string) => {
    if (!userProgress.completedDiscoveryIds.includes(id)) {
      const updated = {
        ...userProgress,
        completedDiscoveryIds: [...userProgress.completedDiscoveryIds, id],
      };
      setUserProgress(updated);
      saveUserProgress(updated);
    }
  };

  const handleSaveQuizHighScore = (cat: string, score: number) => {
    const currentHigh = userProgress.quizHighScores[cat] || 0;
    if (score > currentHigh) {
      const updated = {
        ...userProgress,
        completedQuizzesCount: userProgress.completedQuizzesCount + 1,
        quizHighScores: {
          ...userProgress.quizHighScores,
          [cat]: score,
        },
      };
      setUserProgress(updated);
      saveUserProgress(updated);
    }
  };

  const handleResetProgress = () => {
    localStorage.removeItem('orbitlab_user_progress_v1');
    setUserProgress(loadUserProgress());
    setIsSettingsOpen(false);
  };

  // Cross-Navigation Actions
  const handleOpenExplorer = (planet: PlanetData) => {
    setExplorerPlanetId(planet.id);
    setCurrentView('planet-explorer');
    handleAddXp(10, 'first_flight');
  };

  const handleFollowInSim = (planet: PlanetData) => {
    setSelectedPlanetId(planet.id);
    setFollowSelected(true);
    setCurrentView('simulation');
  };

  const handleExploreMoons = (planetId: string) => {
    setMoonPlanetFilter(planetId);
    setCurrentView('moon-explorer');
  };

  const handleComparePlanet = (planet: PlanetData) => {
    setComparisonPlanet(planet);
    setCurrentView('planet-comparison');
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#050714] text-slate-100 antialiased selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* 1. Persistent Top Navigation Bar */}
      <Navbar
        currentView={currentView}
        onSelectView={setCurrentView}
        userProgress={userProgress}
        soundEnabled={settings.soundEnabled}
        onToggleSound={handleToggleSound}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* 2. Main Viewport Container */}
      <main className="flex-1 flex flex-col relative overflow-hidden" role="main">
        {currentView === 'simulation' && (
          <div className="flex-1 flex flex-col relative w-full h-[calc(100vh-3.5rem)] min-h-[540px]">
            {/* Interactive Solar System Canvas */}
            <div className="flex-1 relative w-full h-full">
              <SolarSystemCanvas
                simulationTimeDays={simulationTimeDays}
                scaleMode={scaleMode}
                showOrbits={showOrbits}
                showLabels={showLabels}
                showAsteroidBelt={showAsteroidBelt}
                selectedPlanetId={selectedPlanetId}
                onSelectPlanet={(planet) => {
                  setSelectedPlanetId(planet ? planet.id : null);
                  if (!planet) setFollowSelected(false);
                }}
                onOpenExplorer={handleOpenExplorer}
                onComparePlanet={handleComparePlanet}
                followSelected={followSelected}
                onToggleFollow={setFollowSelected}
              />
            </div>

            {/* Bottom HUD Simulation Controls */}
            <SimulationControls
              isPlaying={isPlaying}
              onTogglePlay={() => setIsPlaying(prev => !prev)}
              speedMultiplier={speedMultiplier}
              onChangeSpeed={setSpeedMultiplier}
              simulationTimeDays={simulationTimeDays}
              onStepTime={(days) => setSimulationTimeDays(prev => prev + days)}
              onResetTime={() => setSimulationTimeDays(0)}
              scaleMode={scaleMode}
              onToggleScaleMode={setScaleMode}
              showOrbits={showOrbits}
              onToggleOrbits={() => setShowOrbits(prev => !prev)}
              showLabels={showLabels}
              onToggleLabels={() => setShowLabels(prev => !prev)}
              showAsteroidBelt={showAsteroidBelt}
              onToggleAsteroidBelt={() => setShowAsteroidBelt(prev => !prev)}
            />
          </div>
        )}

        {currentView === 'planet-explorer' && (
          <PlanetExplorer
            initialPlanetId={explorerPlanetId}
            onFollowInSim={handleFollowInSim}
            onExploreMoons={handleExploreMoons}
            onComparePlanet={handleComparePlanet}
            bookmarkedIds={userProgress.bookmarkedPlanetIds}
            onToggleBookmark={handleTogglePlanetBookmark}
          />
        )}

        {currentView === 'moon-explorer' && (
          <MoonExplorer
            initialPlanetFilter={moonPlanetFilter}
            bookmarkedMoonIds={userProgress.bookmarkedMoonIds}
            onToggleBookmark={handleToggleMoonBookmark}
          />
        )}

        {currentView === 'orbit-simulator' && (
          <OrbitSimulator onUnlockAchievement={handleUnlockAchievement} />
        )}

        {currentView === 'planet-comparison' && (
          <PlanetComparison initialPlanet={comparisonPlanet} />
        )}

        {currentView === 'distance-calculator' && (
          <DistanceCalculator simulationTimeDays={simulationTimeDays} />
        )}

        {currentView === 'mission-planner' && (
          <MissionPlanner onUnlockAchievement={handleUnlockAchievement} />
        )}

        {currentView === 'space-quiz' && (
          <SpaceQuiz
            onAddXp={handleAddXp}
            highScore={userProgress.quizHighScores['all'] || 0}
            onSaveHighScore={handleSaveQuizHighScore}
          />
        )}

        {currentView === 'discoveries' && (
          <Discoveries
            completedDiscoveryIds={userProgress.completedDiscoveryIds}
            onCompleteTopic={handleCompleteTopic}
            onAddXp={handleAddXp}
          />
        )}
      </main>

      {/* 3. Settings & Scientific Sources Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        userProgress={userProgress}
        onResetProgress={handleResetProgress}
        onSelectPlanet={(id) => {
          setExplorerPlanetId(id);
          setCurrentView('planet-explorer');
        }}
        onSelectMoon={(id) => {
          setCurrentView('moon-explorer');
        }}
      />
    </div>
  );
}
