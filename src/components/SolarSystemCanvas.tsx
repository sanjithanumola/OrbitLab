import React, { useRef, useEffect, useState, useCallback } from 'react';
import { PlanetData, ScaleMode } from '../types';
import { SUN_DATA, PLANETS_DATA } from '../data/planets';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Crosshair,
  Eye,
  EyeOff,
  Info,
  ChevronRight,
  Sparkles,
  ExternalLink,
  Target
} from 'lucide-react';

interface SolarSystemCanvasProps {
  simulationTimeDays: number;
  scaleMode: ScaleMode;
  showOrbits: boolean;
  showLabels: boolean;
  showAsteroidBelt: boolean;
  selectedPlanetId: string | null;
  onSelectPlanet: (planet: PlanetData | null) => void;
  onOpenExplorer: (planet: PlanetData) => void;
  onComparePlanet: (planet: PlanetData) => void;
  followSelected: boolean;
  onToggleFollow: (follow: boolean) => void;
}

interface CameraState {
  x: number;
  y: number;
  zoom: number;
}

interface Particle {
  angle: number;
  distance: number;
  speed: number;
  size: number;
  brightness: number;
}

export const SolarSystemCanvas: React.FC<SolarSystemCanvasProps> = ({
  simulationTimeDays,
  scaleMode,
  showOrbits,
  showLabels,
  showAsteroidBelt,
  selectedPlanetId,
  onSelectPlanet,
  onOpenExplorer,
  onComparePlanet,
  followSelected,
  onToggleFollow,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Camera Pan and Zoom state
  const [camera, setCamera] = useState<CameraState>({ x: 0, y: 0, zoom: 1 });
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const hoveredPlanetRef = useRef<PlanetData | null>(null);
  const [hoveredPlanet, setHoveredPlanet] = useState<PlanetData | null>(null);

  // Particles for Asteroid Belt and Kuiper Belt
  const asteroidParticlesRef = useRef<Particle[]>([]);
  const starfieldRef = useRef<{ x: number; y: number; r: number; alpha: number; flickerSpeed: number }[]>([]);

  // Planet positions cache in screen coordinates for hit testing
  const planetPositionsRef = useRef<Map<string, { x: number; y: number; radius: number; data: PlanetData }>>(new Map());

  // Initialize random starfield & asteroid particles once
  useEffect(() => {
    // Stars
    const stars: { x: number; y: number; r: number; alpha: number; flickerSpeed: number }[] = [];
    for (let i = 0; i < 450; i++) {
      stars.push({
        x: (Math.random() - 0.5) * 3500,
        y: (Math.random() - 0.5) * 3500,
        r: Math.random() * 1.5 + 0.3,
        alpha: Math.random() * 0.7 + 0.3,
        flickerSpeed: Math.random() * 0.03 + 0.01,
      });
    }
    starfieldRef.current = stars;

    // Asteroids in main belt (~2.2 to 3.2 AU)
    const asteroids: Particle[] = [];
    for (let i = 0; i < 500; i++) {
      asteroids.push({
        angle: Math.random() * Math.PI * 2,
        distance: 2.1 + Math.random() * 1.1, // AU
        speed: (Math.random() * 0.2 + 0.9) * 0.2, // relative speed
        size: Math.random() * 1.4 + 0.6,
        brightness: Math.random() * 0.5 + 0.3,
      });
    }
    asteroidParticlesRef.current = asteroids;
  }, []);

  // Compute orbital radius in simulation pixels depending on ScaleMode
  const getOrbitRadiusPx = useCallback((semiMajorAxisAU: number, mode: ScaleMode): number => {
    if (semiMajorAxisAU === 0) return 0;
    if (mode === 'overview') {
      // Balanced aesthetic layout: clearly displays Mercury to Neptune
      // Map planets 0.387 -> 30.05 AU smoothly
      return 60 + Math.pow(semiMajorAxisAU, 0.62) * 88;
    } else {
      // Scale-Aware Mode: linear AU proportional
      return semiMajorAxisAU * 38;
    }
  }, []);

  // Compute planet radius in pixels on canvas
  const getPlanetVisualRadius = useCallback((planet: PlanetData, mode: ScaleMode): number => {
    if (planet.type === 'Star') return 24;
    if (mode === 'overview') {
      if (planet.type === 'Gas Giant') return 14;
      if (planet.type === 'Ice Giant') return 11;
      if (planet.id === 'mercury') return 5;
      return 7; // Earth, Venus, Mars
    } else {
      // In scale mode, planets are drawn slightly larger than true scale for minimal visibility
      if (planet.type === 'Gas Giant') return 12;
      if (planet.type === 'Ice Giant') return 8;
      return 5;
    }
  }, []);

  // Reset camera to center
  const handleResetCamera = useCallback(() => {
    setCamera({ x: 0, y: 0, zoom: 1 });
    onToggleFollow(false);
  }, [onToggleFollow]);

  // Zoom handlers
  const handleZoom = useCallback((factor: number) => {
    setCamera(prev => ({
      ...prev,
      zoom: Math.max(0.18, Math.min(6.5, prev.zoom * factor)),
    }));
  }, []);

  // Fullscreen handler
  const handleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  // Main Canvas Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const render = () => {
      const dpr = window.devicePixelRatio || 1;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);

      // Deep space background gradient
      const bgGrad = ctx.createRadialGradient(width / 2, height / 2, 50, width / 2, height / 2, Math.max(width, height) * 0.85);
      bgGrad.addColorStop(0, '#0a0f26');
      bgGrad.addColorStop(0.5, '#050818');
      bgGrad.addColorStop(1, '#02030a');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Save center origin and camera transform
      ctx.save();
      const centerX = width / 2 + camera.x;
      const centerY = height / 2 + camera.y;

      ctx.translate(centerX, centerY);
      ctx.scale(camera.zoom, camera.zoom);

      // 1. Draw Starfield
      const time = performance.now() * 0.001;
      starfieldRef.current.forEach(star => {
        const twinkle = Math.sin(time * star.flickerSpeed * 20 + star.x) * 0.25;
        ctx.fillStyle = `rgba(225, 235, 255, ${Math.max(0.1, Math.min(1, star.alpha + twinkle))})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // 2. Draw Asteroid Belt
      if (showAsteroidBelt) {
        const beltInnerRadius = getOrbitRadiusPx(2.2, scaleMode);
        const beltOuterRadius = getOrbitRadiusPx(3.2, scaleMode);
        const beltThickness = beltOuterRadius - beltInnerRadius;

        ctx.fillStyle = 'rgba(160, 175, 200, 0.45)';
        asteroidParticlesRef.current.forEach(ast => {
          const rPx = beltInnerRadius + (ast.distance - 2.2) * (beltThickness / 1.0);
          const currentAngle = ast.angle + (simulationTimeDays * 0.0015 * ast.speed);
          const x = Math.cos(currentAngle) * rPx;
          const y = Math.sin(currentAngle) * rPx;

          ctx.beginPath();
          ctx.arc(x, y, ast.size / Math.max(0.8, camera.zoom * 0.7), 0, Math.PI * 2);
          ctx.fill();
        });
      }

      // 3. Clear planet positions hit cache
      planetPositionsRef.current.clear();

      // Hit area for the Sun
      planetPositionsRef.current.set(SUN_DATA.id, {
        x: 0,
        y: 0,
        radius: 28,
        data: SUN_DATA,
      });

      // 4. Draw Planetary Orbits & Planets
      PLANETS_DATA.forEach((planet) => {
        const orbitRadius = getOrbitRadiusPx(planet.semiMajorAxisAU, scaleMode);
        const isSelected = selectedPlanetId === planet.id;
        const isHovered = hoveredPlanetRef.current?.id === planet.id;

        // Current orbital position angle (Keplerian mean approximation)
        // Angle theta = 2*PI * (simulationTimeDays / planet.orbitalPeriodDays)
        const meanMotion = (2 * Math.PI) / planet.orbitalPeriodDays;
        const currentAngle = (simulationTimeDays * meanMotion) % (2 * Math.PI);

        // Account for eccentricity: simple Keplerian shift (Sun at focus)
        const e = planet.eccentricity;
        const r = orbitRadius * (1 - e * Math.cos(currentAngle));
        const planetX = Math.cos(currentAngle) * r;
        const planetY = Math.sin(currentAngle) * r;

        // Save position for hit-testing and follow mode
        const visualRadius = getPlanetVisualRadius(planet, scaleMode);
        planetPositionsRef.current.set(planet.id, {
          x: planetX,
          y: planetY,
          radius: visualRadius,
          data: planet,
        });

        // Draw Orbit Path
        if (showOrbits) {
          ctx.beginPath();
          ctx.arc(0, 0, orbitRadius, 0, Math.PI * 2);
          if (isSelected) {
            ctx.strokeStyle = 'rgba(34, 211, 238, 0.8)';
            ctx.lineWidth = 1.8 / camera.zoom;
            ctx.setLineDash([6 / camera.zoom, 4 / camera.zoom]);
          } else if (isHovered) {
            ctx.strokeStyle = 'rgba(147, 197, 253, 0.6)';
            ctx.lineWidth = 1.4 / camera.zoom;
            ctx.setLineDash([]);
          } else {
            ctx.strokeStyle = 'rgba(148, 163, 184, 0.16)';
            ctx.lineWidth = 1.0 / camera.zoom;
            ctx.setLineDash([]);
          }
          ctx.stroke();
          ctx.setLineDash([]);
        }

        // Selected orbit highlight glow
        if (isSelected) {
          ctx.beginPath();
          ctx.arc(planetX, planetY, visualRadius + 7 / camera.zoom, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(6, 182, 212, 0.9)';
          ctx.lineWidth = 2 / camera.zoom;
          ctx.stroke();

          // Outer pulsing ring
          const pulse = (Math.sin(time * 4) + 1) * 3;
          ctx.beginPath();
          ctx.arc(planetX, planetY, visualRadius + 11 / camera.zoom + pulse / camera.zoom, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(6, 182, 212, 0.3)';
          ctx.lineWidth = 1 / camera.zoom;
          ctx.stroke();
        }

        // Draw Saturn's Rings
        if (planet.hasRings && planet.id === 'saturn') {
          ctx.save();
          ctx.translate(planetX, planetY);
          ctx.rotate(0.45); // Ring inclination
          ctx.beginPath();
          ctx.ellipse(0, 0, visualRadius * 2.5, visualRadius * 0.9, 0, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(234, 179, 8, 0.65)';
          ctx.lineWidth = 4 / camera.zoom;
          ctx.stroke();

          ctx.beginPath();
          ctx.ellipse(0, 0, visualRadius * 2.8, visualRadius * 1.05, 0, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(254, 240, 138, 0.4)';
          ctx.lineWidth = 2 / camera.zoom;
          ctx.stroke();
          ctx.restore();
        }

        // Draw Uranus's Rings
        if (planet.hasRings && planet.id === 'uranus') {
          ctx.save();
          ctx.translate(planetX, planetY);
          ctx.rotate(1.5); // Uranus on side
          ctx.beginPath();
          ctx.ellipse(0, 0, visualRadius * 1.9, visualRadius * 0.7, 0, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(103, 232, 249, 0.4)';
          ctx.lineWidth = 1.5 / camera.zoom;
          ctx.stroke();
          ctx.restore();
        }

        // Draw Planet Body with Atmospheric Glow
        const planetGrad = ctx.createRadialGradient(
          planetX - visualRadius * 0.35,
          planetY - visualRadius * 0.35,
          visualRadius * 0.1,
          planetX,
          planetY,
          visualRadius
        );
        planetGrad.addColorStop(0, planet.colors.atmosphere);
        planetGrad.addColorStop(0.7, planet.colors.base);
        planetGrad.addColorStop(1, planet.colors.accent);

        ctx.beginPath();
        ctx.arc(planetX, planetY, visualRadius, 0, Math.PI * 2);
        ctx.fillStyle = planetGrad;
        ctx.fill();

        // Atmospheric soft edge rim
        ctx.beginPath();
        ctx.arc(planetX, planetY, visualRadius + 1.2 / camera.zoom, 0, Math.PI * 2);
        ctx.strokeStyle = planet.colors.atmosphere;
        ctx.lineWidth = 0.8 / camera.zoom;
        ctx.globalAlpha = 0.45;
        ctx.stroke();
        ctx.globalAlpha = 1.0;

        // Draw Earth's Moon if zoomed in
        if (planet.id === 'earth' && camera.zoom > 0.8) {
          const moonOrbitDist = visualRadius + 11 / camera.zoom;
          const moonAngle = (simulationTimeDays / 27.32) * Math.PI * 2;
          const moonX = planetX + Math.cos(moonAngle) * moonOrbitDist;
          const moonY = planetY + Math.sin(moonAngle) * moonOrbitDist;

          // Moon orbit path
          ctx.beginPath();
          ctx.arc(planetX, planetY, moonOrbitDist, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
          ctx.lineWidth = 0.6 / camera.zoom;
          ctx.stroke();

          // Moon body
          ctx.beginPath();
          ctx.arc(moonX, moonY, 1.8 / Math.max(0.6, camera.zoom * 0.6), 0, Math.PI * 2);
          ctx.fillStyle = '#cbd5e1';
          ctx.fill();
        }

        // Draw Labels
        if (showLabels) {
          ctx.save();
          ctx.font = `${Math.max(10, Math.min(14, 11 / Math.pow(camera.zoom, 0.4)))}px 'Plus Jakarta Sans', sans-serif`;
          ctx.textAlign = 'center';

          // Text shadow
          ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
          ctx.fillText(planet.name, planetX + 1, planetY + visualRadius + 15 / camera.zoom + 1);

          ctx.fillStyle = isSelected ? '#38bdf8' : isHovered ? '#ffffff' : '#94a3b8';
          ctx.fillText(planet.name, planetX, planetY + visualRadius + 15 / camera.zoom);

          // Subtitle distance
          ctx.font = `${Math.max(8, Math.min(11, 9 / Math.pow(camera.zoom, 0.4)))}px 'JetBrains Mono', monospace`;
          ctx.fillStyle = 'rgba(148, 163, 184, 0.7)';
          ctx.fillText(`${planet.semiMajorAxisAU} AU`, planetX, planetY + visualRadius + 26 / camera.zoom);
          ctx.restore();
        }
      });

      // 5. Draw the Sun in the Center
      const sunPulse = Math.sin(time * 2) * 2;
      const sunRadius = 24 + sunPulse;

      // Outer Corona Glow
      const coronaGrad = ctx.createRadialGradient(0, 0, 15, 0, 0, 85);
      coronaGrad.addColorStop(0, 'rgba(251, 191, 36, 0.9)');
      coronaGrad.addColorStop(0.2, 'rgba(245, 158, 11, 0.5)');
      coronaGrad.addColorStop(0.6, 'rgba(239, 68, 68, 0.15)');
      coronaGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = coronaGrad;
      ctx.beginPath();
      ctx.arc(0, 0, 85, 0, Math.PI * 2);
      ctx.fill();

      // Sun Core
      const sunCoreGrad = ctx.createRadialGradient(-5, -5, 2, 0, 0, sunRadius);
      sunCoreGrad.addColorStop(0, '#ffffff');
      sunCoreGrad.addColorStop(0.3, '#fef08a');
      sunCoreGrad.addColorStop(0.7, '#f59e0b');
      sunCoreGrad.addColorStop(1, '#ea580c');
      ctx.fillStyle = sunCoreGrad;
      ctx.beginPath();
      ctx.arc(0, 0, sunRadius, 0, Math.PI * 2);
      ctx.fill();

      if (showLabels) {
        ctx.font = `${Math.max(10, Math.min(13, 11 / Math.pow(camera.zoom, 0.4)))}px 'Plus Jakarta Sans', sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillStyle = '#fde68a';
        ctx.fillText('The Sun', 0, sunRadius + 16 / camera.zoom);
      }

      ctx.restore(); // Restore camera transform
      ctx.restore(); // Restore DPR scale

      // If followSelected is true and a planet is selected, smoothly center camera on it
      if (followSelected && selectedPlanetId) {
        const targetPos = planetPositionsRef.current.get(selectedPlanetId);
        if (targetPos) {
          setCamera(prev => ({
            ...prev,
            x: prev.x + (-targetPos.x * prev.zoom - prev.x) * 0.1,
            y: prev.y + (-targetPos.y * prev.zoom - prev.y) * 0.1,
          }));
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrameId);
  }, [
    camera,
    scaleMode,
    showOrbits,
    showLabels,
    showAsteroidBelt,
    selectedPlanetId,
    simulationTimeDays,
    followSelected,
    getOrbitRadiusPx,
    getPlanetVisualRadius,
  ]);

  // Mouse / Touch Event Handlers for Panning & Zooming
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = true;
    dragStartRef.current = { x: e.clientX - camera.x, y: e.clientY - camera.y };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (isDraggingRef.current) {
      if (followSelected) onToggleFollow(false);
      setCamera(prev => ({
        ...prev,
        x: e.clientX - dragStartRef.current.x,
        y: e.clientY - dragStartRef.current.y,
      }));
      return;
    }

    // Check hit hover on planets
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const centerX = canvas.clientWidth / 2 + camera.x;
    const centerY = canvas.clientHeight / 2 + camera.y;

    // Convert mouse to world coordinates
    const worldX = (mouseX - centerX) / camera.zoom;
    const worldY = (mouseY - centerY) / camera.zoom;

    let foundPlanet: PlanetData | null = null;
    for (const [, body] of planetPositionsRef.current.entries()) {
      const dx = worldX - body.x;
      const dy = worldY - body.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const hitRadius = Math.max(body.radius * 1.5, 18 / camera.zoom);

      if (dist <= hitRadius) {
        foundPlanet = body.data;
        break;
      }
    }

    hoveredPlanetRef.current = foundPlanet;
    setHoveredPlanet(foundPlanet);
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const centerX = canvas.clientWidth / 2 + camera.x;
    const centerY = canvas.clientHeight / 2 + camera.y;

    const worldX = (mouseX - centerX) / camera.zoom;
    const worldY = (mouseY - centerY) / camera.zoom;

    let clickedPlanet: PlanetData | null = null;
    for (const [, body] of planetPositionsRef.current.entries()) {
      const dx = worldX - body.x;
      const dy = worldY - body.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const hitRadius = Math.max(body.radius * 1.6, 20 / camera.zoom);

      if (dist <= hitRadius) {
        clickedPlanet = body.data;
        break;
      }
    }

    onSelectPlanet(clickedPlanet);
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.15 : 0.87;
    handleZoom(zoomFactor);
  };

  // Selected planet data lookup
  const selectedPlanet = PLANETS_DATA.find(p => p.id === selectedPlanetId) || (selectedPlanetId === 'sun' ? SUN_DATA : null);

  return (
    <div ref={containerRef} className="relative w-full h-full min-h-[500px] overflow-hidden select-none bg-black">
      {/* Simulation Canvas */}
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={handleClick}
        onWheel={handleWheel}
        className="w-full h-full cursor-grab active:cursor-grabbing block"
        style={{ touchAction: 'none' }}
        aria-label="Solar System interactive orbital simulation canvas"
      />

      {/* Educational Scale Banner */}
      <div className="absolute top-3 left-3 pointer-events-none flex flex-col gap-1 z-10">
        <div className="flex items-center gap-2 bg-[#050818]/85 backdrop-blur-md px-3 py-1.5 rounded-lg border border-cyan-500/20 shadow-lg">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-xs font-semibold text-slate-200">
            {scaleMode === 'overview' ? 'Overview Mode (Optimized Layout)' : 'Scale-Aware Mode (True AU Ratios)'}
          </span>
        </div>
        <p className="text-[11px] text-slate-400 max-w-xs bg-slate-950/70 backdrop-blur-sm px-2.5 py-1 rounded border border-white/5">
          {scaleMode === 'overview'
            ? 'Planet orbits are spaced for visual clarity and interaction across all 8 planets.'
            : 'Distance is strictly proportional (1 AU = 38 px). Notice the vast emptiness of the outer Solar System!'}
        </p>
      </div>

      {/* Floating Canvas Camera Controls (Right side) */}
      <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-10">
        <button
          onClick={() => handleZoom(1.25)}
          className="w-9 h-9 rounded-lg bg-[#0a1024]/80 backdrop-blur-md border border-white/10 hover:border-cyan-400/50 hover:bg-cyan-950/60 text-slate-200 flex items-center justify-center transition-all shadow-lg"
          title="Zoom In"
          aria-label="Zoom in simulation"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleZoom(0.8)}
          className="w-9 h-9 rounded-lg bg-[#0a1024]/80 backdrop-blur-md border border-white/10 hover:border-cyan-400/50 hover:bg-cyan-950/60 text-slate-200 flex items-center justify-center transition-all shadow-lg"
          title="Zoom Out"
          aria-label="Zoom out simulation"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={handleResetCamera}
          className="w-9 h-9 rounded-lg bg-[#0a1024]/80 backdrop-blur-md border border-white/10 hover:border-cyan-400/50 hover:bg-cyan-950/60 text-slate-200 flex items-center justify-center transition-all shadow-lg"
          title="Reset Camera to Sun"
          aria-label="Reset camera"
        >
          <Crosshair className="w-4 h-4" />
        </button>
        <button
          onClick={handleFullscreen}
          className="w-9 h-9 rounded-lg bg-[#0a1024]/80 backdrop-blur-md border border-white/10 hover:border-cyan-400/50 hover:bg-cyan-950/60 text-slate-200 flex items-center justify-center transition-all shadow-lg"
          title="Toggle Fullscreen"
          aria-label="Toggle full screen"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* Hover Tooltip */}
      {hoveredPlanet && (
        <div
          className="absolute bottom-20 left-1/2 -translate-x-1/2 pointer-events-none bg-[#050818]/90 backdrop-blur-md border border-cyan-400/30 px-3.5 py-1.5 rounded-full shadow-2xl flex items-center gap-2.5 z-20 animate-fade-in"
        >
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: hoveredPlanet.colors.base }} />
          <span className="text-xs font-semibold text-white">{hoveredPlanet.name}</span>
          <span className="text-[11px] text-slate-400 font-mono">
            {hoveredPlanet.semiMajorAxisAU > 0 ? `${hoveredPlanet.semiMajorAxisAU} AU` : 'Central Star'}
          </span>
          <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300">
            Click to inspect
          </span>
        </div>
      )}

      {/* Selected Planet Quick Inspector Card (Bottom-Left or Pop-Up) */}
      {selectedPlanet && (
        <div className="absolute bottom-4 left-4 z-20 max-w-sm w-full bg-[#070b1e]/95 backdrop-blur-xl border border-cyan-500/30 rounded-xl p-4 shadow-2xl animate-fade-in-up">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex items-center gap-2.5">
              <div
                className="w-5 h-5 rounded-full shadow-md shrink-0"
                style={{ backgroundColor: selectedPlanet.colors.base }}
              />
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <span>{selectedPlanet.name}</span>
                  <span className="text-[10px] font-normal text-slate-400 italic">({selectedPlanet.latinName})</span>
                </h3>
                <p className="text-[11px] text-cyan-400 font-medium">{selectedPlanet.type}</p>
              </div>
            </div>
            <button
              onClick={() => onSelectPlanet(null)}
              className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-white/5 text-xs"
              aria-label="Close inspector"
            >
              ✕
            </button>
          </div>

          <p className="text-xs text-slate-300 line-clamp-2 mb-3 leading-relaxed">
            {selectedPlanet.description}
          </p>

          <div className="grid grid-cols-2 gap-2 text-xs mb-3 font-mono bg-slate-900/60 p-2 rounded-lg border border-white/5">
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Distance</span>
              <span className="text-slate-200 font-semibold">{selectedPlanet.semiMajorAxisAU} AU</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Period</span>
              <span className="text-slate-200 font-semibold">
                {selectedPlanet.orbitalPeriodYears > 0 ? `${selectedPlanet.orbitalPeriodYears} yr` : 'N/A'}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Diameter</span>
              <span className="text-slate-200 font-semibold">{selectedPlanet.diameterKm.toLocaleString()} km</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Moons</span>
              <span className="text-slate-200 font-semibold">{selectedPlanet.knownMoons}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenExplorer(selectedPlanet)}
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-md shadow-cyan-600/30 transition-colors"
            >
              <span>Explore Details</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            {selectedPlanet.type !== 'Star' && (
              <button
                onClick={() => onToggleFollow(!followSelected)}
                className={`flex items-center gap-1 py-1.5 px-2.5 rounded-lg border text-xs font-medium transition-colors ${
                  followSelected
                    ? 'bg-amber-500/20 border-amber-400/50 text-amber-300'
                    : 'bg-slate-800/80 border-white/10 hover:border-white/20 text-slate-200'
                }`}
                title={followSelected ? 'Cancel follow camera' : 'Center and follow planet orbit'}
              >
                <Target className="w-3.5 h-3.5" />
                <span>{followSelected ? 'Following' : 'Follow'}</span>
              </button>
            )}

            <button
              onClick={() => onComparePlanet(selectedPlanet)}
              className="py-1.5 px-2.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-white/10 text-xs font-medium transition-colors"
              title="Add to Comparison Lab"
            >
              Compare
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
