import { MoonData } from '../types';

export const MOONS_DATA: MoonData[] = [
  {
    id: 'moon',
    name: 'The Moon (Luna)',
    parentPlanetId: 'earth',
    parentPlanetName: 'Earth',
    diameterKm: 3474,
    orbitalPeriodDays: 27.32,
    orbitalDistanceKm: 384400,
    composition: 'Silicate crust, anorthositic highlands, basaltic maria, and a small iron core.',
    description: 'Earth’s only natural satellite, responsible for ocean tides and stabilizing Earth’s axial climate tilt.',
    missions: ['Apollo 11–17 (1969–1972)', 'Lunar Reconnaissance Orbiter (2009–present)', 'Chang\'e 3/4/5/6', 'Artemis program'],
    facts: [
      'The Moon is in synchronous tidal lock with Earth, keeping the same face perpetually pointed toward us.',
      'Formed ~4.5 billion years ago when a Mars-sized protoplanet named Theia collided with the proto-Earth.',
      'Surface is divided into dark basaltic plains called "maria" and bright, heavily cratered anorthosite highlands.'
    ],
    color: '#cbd5e1'
  },
  {
    id: 'phobos',
    name: 'Phobos',
    parentPlanetId: 'mars',
    parentPlanetName: 'Mars',
    diameterKm: 22.4, // 27 × 22 × 18 km mean
    orbitalPeriodDays: 0.3189, // ~7.66 hours
    orbitalDistanceKm: 9376,
    composition: 'Carbonaceous chondrite rubble pile with low density (1.87 g/cm³).',
    description: 'The larger, inner moon of Mars, orbiting so close that it circles Mars three times per Martian sol.',
    missions: ['Mariner 9 (1971)', 'Viking 1 (1977)', 'Mars Express (ESA)', 'Mars Reconnaissance Orbiter'],
    facts: [
      'Orbits below Mars’ synchronous orbit radius, causing tidal deceleration: it spirals inward ~1.8 cm/year.',
      'Within 30–50 million years, Phobos will either crash into Mars or shatter into a planetary ring.',
      'Features Stickney crater, an enormous impact crater 9 km across that almost pulverized the entire moon.'
    ],
    color: '#a8a29e'
  },
  {
    id: 'deimos',
    name: 'Deimos',
    parentPlanetId: 'mars',
    parentPlanetName: 'Mars',
    diameterKm: 12.4, // 15 × 12 × 11 km
    orbitalPeriodDays: 1.263, // 30.3 hours
    orbitalDistanceKm: 23463,
    composition: 'Carbon-rich rock mixed with water ice and a thick regolith blanket.',
    description: 'The smaller, outer moon of Mars, appearing like a faint star from the surface of Mars.',
    missions: ['Viking 2', 'Mars Global Surveyor', 'Emirates Hope Mars Mission (close flyby 2023)'],
    facts: [
      'Smooth appearance caused by a 100-meter thick blanket of loose regolith filling impact craters.',
      'Escape velocity on Deimos is just 5.6 m/s (20 km/h) — a human running fast could leap into orbit.',
      'Takes 30.3 hours to orbit Mars, slightly longer than Mars\' 24.6-hour rotation, rising in the east very slowly.'
    ],
    color: '#78716c'
  },
  {
    id: 'io',
    name: 'Io',
    parentPlanetId: 'jupiter',
    parentPlanetName: 'Jupiter',
    diameterKm: 3643,
    orbitalPeriodDays: 1.769,
    orbitalDistanceKm: 421700,
    composition: 'Silicate rock mantle and iron-sulfur core with extensive sulfur surface frosts.',
    description: 'The most volcanically active body in the Solar System, erupting sulfurous plumes hundreds of kilometers high.',
    missions: ['Voyager 1 & 2 (1979)', 'Galileo (1995–2003)', 'New Horizons (2007)', 'Juno (ongoing flybys)'],
    facts: [
      'Continuous tidal flexing caused by gravitational resonance with Europa and Ganymede generates enormous internal frictional heat.',
      'Possesses over 400 active volcanoes; surface is constantly resurfaced with sulfur and basaltic lava lakes.',
      'Volcanic eruptions feed a giant donut-shaped plasma torus encircling Jupiter along Io\'s orbit.'
    ],
    color: '#eab308'
  },
  {
    id: 'europa',
    name: 'Europa',
    parentPlanetId: 'jupiter',
    parentPlanetName: 'Jupiter',
    diameterKm: 3122,
    orbitalPeriodDays: 3.551,
    orbitalDistanceKm: 670900,
    composition: 'Silicate mantle with a 15–25 km thick water-ice shell overlying a global saltwater ocean.',
    description: 'A smooth, icy moon harboring a deep subsurface liquid water ocean with more water than all of Earth’s oceans combined.',
    missions: ['Galileo', 'Voyager 1 & 2', 'Juno', 'Europa Clipper (launched 2024)', 'JUICE (en route)'],
    facts: [
      'The subsurface ocean is estimated to be 60 to 150 km deep beneath its floating outer ice shell.',
      'Surface is crisscrossed with reddish fractures and ridges (lineae) caused by tidal flexing.',
      'Primary target in the search for extraterrestrial habitability and hydrothermal vent ecosystems.'
    ],
    color: '#e0e7ff'
  },
  {
    id: 'ganymede',
    name: 'Ganymede',
    parentPlanetId: 'jupiter',
    parentPlanetName: 'Jupiter',
    diameterKm: 5268,
    orbitalPeriodDays: 7.155,
    orbitalDistanceKm: 1070400,
    composition: 'Equal parts silicate rock and water ice, with a liquid iron core.',
    description: 'The largest moon in the Solar System, larger than the planet Mercury and dwarf planet Pluto.',
    missions: ['Voyager 1 & 2', 'Galileo', 'Juno', 'JUICE (ESA mission designed to enter orbit in 2034)'],
    facts: [
      'The only moon in the Solar System known to generate its own intrinsic magnetic dipole field.',
      'Auroral belts around Ganymede’s poles confirm the presence of a vast, saline subsurface liquid ocean.',
      'Has complex grooved terrain created by ancient tectonic extensional faulting of icy crust.'
    ],
    color: '#94a3b8'
  },
  {
    id: 'callisto',
    name: 'Callisto',
    parentPlanetId: 'jupiter',
    parentPlanetName: 'Jupiter',
    diameterKm: 4821,
    orbitalPeriodDays: 16.689,
    orbitalDistanceKm: 1882700,
    composition: 'Equal mixture of water ice and rocky-metallic minerals.',
    description: 'The most heavily cratered object in the Solar System, preserving a 4-billion-year-old surface.',
    missions: ['Voyager 1 & 2', 'Galileo', 'Cassini flyby', 'JUICE (multiple planned flybys)'],
    facts: [
      'Orbits outside Jupiter’s harsh radiation belt, making it a prime candidate for a future human exploration base.',
      'Lacks major tidal heating resonance, leaving its ancient impact scars almost completely undisturbed.',
      'Features Valhalla, a gigantic multi-ring impact basin spanning 3,800 kilometers across.'
    ],
    color: '#64748b'
  },
  {
    id: 'titan',
    name: 'Titan',
    parentPlanetId: 'saturn',
    parentPlanetName: 'Saturn',
    diameterKm: 5150,
    orbitalPeriodDays: 15.945,
    orbitalDistanceKm: 1221870,
    composition: 'Water ice shell and rocky core beneath a thick nitrogen atmosphere with organic photochemical smog.',
    description: 'The second largest moon in the Solar System and the only moon with a substantial, dense atmosphere and liquid surface lakes.',
    missions: ['Voyager 1 & 2', 'Cassini–Huygens (2004–2017, Huygens landed 2005)', 'Dragonfly rotorcraft (launch 2028)'],
    facts: [
      'Atmospheric surface pressure is 1.45 bar (50% greater than Earth at sea level) with 95% nitrogen and 5% methane.',
      'Features a complete hydrological cycle based on liquid methane and ethane — clouds, rain, rivers, and vast polar seas like Kraken Mare.',
      'Huygens probe sent pictures of rounded water-ice pebbles carved by liquid hydrocarbon rivers.'
    ],
    color: '#f59e0b'
  },
  {
    id: 'enceladus',
    name: 'Enceladus',
    parentPlanetId: 'saturn',
    parentPlanetName: 'Saturn',
    diameterKm: 504,
    orbitalPeriodDays: 1.370,
    orbitalDistanceKm: 238000,
    composition: 'Silicate core surrounded by a global liquid ocean and pure water-ice crust.',
    description: 'A brilliant, reflective icy moon erupting plumes of salty water, silica nanoparticles, and organic molecules from its south pole.',
    missions: ['Voyager 1 & 2', 'Cassini spacecraft (flew through plume eruptions multiple times)'],
    facts: [
      'South polar "tiger stripe" fractures vent over 200 kg of water vapor, ice crystals, and organic compounds per second into space.',
      'These cryovolcanic plumes replenish Saturn’s diffuse E ring.',
      'Cassini detected molecular hydrogen and phosphorus in the plumes, key markers of hydrothermal vents and organic habitability.'
    ],
    color: '#f8fafc'
  },
  {
    id: 'mimas',
    name: 'Mimas',
    parentPlanetId: 'saturn',
    parentPlanetName: 'Saturn',
    diameterKm: 396,
    orbitalPeriodDays: 0.942,
    orbitalDistanceKm: 185520,
    composition: 'Overwhelmingly water ice with only a small concentration of rocky silicate material.',
    description: 'Known for its giant Herschel Crater, giving it an uncanny resemblance to the Star Wars "Death Star".',
    missions: ['Voyager 1 & 2', 'Cassini (detailed thermal and orbital mapping)'],
    facts: [
      'Herschel Crater is 130 km wide (one-third the diameter of Mimas) with central peaks rising 6 km high.',
      'Libration analysis in 2024 revealed that Mimas surprisingly hosts a young, buried global ocean under its frozen shell.',
      'Gravitational resonance with Saturn\'s rings cleared the famous 4,800-km Cassini Division.'
    ],
    color: '#94a3b8'
  },
  {
    id: 'triton',
    name: 'Triton',
    parentPlanetId: 'neptune',
    parentPlanetName: 'Neptune',
    diameterKm: 2707,
    orbitalPeriodDays: -5.877, // Retrograde orbit
    orbitalDistanceKm: 354760,
    composition: 'Crust of frozen nitrogen, water, and dry ice over a large rocky-metallic core and possible ocean.',
    description: 'The largest moon of Neptune, orbiting backward in retrograde, indicating it is a captured dwarf planet from the Kuiper Belt.',
    missions: ['Voyager 2 (August 1989 flyby)'],
    facts: [
      'The only large moon in the Solar System that orbits in the direction opposite to its planet’s rotation.',
      'Active cryogeysers erupt plumes of sublimated nitrogen gas and dark organic dust up to 8 km into its thin atmosphere.',
      'Tidal interactions with Neptune are draining its orbital energy; in ~3.6 billion years it will pass within Neptune\'s Roche limit and break apart.'
    ],
    color: '#7dd3fc'
  },
  {
    id: 'titania',
    name: 'Titania',
    parentPlanetId: 'uranus',
    parentPlanetName: 'Uranus',
    diameterKm: 1578,
    orbitalPeriodDays: 8.706,
    orbitalDistanceKm: 435910,
    composition: 'Equal mixture of water ice and dense rocky/carbonaceous material.',
    description: 'The largest moon of Uranus, scarred by vast grabens and canyons indicating ancient global ice expansion.',
    missions: ['Voyager 2 (January 1986 flyby)'],
    facts: [
      'Named after the Queen of the Fairies in Shakespeare’s "A Midsummer Night’s Dream".',
      'Messina Chasma is a colossal canyon system spanning over 1,500 km across the moon.',
      'Subsurface ocean models suggest a liquid layer might be maintained by dissolved ammonia antifreeze.'
    ],
    color: '#cbd5e1'
  },
  {
    id: 'oberon',
    name: 'Oberon',
    parentPlanetId: 'uranus',
    parentPlanetName: 'Uranus',
    diameterKm: 1523,
    orbitalPeriodDays: 13.463,
    orbitalDistanceKm: 583520,
    composition: 'Water ice crust with abundant carbonaceous impact debris and a rocky silicate core.',
    description: 'The outermost major moon of Uranus, heavily cratered with mysterious dark deposits on the floors of its impact basins.',
    missions: ['Voyager 2 (1986)'],
    facts: [
      'Named after the King of the Fairies in Shakespeare’s literature.',
      'Features Hamlet crater, an enormous impact feature with a dark carbon-rich floor.',
      'Possesses a massive mountain peak near its limb rising approximately 11 km above the surrounding plains.'
    ],
    color: '#94a3b8'
  },
  {
    id: 'charon',
    name: 'Charon',
    parentPlanetId: 'pluto',
    parentPlanetName: 'Pluto (Dwarf Planet)',
    diameterKm: 1212,
    orbitalPeriodDays: 6.387,
    orbitalDistanceKm: 19640,
    composition: 'Water ice crust with crystalline hydrate minerals overlying a rocky core.',
    description: 'The massive moon of Pluto, more than half Pluto’s diameter, creating a double dwarf planet system.',
    missions: ['New Horizons (July 2015 flyby)'],
    facts: [
      'Pluto and Charon orbit a mutual center of mass (barycenter) that lies in open space between them.',
      'Mutually tidally locked: each object permanently shows the exact same face to the other at all times.',
      'Features Mordor Macula: a distinctive reddish-brown north polar cap colored by tholins originating from Pluto’s atmosphere.'
    ],
    color: '#e2e8f0'
  }
];
