import { PlanetData } from '../types';

export const SUN_DATA: PlanetData = {
  id: 'sun',
  name: 'The Sun',
  latinName: 'Sol',
  type: 'Star',
  orderFromSun: 0,
  diameterKm: 1392700,
  massKg: '1.989 × 10^30',
  massEarthRatio: 333000,
  gravityMps2: 274.0,
  semiMajorAxisAU: 0,
  semiMajorAxisKm: 0,
  orbitalPeriodDays: 0,
  orbitalPeriodYears: 0,
  rotationPeriodHours: 609.12, // ~25.38 days at equator (differential rotation)
  avgTempC: 5505, // Photosphere surface temp
  avgTempK: 5778,
  temperatureRange: '5,505 °C (surface) to ~15,000,000 °C (core)',
  knownMoons: 0,
  moonsSourceDate: 'N/A',
  atmosphere: 'Hydrogen and Helium plasma (Solar Corona and Photosphere)',
  atmosphereGases: [
    { name: 'Hydrogen', percentage: 73.46 },
    { name: 'Helium', percentage: 24.85 },
    { name: 'Oxygen', percentage: 0.77 },
    { name: 'Carbon', percentage: 0.29 },
    { name: 'Iron', percentage: 0.16 },
  ],
  composition: 'Gaseous plasma powered by thermonuclear proton-proton chain fusion converting ~600 million tons of hydrogen into helium every second.',
  distinctiveFeatures: [
    'Contains 99.86% of all mass in the Solar System',
    'Classified as a G-type main-sequence star (Yellow Dwarf, G2V)',
    'Photosphere emits visible sunlight; corona extends millions of kilometers into space',
    '11-year solar magnetic cycle generates sunspots, solar flares, and coronal mass ejections'
  ],
  facts: [
    'Light generated in the solar core takes over 100,000 years to reach the surface due to continuous radiative scattering.',
    'About 1.3 million Earths could fit inside the volume of the Sun.',
    'The solar wind carves out the heliosphere, shielding our planetary system from harsh interstellar galactic cosmic rays.'
  ],
  eccentricity: 0,
  inclinationDeg: 0,
  colors: {
    base: '#f59e0b',
    atmosphere: '#fbbf24',
    accent: '#ef4444',
    trail: '#f59e0b'
  },
  description: 'The central star of our planetary system, providing the gravitational anchor and radiant energy that sustains the entire Solar System.'
};

