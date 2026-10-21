import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateOrbitalPeriodYears,
  calculateOrbitalExtremes,
  calculateOrbitalSpeedKms,
  solveKeplerEquation,
  convertAuToKm,
  convertKmToAu,
  calculateLightTime,
  calculateSynodicPeriodDays,
  calculateHohmannTransfer
} from './astronomy';
import { PLANETS_DATA } from '../data/planets';

test('Kepler\'s Third Law: Earth orbital period at 1.0 AU is 1.0 year', () => {
  const periodEarth = calculateOrbitalPeriodYears(1.0, 1.0);
  assert.ok(Math.abs(periodEarth - 1.0) < 1e-4);
});

test('Kepler\'s Third Law: Jupiter at 5.2 AU has orbital period ~11.86 years', () => {
  const periodJupiter = calculateOrbitalPeriodYears(5.204, 1.0);
  assert.ok(Math.abs(periodJupiter - 11.88) < 0.1);
});

test('Orbital Extremes: Perihelion and Aphelion calculation for Mars', () => {
  // Mars a = 1.524 AU, e = 0.0934
  const { perihelionAU, aphelionAU, semiMinorAxisAU } = calculateOrbitalExtremes(1.524, 0.0934);
  assert.ok(perihelionAU < 1.524);
  assert.ok(aphelionAU > 1.524);
  assert.ok(Math.abs(perihelionAU - 1.3816) < 0.01);
  assert.ok(Math.abs(aphelionAU - 1.6663) < 0.01);
  assert.ok(semiMinorAxisAU < 1.524);
});

test('Kepler\'s equation solver converges accurately for high eccentricity', () => {
  const e = 0.6;
  const M = 1.2;
  const E = solveKeplerEquation(M, e);
  const checkM = E - e * Math.sin(E);
  assert.ok(Math.abs(checkM - M) < 1e-7);
});

test('Distance conversions and light-time calculation', () => {
  const oneAuKm = convertAuToKm(1.0);
  assert.ok(Math.abs(oneAuKm - 149597870.7) < 1.0);
  assert.ok(Math.abs(convertKmToAu(oneAuKm) - 1.0) < 1e-6);

  const sunToEarthLight = calculateLightTime(oneAuKm);
  // ~499 seconds = ~8.32 light-minutes
  assert.ok(Math.abs(sunToEarthLight.totalSeconds - 499) < 2);
  assert.ok(sunToEarthLight.formatted.includes('light-minutes'));
});

test('Synodic period between Earth and Mars (~780 days)', () => {
  const earthDays = 365.256;
  const marsDays = 686.98;
  const synodic = calculateSynodicPeriodDays(earthDays, marsDays);
  // Real Earth-Mars synodic period is ~779.9 days
  assert.ok(Math.abs(synodic - 779.9) < 2.0);
});

test('Hohmann transfer Earth to Mars: transfer time ~259 days, valid delta-V', () => {
  const earth = PLANETS_DATA.find(p => p.id === 'earth')!;
  const mars = PLANETS_DATA.find(p => p.id === 'mars')!;
  assert.ok(earth && mars);

  const transfer = calculateHohmannTransfer(earth, mars);
  // Standard Hohmann transfer time from Earth (1.0 AU) to Mars (1.524 AU) is ~258 to 260 days
  assert.ok(Math.abs(transfer.travelTimeDays - 259) < 5);
  // Departure burn delta-V ~2.9 km/s
  assert.ok(transfer.deltaV1Kms > 2.0 && transfer.deltaV1Kms < 3.5);
  // Total delta-v ~5.6 km/s
  assert.ok(transfer.totalDeltaVKms > 4.5 && transfer.totalDeltaVKms < 6.5);
  // Required phase angle ~44 degrees
  assert.ok(Math.abs(transfer.phaseAngleDeg - 44) < 5);
});
