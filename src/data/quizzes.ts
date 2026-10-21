import { QuizQuestion } from '../types';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // --- Category: Planets ---
  {
    id: 'p1',
    category: 'planets',
    difficulty: 'beginner',
    question: 'Which planet is the hottest in the Solar System?',
    options: ['Mercury', 'Venus', 'Mars', 'Jupiter'],
    correctIndex: 1,
    explanation: 'Venus is the hottest planet (~464 °C) due to a runaway greenhouse effect from its dense 96.5% carbon dioxide atmosphere, even though Mercury is closer to the Sun.',
    sourceRef: 'NASA Venus Fact Sheet'
  },
  {
    id: 'p2',
    category: 'planets',
    difficulty: 'beginner',
    question: 'Which planet has the shortest day (fastest rotation) in the Solar System?',
    options: ['Earth', 'Mars', 'Jupiter', 'Mercury'],
    correctIndex: 2,
    explanation: 'Jupiter rotates on its axis once every ~9 hours and 55 minutes, giving it the shortest day of any planet.',
    sourceRef: 'NASA Planetary Fact Sheet'
  },
  {
    id: 'p3',
    category: 'planets',
    difficulty: 'intermediate',
    question: 'Why does Uranus appear cyan-aquamarine in color?',
    options: [
      'High concentrations of nitrogen ice',
      'Atmospheric methane absorbing red wavelengths of light',
      'Reflections from massive water-ice rings',
      'Chlorophyll-like hydrocarbons'
    ],
    correctIndex: 1,
    explanation: 'Methane gas in Uranus’ upper atmosphere absorbs the red portion of the visible solar spectrum, reflecting cyan and blue back into space.',
    sourceRef: 'NASA Uranus Fact Sheet'
  },
  {
    id: 'p4',
    category: 'planets',
    difficulty: 'intermediate',
    question: 'Which planet has an average density so low that it could hypothetically float in water?',
    options: ['Uranus', 'Mars', 'Saturn', 'Neptune'],
    correctIndex: 2,
    explanation: 'Saturn has a mean density of approximately 0.687 g/cm³, which is less than liquid water (1.0 g/cm³).',
    sourceRef: 'NASA Saturn Fact Sheet'
  },
  {
    id: 'p5',
    category: 'planets',
    difficulty: 'astrophysicist',
    question: 'What is the unusual rotational characteristic of Venus and Uranus compared to most Solar System bodies?',
    options: [
      'They do not rotate at all (tidally locked to the Sun)',
      'They exhibit retrograde or extreme tilt rotation',
      'Their rotational speed fluctuates cyclically every decade',
      'They rotate faster than their orbital speed at the equator'
    ],
    correctIndex: 1,
    explanation: 'Venus has a retrograde rotation (spinning clockwise), and Uranus has an axial tilt of 97.8°, causing it to rotate on its side.',
    sourceRef: 'IAU Planetary Coordinates'
  },
  {
    id: 'p6',
    category: 'planets',
    difficulty: 'beginner',
    question: 'How many officially recognized planets are in the Solar System according to the IAU?',
    options: ['7', '8', '9', '10'],
    correctIndex: 1,
    explanation: 'There are 8 recognized planets: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune. Pluto was reclassified as a dwarf planet in 2006.',
    sourceRef: 'IAU 2006 General Assembly Resolution 5A'
  },
  {
    id: 'p7',
    category: 'planets',
    difficulty: 'intermediate',
    question: 'What is the Great Red Spot on Jupiter?',
    options: [
      'A deep volcanic crater',
      'An anticyclonic high-pressure storm larger than Earth',
      'A shadow cast by its Galilean moons',
      'A glowing lake of liquid metallic hydrogen'
    ],
    correctIndex: 1,
    explanation: 'The Great Red Spot is a persistent anticyclonic storm in Jupiter\'s southern hemisphere that has been observed for over 350 years.',
    sourceRef: 'NASA Juno Mission'
  },
  {
    id: 'p8',
    category: 'planets',
    difficulty: 'astrophysicist',
    question: 'What is the spin-orbit resonance of Mercury?',
    options: ['1:1 (synchronous)', '3:2 (3 rotations for every 2 orbits)', '2:1', '4:3'],
    correctIndex: 1,
    explanation: 'Mercury is locked in a 3:2 spin-orbit resonance: it rotates exactly 3 times around its axis for every 2 orbits it completes around the Sun.',
    sourceRef: 'Colombo, G. (1965) Nature'
  },

  // --- Category: Moons ---
  {
    id: 'm1',
    category: 'moons',
    difficulty: 'beginner',
    question: 'Which is the largest natural satellite (moon) in the Solar System?',
    options: ['Earth\'s Moon', 'Titan', 'Ganymede', 'Callisto'],
    correctIndex: 2,
    explanation: 'Ganymede (orbiting Jupiter) has a diameter of 5,268 km, making it larger than Mercury (4,879 km) and Pluto.',
    sourceRef: 'NASA Galileo Mission'
  },
  {
    id: 'm2',
    category: 'moons',
    difficulty: 'beginner',
    question: 'Which of Saturn’s moons is famous for its dense nitrogen atmosphere and liquid methane lakes?',
    options: ['Enceladus', 'Titan', 'Mimas', 'Rhea'],
    correctIndex: 1,
    explanation: 'Titan is the only moon with a substantial, dense atmosphere (1.45 bar at surface) and liquid hydrocarbon seas like Kraken Mare.',
    sourceRef: 'Cassini-Huygens Mission'
  },
  {
    id: 'm3',
    category: 'moons',
    difficulty: 'intermediate',
    question: 'What geological process keeps Jupiter\'s moon Io so intensely volcanic?',
    options: [
      'Residual heat from Solar System formation',
      'Heavy radioactive element decay in its crust',
      'Tidal flexing and gravitational friction from Jupiter, Europa, and Ganymede',
      'Solar wind plasma bombardment'
    ],
    correctIndex: 2,
    explanation: 'Io is caught in an orbital Laplace resonance with Europa and Ganymede. Jupiter\'s immense tidal pull continuously flexes Io\'s interior, generating massive tidal frictional heating.',
    sourceRef: 'Peale et al. (1979) Science'
  },
  {
    id: 'm4',
    category: 'moons',
    difficulty: 'intermediate',
    question: 'Which moon of Saturn shoots plumes of salty water vapor, silica nanoparticles, and organics into space from south polar fractures?',
    options: ['Iapetus', 'Enceladus', 'Tethys', 'Dione'],
    correctIndex: 1,
    explanation: 'Enceladus features cryovolcanic geysers emerging from "tiger stripe" fractures, venting water from a global subsurface ocean.',
    sourceRef: 'NASA Cassini Findings'
  },
  {
    id: 'm5',
    category: 'moons',
    difficulty: 'astrophysicist',
    question: 'Why is Triton considered an unusual moon of Neptune?',
    options: [
      'It orbits in retrograde and is likely a captured Kuiper Belt object',
      'It has an atmosphere of pure oxygen',
      'It orbits faster than Neptune’s core rotates',
      'It has no impact craters whatsoever'
    ],
    correctIndex: 0,
    explanation: 'Triton is the only large moon in the Solar System that orbits in the direction opposite to its parent planet\'s rotation, indicating it was gravitationally captured from the Kuiper Belt.',
    sourceRef: 'Voyager 2 Science Reports'
  },
  {
    id: 'm6',
    category: 'moons',
    difficulty: 'beginner',
    question: 'What are the two tiny, potato-shaped moons of Mars called?',
    options: ['Io and Europa', 'Phobos and Deimos', 'Titan and Enceladus', 'Ariel and Umbriel'],
    correctIndex: 1,
    explanation: 'Mars is orbited by Phobos ("Fear") and Deimos ("Dread"), discovered in 1877 by Asaph Hall.',
    sourceRef: 'US Naval Observatory'
  },
  {
    id: 'm7',
    category: 'moons',
    difficulty: 'intermediate',
    question: 'Which moon in the Solar System possesses its own internally generated magnetic dipole field?',
    options: ['Europa', 'Titan', 'Ganymede', 'The Moon'],
    correctIndex: 2,
    explanation: 'Ganymede is the only known moon with an intrinsic dynamo-generated magnetosphere, discovered by the Galileo probe in 1996.',
    sourceRef: 'Kivelson et al., Nature (1996)'
  },
  {
    id: 'm8',
    category: 'moons',
    difficulty: 'astrophysicist',
    question: 'What fate awaits Mars\' inner moon Phobos over the next 30 to 50 million years?',
    options: [
      'It will be ejected from Mars orbit into the asteroid belt',
      'It will spiral inward past the Roche limit and break apart or impact Mars',
      'It will enter a stable 1:1 tidal resonance with Deimos',
      'It will freeze and evaporate into space'
    ],
    correctIndex: 1,
    explanation: 'Because Phobos orbits faster than Mars rotates, tidal forces bleed its orbital energy, causing it to descend ~1.8 cm per year until it shatters into a ring or impacts.',
    sourceRef: 'Bills et al. (2005) J. Geophys. Res.'
  },

  // --- Category: Mechanics ---
  {
    id: 'k1',
    category: 'mechanics',
    difficulty: 'beginner',
    question: 'According to Kepler\'s First Law, what shape are planetary orbits around the Sun?',
    options: ['Perfect circles', 'Ellipses with the Sun at one focus', 'Hyperbolas', 'Parabolas'],
    correctIndex: 1,
    explanation: 'Kepler\'s First Law states that the orbit of a planet is an ellipse with the Sun located at one of the two foci.',
    sourceRef: 'Astronomia Nova (1609)'
  },
  {
    id: 'k2',
    category: 'mechanics',
    difficulty: 'intermediate',
    question: 'According to Kepler\'s Second Law (equal areas in equal time), where does a planet travel fastest?',
    options: [
      'At aphelion (farthest from the Sun)',
      'At perihelion (closest to the Sun)',
      'At the semi-minor axis intersection',
      'It travels at constant speed throughout'
    ],
    correctIndex: 1,
    explanation: 'Conservation of angular momentum dictates that a planet sweeps equal areas in equal intervals of time, meaning it moves fastest at perihelion and slowest at aphelion.',
    sourceRef: 'Kepler\'s Second Law'
  },
  {
    id: 'k3',
    category: 'mechanics',
    difficulty: 'intermediate',
    question: 'If a planet\'s semi-major axis is 4 AU, what is its orbital period in Earth years using Kepler\'s Third Law (T² = a³)?',
    options: ['4 years', '8 years', '16 years', '64 years'],
    correctIndex: 1,
    explanation: 'T² = a³ => T² = 4³ = 64 => T = √64 = 8 Earth years.',
    sourceRef: 'Harmonices Mundi (1619)'
  },
  {
    id: 'k4',
    category: 'mechanics',
    difficulty: 'astrophysicist',
    question: 'What is the Vis-Viva equation used to calculate in celestial mechanics?',
    options: [
      'The surface gravity of an oblate spheroid',
      'The orbital velocity of a body at any point along an elliptical orbit',
      'The atmospheric scale height of gas giants',
      'The rate of perihelion precession due to relativity'
    ],
    correctIndex: 1,
    explanation: 'The Vis-Viva equation v² = GM(2/r - 1/a) calculates the instantaneous orbital velocity given distance r and semi-major axis a.',
    sourceRef: 'Fundamentals of Astrodynamics (Bate, Mueller, White)'
  },
  {
    id: 'k5',
    category: 'mechanics',
    difficulty: 'astrophysicist',
    question: 'What is orbital eccentricity (e)?',
    options: [
      'The tilt of the orbital plane relative to the ecliptic',
      'A dimensionless measure of how much an orbit deviates from a perfect circle',
      'The time taken to rotate from perihelion to aphelion',
      'The speed variation between northern and southern hemispheres'
    ],
    correctIndex: 1,
    explanation: 'Eccentricity ranges from e = 0 (perfect circle) to 0 < e < 1 (ellipse), e = 1 (parabolic escape trajectory), and e > 1 (hyperbola).',
    sourceRef: 'Orbital Mechanics for Engineering Students'
  },
  {
    id: 'k6',
    category: 'mechanics',
    difficulty: 'beginner',
    question: 'What keeps the planets in orbit around the Sun instead of flying straight into deep space?',
    options: ['The solar magnetic field', 'Solar radiation pressure', 'Gravitational attraction of the Sun', 'Interplanetary dark matter'],
    correctIndex: 2,
    explanation: 'The Sun\'s immense gravitational attraction continuously accelerates the planets inward, curving their straight-line inertial trajectories into orbits.',
    sourceRef: 'Newton\'s Principia'
  },

  // --- Category: Distances ---
  {
    id: 'd1',
    category: 'distances',
    difficulty: 'beginner',
    question: 'What is the definition of one Astronomical Unit (1 AU)?',
    options: [
      'The diameter of the Sun',
      'The mean distance from the Earth to the Sun (~149.6 million km)',
      'The distance light travels in one hour',
      'The distance from the Sun to the Kuiper Belt'
    ],
    correctIndex: 1,
    explanation: '1 AU is officially defined as exactly 149,597,870,700 meters (~149.6 million kilometers), representing the mean Earth-Sun orbital radius.',
    sourceRef: 'IAU 2012 Resolution B2'
  },
  {
    id: 'd2',
    category: 'distances',
    difficulty: 'beginner',
    question: 'Approximately how long does sunlight take to travel from the Sun to Earth?',
    options: ['8.3 seconds', '8.3 minutes', '8.3 hours', 'Instantaneous'],
    correctIndex: 1,
    explanation: 'Light traveling at ~300,000 km/s covers the 149.6 million km distance between the Sun and Earth in ~499 seconds, or ~8 minutes and 19 seconds.',
    sourceRef: 'Astrophysical Quantities'
  },
  {
    id: 'd3',
    category: 'distances',
    difficulty: 'intermediate',
    question: 'Approximately how far is Neptune from the Sun in Astronomical Units?',
    options: ['10 AU', '20 AU', '30 AU', '50 AU'],
    correctIndex: 2,
    explanation: 'Neptune orbits at an average distance of approximately 30.05 AU (~4.5 billion km) from the Sun.',
    sourceRef: 'NASA Neptune Fact Sheet'
  },
  {
    id: 'd4',
    category: 'distances',
    difficulty: 'intermediate',
    question: 'Why does the distance between Earth and Mars constantly change from ~55 million km to over 400 million km?',
    options: [
      'Because solar gravity pulses regularly',
      'Because they orbit at different speeds on concentric orbits (conjunction vs opposition)',
      'Because Mars has an unstable runaway orbit',
      'Because Earth’s axial tilt shifts its position'
    ],
    correctIndex: 1,
    explanation: 'Earth orbits faster (365 days) than Mars (687 days). When Earth passes Mars on the same side of the Sun (opposition), they are closest (~55M km); on opposite sides of the Sun (conjunction), they are farthest (~400M km).',
    sourceRef: 'JPL Planetary Horizons'
  },
  {
    id: 'd5',
    category: 'distances',
    difficulty: 'astrophysicist',
    question: 'How long does a radio signal take to travel one-way between Earth and Voyager 1 (~160 AU out)?',
    options: ['About 2 hours', 'About 6.5 hours', 'About 22 to 23 hours', 'About 3 days'],
    correctIndex: 2,
    explanation: 'At ~160 AU (24 billion km), light and radio signals traveling at c take approximately 22.2 hours for a one-way trip to Voyager 1.',
    sourceRef: 'NASA JPL Voyager Status'
  },

  // --- Category: Missions ---
  {
    id: 'mi1',
    category: 'missions',
    difficulty: 'beginner',
    question: 'Which historic mission was the first to land human astronauts on the Moon in 1969?',
    options: ['Apollo 8', 'Apollo 11', 'Gemini 4', 'Vostok 1'],
    correctIndex: 1,
    explanation: 'Apollo 11 landed Neil Armstrong and Buzz Aldrin at the Sea of Tranquility on July 20, 1969.',
    sourceRef: 'NASA Apollo Records'
  },
  {
    id: 'mi2',
    category: 'missions',
    difficulty: 'intermediate',
    question: 'What is a Hohmann transfer orbit?',
    options: [
      'A continuous-thrust nuclear ion drive trajectory',
      'The most fuel-efficient two-impulse elliptical transfer between two coplanar circular orbits',
      'A gravity assist maneuver around a gas giant',
      'A direct straight-line rocket flight path'
    ],
    correctIndex: 1,
    explanation: 'Devised by Walter Hohmann in 1925, it uses an elliptical orbit tangent to both the departure and arrival orbits, minimizing total delta-v.',
    sourceRef: 'Hohmann, W. (1925) Die Erreichbarkeit der Himmelskörper'
  },
  {
    id: 'mi3',
    category: 'missions',
    difficulty: 'intermediate',
    question: 'Which robotic spacecraft flew past Pluto in 2015, providing humanity\'s first close-up images of its heart-shaped glacier?',
    options: ['Voyager 1', 'Cassini', 'New Horizons', 'Dawn'],
    correctIndex: 2,
    explanation: 'NASA\'s New Horizons spacecraft executed a historic flyby of Pluto on July 14, 2015, capturing high-resolution photos of Sputnik Planitia.',
    sourceRef: 'NASA New Horizons Mission'
  },
  {
    id: 'mi4',
    category: 'missions',
    difficulty: 'astrophysicist',
    question: 'Why can missions to Mars only launch approximately every 26 months (the synodic period)?',
    options: [
      'The Sun\'s coronal activity blocks communications in between',
      'Earth and Mars must be in the precise geometric planetary phase angle alignment for a Hohmann transfer',
      'Spacecraft batteries require 2 years to charge before flight',
      'Mars polar ice caps only sublimate every two years'
    ],
    correctIndex: 1,
    explanation: 'Because Earth and Mars orbit at different angular velocities, the required departure phase angle (~44°) recurs only once every synodic period (~780 days / ~26 months).',
    sourceRef: 'NASA Mars Mission Design'
  },
  {
    id: 'mi5',
    category: 'missions',
    difficulty: 'intermediate',
    question: 'Which spacecraft has traveled farthest from Earth into interstellar space?',
    options: ['Pioneer 10', 'Voyager 1', 'New Horizons', 'Parker Solar Probe'],
    correctIndex: 1,
    explanation: 'Launched in 1977, Voyager 1 crossed the heliopause into interstellar space in August 2012 and is currently over 24 billion km from Earth.',
    sourceRef: 'NASA JPL Interstellar Mission'
  },

  // --- Category: Stars ---
  {
    id: 's1',
    category: 'stars',
    difficulty: 'beginner',
    question: 'What spectral class and type of star is our Sun?',
    options: ['M-class Red Dwarf', 'G-class Yellow Dwarf (G2V)', 'O-class Blue Supergiant', 'White Dwarf'],
    correctIndex: 1,
    explanation: 'The Sun is classified as a G2V main-sequence star, informally called a yellow dwarf.',
    sourceRef: 'Morgan-Keenan Spectral Classification'
  },
  {
    id: 's2',
    category: 'stars',
    difficulty: 'intermediate',
    question: 'What nuclear reaction powers the core of the Sun during its main-sequence stage?',
    options: [
      'Uranium-235 nuclear fission',
      'Proton-proton chain hydrogen fusion into helium',
      'Triple-alpha carbon combustion',
      'Gravitational contraction alone'
    ],
    correctIndex: 1,
    explanation: 'In the core of the Sun, intense pressure and temperatures exceeding 15 million kelvin fuse 4 hydrogen nuclei (protons) into 1 helium-4 nucleus via the p-p chain.',
    sourceRef: 'Bethe, H. (1939) Physical Review'
  },
  {
    id: 's3',
    category: 'stars',
    difficulty: 'astrophysicist',
    question: 'What will happen to the Sun in approximately 5 billion years after it exhausts its core hydrogen fuel?',
    options: [
      'It will explode as a Core-Collapse Type II Supernova',
      'It will expand into a Red Giant, engulfing the inner planets, then shed its outer layers as a planetary nebula and leave a White Dwarf',
      'It will collapse directly into a Stellar-Mass Black Hole',
      'It will transform into a cold brown dwarf with no expansion'
    ],
    correctIndex: 1,
    explanation: 'The Sun lacks the mass required (which requires >8 solar masses) to trigger a supernova. It will swell into a Red Giant, shed its outer envelope into a planetary nebula, and leave an earth-sized carbon-oxygen white dwarf.',
    sourceRef: 'Carroll & Ostlie, Modern Astrophysics'
  },
  {
    id: 's4',
    category: 'stars',
    difficulty: 'intermediate',
    question: 'What is the solar wind?',
    options: [
      'A continuous stream of charged particles (electrons and protons) ejected from the Sun\'s corona',
      'Sound waves propagating through interplanetary gas',
      'Light photons exerting radiative force on asteroids',
      'Cosmic ray showers entering the heliosphere from distant supernovas'
    ],
    correctIndex: 0,
    explanation: 'The solar wind is a plasma outflow composed primarily of high-energy protons and electrons accelerating through coronal holes across the Solar System.',
    sourceRef: 'Parker, E. (1958) Astrophysical Journal'
  }
];