export const PLANETS_DATA: PlanetData[] = [
  {
    id: 'mercury',
    name: 'Mercury',
    latinName: 'Mercurius',
    type: 'Terrestrial',
    orderFromSun: 1,
    diameterKm: 4879,
    massKg: '3.301 × 10^23',
    massEarthRatio: 0.0553,
    gravityMps2: 3.7,
    semiMajorAxisAU: 0.387,
    semiMajorAxisKm: 57.9,
    orbitalPeriodDays: 87.97,
    orbitalPeriodYears: 0.2408,
    rotationPeriodHours: 1407.6, // 58.65 Earth days
    rotationNote: '3:2 spin-orbit resonance: rotates 3 times for every 2 orbits around the Sun.',
    avgTempC: 167,
    avgTempK: 440,
    temperatureRange: '-180 °C (polar craters/night) to 430 °C (daytime equator)',
    knownMoons: 0,
    moonsSourceDate: 'IAU 2024',
    atmosphere: 'Extremely tenuous exosphere (surface boundary layer)',
    atmosphereGases: [
      { name: 'Oxygen', percentage: 42.0 },
      { name: 'Sodium', percentage: 29.0 },
      { name: 'Hydrogen', percentage: 22.0 },
      { name: 'Helium', percentage: 6.0 },
      { name: 'Potassium', percentage: 0.5 },
    ],
    composition: 'Disproportionately large metallic iron core (~85% of planetary radius) surrounded by a thin silicate mantle and crust.',
    distinctiveFeatures: [
      'Smallest planet and closest to the Sun',
      'Extreme temperature swings between day and night (over 600 °C difference)',
      'Caloris Basin impact crater measures ~1,550 km in diameter',
      'Water ice exists in permanently shadowed craters at its north and south poles'
    ],
    facts: [
      'Mercury possesses the highest orbital eccentricity (0.2056) of any major planet in the Solar System.',
      'A solar day on Mercury (sunrise to sunrise) lasts 176 Earth days, twice as long as its 88-day year.',
      'Messenger (2011–2015) was the first spacecraft to orbit Mercury, mapping its heavily cratered surface and global magnetic dipole.'
    ],
    eccentricity: 0.2056,
    inclinationDeg: 7.00,
    colors: {
      base: '#9ca3af',
      atmosphere: '#cbd5e1',
      accent: '#e2e8f0',
      trail: '#64748b'
    },
    description: 'A cratered, sun-scorched world with an enormous metallic heart and virtually no atmosphere to retain heat.'
  },
  {
    id: 'venus',
    name: 'Venus',
    latinName: 'Venus',
    type: 'Terrestrial',
    orderFromSun: 2,
    diameterKm: 12104,
    massKg: '4.867 × 10^24',
    massEarthRatio: 0.815,
    gravityMps2: 8.87,
    semiMajorAxisAU: 0.723,
    semiMajorAxisKm: 108.2,
    orbitalPeriodDays: 224.7,
    orbitalPeriodYears: 0.6152,
    rotationPeriodHours: -5832.5, // 243 Earth days retrograde
    rotationNote: 'Retrograde rotation: spins clockwise on its axis, opposite to most planets.',
    avgTempC: 464,
    avgTempK: 737,
    temperatureRange: 'Uniform ~464 °C across both daytime and nighttime hemispheres',
    knownMoons: 0,
    moonsSourceDate: 'IAU 2024',
    atmosphere: 'Dense runaway greenhouse atmosphere, surface pressure ~92 bar (~92 times Earth sea level)',
    atmosphereGases: [
      { name: 'Carbon Dioxide', percentage: 96.5 },
      { name: 'Nitrogen', percentage: 3.5 },
      { name: 'Sulfur Dioxide', percentage: 0.015 },
      { name: 'Argon', percentage: 0.007 },
    ],
    composition: 'Silicate rocky mantle and crust enveloping a central iron-nickel core, structurally similar to Earth.',
    distinctiveFeatures: [
      'Hottest planet in the Solar System despite being second from the Sun',
      'Thick clouds of concentrated sulfuric acid completely obscure the surface in visible light',
      'Surface pressure is equivalent to being 900 meters deep in Earth ocean',
      'Active volcanic regions such as Maat Mons and Maxwell Montes'
    ],
    facts: [
      'Venus rotates so slowly that one rotation takes 243 Earth days, longer than its 225-day orbital year.',
      'Because of its retrograde rotation, the Sun rises in the west and sets in the east on Venus.',
      'Soviet Venera landers survived only 1 to 2 hours on the surface before succumbing to the crushing pressure and oven-like heat.'
    ],
    eccentricity: 0.0067,
    inclinationDeg: 3.39,
    colors: {
      base: '#eab308',
      atmosphere: '#fde047',
      accent: '#ca8a04',
      trail: '#eab308'
    },
    description: 'Earth’s twin in size and mass, transformed by an extreme runaway greenhouse effect into a hellish volcanic landscape.'
  },
  {
    id: 'earth',
    name: 'Earth',
    latinName: 'Terra',
    type: 'Terrestrial',
    orderFromSun: 3,
    diameterKm: 12742,
    massKg: '5.972 × 10^24',
    massEarthRatio: 1.0,
    gravityMps2: 9.807,
    semiMajorAxisAU: 1.0,
    semiMajorAxisKm: 149.6,
    orbitalPeriodDays: 365.256,
    orbitalPeriodYears: 1.0,
    rotationPeriodHours: 23.934,
    avgTempC: 15,
    avgTempK: 288,
    temperatureRange: '-89.2 °C (Antarctica) to 56.7 °C (Death Valley)',
    knownMoons: 1,
    moonsSourceDate: 'IAU 2024',
    atmosphere: 'Nitrogen-oxygen atmosphere shielded by a dynamic geomagnetic field',
    atmosphereGases: [
      { name: 'Nitrogen', percentage: 78.08 },
      { name: 'Oxygen', percentage: 20.95 },
      { name: 'Argon', percentage: 0.93 },
      { name: 'Carbon Dioxide', percentage: 0.04 },
      { name: 'Water Vapor', percentage: 1.0 }, // variable average
    ],
    composition: 'Active tectonic lithosphere, convective silicate mantle, liquid iron outer core, and solid iron-nickel inner core.',
    distinctiveFeatures: [
      'The only confirmed world harboring biological life and liquid surface oceans',
      'Active plate tectonics continuously recycle carbon and minerals',
      'Powerful magnetosphere generated by the geodynamo deflects cosmic radiation',
      'Liquid surface water covers approximately 71% of the planetary surface'
    ],
    facts: [
      'The Moon is unusually large relative to Earth (1/4 planetary diameter), stabilizing our 23.4° axial tilt and climate.',
      'Earth is the densest planet in the Solar System at 5.515 g/cm³.',
      'The definition of 1 Astronomical Unit (1 AU = 149,597,870.7 km) is anchored to the mean Earth-Sun orbital distance.'
    ],
    eccentricity: 0.0167,
    inclinationDeg: 0.00,
    colors: {
      base: '#2563eb',
      atmosphere: '#60a5fa',
      accent: '#22c55e',
      trail: '#3b82f6'
    },
    description: 'The blue marble: our home oasis of liquid oceans, breathable atmosphere, and vibrant biodiversity.'
  },
  {
    id: 'mars',
    name: 'Mars',
    latinName: 'Mars',
    type: 'Terrestrial',
    orderFromSun: 4,
    diameterKm: 6779,
    massKg: '6.417 × 10^23',
    massEarthRatio: 0.107,
    gravityMps2: 3.72,
    semiMajorAxisAU: 1.524,
    semiMajorAxisKm: 227.9,
    orbitalPeriodDays: 686.98,
    orbitalPeriodYears: 1.8808,
    rotationPeriodHours: 24.623, // 1 sol = 24h 39m 35s
    avgTempC: -63,
    avgTempK: 210,
    temperatureRange: '-125 °C (polar winter) to 20 °C (equatorial summer day)',
    knownMoons: 2,
    moonsSourceDate: 'IAU 2024',
    atmosphere: 'Thin carbon dioxide atmosphere with surface pressure ~6.1 mbar (<1% of Earth)',
    atmosphereGases: [
      { name: 'Carbon Dioxide', percentage: 95.32 },
      { name: 'Nitrogen', percentage: 2.6 },
      { name: 'Argon', percentage: 1.9 },
      { name: 'Oxygen', percentage: 0.13 },
      { name: 'Carbon Monoxide', percentage: 0.08 },
    ],
    composition: 'Iron oxide rich regolith covering a basaltic crust, silicate mantle, and sulfur-rich iron core.',
    distinctiveFeatures: [
      'Olympus Mons: largest volcano in the Solar System, towering 21.9 km high (nearly 2.5x Mt. Everest)',
      'Valles Marineris: colossal canyon system stretching over 4,000 km long and up to 7 km deep',
      'Distinct polar ice caps made of water ice and seasonal frozen carbon dioxide (dry ice)',
      'Extensive dried riverbeds, deltas, and mineral deposits proving an ancient warm, wet epoch'
    ],
    facts: [
      'Mars appears red because iron in its surface dust has oxidized (rusted) over billions of years.',
      'A Martian day is called a "sol" and lasts 24 hours, 39 minutes, and 35 seconds.',
      'Active robotic rovers like Curiosity and Perseverance are currently seeking biosignatures in ancient lakebeds.'
    ],
    eccentricity: 0.0934,
    inclinationDeg: 1.85,
    colors: {
      base: '#dc2626',
      atmosphere: '#f87171',
      accent: '#ea580c',
      trail: '#ef4444'
    },
    description: 'The Red Planet: a cold, desert world bearing monumental extinct volcanoes and preserved ancient river valleys.'
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    latinName: 'Iuppiter',
    type: 'Gas Giant',
    orderFromSun: 5,
    diameterKm: 139820,
    massKg: '1.898 × 10^27',
    massEarthRatio: 317.8,
    gravityMps2: 24.79,
    semiMajorAxisAU: 5.204,
    semiMajorAxisKm: 778.6,
    orbitalPeriodDays: 4332.59,
    orbitalPeriodYears: 11.862,
    rotationPeriodHours: 9.925,
    avgTempC: -110,
    avgTempK: 163,
    temperatureRange: '-145 °C (cloud tops) to >20,000 °C (inner core)',
    knownMoons: 95,
    moonsSourceDate: 'IAU 2024 official count',
    atmosphere: 'Dense hydrogen and helium envelope with complex ammonia and hydrosulfide cloud decks',
    atmosphereGases: [
      { name: 'Hydrogen', percentage: 89.8 },
      { name: 'Helium', percentage: 10.2 },
      { name: 'Methane', percentage: 0.3 },
      { name: 'Ammonia', percentage: 0.026 },
    ],
    composition: 'Supercritical fluid metallic hydrogen mantle above a diffuse heavy-element core, with no solid surface.',
    distinctiveFeatures: [
      'Largest planet in the Solar System, more massive than all other planets combined (2.5x)',
      'Great Red Spot: an anticyclonic storm larger than Earth raging for at least 350 years',
      'Fastest rotation of any Solar System planet, producing pronounced equatorial bulging',
      'Colossal magnetosphere stretching millions of kilometers toward Saturn'
    ],
    facts: [
      'Under millions of atmospheres of pressure inside Jupiter, hydrogen behaves like a liquid electrical conductor (metallic hydrogen).',
      'Four huge Galilean moons orbit Jupiter: Io, Europa, Ganymede (largest moon in the Solar System), and Callisto.',
      'Jupiter acts as a gravitational shield and orbital sculptor, controlling the asteroid belt and comet trajectories.'
    ],
    eccentricity: 0.0485,
    inclinationDeg: 1.30,
    colors: {
      base: '#d97706',
      atmosphere: '#fde68a',
      accent: '#b45309',
      trail: '#d97706'
    },
    description: 'The king of planets: a turbulent colossus of banded storms, swirling liquid metallic hydrogen, and 95 known moons.'
  },
  {
    id: 'saturn',
    name: 'Saturn',
    latinName: 'Saturnus',
    type: 'Gas Giant',
    orderFromSun: 6,
    diameterKm: 116460,
    massKg: '5.683 × 10^26',
    massEarthRatio: 95.16,
    gravityMps2: 10.44,
    semiMajorAxisAU: 9.582,
    semiMajorAxisKm: 1433.5,
    orbitalPeriodDays: 10759.22,
    orbitalPeriodYears: 29.457,
    rotationPeriodHours: 10.656,
    avgTempC: -140,
    avgTempK: 133,
    temperatureRange: '-178 °C (cloud tops) to ~11,700 °C (inner core)',
    knownMoons: 146,
    moonsSourceDate: 'IAU 2024 official count',
    atmosphere: 'Hydrogen and helium atmosphere with high-altitude golden haze and jet streams up to 1,800 km/h',
    atmosphereGases: [
      { name: 'Hydrogen', percentage: 96.3 },
      { name: 'Helium', percentage: 3.25 },
      { name: 'Methane', percentage: 0.45 },
      { name: 'Ammonia', percentage: 0.012 },
    ],
    composition: 'Gaseous and liquid hydrogen/helium mantle surrounding a core of rock, ice, and metallic compounds.',
    distinctiveFeatures: [
      'The most magnificent ring system in the Solar System, spanning 282,000 km yet only ~10 to 30 meters thick',
      'Lowest mean density of any planet (0.687 g/cm³) — less dense than water!',
      'North polar persistent hexagonal atmospheric jet stream',
      'Hosts Titan, the only moon in the Solar System with a dense nitrogen atmosphere and liquid methane lakes'
    ],
    facts: [
      'Saturn’s rings are 99% pure water ice particles ranging in size from tiny pebbles to city-bus-sized boulders.',
      'Cassini spacecraft discovered water vapor geysers erupting from the south polar ocean of Enceladus.',
      'Saturn leads the Solar System in total confirmed moons with 146 verified satellites.'
    ],
    eccentricity: 0.0555,
    inclinationDeg: 2.49,
    hasRings: true,
    ringInnerRadiusAU: 0.00045,
    ringOuterRadiusAU: 0.00094,
    ringColors: ['rgba(234, 179, 8, 0.7)', 'rgba(217, 119, 6, 0.4)', 'rgba(254, 240, 138, 0.2)'],
    colors: {
      base: '#f59e0b',
      atmosphere: '#fef08a',
      accent: '#ca8a04',
      trail: '#f59e0b'
    },
    description: 'The jewel of the Solar System, celebrated for its glorious icy ring system, low density, and moon-rich orbit.'
  },
  {
    id: 'uranus',
    name: 'Uranus',
    latinName: 'Uranus',
    type: 'Ice Giant',
    orderFromSun: 7,
    diameterKm: 50724,
    massKg: '8.681 × 10^25',
    massEarthRatio: 14.54,
    gravityMps2: 8.69,
    semiMajorAxisAU: 19.20,
    semiMajorAxisKm: 2872.5,
    orbitalPeriodDays: 30685.4,
    orbitalPeriodYears: 84.011,
    rotationPeriodHours: -17.24, // 17h 14m retrograde
    rotationNote: '97.77° axial tilt: rotates virtually on its side, leading to 42-year long polar seasons.',
    avgTempC: -195,
    avgTempK: 78,
    temperatureRange: '-224 °C (lowest recorded temperature of any Solar System planet)',
    knownMoons: 28,
    moonsSourceDate: 'IAU 2024 official count',
    atmosphere: 'Cold hydrogen-helium atmosphere with methane ice clouds responsible for its aquamarine cyan hue',
    atmosphereGases: [
      { name: 'Hydrogen', percentage: 82.5 },
      { name: 'Helium', percentage: 15.2 },
      { name: 'Methane', percentage: 2.3 },
      { name: 'Hydrogen Deuteride', percentage: 0.01 },
    ],
    composition: 'Mantle composed of a dense, hot fluid of "ices" (water, ammonia, methane) over a small rocky core.',
    distinctiveFeatures: [
      'Rotates sideways with an axial tilt of 97.8°, likely caused by a titanic ancient protoplanet collision',
      'Coldest planetary atmosphere in the Solar System, reaching -224 °C (49 K)',
      'Possesses 13 distinct narrow dark rings composed of boulder-sized carbonaceous matter',
      'Magnetic axis is tilted 59° away from its rotational axis and offset from the planetary center'
    ],
    facts: [
      'Discovered in 1781 by astronomer William Herschel using a backyard telescope, the first planet discovered in modern history.',
      'Because of its sideways tilt, each pole experiences 42 years of continuous sunlight followed by 42 years of darkness.',
      'Voyager 2 in 1986 remains the only robotic spacecraft to have visited Uranus up close.'
    ],
    eccentricity: 0.0463,
    inclinationDeg: 0.77,
    hasRings: true,
    colors: {
      base: '#06b6d4',
      atmosphere: '#67e8f9',
      accent: '#0891b2',
      trail: '#06b6d4'
    },
    description: 'An enigmatic aquamarine ice giant rolling through space on its side, surrounded by delicate dark rings and icy moons.'
  },
  {
    id: 'neptune',
    name: 'Neptune',
    latinName: 'Neptunus',
    type: 'Ice Giant',
    orderFromSun: 8,
    diameterKm: 49244,
    massKg: '1.024 × 10^26',
    massEarthRatio: 17.15,
    gravityMps2: 11.15,
    semiMajorAxisAU: 30.05,
    semiMajorAxisKm: 4495.1,
    orbitalPeriodDays: 60189.0,
    orbitalPeriodYears: 164.79,
    rotationPeriodHours: 16.11,
    avgTempC: -200,
    avgTempK: 73,
    temperatureRange: '-218 °C (cloud tops) to ~7,000 °C (deep mantle)',
    knownMoons: 16,
    moonsSourceDate: 'IAU 2024 official count',
    atmosphere: 'Dynamic atmosphere of hydrogen, helium, and methane with rapid storm systems and white cirrus clouds',
    atmosphereGases: [
      { name: 'Hydrogen', percentage: 80.0 },
      { name: 'Helium', percentage: 19.0 },
      { name: 'Methane', percentage: 1.5 },
      { name: 'Hydrogen Deuteride', percentage: 0.019 },
    ],
    composition: 'Superheated, highly compressed fluid mantle of water, methane, and ammonia ices above a rocky-metallic core.',
    distinctiveFeatures: [
      'Windiest planet in the Solar System, with supersonic jet stream gusts exceeding 2,100 km/h',
      'Deep azure cobalt blue appearance caused by red-light absorption by atmospheric methane',
      'The Great Dark Spot: an earth-sized cyclonic vortex tracked by Voyager 2 in 1989',
      'Hosts Triton: a captured Kuiper belt object orbiting in retrograde with active nitrogen ice geysers'
    ],
    facts: [
      'Neptune was the first planet located through mathematical prediction rather than empirical observation (Urbain Le Verrier and Johann Galle, 1846).',
      'Neptune completed its first full orbit since discovery in 2011, having taken ~165 Earth years.',
      'Internal heat generation on Neptune is significantly higher than Uranus, powering intense meteorological activity.'
    ],
    eccentricity: 0.0095,
    inclinationDeg: 1.77,
    colors: {
      base: '#3b82f6',
      atmosphere: '#93c5fd',
      accent: '#1d4ed8',
      trail: '#2563eb'
    },
    description: 'The outermost major planet: a deep azure realm of supersonic winds, dynamic dark vortices, and icy geyser moons.'
  }
];

