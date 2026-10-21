import { UserProgress } from '../types';

const STORAGE_KEY = 'orbitlab_user_progress_v1';
const SETTINGS_KEY = 'orbitlab_settings_v1';

export interface AppSettings {
  reducedMotion: boolean;
  showOrbits: boolean;
  showLabels: boolean;
  showAsteroidBelt: boolean;
  soundVolume: number;
  soundEnabled: boolean;
}

export const DEFAULT_SETTINGS: AppSettings = {
  reducedMotion: false,
  showOrbits: true,
  showLabels: true,
  showAsteroidBelt: true,
  soundVolume: 0.25,
  soundEnabled: false,
};

export const LEVEL_TIERS = [
  { minXp: 0, level: 1, title: 'Stargazer' },
  { minXp: 100, level: 2, title: 'Space Cadet' },
  { minXp: 250, level: 3, title: 'Solar Navigator' },
  { minXp: 500, level: 4, title: 'Planetary Astronomer' },
  { minXp: 850, level: 5, title: 'Senior Astrophysicist' },
  { minXp: 1400, level: 6, title: 'Orbital Commander' },
];

export const ACHIEVEMENTS = [
  { id: 'first_flight', title: 'First Contact', description: 'Inspected a planet in the explorer', icon: 'telescope' },
  { id: 'moon_walker', title: 'Moon Walker', description: 'Explored 3 or more natural satellites', icon: 'moon' },
  { id: 'kepler_disciple', title: 'Kepler’s Disciple', description: 'Simulated an eccentric orbit in the laboratory', icon: 'orbit' },
  { id: 'mission_commander', title: 'Interplanetary Pioneer', description: 'Planned a Hohmann transfer trajectory', icon: 'rocket' },
  { id: 'quiz_ace', title: 'Cosmic Scholar', description: 'Scored 100% on a space quiz challenge', icon: 'award' },
  { id: 'curious_mind', title: 'Knowledge Seeker', description: 'Completed a deep astronomy discovery module', icon: 'book' }
];

export function calculateLevel(xp: number): { level: number; title: string; nextLevelXp: number; currentTierProgress: number } {
  let currentTier = LEVEL_TIERS[0];
  let nextTier = LEVEL_TIERS[1];

  for (let i = 0; i < LEVEL_TIERS.length; i++) {
    if (xp >= LEVEL_TIERS[i].minXp) {
      currentTier = LEVEL_TIERS[i];
      nextTier = LEVEL_TIERS[i + 1] || { minXp: currentTier.minXp + 1000, level: currentTier.level + 1, title: 'Cosmic Legend' };
    }
  }

  const range = nextTier.minXp - currentTier.minXp;
  const progressInTier = Math.min(1, Math.max(0, (xp - currentTier.minXp) / range));

  return {
    level: currentTier.level,
    title: currentTier.title,
    nextLevelXp: nextTier.minXp,
    currentTierProgress: progressInTier
  };
}

export function loadUserProgress(): UserProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      const levelInfo = calculateLevel(data.xp || 0);
      return {
        xp: data.xp || 0,
        level: levelInfo.level,
        levelTitle: levelInfo.title,
        completedQuizzesCount: data.completedQuizzesCount || 0,
        quizHighScores: data.quizHighScores || {},
        bookmarkedPlanetIds: data.bookmarkedPlanetIds || [],
        bookmarkedMoonIds: data.bookmarkedMoonIds || [],
        completedDiscoveryIds: data.completedDiscoveryIds || [],
        unlockedAchievements: data.unlockedAchievements || []
      };
    }
  } catch {
    // fallback
  }

  const initialLevel = calculateLevel(0);
  return {
    xp: 0,
    level: initialLevel.level,
    levelTitle: initialLevel.title,
    completedQuizzesCount: 0,
    quizHighScores: {},
    bookmarkedPlanetIds: ['earth', 'mars'],
    bookmarkedMoonIds: ['moon', 'europa'],
    completedDiscoveryIds: [],
    unlockedAchievements: []
  };
}

export function saveUserProgress(progress: UserProgress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // Ignore storage quota errors
  }
}

export function addXpAndAchievement(
  current: UserProgress,
  addedXp: number,
  achievementId?: string
): { updated: UserProgress; newlyUnlocked: string[] } {
  const achievements = [...current.unlockedAchievements];
  const newlyUnlocked: string[] = [];

  // If this was an achievement unlock and it's already unlocked, do nothing
  if (achievementId && achievements.includes(achievementId)) {
    return { updated: current, newlyUnlocked: [] };
  }

  if (achievementId && !achievements.includes(achievementId)) {
    achievements.push(achievementId);
    newlyUnlocked.push(achievementId);
  }

  const newXp = current.xp + addedXp;
  const levelInfo = calculateLevel(newXp);

  const updated: UserProgress = {
    ...current,
    xp: newXp,
    level: levelInfo.level,
    levelTitle: levelInfo.title,
    unlockedAchievements: achievements
  };

  saveUserProgress(updated);
  return { updated, newlyUnlocked };
}

export function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
    }
  } catch {
    // fallback
  }
  return DEFAULT_SETTINGS;
}

export function saveSettings(settings: AppSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    // ignore
  }
}
