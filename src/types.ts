export type ViewMode = 
  | 'simulation'
  | 'planet-explorer'
  | 'moon-explorer'
  | 'orbit-simulator'
  | 'planet-comparison'
  | 'distance-calculator'
  | 'mission-planner'
  | 'space-quiz'
  | 'discoveries'
  | 'settings';

export type ScaleMode = 'overview' | 'scale-aware';

export interface PlanetData {
  id: string;
  name: string;
  latinName: string;
  type: 'Terrestrial' | 'Gas Giant' | 'Ice Giant' | 'Star' | 'Dwarf Planet';
  orderFromSun: number;
  diameterKm: number; // km
  massKg: string; // scientific notation string e.g. "5.972 × 10^24"
  massEarthRatio: number;
  gravityMps2: number; // m/s^2
  semiMajorAxisAU: number; // AU
  semiMajorAxisKm: number; // 10^6 km
  orbitalPeriodDays: number; // days
  orbitalPeriodYears: number; // years
  rotationPeriodHours: number; // hours (negative for retrograde)
  rotationNote?: string;
  avgTempC: number; // °C
  avgTempK: number; // K
  temperatureRange?: string;
  knownMoons: number;
  moonsSourceDate: string;
  atmosphere: string;
  atmosphereGases: { name: string; percentage: number }[];
  composition: string;
  distinctiveFeatures: string[];
  facts: string[];
  eccentricity: number;
  inclinationDeg: number;
  colors: {
    base: string;
    atmosphere: string;
    accent: string;
    trail: string;
  };
  hasRings?: boolean;
  ringInnerRadiusAU?: number;
  ringOuterRadiusAU?: number;
  ringColors?: string[];
  description: string;
}

export interface MoonData {
  id: string;
  name: string;
  parentPlanetId: string;
  parentPlanetName: string;
  diameterKm: number;
  orbitalPeriodDays: number;
  orbitalDistanceKm: number;
  composition: string;
  description: string;
  missions: string[];
  facts: string[];
  color: string;
}

export interface QuizQuestion {
  id: string;
  category: 'planets' | 'moons' | 'mechanics' | 'distances' | 'missions' | 'stars';
  difficulty: 'beginner' | 'intermediate' | 'astrophysicist';
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  sourceRef?: string;
}

export interface DiscoveryTopic {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  readTimeMin: number;
  summary: string;
  sections: {
    heading: string;
    body: string;
    keyPoints?: string[];
  }[];
  keyTerms: { term: string; definition: string }[];
  quickCheck: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export interface UserProgress {
  xp: number;
  level: number;
  levelTitle: string;
  completedQuizzesCount: number;
  quizHighScores: Record<string, number>;
  bookmarkedPlanetIds: string[];
  bookmarkedMoonIds: string[];
  completedDiscoveryIds: string[];
  unlockedAchievements: string[];
}

export interface HohmannTransferResult {
  origin: PlanetData;
  destination: PlanetData;
  r1AU: number;
  r2AU: number;
  transferSemiMajorAxisAU: number;
  transferSemiMajorAxisKm: number;
  travelTimeDays: number;
  travelTimeYears: number;
  deltaV1Kms: number; // departure burn in km/s
  deltaV2Kms: number; // arrival insertion burn in km/s
  totalDeltaVKms: number;
  phaseAngleDeg: number; // required alignment at launch
  synodicPeriodDays: number; // launch window frequency
  assumptions: string[];
}