export const PLUTO_DWARF_PLANET: PlanetData = {
  id: 'pluto',
  name: 'Pluto',
  latinName: 'Pluto',
  type: 'Dwarf Planet',
  orderFromSun: 9,
  diameterKm: 2376,
  massKg: '1.303 × 10^22',
  massEarthRatio: 0.00218,
  gravityMps2: 0.62,
  semiMajorAxisAU: 39.48,
  semiMajorAxisKm: 5906.4,
  orbitalPeriodDays: 90560,
  orbitalPeriodYears: 247.94,
  rotationPeriodHours: -153.3, // 6.39 days retrograde, tidally locked with Charon
  rotationNote: 'Tidally locked in mutual synchronous rotation with its giant moon Charon.',
  avgTempC: -229,
  avgTempK: 44,
  temperatureRange: '-240 °C to -218 °C',
  knownMoons: 5,
  moonsSourceDate: 'IAU 2024 (Charon, Styx, Nix, Kerberos, Hydra)',
  atmosphere: 'Extremely tenuous seasonal nitrogen, methane, and carbon monoxide haze',
  atmosphereGases: [
    { name: 'Nitrogen', percentage: 99.0 },
    { name: 'Methane', percentage: 0.5 },
    { name: 'Carbon Monoxide', percentage: 0.5 },
  ],
  composition: 'Roughly 70% rock and 30% water/nitrogen ice with a vast nitrogen ice glacier (Sputnik Planitia).',
  distinctiveFeatures: [
    'Reclassified in 2006 by the IAU as a Dwarf Planet because it has not cleared its orbital neighborhood',
    'Features Tombaugh Regio, a bright heart-shaped plain of churning nitrogen ice',
    'Forms a binary planetary system with Charon, orbiting a barycenter outside Pluto itself',
    'High orbital inclination (17.16°) and eccentricity (0.2488), bringing it closer to the Sun than Neptune for 20 years of its orbit'
  ],
  facts: [
    'New Horizons completed a historic flyby of Pluto in July 2015, revealing active geological churning, jagged water-ice mountains, and blue atmospheric haze.',
    'Pluto is named after the Roman god of the underworld, suggested in 1930 by 11-year-old Venetia Burney from Oxford, England.',
    'Pluto is locked in a stable 2:3 orbital resonance with Neptune, ensuring they can never collide.'
  ],
  eccentricity: 0.2488,
  inclinationDeg: 17.16,
  colors: {
    base: '#a8a29e',
    atmosphere: '#cbd5e1',
    accent: '#78716c',
    trail: '#a8a29e'
  },
  description: 'The famous Kuiper Belt dwarf planet featuring a heart-shaped nitrogen glacier, five moons, and towering water-ice peaks.'
};
