import { HohmannTransferResult, PlanetData } from '../types';

// Constants
export const AU_IN_KM = 149597870.7; // 1 AU in kilometers
export const SPEED_OF_LIGHT_KMS = 299792.458; // Speed of light in km/s
export const G_SI = 6.67430e-11; // Gravitational constant m^3 kg^-1 s^-2
export const SUN_MASS_KG = 1.9885e30; // Mass of the Sun in kg
export const STANDARD_GRAVITATIONAL_PARAMETER_SUN = 1.32712440018e11; // km^3 / s^2 (GM_sun)

/**
 * Calculates orbital period using Kepler's Third Law:
 * T^2 = (4 * pi^2 * a^3) / (G * M)
 * In Solar units with a in AU and M in solar masses: T (in years) = sqrt(a^3 / M)
 */
export function calculateOrbitalPeriodYears(semiMajorAxisAU: number, centralBodyMassInSolarMasses: number = 1.0): number {
  if (semiMajorAxisAU <= 0 || centralBodyMassInSolarMasses <= 0) return 0;
  return Math.sqrt(Math.pow(semiMajorAxisAU, 3) / centralBodyMassInSolarMasses);
}

/**
 * Calculates orbital period in seconds given semi-major axis in meters and central body mass in kg
 */
export function calculateOrbitalPeriodSI(semiMajorAxisMeters: number, centralBodyMassKg: number = SUN_MASS_KG): number {
  if (semiMajorAxisMeters <= 0 || centralBodyMassKg <= 0) return 0;
  return 2 * Math.PI * Math.sqrt(Math.pow(semiMajorAxisMeters, 3) / (G_SI * centralBodyMassKg));
}

/**
 * Calculate perihelion (closest distance to primary) and aphelion (farthest distance)
 */
export function calculateOrbitalExtremes(semiMajorAxisAU: number, eccentricity: number): {
  perihelionAU: number;
  aphelionAU: number;
  semiMinorAxisAU: number;
} {
  const e = Math.max(0, Math.min(0.99, eccentricity));
  const perihelionAU = semiMajorAxisAU * (1 - e);
  const aphelionAU = semiMajorAxisAU * (1 + e);
  const semiMinorAxisAU = semiMajorAxisAU * Math.sqrt(1 - e * e);
  return { perihelionAU, aphelionAU, semiMinorAxisAU };
}

/**
 * Calculates orbital speed at distance r using the Vis-Viva equation:
 * v^2 = GM * (2/r - 1/a)
 * Inputs in km and km/s, GM in km^3/s^2
 */
export function calculateOrbitalSpeedKms(rKm: number, semiMajorAxisKm: number, mu: number = STANDARD_GRAVITATIONAL_PARAMETER_SUN): number {
  if (rKm <= 0 || semiMajorAxisKm <= 0) return 0;
  const vSq = mu * (2 / rKm - 1 / semiMajorAxisKm);
  return Math.sqrt(Math.max(0, vSq));
}

/**
 * Solves Kepler's Equation M = E - e * sin(E) for Eccentric Anomaly E using Newton-Raphson iteration.
 * @param meanAnomalyRad Mean anomaly in radians [0, 2*PI]
 * @param eccentricity Orbital eccentricity [0, 1)
 */
export function solveKeplerEquation(meanAnomalyRad: number, eccentricity: number): number {
  const e = Math.max(0, Math.min(0.98, eccentricity));
  let E = meanAnomalyRad; // Initial guess
  
  for (let i = 0; i < 20; i++) {
    const f = E - e * Math.sin(E) - meanAnomalyRad;
    const fPrime = 1 - e * Math.cos(E);
    if (Math.abs(fPrime) < 1e-12) break;
    const delta = f / fPrime;
    E -= delta;
    if (Math.abs(delta) < 1e-9) break;
  }
  return E;
}

/**
 * Computes true anomaly nu from eccentric anomaly E and eccentricity e
 */
export function trueAnomalyFromEccentricAnomaly(E: number, eccentricity: number): number {
  const e = Math.max(0, Math.min(0.98, eccentricity));
  const cosNu = (Math.cos(E) - e) / (1 - e * Math.cos(E));
  const sinNu = (Math.sqrt(1 - e * e) * Math.sin(E)) / (1 - e * Math.cos(E));
  return Math.atan2(sinNu, cosNu);
}

/**
 * Distance unit conversions
 */
export function convertAuToKm(au: number): number {
  return au * AU_IN_KM;
}

export function convertKmToAu(km: number): number {
  return km / AU_IN_KM;
}

export function convertKmToMiles(km: number): number {
  return km * 0.621371;
}

export function calculateLightTime(distanceKm: number): {
  totalSeconds: number;
  formatted: string;
} {
  const totalSeconds = distanceKm / SPEED_OF_LIGHT_KMS;
  if (totalSeconds < 60) {
    return {
      totalSeconds,
      formatted: `${totalSeconds.toFixed(2)} light-seconds`
    };
  } else if (totalSeconds < 3600) {
    const minutes = totalSeconds / 60;
    return {
      totalSeconds,
      formatted: `${minutes.toFixed(2)} light-minutes`
    };
  } else {
    const hours = totalSeconds / 3600;
    return {
      totalSeconds,
      formatted: `${hours.toFixed(2)} light-hours`
    };
  }
}

/**
 * Calculates Synodic Period between two orbiting bodies:
 * 1 / T_syn = | 1 / T1 - 1 / T2 |
 */
export function calculateSynodicPeriodDays(period1Days: number, period2Days: number): number {
  if (period1Days <= 0 || period2Days <= 0 || Math.abs(period1Days - period2Days) < 1e-5) return Infinity;
  const rateDiff = Math.abs(1 / period1Days - 1 / period2Days);
  return 1 / rateDiff;
}

/**
 * Computes an idealized Hohmann Transfer Orbit between two coplanar circular orbits.
 * Used for educational mission planning between planets (e.g. Earth to Mars).
 */
export function calculateHohmannTransfer(origin: PlanetData, destination: PlanetData): HohmannTransferResult {
  const r1AU = origin.semiMajorAxisAU;
  const r2AU = destination.semiMajorAxisAU;
  const r1Km = r1AU * AU_IN_KM;
  const r2Km = r2AU * AU_IN_KM;
  const mu = STANDARD_GRAVITATIONAL_PARAMETER_SUN; // km^3 / s^2

  // Semi-major axis of the elliptical transfer orbit: a_t = (r1 + r2) / 2
  const transferSemiMajorAxisAU = (r1AU + r2AU) / 2;
  const transferSemiMajorAxisKm = (r1Km + r2Km) / 2;

  // Travel time is half the orbital period of the transfer ellipse:
  // T_t / 2 = pi * sqrt(a_t^3 / mu)
  const transferTimeSeconds = Math.PI * Math.sqrt(Math.pow(transferSemiMajorAxisKm, 3) / mu);
  const travelTimeDays = transferTimeSeconds / 86400;
  const travelTimeYears = travelTimeDays / 365.25;

  // Circular orbital velocities of origin and destination planets:
  const v1 = Math.sqrt(mu / r1Km); // km/s
  const v2 = Math.sqrt(mu / r2Km); // km/s

  // Velocity on transfer ellipse at perihelion (origin) and aphelion (destination):
  // v_t1 = sqrt(mu * (2/r1 - 1/a_t))
  // v_t2 = sqrt(mu * (2/r2 - 1/a_t))
  const vt1 = Math.sqrt(mu * (2 / r1Km - 1 / transferSemiMajorAxisKm));
  const vt2 = Math.sqrt(mu * (2 / r2Km - 1 / transferSemiMajorAxisKm));

  // Delta-V burns (heliocentric injection and circularization):
  const deltaV1Kms = Math.abs(vt1 - v1);
  const deltaV2Kms = Math.abs(v2 - vt2);
  const totalDeltaVKms = deltaV1Kms + deltaV2Kms;

  // Required planetary phase angle at departure:
  // phi = pi * (1 - (1 / (2 * sqrt(2))) * (1 + r1/r2)^1.5)
  // For transfer to outer planet, destination must be ahead by phi radians
  const angularSpeed2 = Math.sqrt(mu / Math.pow(r2Km, 3)); // rad/s
  const destAngleCovered = angularSpeed2 * transferTimeSeconds;
  let phaseAngleRad = Math.PI - destAngleCovered;
  // Normalize to [-pi, pi] or [0, 360]
  let phaseAngleDeg = (phaseAngleRad * 180) / Math.PI;
  while (phaseAngleDeg < 0) phaseAngleDeg += 360;
  if (phaseAngleDeg > 180) phaseAngleDeg -= 360;

  // Launch window recurrence: synodic period
  const synodicPeriodDays = calculateSynodicPeriodDays(origin.orbitalPeriodDays, destination.orbitalPeriodDays);

  const assumptions = [
    'Assumes circular, coplanar planetary orbits (e = 0, i = 0°)',
    'Uses an idealized two-body patched conic gravitational approximation',
    'Assumes impulsive delta-v burns without atmospheric drag or planetary gravitational well Oberth escape penalties',
    'Real interplanetary missions (e.g. NASA Mars Perseverance) use mid-course correction maneuvers and gravity assists'
  ];

  return {
    origin,
    destination,
    r1AU,
    r2AU,
    transferSemiMajorAxisAU,
    transferSemiMajorAxisKm,
    travelTimeDays,
    travelTimeYears,
    deltaV1Kms,
    deltaV2Kms,
    totalDeltaVKms,
    phaseAngleDeg,
    synodicPeriodDays,
    assumptions
  };
}
