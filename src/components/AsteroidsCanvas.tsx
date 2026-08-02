import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  Asteroid,
  AsteroidType,
  Bullet,
  UFO,
  Collectible,
  Particle,
  FloatingText,
  Shockwave,
  BigBanner,
  Drone,
  BlackHole,
  IonizingNebula,
  BinaryPlasmaCore,
  PlasmaCoreNode,
  GameMode,
  ControlScheme
} from '../types';
import { soundEngine } from '../audio/soundEngine';

// --- TRON VECTOR RED HEXAGON ENEMY SPRITE CACHE ---
let cachedRedHexOuterCanvas: HTMLCanvasElement | null = null;
let cachedRedHexInnerCanvas: HTMLCanvasElement | null = null;

function getRedHexagonOuterSprite(): HTMLCanvasElement {
  if (cachedRedHexOuterCanvas) return cachedRedHexOuterCanvas;

  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  const cx = 64;
  const cy = 64;
  const R1 = 28; // Outer Hexagon vertex radius
  const R_spike = 36; // Spiked outer laser frame tips
  const R2 = 18; // Inner Interlocking Hexagon radius

  ctx.save();
  ctx.shadowBlur = 12;
  ctx.shadowColor = '#ff0055';

  // 1. Multi-Layered Outer Interlocking Spiked Double-Hexagon Frame
  ctx.strokeStyle = '#ff0055';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const angle1 = (i * Math.PI) / 3;
    const angleMid = angle1 + Math.PI / 6;
    const angle2 = ((i + 1) * Math.PI) / 3;

    const x1 = cx + Math.cos(angle1) * R1;
    const y1 = cy + Math.sin(angle1) * R1;

    const xSpike = cx + Math.cos(angleMid) * R_spike;
    const ySpike = cy + Math.sin(angleMid) * R_spike;

    const x2 = cx + Math.cos(angle2) * R1;
    const y2 = cy + Math.sin(angle2) * R1;

    if (i === 0) ctx.moveTo(x1, y1);
    ctx.lineTo(xSpike, ySpike);
    ctx.lineTo(x2, y2);
  }
  ctx.closePath();
  ctx.stroke();

  // 2. Inner Interlocking Hexagon (Staggered offset by 30 deg)
  ctx.strokeStyle = '#ff2a55';
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const angle = (i * Math.PI) / 3 + Math.PI / 6;
    const x = cx + Math.cos(angle) * R2;
    const y = cy + Math.sin(angle) * R2;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.stroke();

  // 3. Interlocking TRON Hyper-Cube Wireframe Struts
  ctx.strokeStyle = '#ff6688';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const outerA = (i * Math.PI) / 3;
    const ox = cx + Math.cos(outerA) * R1;
    const oy = cy + Math.sin(outerA) * R1;

    const innerA1 = outerA - Math.PI / 6;
    const innerA2 = outerA + Math.PI / 6;

    ctx.moveTo(ox, oy);
    ctx.lineTo(cx + Math.cos(innerA1) * R2, cy + Math.sin(innerA1) * R2);

    ctx.moveTo(ox, oy);
    ctx.lineTo(cx + Math.cos(innerA2) * R2, cy + Math.sin(innerA2) * R2);
  }
  ctx.stroke();

  // 4. Razor White Laser Highlights & Node Caps
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const angleMid = (i * Math.PI) / 3 + Math.PI / 6;
    const xSpike = cx + Math.cos(angleMid) * R_spike;
    const ySpike = cy + Math.sin(angleMid) * R_spike;

    ctx.moveTo(xSpike - 2.5, ySpike);
    ctx.lineTo(xSpike + 2.5, ySpike);
    ctx.moveTo(xSpike, ySpike - 2.5);
    ctx.lineTo(xSpike, ySpike + 2.5);
  }
  ctx.stroke();

  // Outer Spiked Node Lights
  for (let i = 0; i < 6; i++) {
    const angleMid = (i * Math.PI) / 3 + Math.PI / 6;
    const xSpike = cx + Math.cos(angleMid) * R_spike;
    const ySpike = cy + Math.sin(angleMid) * R_spike;

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(xSpike, ySpike, 2.2, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
  cachedRedHexOuterCanvas = canvas;
  return canvas;
}

function getRedHexagonInnerSprite(): HTMLCanvasElement {
  if (cachedRedHexInnerCanvas) return cachedRedHexInnerCanvas;

  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  const cx = 64;
  const cy = 64;
  const R = 14;

  ctx.save();
  ctx.shadowBlur = 10;
  ctx.shadowColor = '#ff0055';

  // Inner Hexagon Ring
  ctx.strokeStyle = '#ff0055';
  ctx.lineWidth = 2.0;
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const angle = (i * Math.PI) / 3;
    const x = cx + Math.cos(angle) * R;
    const y = cy + Math.sin(angle) * R;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.stroke();

  // Faceted Inner Diagonal Lines
  ctx.strokeStyle = 'rgba(255, 120, 160, 0.85)';
  ctx.lineWidth = 1.0;
  ctx.beginPath();
  for (let i = 0; i < 3; i++) {
    const angle = (i * Math.PI) / 3;
    const x1 = cx + Math.cos(angle) * R;
    const y1 = cy + Math.sin(angle) * R;
    const x2 = cx - Math.cos(angle) * R;
    const y2 = cy - Math.sin(angle) * R;
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
  }
  ctx.stroke();

  ctx.restore();
  cachedRedHexInnerCanvas = canvas;
  return canvas;
}

interface AsteroidsCanvasProps {
  gameMode: GameMode;
  initialWave?: number;
  controlScheme: ControlScheme;
  isPaused: boolean;
  crtFilter: boolean;
  screenShakeEnabled: boolean;
  onScoreUpdate: (score: number) => void;
  onWaveUpdate: (wave: number) => void;
  onLivesUpdate: (lives: number) => void;
  onEmpCountUpdate: (count: number) => void;
  onEmpRechargeProgressUpdate?: (progress: number) => void;
  onHyperspaceCooldownUpdate: (cooldown: number) => void;
  onHullPowerUpdate?: (hull: number, maxHull: number) => void;
  onActivePowerupsUpdate: (powerups: any) => void;
  onHudProximityUpdate?: (isNear: boolean) => void;
  onGameOver: (finalScore: number, finalWave: number, asteroidsCount: number, accuracy: number, maxCombo: number, ufosDestroyed: number, bossDamageDealt: number) => void;
  onStatsRecord: (asteroids: number, ufos: number, shotsFired: number, shotsHit: number, empUsed: number, finalScore: number, finalWave: number) => void;
  onUnlockAchievement: (id: string) => void;
}

export const AsteroidsCanvas: React.FC<AsteroidsCanvasProps> = ({
  // Note: Fullscreen integration logic (Browser Fullscreen API toggle)
  // is managed at the App.tsx root and passed down to HUD/StartScreen
  // to avoid re-rendering and stealing focus from this canvas component.
  gameMode,
  initialWave,
  controlScheme,
  isPaused,
  crtFilter,
  screenShakeEnabled,
  onScoreUpdate,
  onWaveUpdate,
  onLivesUpdate,
  onEmpCountUpdate,
  onEmpRechargeProgressUpdate,
  onHyperspaceCooldownUpdate,
  onHullPowerUpdate,
  onActivePowerupsUpdate,
  onHudProximityUpdate,
  onGameOver,
  onStatsRecord,
  onUnlockAchievement
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isInitializedRef = useRef(false);
  const isNearHudRef = useRef(false);
  const bossEncounteredRef = useRef(false);
  const controlsHintTimerRef = useRef(360); // 6 seconds on screen controls guide
  const empRechargeTimerRef = useRef(3600); // 60 seconds auto recharge timer for EMP bomb

  // Stable callbacks ref to prevent effect re-triggering & unwanted resets
  const callbacksRef = useRef({
    onScoreUpdate,
    onWaveUpdate,
    onLivesUpdate,
    onEmpCountUpdate,
    onEmpRechargeProgressUpdate,
    onHyperspaceCooldownUpdate,
    onHullPowerUpdate,
    onActivePowerupsUpdate,
    onHudProximityUpdate,
    onGameOver,
    onStatsRecord,
    onUnlockAchievement
  });

  useEffect(() => {
    callbacksRef.current = {
      onScoreUpdate,
      onWaveUpdate,
      onLivesUpdate,
      onEmpCountUpdate,
      onEmpRechargeProgressUpdate,
      onHyperspaceCooldownUpdate,
      onHullPowerUpdate,
      onActivePowerupsUpdate,
      onHudProximityUpdate,
      onGameOver,
      onStatsRecord,
      onUnlockAchievement
    };
  });

  // State refs for animation loop
  const gameStateRef = useRef({
    score: 0,
    nextExtraLifeScore: 50000,
    wave: initialWave || (gameMode === 'boss_rush' ? 5 : 1),
    lives: gameMode === 'zen' ? 99 : 3,
    empCount: 1,
    hyperspaceCooldown: 0,
    gameRunning: true,
    mousePos: { x: 0, y: 0 },
    keys: {} as Record<string, boolean>,
    touchThrust: false,
    touchReverse: false,
    touchLeft: false,
    touchRight: false,
    shakeTimer: 0,
    shakeIntensity: 0,
    comboCount: 0,
    comboTimer: 0,
    maxCombo: 0,
    shotsFired: 0,
    shotsHit: 0,
    asteroidsDestroyed: 0,
    ufosDestroyed: 0,
    empUsed: 0,
    bossDamageDealt: 0,
    consecutiveHits: 0
  });

  // Power-up duration timers (in frames)
  const powerupTimersRef = useRef({
    tripleShot: 0,
    shield: 0,
    golden: 0,
    laser: 0,
    drone: 0,
    magnet: 0,
    timewarp: 0,
    repulsor: 0
  });

  // Entities
  const shipRef = useRef({
    x: 0,
    y: 0,
    radius: 16,
    angle: 0,
    rotation: 0,
    thrusting: false,
    reverse: false,
    thrust: { x: 0, y: 0 },
    alive: true,
    invincibleTimer: 0,
    hullPower: 100,
    maxHullPower: 100,
    hitRegenDelay: 0,
    frozenTimer: 0
  });

  const asteroidsRef = useRef<Asteroid[]>([]);
  const bulletsRef = useRef<Bullet[]>([]);
  const ufosRef = useRef<UFO[]>([]);
  const ufoBulletsRef = useRef<Bullet[]>([]);
  const ufoSpawnTimerRef = useRef(0);
  const collectiblesRef = useRef<Collectible[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const trailParticlesRef = useRef<Particle[]>([]);
  const floatingTextsRef = useRef<FloatingText[]>([]);
  const shockwavesRef = useRef<Shockwave[]>([]);
  const bigBannersRef = useRef<BigBanner[]>([]);
  const waveClearTimerRef = useRef(0);
  const dronesRef = useRef<Drone[]>([]);
  const blackHolesRef = useRef<BlackHole[]>([]);
  const blackHoleSpawnTimerRef = useRef(0);
  const nebulasRef = useRef<IonizingNebula[]>([]);
  const isShipInNebulaRef = useRef<boolean>(false);
  const plasmaCoresRef = useRef<BinaryPlasmaCore[]>([]);
  const plasmaCoreSpawnTimerRef = useRef(0);
  const starsRef = useRef<{ x: number; y: number; size: number; alpha: number; speed: number }[]>([]);

  // Shield Rebalancing & Staggered Off-Screen Spawning Refs
  const shieldConsecutivePickupsRef = useRef(0);
  const dropsThisFrameRef = useRef(0);
  const spawnQueueRef = useRef<{
    type: 'asteroid' | 'ufo' | 'nebula' | 'plasmaCore';
    entity: Asteroid | UFO | IonizingNebula | BinaryPlasmaCore;
    delayFrames: number;
  }[]>([]);

  // Spawn Ionizing Nebula (EMP Hazard Cloud) with TRON Vector Geometry
  const createIonizingNebula = useCallback((x?: number, y?: number): IonizingNebula => {
    const w = canvasRef.current?.width || window.innerWidth;
    const h = canvasRef.current?.height || window.innerHeight;

    let nx = x;
    let ny = y;

    if (nx === undefined || ny === undefined) {
      let safe = false;
      let attempts = 0;
      while (!safe && attempts < 30) {
        attempts++;
        const rx = 100 + Math.random() * (w - 200);
        const ry = 100 + Math.random() * (h - 200);
        const distToShip = Math.hypot(rx - shipRef.current.x, ry - shipRef.current.y);
        if (distToShip >= 380) {
          nx = rx;
          ny = ry;
          safe = true;
        }
      }
      if (!safe) {
        nx = shipRef.current.x > w / 2 ? w * 0.2 : w * 0.8;
        ny = shipRef.current.y > h / 2 ? h * 0.2 : h * 0.8;
      }
    }

    const radius = 140 + Math.random() * 35; // ~140-175px radius (10-15% total screen area)
    const numOuter = 14;
    const outerVertices: { x: number; y: number }[] = [];

    // Sprawling network of jagged interlocking vector boundary nodes
    for (let i = 0; i < numOuter; i++) {
      const angle = (i / numOuter) * Math.PI * 2;
      const rVar = radius * (0.72 + Math.sin(i * 2.3) * 0.28 + Math.random() * 0.15);
      outerVertices.push({
        x: Math.cos(angle) * rVar,
        y: Math.sin(angle) * rVar
      });
    }

    // Inner fractal data-field nodes
    const numInner = 10;
    const innerNodes: { x: number; y: number }[] = [];
    for (let i = 0; i < numInner; i++) {
      const angle = (i / numInner) * Math.PI * 2 + Math.random() * 0.3;
      const dist = radius * (0.2 + Math.random() * 0.55);
      innerNodes.push({
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist
      });
    }

    // Interlocking mesh connections
    const meshConnections: [number, number][] = [];
    for (let i = 0; i < numInner; i++) {
      meshConnections.push([i, (i + 1) % numInner]);
      const outerIdx = Math.floor((i / numInner) * numOuter);
      meshConnections.push([i, numInner + outerIdx]);
      meshConnections.push([i, numInner + ((outerIdx + 3) % numOuter)]);
    }

    return {
      id: Math.random().toString(),
      x: nx,
      y: ny,
      radius,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.002,
      outerVertices,
      innerNodes,
      meshConnections,
      internalArcs: [],
      flicker: 1,
      health: 18,
      maxHealth: 18,
      damageFlash: 0
    };
  }, []);

  // Trigger Big Screen Announcement Banner
  const triggerBigBanner = useCallback((
    title: string,
    subtitle?: string,
    color: string = '#00ffcc',
    glowColor: string = 'rgba(0, 255, 204, 0.8)',
    duration: number = 120
  ) => {
    bigBannersRef.current = [{
      id: Math.random().toString(),
      title,
      subtitle,
      color,
      glowColor,
      life: duration,
      maxLife: duration
    }];
  }, []);

  // Spawn Black Hole Singularity
  const spawnBlackHole = useCallback((x?: number, y?: number) => {
    const w = canvasRef.current?.width || window.innerWidth;
    const h = canvasRef.current?.height || window.innerHeight;

    let bx = x;
    let by = y;

    if (bx === undefined || by === undefined) {
      let safe = false;
      let attempts = 0;
      while (!safe && attempts < 40) {
        attempts++;
        const rx = 80 + Math.random() * (w - 160);
        const ry = 80 + Math.random() * (h - 160);
        const distToShip = Math.hypot(rx - shipRef.current.x, ry - shipRef.current.y);
        if (distToShip >= 420) {
          bx = rx;
          by = ry;
          safe = true;
        }
      }
      if (!safe) {
        bx = shipRef.current.x > w / 2 ? w * 0.15 : w * 0.85;
        by = shipRef.current.y > h / 2 ? h * 0.15 : h * 0.85;
      }
    }

    const moveAngle = Math.random() * Math.PI * 2;
    const speed = 0.35 + Math.random() * 0.45;

    const bh: BlackHole = {
      id: Math.random().toString(),
      x: bx,
      y: by,
      vx: Math.cos(moveAngle) * speed,
      vy: Math.sin(moveAngle) * speed,
      radius: 30,
      pullRadius: 280,
      rotation: 0,
      swirlSpeed: 0.04,
      health: 120,
      maxHealth: 120,
      pulse: 0
    };

    blackHolesRef.current.push(bh);
    shockwavesRef.current.push({
      x: bx,
      y: by,
      radius: 10,
      maxRadius: 220,
      life: 45,
      color: '#a855f7'
    });
    soundEngine.playSound('emp');

    triggerBigBanner(
      '⚠️ BLACK HOLE SINGULARITY DETECTED! ⚠️',
      'GRAVITATIONAL ANOMALY INBOUND • BEWARE THE EVENT HORIZON',
      '#a855f7',
      'rgba(168, 85, 247, 0.9)',
      130
    );
  }, [triggerBigBanner]);

  // Spawn Binary Plasma Core (Dual Orbital Stellar Core Hazard)
  const spawnBinaryPlasmaCore = useCallback((x?: number, y?: number) => {
    const w = canvasRef.current?.width || window.innerWidth;
    const h = canvasRef.current?.height || window.innerHeight;

    let cx = x;
    let cy = y;

    if (cx === undefined || cy === undefined) {
      let safe = false;
      let attempts = 0;
      while (!safe && attempts < 30) {
        attempts++;
        const rx = 120 + Math.random() * (w - 240);
        const ry = 120 + Math.random() * (h - 240);
        const distToShip = Math.hypot(rx - shipRef.current.x, ry - shipRef.current.y);
        if (distToShip >= 400) {
          cx = rx;
          cy = ry;
          safe = true;
        }
      }
      if (!safe) {
        cx = shipRef.current.x > w / 2 ? w * 0.2 : w * 0.8;
        cy = shipRef.current.y > h / 2 ? h * 0.2 : h * 0.8;
      }
    }

    const driftAngle = Math.random() * Math.PI * 2;
    const driftSpeed = 0.4 + Math.random() * 0.45;
    const orbitRadius = 75;

    const core1: PlasmaCoreNode = {
      id: Math.random().toString(),
      x: cx + Math.cos(0) * orbitRadius,
      y: cy + Math.sin(0) * orbitRadius,
      radius: 20,
      health: 45,
      maxHealth: 45,
      damageFlash: 0,
      color: '#FF8800',
      label: 'SOLAR CORE',
      isSlingshotting: false,
      vx: 0,
      vy: 0
    };

    const core2: PlasmaCoreNode = {
      id: Math.random().toString(),
      x: cx + Math.cos(Math.PI) * orbitRadius,
      y: cy + Math.sin(Math.PI) * orbitRadius,
      radius: 20,
      health: 45,
      maxHealth: 45,
      damageFlash: 0,
      color: '#00FFFF',
      label: 'CYAN CORE',
      isSlingshotting: false,
      vx: 0,
      vy: 0
    };

    const corePair: BinaryPlasmaCore = {
      id: Math.random().toString(),
      x: cx,
      y: cy,
      vx: Math.cos(driftAngle) * driftSpeed,
      vy: Math.sin(driftAngle) * driftSpeed,
      orbitRadius,
      orbitAngle: Math.random() * Math.PI * 2,
      orbitSpeed: 0.04 + Math.random() * 0.02,
      core1,
      core2
    };

    plasmaCoresRef.current.push(corePair);

    shockwavesRef.current.push({
      x: cx,
      y: cy,
      radius: 10,
      maxRadius: 200,
      life: 40,
      color: '#ff8800'
    });
    soundEngine.playSound('emp');

    triggerBigBanner(
      '⚠️ BINARY PLASMA CORE DETECTED! ⚠️',
      'HIGH-ENERGY STELLAR HAZARD INBOUND • DANGEROUS VECTOR TETHER',
      '#ff8800',
      'rgba(255, 136, 0, 0.9)',
      130
    );
  }, [triggerBigBanner]);

  // Add shockwave helper
  const addShockwave = (x: number, y: number, maxRadius: number, color: string) => {
    shockwavesRef.current.push({
      x,
      y,
      radius: 5,
      maxRadius,
      life: 30,
      color
    });
  };

  // Add floating text helper
  const addFloatingText = (x: number, y: number, text: string, color = '#ffffff', fontSize = 16) => {
    floatingTextsRef.current.push({
      id: Math.random().toString(),
      x,
      y,
      text,
      color,
      life: 45,
      maxLife: 45,
      fontSize
    });
  };

  // Helper to add score and check for 15000 pts extra ship reward with dynamic Arcade Combo Multipliers
  const addScore = useCallback((amount: number, isComboTrigger: boolean = true) => {
    const state = gameStateRef.current;

    let multiplier = 1;
    if (isComboTrigger) {
      state.comboCount += 1;
      state.comboTimer = 160; // ~2.67s window to sustain combo
      if (state.comboCount > state.maxCombo) {
        state.maxCombo = state.comboCount;
      }

      // Arcade Combo Multiplier tiers:
      // 1-4 hits: 1x
      // 5-9 hits: 2x
      // 10-14 hits: 3x
      // 15-19 hits: 4x
      // 20+ hits: 5x MAX MULTIPLIER!
      if (state.comboCount >= 20) multiplier = 5;
      else if (state.comboCount >= 15) multiplier = 4;
      else if (state.comboCount >= 10) multiplier = 3;
      else if (state.comboCount >= 5) multiplier = 2;

      // Celebrate combo milestones with audio-visual triggers
      const ship = shipRef.current;
      if (state.comboCount === 5) {
        soundEngine.playSound('golden');
        if (ship && ship.alive) addFloatingText(ship.x, ship.y - 45, '🔥 2x COMBO MULTIPLIER!', '#00ffcc', 22);
      } else if (state.comboCount === 10) {
        soundEngine.playSound('golden');
        if (ship && ship.alive) addFloatingText(ship.x, ship.y - 45, '⚡ 3x SUPER COMBO!', '#ffd700', 24);
        callbacksRef.current.onUnlockAchievement('sharpshooter');
      } else if (state.comboCount === 15) {
        soundEngine.playSound('golden');
        if (ship && ship.alive) addFloatingText(ship.x, ship.y - 45, '💥 4x MEGA COMBO!', '#ff00ff', 26);
      } else if (state.comboCount === 20) {
        soundEngine.playSound('golden');
        if (ship && ship.alive) addFloatingText(ship.x, ship.y - 45, '👑 5x ULTRA COMBO MAX!', '#ff3300', 28);
      }
    }

    const finalScore = Math.round(amount * multiplier);
    state.score += finalScore;
    callbacksRef.current.onScoreUpdate(state.score);

    if (!state.nextExtraLifeScore) {
      state.nextExtraLifeScore = 50000;
    }

    while (state.score >= state.nextExtraLifeScore) {
      state.lives++;
      callbacksRef.current.onLivesUpdate(state.lives);
      soundEngine.playSound('golden');

      triggerBigBanner(
        '🚀 EXTRA SHIP GAINED!',
        `SCORE THRESHOLD ${state.nextExtraLifeScore.toLocaleString()} REACHED • LIVES: ${state.lives}`,
        '#00ff88',
        'rgba(0, 255, 136, 0.95)',
        110
      );

      const ship = shipRef.current;
      if (ship) {
        addFloatingText(ship.x, ship.y - 35, '1UP! +1 EXTRA SHIP', '#00ff88', 22);
        addShockwave(ship.x, ship.y, 160, '#00ff88');
      }

      state.nextExtraLifeScore += 50000;
    }
  }, [triggerBigBanner]);

  const recordShotHit = useCallback(() => {
    const state = gameStateRef.current;
    state.shotsHit++;
    state.consecutiveHits++;
    if (state.consecutiveHits > 0 && state.consecutiveHits % 10 === 0) {
      addScore(100, true);
      const ship = shipRef.current;
      if (ship && ship.alive) {
        addFloatingText(ship.x, ship.y - 45, '🎯 SHARPSHOOTER +100', '#ffd700', 17);
      }
    }
  }, [addScore, addFloatingText]);

  // Generate Offscreen Canvas Buffer for TRON Polyhedral Light Construct Asteroids (60 FPS Performance Optimization)
  const generateAsteroidOffscreenCanvas = (a: Asteroid, isHit = false): HTMLCanvasElement => {
    const canvas = document.createElement('canvas');
    const margin = 50;
    const size = Math.ceil((a.radius + margin) * 2);
    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext('2d');
    if (!ctx) return canvas;

    ctx.translate(size / 2, size / 2);

    const g = 0.85;

    let strokeColor = '#00f0ff';
    let glowColor = `rgba(0, 240, 255, ${g * 0.8 + 0.2})`;
    let circuitColor = 'rgba(0, 240, 255, 0.85)';
    let voidFill = 'rgba(2, 10, 25, 0.75)';
    let strokeWidth = 2.5;

    if (a.type === 'ore' || a.type === 'normal') {
      strokeColor = '#00f0ff';
      glowColor = isHit ? '#ffffff' : `rgba(0, 240, 255, ${g * 0.8 + 0.2})`;
      circuitColor = '#00e5ff';
      voidFill = 'rgba(2, 12, 30, 0.78)';
      strokeWidth = 2.5;
    } else if (a.type === 'molten' || a.type === 'magma') {
      strokeColor = '#ff3300';
      glowColor = isHit ? '#ffffff' : `rgba(255, 51, 0, ${g * 0.8 + 0.2})`;
      circuitColor = '#ff6600';
      voidFill = 'rgba(25, 4, 4, 0.82)';
      strokeWidth = 3;
    } else if (a.type === 'volatile' || a.type === 'explosive' || a.type === 'crystal') {
      strokeColor = '#39ff14';
      glowColor = isHit ? '#ffffff' : `rgba(57, 255, 20, ${g * 0.8 + 0.2})`;
      circuitColor = '#00ff66';
      voidFill = 'rgba(2, 20, 8, 0.82)';
      strokeWidth = 3;
    } else if (a.type === 'magnetic' || a.type === 'phantom') {
      strokeColor = '#c084fc';
      glowColor = isHit ? '#ffffff' : `rgba(192, 132, 252, ${g * 0.8 + 0.2})`;
      circuitColor = '#a855f7';
      voidFill = 'rgba(18, 5, 32, 0.82)';
      strokeWidth = 3;
    } else if (a.type === 'golden') {
      strokeColor = '#ffd700';
      glowColor = isHit ? '#ffffff' : `rgba(255, 215, 0, ${g * 0.8 + 0.2})`;
      circuitColor = '#fbbf24';
      voidFill = 'rgba(25, 20, 2, 0.82)';
      strokeWidth = 3;
    } else if (a.type === 'triple' || a.type === 'shield' || a.type === 'cryo') {
      strokeColor = '#00e5ff';
      glowColor = isHit ? '#ffffff' : `rgba(0, 229, 255, ${g * 0.8 + 0.2})`;
      circuitColor = '#38bdf8';
      voidFill = 'rgba(2, 15, 35, 0.82)';
      strokeWidth = 3;
    } else if (a.type === 'hive') {
      strokeColor = '#39ff14';
      glowColor = isHit ? '#ffffff' : `rgba(57, 255, 20, ${g * 0.8 + 0.2})`;
      circuitColor = '#4ade80';
      voidFill = 'rgba(3, 22, 10, 0.82)';
      strokeWidth = 3;
    } else if (a.type === 'planetoid' || a.type === 'moon') {
      strokeColor = '#7dd3fc';
      glowColor = isHit ? '#ffffff' : `rgba(125, 211, 252, ${g * 0.8 + 0.2})`;
      circuitColor = '#38bdf8';
      voidFill = 'rgba(4, 20, 40, 0.82)';
      strokeWidth = 3.5;
    }

    // Step 1: Draw Dark Void Glass Polygon Fill
    ctx.save();
    ctx.beginPath();
    a.vertices.forEach((v, idx) => {
      if (idx === 0) ctx.moveTo(v.x, v.y);
      else ctx.lineTo(v.x, v.y);
    });
    ctx.closePath();

    ctx.fillStyle = voidFill;
    ctx.fill();
    ctx.clip(); // Clip inner TRON circuit board traces & polyhedral wireframes strictly inside outer shell

    // Step 2: Inner Polyhedral Wireframe Shells
    if (a.innerShells) {
      a.innerShells.forEach((shell) => {
        ctx.save();
        ctx.beginPath();
        shell.verts.forEach((v, idx) => {
          if (idx === 0) ctx.moveTo(v.x, v.y);
          else ctx.lineTo(v.x, v.y);
        });
        ctx.closePath();
        ctx.strokeStyle = isHit ? '#ffffff' : strokeColor;
        ctx.globalAlpha = 0.55;
        ctx.lineWidth = 1.2;
        ctx.stroke();
        ctx.restore();
      });
    }

    // Step 3: Polyhedral Facet Struts (Geometric 3D Light Cage)
    if (a.polyFacets) {
      ctx.save();
      ctx.strokeStyle = isHit ? '#ffffff' : strokeColor;
      ctx.globalAlpha = 0.4;
      ctx.lineWidth = 1.0;
      ctx.beginPath();
      a.polyFacets.forEach((f) => {
        ctx.moveTo(f.x1, f.y1);
        ctx.lineTo(f.x2, f.y2);
      });
      ctx.stroke();
      ctx.restore();
    }

    // Step 4: TRON Circuit Board Traces
    if (a.circuitTraces) {
      ctx.save();
      ctx.shadowColor = isHit ? '#ffffff' : circuitColor;
      ctx.shadowBlur = isHit ? 15 : 8;
      ctx.strokeStyle = isHit ? '#ffffff' : circuitColor;
      ctx.lineWidth = 1.5;
      a.circuitTraces.forEach((tr) => {
        if (tr.path.length > 1) {
          ctx.beginPath();
          ctx.moveTo(tr.path[0].x, tr.path[0].y);
          for (let pt = 1; pt < tr.path.length; pt++) {
            ctx.lineTo(tr.path[pt].x, tr.path[pt].y);
          }
          ctx.stroke();
        }
      });
      ctx.restore();
    }

    // Step 5: TRON Circuit Data Nodes
    if (a.circuitNodes) {
      ctx.save();
      ctx.shadowColor = isHit ? '#ffffff' : strokeColor;
      ctx.shadowBlur = isHit ? 18 : 10;
      ctx.fillStyle = isHit ? '#ffffff' : strokeColor;
      a.circuitNodes.forEach((nd) => {
        ctx.fillRect(nd.x - nd.size * 0.5, nd.y - nd.size * 0.5, nd.size, nd.size);
      });
      ctx.restore();
    }

    // Step 6: TRON Laser Veins / Light Rays across Facets
    if (a.veins && a.veins.length > 0) {
      a.veins.forEach((v) => {
        ctx.save();
        ctx.strokeStyle = isHit ? '#ffffff' : (v.color || strokeColor);
        ctx.shadowColor = isHit ? '#ffffff' : (v.color || strokeColor);
        ctx.shadowBlur = isHit ? 20 : 10;
        ctx.lineWidth = isHit ? 2.5 : 1.6;
        ctx.beginPath();
        ctx.moveTo(v.x1, v.y1);
        ctx.lineTo(v.x2, v.y2);
        ctx.stroke();
        ctx.restore();
      });
    }

    ctx.restore(); // End inner clipped TRON light construct layer

    // Step 7: Outer Precise Vector Polyhedral Boundary Shell (High Glow Aura)
    ctx.save();
    ctx.beginPath();
    a.vertices.forEach((v, idx) => {
      if (idx === 0) ctx.moveTo(v.x, v.y);
      else ctx.lineTo(v.x, v.y);
    });
    ctx.closePath();

    ctx.shadowBlur = isHit ? 30 : 20;
    ctx.shadowColor = isHit ? '#ffffff' : glowColor;
    ctx.strokeStyle = isHit ? '#ffffff' : strokeColor;
    ctx.lineWidth = isHit ? strokeWidth + 1.5 : strokeWidth;
    ctx.stroke();

    // Secondary subtle inner highlight ring
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.restore();

    return canvas;
  };

  // Create single Asteroid with random vertices, craters, veins & hatch lines
  const createAsteroid = (x?: number, y?: number, radius?: number, type: Asteroid['type'] = 'normal'): Asteroid => {
    const w = canvasRef.current?.width || window.innerWidth;
    const h = canvasRef.current?.height || window.innerHeight;

    let r = radius;
    if (!r) {
      if (type === 'planetoid') r = 62 + Math.random() * 16;
      else if (type === 'moon') r = 14 + Math.random() * 4;
      else r = 28 + Math.random() * 28;
    }

    const count = type === 'moon' ? 8 : 12 + Math.floor(Math.random() * 5);
    const verts: { x: number; y: number }[] = [];

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const variance = type === 'planetoid' ? 0.85 + Math.random() * 0.25 : 0.68 + Math.random() * 0.42;
      verts.push({
        x: Math.cos(angle) * r * variance,
        y: Math.sin(angle) * r * variance
      });
    }

    // Generate TRON Light Construct Data: Inner Polyhedral Shells, Facets, Circuit Traces & Nodes
    const innerShells: { scale: number; verts: { x: number; y: number }[] }[] = [];
    [0.65, 0.35].forEach((sc) => {
      innerShells.push({
        scale: sc,
        verts: verts.map((v) => ({ x: v.x * sc, y: v.y * sc }))
      });
    });

    // Polyhedral Wireframe Facets (Spokes connecting outer vertices to inner shell vertices)
    const polyFacets: { x1: number; y1: number; x2: number; y2: number }[] = [];
    verts.forEach((v, idx) => {
      // Radial strut to center hub
      polyFacets.push({ x1: 0, y1: 0, x2: v.x, y2: v.y });
      // Cross strut to adjacent inner vertex
      const nextIdx = (idx + 1) % verts.length;
      polyFacets.push({
        x1: v.x,
        y1: v.y,
        x2: verts[nextIdx].x * 0.65,
        y2: verts[nextIdx].y * 0.65
      });
    });

    // TRON Circuit Board Traces & Data Nodes
    const circuitTraces: { path: { x: number; y: number }[]; color?: string }[] = [];
    const circuitNodes: { x: number; y: number; size: number }[] = [];
    const traceCount = 4 + Math.floor(Math.random() * 4);

    for (let t = 0; t < traceCount; t++) {
      const startAngle = (t / traceCount) * Math.PI * 2;
      const startR = r * (0.2 + Math.random() * 0.45);
      const px1 = Math.cos(startAngle) * startR;
      const py1 = Math.sin(startAngle) * startR;

      const midR = startR * 1.35;
      const midAngle = startAngle + (Math.random() < 0.5 ? 0.35 : -0.35);
      const px2 = Math.cos(midAngle) * midR;
      const py2 = Math.sin(midAngle) * midR;

      const endIdx = Math.floor(Math.random() * verts.length);
      const px3 = verts[endIdx].x * 0.85;
      const py3 = verts[endIdx].y * 0.85;

      circuitTraces.push({
        path: [
          { x: px1, y: py1 },
          { x: px2, y: py2 },
          { x: px3, y: py3 }
        ]
      });

      circuitNodes.push({ x: px1, y: py1, size: 2.5 + Math.random() * 1.5 });
      circuitNodes.push({ x: px2, y: py2, size: 2 + Math.random() * 1.5 });
    }

    const craters: { x: number; y: number; size: number }[] = [];

    // Generate mineral veins / cracks
    const veins: { x1: number; y1: number; x2: number; y2: number; color?: string }[] = [];
    const veinCount = 3 + Math.floor(Math.random() * 4);
    for (let i = 0; i < veinCount; i++) {
      const a1 = Math.random() * Math.PI * 2;
      const r1 = (0.15 + Math.random() * 0.35) * r;
      const a2 = a1 + (Math.random() - 0.5) * 1.5;
      const r2 = (0.55 + Math.random() * 0.35) * r;

      let vColor = '#00f0ff';
      if (type === 'normal' || type === 'ore') {
        vColor = Math.random() < 0.5 ? '#00f0ff' : '#ffd700'; // Cyan & Gold mineral veins
      } else if (type === 'molten' || type === 'magma') {
        vColor = Math.random() < 0.5 ? '#ff3300' : '#ff9900'; // Red/Orange lava
      } else if (type === 'volatile' || type === 'explosive' || type === 'crystal') {
        vColor = '#39ff14'; // Acidic green crystal
      } else if (type === 'shield') {
        vColor = '#38bdf8';
      } else if (type === 'triple') {
        vColor = '#00ffcc';
      } else if (type === 'magnetic') {
        vColor = '#c084fc';
      } else if (type === 'cryo') {
        vColor = '#00e5ff';
      }

      veins.push({
        x1: Math.cos(a1) * r1,
        y1: Math.sin(a1) * r1,
        x2: Math.cos(a2) * r2,
        y2: Math.sin(a2) * r2,
        color: vColor
      });
    }

    // Generate fine vector hatch lines across interior
    const hatches: { x1: number; y1: number; x2: number; y2: number }[] = [];
    const hatchSpacing = Math.max(6, r * 0.35);
    for (let hx = -r * 0.8; hx <= r * 0.8; hx += hatchSpacing) {
      hatches.push({
        x1: hx,
        y1: -r * 0.75,
        x2: hx + hatchSpacing * 0.6,
        y2: r * 0.75
      });
    }

    const moveAngle = Math.random() * Math.PI * 2;
    const speedMult = type === 'planetoid' ? (1 + (gameStateRef.current.wave - 1) * 0.02) : (1 + (gameStateRef.current.wave - 1) * 0.08);

    let health = 1;
    if (type === 'planetoid') {
      health = 5;
    } else if (type === 'explosive' || type === 'magma' || type === 'cryo' || type === 'magnetic' || type === 'molten' || type === 'volatile') {
      health = 2;
    }

    const baseSpeed = type === 'planetoid' ? (0.08 + Math.random() * 0.08) : (0.6 + Math.random() * 1.4);

    const newAst: Asteroid = {
      id: Math.random().toString(),
      x: x !== undefined ? x : Math.random() * w,
      y: y !== undefined ? y : Math.random() * h,
      radius: r,
      vx: Math.cos(moveAngle) * baseSpeed * speedMult,
      vy: Math.sin(moveAngle) * baseSpeed * speedMult,
      angle: Math.random() * Math.PI * 2,
      vertices: verts,
      innerShells: innerShells,
      polyFacets: polyFacets,
      circuitTraces: circuitTraces,
      circuitNodes: circuitNodes,
      craters: craters,
      veins: veins,
      hatches: hatches,
      rotation: (Math.random() - 0.5) * (type === 'planetoid' ? 0.008 : 0.04),
      type: type,
      glow: 0,
      health: health,
      hitTimer: 0,
      phaseTimer: type === 'phantom' ? Math.floor(Math.random() * 180) : undefined,
      isPhasedOut: false
    };

    // Cache Offscreen Canvases for 60 FPS Render Performance
    newAst.cachedCanvas = generateAsteroidOffscreenCanvas(newAst, false);
    newAst.cachedCanvasHit = generateAsteroidOffscreenCanvas(newAst, true);

    return newAst;
  };

  const spawnSafeAsteroid = (type: Asteroid['type'] = 'normal'): Asteroid => {
    const ship = shipRef.current;
    let a: Asteroid;
    let attempts = 0;
    const minSafeDist = type === 'planetoid' ? 480 : 380;
    do {
      a = createAsteroid(undefined, undefined, undefined, type);
      attempts++;
    } while (Math.hypot(a.x - ship.x, a.y - ship.y) < minSafeDist && attempts < 80);

    // If velocity points towards ship, redirect it away
    const dx = a.x - ship.x;
    const dy = a.y - ship.y;
    const dist = Math.hypot(dx, dy);
    if (dist > 0) {
      const dot = (a.vx * dx + a.vy * dy) / dist;
      if (dot < 0) {
        const spd = Math.hypot(a.vx, a.vy);
        a.vx = (dx / dist) * spd;
        a.vy = (dy / dist) * spd;
      }
    }
    return a;
  };

  // Spawn Planetary System (Planetoid + 2 to 4 orbiting Moon satellites)
  const spawnPlanetoidSystem = (): Asteroid[] => {
    const ship = shipRef.current;
    let planetoid: Asteroid;
    let system: Asteroid[] = [];
    let valid = false;
    let systemAttempts = 0;

    while (!valid && systemAttempts < 20) {
      systemAttempts++;
      planetoid = spawnSafeAsteroid('planetoid');
      system = [planetoid];
      const moonCount = 2 + Math.floor(Math.random() * 3);
      valid = true;

      for (let i = 0; i < moonCount; i++) {
        const orbitRadius = 95 + i * 28 + Math.random() * 10;
        const orbitAngle = (i / moonCount) * Math.PI * 2 + Math.random() * 0.5;
        const orbitSpeed = (0.015 + Math.random() * 0.015) * (i % 2 === 0 ? 1 : -1);

        const mx = planetoid.x + Math.cos(orbitAngle) * orbitRadius;
        const my = planetoid.y + Math.sin(orbitAngle) * orbitRadius;

        if (Math.hypot(mx - ship.x, my - ship.y) < 340) {
          valid = false;
          break;
        }

        const moon = createAsteroid(mx, my, 14 + Math.random() * 4, 'moon');
        moon.parentPlanetoidId = planetoid.id;
        moon.orbitRadius = orbitRadius;
        moon.orbitAngle = orbitAngle;
        moon.orbitSpeed = orbitSpeed;

        system.push(moon);
      }
    }

    return system;
  };

  const spawnWave = (waveNum: number) => {
    blackHolesRef.current = [];
    nebulasRef.current = [];
    plasmaCoresRef.current = [];
    const list: Asteroid[] = [];
    const count = 3 + waveNum;

    // Grant 3.5s invincibility grace period on wave transition so spawn is 100% safe!
    const ship = shipRef.current;
    if (ship) {
      ship.invincibleTimer = Math.max(ship.invincibleTimer, 210);
    }

    // BOSS WAVE MECHANIC: Triggers every 5 waves (Wave 5, 10, 15...)
    if (waveNum % 5 === 0) {
      asteroidsRef.current = [];
      ufosRef.current = [];
      ufoBulletsRef.current = [];

      const w = canvasRef.current?.width || window.innerWidth;
      const h = canvasRef.current?.height || window.innerHeight;
      
      const isTriadProtocol = waveNum % 15 === 0;
      const isCoreSeverance = !isTriadProtocol && waveNum % 10 === 0;
      const isDreadnought = !isTriadProtocol && !isCoreSeverance;

      // Safe spawn: center horizontally, upper part vertically
      const safeX = w / 2;

      soundEngine.playUfoAlarm();

      if (isTriadProtocol) {
         const cx = safeX;
         const cy = Math.max(h * 0.35, 250);
         const triadRadius = 220; // distance from center of formation
         const coreHp = 2000 + Math.floor(waveNum / 15) * 800;
         
         for (let i = 0; i < 3; i++) {
             ufosRef.current.push({
                 id: 'boss-triad-' + i,
                 x: cx + Math.cos(i * (Math.PI*2/3) - Math.PI/2) * triadRadius,
                 y: cy + Math.sin(i * (Math.PI*2/3) - Math.PI/2) * triadRadius,
                 vx: 0,
                 vy: 0,
                 radius: 55,
                 speed: 1.5,
                 shootTimer: i * 40,
                 type: 'triad_core',
                 health: coreHp,
                 maxHealth: coreHp,
                 angle: i * (Math.PI*2/3), // Used for formation positioning
                 shieldAngle: 0, // Used to track linking status (0 = linked to next, etc)
                 isBoss: true, // Mark all as boss to share health bar (logic will aggregate)
                 bossPhase: 1,
                 bossState: 'active',
                 behaviorTimer: 0,
                 pulseTimer: 0,
                 chargeTimer: 0
             });
         }
         
         triggerBigBanner(
            '⚠️ EXTREME THREAT DETECTED ⚠️',
            `TRIAD PROTOCOL MK-${Math.floor(waveNum / 15)} INBOUND • SEVER THE LINKS TO WEAKEN`,
            '#00ffff',
            'rgba(0, 255, 255, 0.95)',
            200
         );
      } else {
         const bossHp = isCoreSeverance ? 2500 + Math.floor(waveNum / 10) * 800 : 1500 + Math.floor(waveNum / 5) * 500;
         
         const boss: UFO = {
            id: 'boss-' + Math.random(),
            x: safeX + (Math.random() - 0.5) * 60,
            y: isCoreSeverance ? h * 0.3 : 130, // Safely in the upper part of the screen
            vx: isCoreSeverance ? 1.0 : 1.8,
            vy: 0,
            radius: isCoreSeverance ? 90 : 110,
            speed: isCoreSeverance ? 1.0 : 1.8,
            shootTimer: 0,
            type: isCoreSeverance ? 'core_severance' : 'dreadnought',
            health: bossHp,
            maxHealth: bossHp,
            angle: 0,
            shieldAngle: 0,
            isBoss: true,
            bossPhase: 1,
            bossState: 'burst', // Start moving immediately
            bossStateTimer: 180,
            chargeTimer: 0,
            behaviorTimer: 0,
            gridSweepTelegraph: 0,
            gridSweepFiring: 0,
            gridSweepAngle: Math.PI / 2,
            laserChargeProgress: 0,
            laserFiringTimer: 0,
            laserTargetX: w / 2,
            laserTargetY: h,
            pulseTimer: 0
         };

         ufosRef.current = [boss];
         
         if (isCoreSeverance) {
            // Spawn 3 orbiting shield nodes
            for(let i=0; i<3; i++) {
               ufosRef.current.push({
                  id: 'node-' + Math.random(),
                  x: boss.x,
                  y: boss.y,
                  vx: 0,
                  vy: 0,
                  radius: 35,
                  speed: 0,
                  shootTimer: 0,
                  type: 'shield_node',
                  health: 600 + Math.floor(waveNum / 10) * 200,
                  maxHealth: 600 + Math.floor(waveNum / 10) * 200,
                  angle: 0,
                  orbitAngle: (Math.PI * 2 / 3) * i,
                  orbitRadius: 220,
                  isBoss: false,
               });
            }
         }

         if (isCoreSeverance) {
            triggerBigBanner(
               '⚠️ CRITICAL THREAT DETECTED ⚠️',
               'CORE SEVERANCE MAINFRAME INBOUND • DESTROY SHIELD NODES FIRST!',
               '#A371F7',
               'rgba(163, 113, 247, 0.95)',
               200
            );
         } else {
            triggerBigBanner(
               '⚠️ BOSS ENCOUNTER DETECTED ⚠️',
               bossEncounteredRef.current ? `DREADNOUGHT MOTHERSHIP MK-${Math.floor(waveNum / 5)} INBOUND • PREPARE FOR COMBAT` : 'SHOOT THE ROTATING SHIELD GAP! • OVERHEAT = 3X DAMAGE!',
               bossEncounteredRef.current ? '#ff0055' : '#00ffff',
               bossEncounteredRef.current ? 'rgba(255, 0, 85, 0.95)' : 'rgba(0, 255, 255, 0.95)',
               bossEncounteredRef.current ? 150 : 260
            );
         }
      }
      bossEncounteredRef.current = true;
      return;
    }

    // Gradual progression across Waves 1 to 4
    if (waveNum === 1) {
      // Wave 1: Basic asteroids only, no hazards, no powerups, no planetoids
      for (let i = 0; i < count; i++) {
        list.push(spawnSafeAsteroid('normal'));
      }
    } else if (waveNum === 2) {
      // Wave 2: Introduce first special asteroid / simple power-up (Shield)
      for (let i = 0; i < count; i++) {
        const r = Math.random();
        list.push(spawnSafeAsteroid(r < 0.5 ? 'ore' : 'molten'));
      }
      if (Math.random() < 0.8) list.push(spawnSafeAsteroid('shield'));
    } else if (waveNum === 3) {
      // Wave 3: Introduce UFO Scouts (via loop check) + Triple Shot powerup + mixed asteroids
      for (let i = 0; i < count; i++) {
        const r = Math.random();
        list.push(spawnSafeAsteroid(r < 0.4 ? 'ore' : r < 0.7 ? 'molten' : 'volatile'));
      }
      if (Math.random() < 0.7) list.push(spawnSafeAsteroid('triple'));
    } else if (waveNum === 4) {
      // Wave 4: Introduce hazard (Ionizing Nebula) + explosive powerup + Magma asteroids
      nebulasRef.current.push(createIonizingNebula());
      triggerBigBanner(
        '⚡ IONIZING NEBULA DETECTED! ⚡',
        'EMP HAZARD FIELD AHEAD • HUD & ABILITIES WILL BE SEVERELY CRIPPLED',
        '#ff00ff',
        'rgba(255, 0, 255, 0.9)',
        130
      );
      for (let i = 0; i < count; i++) {
        const r = Math.random();
        list.push(spawnSafeAsteroid(r < 0.3 ? 'ore' : r < 0.6 ? 'molten' : 'magma'));
      }
      if (Math.random() < 0.7) list.push(spawnSafeAsteroid('explosive'));
    } else {
      // Waves 6+ (Wave 5 is boss)
      for (let i = 0; i < count; i++) {
        const r = Math.random();
        if (r < 0.35) list.push(spawnSafeAsteroid('ore'));
        else if (r < 0.65) list.push(spawnSafeAsteroid('molten'));
        else if (r < 0.85) list.push(spawnSafeAsteroid('volatile'));
        else list.push(spawnSafeAsteroid('normal'));
      }

      // Special powerup asteroids
      if (Math.random() < 0.7) list.push(spawnSafeAsteroid('triple'));
      if (Math.random() < 0.6) list.push(spawnSafeAsteroid('shield'));
      if (Math.random() < 0.5) list.push(spawnSafeAsteroid('explosive'));
      if (Math.random() < 0.45) list.push(spawnSafeAsteroid('crystal'));

      const hazardTypes: AsteroidType[] = ['magma', 'cryo', 'magnetic', 'hive', 'phantom'];
      const hazardCount = Math.min(5, 2 + Math.floor(waveNum * 0.8));
      const shuffledHazards = [...hazardTypes].sort(() => Math.random() - 0.5);
      for (let h = 0; h < hazardCount; h++) {
        list.push(spawnSafeAsteroid(shuffledHazards[h % shuffledHazards.length]));
      }

      if (waveNum >= 2 || Math.random() < 0.5) {
        const pSystem = spawnPlanetoidSystem();
        list.push(...pSystem);
      }

      if (Math.random() < 0.5) list.push(spawnSafeAsteroid('hive'));
      if (Math.random() < 0.4) list.push(spawnSafeAsteroid('phantom'));
    }

    asteroidsRef.current = list;

    // TACTICAL COMBINATION SYSTEM (Wave 6+): Intentional hazard & enemy synergy
    if (waveNum >= 6) {
      const comboType = waveNum % 5;
      if (comboType === 1) {
        // Combination 1: Black Hole Singularity + Void Swarmers
        setTimeout(() => spawnBlackHole(), 3500);
        setTimeout(() => spawnUfoEnemy('swarmer'), 5500);
        setTimeout(() => {
          triggerBigBanner('⚠️ TACTICAL PRESSURE: SINGULARITY & SWARMERS', 'GRAVITATIONAL PULL COMBINED WITH VOID SWARM ATTACK', '#a855f7', 'rgba(168, 85, 247, 0.9)', 120);
        }, 1000);
      } else if (comboType === 2) {
        // Combination 2: Ionizing Nebula + Stalker Hunter Interceptors
        setTimeout(() => spawnUfoEnemy('hunter'), 4000);
        setTimeout(() => spawnUfoEnemy('scout'), 6000);
        setTimeout(() => {
          triggerBigBanner('⚠️ TACTICAL PRESSURE: EMP NEBULA & HUNTERS', 'HUD DISRUPTED WHILE AGGRESSIVE STALKERS ENGAGE', '#ff00ff', 'rgba(255, 0, 255, 0.9)', 120);
        }, 1000);
      } else if (comboType === 3) {
        // Combination 3: Binary Plasma Core + Mothership artillery
        setTimeout(() => spawnBinaryPlasmaCore(), 3000);
        setTimeout(() => spawnUfoEnemy('mothership'), 5000);
        setTimeout(() => {
          triggerBigBanner('⚠️ TACTICAL PRESSURE: PLASMA CORES & MOTHERSHIP', 'DUAL STELLAR CORES SURROUNDED BY HEAVY ALIEN ARTILLERY', '#38bdf8', 'rgba(56, 189, 248, 0.9)', 120);
        }, 1000);
      } else if (comboType === 4) {
        // Combination 4: Multi-UFO Priority Threat (Hunter + Swarmers)
        setTimeout(() => spawnUfoEnemy('hunter'), 3000);
        setTimeout(() => spawnUfoEnemy('swarmer'), 5000);
        setTimeout(() => {
          triggerBigBanner('⚠️ TACTICAL PRESSURE: DUAL ALIEN ASSAULT', 'PRIORITIZE TARGETS BETWEEN STALKERS AND SWARM PACKS', '#ff4444', 'rgba(255, 68, 68, 0.9)', 120);
        }, 1000);
      } else {
        // Combination 5: Heavy Hazard Zone (Black Hole + Plasma Core + Scout)
        setTimeout(() => spawnBlackHole(), 3000);
        setTimeout(() => spawnBinaryPlasmaCore(), 6000);
        setTimeout(() => spawnUfoEnemy('scout'), 8000);
        setTimeout(() => {
          triggerBigBanner('⚠️ HAZARD SECTOR: ANOMALY CLUSTER', 'MULTIPLE SINGULARITIES & PLASMA HAZARDS ACTIVE', '#e11d48', 'rgba(225, 29, 72, 0.9)', 120);
        }, 1000);
      }
    } else {
      // Rare chance for early black hole on waves 3-5
      if (waveNum >= 3 && Math.random() < 0.35) {
        setTimeout(() => spawnBlackHole(), 6000);
      }

      // High energy Binary Plasma Core hazard spawn (Wave 2+)
      if (waveNum >= 2 && Math.random() < 0.45) {
        setTimeout(() => spawnBinaryPlasmaCore(), 4000);
      }
    }

    triggerBigBanner(
      `WAVE ${waveNum} ENGAGED!`,
      `SECTOR DEFENSE • ${list.length} ASTEROIDS INBOUND`,
      '#00ffcc',
      'rgba(0, 255, 204, 0.8)',
      110
    );
  };

  const centerShip = () => {
    let w = canvasRef.current?.width || window.innerWidth;
    let h = canvasRef.current?.height || window.innerHeight;
    if (w < 400 && window.innerWidth > 0) w = window.innerWidth;
    if (h < 300 && window.innerHeight > 0) h = window.innerHeight;

    const ship = shipRef.current;
    ship.x = w / 2;
    ship.y = h * 0.7; // Lower half of the screen
    ship.thrust = { x: 0, y: 0 };
    ship.angle = 0;
    ship.alive = true;
    ship.invincibleTimer = 300; // 5 seconds extended invincibility on spawn/respawn!
    ship.hullPower = 100;
    ship.hitRegenDelay = 0;
    ship.frozenTimer = 0;

    // Remove any black holes too close to ship spawn point (safe zone radius 450px)
    blackHolesRef.current = blackHolesRef.current.filter((bh) => {
      const dist = Math.hypot(bh.x - ship.x, bh.y - ship.y);
      return dist >= 450;
    });

    addShockwave(ship.x, ship.y, 120, '#00ffff');
    addFloatingText(ship.x, ship.y - 30, '🛡️ INVULNERABLE SYSTEM ACTIVE (5S)', '#00ffff', 18);
  };

  // Explosions
  const createSmallExplosion = (x: number, y: number, colorOverride?: string) => {
    soundEngine.playSound('explode');
    if (screenShakeEnabled) {
      gameStateRef.current.shakeTimer = 8;
      gameStateRef.current.shakeIntensity = 3;
    }

    for (let i = 0; i < 15; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 5.5;
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 25 + Math.random() * 25,
        maxLife: 50,
        size: 1.5 + Math.random() * 3.5,
        color: colorOverride || (Math.random() > 0.4 ? '#ffcc44' : '#ffffff')
      });
    }
  };

  const createBigExplosion = (x: number, y: number, colorOverride?: string) => {
    soundEngine.playSound('heavy_explode');
    if (screenShakeEnabled) {
      gameStateRef.current.shakeTimer = 22;
      gameStateRef.current.shakeIntensity = 12;
    }
    addShockwave(x, y, 140, colorOverride || '#ff4400');

    for (let i = 0; i < 45; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 3 + Math.random() * 16;
      const colorRoll = Math.random();
      let color = colorOverride || '#ff2200';
      if (!colorOverride) {
        if (colorRoll > 0.7) color = '#ffaa00';
        else if (colorRoll > 0.4) color = '#ff5500';
        else if (colorRoll > 0.2) color = '#ffffff';
      }

      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 40 + Math.random() * 60,
        maxLife: 100,
        size: 3 + Math.random() * 8,
        color
      });
    }
  };

  // Collectible Pickups
  const spawnCollectible = useCallback((x: number, y: number, type: Collectible['type']) => {
    collectiblesRef.current.push({
      id: Math.random().toString(),
      x,
      y,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      life: 650,
      size: 13,
      type,
      pulse: 0
    });
  }, []);

  // Destroy UFO Helper
  const destroyUfo = useCallback((ufo: UFO, points: number) => {
    addScore(points);
    gameStateRef.current.ufosDestroyed++;

    const ship = shipRef.current;
    if (ship && ship.alive && !ufo.isBoss) {
      const dist = Math.hypot(ufo.x - ship.x, ufo.y - ship.y);
      if (dist < 180) {
        const closeBonus = 200;
        addScore(closeBonus, true);
        addFloatingText(ufo.x, ufo.y - 30, `CLOSE KILL +${closeBonus}`, '#00ffcc', 17);
      }
    }

    createBigExplosion(ufo.x, ufo.y);

    const isFinalTriad = ufo.type === 'triad_core' && ufosRef.current.filter(u => u.type === 'triad_core').length <= 1;
    const isBossDeath = (ufo.isBoss && ufo.type !== 'triad_core') || isFinalTriad;

    if (isBossDeath) {
      soundEngine.playSound('heavy_explode');
      createBigExplosion(ufo.x, ufo.y, '#ff0055');
      createBigExplosion(ufo.x - 50, ufo.y + 20, '#a855f7');
      createBigExplosion(ufo.x + 50, ufo.y - 20, '#00ffff');
      addShockwave(ufo.x, ufo.y, 400, '#ff0055');
      addShockwave(ufo.x, ufo.y, 280, '#00ffff');
      
      callbacksRef.current.onUnlockAchievement('boss_slayer');

      // Drop MULTIPLE magnetic bonus crystals around boss coordinates
      const drops: Collectible['type'][] = ['golden', 'shield', 'triple', 'emp', 'laser', 'drone', 'magnet', 'repulsor', 'nuke'];
      drops.forEach((dropType, idx) => {
        const angle = (idx / drops.length) * Math.PI * 2;
        const spreadR = 45 + Math.random() * 35;
        const cx = ufo.x + Math.cos(angle) * spreadR;
        const cy = ufo.y + Math.sin(angle) * spreadR;
        spawnCollectible(cx, cy, dropType);
      });

      addFloatingText(ufo.x, ufo.y - 30, `+${points} BOSS DESTROYED!`, '#ff0055', 28);
      addFloatingText(ufo.x, ufo.y + 15, '🎁 EXOTIC POWERUP CACHE UNLOCKED!', '#ffd700', 18);

      triggerBigBanner(
        '💥 BOSS DESTROYED! 💥',
        `VICTORY! WAVE ${gameStateRef.current.wave} CLEARED • +${points} BONUS PTS!`,
        '#ff0055',
        'rgba(255, 0, 85, 0.95)',
        140
      );

      callbacksRef.current.onUnlockAchievement('boss_slayer');
    } else {
      if (ufo.isMinion) {
        const minionDrops: Collectible['type'][] = ['shield', 'triple', 'laser', 'emp', 'timewarp', 'repulsor', 'drone'];
        const picked = minionDrops[Math.floor(Math.random() * minionDrops.length)];
        spawnCollectible(ufo.x, ufo.y, picked);
        addFloatingText(ufo.x, ufo.y - 20, '🎁 MINION POWERUP DROPPED!', '#38bdf8', 16);
      } else if (ufo.type === 'supply') {
        const drops: Collectible['type'][] = ['golden', 'nuke', 'drone', 'timewarp'];
        const picked = drops[Math.floor(Math.random() * drops.length)];
        spawnCollectible(ufo.x, ufo.y, picked);
        addScore(500);
        addFloatingText(ufo.x, ufo.y - 25, '+500 SUPPLY DRONE DESTROYED!', '#ffd700', 20);
        addFloatingText(ufo.x, ufo.y + 12, 'EXOTIC SUPPLY CACHE DROPPED!', '#38bdf8', 16);
      } else if (ufo.type === 'shield_node') {
        const dropTypes: Collectible['type'][] = ['shield', 'triple', 'laser', 'emp', 'timewarp'];
        spawnCollectible(ufo.x, ufo.y, dropTypes[Math.floor(Math.random() * dropTypes.length)]);
        addFloatingText(ufo.x, ufo.y - 20, `+${points} SHIELD NODE DESTROYED!`, '#A371F7', 18);
        addFloatingText(ufo.x, ufo.y + 12, 'NODE POWERUP DROPPED!', '#38bdf8', 14);
      } else if (ufo.type === 'dreadnought') {
        const drop = Math.random() < 0.5 ? 'nuke' : 'timewarp';
        spawnCollectible(ufo.x, ufo.y, drop);
        addFloatingText(ufo.x, ufo.y - 25, `+${points} DREADNOUGHT DESTROYED!`, '#e11d48', 24);
        addFloatingText(ufo.x, ufo.y + 12, 'EXOTIC POWERUP DROPPED!', '#ffd700', 16);
      } else if (ufo.type === 'mothership') {
        const drop = Math.random() < 0.5 ? 'repulsor' : 'golden';
        spawnCollectible(ufo.x, ufo.y, drop);
        addFloatingText(ufo.x, ufo.y - 22, `+${points} MOTHERSHIP DESTROYED!`, '#a855f7', 22);
        addFloatingText(ufo.x, ufo.y + 12, 'POWER CRYSTAL DROPPED!', '#ffd700', 15);
      } else if (ufo.type === 'hunter') {
        spawnCollectible(ufo.x, ufo.y, 'laser');
        addFloatingText(ufo.x, ufo.y - 20, `+${points} HUNTER DOWNED!`, '#ec4899', 18);
      } else if (ufo.type === 'swarmer') {
        if (Math.random() < 0.4) spawnCollectible(ufo.x, ufo.y, 'triple');
        addFloatingText(ufo.x, ufo.y - 18, `+${points} SWARMER CLEARED!`, '#38bdf8', 16);
      } else if (ufo.type === 'triad_core') {
        // Handled in damage logic, just points here
        addFloatingText(ufo.x, ufo.y + 20, `+${points} CORE SECURED!`, '#00ffff', 18);
      } else {
        if (Math.random() < 0.6) spawnCollectible(ufo.x, ufo.y, 'golden');
        addFloatingText(ufo.x, ufo.y - 20, `+${points} SCOUT DESTROYED!`, '#38bdf8', 18);
      }
    }

    const idx = ufosRef.current.indexOf(ufo);
    if (idx !== -1) ufosRef.current.splice(idx, 1);

    if (ufosRef.current.length === 0) {
      ufoSpawnTimerRef.current = 0;
      soundEngine.stopUfoAlarm();
      soundEngine.setMusicIntensity(1.0);
    }
    callbacksRef.current.onUnlockAchievement('ufo_hunter');
  }, [addScore, createBigExplosion, spawnCollectible, addFloatingText]);

  // Destroy Asteroid Helper (for shots and shield ramming)
  const destroyAsteroid = useCallback((index: number, isRam: boolean = false) => {
    const state = gameStateRef.current;
    const ship = shipRef.current;
    const a = asteroidsRef.current[index];
    if (!a) return;

    if (ship && ship.alive) {
      const dist = Math.hypot(a.x - ship.x, a.y - ship.y);
      if (dist < 140) {
        const closeBonus = Math.round(150 * (1 - dist / 140)) + 50;
        addScore(closeBonus, true);
        addFloatingText(a.x, a.y - 25, `CLOSE KILL +${closeBonus}`, '#38bdf8', 16);
      }
    }

    createSmallExplosion(a.x, a.y);

    // Special & Hazard asteroid powerup drops
    if (a.type === 'triple') {
      spawnCollectible(a.x, a.y, 'triple');
      addFloatingText(a.x, a.y, '⚡ TRIPLE CANNON DROPPED!', '#00ffcc', 15);
    } else if (a.type === 'shield') {
      spawnCollectible(a.x, a.y, 'shield');
      addFloatingText(a.x, a.y, '🛡️ FORCE SHIELD DROPPED!', '#38bdf8', 15);
    } else if (a.type === 'crystal') {
      spawnCollectible(a.x, a.y, 'emp');
      addScore(300);
      addFloatingText(a.x, a.y, '💎 EMP BOMB + 300 PTS!', '#ffd700', 16);
    } else if (a.type === 'explosive') {
      spawnCollectible(a.x, a.y, 'laser');
      addFloatingText(a.x, a.y, '🔥 LASER BEAM DROPPED!', '#ff4400', 15);
    } else if (a.type === 'magma') {
      spawnCollectible(a.x, a.y, 'shield');
      addFloatingText(a.x, a.y, '🛡️ MAGMA SHIELD DROPPED!', '#ff3300', 15);
    } else if (a.type === 'cryo') {
      spawnCollectible(a.x, a.y, 'magnet');
      addFloatingText(a.x, a.y, '🧲 FROST MAGNET DROPPED!', '#00e5ff', 15);
    } else if (a.type === 'magnetic') {
      spawnCollectible(a.x, a.y, 'drone');
      addFloatingText(a.x, a.y, '🛸 GRAVITY DRONE DROPPED!', '#c084fc', 15);
    } else if (a.type === 'hive') {
      spawnCollectible(a.x, a.y, 'triple');
      addFloatingText(a.x, a.y, '⚡ BIO TRIPLE DROPPED!', '#39ff14', 15);
    } else if (a.type === 'phantom') {
      spawnCollectible(a.x, a.y, 'golden');
      addFloatingText(a.x, a.y, '🌟 HYPER STAR DROPPED!', '#e9d5ff', 16);
    } else if (a.type === 'molten') {
      spawnCollectible(a.x, a.y, 'triple');
      addFloatingText(a.x, a.y, '🔥 MOLTEN TRIPLE DROPPED!', '#ff5500', 15);
    } else if (a.type === 'ore') {
      spawnCollectible(a.x, a.y, 'shield');
      addFloatingText(a.x, a.y, '🛡️ ORE SHIELD DROPPED!', '#ffaa00', 15);
    } else if (a.type === 'volatile') {
      spawnCollectible(a.x, a.y, 'emp');
      addFloatingText(a.x, a.y, '☣️ VOLATILE EMP DROPPED!', '#39ff14', 15);
    } else if (a.radius > 25 && Math.random() < 0.22) {
      // 22% chance for normal large asteroids to drop random powerup
      const pTypes: Collectible['type'][] = ['triple', 'shield', 'emp', 'magnet'];
      const picked = pTypes[Math.floor(Math.random() * pTypes.length)];
      spawnCollectible(a.x, a.y, picked);
      addFloatingText(a.x, a.y, '🎁 POWERUP DROPPED!', '#38bdf8', 15);
    }

    // Volatile & Acidic Green Crystal Asteroid - Releases a short-lived green particle cloud upon destruction
    if (a.type === 'volatile' || a.type === 'explosive' || a.type === 'crystal') {
      addShockwave(a.x, a.y, 180, '#39ff14');
      addFloatingText(a.x, a.y - 15, '☣️ VOLATILE GREEN CLOUD!', '#39ff14', 16);
      for (let p = 0; p < 24; p++) {
        const pAngle = Math.random() * Math.PI * 2;
        const pSpeed = 0.8 + Math.random() * 4.5;
        particlesRef.current.push({
          x: a.x,
          y: a.y,
          vx: Math.cos(pAngle) * pSpeed,
          vy: Math.sin(pAngle) * pSpeed,
          life: 25 + Math.random() * 15,
          maxLife: 40,
          size: 3 + Math.random() * 5,
          color: Math.random() < 0.6 ? '#39ff14' : Math.random() < 0.5 ? '#00ff66' : '#a3e635',
          shape: 'circle'
        });
      }
    }

    // Molten Lava Asteroid Shrapnel & Embers
    if (a.type === 'molten' || a.type === 'magma') {
      addShockwave(a.x, a.y, 180, '#ff4400');
      for (let p = 0; p < 20; p++) {
        const pAngle = Math.random() * Math.PI * 2;
        const pSpeed = 1.2 + Math.random() * 5;
        particlesRef.current.push({
          x: a.x,
          y: a.y,
          vx: Math.cos(pAngle) * pSpeed,
          vy: Math.sin(pAngle) * pSpeed,
          life: 20 + Math.random() * 15,
          maxLife: 35,
          size: 2.5 + Math.random() * 3,
          color: Math.random() < 0.5 ? '#ff3300' : '#ff9900',
          shape: 'spark'
        });
      }
    }

    // Standard / Ore Asteroid Mineral Sparks
    if (a.type === 'normal' || a.type === 'ore') {
      createSmallExplosion(a.x, a.y, '#00f0ff');
      for (let p = 0; p < 12; p++) {
        const pAngle = Math.random() * Math.PI * 2;
        const pSpeed = 1 + Math.random() * 3.5;
        particlesRef.current.push({
          x: a.x,
          y: a.y,
          vx: Math.cos(pAngle) * pSpeed,
          vy: Math.sin(pAngle) * pSpeed,
          life: 20,
          maxLife: 20,
          size: 2,
          color: Math.random() < 0.5 ? '#00f0ff' : '#ffd700',
          shape: 'spark'
        });
      }
    }

    // Explosive asteroid blast
    if (a.type === 'explosive') {
      addShockwave(a.x, a.y, 220, '#ff4400');
      soundEngine.playSound('heavy_explode');

      const nearby = asteroidsRef.current.filter(
        (other) => other !== a && Math.hypot(other.x - a.x, other.y - a.y) < 190
      );
      nearby.forEach((other) => {
        createSmallExplosion(other.x, other.y, '#ff4400');
        addScore(30);
        state.asteroidsDestroyed++;
        const idx = asteroidsRef.current.indexOf(other);
        if (idx !== -1) {
          if (other.radius > 20) {
            asteroidsRef.current.push(createAsteroid(other.x, other.y, other.radius * 0.55));
            asteroidsRef.current.push(createAsteroid(other.x, other.y, other.radius * 0.55));
          }
          asteroidsRef.current.splice(idx, 1);
        }
      });
    }

    // HAZARD 1: Magma Asteroid - Erupts & shoots 4 molten shrapnel projectiles
    if (a.type === 'magma') {
      addShockwave(a.x, a.y, 200, '#ff3300');
      soundEngine.playSound('heavy_explode');
      addFloatingText(a.x, a.y - 15, '🔥 MAGMA ERUPTION!', '#ff3300', 18);

      for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 2) {
        ufoBulletsRef.current.push({
          x: a.x,
          y: a.y,
          vx: Math.cos(angle + 0.2) * 5.5,
          vy: Math.sin(angle + 0.2) * 5.5,
          angle: angle,
          speed: 5.5,
          life: 90,
          maxLife: 90,
          size: 4.5,
          color: '#ff3300',
          isPlayer: false
        });
      }
    }

    // HAZARD 2: Cryo Frost Asteroid - Emits freezing blast that freezes player thrusters if close
    if (a.type === 'cryo') {
      addShockwave(a.x, a.y, 260, '#00e5ff');
      soundEngine.playSound('shield_hit');
      addFloatingText(a.x, a.y - 15, '❄️ FROST BLAST!', '#00e5ff', 18);

      if (ship.alive && Math.hypot(ship.x - a.x, ship.y - a.y) < 220) {
        ship.frozenTimer = 180; // 3 seconds freeze
        addFloatingText(ship.x, ship.y - 35, '🥶 THRUSTERS FROZEN (-60% SPEED)!', '#00e5ff', 20);
        addShockwave(ship.x, ship.y, 100, '#00e5ff');
      }
    }

    // HAZARD 3: Magnetic Asteroid - Emits gravity pulse pushing nearby objects
    if (a.type === 'magnetic') {
      addShockwave(a.x, a.y, 320, '#a855f7');
      soundEngine.playSound('emp');
      addFloatingText(a.x, a.y - 15, '🌀 GRAVITY BURST!', '#a855f7', 18);

      if (ship.alive) {
        const dist = Math.hypot(ship.x - a.x, ship.y - a.y);
        if (dist < 320 && dist > 0) {
          const push = (1 - dist / 320) * 8;
          ship.thrust.x += ((ship.x - a.x) / dist) * push;
          ship.thrust.y += ((ship.y - a.y) / dist) * push;
        }
      }
    }

    // HAZARD 4: Hive Swarm Asteroid - Splits into 4 fast mini spore asteroids
    if (a.type === 'hive') {
      addFloatingText(a.x, a.y - 15, '☣️ HIVE SPORES SCATTERED!', '#39ff14', 18);
      soundEngine.playSound('explode');
      for (let s = 0; s < 4; s++) {
        const spore = createAsteroid(a.x, a.y, 12, 'normal');
        const spAngle = (s / 4) * Math.PI * 2;
        spore.vx = Math.cos(spAngle) * 3.5;
        spore.vy = Math.sin(spAngle) * 3.5;
        asteroidsRef.current.push(spore);
      }
    }

    // PLANETARY SYSTEM: Planetoid destruction frees its moons & drops rewards
    if (a.type === 'planetoid') {
      addFloatingText(a.x, a.y - 15, '🪐 PLANETOID SHATTERED!', '#38bdf8', 20);
      addShockwave(a.x, a.y, 220, '#38bdf8');
      soundEngine.playSound('heavy_explode');
      spawnCollectible(a.x, a.y, 'golden');
      spawnCollectible(a.x + 15, a.y - 15, 'shield');
      addScore(500);

      asteroidsRef.current.forEach((other) => {
        if (other.parentPlanetoidId === a.id) {
          other.parentPlanetoidId = undefined;
        }
      });
    }

    if (a.type === 'moon') {
      addFloatingText(a.x, a.y - 10, '🌙 MOON SHATTERED!', '#a5f3fc', 14);
      addScore(150);
    }

    // Score points
    if (a.type === 'planetoid') addScore(300);
    else if (a.radius > 40) addScore(20);
    else if (a.radius > 25) addScore(50);
    else addScore(100);

    state.asteroidsDestroyed++;

    if (isRam) {
      addFloatingText(a.x, a.y - 12, 'SHIELD RAM!', '#00ffcc', 15);
      addShockwave(a.x, a.y, a.radius * 1.5, '#00ffff');
      soundEngine.playSound('shield_hit');
    }

    // Split asteroid if big (and not hive, since hive already spawned spores)
    if (a.radius > 20 && a.type !== 'hive') {
      asteroidsRef.current.push(createAsteroid(a.x, a.y, a.radius * 0.55));
      asteroidsRef.current.push(createAsteroid(a.x, a.y, a.radius * 0.55));
    }

    asteroidsRef.current.splice(index, 1);
  }, [createSmallExplosion, spawnCollectible, addFloatingText, createAsteroid, addShockwave]);

  // Trigger EMP Shockwave
  const triggerEmp = useCallback(() => {
    if (gameStateRef.current.empCount <= 0 || !shipRef.current.alive) return;

    if (isShipInNebulaRef.current) {
      addFloatingText(shipRef.current.x, shipRef.current.y - 30, '⚠️ EMP DISABLED BY NEBULA!', '#ff00ff', 22);
      soundEngine.playSound('shield_hit');
      return;
    }

    gameStateRef.current.empCount--;
    gameStateRef.current.empUsed++;
    callbacksRef.current.onEmpCountUpdate(gameStateRef.current.empCount);

    soundEngine.playSound('emp');
    if (screenShakeEnabled) {
      gameStateRef.current.shakeTimer = 25;
      gameStateRef.current.shakeIntensity = 15;
    }

    const ship = shipRef.current;
    addShockwave(ship.x, ship.y, 600, '#00ffff');
    addFloatingText(ship.x, ship.y - 30, 'EMP SHOCKWAVE!', '#00ffff', 22);

    // Destroy all enemy bullets
    ufoBulletsRef.current = [];

    // Damage UFOs
    for (let ui = ufosRef.current.length - 1; ui >= 0; ui--) {
      const u = ufosRef.current[ui];
      if (u.isBoss) {
        addFloatingText(u.x, u.y - 45, '⚠️ BOSS EMP IMMUNE!', '#ff0055', 20);
        addShockwave(u.x, u.y, 110, '#ff0055');
        soundEngine.playSound('shield_hit');
        continue;
      }
      u.health -= 6;
      createSmallExplosion(u.x, u.y, '#00ffff');
      if (u.health <= 0) {
        const pts = u.type === 'dreadnought' ? 2000 : u.type === 'mothership' ? 1200 : 500;
        destroyUfo(u, pts);
      }
    }

    // Damage / Collapse Black Holes
    for (let i = blackHolesRef.current.length - 1; i >= 0; i--) {
      const bh = blackHolesRef.current[i];
      bh.health -= 70;
      addShockwave(bh.x, bh.y, 140, '#a855f7');
      if (bh.health <= 0) {
        blackHolesRef.current.splice(i, 1);
        createBigExplosion(bh.x, bh.y, '#a855f7');
        addShockwave(bh.x, bh.y, 300, '#a855f7');
        addScore(1000);
        addFloatingText(bh.x, bh.y, '+1000 SINGULARITY DESTROYED!', '#a855f7', 18);
        triggerBigBanner(
          '💥 BLACK HOLE COLLAPSED! 💥',
          '+1,000 BONUS POINTS FOR SINGULARITY DISRUPTION',
          '#c084fc',
          'rgba(192, 132, 252, 0.9)',
          110
        );
      }
    }

    // Damage / Break nearby asteroids
    const remaining: Asteroid[] = [];
    asteroidsRef.current.forEach((a) => {
      const dist = Math.hypot(a.x - ship.x, a.y - ship.y);
      if (dist < 450) {
        createSmallExplosion(a.x, a.y, '#00ffff');
        gameStateRef.current.score += 50;
        gameStateRef.current.asteroidsDestroyed++;
        if (a.radius > 22) {
          remaining.push(createAsteroid(a.x, a.y, a.radius * 0.5));
        }
      } else {
        remaining.push(a);
      }
    });
    asteroidsRef.current = remaining;

    callbacksRef.current.onScoreUpdate(gameStateRef.current.score);
    callbacksRef.current.onUnlockAchievement('emp_master');
  }, [screenShakeEnabled]);

  // Hyperspace Emergency Jump
  const triggerHyperspace = useCallback(() => {
    if (gameStateRef.current.hyperspaceCooldown > 0 || !shipRef.current.alive) return;

    if (isShipInNebulaRef.current) {
      addFloatingText(shipRef.current.x, shipRef.current.y - 30, '⚠️ HYPERSPACE JAMMED!', '#ff00ff', 22);
      soundEngine.playSound('shield_hit');
      return;
    }

    soundEngine.playSound('jump');
    const w = canvasRef.current?.width || window.innerWidth;
    const h = canvasRef.current?.height || window.innerHeight;
    const ship = shipRef.current;

    // Flash old location
    addShockwave(ship.x, ship.y, 45, '#00ffff');
    createSmallExplosion(ship.x, ship.y, '#00ffff');

    // Teleport to random location
    ship.x = 80 + Math.random() * (w - 160);
    ship.y = 80 + Math.random() * (h - 160);
    ship.thrust = { x: 0, y: 0 };
    ship.invincibleTimer = 90;

    // Flash new location
    addShockwave(ship.x, ship.y, 45, '#ffffff');
    addFloatingText(ship.x, ship.y - 25, 'WARP JUMP!', '#00ffff', 18);

    gameStateRef.current.hyperspaceCooldown = 300; // 5 second cooldown
    callbacksRef.current.onHyperspaceCooldownUpdate(gameStateRef.current.hyperspaceCooldown);
  }, []);

  // Fire Weapons
  const fireWeapon = useCallback(() => {
    const ship = shipRef.current;
    if (!ship.alive) return;

    const p = powerupTimersRef.current;
    const maxBullets = p.tripleShot > 0 || p.golden > 0 ? 18 : 8;

    if (bulletsRef.current.length >= maxBullets) return;

    gameStateRef.current.shotsFired++;

    // Laser Beam Power-up
    if (p.laser > 0) {
      soundEngine.playSound('laser');
      bulletsRef.current.push({
        x: ship.x + Math.cos(ship.angle) * 22,
        y: ship.y + Math.sin(ship.angle) * 22,
        vx: Math.cos(ship.angle) * 18,
        vy: Math.sin(ship.angle) * 18,
        angle: ship.angle,
        speed: 18,
        life: 35,
        maxLife: 35,
        size: 6.5,
        isLaser: true,
        color: '#ff0055',
        isPlayer: true
      });
      return;
    }

    soundEngine.playSound('shoot');

    if (p.tripleShot > 0 || p.golden > 0) {
      const spread = 0.28;
      for (let s = -1; s <= 1; s++) {
        const fireAngle = ship.angle + s * spread;
        bulletsRef.current.push({
          x: ship.x + Math.cos(fireAngle) * 22,
          y: ship.y + Math.sin(fireAngle) * 22,
          vx: Math.cos(fireAngle) * 14,
          vy: Math.sin(fireAngle) * 14,
          angle: fireAngle,
          speed: 14,
          life: 60,
          maxLife: 60,
          size: 5,
          color: '#00ffcc',
          isPlayer: true
        });
      }
    } else {
      // Powerful standard cannon
      bulletsRef.current.push({
        x: ship.x + Math.cos(ship.angle) * 22,
        y: ship.y + Math.sin(ship.angle) * 22,
        vx: Math.cos(ship.angle) * 13,
        vy: Math.sin(ship.angle) * 13,
        angle: ship.angle,
        speed: 13,
        life: 60,
        maxLife: 60,
        size: 4.5,
        color: '#00ffff',
        isPlayer: true
      });
    }
  }, []);

  // Spawn UFO Enemy
  const spawnUfoEnemy = (overrideType?: UFO['type']) => {
    const w = canvasRef.current?.width || window.innerWidth;
    const h = canvasRef.current?.height || window.innerHeight;
    const fromLeft = Math.random() < 0.5;
    const wave = gameStateRef.current.wave;

    let type: UFO['type'] = overrideType || 'scout';
    if (!overrideType) {
      const roll = Math.random();
      // Progressive difficulty scaler: Hunter Interceptors spawn with increasing frequency at higher wave counts
      const hunterChance = wave < 2 ? 0 : Math.min(0.70, 0.25 + (wave - 2) * 0.09); // Wave 2: 25%, Wave 3: 34%, Wave 4: 43%, Wave 5: 52%, Wave 6+: up to 70%
      const dreadnoughtChance = wave >= 5 ? 0.12 : 0;
      const mothershipChance = wave >= 3 ? 0.15 : 0;

      if (dreadnoughtChance > 0 && roll < dreadnoughtChance) {
        type = 'dreadnought';
      } else if (mothershipChance > 0 && roll < dreadnoughtChance + mothershipChance) {
        type = 'mothership';
      } else if (hunterChance > 0 && roll < dreadnoughtChance + mothershipChance + hunterChance) {
        type = 'hunter';
      } else if (wave >= 2 && roll < dreadnoughtChance + mothershipChance + hunterChance + 0.15) {
        type = 'swarmer';
      } else {
        type = 'scout';
      }
    }

    let radius = 24;
    let health = 1;
    let speed = 2.2;

    if (type === 'mothership') {
      radius = 38;
      health = 8;
      speed = 1.0;
    } else if (type === 'dreadnought') {
      radius = 44;
      health = 16;
      speed = 0.6;
    } else if (type === 'hunter') {
      radius = 22;
      health = 2;
      speed = 2.6;
    } else if (type === 'swarmer') {
      radius = 14;
      health = 1;
      speed = 3.2;
    }

    if (type === 'swarmer') {
      // Swarmers spawn in tight packs of 3!
      const spawnX = fromLeft ? -60 : w + 60;
      const spawnY = 120 + Math.random() * (h - 240);
      for (let s = 0; s < 3; s++) {
        const swarmer: UFO = {
          id: Math.random().toString(),
          x: spawnX + (s - 1) * 22,
          y: spawnY + (Math.random() - 0.5) * 35,
          vx: fromLeft ? 2.8 : -2.8,
          vy: (Math.random() - 0.5) * 1.5,
          radius: 14,
          speed: fromLeft ? 2.8 : -2.8,
          shootTimer: Math.floor(Math.random() * 40),
          type: 'swarmer',
          health: 1,
          maxHealth: 1,
          angle: Math.random() * Math.PI * 2,
          behaviorTimer: s * 30,
          orbitAngle: (s / 3) * Math.PI * 2,
          orbitRadius: 32 + s * 12,
          swarmCenterX: spawnX,
          swarmCenterY: spawnY
        };
        ufosRef.current.push(swarmer);
      }
    } else {
      const spawnY = 100 + Math.random() * (h - 200);
      const spawnX = fromLeft ? -60 : w + 60;
      const newUfo: UFO = {
        id: Math.random().toString(),
        x: spawnX,
        y: spawnY,
        vx: fromLeft ? speed : -speed,
        vy: (Math.random() - 0.5) * 0.8,
        radius,
        speed: fromLeft ? speed : -speed,
        shootTimer: 0,
        type,
        health,
        maxHealth: health,
        angle: 0,
        chargeTimer: 0,
        isChargingBeam: false,
        behaviorTimer: 0,
        baseY: spawnY,
        sineOffset: Math.random() * 1000,
        burstTimer: 50 + Math.random() * 30,
        isBursting: false
      };
      ufosRef.current.push(newUfo);
    }

    if (ufosRef.current.length > 0) {
      soundEngine.startUfoAlarm();
      soundEngine.setMusicIntensity(1.6);
    }

    const typeNames: Record<UFO['type'], string> = {
      scout: '⚠️ ELITE UFO SAUCER INBOUND',
      mothership: '⚠️ UFO MOTHERSHIP INBOUND',
      hunter: '⚠️ STALKER HUNTER FIGHTER INBOUND',
      swarmer: '⚠️ VOID SWARMERS APPROACHING',
      dreadnought: '🚨 ALIEN DREADNOUGHT WARSHIP INBOUND',
      supply: '🌟 EXOTIC SUPPLY DRONE DETECTED',
      mine: '💣 PROXIMITY MINE DETECTED',
      core_severance: '🚨 CRITICAL MAINFRAME ENCOUNTER DETECTED',
      shield_node: '🛡️ SHIELD NODE ONLINE',
      triad_core: '🚨 TRIAD PROTOCOL PROTO-CORE INBOUND'
    };

    addFloatingText(w / 2, 70 + (ufosRef.current.length * 22), typeNames[type], '#ff4444', 16);
  };

  // Lose Life / Take Hit
  const handlePlayerHit = () => {
    const p = powerupTimersRef.current;
    const ship = shipRef.current;

    // Force shield or Golden mode absorbs hit
    if (p.shield > 0 || p.golden > 0) {
      soundEngine.playSound('shield_hit');
      p.shield = 0;
      addShockwave(ship.x, ship.y, 60, '#66aaff');
      addFloatingText(ship.x, ship.y - 20, 'SHIELD ABSORBED HIT!', '#66aaff', 16);
      return;
    }

    if (gameMode === 'zen') return;

    // Reset combo on player hit
    if (gameStateRef.current.comboCount >= 5) {
      addFloatingText(ship.x, ship.y - 45, '⚡ COMBO BROKEN!', '#ff0055', 20);
    }
    gameStateRef.current.comboCount = 0;
    gameStateRef.current.comboTimer = 0;
    gameStateRef.current.consecutiveHits = 0;

    // 2-Hit Hull Damage system: first hit damages hull by 50%
    if (ship.hullPower > 40) {
      ship.hullPower -= 50;
      ship.hitRegenDelay = 150; // 2.5 sec delay before power starts regenerating
      ship.invincibleTimer = 85; // ~1.4 sec invincibility grace period
      soundEngine.playSound('shield_hit');
      addShockwave(ship.x, ship.y, 70, '#f59e0b');
      addFloatingText(ship.x, ship.y - 30, '⚠️ HULL CRITICAL (50%) - REGEN IN 2.5S', '#f59e0b', 17);
      callbacksRef.current.onHullPowerUpdate?.(Math.round(ship.hullPower), ship.maxHullPower);
      return;
    }

    // Hull depleted (second hit) - destroy ship!
    ship.hullPower = 0;
    gameStateRef.current.lives--;
    callbacksRef.current.onLivesUpdate(gameStateRef.current.lives);

    soundEngine.stopThrustSound();
    soundEngine.stopReverseSound();
    soundEngine.stopUfoAlarm();
    soundEngine.setMusicIntensity(1.0);

    createBigExplosion(ship.x, ship.y);
    ship.alive = false;

    if (gameStateRef.current.lives <= 0) {
      gameStateRef.current.gameRunning = false;
      callbacksRef.current.onStatsRecord(
        gameStateRef.current.asteroidsDestroyed,
        gameStateRef.current.ufosDestroyed,
        gameStateRef.current.shotsFired,
        gameStateRef.current.shotsHit,
        gameStateRef.current.empUsed,
        gameStateRef.current.score,
        gameStateRef.current.wave
      );

      const acc = gameStateRef.current.shotsFired > 0
        ? Math.round((gameStateRef.current.shotsHit / gameStateRef.current.shotsFired) * 100)
        : 0;

      callbacksRef.current.onGameOver(
        gameStateRef.current.score,
        gameStateRef.current.wave,
        gameStateRef.current.asteroidsDestroyed,
        acc,
        gameStateRef.current.maxCombo,
        gameStateRef.current.ufosDestroyed,
        gameStateRef.current.bossDamageDealt
      );
    } else {
      setTimeout(() => {
        centerShip();
      }, 1000);
    }
  };

  // Init Stars
  useEffect(() => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const list = [];
    for (let i = 0; i < 120; i++) {
      list.push({
        x: Math.random() * w,
        y: Math.random() * h,
        size: 0.8 + Math.random() * 2,
        alpha: 0.2 + Math.random() * 0.8,
        speed: 0.2 + Math.random() * 0.6
      });
    }
    starsRef.current = list;
  }, []);

  // Listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      gameStateRef.current.keys[e.key] = true;

      if (e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        if (document.activeElement && document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
        fireWeapon();
      }

      if (e.key === 'e' || e.key === 'E' || e.key === 'b' || e.key === 'B') {
        triggerEmp();
      }
      if (e.key === 'r' || e.key === 'R' || e.key === 'Shift' || e.key === 'h' || e.key === 'H') {
        triggerHyperspace();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      gameStateRef.current.keys[e.key] = false;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        gameStateRef.current.mousePos = {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        };
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (controlScheme === 'mouse' && e.button === 0) {
        fireWeapon();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
    };
  }, [controlScheme, triggerEmp, triggerHyperspace, fireWeapon]);

  // Initial game start once on mount
  useEffect(() => {
    if (!isInitializedRef.current) {
      centerShip();
      spawnWave(gameStateRef.current.wave);
      isInitializedRef.current = true;
    }
  }, []);

  // Sync Audio Engine Pause State
  useEffect(() => {
    if (isPaused) {
      soundEngine.pauseAll();
    } else {
      soundEngine.resumeAll();
    }
  }, [isPaused]);

  // Main Canvas Physics & Render Loop
  useEffect(() => {
    let animationFrameId: number;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Resize canvas to full screen container
    const handleResize = () => {
      if (!canvas) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;

      // Ensure ship is centered properly on load/resize
      if (!isInitializedRef.current || shipRef.current.x < 100 || shipRef.current.y < 100) {
        shipRef.current.x = w / 2;
        shipRef.current.y = h * 0.7;
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    const updateAndRender = () => {
      if (!canvas || !ctx) return;

      const width = canvas.width;
      const height = canvas.height;
      const state = gameStateRef.current;
      const ship = shipRef.current;
      const pTimers = powerupTimersRef.current;

      // Update Powerup Timers & notify parent
      let pUpdated = false;
      Object.keys(pTimers).forEach((key) => {
        const k = key as keyof typeof pTimers;
        if (pTimers[k] > 0) {
          pTimers[k]--;
          pUpdated = true;
        }
      });
      if (pUpdated) {
        callbacksRef.current.onActivePowerupsUpdate({ ...pTimers });
      }

      // Shield Expiring Warning Alert
      if (ship.alive && (pTimers.shield === 180 || pTimers.golden === 180)) {
        addFloatingText(ship.x, ship.y - 35, '⚠️ SHIELD LOW!', '#ff3344', 18);
        soundEngine.playSound('shield_hit');
      }

      // Hull Power Regeneration (increased regen rate for smoother feel)
      if (ship.alive) {
        if (ship.hitRegenDelay > 0) {
          ship.hitRegenDelay--;
        } else if (ship.hullPower < ship.maxHullPower) {
          ship.hullPower = Math.min(ship.maxHullPower, ship.hullPower + 0.08);
        }
        callbacksRef.current.onHullPowerUpdate?.(Math.round(ship.hullPower), ship.maxHullPower);
      }

      // Hyperspace Cooldown
      if (state.hyperspaceCooldown > 0) {
        state.hyperspaceCooldown--;
        callbacksRef.current.onHyperspaceCooldownUpdate(state.hyperspaceCooldown);
      }

      // Ship Invincibility Timer
      if (ship.invincibleTimer > 0) {
        ship.invincibleTimer--;
      }

      // Decay Arcade Combo Timer
      if (state.comboTimer > 0) {
        state.comboTimer--;
        if (state.comboTimer <= 0 && state.comboCount > 0) {
          if (state.comboCount >= 5 && ship.alive) {
            addFloatingText(ship.x, ship.y - 35, '💥 COMBO EXPIRED', '#ff4444', 16);
          }
          state.comboCount = 0;
          state.consecutiveHits = 0;
        }
      }

      // --- GAMEPLAY UPDATE (Only if not paused & running) ---
      if (!isPaused && state.gameRunning) {
        const timeFactor = pTimers.timewarp > 0 ? 0.25 : 1.0;

        // EMP Auto-Recharge (60 sec cooldown when under max charges of 3)
        if (state.empCount < 3) {
          empRechargeTimerRef.current--;
          if (empRechargeTimerRef.current <= 0) {
            state.empCount++;
            empRechargeTimerRef.current = 3600;
            callbacksRef.current.onEmpCountUpdate(state.empCount);
            soundEngine.playSound('golden');
            if (ship.alive) {
              addFloatingText(ship.x, ship.y - 35, '⚡ EMP RECHARGED (+1)!', '#d29922', 20);
              addShockwave(ship.x, ship.y, 90, '#d29922');
            }
          }
          const progress = (3600 - empRechargeTimerRef.current) / 3600;
          callbacksRef.current.onEmpRechargeProgressUpdate?.(progress);
        } else {
          empRechargeTimerRef.current = 3600;
          callbacksRef.current.onEmpRechargeProgressUpdate?.(1);
        }

        // Starfield Motion
        starsRef.current.forEach((st) => {
          st.y += st.speed;
          if (st.y > height) st.y = 0;
        });

        // 0.5. UPDATE IONIZING NEBULAS & CHECK SHIP COLLISION (EMP CLOUD HAZARD)
        isShipInNebulaRef.current = false;
        nebulasRef.current.forEach((neb) => {
          neb.x += neb.vx;
          neb.y += neb.vy;
          neb.rotation += neb.rotSpeed;

          // Screen wrapping for nebulae
          if (neb.x < -neb.radius) neb.x = width + neb.radius;
          if (neb.x > width + neb.radius) neb.x = -neb.radius;
          if (neb.y < -neb.radius) neb.y = height + neb.radius;
          if (neb.y > height + neb.radius) neb.y = -neb.radius;

          // Player collision check
          if (ship.alive) {
            const distToShip = Math.hypot(ship.x - neb.x, ship.y - neb.y);
            if (distToShip < neb.radius + ship.radius) {
              isShipInNebulaRef.current = true;
            }
          }

          // Generate internal static lightning arcs
          if (Math.random() < 0.45) {
            const allNodes = [...neb.innerNodes, ...neb.outerVertices];
            const idx1 = Math.floor(Math.random() * allNodes.length);
            const idx2 = Math.floor(Math.random() * allNodes.length);
            if (idx1 !== idx2) {
              const p1 = allNodes[idx1];
              const p2 = allNodes[idx2];
              const path: { x: number; y: number }[] = [p1];
              const segs = 3 + Math.floor(Math.random() * 3);
              for (let s = 1; s < segs; s++) {
                const ratio = s / segs;
                const midX = p1.x + (p2.x - p1.x) * ratio + (Math.random() - 0.5) * 24;
                const midY = p1.y + (p2.y - p1.y) * ratio + (Math.random() - 0.5) * 24;
                path.push({ x: midX, y: midY });
              }
              path.push(p2);

              neb.internalArcs.push({
                path,
                life: 3 + Math.floor(Math.random() * 4),
                color: Math.random() > 0.4 ? '#ff00ff' : '#ffffff'
              });
            }
          }

          // Decay internal arcs
          for (let ai = neb.internalArcs.length - 1; ai >= 0; ai--) {
            const arc = neb.internalArcs[ai];
            arc.life--;
            if (arc.life <= 0) neb.internalArcs.splice(ai, 1);
          }
        });

        const isInsideNebula = isShipInNebulaRef.current;

        // 1. SHIP CONTROLS & PHYSICS
        if (ship.alive) {
          // Check fly-over occlusion / proximity to top-left HUD area (0..320, 0..260)
          const isNearHud = ship.x < 320 && ship.y < 260;
          if (isNearHud !== isNearHudRef.current) {
            isNearHudRef.current = isNearHud;
            if (callbacksRef.current.onHudProximityUpdate) {
              callbacksRef.current.onHudProximityUpdate(isNearHud);
            }
          }

          // Decrement frozen timer if ship is frozen by Cryo Asteroid
          if (ship.frozenTimer > 0) {
            ship.frozenTimer--;
            if (Math.random() < 0.35) {
              trailParticlesRef.current.push({
                x: ship.x + (Math.random() - 0.5) * 22,
                y: ship.y + (Math.random() - 0.5) * 22,
                vx: (Math.random() - 0.5) * 1.2,
                vy: (Math.random() - 0.5) * 1.2,
                life: 20,
                maxLife: 20,
                size: 2.5,
                color: '#00e5ff'
              });
            }
          }

          if (controlScheme === 'classic') {
            // Turning - smoothed rotation speed for better maneuvering
            if (state.keys['ArrowLeft'] || state.keys['a'] || state.keys['A'] || state.touchLeft) {
              ship.rotation = -0.055;
            } else if (state.keys['ArrowRight'] || state.keys['d'] || state.keys['D'] || state.touchRight) {
              ship.rotation = 0.055;
            } else {
              ship.rotation = 0;
            }
            ship.angle += ship.rotation;
          } else if (controlScheme === 'mouse') {
            // Mouse Aiming
            const dx = state.mousePos.x - ship.x;
            const dy = state.mousePos.y - ship.y;
            ship.angle = Math.atan2(dy, dx);
          }

          // Thrusting
          if (state.keys['ArrowUp'] || state.keys['w'] || state.keys['W'] || state.touchThrust) {
            ship.thrusting = true;
            ship.reverse = false;
            let accel = pTimers.golden > 0 ? 0.25 : 0.17;
            if (ship.frozenTimer > 0) accel *= 0.4; // Thrusters slowed by 60% when frozen!
            if (isInsideNebula) accel *= 0.5; // Mobility Lock: 50% thrust acceleration reduction inside Ionizing Nebula!

            ship.thrust.x += Math.cos(ship.angle) * accel;
            ship.thrust.y += Math.sin(ship.angle) * accel;
            soundEngine.startThrustSound();

            // Thruster Embers & EMP Sparks inside Nebula
            for (let t = 0; t < 3; t++) {
              const offset = (Math.random() - 0.5) * 8;
              trailParticlesRef.current.push({
                x: ship.x - Math.cos(ship.angle) * 16 + Math.cos(ship.angle + Math.PI / 2) * offset,
                y: ship.y - Math.sin(ship.angle) * 16 + Math.sin(ship.angle + Math.PI / 2) * offset,
                vx: -Math.cos(ship.angle) * (2 + Math.random()) + (Math.random() - 0.5) * 0.8,
                vy: -Math.sin(ship.angle) * (2 + Math.random()) + (Math.random() - 0.5) * 0.8,
                life: 18 + Math.random() * 12,
                maxLife: 30,
                size: 2.5 + Math.random() * 2.5,
                color: isInsideNebula ? '#ff00ff' : ship.frozenTimer > 0 ? '#00e5ff' : (Math.random() > 0.5 ? '#ff6600' : '#ffaa00')
              });
            }
          } else if (state.keys['ArrowDown'] || state.keys['s'] || state.keys['S'] || state.touchReverse) {
            ship.thrusting = false;
            ship.reverse = true;
            let revAccel = ship.frozenTimer > 0 ? 0.04 : 0.11;
            if (isInsideNebula) revAccel *= 0.5; // 50% reverse accel reduction
            ship.thrust.x -= Math.cos(ship.angle) * revAccel;
            ship.thrust.y -= Math.sin(ship.angle) * revAccel;
            soundEngine.startReverseSound();
          } else {
            ship.thrusting = false;
            ship.reverse = false;
            ship.thrust.x *= 0.985;
            ship.thrust.y *= 0.985;
            soundEngine.stopThrustSound();
            soundEngine.stopReverseSound();
          }

          // Velocity caps
          let maxSpeed = pTimers.golden > 0 ? 9.5 : 7.0;
          if (ship.frozenTimer > 0) maxSpeed = 3.2;
          if (isInsideNebula) maxSpeed *= 0.5; // Mobility Lock: 50% max speed cap reduction inside Nebula!

          const currentSpeed = Math.hypot(ship.thrust.x, ship.thrust.y);
          if (currentSpeed > maxSpeed) {
            ship.thrust.x = (ship.thrust.x / currentSpeed) * maxSpeed;
            ship.thrust.y = (ship.thrust.y / currentSpeed) * maxSpeed;
          }

          ship.x += ship.thrust.x;
          ship.y += ship.thrust.y;

          // Screen Wrap
          if (ship.x < 0) ship.x = width;
          if (ship.x > width) ship.x = 0;
          if (ship.y < 0) ship.y = height;
          if (ship.y > height) ship.y = 0;
        }

        // 2. ORBITAL DEFENSE DRONE
        if (pTimers.drone > 0 && ship.alive) {
          if (dronesRef.current.length === 0) {
            dronesRef.current = [{ angle: 0, orbitRadius: 42, shootCooldown: 0 }];
          }
          dronesRef.current.forEach((dr) => {
            dr.angle += 0.05;
            dr.shootCooldown--;
            if (dr.shootCooldown <= 0) {
              const dx = dr.orbitRadius * Math.cos(dr.angle);
              const dy = dr.orbitRadius * Math.sin(dr.angle);
              const droneX = ship.x + dx;
              const droneY = ship.y + dy;

              let targetX: number | null = null;
              let targetY: number | null = null;

              let nearestUfo: UFO | null = null;
              let minUfoDist = 9999;
              ufosRef.current.forEach((u) => {
                const d = Math.hypot(u.x - droneX, u.y - droneY);
                if (d < minUfoDist) {
                  minUfoDist = d;
                  nearestUfo = u;
                }
              });

              if (nearestUfo && minUfoDist < 400) {
                targetX = (nearestUfo as UFO).x;
                targetY = (nearestUfo as UFO).y;
              } else if (asteroidsRef.current.length > 0) {
                let nearest: Asteroid | null = null;
                let minDist = 9999;
                asteroidsRef.current.forEach((a) => {
                  const d = Math.hypot(a.x - droneX, a.y - droneY);
                  if (d < minDist) {
                    minDist = d;
                    nearest = a;
                  }
                });
                if (nearest && minDist < 350) {
                  targetX = (nearest as Asteroid).x;
                  targetY = (nearest as Asteroid).y;
                }
              }

              if (targetX !== null && targetY !== null) {
                const targetAngle = Math.atan2(targetY - droneY, targetX - droneX);
                bulletsRef.current.push({
                  x: droneX,
                  y: droneY,
                  vx: Math.cos(targetAngle) * 10,
                  vy: Math.sin(targetAngle) * 10,
                  angle: targetAngle,
                  speed: 10,
                  life: 45,
                  maxLife: 45,
                  size: 3,
                  color: '#a855f7',
                  isPlayer: true
                });
                dr.shootCooldown = 25;
              }
            }
          });
        } else {
          dronesRef.current = [];
        }

        // 3. BULLETS UPDATE & ASTEROID/ENEMY-FIRE COLLISIONS
        for (let i = bulletsRef.current.length - 1; i >= 0; i--) {
          const b = bulletsRef.current[i];
          b.x += b.vx;
          b.y += b.vy;
          b.life--;

          // Screen wrap bullets
          if (b.x < 0) b.x = width;
          if (b.x > width) b.x = 0;
          if (b.y < 0) b.y = height;
          if (b.y > height) b.y = 0;

          // Check Player Bullet vs Enemy UFO Fire Interception
          if (b.isPlayer) {
            let intercepted = false;
            for (let ubi = ufoBulletsRef.current.length - 1; ubi >= 0; ubi--) {
              const ub = ufoBulletsRef.current[ubi];
              if (Math.hypot(b.x - ub.x, b.y - ub.y) < b.size + ub.size + 10) {
                createSmallExplosion(ub.x, ub.y, '#ffaa00');
                soundEngine.playSound('explode');
                addFloatingText(ub.x, ub.y - 12, 'INTERCEPT!', '#00ffcc', 12);
                ufoBulletsRef.current.splice(ubi, 1);
                intercepted = true;
              }
            }
            if (intercepted && !b.isLaser) {
              bulletsRef.current.splice(i, 1);
              continue;
            }
          }

          if (b.life <= 0) {
            bulletsRef.current.splice(i, 1);
          }
        }

        // Bullet vs Asteroid Collision
        for (let i = asteroidsRef.current.length - 1; i >= 0; i--) {
          const a = asteroidsRef.current[i];
          let destroyedByBullet = false;

          // Phantom Asteroid phased out check: bullets pass straight through!
          if (a.type === 'phantom' && a.isPhasedOut) {
            continue;
          }

          for (let j = bulletsRef.current.length - 1; j >= 0; j--) {
            const b = bulletsRef.current[j];
            const dist = Math.hypot(a.x - b.x, a.y - b.y);

            if (dist < a.radius) {
              recordShotHit();
              if (!b.isLaser) {
                bulletsRef.current.splice(j, 1);
              }
              a.hitTimer = 12; // Pulse mineral veins brightly on hit!
              if (a.health && a.health > 1) {
                a.health--;
                createSmallExplosion(b.x, b.y, a.type === 'molten' || a.type === 'magma' ? '#ff3300' : a.type === 'volatile' ? '#39ff14' : '#00f0ff');
                soundEngine.playSound('shield_hit');
              } else {
                destroyAsteroid(i, false);
                destroyedByBullet = true;
              }
              break;
            }
          }
          if (destroyedByBullet) continue;
        }

        // Check wave cleared
        if (asteroidsRef.current.length === 0 && ufosRef.current.length === 0) {
          if (waveClearTimerRef.current === 0) {
            waveClearTimerRef.current = 110; // ~1.8 second clear pause
            addScore(500);
            soundEngine.playSound('golden');

            const w = canvasRef.current?.width || window.innerWidth;
            const h = canvasRef.current?.height || window.innerHeight;

            addShockwave(w / 2, h / 2, Math.max(w, h) * 0.75, '#ffd700');

            triggerBigBanner(
              '🏆 CONGRATULATIONS! 🏆',
              `WAVE ${state.wave} CLEARED • +500 BONUS POINTS!`,
              '#ffd700',
              'rgba(255, 215, 0, 0.95)',
              110
            );
          } else {
            waveClearTimerRef.current--;

            // Stagger celebratory fireworks smoothly over frames to maintain 60 FPS
            if (waveClearTimerRef.current % 25 === 0 && waveClearTimerRef.current > 15) {
              const w = canvasRef.current?.width || window.innerWidth;
              const h = canvasRef.current?.height || window.innerHeight;
              const step = Math.floor((110 - waveClearTimerRef.current) / 25);
              const bx = w * (0.2 + (step % 4) * 0.2);
              const by = h * (0.3 + (step % 2) * 0.3);
              const colors = ['#ffd700', '#00ffcc', '#ff00ff', '#3399ff'];
              const color = colors[step % colors.length];

              createSmallExplosion(bx, by, color);
              addShockwave(bx, by, 120, color);
            }

            if (waveClearTimerRef.current <= 1) {
              waveClearTimerRef.current = 0;
              state.wave++;
              callbacksRef.current.onWaveUpdate(state.wave);
              spawnWave(state.wave);

              if (state.wave >= 5) callbacksRef.current.onUnlockAchievement('wave_5');
              if (state.wave >= 10) callbacksRef.current.onUnlockAchievement('wave_10');
            }
          }
        }

        // 4. ASTEROID PHYSICS & SELF-COLLISION
        for (let i = 0; i < asteroidsRef.current.length; i++) {
          const a = asteroidsRef.current[i];
          
          // Planetary Moon Orbital motion around parent Planetoid
          if (a.type === 'moon' && a.parentPlanetoidId) {
            const parent = asteroidsRef.current.find(p => p.id === a.parentPlanetoidId && p.type === 'planetoid');
            if (parent) {
              a.orbitAngle = (a.orbitAngle || 0) + (a.orbitSpeed || 0.02);
              const orbR = a.orbitRadius || 105;
              a.x = parent.x + Math.cos(a.orbitAngle) * orbR;
              a.y = parent.y + Math.sin(a.orbitAngle) * orbR;
              a.vx = parent.vx + -Math.sin(a.orbitAngle) * (a.orbitSpeed || 0.02) * orbR;
              a.vy = parent.vy + Math.cos(a.orbitAngle) * (a.orbitSpeed || 0.02) * orbR;
            } else {
              a.parentPlanetoidId = undefined;
            }
          } else {
            // Planetoids start slow and keep speed capped strictly
            if (a.type === 'planetoid') {
              const curSpd = Math.hypot(a.vx, a.vy);
              if (curSpd > 0.35) {
                a.vx = (a.vx / curSpd) * 0.35;
                a.vy = (a.vy / curSpd) * 0.35;
              }
            }
            a.x += a.vx;
            a.y += a.vy;
          }

          a.angle += a.rotation;
          if (a.type !== 'normal') a.glow += 0.1;

          // Phantom phase state update
          if (a.type === 'phantom') {
            a.phaseTimer = (a.phaseTimer || 0) + 1;
            a.isPhasedOut = (a.phaseTimer % 180) < 60; // Phased out 1sec out of 3sec
          }

          // Kinetic Repulsor forcefield pushes asteroids away from ship!
          if (pTimers.repulsor > 0 && ship.alive) {
            const adx = a.x - ship.x;
            const ady = a.y - ship.y;
            const adist = Math.hypot(adx, ady);
            if (adist < 220 && adist > 1) {
              const pushForce = (1 - adist / 220) * 0.6;
              a.vx += (adx / adist) * pushForce;
              a.vy += (ady / adist) * pushForce;
            }
          }

          // Magnetic Singularity Attraction Pull
          if (a.type === 'magnetic' && ship.alive) {
            const dist = Math.hypot(ship.x - a.x, ship.y - a.y);
            if (dist < 360 && dist > 15) {
              const pull = (1 - dist / 360) * 0.05;
              ship.thrust.x += ((a.x - ship.x) / dist) * pull;
              ship.thrust.y += ((a.y - ship.y) / dist) * pull;

              if (Math.random() < 0.25) {
                particlesRef.current.push({
                  x: ship.x,
                  y: ship.y,
                  vx: ((a.x - ship.x) / dist) * 2.5,
                  vy: ((a.y - ship.y) / dist) * 2.5,
                  life: 18,
                  maxLife: 18,
                  size: 2,
                  color: '#a855f7'
                });
              }
            }
          }

          // Screen wrap
          if (a.x < -a.radius) a.x = width + a.radius;
          if (a.x > width + a.radius) a.x = -a.radius;
          if (a.y < -a.radius) a.y = height + a.radius;
          if (a.y > height + a.radius) a.y = -a.radius;

          // Bounce off other asteroids with mass weighting
          for (let j = i + 1; j < asteroidsRef.current.length; j++) {
            const b = asteroidsRef.current[j];
            const dx = b.x - a.x;
            const dy = b.y - a.y;
            const dist = Math.hypot(dx, dy);
            const minDist = a.radius + b.radius;

            if (dist < minDist && dist > 0) {
              const nx = dx / dist;
              const ny = dy / dist;
              const overlap = minDist - dist;
              a.x -= nx * overlap * 0.5;
              a.y -= ny * overlap * 0.5;
              b.x += nx * overlap * 0.5;
              b.y += ny * overlap * 0.5;

              const impact = (a.vx - b.vx) * nx + (a.vy - b.vy) * ny;
              if (impact < 0) {
                const massA = a.radius * a.radius;
                const massB = b.radius * b.radius;
                const totalMass = massA + massB;

                a.vx -= impact * nx * (2 * massB / totalMass);
                a.vy -= impact * ny * (2 * massB / totalMass);
                b.vx += impact * nx * (2 * massA / totalMass);
                b.vy += impact * ny * (2 * massA / totalMass);

                if (a.type === 'planetoid') {
                  const spdA = Math.hypot(a.vx, a.vy);
                  if (spdA > 0.35) {
                    a.vx = (a.vx / spdA) * 0.35;
                    a.vy = (a.vy / spdA) * 0.35;
                  }
                }
                if (b.type === 'planetoid') {
                  const spdB = Math.hypot(b.vx, b.vy);
                  if (spdB > 0.35) {
                    b.vx = (b.vx / spdB) * 0.35;
                    b.vy = (b.vy / spdB) * 0.35;
                  }
                }
              }
            }
          }
        }

        // Ship vs Asteroid Collision
        if (ship.alive) {
          const isShielded = pTimers.shield > 0 || pTimers.golden > 0 || ship.invincibleTimer > 0;
          for (let i = asteroidsRef.current.length - 1; i >= 0; i--) {
            const a = asteroidsRef.current[i];
            const dist = Math.hypot(ship.x - a.x, ship.y - a.y);
            if (dist < ship.radius + a.radius * 0.85) {
              if (isShielded) {
                // Ramming asteroid with shield destroys & splits it as if shot
                destroyAsteroid(i, true);
              } else {
                handlePlayerHit();
                break;
              }
            }
          }
        }

        // 4.5. BLACK HOLE GRAVITATIONAL PHYSICS & EVENT HORIZON COLLISION
        for (let i = blackHolesRef.current.length - 1; i >= 0; i--) {
          const bh = blackHolesRef.current[i];
          bh.rotation += bh.swirlSpeed;
          bh.pulse += 0.05;

          // Mobile Black Hole Constant Drift & Screen-Wrapping Logic
          if (bh.vx !== undefined && bh.vy !== undefined) {
            bh.x += bh.vx * timeFactor;
            bh.y += bh.vy * timeFactor;

            const w = canvasRef.current?.width || window.innerWidth;
            const h = canvasRef.current?.height || window.innerHeight;

            if (bh.x < -bh.radius) bh.x = w + bh.radius;
            else if (bh.x > w + bh.radius) bh.x = -bh.radius;

            if (bh.y < -bh.radius) bh.y = h + bh.radius;
            else if (bh.y > h + bh.radius) bh.y = -bh.radius;
          }

          // A. Gravitational Pull & Damage on Ship
          if (ship.alive) {
            const dx = bh.x - ship.x;
            const dy = bh.y - ship.y;
            const dist = Math.hypot(dx, dy);

            if (dist < bh.pullRadius && dist > 1) {
              const force = Math.min(1.8, (1 - dist / bh.pullRadius) * 0.9);
              ship.thrust.x += (dx / dist) * force;
              ship.thrust.y += (dy / dist) * force;

              if (dist < bh.radius + 12) {
                ship.hullPower -= 1.5;
                callbacksRef.current.onHullPowerUpdate?.(ship.hullPower, ship.maxHullPower);
                if (screenShakeEnabled) gameStateRef.current.shakeTimer = 4;
                soundEngine.playSound('shield_hit');

                for (let p = 0; p < 2; p++) {
                  particlesRef.current.push({
                    x: ship.x,
                    y: ship.y,
                    vx: (Math.random() - 0.5) * 3,
                    vy: (Math.random() - 0.5) * 3,
                    life: 20,
                    maxLife: 20,
                    size: 3,
                    color: '#a855f7'
                  });
                }

                if (ship.hullPower <= 0) {
                  handlePlayerHit();
                }
              }
            }
          }

          // B. Gravitational Pull & Event Horizon Consumption on Asteroids
          for (let aIdx = asteroidsRef.current.length - 1; aIdx >= 0; aIdx--) {
            const ast = asteroidsRef.current[aIdx];
            const dx = bh.x - ast.x;
            const dy = bh.y - ast.y;
            const dist = Math.hypot(dx, dy);

            if (dist < bh.pullRadius && dist > 1) {
              const force = (1 - dist / bh.pullRadius) * 0.55;
              ast.vx += (dx / dist) * force;
              ast.vy += (dy / dist) * force;

              if (dist < bh.radius + 18 && !ast.beingConsumed) {
                ast.beingConsumed = true;
                ast.consumeScale = 1.0;
                ast.consumeRotation = ast.angle;
                ast.consumeTargetX = bh.x;
                ast.consumeTargetY = bh.y;
              }
            }

            if (ast.beingConsumed) {
              ast.x += (bh.x - ast.x) * 0.18;
              ast.y += (bh.y - ast.y) * 0.18;
              ast.consumeScale = (ast.consumeScale || 1.0) - 0.08;
              ast.consumeRotation = (ast.consumeRotation || 0) + 0.35;

              // Spiral particles into core
              if (Math.random() < 0.6) {
                particlesRef.current.push({
                  x: ast.x,
                  y: ast.y,
                  vx: (bh.x - ast.x) * 0.1,
                  vy: (bh.y - ast.y) * 0.1,
                  life: 12,
                  maxLife: 12,
                  size: 2,
                  color: Math.random() < 0.5 ? '#00ffff' : '#8A2BE2',
                  shape: 'spark'
                });
              }

              if (ast.consumeScale <= 0) {
                addFloatingText(bh.x, bh.y - 12, 'METEOR CONSUMED!', '#8A2BE2', 13);
                addShockwave(bh.x, bh.y, 90, '#00ffff');
                soundEngine.playSound('heavy_explode');
                createSmallExplosion(bh.x, bh.y, '#8A2BE2');
                destroyAsteroid(aIdx, false);
                addScore(100);
              }
            }
          }

          // Gravitational Pull & Event Horizon Consumption on UFO Enemies
          for (let uIdx = ufosRef.current.length - 1; uIdx >= 0; uIdx--) {
            const u = ufosRef.current[uIdx];
            const dx = bh.x - u.x;
            const dy = bh.y - u.y;
            const dist = Math.hypot(dx, dy);

            if (dist < bh.pullRadius && dist > 1) {
              const force = (1 - dist / bh.pullRadius) * 0.65;
              u.vx += (dx / dist) * force;
              u.vy += (dy / dist) * force;

              if (dist < bh.radius + 20 && !u.beingConsumed) {
                u.beingConsumed = true;
                u.consumeScale = 1.0;
                u.consumeRotation = u.angle;
                u.consumeTargetX = bh.x;
                u.consumeTargetY = bh.y;
              }
            }

            if (u.beingConsumed) {
              u.x += (bh.x - u.x) * 0.18;
              u.y += (bh.y - u.y) * 0.18;
              u.consumeScale = (u.consumeScale || 1.0) - 0.08;
              u.consumeRotation = (u.consumeRotation || 0) + 0.35;

              if (u.consumeScale <= 0) {
                addFloatingText(bh.x, bh.y - 12, 'UFO CONSUMED!', '#8A2BE2', 15);
                addShockwave(bh.x, bh.y, 110, '#8A2BE2');
                soundEngine.playSound('heavy_explode');
                createBigExplosion(bh.x, bh.y, '#00ffff');
                destroyUfo(u, 300);
              }
            }
          }

          // C. Gravitational Pull & Bullet Strikes (Expanded Hitbox across Photon Ring & Accretion Disk)
          for (let bIdx = bulletsRef.current.length - 1; bIdx >= 0; bIdx--) {
            const b = bulletsRef.current[bIdx];
            if (!b.isPlayer) continue;
            const dx = bh.x - b.x;
            const dy = bh.y - b.y;
            const dist = Math.hypot(dx, dy);

            if (dist < bh.pullRadius && dist > 1) {
              const force = (1 - dist / bh.pullRadius) * 0.8;
              b.vx += (dx / dist) * force;
              b.vy += (dy / dist) * force;

              // Expanded hitbox: Hitting photon ring or inner accretion disk damages black hole!
              const hitRadius = Math.max(bh.radius * 2.0, 80);
              if (dist < hitRadius) {
                if (!b.isLaser) {
                  bulletsRef.current.splice(bIdx, 1);
                }
                const dmg = b.isLaser ? 25 : 15;
                bh.health -= dmg;

                for (let s = 0; s < 3; s++) {
                  particlesRef.current.push({
                    x: b.x,
                    y: b.y,
                    vx: (Math.random() - 0.5) * 4,
                    vy: (Math.random() - 0.5) * 4,
                    life: 15,
                    maxLife: 15,
                    size: 2.5,
                    color: '#c084fc',
                    shape: 'spark'
                  });
                }

                if (bh.health <= 0) {
                  blackHolesRef.current.splice(i, 1);
                  createBigExplosion(bh.x, bh.y, '#a855f7');
                  addShockwave(bh.x, bh.y, 300, '#a855f7');
                  soundEngine.playSound('golden');
                  addScore(1000);
                  addFloatingText(bh.x, bh.y, '+1000 SINGULARITY DESTROYED!', '#a855f7', 18);
                  triggerBigBanner(
                    '💥 BLACK HOLE COLLAPSED! 💥',
                    '+1,000 BONUS POINTS FOR SINGULARITY DISRUPTION',
                    '#c084fc',
                    'rgba(192, 132, 252, 0.9)',
                    110
                  );

                  // Spawn 3 to 5 magnetic bonus crystals
                  const dropTypes: Collectible['type'][] = ['shield', 'triple', 'golden', 'emp', 'magnet', 'laser', 'drone', 'repulsor'];
                  const crystalCount = 3 + Math.floor(Math.random() * 3); // 3 to 5
                  for (let c = 0; c < crystalCount; c++) {
                    const randType = dropTypes[Math.floor(Math.random() * dropTypes.length)];
                    const offsetAngle = (c / crystalCount) * Math.PI * 2 + Math.random() * 0.4;
                    const offsetDist = 15 + Math.random() * 35;
                    const cx = bh.x + Math.cos(offsetAngle) * offsetDist;
                    const cy = bh.y + Math.sin(offsetAngle) * offsetDist;

                    spawnCollectible(cx, cy, randType);

                    const lastC = collectiblesRef.current[collectiblesRef.current.length - 1];
                    if (lastC) {
                      lastC.vx = Math.cos(offsetAngle) * (2.2 + Math.random() * 2.2);
                      lastC.vy = Math.sin(offsetAngle) * (2.2 + Math.random() * 2.2);
                    }
                  }
                  break;
                }
              }
            }
          }
        }

        // 4.5.D. PLAYER BULLETS VS DESTRUCTIBLE IONIZING NEBULA HAZARD
        for (let ni = nebulasRef.current.length - 1; ni >= 0; ni--) {
          const neb = nebulasRef.current[ni];
          if (neb.damageFlash > 0) neb.damageFlash--;

          for (let bIdx = bulletsRef.current.length - 1; bIdx >= 0; bIdx--) {
            const b = bulletsRef.current[bIdx];
            if (!b.isPlayer) continue;

            const dx = neb.x - b.x;
            const dy = neb.y - b.y;
            const dist = Math.hypot(dx, dy);

            if (dist < neb.radius + b.size) {
              const dmg = b.isLaser ? 3 : 1;
              neb.health -= dmg;
              neb.damageFlash = 10; // Flash white on damage!
              recordShotHit();

              createSmallExplosion(b.x, b.y, '#ff00ff');
              soundEngine.playSound('shield_hit');

              if (!b.isLaser) {
                bulletsRef.current.splice(bIdx, 1);
              }

              if (neb.health <= 0) {
                nebulasRef.current.splice(ni, 1);
                isShipInNebulaRef.current = false;

                createBigExplosion(neb.x, neb.y, '#ff00ff');
                addShockwave(neb.x, neb.y, neb.radius * 2.2, '#ff00ff');
                soundEngine.playSound('golden');
                addScore(750);
                addFloatingText(neb.x, neb.y - 20, '+750 NEBULA NEUTRALIZED!', '#ff00ff', 20);

                triggerBigBanner(
                  '⚡ NEBULA NEUTRALIZED! ⚡',
                  'EMP HAZARD FIELD DISRUPTED • HUD & ABILITIES RESTORED',
                  '#ff00ff',
                  'rgba(255, 0, 255, 0.95)',
                  110
                );

                // Spawn 3 to 5 magnetic bonus crystals
                const dropTypes: Collectible['type'][] = ['shield', 'triple', 'golden', 'emp', 'magnet', 'laser', 'drone', 'repulsor'];
                const crystalCount = 3 + Math.floor(Math.random() * 3); // 3 to 5
                for (let c = 0; c < crystalCount; c++) {
                  const randType = dropTypes[Math.floor(Math.random() * dropTypes.length)];
                  const offsetAngle = (c / crystalCount) * Math.PI * 2 + Math.random() * 0.4;
                  const offsetDist = 15 + Math.random() * 35;
                  const cx = neb.x + Math.cos(offsetAngle) * offsetDist;
                  const cy = neb.y + Math.sin(offsetAngle) * offsetDist;

                  spawnCollectible(cx, cy, randType);

                  const lastC = collectiblesRef.current[collectiblesRef.current.length - 1];
                  if (lastC) {
                    lastC.vx = Math.cos(offsetAngle) * (2.0 + Math.random() * 2.2);
                    lastC.vy = Math.sin(offsetAngle) * (2.0 + Math.random() * 2.2);
                  }
                }
                break;
              } else {
                addFloatingText(b.x, b.y - 12, `-${dmg} HP`, '#ff00ff', 13);
              }
            }
          }
        }

        const hasActiveBoss = ufosRef.current.some((u) => u.isBoss);

        // 4.6. MID-GAME PERIODIC BLACK HOLE SINGULARITY SPAWN
        if (!hasActiveBoss && state.wave >= 2 && blackHolesRef.current.length < 1) {
          blackHoleSpawnTimerRef.current++;
          if (blackHoleSpawnTimerRef.current > 2200 && Math.random() < 0.003) {
            blackHoleSpawnTimerRef.current = 0;
            spawnBlackHole();
          }
        }

        // Rare Supply Drone spawn (Wave 2+, rare)
        if (!hasActiveBoss && state.wave >= 2 && Math.random() < 0.0004) {
          const w = canvasRef.current?.width || window.innerWidth;
          const h = canvasRef.current?.height || window.innerHeight;
          const fromLeft = Math.random() < 0.5;
          const supplyDrone: UFO = {
            id: 'supply-' + Math.random(),
            x: fromLeft ? -50 : w + 50,
            y: 100 + Math.random() * (h - 200),
            vx: fromLeft ? 3.5 : -3.5,
            vy: (Math.random() - 0.5) * 1.0,
            radius: 18,
            speed: 3.5,
            shootTimer: 0,
            type: 'supply',
            health: 2,
            maxHealth: 2,
            angle: 0
          };
          ufosRef.current.push(supplyDrone);
          soundEngine.playSound('golden');
          addFloatingText(supplyDrone.x, supplyDrone.y - 25, '🌟 SUPPLY DRONE DETECTED!', '#ffd700', 18);
        }

        // 4.7. BINARY PLASMA CORE PHYSICS & COLLISION HANDLING
        for (let pIdx = plasmaCoresRef.current.length - 1; pIdx >= 0; pIdx--) {
          const pair = plasmaCoresRef.current[pIdx];
          if (!pair) continue;

          const core1 = pair.core1;
          const core2 = pair.core2;

          // A. Movement & Orbit Updates
          if (core1 && core2) {
            // Linked Binary Pair: Orbit around shared center of gravity
            pair.orbitAngle += pair.orbitSpeed * timeFactor;
            pair.x += pair.vx * timeFactor;
            pair.y += pair.vy * timeFactor;

            // Screen wrapping for center of gravity
            if (pair.x < -100) pair.x = width + 100;
            else if (pair.x > width + 100) pair.x = -100;

            if (pair.y < -100) pair.y = height + 100;
            else if (pair.y > height + 100) pair.y = -100;

            // Update positions of both cores relative to center
            core1.x = pair.x + Math.cos(pair.orbitAngle) * pair.orbitRadius;
            core1.y = pair.y + Math.sin(pair.orbitAngle) * pair.orbitRadius;

            core2.x = pair.x + Math.cos(pair.orbitAngle + Math.PI) * pair.orbitRadius;
            core2.y = pair.y + Math.sin(pair.orbitAngle + Math.PI) * pair.orbitRadius;
          } else {
            // Unlinked Surviving Core Slingshotting across screen
            const activeCore = core1 || core2;
            if (activeCore && activeCore.isSlingshotting) {
              activeCore.x += activeCore.vx * timeFactor;
              activeCore.y += activeCore.vy * timeFactor;

              // Bounce off screen edges like a projectile
              if (activeCore.x < activeCore.radius) {
                activeCore.x = activeCore.radius;
                activeCore.vx = -activeCore.vx;
                soundEngine.playSound('shield_hit');
                addShockwave(activeCore.x, activeCore.y, 40, activeCore.color);
              } else if (activeCore.x > width - activeCore.radius) {
                activeCore.x = width - activeCore.radius;
                activeCore.vx = -activeCore.vx;
                soundEngine.playSound('shield_hit');
                addShockwave(activeCore.x, activeCore.y, 40, activeCore.color);
              }

              if (activeCore.y < activeCore.radius) {
                activeCore.y = activeCore.radius;
                activeCore.vy = -activeCore.vy;
                soundEngine.playSound('shield_hit');
                addShockwave(activeCore.x, activeCore.y, 40, activeCore.color);
              } else if (activeCore.y > height - activeCore.radius) {
                activeCore.y = height - activeCore.radius;
                activeCore.vy = -activeCore.vy;
                soundEngine.playSound('shield_hit');
                addShockwave(activeCore.x, activeCore.y, 40, activeCore.color);
              }
            }
          }

          // Damage Flash cooldown
          if (core1 && core1.damageFlash > 0) core1.damageFlash--;
          if (core2 && core2.damageFlash > 0) core2.damageFlash--;

          // B. Ship Collisions (Cores & Vector Tether)
          if (ship.alive && ship.invincibleTimer <= 0) {
            let shipHitByCore = false;

            if (core1 && Math.hypot(core1.x - ship.x, core1.y - ship.y) < ship.radius + core1.radius) {
              shipHitByCore = true;
            } else if (core2 && Math.hypot(core2.x - ship.x, core2.y - ship.y) < ship.radius + core2.radius) {
              shipHitByCore = true;
            } else if (core1 && core2) {
              // Check distance to tether segment
              const distToTether = (px: number, py: number, x1: number, y1: number, x2: number, y2: number) => {
                const l2 = (x2 - x1) ** 2 + (y2 - y1) ** 2;
                if (l2 === 0) return Math.hypot(px - x1, py - y1);
                let t = ((px - x1) * (x2 - x1) + (py - y1) * (y2 - y1)) / l2;
                t = Math.max(0, Math.min(1, t));
                return Math.hypot(px - (x1 + t * (x2 - x1)), py - (y1 + t * (y2 - y1)));
              };

              if (distToTether(ship.x, ship.y, core1.x, core1.y, core2.x, core2.y) < ship.radius + 8) {
                shipHitByCore = true;
                addFloatingText(ship.x, ship.y - 20, '⚡ ELECTROCUTED BY VECTOR TETHER!', '#ff8800', 16);
              }
            }

            if (shipHitByCore) {
              handlePlayerHit();
            }
          }

          // C. Bullet Strikes vs Cores
          for (let bIdx = bulletsRef.current.length - 1; bIdx >= 0; bIdx--) {
            const b = bulletsRef.current[bIdx];
            if (!b.isPlayer) continue;

            const checkCoreHit = (c: PlasmaCoreNode, isCore1: boolean) => {
              const dist = Math.hypot(c.x - b.x, c.y - b.y);
              if (dist < c.radius + b.size) {
                const dmg = b.isLaser ? 22 : 10;
                c.health -= dmg;
                c.damageFlash = 8;
                recordShotHit();
                createSmallExplosion(b.x, b.y, c.color);
                soundEngine.playSound('shield_hit');

                if (!b.isLaser) {
                  bulletsRef.current.splice(bIdx, 1);
                }

                if (c.health <= 0) {
                  // DESTROY CORE!
                  createBigExplosion(c.x, c.y, c.color);
                  addShockwave(c.x, c.y, 180, c.color);
                  soundEngine.playSound('golden');
                  addScore(750);
                  addFloatingText(c.x, c.y - 20, `+750 ${c.label} DESTROYED!`, c.color, 18);

                  // SPAWN 2 to 3 MAGNETIC BONUS CRYSTALS AT CORE LOCATION!
                  const dropTypes: Collectible['type'][] = ['shield', 'triple', 'golden', 'emp', 'magnet', 'laser', 'drone', 'repulsor'];
                  const crystalCount = 2 + Math.floor(Math.random() * 2); // 2 to 3 crystals
                  for (let cr = 0; cr < crystalCount; cr++) {
                    const randType = dropTypes[Math.floor(Math.random() * dropTypes.length)];
                    const offsetAngle = (cr / crystalCount) * Math.PI * 2 + Math.random() * 0.4;
                    const offsetDist = 12 + Math.random() * 25;
                    spawnCollectible(c.x + Math.cos(offsetAngle) * offsetDist, c.y + Math.sin(offsetAngle) * offsetDist, randType);

                    const lastC = collectiblesRef.current[collectiblesRef.current.length - 1];
                    if (lastC) {
                      lastC.vx = Math.cos(offsetAngle) * (2.2 + Math.random() * 2.0);
                      lastC.vy = Math.sin(offsetAngle) * (2.2 + Math.random() * 2.0);
                    }
                  }

                  // SLINGSHOT MECHANIC FOR SURVIVING CORE
                  if (isCore1) {
                    pair.core1 = null;
                    if (pair.core2) {
                      pair.core2.isSlingshotting = true;
                      const tangAngle = pair.orbitAngle + Math.PI + Math.PI / 2;
                      const slSpeed = 7.5 + Math.random() * 1.5;
                      pair.core2.vx = pair.vx + Math.cos(tangAngle) * slSpeed;
                      pair.core2.vy = pair.vy + Math.sin(tangAngle) * slSpeed;
                      soundEngine.playSound('laser');
                      addShockwave(pair.core2.x, pair.core2.y, 120, pair.core2.color);
                      addFloatingText(pair.core2.x, pair.core2.y - 25, '⚡ TETHER SNAPPED! SLINGSHOT ALERT!', pair.core2.color, 18);
                      triggerBigBanner(
                        '⚡ TETHER BROKEN! ⚡',
                        'SURVIVING CORE SLINGSHOTTING AT HIGH VELOCITY',
                        pair.core2.color,
                        'rgba(0, 255, 255, 0.95)',
                        100
                      );
                    }
                  } else {
                    pair.core2 = null;
                    if (pair.core1) {
                      pair.core1.isSlingshotting = true;
                      const tangAngle = pair.orbitAngle + Math.PI / 2;
                      const slSpeed = 7.5 + Math.random() * 1.5;
                      pair.core1.vx = pair.vx + Math.cos(tangAngle) * slSpeed;
                      pair.core1.vy = pair.vy + Math.sin(tangAngle) * slSpeed;
                      soundEngine.playSound('laser');
                      addShockwave(pair.core1.x, pair.core1.y, 120, pair.core1.color);
                      addFloatingText(pair.core1.x, pair.core1.y - 25, '⚡ TETHER SNAPPED! SLINGSHOT ALERT!', pair.core1.color, 18);
                      triggerBigBanner(
                        '⚡ TETHER BROKEN! ⚡',
                        'SURVIVING CORE SLINGSHOTTING AT HIGH VELOCITY',
                        pair.core1.color,
                        'rgba(255, 136, 0, 0.95)',
                        100
                      );
                    }
                  }
                  return true;
                } else {
                  addFloatingText(b.x, b.y - 12, `-${dmg} HP`, c.color, 13);
                }
              }
              return false;
            };

            if (pair.core1 && checkCoreHit(pair.core1, true)) continue;
            if (pair.core2 && checkCoreHit(pair.core2, false)) continue;
          }

          // If both cores are destroyed, remove pair entity
          if (!pair.core1 && !pair.core2) {
            plasmaCoresRef.current.splice(pIdx, 1);
          }
        }

        // Mid-game periodic spawn for Binary Plasma Core
        if (!hasActiveBoss && state.wave >= 2 && plasmaCoresRef.current.length < 1) {
          plasmaCoreSpawnTimerRef.current++;
          if (plasmaCoreSpawnTimerRef.current > 1800 && Math.random() < 0.003) {
            plasmaCoreSpawnTimerRef.current = 0;
            spawnBinaryPlasmaCore();
          }
        }

        // 5. UFO ENEMY AI & BULLETS
        ufoSpawnTimerRef.current++;
        const maxSimultaneousUfos = state.wave >= 5 ? 3 : state.wave >= 2 ? 2 : 1;
        const ufoSpawnCooldown = Math.max(500, 1200 - (state.wave - 1) * 100);
        const ufoSpawnProb = Math.min(0.025, 0.008 + (state.wave - 1) * 0.003);
        if (!hasActiveBoss && state.wave >= 3 && ufosRef.current.length < maxSimultaneousUfos && ufoSpawnTimerRef.current > ufoSpawnCooldown && Math.random() < ufoSpawnProb) {
          spawnUfoEnemy();
          ufoSpawnTimerRef.current = 0;
        }

        for (let ui = ufosRef.current.length - 1; ui >= 0; ui--) {
          const ufo = ufosRef.current[ui];
          if (!ufo) continue;

          // BOSS MECHANICS & AI
          if (ufo.isBoss) {
            // Minion Support System: Periodically spawn 1-2 weak minions every 9-14 seconds (540-840 frames)
            ufo.minionSpawnTimer = (ufo.minionSpawnTimer || 0) + timeFactor;
            if (!ufo.nextMinionInterval) ufo.nextMinionInterval = 540 + Math.random() * 300;
            if (ufo.minionSpawnTimer >= ufo.nextMinionInterval) {
              ufo.minionSpawnTimer = 0;
              ufo.nextMinionInterval = 540 + Math.random() * 300;
              const minionCount = ufo.bossPhase === 2 ? 2 : 1;
              for (let m = 0; m < minionCount; m++) {
                const mType = Math.random() < 0.6 ? 'scout' : 'swarmer';
                const spawnX = ufo.x + (m === 0 ? -120 : 120) + (Math.random() - 0.5) * 50;
                const spawnY = ufo.y + 30 + Math.random() * 50;
                const minion: UFO = {
                  id: 'minion-' + Math.random(),
                  x: spawnX,
                  y: spawnY,
                  vx: (Math.random() - 0.5) * 2.5,
                  vy: (Math.random() - 0.5) * 1.5,
                  radius: mType === 'swarmer' ? 14 : 20,
                  speed: 2.2,
                  shootTimer: 0,
                  type: mType,
                  health: 1,
                  maxHealth: 1,
                  angle: 0,
                  isMinion: true
                };
                ufosRef.current.push(minion);
              }
              soundEngine.playSound('ufo');
              addFloatingText(ufo.x, ufo.y - 45, '🛸 BOSS DEPLOYED MINIONS!', '#ff0055', 18);
            }

            // Overheat Reward: when boss enters cooldown state, automatically drop 1 power-up near its position
            if (ufo.bossState === 'cooldown') {
              if (!ufo.hasDroppedOverheatPowerup) {
                ufo.hasDroppedOverheatPowerup = true;
                const dropTypes: Collectible['type'][] = ['shield', 'triple', 'laser', 'emp', 'timewarp', 'repulsor', 'drone', 'golden'];
                const picked = dropTypes[Math.floor(Math.random() * dropTypes.length)];
                spawnCollectible(ufo.x, ufo.y, picked);
                addFloatingText(ufo.x, ufo.y - 30, '🎁 OVERHEAT POWERUP CACHE DROPPED!', '#ffd700', 18);
                soundEngine.playSound('golden');
              }
            } else {
              ufo.hasDroppedOverheatPowerup = false;
            }

            if (ufo.type === 'triad_core') {
               const triadCores = ufosRef.current.filter(u => u.type === 'triad_core');
               const isLinked = triadCores.length > 1;
               const isBerserk = triadCores.length === 1;

               // Movement
               ufo.behaviorTimer = (ufo.behaviorTimer || 0) + timeFactor;
               const bt = ufo.behaviorTimer;
               
               const w = canvasRef.current?.width || window.innerWidth;
               const h = canvasRef.current?.height || window.innerHeight;
               const sweepX = Math.sin(bt * 0.005) * 300;
               const sweepY = Math.cos(bt * 0.003) * 100;
               const cx = w / 2 + sweepX;
               const cy = Math.max(h * 0.35, 250) + sweepY;

               if (!isBerserk) {
                  // Spin in formation
                  ufo.angle += 0.01 * timeFactor;
                  const triadRadius = triadCores.length === 3 ? 180 : 130;
                  const targetX = cx + Math.cos(ufo.angle) * triadRadius;
                  const targetY = cy + Math.sin(ufo.angle) * triadRadius;
                  ufo.x += (targetX - ufo.x) * 0.05 * timeFactor;
                  ufo.y += (targetY - ufo.y) * 0.05 * timeFactor;
               } else {
                  // Berserk: aggressively follow player, but stay above
                  if (ship.alive) {
                     const targetX = ship.x;
                     const targetY = Math.min(ship.y - 250, h/2);
                     ufo.x += (targetX - ufo.x) * 0.03 * timeFactor;
                     ufo.y += (targetY - ufo.y) * 0.03 * timeFactor;
                  }
               }
               
               // Attack logic
               ufo.shootTimer += timeFactor;
               const shootThreshold = isBerserk ? 30 : 70;
               if (ufo.shootTimer > shootThreshold) {
                  ufo.shootTimer = 0;
                  if (ship.alive) {
                     const angleToShip = Math.atan2(ship.y - ufo.y, ship.x - ufo.x);
                     if (isBerserk) {
                        // Spread of 3
                        for(let a = -0.3; a <= 0.3; a += 0.3) {
                           ufoBulletsRef.current.push({
                              x: ufo.x, y: ufo.y,
                              vx: Math.cos(angleToShip+a) * 7, vy: Math.sin(angleToShip+a) * 7,
                              angle: angleToShip+a, radius: 6, isLaser: false, color: '#ff0055'
                           });
                        }
                        soundEngine.playSound('laser');
                     } else {
                        // Single aimed shot
                        ufoBulletsRef.current.push({
                           x: ufo.x, y: ufo.y,
                           vx: Math.cos(angleToShip) * 5.5, vy: Math.sin(angleToShip) * 5.5,
                           angle: angleToShip, radius: 6, isLaser: false, color: '#00ffff'
                        });
                        if (triadCores[0] && ufo.id === triadCores[0].id) soundEngine.playSound('laser'); // prevent stacked sounds
                     }
                  }
               }
            }
            
            if (ufo.type === 'core_severance') {
              // Core Severance AI
              // Find nodes
              const activeNodes = ufosRef.current.filter(u => u.type === 'shield_node' && u.health > 0);
              const nodeCount = activeNodes.length;

              // Phase transitions
              if (nodeCount === 0 && ufo.bossPhase === 1) {
                ufo.bossPhase = 2;
                addShockwave(ufo.x, ufo.y, 400, '#A371F7');
                soundEngine.playSound('heavy_explode');
                triggerBigBanner(
                  '⚠️ SHIELD DEFEATED! ⚠️',
                  'CORE EXPOSED! PANIC MODE ACTIVATED!',
                  '#A371F7',
                  'rgba(163, 113, 247, 0.95)',
                  150
                );
              }

              // Update state timer
              ufo.bossStateTimer -= timeFactor;

              // State transitions
              if (ufo.bossStateTimer <= 0) {
                 if (ufo.bossState === 'cooldown') {
                    ufo.bossState = 'laserCharge';
                    ufo.bossStateTimer = nodeCount === 0 ? 120 : 180;
                 } else if (ufo.bossState === 'laserCharge') {
                    ufo.bossState = 'laserFire';
                    ufo.bossStateTimer = nodeCount === 0 ? 150 : 100;
                    // Trigger EMP-like pulse
                    addShockwave(ufo.x, ufo.y, 350, '#A371F7');
                 } else if (ufo.bossState === 'laserFire') {
                    ufo.bossState = 'cooldown';
                    ufo.bossStateTimer = nodeCount === 0 ? 90 : 180;
                 } else {
                    ufo.bossState = 'cooldown';
                    ufo.bossStateTimer = 180;
                 }
              }

              // Attacks based on state
              if (ufo.bossState === 'laserFire' && ship.alive) {
                 if (Math.random() < (nodeCount === 0 ? 0.08 : 0.03)) {
                    // Fire seeking heavy orb
                    const angle = Math.atan2(ship.y - ufo.y, ship.x - ufo.x);
                    ufoBulletsRef.current.push({
                        id: 'orb-' + Math.random(),
                        x: ufo.x,
                        y: ufo.y,
                        vx: Math.cos(angle) * (nodeCount === 0 ? 4 : 2.5),
                        vy: Math.sin(angle) * (nodeCount === 0 ? 4 : 2.5),
                        life: 300,
                        maxLife: 300,
                        size: 8,
                        color: '#A371F7',
                        isPlayer: false,
                        isSeeking: true
                    });
                    soundEngine.playSound('laser');
                 }
              }

              // Movement
              ufo.x += ufo.vx * timeFactor;
              ufo.y = (canvasRef.current?.height || window.innerHeight) / 2 - 100 + Math.sin(Date.now() * 0.001) * 30;

              const w = canvasRef.current?.width || window.innerWidth;
              const minSafeX = Math.max(ufo.radius + 60, 320); // Keep away from left HUD
              if (ufo.x < minSafeX) {
                ufo.x = minSafeX;
                ufo.vx = Math.abs(ufo.vx);
              } else if (ufo.x > w - ufo.radius - 60) {
                ufo.x = w - ufo.radius - 60;
                ufo.vx = -Math.abs(ufo.vx);
              }

            } else {
              // Update directional rotating shield angle
              const shieldSpeed = ufo.bossPhase === 2 ? 0.022 : 0.014;
            ufo.shieldAngle = ((ufo.shieldAngle || 0) + shieldSpeed * timeFactor) % (Math.PI * 2);

            // Initialize state if not set
            if (!ufo.bossState) {
              ufo.bossState = 'burst';
              ufo.bossStateTimer = 240;
            }

            ufo.bossStateTimer -= timeFactor;

            // Check Phase 2 transition (HP <= 50%)
            if (ufo.health <= ufo.maxHealth * 0.5 && ufo.bossPhase === 1) {
              ufo.bossPhase = 2;
              ufo.speed = 3.2;
              addShockwave(ufo.x, ufo.y, 250, '#ff0055');
              soundEngine.playSound('heavy_explode');
              addFloatingText(ufo.x, ufo.y - 35, '⚠️ PHASE 2 OVERDRIVE AGGRESSIVE MODE!', '#ff0055', 24);
              triggerBigBanner(
                '⚠️ BOSS ENTERED PHASE 2! ⚠️',
                'DIRECTIONAL ROTATING SHIELD & SWARMERS DEPLOYED',
                '#ff0055',
                'rgba(255, 0, 85, 0.95)',
                110
              );
              // Spawn Swarmers (1-2)
              spawnUfoEnemy('swarmer');
            }

            // Movement handling: Boss moves ONLY in 'burst' state
            if (ufo.bossState === 'burst') {
              const spd = ufo.bossPhase === 2 ? 3.0 : 1.8;
              ufo.x += ufo.vx * (spd / 1.8) * timeFactor;
              ufo.y = 120 + Math.sin(Date.now() * 0.0025) * 20;

              const w = canvasRef.current?.width || window.innerWidth;
              const minSafeX = Math.max(ufo.radius + 40, 320); // Keep away from left HUD
              if (ufo.x < minSafeX) {
                ufo.x = minSafeX;
                ufo.vx = Math.abs(ufo.vx);
              } else if (ufo.x > w - ufo.radius - 40) {
                ufo.x = w - ufo.radius - 40;
                ufo.vx = -Math.abs(ufo.vx);
              }
            }

            // State Machine Logic
            if (ufo.bossState === 'burst') {
              // State A: Burst Fire (4 seconds / 240 frames)
              ufo.shootTimer++;
              // Fire in controlled bursts: fires for 1 sec (60 frames), pauses for 1 sec (60 frames)
              const isFiringWindow = (ufo.bossStateTimer % 120) < 60;
              
              if (isFiringWindow && ufo.shootTimer >= 15 && ship.alive) {
                ufo.shootTimer = 0;
                const baseAngle = Math.atan2(ship.y - ufo.y, ship.x - ufo.x);
                const spreadCount = ufo.bossPhase === 2 ? 5 : 3;
                const spreadStep = ufo.bossPhase === 2 ? 0.22 : 0.28;
                const startOffset = -((spreadCount - 1) / 2) * spreadStep;

                for (let s = 0; s < spreadCount; s++) {
                  const fireA = baseAngle + startOffset + s * spreadStep;
                  ufoBulletsRef.current.push({
                    x: ufo.x + Math.cos(fireA) * ufo.radius * 0.8,
                    y: ufo.y + Math.sin(fireA) * ufo.radius * 0.8,
                    vx: Math.cos(fireA) * 5.5 * timeFactor,
                    vy: Math.sin(fireA) * 5.5 * timeFactor,
                    angle: fireA,
                    speed: 5.5,
                    life: 140,
                    maxLife: 140,
                    size: 5,
                    color: '#ff0055',
                    isPlayer: false
                  });
                }
                soundEngine.playSound('ufo');
              }

              if (ufo.bossStateTimer <= 0) {
                ufo.bossState = 'laserCharge';
                ufo.bossStateTimer = 150; // 2.5 seconds
                ufo.laserTargetAngle = Math.atan2(ship.y - ufo.y, ship.x - ufo.x);
                addFloatingText(ufo.x, ufo.y - 45, '⚠️ SYSTEM: CHARGING', '#00ffff', 20);
                soundEngine.playSound('ufo');
              }
            } else if (ufo.bossState === 'laserCharge') {
              // State B: Laser Charge Up (2.5 seconds / 150 frames)
              // Gather energy particles at core during telegraph
              if (Math.random() < 0.7) {
                particlesRef.current.push({
                  x: ufo.x + (Math.random() - 0.5) * ufo.radius,
                  y: ufo.y + (Math.random() - 0.5) * ufo.radius,
                  vx: (Math.random() - 0.5) * 5,
                  vy: (Math.random() - 0.5) * 5,
                  life: 18,
                  maxLife: 18,
                  size: 2.5,
                  color: '#00ffff',
                  shape: 'spark'
                });
              }

              // Track player slowly if in phase 2, otherwise fixed
              if (ufo.bossPhase === 2 && ship.alive) {
                 const targetAngle = Math.atan2(ship.y - ufo.y, ship.x - ufo.x);
                 let diff = targetAngle - (ufo.laserTargetAngle || 0);
                 while (diff < -Math.PI) diff += Math.PI * 2;
                 while (diff > Math.PI) diff -= Math.PI * 2;
                 ufo.laserTargetAngle = (ufo.laserTargetAngle || 0) + diff * 0.02 * timeFactor;
              }

              if (ufo.bossStateTimer <= 0) {
                ufo.bossState = 'laserFire';
                ufo.bossStateTimer = 90; // 1.5 seconds
                soundEngine.playSound('heavy_explode');
                addShockwave(ufo.x, ufo.y, 220, '#00ffff');
              }
            } else if (ufo.bossState === 'laserFire') {
              // State C: Laser Fire (1.5 seconds / 90 frames)
              
              // Add slight tracking during fire if phase 2
              if (ufo.bossPhase === 2 && ship.alive) {
                 const targetAngle = Math.atan2(ship.y - ufo.y, ship.x - ufo.x);
                 let diff = targetAngle - (ufo.laserTargetAngle || 0);
                 while (diff < -Math.PI) diff += Math.PI * 2;
                 while (diff > Math.PI) diff -= Math.PI * 2;
                 ufo.laserTargetAngle = (ufo.laserTargetAngle || 0) + diff * 0.012 * timeFactor;
              }

              if (ship.alive) {
                // Vector laser collision check (straight line)
                const dx = ship.x - ufo.x;
                const dy = ship.y - ufo.y;
                const dist = Math.hypot(dx, dy);
                if (dist > 10) {
                  const shipAngle = Math.atan2(dy, dx);
                  let diff = shipAngle - (ufo.laserTargetAngle || Math.PI / 2);
                  while (diff < -Math.PI) diff += Math.PI * 2;
                  while (diff > Math.PI) diff -= Math.PI * 2;

                  // Thin solid beam, player is destroyed if caught
                  if (Math.abs(diff) <= 0.06) {
                    // Boss Immunity to shield ram, player penalty: instant death bypassing shields
                    ship.alive = false;
                    pTimers.shield = 0;
                    pTimers.golden = 0;
                    ship.hullPower = 0;
                    handlePlayerHit();
                  }
                }
              }

              if (ufo.bossStateTimer <= 0) {
                ufo.bossState = 'cooldown';
                ufo.bossStateTimer = 360; // 6.0 seconds
                soundEngine.playSound('golden');
                addShockwave(ufo.x, ufo.y, 220, '#ffffff');
                addFloatingText(ufo.x, ufo.y - 45, '🔥 SYSTEM: OVERHEATED - VULNERABLE', '#ffffff', 22);
                triggerBigBanner(
                  '🔥 SYSTEM OVERHEATED! 🔥',
                  'SHIELD DROPPED • CORE EXPOSED FOR 6.0 SECONDS • 3X DAMAGE!',
                  '#ffffff',
                  'rgba(255, 255, 255, 0.95)',
                  110
                );
                
                // Drop a power-up when entering Overheat!
                const types: Collectible['type'][] = ['shield', 'triple', 'laser', 'emp', 'timewarp'];
                const pType = types[Math.floor(Math.random() * types.length)];
                spawnCollectible(ufo.x, ufo.y + ufo.radius + 20, pType);
              }
            } else if (ufo.bossState === 'cooldown') {
              // State D: Cooldown / Vulnerability (6 seconds / 360 frames)
              if (Math.random() < 0.6) {
                particlesRef.current.push({
                  x: ufo.x + (Math.random() - 0.5) * ufo.radius * 1.2,
                  y: ufo.y + (Math.random() - 0.5) * ufo.radius * 1.2,
                  vx: (Math.random() - 0.5) * 4,
                  vy: (Math.random() - 0.5) * 4,
                  life: 15,
                  maxLife: 15,
                  size: 2.5,
                  color: '#ffffff',
                  shape: 'spark'
                });
              }

              if (ufo.bossStateTimer <= 0) {
                ufo.bossState = Math.random() < 0.5 ? 'burst' : 'mines';
                ufo.bossStateTimer = 240;
                addFloatingText(ufo.x, ufo.y - 45, '🛡️ SHIELD RESTORED!', '#ff0055', 20);
                addShockwave(ufo.x, ufo.y, 250, '#ff0055');
              }
            } else if (ufo.bossState === 'mines') {
              // State E: Proximity Mines (4 seconds / 240 frames)
              ufo.shootTimer++;
              // Fire a mine every 45 frames
              if (ufo.shootTimer >= 45 && ship.alive) {
                ufo.shootTimer = 0;
                const baseAngle = Math.atan2(ship.y - ufo.y, ship.x - ufo.x);
                const fireA = baseAngle + (Math.random() - 0.5) * 1.0;
                
                ufoBulletsRef.current.push({
                    x: ufo.x + Math.cos(fireA) * ufo.radius * 0.8,
                    y: ufo.y + Math.sin(fireA) * ufo.radius * 0.8,
                    vx: Math.cos(fireA) * 3.5 * timeFactor,
                    vy: Math.sin(fireA) * 3.5 * timeFactor,
                    angle: fireA,
                    speed: 3.5,
                    life: 600, // live a long time
                    maxLife: 600,
                    size: 14,
                    color: '#ffaa00',
                    isPlayer: false,
                    isMine: true
                });
                soundEngine.playSound('ufo');
                addFloatingText(ufo.x, ufo.y - 45, '💣 PROXIMITY MINE DEPLOYED', '#ffaa00', 14);
              }

              if (ufo.bossStateTimer <= 0) {
                ufo.bossState = 'laserCharge';
                ufo.bossStateTimer = 150; // 2.5 seconds
                ufo.laserTargetAngle = Math.atan2(ship.y - ufo.y, ship.x - ufo.x);
                addFloatingText(ufo.x, ufo.y - 45, '⚠️ SYSTEM: CHARGING', '#00ffff', 20);
                soundEngine.playSound('ufo');
              }
            }
            } // Close core_severance else block
          } else if (ufo.type === 'shield_node') {
             // Find core severance
             const core = ufosRef.current.find(u => u.type === 'core_severance' && u.health > 0);
             if (core) {
                // Orbit core
                const nodes = ufosRef.current.filter(u => u.type === 'shield_node' && u.health > 0);
                const speedMult = nodes.length === 3 ? 1 : nodes.length === 2 ? 1.5 : 2.5;
                ufo.orbitAngle = (ufo.orbitAngle || 0) + 0.02 * speedMult * timeFactor;
                ufo.x = core.x + Math.cos(ufo.orbitAngle) * (ufo.orbitRadius || 220);
                ufo.y = core.y + Math.sin(ufo.orbitAngle) * (ufo.orbitRadius || 220);
                
                // Attack logic
                ufo.shootTimer += timeFactor;
                if (ufo.shootTimer > (nodes.length === 3 ? 120 : nodes.length === 2 ? 80 : 50) && ship.alive) {
                   ufo.shootTimer = 0;
                   if (Math.random() < 0.3) {
                      const angle = Math.atan2(ship.y - ufo.y, ship.x - ufo.x);
                      ufoBulletsRef.current.push({
                          id: 'node-beam-' + Math.random(),
                          x: ufo.x,
                          y: ufo.y,
                          vx: Math.cos(angle) * 3,
                          vy: Math.sin(angle) * 3,
                          life: 180,
                          maxLife: 180,
                          size: 5,
                          color: '#00ffff',
                          isPlayer: false,
                          isSeeking: false
                      });
                      soundEngine.playSound('laser');
                   }
                }
             } else {
                // Self destruct if core is dead
                ufo.health = 0;
             }
          } else if (ufo.type === 'supply') {
            ufo.x += ufo.vx * timeFactor;
            ufo.y += ufo.vy * timeFactor;
            const w = canvasRef.current?.width || window.innerWidth;
            if (ufo.x < -100 || ufo.x > w + 100) {
              const idx = ufosRef.current.indexOf(ufo);
              if (idx !== -1) ufosRef.current.splice(idx, 1);
              continue;
            }
          } else if (ufo.type === 'hunter') {
            if (ship.alive) {
              const targetAngle = Math.atan2(ship.y - ufo.y, ship.x - ufo.x);
              let diff = targetAngle - ufo.angle;
              while (diff < -Math.PI) diff += Math.PI * 2;
              while (diff > Math.PI) diff -= Math.PI * 2;
              ufo.angle += diff * 0.12 * timeFactor;

              ufo.burstTimer = (ufo.burstTimer || 60) - 1;
              if (ufo.burstTimer <= 0) {
                if (!ufo.isBursting) {
                  ufo.isBursting = true;
                  ufo.burstTimer = 30;
                } else {
                  ufo.isBursting = false;
                  ufo.burstTimer = 75 + Math.random() * 35;
                }
              }

              if (ufo.isBursting) {
                ufo.vx += Math.cos(ufo.angle) * 0.45 * timeFactor;
                ufo.vy += Math.sin(ufo.angle) * 0.45 * timeFactor;

                if (Math.random() < 0.8) {
                  const sparkAngle = ufo.angle + Math.PI + (Math.random() - 0.5) * 0.5;
                  particlesRef.current.push({
                    x: ufo.x - Math.cos(ufo.angle) * (ufo.radius * 0.8),
                    y: ufo.y - Math.sin(ufo.angle) * (ufo.radius * 0.8),
                    vx: Math.cos(sparkAngle) * (2.5 + Math.random() * 3),
                    vy: Math.sin(sparkAngle) * (2.5 + Math.random() * 3),
                    life: 14,
                    maxLife: 14,
                    size: 2.5 + Math.random() * 2,
                    color: '#FF9900',
                    shape: 'spark'
                  });
                }
              } else {
                ufo.vx += Math.cos(ufo.angle) * 0.08 * timeFactor;
                ufo.vy += Math.sin(ufo.angle) * 0.08 * timeFactor;
              }

              const maxSpd = ufo.isBursting ? 5.2 : 2.4;
              const curSpd = Math.hypot(ufo.vx, ufo.vy);
              if (curSpd > maxSpd) {
                ufo.vx = (ufo.vx / curSpd) * maxSpd;
                ufo.vy = (ufo.vy / curSpd) * maxSpd;
              }
            }
            ufo.x += ufo.vx * timeFactor;
            ufo.y += ufo.vy * timeFactor;
          } else if (ufo.type === 'swarmer') {
            ufo.behaviorTimer = (ufo.behaviorTimer || 0) + 1;
            ufo.angle += 0.12 * timeFactor;

            if (ship.alive) {
              if (ufo.swarmCenterX === undefined) ufo.swarmCenterX = ufo.x;
              if (ufo.swarmCenterY === undefined) ufo.swarmCenterY = ufo.y;

              const toShipX = ship.x - ufo.swarmCenterX;
              const toShipY = ship.y - ufo.swarmCenterY;
              const distToShip = Math.hypot(toShipX, toShipY);

              if (distToShip > 0) {
                ufo.swarmCenterX += (toShipX / distToShip) * 1.8 * timeFactor;
                ufo.swarmCenterY += (toShipY / distToShip) * 1.8 * timeFactor;
              }

              ufo.orbitAngle = (ufo.orbitAngle || 0) + 0.07 * timeFactor;
              const orbR = ufo.orbitRadius || 36;

              const cycle = ufo.behaviorTimer % 110;
              if (cycle > 75 && distToShip > 0) {
                const dartAngle = Math.atan2(ship.y - ufo.y, ship.x - ufo.x);
                ufo.x += Math.cos(dartAngle) * 4.2 * timeFactor;
                ufo.y += Math.sin(dartAngle) * 4.2 * timeFactor;
              } else {
                const targetX = ufo.swarmCenterX + Math.cos(ufo.orbitAngle) * orbR;
                const targetY = ufo.swarmCenterY + Math.sin(ufo.orbitAngle) * orbR;
                ufo.x += (targetX - ufo.x) * 0.12 * timeFactor;
                ufo.y += (targetY - ufo.y) * 0.12 * timeFactor;
              }
            } else {
              ufo.x += ufo.vx * timeFactor;
              ufo.y += ufo.vy * timeFactor;
            }
          } else if (ufo.type === 'scout') {
            if (ufo.baseY === undefined) ufo.baseY = ufo.y;
            ufo.x += ufo.speed * timeFactor;
            ufo.y = ufo.baseY + Math.sin((ufo.x + (ufo.sineOffset || 0)) * 0.015) * 45;

            // Emit TRON vector geometric diamond sparks from red hexagon construct
            if (Math.random() < 0.45) {
              particlesRef.current.push({
                x: ufo.x - Math.sign(ufo.speed) * (ufo.radius * 0.85),
                y: ufo.y + (Math.random() - 0.5) * 12,
                vx: -ufo.speed * 0.35 + (Math.random() - 0.5) * 1.0,
                vy: (Math.random() - 0.5) * 1.4,
                life: 14 + Math.random() * 12,
                maxLife: 26,
                size: 2.2 + Math.random() * 2.0,
                color: Math.random() < 0.65 ? '#ff0055' : '#ffffff'
              });
            }
          } else if (ufo.type === 'dreadnought') {
            ufo.x += ufo.speed * 0.6 * timeFactor;
            ufo.y += Math.sin((ufo.x + ui * 100) * 0.005) * 0.5 * timeFactor;
          } else if (ufo.type === 'mothership') {
            ufo.x += ufo.speed * timeFactor;
            ufo.y += Math.sin((ufo.x + ui * 50) * 0.01) * 0.8 * timeFactor;
          }

          ufo.shootTimer++;

          // Ship vs UFO direct crash
          if (ship.alive) {
            const isShielded = pTimers.shield > 0 || pTimers.golden > 0 || ship.invincibleTimer > 0;
            if (Math.hypot(ship.x - ufo.x, ship.y - ufo.y) < ship.radius + ufo.radius) {
              if (ufo.isBoss) {
                // Boss Immunity: zero damage to boss.
                // Player Penalty: Instantly destroyed, bypassing any shields
                ship.alive = false;
                pTimers.shield = 0;
                pTimers.golden = 0;
                ship.hullPower = 0;
                handlePlayerHit();
              } else if (ufo.type === 'shield_node') {
                if (isShielded) {
                  soundEngine.playSound('shield_hit');
                  addShockwave(ufo.x, ufo.y, ufo.radius * 2, '#A371F7');
                  addFloatingText(ufo.x, ufo.y - 30, 'DEFLECTED NODE!', '#A371F7', 18);
                  
                  // Gently push ship away
                  const pushAngle = Math.atan2(ship.y - ufo.y, ship.x - ufo.x);
                  ship.vx += Math.cos(pushAngle) * 5;
                  ship.vy += Math.sin(pushAngle) * 5;
                } else {
                  handlePlayerHit();
                  
                  // Gently push ship away after taking damage
                  const pushAngle = Math.atan2(ship.y - ufo.y, ship.x - ufo.x);
                  ship.vx += Math.cos(pushAngle) * 5;
                  ship.vy += Math.sin(pushAngle) * 5;
                }
              } else if (isShielded) {
                soundEngine.playSound('shield_hit');
                addShockwave(ufo.x, ufo.y, ufo.radius * 2, '#00ffcc');
                addFloatingText(ufo.x, ufo.y - 30, 'SHIELD RAM UFO!', '#00ffcc', 18);
                const pts = ufo.type === 'dreadnought' ? 2000 : ufo.type === 'mothership' ? 1000 : 500;
                destroyUfo(ufo, pts);
                continue;
              } else {
                ufo.health -= 4;
                createBigExplosion(ufo.x, ufo.y);
                if (ufo.health <= 0) {
                  const pts = ufo.type === 'dreadnought' ? 2000 : ufo.type === 'mothership' ? 1000 : 500;
                  destroyUfo(ufo, pts);
                  continue;
                }
                handlePlayerHit();
              }
            }
          }

          // Kinetic Repulsor pushes UFO back if close to ship
          if (pTimers.repulsor > 0 && ship.alive) {
            const rdx = ufo.x - ship.x;
            const rdy = ufo.y - ship.y;
            const rdist = Math.hypot(rdx, rdy);
            if (rdist < 180 && rdist > 1) {
              ufo.x += (rdx / rdist) * 3;
              ufo.y += (rdy / rdist) * 3;
            }
          }

          // UFO Shooting & Unique Attacks
          if (ship.alive) {
            if (ufo.type === 'scout') {
              // Fires directed plasma bolts at player every 2.5s (150 frames)
              if (ufo.shootTimer >= 150) {
                const targetAngle = Math.atan2(ship.y - ufo.y, ship.x - ufo.x);
                ufoBulletsRef.current.push({
                  x: ufo.x,
                  y: ufo.y + 2,
                  vx: Math.cos(targetAngle) * 5.5 * timeFactor,
                  vy: Math.sin(targetAngle) * 5.5 * timeFactor,
                  angle: targetAngle,
                  speed: 5.5,
                  life: 150,
                  maxLife: 150,
                  size: 4.0,
                  color: '#FF2A55',
                  isPlayer: false
                });
                soundEngine.playSound('ufo');
                ufo.shootTimer = 0;
              }
            } else if (ufo.type === 'dreadnought') {
              // Dreadnought Death Beam Charge
              ufo.chargeTimer = (ufo.chargeTimer || 0) + 1;
              if (ufo.chargeTimer > 180) {
                ufo.isChargingBeam = true;
              }
              if (ufo.chargeTimer > 240) {
                soundEngine.playSound('heavy_explode');
                addShockwave(ufo.x, ufo.y, 180, '#ff0055');
                ufo.chargeTimer = 0;
                ufo.isChargingBeam = false;

                if (ship.alive && Math.abs(ship.x - ufo.x) < 45 && ship.y > ufo.y) {
                  const isShielded = pTimers.shield > 0 || pTimers.golden > 0 || ship.invincibleTimer > 0;
                  if (isShielded) {
                    addFloatingText(ship.x, ship.y - 20, 'DEATH BEAM SHIELDED!', '#00ffcc', 16);
                  } else {
                    handlePlayerHit();
                  }
                }
              }

              if (ufo.shootTimer > 50) {
                for (let a = -0.4; a <= 0.4; a += 0.2) {
                  const baseAngle = Math.atan2(ship.y - ufo.y, ship.x - ufo.x) + a;
                  ufoBulletsRef.current.push({
                    x: ufo.x,
                    y: ufo.y + 12,
                    vx: Math.cos(baseAngle) * 5.5 * timeFactor,
                    vy: Math.sin(baseAngle) * 5.5 * timeFactor,
                    angle: baseAngle,
                    speed: 5.5,
                    life: 160,
                    maxLife: 160,
                    size: 4.5,
                    color: '#ff0055',
                    isPlayer: false
                  });
                }
                ufo.shootTimer = 0;
              }
            } else if (ufo.type === 'mothership') {
              if (ufo.shootTimer > 45) {
                for (let a = 0; a < Math.PI * 2; a += Math.PI / 2) {
                  ufoBulletsRef.current.push({
                    x: ufo.x,
                    y: ufo.y + 10,
                    vx: Math.cos(a + ufo.angle) * 4.5 * timeFactor,
                    vy: Math.sin(a + ufo.angle) * 4.5 * timeFactor,
                    angle: a,
                    speed: 4.5,
                    life: 140,
                    maxLife: 140,
                    size: 4,
                    color: '#a855f7',
                    isPlayer: false
                  });
                }
                ufo.angle += 0.25;
                ufo.shootTimer = 0;
              }
            } else if (ufo.type === 'hunter') {
              if (ufo.shootTimer > 70) {
                const fireAngle = ufo.angle;
                ufoBulletsRef.current.push({
                  x: ufo.x + Math.cos(fireAngle) * ufo.radius,
                  y: ufo.y + Math.sin(fireAngle) * ufo.radius,
                  vx: Math.cos(fireAngle) * 6.5 * timeFactor,
                  vy: Math.sin(fireAngle) * 6.5 * timeFactor,
                  angle: fireAngle,
                  speed: 6.5,
                  life: 130,
                  maxLife: 130,
                  size: 3.5,
                  color: '#FF9900',
                  isPlayer: false
                });
                soundEngine.playSound('ufo');
                ufo.shootTimer = 0;
              }
            } else if (ufo.type === 'swarmer') {
              if (ufo.shootTimer > 80) {
                const targetAngle = Math.atan2(ship.y - ufo.y, ship.x - ufo.x);
                ufoBulletsRef.current.push({
                  x: ufo.x,
                  y: ufo.y,
                  vx: Math.cos(targetAngle) * 6.0 * timeFactor,
                  vy: Math.sin(targetAngle) * 6.0 * timeFactor,
                  angle: targetAngle,
                  speed: 6.0,
                  life: 110,
                  maxLife: 110,
                  size: 3.0,
                  color: '#00FF66',
                  isPlayer: false
                });
                soundEngine.playSound('ufo');
                ufo.shootTimer = 0;
              }
            }
          }

          // UFO bounds check (Boss stays on screen)
          if (!ufo.isBoss && (ufo.x < -100 || ufo.x > width + 100)) {
            ufosRef.current.splice(ui, 1);
            if (ufosRef.current.length === 0) {
              ufoSpawnTimerRef.current = 0;
              soundEngine.stopUfoAlarm();
              soundEngine.setMusicIntensity(1.0);
            }
            continue;
          }

          // Player bullets vs UFO
          for (let i = bulletsRef.current.length - 1; i >= 0; i--) {
            const b = bulletsRef.current[i];
            if (!b.isPlayer) continue;

            const dist = Math.hypot(ufo.x - b.x, ufo.y - b.y);

            if (ufo.isBoss) {
              if (ufo.type === 'triad_core') {
                const hitRadius = ufo.radius;
                if (dist < hitRadius + b.size) {
                   const triadCores = ufosRef.current.filter(u => u.type === 'triad_core');
                   const isLinked = triadCores.length > 1;
                   const isBerserk = triadCores.length === 1;
                   
                   // Damage calculation
                   let dmg = (b.isLaser ? 25 : 10);
                   if (isLinked) {
                      dmg = Math.max(1, Math.floor(dmg * 0.15)); // heavily reduced damage when linked
                   } else if (isBerserk) {
                      dmg = Math.floor(dmg * 1.5); // Takes more damage in berserk mode but is deadlier
                   }
                   
                   ufo.health -= dmg;
                   state.bossDamageDealt += dmg;
                   recordShotHit();
                   createBigExplosion(b.x, b.y, isLinked ? '#00ffff' : '#ff0055');
                   soundEngine.playSound(isLinked ? 'shield_hit' : 'heavy_explode');
                   if (!b.isLaser) bulletsRef.current.splice(i, 1);
                   
                   if (ufo.health <= 0) {
                      destroyUfo(ufo, 5000); // Base points
                      
                      if (triadCores.length === 3) {
                         triggerBigBanner('⚠️ LINK BROKEN', 'DEFENSES WEAKENING!', '#00ffff', 'rgba(0, 255, 255, 0.8)', 90);
                      } else if (triadCores.length === 2) {
                         triggerBigBanner('⚠️ FINAL CORE ISOLATED ⚠️', 'BERSERK MODE ACTIVATED!', '#ff0055', 'rgba(255, 0, 85, 0.9)', 120);
                         soundEngine.playSound('heavy_explode');
                      } else {
                         triggerBigBanner('TRIAD PROTOCOL DESTROYED', 'THREAT NEUTRALIZED', '#38bdf8', 'rgba(56, 189, 248, 0.9)', 180);
                      }
                      
                      // Also spawn a bunch of powerups from the broken core
                      if (Math.random() < 0.5) spawnCollectible(ufo.x, ufo.y, 'laser');
                      spawnCollectible(ufo.x + 20, ufo.y, 'golden');
                      break;
                   } else {
                      if (isLinked) {
                         addFloatingText(ufo.x, ufo.y - 25, `LINKED! -${dmg}`, '#00ffff', 14);
                      } else {
                         addFloatingText(ufo.x, ufo.y - 25, `-${dmg} HP`, '#ff0055', 18);
                      }
                   }
                }
              } else if (ufo.type === 'core_severance') {
                const hitRadius = ufo.radius;
                if (dist < hitRadius + b.size) {
                  const activeNodes = ufosRef.current.filter(u => u.type === 'shield_node' && u.health > 0).length;
                  if (activeNodes > 0) {
                     // Invulnerable due to nodes
                     soundEngine.playSound('shield_hit');
                     addFloatingText(b.x, b.y - 12, 'IMMUNE! DESTROY NODES', '#A371F7', 14);
                     createSmallExplosion(b.x, b.y, '#A371F7');
                     if (!b.isLaser) bulletsRef.current.splice(i, 1);
                  } else {
                     // Vulnerable
                     const dmg = (b.isLaser ? 25 : 10);
                     ufo.health -= dmg;
                     state.bossDamageDealt += dmg;
                     recordShotHit();
                     createBigExplosion(b.x, b.y, '#ffffff');
                     soundEngine.playSound('heavy_explode');
                     if (!b.isLaser) bulletsRef.current.splice(i, 1);
                     
                     if (ufo.health <= 0) {
                        destroyUfo(ufo, 20000); // 20k points for final boss
                        break;
                     } else {
                        addFloatingText(ufo.x, ufo.y - 25, `🎯 CORE HIT -${dmg} HP`, '#A371F7', 20);
                     }
                  }
                }
              } else {
                const isOverheated = ufo.bossState === 'cooldown';

                if (isOverheated) {
                  // OVERHEATED VULNERABLE PHASE: SHIELD DROPPED & Core Defense Exposed!
                  const hitRadius = ufo.radius + 15;
                  if (dist < hitRadius + b.size) {
                    const dmg = (b.isLaser ? 28 : 12) * 3; // 3x Damage during vulnerability window!
                    ufo.health -= dmg;
                    state.bossDamageDealt += dmg;
                    recordShotHit();
                    createBigExplosion(b.x, b.y, '#ffffff');
                    soundEngine.playSound('heavy_explode');

                    if (!b.isLaser) {
                      bulletsRef.current.splice(i, 1);
                    }

                    if (ufo.health <= 0) {
                      destroyUfo(ufo, 10000);
                      break;
                    } else {
                      addFloatingText(ufo.x, ufo.y - 25, `💥 OVERHEAT CRITICAL -${dmg} HP`, '#ffff00', 16);
                    }
                  }
                } else {
                  // SHIELDED PHASE (INVULNERABLE OUTSIDE ROTATING SHIELD GAP)
                  const shieldRadius = ufo.radius + 28;
                  if (dist < shieldRadius + b.size) {
                    const impactAngle = Math.atan2(b.y - ufo.y, b.x - ufo.x);
                    let diff = impactAngle - (ufo.shieldAngle || 0);
                    while (diff < -Math.PI) diff += Math.PI * 2;
                    while (diff > Math.PI) diff -= Math.PI * 2;

                    // 60-degree gap opening check (30 degrees = PI/6 on either side of shieldAngle)
                    const isThroughGap = Math.abs(diff) <= Math.PI / 6;

                    if (isThroughGap) {
                      // DIRECT CENTRAL CORE HIT THROUGH ROTATING SHIELD GAP!
                      const dmg = b.isLaser ? 12 : 5;
                      ufo.health -= dmg;
                      state.bossDamageDealt += dmg;
                      recordShotHit();
                      const gapBonus = 300;
                      addScore(gapBonus, true);
                      addFloatingText(ufo.x, ufo.y - 45, `GAP HIT +${gapBonus}`, '#00ffff', 18);
                      createBigExplosion(b.x, b.y, '#00ffff');
                      soundEngine.playSound('heavy_explode');

                      if (!b.isLaser) {
                        bulletsRef.current.splice(i, 1);
                      }

                      if (ufo.health <= 0) {
                        destroyUfo(ufo, 10000);
                        break;
                      } else {
                        addFloatingText(ufo.x, ufo.y - 25, `🎯 CRITICAL CORE HIT -${dmg} HP`, '#00ffff', 20);
                      }
                    } else {
                      // HITS IMPENETRABLE ROTATING SHIELD RING - DEFLECTED!
                      state.shotsHit++;
                      state.consecutiveHits = 0;
                      soundEngine.playSound('shield_hit');
                      for (let sp = 0; sp < 4; sp++) {
                        particlesRef.current.push({
                          x: b.x,
                          y: b.y,
                          vx: Math.cos(impactAngle + (Math.random() - 0.5)) * 6,
                          vy: Math.sin(impactAngle + (Math.random() - 0.5)) * 6,
                          life: 14,
                          maxLife: 14,
                          size: 2.5,
                          color: '#00ffff',
                          shape: 'spark'
                        });
                      }
                      addFloatingText(b.x, b.y - 12, 'SHIELD DEFLECTED!', '#00ffff', 12);
                      if (!b.isLaser) {
                        bulletsRef.current.splice(i, 1);
                      }
                    }
                  }
                }
              }
            } else {
              if (dist < ufo.radius + b.size + 6) {
                let dmg = b.isLaser ? 3 : 1;
                if (ufo.type === 'shield_node') {
                  dmg = b.isLaser ? 40 : 20; // Increased damage to nodes so they can be reasonably destroyed!
                }

                ufo.health -= dmg;
                recordShotHit();
                
                if (ufo.type === 'shield_node') {
                  createSmallExplosion(b.x, b.y, '#A371F7');
                  soundEngine.playSound('shield_hit');
                } else {
                  createSmallExplosion(b.x, b.y, '#ff4444');
                }
                
                if (!b.isLaser) {
                  bulletsRef.current.splice(i, 1);
                }

                if (ufo.health <= 0) {
                  const pts = ufo.type === 'shield_node' ? 500 : ufo.type === 'dreadnought' ? 2000 : ufo.type === 'mothership' ? 1000 : 400;
                  destroyUfo(ufo, pts);
                  break;
                } else {
                  const color = ufo.type === 'shield_node' ? '#A371F7' : '#ff6666';
                  addFloatingText(ufo.x, ufo.y - 15, `-${dmg} HP`, color, 13);
                }
              }
            }
          }
        }

        // UFO Bullets vs Ship
        for (let i = ufoBulletsRef.current.length - 1; i >= 0; i--) {
          const ub = ufoBulletsRef.current[i];
          ub.x += ub.vx;
          ub.y += ub.vy;
          ub.life--;

          // Kinetic Repulsor deflects enemy bullets away from ship!
          if (pTimers.repulsor > 0 && ship.alive) {
            const rdx = ub.x - ship.x;
            const rdy = ub.y - ship.y;
            const rdist = Math.hypot(rdx, rdy);
            if (rdist < 160 && rdist > 1) {
              ub.vx = (rdx / rdist) * 8;
              ub.vy = (rdy / rdist) * 8;
              createSmallExplosion(ub.x, ub.y, '#39ff14');
            }
          }
          
          if (ub.isMine) {
            ub.vx *= 0.98;
            ub.vy *= 0.98;
            
            if (ship.alive) {
               const dist = Math.hypot(ship.x - ub.x, ship.y - ub.y);
               if (dist < 120) { // proximity trigger radius
                  createBigExplosion(ub.x, ub.y, '#ff4400');
                  addShockwave(ub.x, ub.y, 160, '#ffaa00');
                  soundEngine.playSound('heavy_explode');
                  
                  if (dist < ship.radius + 80) { // actual damage radius
                    const isShielded = pTimers.shield > 0 || pTimers.golden > 0 || ship.invincibleTimer > 0;
                    if (isShielded) {
                      soundEngine.playSound('shield_hit');
                    } else {
                      handlePlayerHit();
                    }
                  }
                  ufoBulletsRef.current.splice(i, 1);
                  continue;
               }
            }
          }

          if (ship.alive) {
            if (Math.hypot(ship.x - ub.x, ship.y - ub.y) < ship.radius + (ub.isMine ? ub.size : 6)) {
              const isShielded = pTimers.shield > 0 || pTimers.golden > 0 || ship.invincibleTimer > 0;
              if (isShielded) {
                createSmallExplosion(ub.x, ub.y, '#00ffcc');
                soundEngine.playSound('shield_hit');
                addFloatingText(ub.x, ub.y - 10, 'DEFLECTED!', '#00ffcc', 12);
              } else {
                handlePlayerHit();
              }
              ufoBulletsRef.current.splice(i, 1);
              continue;
            }
          }

          if (ub.life <= 0) ufoBulletsRef.current.splice(i, 1);
        }

        // 6. POWERUP COLLECTIBLES & MAGNET EFFECT
        for (let i = collectiblesRef.current.length - 1; i >= 0; i--) {
          const c = collectiblesRef.current[i];

          // Magnet pull or magnetic attraction physics toward player ship
          if (ship.alive) {
            const dx = ship.x - c.x;
            const dy = ship.y - c.y;
            const dist = Math.hypot(dx, dy);

            // Active Magnet Powerup (450px) or Standard Proximity Attraction Radius (240px)
            const attractionRadius = pTimers.magnet > 0 ? 450 : 240;

            if (dist < attractionRadius && dist > 1) {
              // Smooth acceleration vector: speed increases as crystal gets closer to ship hull
              const proximity = (1 - dist / attractionRadius);
              const pullAcc = pTimers.magnet > 0
                ? 0.8 + proximity * 1.8
                : 0.35 + proximity * 0.95;

              c.vx += (dx / dist) * pullAcc;
              c.vy += (dy / dist) * pullAcc;

              // Velocity damping for smooth magnetic trajectory into ship
              c.vx *= 0.93;
              c.vy *= 0.93;
            }
          }

          c.x += c.vx;
          c.y += c.vy;
          c.life--;
          c.pulse += 0.15;

          if (c.x < 0 || c.x > width) c.vx *= -1;
          if (c.y < 0 || c.y > height) c.vy *= -1;

          // Pickup check
          if (ship.alive && Math.hypot(c.x - ship.x, c.y - ship.y) < 32) {
            if (c.type === 'golden') {
              soundEngine.playSound('golden');
              pTimers.golden = 600;
              pTimers.shield = 600;
              pTimers.tripleShot = 600;
              triggerBigBanner('⚡ HYPER CRYSTAL ACTIVATED!', 'FORCE SHIELD + TRIPLE CANNON OVERDRIVE', '#ffd700', 'rgba(255, 215, 0, 0.9)', 90);
            } else if (c.type === 'triple') {
              soundEngine.playSound('powerup');
              pTimers.tripleShot = 720;
              addFloatingText(ship.x, ship.y - 30, 'TRIPLE SHOT!', '#00ffcc', 20);
            } else if (c.type === 'shield') {
              soundEngine.playSound('powerup');
              pTimers.shield = 720;
              addFloatingText(ship.x, ship.y - 30, 'FORCE SHIELD!', '#66aaff', 20);
            } else if (c.type === 'emp') {
              soundEngine.playSound('powerup');
              state.empCount++;
              onEmpCountUpdate(state.empCount);
              triggerBigBanner('💣 EMP CHARGE RECOVERED!', '+1 EMP SUPER BOMB ACQUIRED', '#fbbf24', 'rgba(251, 191, 36, 0.9)', 80);
            } else if (c.type === 'laser') {
              soundEngine.playSound('powerup');
              pTimers.laser = 600;
              triggerBigBanner('🔥 HYPER LASER CANNON ACTIVATED!', 'HIGH POWER PENETRATING LASER BEAM', '#ff4400', 'rgba(255, 68, 0, 0.9)', 80);
            } else if (c.type === 'drone') {
              soundEngine.playSound('powerup');
              pTimers.drone = 720;
              triggerBigBanner('🛸 ORBITAL DEFENSE DRONE ACTIVATED!', 'AUTONOMOUS PLASMA COMBAT SUPPORT', '#c084fc', 'rgba(192, 132, 252, 0.9)', 80);
            } else if (c.type === 'magnet') {
              soundEngine.playSound('powerup');
              pTimers.magnet = 720;
              triggerBigBanner('🧲 GRAVITY MAGNET ACTIVATED!', 'PULLS ALL POWERUPS TOWARDS SHIP', '#00e5ff', 'rgba(0, 229, 255, 0.9)', 80);
            } else if (c.type === 'nuke') {
              soundEngine.playSound('heavy_explode');
              addShockwave(ship.x, ship.y, 900, '#ff3366');
              triggerBigBanner('💥 SUPERNOVA NUKE DETONATED!', 'MASSIVE COSMIC BLAST VAPORIZES ALL SMALL METEORS & BULLETS', '#ff3366', 'rgba(255, 51, 102, 0.95)', 110);
              ufoBulletsRef.current = [];
              for (let ai = asteroidsRef.current.length - 1; ai >= 0; ai--) {
                const a = asteroidsRef.current[ai];
                if (a.radius < 32) {
                  destroyAsteroid(ai, false);
                } else {
                  a.health = (a.health || 2) - 1;
                }
              }
              for (let ui = ufosRef.current.length - 1; ui >= 0; ui--) {
                const u = ufosRef.current[ui];
                u.health -= 8;
                if (u.health <= 0) destroyUfo(u, u.type === 'dreadnought' ? 2000 : 1000);
              }
            } else if (c.type === 'timewarp') {
              soundEngine.playSound('powerup');
              pTimers.timewarp = 480;
              triggerBigBanner('⏳ CHRONO STASIS ACTIVATED!', 'SPACE TIME SLOWED DOWN BY 75%', '#38bdf8', 'rgba(56, 189, 248, 0.9)', 90);
            } else if (c.type === 'repulsor') {
              soundEngine.playSound('powerup');
              pTimers.repulsor = 600;
              triggerBigBanner('🌀 KINETIC REPULSOR ONLINE!', 'FORCEFIELD DEFLECTS METEORS AND ENEMY PLASMA', '#39ff14', 'rgba(57, 255, 20, 0.9)', 90);
            }
            collectiblesRef.current.splice(i, 1);
            continue;
          }

          if (c.life <= 0) collectiblesRef.current.splice(i, 1);
        }

        // 7. PARTICLES & SHOCKWAVES UPDATE
        if (trailParticlesRef.current.length > 150) {
          trailParticlesRef.current.splice(0, trailParticlesRef.current.length - 150);
        }
        for (let i = trailParticlesRef.current.length - 1; i >= 0; i--) {
          const p = trailParticlesRef.current[i];
          p.x += p.vx;
          p.y += p.vy;
          p.life--;
          p.size *= 0.95;
          if (p.life <= 0 || p.size < 0.2) trailParticlesRef.current.splice(i, 1);
        }

        if (particlesRef.current.length > 150) {
          particlesRef.current.splice(0, particlesRef.current.length - 150);
        }
        for (let i = particlesRef.current.length - 1; i >= 0; i--) {
          const p = particlesRef.current[i];
          p.x += p.vx;
          p.y += p.vy;
          p.vx *= 0.97;
          p.vy *= 0.97;
          p.life--;
          if (p.life <= 0) particlesRef.current.splice(i, 1);
        }

        for (let i = shockwavesRef.current.length - 1; i >= 0; i--) {
          const s = shockwavesRef.current[i];
          s.radius += (s.maxRadius - s.radius) * 0.15;
          s.life--;
          if (s.life <= 0) shockwavesRef.current.splice(i, 1);
        }

        for (let i = floatingTextsRef.current.length - 1; i >= 0; i--) {
          const ft = floatingTextsRef.current[i];
          ft.y -= 0.8;
          ft.life--;
          if (ft.life <= 0) floatingTextsRef.current.splice(i, 1);
        }
      }

      // --- RENDERING PHASE ---
      ctx.save();

      // Screen Shake
      if (screenShakeEnabled && state.shakeTimer > 0) {
        state.shakeTimer--;
        const rx = (Math.random() - 0.5) * state.shakeIntensity;
        const ry = (Math.random() - 0.5) * state.shakeIntensity;
        ctx.translate(rx, ry);
      }

      // 1. Deep Space Canvas Background with TRON Digital Data-Grid
      ctx.fillStyle = '#03050d';
      ctx.fillRect(0, 0, width, height);

      // Subtle underlying glowing multi-colored digital data-grid pattern
      ctx.save();
      const gridSize = 48;
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.08)';
      ctx.lineWidth = 1;

      for (let x = 0; x <= width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y <= height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Multi-colored digital grid node lights across dark space
      const gTime = Date.now() * 0.002;
      for (let x = gridSize; x < width; x += gridSize * 3) {
        for (let y = gridSize; y < height; y += gridSize * 3) {
          const p = (Math.sin(gTime + x * 0.01 + y * 0.01) + 1) * 0.5;
          ctx.fillStyle = (x + y) % (gridSize * 6) === 0 ? `rgba(192, 132, 252, ${0.15 + p * 0.25})` : `rgba(0, 240, 255, ${0.12 + p * 0.28})`;
          ctx.fillRect(x - 1.5, y - 1.5, 3, 3);
        }
      }
      ctx.restore();

      // Stars Parallax
      starsRef.current.forEach((st) => {
        ctx.fillStyle = `rgba(255, 255, 255, ${st.alpha})`;
        ctx.beginPath();
        ctx.arc(st.x, st.y, st.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // 2. Thruster Trails
      trailParticlesRef.current.forEach((p) => {
        ctx.globalAlpha = Math.max(0, p.life / p.maxLife);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;

      // 3. Shockwave Rings
      shockwavesRef.current.forEach((s) => {
        ctx.save();
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.strokeStyle = s.color;
        ctx.globalAlpha = s.life / 30;
        ctx.lineWidth = 4;
        ctx.stroke();
        ctx.restore();
      });

      // 4. Asteroids Rendering with 3D Volumetric Relief
      asteroidsRef.current.forEach((a) => {
        // Draw orbital dotted path guide around Planetoid
        if (a.type === 'planetoid') {
          ctx.save();
          ctx.setLineDash([4, 6]);
          ctx.strokeStyle = 'rgba(56, 189, 248, 0.28)';
          ctx.lineWidth = 1.2;
          [95, 123, 151].forEach((ringR) => {
            ctx.beginPath();
            ctx.arc(a.x, a.y, ringR, 0, Math.PI * 2);
            ctx.stroke();
          });
          ctx.restore();
        }

        ctx.save();
        ctx.translate(a.x, a.y);
        ctx.rotate(a.angle);

        if (a.beingConsumed) {
          ctx.scale(a.consumeScale || 1.0, a.consumeScale || 1.0);
          ctx.rotate(a.consumeRotation || 0);
        }

        if (a.type === 'phantom' && a.isPhasedOut) {
          ctx.globalAlpha = 0.22;
        } else {
          ctx.globalAlpha = 1.0;
        }

        // Lazy initialize offscreen canvas buffers if missing
        if (!a.cachedCanvas) {
          a.cachedCanvas = generateAsteroidOffscreenCanvas(a, false);
          a.cachedCanvasHit = generateAsteroidOffscreenCanvas(a, true);
        }

        const isHit = (a.hitTimer || 0) > 0;
        const buffer = isHit ? (a.cachedCanvasHit || a.cachedCanvas) : a.cachedCanvas;

        if (buffer) {
          ctx.drawImage(buffer, -buffer.width / 2, -buffer.height / 2);
        }

        ctx.restore();
      });

      // 5. Collectible Floating Items with TRON Vector Geometry
      collectiblesRef.current.forEach((c) => {
        ctx.save();
        ctx.translate(c.x, c.y);

        let pulse = 1 + Math.sin(c.pulse) * 0.22;
        let alpha = 1;
        if (c.life < 150) {
          alpha = Math.floor(c.life / 6) % 2 === 0 ? 1 : 0.3;
        }

        ctx.globalAlpha = alpha;

        let col = '#00ffcc';
        let label = '3';

        if (c.type === 'golden') {
          col = '#ffd700';
          label = '★';
        } else if (c.type === 'triple') {
          col = '#00ffcc';
          label = '3';
        } else if (c.type === 'shield') {
          col = '#38bdf8';
          label = 'S';
        } else if (c.type === 'emp') {
          col = '#fbbf24';
          label = 'E';
        } else if (c.type === 'laser') {
          col = '#ff4400';
          label = 'L';
        } else if (c.type === 'drone') {
          col = '#c084fc';
          label = 'D';
        } else if (c.type === 'magnet') {
          col = '#00e5ff';
          label = 'M';
        } else if (c.type === 'nuke') {
          col = '#ff3366';
          label = 'N';
        } else if (c.type === 'timewarp') {
          col = '#38bdf8';
          label = 'T';
        } else if (c.type === 'repulsor') {
          col = '#39ff14';
          label = 'R';
        }

        const rot = Date.now() * 0.003 + c.pulse;

        // A. Outer Rotating Wireframe Hexagon Radar Ring
        ctx.save();
        ctx.rotate(rot);
        ctx.strokeStyle = col;
        ctx.lineWidth = 1.2;
        ctx.shadowColor = col;
        ctx.shadowBlur = 10;
        ctx.setLineDash([4, 4]);

        const outerR = c.size * 1.8 * pulse;
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const a = (i * Math.PI * 2) / 6;
          const px = Math.cos(a) * outerR;
          const py = Math.sin(a) * outerR;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.restore();

        // B. Sharp TRON Diamond Crystal Wireframe Bit
        ctx.save();
        ctx.rotate(-rot * 1.5);
        ctx.strokeStyle = col;
        ctx.lineWidth = 1.8;
        ctx.shadowColor = col;
        ctx.shadowBlur = 12;

        const sz = c.size * pulse;
        ctx.beginPath();
        ctx.moveTo(0, -sz);
        ctx.lineTo(sz * 0.9, 0);
        ctx.lineTo(0, sz);
        ctx.lineTo(-sz * 0.9, 0);
        ctx.closePath();
        ctx.stroke();

        // Inner Facet Crosses
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, -sz);
        ctx.lineTo(0, sz);
        ctx.moveTo(-sz * 0.9, 0);
        ctx.lineTo(sz * 0.9, 0);
        ctx.stroke();
        ctx.restore();

        // C. Sharp Monospace Label Icon
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = col;
        ctx.shadowBlur = 8;
        ctx.font = 'bold 11px font-mono, monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(label, 0, 1);

        ctx.restore();
      });

      // 5.5. BLACK HOLE HAZARDS (DYNAMIC VISUAL SINGULARITY)
      for (const bh of blackHolesRef.current) {
        ctx.save();
        ctx.translate(bh.x, bh.y);

        // A. Gravitational Distortion Field & Expanding Cyan Space-Time Ripple Waves
        const pulseRadius = bh.pullRadius + Math.sin(bh.pulse) * 12;
        const grad = ctx.createRadialGradient(0, 0, bh.radius, 0, 0, pulseRadius);
        grad.addColorStop(0, 'rgba(168, 85, 247, 0.35)');
        grad.addColorStop(0.4, 'rgba(0, 255, 255, 0.15)');
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(0, 0, pulseRadius, 0, Math.PI * 2);
        ctx.fill();

        // Expanding cyan ripple wave grid around outer distortion radius
        const nowSec = Date.now() * 0.001;
        for (let waveIdx = 0; waveIdx < 3; waveIdx++) {
          const wavePhase = ((nowSec * 0.8 + waveIdx * 0.333) % 1);
          const waveRadius = bh.radius + wavePhase * (bh.pullRadius - bh.radius);
          const waveAlpha = (1 - wavePhase) * 0.35;

          ctx.save();
          ctx.strokeStyle = `rgba(0, 255, 255, ${waveAlpha})`;
          ctx.lineWidth = 1.8;
          ctx.shadowBlur = 12;
          ctx.shadowColor = '#00FFFF';
          ctx.beginPath();
          ctx.arc(0, 0, waveRadius, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }

        // B. Accretion Vortex (Dynamic Spiraling Neon Particle System on Logarithmic Paths)
        ctx.save();
        const numSpiralParticles = 36;
        const maxSpiralR = bh.pullRadius * 0.72;
        const minSpiralR = bh.radius + 1;

        for (let i = 0; i < numSpiralParticles; i++) {
          const progress = ((nowSec * 0.75 + i * (1 / numSpiralParticles)) % 1);
          const factor = Math.pow(1 - progress, 2.2);
          const r = minSpiralR + (maxSpiralR - minSpiralR) * factor;

          const armOffset = (i % 3) * ((Math.PI * 2) / 3);
          const spiralLog = 3.2 * Math.log((r + 15) / minSpiralR);
          const angle = bh.rotation * 2.2 + armOffset + spiralLog + progress * Math.PI * 3.5;

          const px = Math.cos(angle) * r;
          const py = Math.sin(angle) * r * 0.72;

          const particleColor = i % 2 === 0 ? '#FF00FF' : '#00FFFF';
          const particleSize = 1.8 + (r / maxSpiralR) * 2.2;

          ctx.save();
          ctx.fillStyle = particleColor;
          ctx.shadowColor = particleColor;
          ctx.shadowBlur = 14;

          ctx.beginPath();
          ctx.arc(px, py, particleSize, 0, Math.PI * 2);
          ctx.fill();

          const prevProgress = Math.max(0, progress - 0.028);
          const prevFactor = Math.pow(1 - prevProgress, 2.2);
          const prevR = minSpiralR + (maxSpiralR - minSpiralR) * prevFactor;
          const prevLog = 3.2 * Math.log((prevR + 15) / minSpiralR);
          const prevAngle = bh.rotation * 2.2 + armOffset + prevLog + prevProgress * Math.PI * 3.5;
          const tailX = Math.cos(prevAngle) * prevR;
          const tailY = Math.sin(prevAngle) * prevR * 0.72;

          ctx.strokeStyle = particleColor;
          ctx.lineWidth = particleSize * 0.85;
          ctx.globalAlpha = 0.65;
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(tailX, tailY);
          ctx.stroke();

          ctx.restore();
        }
        ctx.restore();

        // C. Ultra-Bright, Tight Glowing Cyan/White Photon Ring (Pulsing Radius)
        const ringPulse = Math.sin(bh.pulse * 2.2) * 2.2;
        const photonRadius = bh.radius + 2.5 + ringPulse;

        ctx.save();
        ctx.beginPath();
        ctx.arc(0, 0, photonRadius, 0, Math.PI * 2);
        ctx.strokeStyle = '#FFFFFF';
        ctx.shadowColor = '#00FFFF';
        ctx.shadowBlur = 18;
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(0, 0, photonRadius, 0, Math.PI * 2);
        ctx.strokeStyle = '#00FFFF';
        ctx.shadowColor = '#00FFFF';
        ctx.shadowBlur = 12;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.restore();

        // D. Pure Black Central Sphere Event Horizon Void
        ctx.save();
        ctx.beginPath();
        ctx.arc(0, 0, bh.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#000000';
        ctx.shadowBlur = 0;
        ctx.fill();
        ctx.restore();

        // E. Health Bar if Damaged
        if (bh.health < bh.maxHealth) {
          const barW = 40;
          const barH = 4;
          ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
          ctx.fillRect(-barW / 2, -bh.radius - 18, barW, barH);
          ctx.fillStyle = '#a855f7';
          ctx.fillRect(-barW / 2, -bh.radius - 18, Math.max(0, barW * (bh.health / bh.maxHealth)), barH);
        }

        ctx.restore();
      }

      // 5.6. IONIZING NEBULA HAZARDS (TRON VECTOR EMP CLOUD)
      nebulasRef.current.forEach((neb) => {
        ctx.save();
        ctx.translate(neb.x, neb.y);
        ctx.rotate(neb.rotation);

        neb.flicker = 0.82 + Math.random() * 0.36;
        const isFlashing = neb.damageFlash > 0;
        const mainColor = isFlashing ? '#ffffff' : '#ff00ff';
        const meshColor = isFlashing ? 'rgba(255, 255, 255, 0.85)' : `rgba(217, 70, 239, ${0.42 * neb.flicker})`;

        // A. Sprawling Semi-Transparent Corrupted Data-Field Translucent Fill
        ctx.fillStyle = isFlashing ? 'rgba(255, 255, 255, 0.28)' : `rgba(255, 0, 255, ${0.07 * neb.flicker})`;
        ctx.beginPath();
        neb.outerVertices.forEach((v, idx) => {
          if (idx === 0) ctx.moveTo(v.x, v.y);
          else ctx.lineTo(v.x, v.y);
        });
        ctx.closePath();
        ctx.fill();

        // B. Outer Jagged Vector Boundary Polygon Line
        ctx.strokeStyle = isFlashing ? '#ffffff' : `rgba(255, 0, 255, ${0.9 * neb.flicker})`;
        ctx.shadowColor = mainColor;
        ctx.shadowBlur = isFlashing ? 18 : 12;
        ctx.lineWidth = isFlashing ? 3 : 2;
        ctx.beginPath();
        neb.outerVertices.forEach((v, idx) => {
          if (idx === 0) ctx.moveTo(v.x, v.y);
          else ctx.lineTo(v.x, v.y);
        });
        ctx.closePath();
        ctx.stroke();

        // C. Interlocking TRON Vector Fractal Mesh Lines
        ctx.strokeStyle = meshColor;
        ctx.lineWidth = 1;
        ctx.beginPath();
        const allNodes = [...neb.innerNodes, ...neb.outerVertices];
        neb.meshConnections.forEach(([i1, i2]) => {
          const n1 = allNodes[i1];
          const n2 = allNodes[i2];
          if (n1 && n2) {
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(n2.x, n2.y);
          }
        });
        ctx.stroke();

        // D. Inner Node Vector Diamond Spark Dots
        ctx.fillStyle = mainColor;
        ctx.shadowBlur = 8;
        ctx.shadowColor = mainColor;
        neb.innerNodes.forEach((n) => {
          ctx.fillRect(n.x - 1.5, n.y - 1.5, 3, 3);
        });

        // E. Rapid Internal Static Lightning Arcs
        neb.internalArcs.forEach((arc) => {
          ctx.strokeStyle = isFlashing ? '#ffffff' : arc.color;
          ctx.lineWidth = 1.5;
          ctx.shadowBlur = 10;
          ctx.shadowColor = mainColor;
          ctx.beginPath();
          arc.path.forEach((p, pIdx) => {
            if (pIdx === 0) ctx.moveTo(p.x, p.y);
            else ctx.lineTo(p.x, p.y);
          });
          ctx.stroke();
        });

        // F. Health Bar if Damaged
        if (neb.health < neb.maxHealth) {
          const barW = 50;
          const barH = 5;
          ctx.fillStyle = 'rgba(15, 5, 20, 0.85)';
          ctx.fillRect(-barW / 2, -neb.radius - 18, barW, barH);
          ctx.fillStyle = '#ff00ff';
          ctx.fillRect(-barW / 2, -neb.radius - 18, Math.max(0, barW * (neb.health / neb.maxHealth)), barH);
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1;
          ctx.strokeRect(-barW / 2, -neb.radius - 18, barW, barH);
        }

        ctx.restore();
      });

      // 5.7. BINARY PLASMA CORE HAZARDS RENDERING
      plasmaCoresRef.current.forEach((pair) => {
        const core1 = pair.core1;
        const core2 = pair.core2;

        // Render Volatile Jagged Vector Energy Tether if both cores exist
        if (core1 && core2) {
          ctx.save();
          const dx = core2.x - core1.x;
          const dy = core2.y - core1.y;
          const dist = Math.hypot(dx, dy) || 1;
          const normX = -dy / dist;
          const normY = dx / dist;

          // Outer Neon Glow Line
          ctx.strokeStyle = '#00ffff';
          ctx.lineWidth = 4;
          ctx.shadowColor = '#00ffff';
          ctx.shadowBlur = 18;
          ctx.beginPath();
          ctx.moveTo(core1.x, core1.y);

          const segments = 7;
          for (let s = 1; s < segments; s++) {
            const ratio = s / segments;
            const offset = (Math.random() - 0.5) * 22;
            ctx.lineTo(
              core1.x + dx * ratio + normX * offset,
              core1.y + dy * ratio + normY * offset
            );
          }
          ctx.lineTo(core2.x, core2.y);
          ctx.stroke();

          // Inner White-Hot Core Line
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2;
          ctx.shadowColor = '#ffffff';
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.moveTo(core1.x, core1.y);
          for (let s = 1; s < segments; s++) {
            const ratio = s / segments;
            const offset = (Math.random() - 0.5) * 12;
            ctx.lineTo(
              core1.x + dx * ratio + normX * offset,
              core1.y + dy * ratio + normY * offset
            );
          }
          ctx.lineTo(core2.x, core2.y);
          ctx.stroke();

          ctx.restore();
        }

        // Helper to render individual Plasma Core Node
        const renderCoreNode = (c: PlasmaCoreNode) => {
          ctx.save();
          ctx.translate(c.x, c.y);

          const now = Date.now();
          const isFlashing = c.damageFlash > 0;
          const coreColor = isFlashing ? '#ffffff' : c.color;

          // Slingshotting Thruster Trail / Warning Aura
          if (c.isSlingshotting) {
            ctx.save();
            const trailAngle = Math.atan2(c.vy, c.vx) + Math.PI;
            ctx.rotate(trailAngle);

            const trailGrad = ctx.createLinearGradient(0, 0, 45, 0);
            trailGrad.addColorStop(0, c.color);
            trailGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

            ctx.fillStyle = trailGrad;
            ctx.shadowColor = c.color;
            ctx.shadowBlur = 25;
            ctx.beginPath();
            ctx.moveTo(0, -c.radius * 0.7);
            ctx.lineTo(45, 0);
            ctx.lineTo(0, c.radius * 0.7);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
          }

          // Outer Faceted Polyhedral Geometric Diamond Core
          ctx.strokeStyle = coreColor;
          ctx.lineWidth = isFlashing ? 3.5 : 2.5;
          ctx.shadowColor = coreColor;
          ctx.shadowBlur = isFlashing ? 30 : 20;

          const sides = 8;
          const rotSpeed = c.color === '#FF8800' ? 0.005 : -0.005;
          const baseRot = now * rotSpeed;

          ctx.beginPath();
          for (let i = 0; i < sides; i++) {
            const a = baseRot + (i / sides) * Math.PI * 2;
            const r = c.radius * (i % 2 === 0 ? 1.25 : 0.85);
            const px = Math.cos(a) * r;
            const py = Math.sin(a) * r;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.stroke();

          // Inner Polygon Mesh Facets
          ctx.strokeStyle = isFlashing ? '#ffffff' : 'rgba(255, 255, 255, 0.7)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          for (let i = 0; i < sides; i++) {
            const a = baseRot + (i / sides) * Math.PI * 2;
            const px = Math.cos(a) * c.radius * 1.25;
            const py = Math.sin(a) * c.radius * 1.25;
            ctx.moveTo(0, 0);
            ctx.lineTo(px, py);
          }
          ctx.stroke();

          // Inner Glowing Plasma Sphere
          const radGrad = ctx.createRadialGradient(0, 0, 2, 0, 0, c.radius * 0.75);
          radGrad.addColorStop(0, '#ffffff');
          radGrad.addColorStop(0.5, coreColor);
          radGrad.addColorStop(1, 'rgba(0, 0, 0, 0.8)');

          ctx.fillStyle = radGrad;
          ctx.beginPath();
          ctx.arc(0, 0, c.radius * 0.75, 0, Math.PI * 2);
          ctx.fill();

          // Core Health Bar
          if (c.health < c.maxHealth) {
            const barW = 42;
            const barH = 5;
            ctx.fillStyle = 'rgba(8, 8, 16, 0.9)';
            ctx.fillRect(-barW / 2, -c.radius - 16, barW, barH);

            ctx.fillStyle = coreColor;
            ctx.fillRect(-barW / 2, -c.radius - 16, Math.max(0, barW * (c.health / c.maxHealth)), barH);

            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1;
            ctx.strokeRect(-barW / 2, -c.radius - 16, barW, barH);
          }

          ctx.restore();
        };

        if (core1) renderCoreNode(core1);
        if (core2) renderCoreNode(core2);
      });

      // 6. Alien UFO Enemies Rendering
      for (const ufo of ufosRef.current) {
        const isMothership = ufo.type === 'mothership';
        const isDreadnought = ufo.type === 'dreadnought';
        const isHunter = ufo.type === 'hunter';
        const isSwarmer = ufo.type === 'swarmer';
        const isSupply = ufo.type === 'supply';
        const now = Date.now();

        // Draw Boss Grid Sweep Vector Beam Attack (Telegraph & Execution Phases)
        if (ufo.isBoss) {
          const sweepAngle = ufo.laserTargetAngle || Math.PI / 2;
          const beamDist = 2200;

          // 1. TELEGRAPH PHASE (2.5 seconds / 150 frames): Thin faint target line
          if (ufo.bossState === 'laserCharge') {
            ctx.save();
            ctx.strokeStyle = `rgba(0, 255, 255, ${0.4 + Math.sin(now * 0.02) * 0.3})`;
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#00ffff';
            ctx.lineWidth = 1.5;
            ctx.setLineDash([8, 6]);

            ctx.beginPath();
            ctx.moveTo(ufo.x, ufo.y);
            ctx.lineTo(ufo.x + Math.cos(sweepAngle) * beamDist, ufo.y + Math.sin(sweepAngle) * beamDist);
            ctx.stroke();

            ctx.setLineDash([]);
            ctx.restore();
          }

          // 2. EXECUTION PHASE (1.5 seconds / 90 frames): Massive solid glowing cyan/crimson vector laser
          if (ufo.bossState === 'laserFire') {
            ctx.save();

            // Outer Crimson Glow
            ctx.strokeStyle = 'rgba(255, 0, 85, 0.55)';
            ctx.shadowColor = '#00ffff';
            ctx.shadowBlur = 40;
            ctx.lineWidth = 25;
            ctx.beginPath();
            ctx.moveTo(ufo.x, ufo.y);
            ctx.lineTo(ufo.x + Math.cos(sweepAngle) * beamDist, ufo.y + Math.sin(sweepAngle) * beamDist);
            ctx.stroke();

            // Middle Dense Cyan Wave
            ctx.strokeStyle = 'rgba(0, 255, 255, 0.82)';
            ctx.shadowColor = '#ff0055';
            ctx.shadowBlur = 20;
            ctx.lineWidth = 14;
            ctx.beginPath();
            ctx.moveTo(ufo.x, ufo.y);
            ctx.lineTo(ufo.x + Math.cos(sweepAngle) * beamDist, ufo.y + Math.sin(sweepAngle) * beamDist);
            ctx.stroke();

            // Core Solid White Vector Energy
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.96)';
            ctx.lineWidth = 6;
            ctx.beginPath();
            ctx.moveTo(ufo.x, ufo.y);
            ctx.lineTo(ufo.x + Math.cos(sweepAngle) * beamDist, ufo.y + Math.sin(sweepAngle) * beamDist);
            ctx.stroke();

            ctx.restore();
          }
        }

        // Draw Dreadnought charging Death Beam
        if (isDreadnought && !ufo.isBoss && ufo.isChargingBeam) {
          ctx.save();
          ctx.strokeStyle = 'rgba(255, 0, 85, 0.85)';
          ctx.lineWidth = 14 + Math.sin(now * 0.05) * 6;
          ctx.shadowBlur = 30;
          ctx.shadowColor = '#ff0055';
          ctx.beginPath();
          ctx.moveTo(ufo.x, ufo.y + ufo.radius);
          ctx.lineTo(ufo.x, height);
          ctx.stroke();

          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(ufo.x, ufo.y + ufo.radius);
          ctx.lineTo(ufo.x, height);
          ctx.stroke();
          ctx.restore();
        }

        ctx.save();
        ctx.translate(ufo.x, ufo.y);

        let auraColor = 'rgba(255, 42, 85, 0.9)';
        if (ufo.isBoss) auraColor = 'rgba(255, 0, 85, 0.95)';
        else if (isDreadnought) auraColor = 'rgba(225, 29, 72, 0.95)';
        else if (isMothership) auraColor = 'rgba(217, 70, 239, 0.85)';
        else if (isHunter) auraColor = 'rgba(255, 153, 0, 0.9)';
        else if (isSwarmer) auraColor = 'rgba(0, 255, 102, 0.9)';
        else if (isSupply) auraColor = 'rgba(255, 215, 0, 0.95)';

        ctx.shadowBlur = ufo.isBoss ? 35 : isDreadnought ? 30 : isMothership ? 25 : isHunter ? 14 : isSwarmer ? 12 : isSupply ? 20 : 15;
        ctx.shadowColor = auraColor;

        if (isSupply) {
          ctx.strokeStyle = '#ffd700';
          ctx.fillStyle = 'rgba(255, 215, 0, 0.25)';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(0, -ufo.radius);
          ctx.lineTo(ufo.radius, 0);
          ctx.lineTo(0, ufo.radius);
          ctx.lineTo(-ufo.radius, 0);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Inner glowing crystal core
          ctx.fillStyle = '#ffffff';
          ctx.shadowBlur = 15;
          ctx.shadowColor = '#ffd700';
          ctx.beginPath();
          ctx.arc(0, 0, 5, 0, Math.PI * 2);
          ctx.fill();
        } else if (ufo.type === 'shield_node') {
          // Shield Node rendering: Hexagonal shield generator with rotating ring and glowing lens
          const rad = ufo.radius;
          const nodePulse = Math.sin(now * 0.005) * 0.5 + 0.5;
          const nodeColor = '#A371F7';
          const coreColor = '#00ffff';

          // Rotating Outer Tech Ring
          ctx.save();
          ctx.rotate(now * 0.0015);
          ctx.strokeStyle = `rgba(163, 113, 247, ${0.4 + nodePulse * 0.3})`;
          ctx.lineWidth = 3;
          ctx.setLineDash([15, 10, 5, 10]);
          ctx.beginPath();
          ctx.arc(0, 0, rad * 1.2, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();

          // Hexagonal Drone Body
          ctx.save();
          ctx.rotate(ufo.angle || now * 0.0008);
          ctx.strokeStyle = nodeColor;
          ctx.shadowBlur = 15 + nodePulse * 10;
          ctx.shadowColor = nodeColor;
          ctx.lineWidth = 3;
          ctx.fillStyle = 'rgba(10, 5, 25, 0.9)';
          
          ctx.beginPath();
          for (let i = 0; i < 6; i++) {
             const a = (i / 6) * Math.PI * 2;
             if (i === 0) ctx.moveTo(Math.cos(a) * rad, Math.sin(a) * rad);
             else ctx.lineTo(Math.cos(a) * rad, Math.sin(a) * rad);
          }
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Internal Support Struts
          ctx.strokeStyle = 'rgba(163, 113, 247, 0.5)';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          for (let i = 0; i < 6; i++) {
             const a = (i / 6) * Math.PI * 2;
             ctx.moveTo(0, 0);
             ctx.lineTo(Math.cos(a) * rad, Math.sin(a) * rad);
          }
          ctx.stroke();
          ctx.restore();

          // Glowing Central Lens
          ctx.fillStyle = coreColor;
          ctx.shadowBlur = 20;
          ctx.shadowColor = coreColor;
          ctx.beginPath();
          ctx.arc(0, 0, rad * 0.35 + nodePulse * 3, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(0, 0, rad * 0.15, 0, Math.PI * 2);
          ctx.fill();

        } else if (ufo.type === 'triad_core') {
          // --- WAVE 15 FINAL BOSS: TRIAD PROTOCOL ---
          const triadCores = ufosRef.current.filter(u => u.type === 'triad_core');
          const isLinked = triadCores.length > 1;
          const isBerserk = triadCores.length === 1;
          const rad = ufo.radius;
          
          ctx.save();
          // Draw energy beams connecting them (only draw from the first core to avoid overlap)
          if (isLinked && ufo.id === triadCores[0].id) {
             ctx.save();
             // Draw connecting laser tethers
             ctx.lineWidth = 6 + Math.sin(now * 0.015) * 3;
             ctx.strokeStyle = '#00ffff';
             ctx.shadowBlur = 30;
             ctx.shadowColor = '#00ffff';
             ctx.beginPath();
             for(let c = 0; c < triadCores.length; c++) {
                const core = triadCores[c];
                if (c === 0) ctx.moveTo(core.x, core.y);
                else ctx.lineTo(core.x, core.y);
             }
             if (triadCores.length > 2) ctx.closePath();
             ctx.stroke();
             
             // Inner brighter beam
             ctx.lineWidth = 2;
             ctx.strokeStyle = '#ffffff';
             ctx.shadowBlur = 10;
             ctx.beginPath();
             for(let c = 0; c < triadCores.length; c++) {
                const core = triadCores[c];
                if (c === 0) ctx.moveTo(core.x, core.y);
                else ctx.lineTo(core.x, core.y);
             }
             if (triadCores.length > 2) ctx.closePath();
             ctx.stroke();
             ctx.restore();
          }

          ctx.translate(ufo.x, ufo.y);
          
          const pulse = (Math.sin(now * (isBerserk ? 0.02 : 0.01)) + 1) / 2;
          const coreColor = isBerserk ? '#ff0055' : '#a855f7';
          const accentColor = isBerserk ? '#ffaa00' : '#00ffff';

          // Outer corrupted rings
          ctx.save();
          ctx.rotate(now * (isBerserk ? 0.005 : 0.002));
          ctx.strokeStyle = coreColor;
          ctx.shadowBlur = 20 + pulse * 20;
          ctx.shadowColor = coreColor;
          ctx.lineWidth = 4;
          
          // Hexagon orbit
          ctx.beginPath();
          for(let i=0; i<6; i++) {
             const a = (i/6) * Math.PI * 2;
             const r = rad * 1.1 + Math.sin(now * 0.01 + i) * 10;
             if (i===0) ctx.moveTo(Math.cos(a)*r, Math.sin(a)*r);
             else ctx.lineTo(Math.cos(a)*r, Math.sin(a)*r);
          }
          ctx.closePath();
          ctx.stroke();
          
          // Outer nodes
          ctx.fillStyle = accentColor;
          for(let i=0; i<6; i++) {
             const a = (i/6) * Math.PI * 2;
             const r = rad * 1.1 + Math.sin(now * 0.01 + i) * 10;
             ctx.beginPath();
             ctx.arc(Math.cos(a)*r, Math.sin(a)*r, 6, 0, Math.PI*2);
             ctx.fill();
          }
          ctx.restore();

          // Central Faceted Mainframe
          ctx.rotate(-now * 0.001);
          
          const grad = ctx.createRadialGradient(0, 0, rad * 0.1, 0, 0, rad);
          grad.addColorStop(0, '#ffffff');
          grad.addColorStop(0.3, coreColor);
          grad.addColorStop(1, '#05030f');
          
          ctx.fillStyle = grad;
          ctx.strokeStyle = accentColor;
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(0, -rad);
          ctx.lineTo(rad * 0.866, -rad * 0.5);
          ctx.lineTo(rad * 0.866, rad * 0.5);
          ctx.lineTo(0, rad);
          ctx.lineTo(-rad * 0.866, rad * 0.5);
          ctx.lineTo(-rad * 0.866, -rad * 0.5);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
          
          // Inner eye / core
          ctx.fillStyle = isBerserk ? '#ffaa00' : '#ffffff';
          ctx.shadowBlur = 40;
          ctx.shadowColor = ctx.fillStyle;
          ctx.beginPath();
          ctx.ellipse(0, 0, rad * 0.2, rad * 0.4 + pulse * rad * 0.1, 0, 0, Math.PI*2);
          ctx.fill();
          
          ctx.restore();

        } else if (ufo.type === 'core_severance') {
          // --- LEVEL 10 FINAL BOSS: CORE SEVERANCE (BIBLICALLY ACCURATE AI SERAPHIM) ---
          const rad = ufo.radius;
          const isVulnerable = ufo.bossPhase === 2; // Phase 2 means nodes are dead
          
          const pulseSpeed = isVulnerable ? 0.012 : 0.003;
          const rotateSpeed = isVulnerable ? 0.004 : 0.001;
          const eyePulse = Math.sin(now * pulseSpeed) * 0.5 + 0.5;
          const slowRot = now * rotateSpeed;
          
          const primaryColor = isVulnerable ? '#ffaa00' : '#00ffff'; // TRON cyan and overheat amber
          const accentColor = isVulnerable ? '#ffffff' : '#ff0055';

          ctx.shadowBlur = isVulnerable ? 50 + eyePulse * 40 : 30 + eyePulse * 15;
          ctx.shadowColor = primaryColor;
          
          // Outer Orbiting Runes/Glyphs (Binary/Hex data rings)
          ctx.save();
          ctx.rotate(-slowRot * 0.5);
          ctx.fillStyle = isVulnerable ? `rgba(255, 0, 85, ${0.4 + eyePulse * 0.4})` : `rgba(163, 113, 247, ${0.4 + eyePulse * 0.3})`;
          ctx.font = `bold ${rad * 0.15}px monospace`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          const ringRad = rad * 1.4;
          for (let i = 0; i < 16; i++) {
            const angle = (i / 16) * Math.PI * 2;
            const px = Math.cos(angle) * ringRad;
            const py = Math.sin(angle) * ringRad;
            ctx.save();
            ctx.translate(px, py);
            ctx.rotate(angle + Math.PI / 2);
            ctx.fillText(Math.random() > 0.5 ? '1' : '0', 0, 0);
            ctx.restore();
          }
          ctx.restore();

          // Outer Gyroscopic Ring 1
          ctx.save();
          ctx.scale(1, 0.4 + Math.sin(now * 0.001) * 0.2);
          ctx.rotate(slowRot * 1.2);
          ctx.strokeStyle = primaryColor;
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.arc(0, 0, rad * 1.1, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();

          // Outer Gyroscopic Ring 2
          ctx.save();
          ctx.scale(0.4 + Math.cos(now * 0.0013) * 0.2, 1);
          ctx.rotate(-slowRot * 1.5);
          ctx.strokeStyle = accentColor;
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(0, 0, rad * 1.2, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();

          // 6 Rotating Monoliths / "Wings"
          ctx.save();
          ctx.rotate(slowRot * 0.8);
          ctx.fillStyle = '#05030f';
          ctx.strokeStyle = primaryColor;
          ctx.lineWidth = 2.5;
          for (let i = 0; i < 6; i++) {
             ctx.save();
             ctx.rotate((i / 6) * Math.PI * 2);
             // Breathing effect for wings
             const wingDist = isVulnerable ? rad * 0.7 + Math.sin(now * 0.01 + i) * 15 : rad * 0.8;
             ctx.translate(wingDist, 0);
             
             ctx.beginPath();
             ctx.moveTo(0, -rad * 0.1);
             ctx.lineTo(rad * 0.6, 0);
             ctx.lineTo(0, rad * 0.1);
             ctx.lineTo(-rad * 0.1, 0);
             ctx.closePath();
             ctx.fill();
             ctx.stroke();
             
             // Inner wing glow
             ctx.fillStyle = accentColor;
             ctx.beginPath();
             ctx.arc(rad * 0.4, 0, rad * 0.04, 0, Math.PI * 2);
             ctx.fill();
             
             ctx.restore();
          }
          ctx.restore();

          // Central Crystalline Core / "The All-Seeing Eye"
          ctx.save();
          const eyeRad = isVulnerable ? rad * 0.65 + eyePulse * 20 : rad * 0.55 + eyePulse * 8;
          
          // Core background (Outer Eyelids)
          ctx.fillStyle = '#0a0a1a';
          ctx.beginPath();
          ctx.moveTo(-eyeRad, 0);
          ctx.quadraticCurveTo(0, -eyeRad * 0.8, eyeRad, 0); // top lid
          ctx.quadraticCurveTo(0, eyeRad * 0.8, -eyeRad, 0); // bottom lid
          ctx.closePath();
          ctx.fill();
          ctx.strokeStyle = primaryColor;
          ctx.lineWidth = 4;
          ctx.stroke();

          // Eyelid mask for the realistic eyeball
          ctx.save();
          ctx.beginPath();
          ctx.moveTo(-eyeRad * 0.85, 0);
          ctx.quadraticCurveTo(0, -eyeRad * 0.7, eyeRad * 0.85, 0);
          ctx.quadraticCurveTo(0, eyeRad * 0.7, -eyeRad * 0.85, 0);
          ctx.closePath();
          ctx.clip(); // Mask the eyeball so it stays within the lids

          // Sclera (Eyeball base)
          const scleraGrad = ctx.createRadialGradient(0, 0, eyeRad * 0.2, 0, 0, eyeRad);
          scleraGrad.addColorStop(0, isVulnerable ? `rgba(255, 230, 230, ${0.9 + eyePulse*0.1})` : `rgba(220, 255, 255, ${0.9 + eyePulse*0.1})`);
          scleraGrad.addColorStop(1, isVulnerable ? '#880022' : '#004466');
          ctx.fillStyle = scleraGrad;
          ctx.shadowBlur = isVulnerable ? 50 : 25;
          ctx.shadowColor = accentColor;
          ctx.fillRect(-eyeRad, -eyeRad, eyeRad * 2, eyeRad * 2);

          // Extraocular Muscles (Rectus & Oblique visible at the corners)
          // Medial & Lateral Rectus insertions
          ctx.fillStyle = 'rgba(200, 30, 50, 0.7)';
          ctx.beginPath();
          ctx.moveTo(-eyeRad * 0.85, 0);
          ctx.lineTo(-eyeRad * 0.6, -eyeRad * 0.15);
          ctx.lineTo(-eyeRad * 0.5, 0);
          ctx.lineTo(-eyeRad * 0.6, eyeRad * 0.15);
          ctx.fill();
          
          ctx.beginPath();
          ctx.moveTo(eyeRad * 0.85, 0);
          ctx.lineTo(eyeRad * 0.6, -eyeRad * 0.15);
          ctx.lineTo(eyeRad * 0.5, 0);
          ctx.lineTo(eyeRad * 0.6, eyeRad * 0.15);
          ctx.fill();
          
          // Tiny blood vessels growing from corners
          ctx.strokeStyle = 'rgba(200, 20, 20, 0.4)';
          ctx.lineWidth = 1;
          for(let i=0; i<5; i++) {
            ctx.beginPath();
            ctx.moveTo(-eyeRad * 0.6, (Math.random() - 0.5) * eyeRad * 0.2);
            ctx.quadraticCurveTo(-eyeRad * 0.3, (Math.random() - 0.5) * eyeRad * 0.4, 0, (Math.random() - 0.5) * eyeRad * 0.2);
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo(eyeRad * 0.6, (Math.random() - 0.5) * eyeRad * 0.2);
            ctx.quadraticCurveTo(eyeRad * 0.3, (Math.random() - 0.5) * eyeRad * 0.4, 0, (Math.random() - 0.5) * eyeRad * 0.2);
            ctx.stroke();
          }

          // Determine Look Direction (Iris & Pupil positioning)
          let lookX = 0;
          let lookY = 0;
          let pupilRotation = 0;
          let distanceToShip = 0;
          if (ship.alive) {
             const angleToShip = Math.atan2(ship.y - ufo.y, ship.x - ufo.x);
             distanceToShip = Math.hypot(ship.x - ufo.x, ship.y - ufo.y);
             // Limit look distance based on eye radius so iris doesn't leave eyeball
             const maxLook = eyeRad * 0.35;
             const distFactor = Math.min(distanceToShip / 600, 1);
             const lookDist = maxLook * distFactor;
             lookX = Math.cos(angleToShip) * lookDist;
             lookY = Math.sin(angleToShip) * lookDist;
             pupilRotation = angleToShip + Math.PI / 2; // Point slit towards player
          }

          // Draw the Iris
          ctx.save();
          ctx.translate(lookX, lookY);
          
          // Perspective squash of the iris when looking to the sides
          const lookDistMag = Math.hypot(lookX, lookY);
          const maxLookMag = eyeRad * 0.35;
          const squash = 1 - (lookDistMag / maxLookMag) * 0.3; // Squash up to 30%
          
          ctx.rotate(pupilRotation); // rotate towards look angle
          ctx.scale(1, squash); // squash in the axis of looking
          // un-rotate so the iris is drawn properly, or keep it rotated if pupil is a slit.
          // Since it's an alien pupil, let's keep it aligned with the look direction!
          
          const irisRad = eyeRad * 0.4;
          
          // Iris background
          const irisColor = isVulnerable ? '#ff5500' : '#00ffff';
          const irisGrad = ctx.createRadialGradient(0, 0, irisRad * 0.2, 0, 0, irisRad);
          irisGrad.addColorStop(0, '#000000'); // pupil edge
          irisGrad.addColorStop(0.2, irisColor);
          irisGrad.addColorStop(0.8, isVulnerable ? '#880000' : '#000088');
          irisGrad.addColorStop(1, '#000000');
          ctx.fillStyle = irisGrad;
          ctx.beginPath();
          ctx.arc(0, 0, irisRad, 0, Math.PI * 2);
          ctx.fill();
          
          // Iris striations (muscle fibers of the iris)
          ctx.strokeStyle = isVulnerable ? 'rgba(255, 200, 0, 0.5)' : 'rgba(200, 255, 255, 0.5)';
          ctx.lineWidth = 1;
          for(let i=0; i<30; i++) {
             const a = (i / 30) * Math.PI * 2;
             const inner = irisRad * 0.3;
             const outer = irisRad * 0.9 + Math.random() * (irisRad * 0.1);
             ctx.beginPath();
             ctx.moveTo(Math.cos(a)*inner, Math.sin(a)*inner);
             ctx.lineTo(Math.cos(a)*outer, Math.sin(a)*outer);
             ctx.stroke();
          }

          // The Slit Pupil (Dilates based on vulnerability and distance)
          ctx.fillStyle = '#000000';
          ctx.shadowBlur = 0;
          ctx.beginPath();
          const pupilWidth = isVulnerable ? eyeRad * 0.15 : eyeRad * 0.05;
          const pupilHeight = isVulnerable ? eyeRad * 0.35 : eyeRad * 0.3;
          ctx.ellipse(0, 0, pupilWidth, pupilHeight, 0, 0, Math.PI * 2);
          ctx.fill();
          
          // Corrupted Iris glitch effect
          if (isVulnerable) {
             ctx.strokeStyle = '#ffaa00';
             ctx.lineWidth = 2;
             ctx.beginPath();
             ctx.arc(0, 0, irisRad * 0.8, 0, Math.PI * 2);
             ctx.stroke();
             
             // Random glitch lines across eye
             if (Math.random() < 0.3) {
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(-irisRad * 0.9, (Math.random() - 0.5) * irisRad);
                ctx.lineTo(irisRad * 0.9, (Math.random() - 0.5) * irisRad);
                ctx.stroke();
             }
          }
          
          // Glossy Eye Reflection (Specular Highlight)
          ctx.restore(); // restore translation & scaling for iris to draw reflection fixed to light source
          
          ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
          ctx.beginPath();
          ctx.ellipse(-eyeRad * 0.2, -eyeRad * 0.25, eyeRad * 0.15, eyeRad * 0.08, -Math.PI/6, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(eyeRad * 0.3, eyeRad * 0.2, eyeRad * 0.04, 0, Math.PI * 2);
          ctx.fill();

          ctx.restore(); // Remove Eyelid clipping

          ctx.restore();

        } else if (ufo.type === 'dreadnought') {
          const rad = ufo.radius;
          const coreRot = now * 0.003;
          const isOverheated = ufo.bossState === 'cooldown';
          const phaseColor = isOverheated ? '#ffffff' : ufo.bossPhase === 2 ? '#ffaa00' : '#00ffff'; // TRON cyan and overheat amber

          // If overheated, emit heavy particles and glow!
          if (isOverheated) {
            ctx.shadowBlur = 50 + Math.random() * 20;
            ctx.shadowColor = '#ffffff';
            if (Math.random() < 0.2) {
              particlesRef.current.push({
                x: ufo.x + (Math.random() - 0.5) * rad,
                y: ufo.y + (Math.random() - 0.5) * rad,
                vx: (Math.random() - 0.5) * 10,
                vy: (Math.random() - 0.5) * 10,
                life: 30,
                maxLife: 30,
                size: 3 + Math.random() * 4,
                color: Math.random() < 0.5 ? '#ffffff' : '#ffff00',
                shape: 'spark'
              });
            }
          }

          // Directional Rotating Outer Geometric Shield Ring (Drops completely during Overheated phase)
          if (!isOverheated) {
            ctx.save();
            const shR = rad + 35; // Moved further out
            const sAngle = ufo.shieldAngle || 0;
            const gapHalf = Math.PI / 6.5; // Slightly narrower gap
            const arcStart = sAngle + gapHalf;
            const arcEnd = sAngle + Math.PI * 2 - gapHalf;

            // Faint inner energy field
            ctx.fillStyle = 'rgba(0, 255, 255, 0.08)';
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.arc(0, 0, shR, arcStart, arcEnd);
            ctx.fill();

            // Heavy Outer Hex Shield Arc
            ctx.strokeStyle = '#00ffff';
            ctx.shadowColor = '#00ffff';
            ctx.shadowBlur = 30;
            ctx.lineWidth = 10; // Thicker primary shield
            ctx.beginPath();
            ctx.arc(0, 0, shR, arcStart, arcEnd);
            ctx.stroke();

            // Inner Bright White Core Shield Arc
            ctx.strokeStyle = '#ffffff';
            ctx.shadowBlur = 15;
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.arc(0, 0, shR, arcStart, arcEnd);
            ctx.stroke();
            
            // Secondary orbiting rings
            ctx.strokeStyle = 'rgba(0, 255, 255, 0.5)';
            ctx.lineWidth = 2;
            ctx.setLineDash([15, 10]);
            ctx.beginPath();
            ctx.arc(0, 0, shR + 15, arcStart - 0.2, arcEnd + 0.2);
            ctx.stroke();
            ctx.setLineDash([]);

            // End-cap emitter nodes at the gap edges - BIGGER AND BRIGHTER CYAN
            for (const capSign of [1, -1]) {
              const capA = sAngle + capSign * gapHalf;
              const capX = Math.cos(capA) * shR;
              const capY = Math.sin(capA) * shR;
              ctx.fillStyle = '#00ffff';
              ctx.shadowColor = '#ffffff';
              ctx.shadowBlur = 35;
              ctx.beginPath();
              ctx.arc(capX, capY, 14, 0, Math.PI * 2);
              ctx.fill();
              ctx.fillStyle = '#ffffff';
              ctx.beginPath();
              ctx.arc(capX, capY, 6, 0, Math.PI * 2);
              ctx.fill();
            }

            // Directional vulnerability indicator pulsing in the opening gap (ARROW POINTING IN)
            const gapPulse = (Math.sin(now * 0.01) + 1) / 2; // 0 to 1
            const arrowDist = shR + 45 + gapPulse * 25;
            const arrowX = Math.cos(sAngle) * arrowDist;
            const arrowY = Math.sin(sAngle) * arrowDist;
            
            ctx.strokeStyle = `rgba(0, 255, 255, ${0.5 + gapPulse * 0.5})`;
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.moveTo(Math.cos(sAngle) * shR, Math.sin(sAngle) * shR);
            ctx.lineTo(arrowX, arrowY);
            ctx.stroke();
            ctx.setLineDash([]);

            ctx.fillStyle = `rgba(0, 255, 255, ${0.8 + gapPulse * 0.2})`;
            ctx.shadowColor = '#00ffff';
            ctx.shadowBlur = 30;
            ctx.font = 'bold 16px font-mono';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            // Draw inward pointing triangle arrow
            ctx.translate(arrowX, arrowY);
            ctx.rotate(sAngle + Math.PI); // Point inward
            ctx.beginPath();
            ctx.moveTo(15, 0);
            ctx.lineTo(-15, -12);
            ctx.lineTo(-15, 12);
            ctx.closePath();
            ctx.fill();
            
            ctx.rotate(-(sAngle + Math.PI));
            ctx.fillText('WEAK POINT', 0, -30);
            ctx.translate(-arrowX, -arrowY);

            ctx.restore();
          }

          // TRON Biomechanic Mainframe Core
          const hullGrad = ctx.createRadialGradient(0, 0, 10, 0, 0, rad);
          hullGrad.addColorStop(0, '#020108');
          hullGrad.addColorStop(0.6, '#080515');
          hullGrad.addColorStop(1, '#000000');

          ctx.fillStyle = hullGrad;
          ctx.strokeStyle = phaseColor;
          ctx.lineWidth = ufo.bossPhase === 2 ? 6 : 4;
          ctx.shadowBlur = isOverheated ? 45 : ufo.bossPhase === 2 ? 40 : 25;
          ctx.shadowColor = phaseColor;
          
          // Angular TRON disk hull
          ctx.beginPath();
          ctx.moveTo(0, -rad * 1.2);
          ctx.lineTo(rad * 0.6, -rad * 0.8);
          ctx.lineTo(rad * 1.2, 0);
          ctx.lineTo(rad * 0.6, rad * 0.8);
          ctx.lineTo(0, rad * 1.2);
          ctx.lineTo(-rad * 0.6, rad * 0.8);
          ctx.lineTo(-rad * 1.2, 0);
          ctx.lineTo(-rad * 0.6, -rad * 0.8);
          ctx.closePath();
          ctx.stroke();
          ctx.fill();

          // Internal biomechanic circuitry ribs
          ctx.save();
          ctx.strokeStyle = '#00ffff';
          ctx.lineWidth = 2;
          ctx.shadowBlur = 10;
          ctx.shadowColor = '#00ffff';
          
          for(let i=0; i<8; i++) {
             const angle = (i/8) * Math.PI * 2;
             ctx.beginPath();
             ctx.moveTo(Math.cos(angle) * rad * 0.3, Math.sin(angle) * rad * 0.3);
             ctx.lineTo(Math.cos(angle) * rad * 0.9, Math.sin(angle) * rad * 0.9);
             // Circuit branches
             const branchA = angle + Math.PI/8;
             const branchB = angle - Math.PI/8;
             ctx.lineTo(Math.cos(branchA) * rad * 1.0, Math.sin(branchA) * rad * 1.0);
             ctx.moveTo(Math.cos(angle) * rad * 0.9, Math.sin(angle) * rad * 0.9);
             ctx.lineTo(Math.cos(branchB) * rad * 1.0, Math.sin(branchB) * rad * 1.0);
             ctx.stroke();
          }
          ctx.restore();

          // Core Processing Node (Mouth/Central Reactor)
          if (isOverheated) {
            ctx.save();
            const heatPulse = 1.0 + Math.sin(now * 0.02) * 0.3;
            ctx.translate(0, rad * 0.3); // Lower central core
            
            ctx.fillStyle = '#ffffff';
            ctx.shadowBlur = 30 * heatPulse;
            ctx.shadowColor = '#ffffff';

            ctx.beginPath();
            // Exposed glowing hexagon core
            for(let i=0; i<6; i++) {
                const a = (i/6)*Math.PI*2 + coreRot;
                if (i===0) ctx.moveTo(Math.cos(a)*rad*0.5*heatPulse, Math.sin(a)*rad*0.5*heatPulse);
                else ctx.lineTo(Math.cos(a)*rad*0.5*heatPulse, Math.sin(a)*rad*0.5*heatPulse);
            }
            ctx.closePath();
            ctx.fill();

            ctx.strokeStyle = '#ffff00';
            ctx.lineWidth = 4;
            ctx.shadowColor = '#ffff00';
            ctx.shadowBlur = 25;
            ctx.beginPath();
            ctx.arc(0, 0, rad * 0.6 * heatPulse, 0, Math.PI * 2);
            ctx.stroke();

            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(0, 0, rad * 0.25, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          } else {
            ctx.save();
            ctx.translate(0, rad * 0.4);

            ctx.strokeStyle = "#05030f";
            ctx.lineWidth = 4;
            ctx.fillStyle = phaseColor;
            ctx.shadowBlur = 10;
            ctx.shadowColor = phaseColor;

            ctx.beginPath();
            for(let i=0; i<12; i++) {
                const a = (i/12)*Math.PI*2;
                const inner = rad * 0.35;
                const outer = rad * 0.45;
                ctx.moveTo(Math.cos(a)*inner, Math.sin(a)*inner);
                ctx.lineTo(Math.cos(a)*outer, Math.sin(a)*outer);
            }
            ctx.stroke();

            ctx.rotate(-coreRot * 2);

            ctx.fillStyle = phaseColor;
            ctx.shadowBlur = 25;
            ctx.shadowColor = "#ff0055";

            ctx.beginPath();
            for(let i=0; i<6; i++) {
                const a = (i/6)*Math.PI*2;
                if (i===0) ctx.moveTo(Math.cos(a)*rad*0.35, Math.sin(a)*rad*0.35);
                else ctx.lineTo(Math.cos(a)*rad*0.35, Math.sin(a)*rad*0.35);
            }
            ctx.closePath();
            ctx.fill();

            ctx.strokeStyle = "#ffffff";
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            for(let i=0; i<6; i++) {
                const a = (i/6)*Math.PI*2;
                if(i===0) ctx.moveTo(Math.cos(a)*rad*0.25, Math.sin(a)*rad*0.25);
                else ctx.lineTo(Math.cos(a)*rad*0.25, Math.sin(a)*rad*0.25);
            }
            ctx.closePath();
            ctx.stroke();

            ctx.fillStyle = "#ffffff";
            ctx.beginPath();
            ctx.arc(0, 0, rad * 0.1, 0, Math.PI * 2);
            ctx.fill();

            ctx.rotate(coreRot * 4);
            ctx.strokeStyle = "#00ffff";
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            for(let i=0; i<3; i++) {
                const a = (i/3)*Math.PI*2;
                if(i===0) ctx.moveTo(Math.cos(a)*rad*0.18, Math.sin(a)*rad*0.18);
                else ctx.lineTo(Math.cos(a)*rad*0.18, Math.sin(a)*rad*0.18);
            }
            ctx.closePath();
            ctx.stroke();

            ctx.restore();
          }
        } else if (isDreadnought) {
          // --- ROBOTIC VECTOR SENTINEL CHASSIS OVERHAUL (TRON MECH STYLE) ---
          const rad = ufo.radius; // 44
          const isFiring = !!ufo.isChargingBeam;
          const chargeRatio = Math.min(1, (ufo.chargeTimer || 0) / 180); // 0 to 1 during charging build-up
          const isCharging = (ufo.chargeTimer || 0) > 60 || isFiring;

          // 1. Dynamic Mechanical Recoil Vibration (Active during beam firing)
          if (isFiring) {
            const recoilX = (Math.random() - 0.5) * 2.8;
            const recoilY = -Math.abs(Math.sin(now * 0.4) * 3) + (Math.random() - 0.5) * 1.5;
            ctx.translate(recoilX, recoilY);
          }

          // 2. Top Stabilization Thruster Plumes & Vector Sparks (Fires upward out of top pylons to compensate for beam recoil)
          if (isFiring || (chargeRatio > 0.8 && Math.random() < 0.5)) {
            ctx.save();
            ctx.shadowBlur = 18;
            ctx.shadowColor = '#00f0ff';
            for (const side of [-1, 1]) {
              const pylonX = side * rad * 0.78;
              const pylonY = -rad * 0.75;

              // Upward cyan vector flame plume
              const flameH = 16 + Math.random() * 14;
              ctx.fillStyle = '#00f0ff';
              ctx.strokeStyle = '#ffffff';
              ctx.lineWidth = 1.5;

              ctx.beginPath();
              ctx.moveTo(pylonX - 4, pylonY);
              ctx.lineTo(pylonX, pylonY - flameH);
              ctx.lineTo(pylonX + 4, pylonY);
              ctx.closePath();
              ctx.fill();
              ctx.stroke();

              // Upward thrust spark particles
              for (let sp = 0; sp < 2; sp++) {
                const sparkY = pylonY - flameH - Math.random() * 15;
                const sparkX = pylonX + (Math.random() - 0.5) * 8;
                ctx.fillStyle = Math.random() < 0.6 ? '#ffffff' : '#00f0ff';
                ctx.fillRect(sparkX - 1, sparkY - 1, 2, 4);
              }
            }
            ctx.restore();
          }

          // 3. Layered Mechanical Robotic Frame & Armored Side Pylons
          // A. Outer Heavy Armor Shell / Side-Pylons
          ctx.fillStyle = '#0f172a'; // Dark steel TRON armor
          ctx.strokeStyle = '#e11d48';
          ctx.lineWidth = 2.2;

          ctx.beginPath();
          // Top central bridge
          ctx.moveTo(-rad * 0.5, -rad * 0.85);
          ctx.lineTo(rad * 0.5, -rad * 0.85);

          // Right heavy pylon
          ctx.lineTo(rad * 0.85, -rad * 0.75);
          ctx.lineTo(rad * 1.05, -rad * 0.35);
          ctx.lineTo(rad * 0.95, rad * 0.3);
          ctx.lineTo(rad * 0.6, rad * 0.65);

          // Emitter nozzle collar
          ctx.lineTo(rad * 0.3, rad * 0.8);
          ctx.lineTo(-rad * 0.3, rad * 0.8);

          // Left heavy pylon
          ctx.lineTo(-rad * 0.6, rad * 0.65);
          ctx.lineTo(-rad * 0.95, rad * 0.3);
          ctx.lineTo(-rad * 1.05, -rad * 0.35);
          ctx.lineTo(-rad * 0.85, -rad * 0.75);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // B. Inner Layered Armor Plates & Faceted Chamfers
          ctx.fillStyle = '#1e1b4b';
          ctx.strokeStyle = '#ff2a55';
          ctx.lineWidth = 1.5;

          for (const side of [-1, 1]) {
            ctx.beginPath();
            ctx.moveTo(side * rad * 0.35, -rad * 0.7);
            ctx.lineTo(side * rad * 0.75, -rad * 0.6);
            ctx.lineTo(side * rad * 0.85, -rad * 0.25);
            ctx.lineTo(side * rad * 0.65, rad * 0.35);
            ctx.lineTo(side * rad * 0.3, rad * 0.45);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
          }

          // C. Mechanical Conduit Lines, Corner Brackets & Exposed Wiring
          ctx.strokeStyle = chargeRatio > 0.5 ? '#00f0ff' : 'rgba(255, 0, 85, 0.75)';
          ctx.lineWidth = 1.2;

          // Side pylon energy conduits
          for (const side of [-1, 1]) {
            ctx.beginPath();
            ctx.moveTo(side * rad * 0.8, -rad * 0.5);
            ctx.lineTo(side * rad * 0.5, -rad * 0.2);
            ctx.lineTo(side * rad * 0.2, 0);
            ctx.stroke();

            // Hydraulic strut / bracket
            ctx.beginPath();
            ctx.moveTo(side * rad * 0.7, rad * 0.2);
            ctx.lineTo(side * rad * 0.35, rad * 0.5);
            ctx.stroke();

            // Corner rivets / node joints
            ctx.fillStyle = '#ffffff';
            for (const [nx, ny] of [
              [side * rad * 0.75, -rad * 0.6],
              [side * rad * 0.85, -rad * 0.25],
              [side * rad * 0.65, rad * 0.35]
            ]) {
              ctx.beginPath();
              ctx.arc(nx, ny, 1.8, 0, Math.PI * 2);
              ctx.fill();
            }
          }

          // Top armor bridge vent slots
          ctx.strokeStyle = '#ff6688';
          ctx.lineWidth = 1.2;
          for (let v = -2; v <= 2; v++) {
            ctx.beginPath();
            ctx.moveTo(v * 6, -rad * 0.8);
            ctx.lineTo(v * 6, -rad * 0.72);
            ctx.stroke();
          }

          // 4. Multi-Layered Central Focal Optical Lens & Emitter
          ctx.save();

          // Concentric Glowing Rings framing the optical lens (#FF0055 and #FF3300 with shadowBlur = 15)
          ctx.shadowBlur = 15;
          ctx.shadowColor = '#FF0055';

          // Outer Lens Ring
          ctx.strokeStyle = '#FF0055';
          ctx.lineWidth = 2.0;
          ctx.beginPath();
          ctx.arc(0, 0, rad * 0.42, 0, Math.PI * 2);
          ctx.stroke();

          // Middle Lens Ring
          ctx.shadowColor = '#FF3300';
          ctx.strokeStyle = '#FF3300';
          ctx.lineWidth = 1.8;
          ctx.beginPath();
          ctx.arc(0, 0, rad * 0.30, 0, Math.PI * 2);
          ctx.stroke();

          // Inner Contracting Focal Ring (Charging contraction animation)
          const contractionFactor = isCharging ? 1 - chargeRatio * 0.55 : 1.0;
          const innerRingRad = rad * 0.20 * contractionFactor;

          ctx.shadowBlur = isCharging ? 22 : 12;
          ctx.shadowColor = isFiring ? '#ffffff' : '#FF0055';
          ctx.strokeStyle = isCharging ? '#ffffff' : '#FF0055';
          ctx.lineWidth = isCharging ? 2.2 : 1.5;

          ctx.beginPath();
          ctx.arc(0, 0, innerRingRad, 0, Math.PI * 2);
          ctx.stroke();

          // 5. Rapidly Pulsing Emitter Core & Aperture Iris
          const pulseSpeed = isFiring ? 0.1 : isCharging ? 0.05 : 0.02;
          const pulseBrightness = 0.7 + Math.sin(now * pulseSpeed) * 0.3;
          const coreRad = Math.max(3, rad * 0.12 * contractionFactor);

          ctx.fillStyle = isFiring
            ? '#ffffff'
            : isCharging
            ? `rgba(255, 255, 255, ${pulseBrightness})`
            : '#ff0055';
          ctx.shadowBlur = isFiring ? 30 : isCharging ? 20 : 10;
          ctx.shadowColor = '#ff0055';

          ctx.beginPath();
          ctx.arc(0, 0, coreRad, 0, Math.PI * 2);
          ctx.fill();

          // Optical Crosshair / Beam Guide Sighting Reticle
          ctx.strokeStyle = isCharging ? '#ffffff' : 'rgba(255, 100, 150, 0.7)';
          ctx.lineWidth = 1.0;
          const reticleLen = rad * 0.38;

          ctx.beginPath();
          ctx.moveTo(0, -reticleLen);
          ctx.lineTo(0, reticleLen);
          ctx.moveTo(-reticleLen, 0);
          ctx.lineTo(reticleLen, 0);
          ctx.stroke();

          ctx.restore();
        } else if (isHunter) {
          // Hunter Interceptor: Forward-swept stealth wing ship with twin tail fins, angled cockpit visor line
          ctx.rotate(ufo.angle);

          // Stealth wing outline
          ctx.fillStyle = '#0f172a';
          ctx.strokeStyle = '#FF9900';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(ufo.radius, 0);
          ctx.lineTo(ufo.radius * 0.2, -ufo.radius * 0.35);
          ctx.lineTo(-ufo.radius * 0.25, -ufo.radius); // Forward swept wing tip
          ctx.lineTo(-ufo.radius * 0.5, -ufo.radius * 0.45);
          ctx.lineTo(-ufo.radius, -ufo.radius * 0.75); // Twin tail fin top
          ctx.lineTo(-ufo.radius * 0.65, -ufo.radius * 0.2);
          ctx.lineTo(-ufo.radius * 0.8, 0); // Tail engine core
          ctx.lineTo(-ufo.radius * 0.65, ufo.radius * 0.2);
          ctx.lineTo(-ufo.radius, ufo.radius * 0.75); // Twin tail fin bottom
          ctx.lineTo(-ufo.radius * 0.5, ufo.radius * 0.45);
          ctx.lineTo(-ufo.radius * 0.25, ufo.radius); // Forward swept wing tip
          ctx.lineTo(ufo.radius * 0.2, ufo.radius * 0.35);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Internal vector panel lines
          ctx.strokeStyle = '#ffb733';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(ufo.radius * 0.6, 0);
          ctx.lineTo(-ufo.radius * 0.4, -ufo.radius * 0.3);
          ctx.moveTo(ufo.radius * 0.6, 0);
          ctx.lineTo(-ufo.radius * 0.4, ufo.radius * 0.3);
          ctx.moveTo(-ufo.radius * 0.2, 0);
          ctx.lineTo(-ufo.radius * 0.65, -ufo.radius * 0.5);
          ctx.moveTo(-ufo.radius * 0.2, 0);
          ctx.lineTo(-ufo.radius * 0.65, ufo.radius * 0.5);
          ctx.stroke();

          // Angled Cockpit Visor Line
          ctx.fillStyle = '#261200';
          ctx.strokeStyle = '#FFCC00';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(ufo.radius * 0.55, -ufo.radius * 0.18);
          ctx.lineTo(ufo.radius * 0.15, -ufo.radius * 0.25);
          ctx.lineTo(ufo.radius * 0.15, ufo.radius * 0.25);
          ctx.lineTo(ufo.radius * 0.55, ufo.radius * 0.18);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Engine core highlight
          ctx.fillStyle = '#FF9900';
          ctx.shadowBlur = 10;
          ctx.shadowColor = '#FF9900';
          ctx.beginPath();
          ctx.arc(-ufo.radius * 0.65, 0, 3.5, 0, Math.PI * 2);
          ctx.fill();
        } else if (isSwarmer) {
          // Swarmer Drone: Compact insectoid craft with curved pincers, angled tail core, rapid rotation
          ctx.rotate(ufo.angle);

          // Insectoid chitin body
          ctx.fillStyle = '#05230c';
          ctx.strokeStyle = '#00FF66';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(ufo.radius * 0.5, 0);
          ctx.lineTo(ufo.radius * 0.2, -ufo.radius * 0.5);
          ctx.lineTo(-ufo.radius * 0.4, -ufo.radius * 0.6);
          ctx.lineTo(-ufo.radius, 0); // Angled tail tip
          ctx.lineTo(-ufo.radius * 0.4, ufo.radius * 0.6);
          ctx.lineTo(ufo.radius * 0.2, ufo.radius * 0.5);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Curved pincers
          ctx.strokeStyle = '#66ff99';
          ctx.lineWidth = 1.8;
          ctx.beginPath();
          // Upper curved pincer
          ctx.moveTo(ufo.radius * 0.2, -ufo.radius * 0.4);
          ctx.quadraticCurveTo(ufo.radius * 1.2, -ufo.radius * 0.8, ufo.radius * 1.1, -ufo.radius * 0.15);
          // Lower curved pincer
          ctx.moveTo(ufo.radius * 0.2, ufo.radius * 0.4);
          ctx.quadraticCurveTo(ufo.radius * 1.2, ufo.radius * 0.8, ufo.radius * 1.1, ufo.radius * 0.15);
          ctx.stroke();

          // Angled tail core crystal
          ctx.fillStyle = '#00FF66';
          ctx.shadowBlur = 12;
          ctx.shadowColor = '#00FF66';
          ctx.beginPath();
          ctx.moveTo(-ufo.radius * 0.3, 0);
          ctx.lineTo(-ufo.radius * 0.6, -ufo.radius * 0.25);
          ctx.lineTo(-ufo.radius * 0.85, 0);
          ctx.lineTo(-ufo.radius * 0.6, ufo.radius * 0.25);
          ctx.closePath();
          ctx.fill();
        } else {
          // --- TRON VECTOR RED HEXAGON ENEMY OVERHAUL ---
          const outerSprite = getRedHexagonOuterSprite();
          const innerSprite = getRedHexagonInnerSprite();

          const rotOuter = (now * 0.002) % (Math.PI * 2);
          const rotInner = (-now * 0.0035) % (Math.PI * 2);
          const spriteScale = (ufo.radius * 2) / 56;

          // 1. Sharp Vector-Line Exhaust Trail / Laser Motion Streak
          ctx.save();
          const moveAngle = Math.atan2(ufo.vy || 0, ufo.vx || ufo.speed || 1);
          const dirX = Math.cos(moveAngle + Math.PI);
          const dirY = Math.sin(moveAngle + Math.PI);
          const trailLen = 32 + Math.sin(now * 0.02) * 12;

          // Glowing central crimson laser thrust vector
          ctx.strokeStyle = '#ff0055';
          ctx.lineWidth = 2.2;
          ctx.shadowBlur = 14;
          ctx.shadowColor = '#ff0055';
          ctx.beginPath();
          ctx.moveTo(dirX * 12, dirY * 12);
          ctx.lineTo(dirX * (12 + trailLen), dirY * (12 + trailLen));
          ctx.stroke();

          // Parallel razor vector exhaust streams
          const perpX = -dirY;
          const perpY = dirX;
          for (const side of [-9, 9]) {
            ctx.strokeStyle = 'rgba(255, 50, 100, 0.75)';
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.moveTo(perpX * side + dirX * 14, perpY * side + dirY * 14);
            ctx.lineTo(perpX * (side * 0.35) + dirX * (14 + trailLen * 0.7), perpY * (side * 0.35) + dirY * (14 + trailLen * 0.7));
            ctx.stroke();
          }
          ctx.restore();

          // 2. Render Outer Rotating Interlocking Spiked Hexagon Frame (Offscreen Canvas Pre-Rendered Sprite)
          ctx.save();
          ctx.rotate(rotOuter);
          ctx.scale(spriteScale, spriteScale);
          ctx.drawImage(outerSprite, -64, -64);
          ctx.restore();

          // 3. Render Inner Counter-Rotating Wireframe Shell (Offscreen Canvas Pre-Rendered Sprite)
          ctx.save();
          ctx.rotate(rotInner);
          ctx.scale(spriteScale, spriteScale);
          ctx.drawImage(innerSprite, -64, -64);
          ctx.restore();

          // 4. Inner Core: Sharp Pulsing Geometric "Eye" (Faceted Diamond + Crosshair Reticle)
          ctx.save();
          const eyePulse = 1.0 + Math.sin(now * 0.012) * 0.22;
          const eyeRadius = ufo.radius * 0.28 * eyePulse;

          ctx.fillStyle = '#ff0055';
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1.5;
          ctx.shadowBlur = 16;
          ctx.shadowColor = '#ff0055';

          if (isMothership) {
             // Mothership Realistic Cat/Reptile Eyes (Like level 10)
             // The hexagon has vertices at 0, 60, 120, 180, 240, 300 degrees.
             // We will put 3 eyes on it: One central, two on the sides.
             const eyeSize = ufo.radius * 0.45;
             const eyes = [
               { x: 0, y: 0, size: eyeSize * 1.2 }, // Center big eye
               { x: -ufo.radius * 0.5, y: ufo.radius * 0.3, size: eyeSize * 0.6 }, // Bottom left
               { x: ufo.radius * 0.5, y: ufo.radius * 0.3, size: eyeSize * 0.6 } // Bottom right
             ];

             eyes.forEach(eyePos => {
                 const mEyeRad = eyePos.size;
                 ctx.save();
                 ctx.translate(eyePos.x, eyePos.y);

                 // Mask (Eyelids horizontal like lvl 10)
                 ctx.beginPath();
                 ctx.moveTo(-mEyeRad * 0.85, 0);
                 ctx.quadraticCurveTo(0, -mEyeRad * 0.7, mEyeRad * 0.85, 0);
                 ctx.quadraticCurveTo(0, mEyeRad * 0.7, -mEyeRad * 0.85, 0);
                 ctx.closePath();
                 ctx.clip(); // Mask the eyeball
                 
                 // Sclera
                 const scleraGrad = ctx.createRadialGradient(0, 0, mEyeRad * 0.2, 0, 0, mEyeRad);
                 scleraGrad.addColorStop(0, '#ffe0e0');
                 scleraGrad.addColorStop(1, '#880000');
                 ctx.fillStyle = scleraGrad;
                 ctx.shadowBlur = 20;
                 ctx.shadowColor = '#d946ef';
                 ctx.fillRect(-mEyeRad, -mEyeRad, mEyeRad*2, mEyeRad*2);

                 // Determine Look Direction (Iris & Pupil positioning)
                 let lookX = 0;
                 let lookY = 0;
                 let pupilRotation = 0;
                 if (ship.alive) {
                     // Get the absolute world position of this eye
                     const eyeWorldX = ufo.x + eyePos.x;
                     const eyeWorldY = ufo.y + eyePos.y;
                     const angleToShip = Math.atan2(ship.y - eyeWorldY, ship.x - eyeWorldX);
                     const distanceToShip = Math.hypot(ship.x - eyeWorldX, ship.y - eyeWorldY);
                     
                     const maxLook = mEyeRad * 0.35;
                     const distFactor = Math.min(distanceToShip / 600, 1);
                     const lookDist = maxLook * distFactor;
                     lookX = Math.cos(angleToShip) * lookDist;
                     lookY = Math.sin(angleToShip) * lookDist;
                     pupilRotation = angleToShip + Math.PI / 2; // Point slit towards player
                 }
                 
                 // Draw the Iris
                 ctx.save();
                 ctx.translate(lookX, lookY);
                 
                 // Perspective squash
                 const lookDistMag = Math.hypot(lookX, lookY);
                 const squash = 1 - (lookDistMag / (mEyeRad * 0.35)) * 0.3;
                 
                 ctx.rotate(pupilRotation);
                 ctx.scale(1, squash);
                 
                 const irisRad = mEyeRad * 0.45;
                 const irisGrad = ctx.createRadialGradient(0,0, irisRad * 0.1, 0,0, irisRad);
                 irisGrad.addColorStop(0, '#000000');
                 irisGrad.addColorStop(0.2, '#d946ef');
                 irisGrad.addColorStop(0.8, '#4c1d95');
                 irisGrad.addColorStop(1, '#000000');
                 ctx.fillStyle = irisGrad;
                 ctx.beginPath();
                 ctx.arc(0, 0, irisRad, 0, Math.PI*2);
                 ctx.fill();
                 
                 // Iris striations
                 ctx.strokeStyle = 'rgba(255, 150, 255, 0.4)';
                 ctx.lineWidth = 1;
                 for (let i = 0; i < 20; i++) {
                    const a = (i / 20) * Math.PI * 2;
                    ctx.beginPath();
                    ctx.moveTo(Math.cos(a) * irisRad * 0.3, Math.sin(a) * irisRad * 0.3);
                    ctx.lineTo(Math.cos(a) * irisRad * 0.9, Math.sin(a) * irisRad * 0.9);
                    ctx.stroke();
                 }

                 // Pupil (Vertical slit)
                 ctx.fillStyle = '#000000';
                 ctx.shadowBlur = 0;
                 ctx.beginPath();
                 ctx.ellipse(0, 0, mEyeRad * 0.08, mEyeRad * 0.3, 0, 0, Math.PI*2);
                 ctx.fill();
                 
                 ctx.restore();
                 
                 // Eye reflection (static)
                 ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
                 ctx.beginPath();
                 ctx.ellipse(-mEyeRad * 0.2, -mEyeRad * 0.25, mEyeRad * 0.1, mEyeRad * 0.05, -Math.PI/6, 0, Math.PI*2);
                 ctx.fill();
                 
                 ctx.restore(); // end mask
                 
                 // Outer eyelid rim
                 ctx.strokeStyle = '#d946ef';
                 ctx.lineWidth = 3;
                 ctx.shadowBlur = 10;
                 ctx.beginPath();
                 ctx.moveTo(-mEyeRad * 0.85, 0);
                 ctx.quadraticCurveTo(0, -mEyeRad * 0.7, mEyeRad * 0.85, 0);
                 ctx.quadraticCurveTo(0, mEyeRad * 0.7, -mEyeRad * 0.85, 0);
                 ctx.closePath();
                 ctx.stroke();
             });
          } else {
            // Faceted Diamond Eye
            ctx.beginPath();
            ctx.moveTo(0, -eyeRadius * 1.35);
            ctx.lineTo(eyeRadius * 1.1, 0);
            ctx.lineTo(0, eyeRadius * 1.35);
            ctx.lineTo(-eyeRadius * 1.1, 0);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            // Crosshair / Target Reticle Lines
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1.2;
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#ffffff';

            const crossLen = eyeRadius * 1.6;
            ctx.beginPath();
            ctx.moveTo(0, -crossLen);
            ctx.lineTo(0, crossLen);
            ctx.moveTo(-crossLen, 0);
            ctx.lineTo(crossLen, 0);
            ctx.stroke();

            // Bright Core Pupil Node
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(0, 0, 2.8 * eyePulse, 0, Math.PI * 2);
            ctx.fill();
          }

          ctx.restore();
        }

        // Health Bar
        if (ufo.health < ufo.maxHealth) {
          const barW = ufo.radius * 1.8;
          const hpRatio = Math.max(0, ufo.health / ufo.maxHealth);
          ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
          ctx.fillRect(-barW / 2, -ufo.radius - 14, barW, 6);
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
          ctx.lineWidth = 1;
          ctx.strokeRect(-barW / 2, -ufo.radius - 14, barW, 6);

          ctx.fillStyle = isDreadnought ? '#e11d48' : isMothership ? '#d946ef' : '#ef4444';
          ctx.fillRect(-barW / 2 + 1, -ufo.radius - 13, (barW - 2) * hpRatio, 4);
        }

        ctx.restore();
      }

      // 7. Defense Drone (TRON Vector Octahedron Wireframe Bit)
      dronesRef.current.forEach((dr) => {
        if (!ship.alive) return;
        ctx.save();
        const droneX = ship.x + dr.orbitRadius * Math.cos(dr.angle);
        const droneY = ship.y + dr.orbitRadius * Math.sin(dr.angle);

        // Laser tether line from ship center to satellite Bit
        ctx.strokeStyle = 'rgba(192, 132, 252, 0.35)';
        ctx.lineWidth = 1;
        ctx.setLineDash([2, 4]);
        ctx.beginPath();
        ctx.moveTo(ship.x, ship.y);
        ctx.lineTo(droneX, droneY);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.translate(droneX, droneY);
        const bitRot = Date.now() * 0.005 + dr.angle;
        ctx.rotate(bitRot);

        // TRON Vector Octahedron Wireframe Bit
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#c084fc';
        ctx.strokeStyle = '#c084fc';
        ctx.lineWidth = 1.5;

        // Outer Wireframe Diamond
        ctx.beginPath();
        ctx.moveTo(0, -9);
        ctx.lineTo(8, 0);
        ctx.lineTo(0, 9);
        ctx.lineTo(-8, 0);
        ctx.closePath();
        ctx.stroke();

        // Inner Facet Lines
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, -9);
        ctx.lineTo(0, 9);
        ctx.moveTo(-8, 0);
        ctx.lineTo(8, 0);
        ctx.stroke();

        // Core White Laser Point
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(-1.5, -1.5, 3, 3);

        ctx.restore();
      });

      // 8. Player Ship
      if (ship.alive) {
        const blink = ship.invincibleTimer > 0 && Math.floor(ship.invincibleTimer / 6) % 2 === 0;

        if (!blink) {
          ctx.save();
          ctx.translate(ship.x, ship.y);
          ctx.rotate(ship.angle);

          // Force Shield & Kinetic Repulsor Vector Polygon Fields
          if (pTimers.repulsor > 0) {
            ctx.save();
            const repRot = Date.now() * -0.004;
            const repR = 48 + Math.sin(Date.now() * 0.01) * 4;
            ctx.strokeStyle = '#39ff14';
            ctx.lineWidth = 2;
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#39ff14';
            ctx.beginPath();
            for (let i = 0; i < 6; i++) {
              const a = repRot + (i * Math.PI * 2) / 6;
              const px = Math.cos(a) * repR;
              const py = Math.sin(a) * repR;
              if (i === 0) ctx.moveTo(px, py);
              else ctx.lineTo(px, py);
            }
            ctx.closePath();
            ctx.stroke();
            ctx.restore();
          }

          const maxShieldTimer = Math.max(pTimers.shield, pTimers.golden);
          if (maxShieldTimer > 0) {
            const isWarning = maxShieldTimer <= 180; // Last 3 seconds warning
            const flashOn = !isWarning || Math.floor(maxShieldTimer / 10) % 2 === 0;

            if (flashOn) {
              const shieldCol = isWarning
                ? '#ef4444'
                : (pTimers.golden > 0 ? '#ffd700' : '#38bdf8');

              ctx.save();
              const rotShield = Date.now() * 0.003;
              const numSides = 12;
              const shR = 34;

              // Outer vector wireframe polygon shield
              ctx.strokeStyle = shieldCol;
              ctx.lineWidth = 2;
              ctx.shadowBlur = 10;
              ctx.shadowColor = shieldCol;

              ctx.beginPath();
              for (let s = 0; s < numSides; s++) {
                const a = rotShield + (s * Math.PI * 2) / numSides;
                const px = Math.cos(a) * shR;
                const py = Math.sin(a) * shR;
                if (s === 0) ctx.moveTo(px, py);
                else ctx.lineTo(px, py);
              }
              ctx.closePath();
              ctx.stroke();

              // Inner wireframe ring
              ctx.lineWidth = 1;
              ctx.strokeStyle = '#ffffff';
              ctx.beginPath();
              for (let s = 0; s < numSides; s++) {
                const a = -rotShield * 1.5 + (s * Math.PI * 2) / numSides;
                const px = Math.cos(a) * (shR - 6);
                const py = Math.sin(a) * (shR - 6);
                if (s === 0) ctx.moveTo(px, py);
                else ctx.lineTo(px, py);
              }
              ctx.closePath();
              ctx.stroke();

              // Corner node dots
              ctx.fillStyle = shieldCol;
              for (let s = 0; s < numSides; s++) {
                const a = rotShield + (s * Math.PI * 2) / numSides;
                ctx.fillRect(Math.cos(a) * shR - 1.5, Math.sin(a) * shR - 1.5, 3, 3);
              }
              ctx.restore();
            }
          }

          // --- UPGRADED ADVANCED GALACTIC STARFIGHTER ---
          const nowTime = Date.now();

          // A. Rear Dual Thruster Plasma Jet Plumes
          if (ship.thrusting) {
            const fLen = 18 + Math.random() * 12;
            ctx.save();
            ctx.shadowBlur = 24;
            ctx.shadowColor = pTimers.golden > 0 ? '#ffd700' : '#00ffff';

            // Upper Jet
            const fGrad1 = ctx.createLinearGradient(-16, -8, -16 - fLen, -8);
            fGrad1.addColorStop(0, '#ffffff');
            fGrad1.addColorStop(0.3, pTimers.golden > 0 ? '#ffd700' : '#00f0ff');
            fGrad1.addColorStop(0.7, '#3b82f6');
            fGrad1.addColorStop(1, 'rgba(59, 130, 246, 0)');
            ctx.fillStyle = fGrad1;
            ctx.beginPath();
            ctx.moveTo(-16, -11);
            ctx.lineTo(-16 - fLen, -8);
            ctx.lineTo(-16, -5);
            ctx.closePath();
            ctx.fill();

            // Lower Jet
            const fGrad2 = ctx.createLinearGradient(-16, 8, -16 - fLen, 8);
            fGrad2.addColorStop(0, '#ffffff');
            fGrad2.addColorStop(0.3, pTimers.golden > 0 ? '#ffd700' : '#00f0ff');
            fGrad2.addColorStop(0.7, '#3b82f6');
            fGrad2.addColorStop(1, 'rgba(59, 130, 246, 0)');
            ctx.fillStyle = fGrad2;
            ctx.beginPath();
            ctx.moveTo(-16, 5);
            ctx.lineTo(-16 - fLen, 8);
            ctx.lineTo(-16, 11);
            ctx.closePath();
            ctx.fill();

            // Hot Inner White Core
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(-16, -8, 2.5, 0, Math.PI * 2);
            ctx.arc(-16, 8, 2.5, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();
          }

          // Reverse Thruster Bursts
          if (ship.reverse) {
            ctx.save();
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#38bdf8';
            ctx.fillStyle = '#38bdf8';
            ctx.beginPath();
            ctx.arc(18, -8, 3.5, 0, Math.PI * 2);
            ctx.arc(18, 8, 3.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }

          // B. High-Tech Interceptor Frame (Aerodynamic forward-swept wings + Stealth Fuselage)
          ctx.save();
          ctx.shadowBlur = 18;
          ctx.shadowColor = pTimers.golden > 0 ? '#ffd700' : '#00e1ff';

          // Outer Wing & Delta Stabilizers (Metallic Finish)
          const wingGrad = ctx.createLinearGradient(28, 0, -20, 0);
          wingGrad.addColorStop(0, '#f8fafc');
          wingGrad.addColorStop(0.25, pTimers.golden > 0 ? '#f59e0b' : '#38bdf8');
          wingGrad.addColorStop(0.65, '#0f172a');
          wingGrad.addColorStop(1, '#020617');

          ctx.fillStyle = wingGrad;
          ctx.strokeStyle = pTimers.golden > 0 ? '#ffd700' : '#00f0ff';
          ctx.lineWidth = 1.6;

          ctx.beginPath();
          ctx.moveTo(28, 0);             // Extended sharp needle nose
          ctx.lineTo(14, -6);            // Nose-to-fuselage taper
          ctx.lineTo(10, -12);           // Upper wing intake port
          ctx.lineTo(-4, -25);           // Upper forward-swept wingtip
          ctx.lineTo(-8, -12);           // Upper trailing wing edge
          ctx.lineTo(-20, -15);          // Upper rear stabilizer fin
          ctx.lineTo(-16, -6);           // Upper engine housing
          ctx.lineTo(-18, 0);            // Rear tail center notch
          ctx.lineTo(-16, 6);            // Lower engine housing
          ctx.lineTo(-20, 15);           // Lower rear stabilizer fin
          ctx.lineTo(-8, 12);            // Lower trailing wing edge
          ctx.lineTo(-4, 25);            // Lower forward-swept wingtip
          ctx.lineTo(10, 12);            // Lower wing intake port
          ctx.lineTo(14, 6);             // Lower nose-to-fuselage taper
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Carbon-Fiber Body Panel Insets
          ctx.fillStyle = '#1e293b';
          ctx.strokeStyle = '#475569';
          ctx.lineWidth = 1;

          ctx.beginPath();
          ctx.moveTo(12, 0);
          ctx.lineTo(2, -10);
          ctx.lineTo(-10, -18);
          ctx.lineTo(-6, -6);
          ctx.lineTo(-12, 0);
          ctx.lineTo(-6, 6);
          ctx.lineTo(-10, 18);
          ctx.lineTo(2, 10);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Glowing Cyber Circuit Traces on Wings
          ctx.strokeStyle = pTimers.golden > 0 ? '#ffe066' : '#00ffff';
          ctx.lineWidth = 1.5;
          ctx.shadowBlur = 10;
          ctx.shadowColor = ctx.strokeStyle;
          ctx.beginPath();
          ctx.moveTo(18, -2);
          ctx.lineTo(2, -18);
          ctx.lineTo(-2, -23);
          ctx.moveTo(18, 2);
          ctx.lineTo(2, 18);
          ctx.lineTo(-2, 23);
          ctx.stroke();

          // Dual Heavy Wingtip Plasma Cannons
          ctx.fillStyle = '#334155';
          ctx.fillRect(-6, -26, 12, 3);
          ctx.fillRect(-6, 23, 12, 3);

          // Muzzle Glowing Tip Lights
          ctx.fillStyle = '#ff2a5f';
          ctx.shadowBlur = 12;
          ctx.shadowColor = '#ff2a5f';
          ctx.beginPath();
          ctx.arc(6, -24.5, 2, 0, Math.PI * 2);
          ctx.arc(6, 24.5, 2, 0, Math.PI * 2);
          ctx.fill();

          // Central Hyper-Core Reactor Crystal (Pulsing)
          const pulseScale = 1 + Math.sin(nowTime * 0.012) * 0.25;
          ctx.fillStyle = pTimers.golden > 0 ? '#ffea00' : '#00ffff';
          ctx.shadowBlur = 16 * pulseScale;
          ctx.shadowColor = ctx.fillStyle;
          ctx.beginPath();
          ctx.arc(-2, 0, 4 * pulseScale, 0, Math.PI * 2);
          ctx.fill();

          // Aerodynamic Canopy Glass Dome
          const canopyGrad = ctx.createLinearGradient(12, 0, -4, 0);
          canopyGrad.addColorStop(0, '#22d3ee');
          canopyGrad.addColorStop(0.5, '#0284c7');
          canopyGrad.addColorStop(1, '#075985');

          ctx.fillStyle = canopyGrad;
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 1;

          ctx.beginPath();
          ctx.moveTo(14, 0);
          ctx.lineTo(4, -5);
          ctx.lineTo(-4, -4);
          ctx.lineTo(-6, 0);
          ctx.lineTo(-4, 4);
          ctx.lineTo(4, 5);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Canopy Specular Flare
          ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
          ctx.beginPath();
          ctx.ellipse(6, -1.8, 5, 1.5, -0.2, 0, Math.PI * 2);
          ctx.fill();

          ctx.restore();

          ctx.restore();

          // Sleek Ship Hull / Shield Power Bar & TRON Status HUD Badges (unrotated under ship)
          ctx.save();
          const barW = 48;
          const barH = 5;
          const barX = ship.x - barW / 2;
          const barY = ship.y + 28;

          // Power bar background frame
          ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
          ctx.fillRect(barX, barY, barW, barH);
          ctx.strokeStyle = 'rgba(148, 163, 184, 0.6)';
          ctx.lineWidth = 1;
          ctx.strokeRect(barX, barY, barW, barH);

          // Fill level
          const powerRatio = Math.max(0, Math.min(1, ship.hullPower / ship.maxHullPower));
          let barColor = '#00ffcc';
          if (powerRatio <= 0.5) barColor = '#ef4444';
          else if (powerRatio < 0.9) barColor = '#f59e0b';

          ctx.fillStyle = barColor;
          ctx.shadowBlur = 8;
          ctx.shadowColor = barColor;
          ctx.fillRect(barX + 1, barY + 1, (barW - 2) * powerRatio, barH - 2);

          // Status Bar Alignment: Active status badges cleanly aligned beneath the ship hull bar!
          const activeBadges: { label: string; color: string }[] = [];

          if (ship.hitRegenDelay === 0 && ship.hullPower < ship.maxHullPower) {
            activeBadges.push({ label: '+REGEN', color: '#00ffcc' });
          }
          if (pTimers.shield > 0) {
            activeBadges.push({ label: 'SHIELD', color: '#38bdf8' });
          }
          if (pTimers.golden > 0) {
            activeBadges.push({ label: 'GOLD', color: '#ffd700' });
          }
          if (pTimers.triple > 0) {
            activeBadges.push({ label: 'TRIPLE', color: '#00ffcc' });
          }
          if (pTimers.laser > 0) {
            activeBadges.push({ label: 'LASER', color: '#ff4400' });
          }
          if (pTimers.repulsor > 0) {
            activeBadges.push({ label: 'REPL', color: '#39ff14' });
          }
          if (pTimers.magnet > 0) {
            activeBadges.push({ label: 'MAGN', color: '#00e5ff' });
          }
          if (pTimers.timewarp > 0) {
            activeBadges.push({ label: 'TIME', color: '#38bdf8' });
          }
          if (dronesRef.current.length > 0) {
            activeBadges.push({ label: `DRONE x${dronesRef.current.length}`, color: '#c084fc' });
          }

          if (activeBadges.length > 0) {
            ctx.font = 'bold 8px font-mono, monospace';
            const badgeSpacing = 4;
            let totalW = 0;
            const badgeWidths = activeBadges.map((b) => {
              const w = ctx.measureText(b.label).width + 8;
              totalW += w;
              return w;
            });
            totalW += (activeBadges.length - 1) * badgeSpacing;

            let startX = ship.x - totalW / 2;
            const badgeY = barY + 9;

            activeBadges.forEach((b, idx) => {
              const bw = badgeWidths[idx];
              // Wireframe box border
              ctx.fillStyle = 'rgba(6, 11, 25, 0.88)';
              ctx.fillRect(startX, badgeY, bw, 11);

              ctx.strokeStyle = b.color;
              ctx.lineWidth = 1;
              ctx.shadowBlur = 6;
              ctx.shadowColor = b.color;
              ctx.strokeRect(startX, badgeY, bw, 11);

              // Monospace text inside
              ctx.fillStyle = b.color;
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillText(b.label, startX + bw / 2, badgeY + 6);

              startX += bw + badgeSpacing;
            });
          }

          ctx.restore();
        }
      }

      // 9. Bullets (Upgraded High-Tech Plasma & Laser GFX)
      bulletsRef.current.forEach((b) => {
        ctx.save();
        ctx.translate(b.x, b.y);

        const bAngle = b.angle !== undefined ? b.angle : Math.atan2(b.vy, b.vx);
        ctx.rotate(bAngle);

        if (b.isLaser) {
          // Intense Beam Laser GFX
          ctx.shadowBlur = 22;
          ctx.shadowColor = '#ff0077';

          // Outer Laser Beam Aura
          ctx.fillStyle = 'rgba(255, 0, 119, 0.35)';
          ctx.beginPath();
          ctx.ellipse(0, 0, 24, 7, 0, 0, Math.PI * 2);
          ctx.fill();

          // Main Laser Beam Body
          ctx.fillStyle = '#ff0055';
          ctx.beginPath();
          ctx.ellipse(0, 0, 18, 4, 0, 0, Math.PI * 2);
          ctx.fill();

          // White-hot Laser Core
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.ellipse(0, 0, 14, 1.8, 0, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // High-Tech Plasma Energy Tracer
          const tracerLen = b.size * 3.2;
          const tracerWidth = b.size * 1.2;

          ctx.shadowBlur = 16;
          ctx.shadowColor = b.color || '#00ffff';

          // Outer Plasma Bloom
          const outerGrad = ctx.createLinearGradient(tracerLen, 0, -tracerLen, 0);
          outerGrad.addColorStop(0, '#ffffff');
          outerGrad.addColorStop(0.3, b.color || '#00ffff');
          outerGrad.addColorStop(1, 'rgba(0, 240, 255, 0)');

          ctx.fillStyle = outerGrad;
          ctx.beginPath();
          ctx.ellipse(0, 0, tracerLen, tracerWidth, 0, 0, Math.PI * 2);
          ctx.fill();

          // Inner Bright Core
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.ellipse(2, 0, tracerLen * 0.5, tracerWidth * 0.45, 0, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      });

      // Enemy UFO Bullets (Alien Energy Plasma Orbs)
      ufoBulletsRef.current.forEach((ub) => {
        ctx.save();
        ctx.translate(ub.x, ub.y);
        
        if (ub.isMine) {
          ctx.shadowBlur = 25;
          ctx.shadowColor = ub.color || '#ffaa00';
          
          // Pulsing warning radius
          const pulse = (Math.sin(Date.now() * 0.005) + 1) / 2;
          ctx.strokeStyle = `rgba(255, 170, 0, ${0.1 + pulse * 0.3})`;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(0, 0, 120, 0, Math.PI * 2);
          ctx.stroke();

          // Spiked geometric mine body
          ctx.rotate(Date.now() * 0.002);
          ctx.fillStyle = '#220000';
          ctx.strokeStyle = '#ffaa00';
          ctx.lineWidth = 2;
          ctx.beginPath();
          for (let i = 0; i < 8; i++) {
             const a = (i / 8) * Math.PI * 2;
             const r = i % 2 === 0 ? ub.size : ub.size * 0.4;
             ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
          }
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(0, 0, ub.size * 0.25, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.shadowBlur = 18;
          ctx.shadowColor = '#ff3344';

          // Pulsing alien energy orb
          ctx.fillStyle = 'rgba(255, 51, 68, 0.4)';
          ctx.beginPath();
          ctx.arc(0, 0, ub.size * 2, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#ff1133';
          ctx.beginPath();
          ctx.arc(0, 0, ub.size * 1.2, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(0, 0, ub.size * 0.5, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      });

      // 10. Explosion Particles (Sharp Vector Sparks & TRON Diamond Light-Dots)
      if (particlesRef.current.length > 150) {
        particlesRef.current.splice(0, particlesRef.current.length - 150);
      }

      ctx.save();
      particlesRef.current.forEach((p) => {
        const alpha = Math.max(0, p.life / p.maxLife);
        if (alpha <= 0) return;
        ctx.globalAlpha = alpha;

        const vx = p.vx || 0;
        const vy = p.vy || 0;
        const speedSq = vx * vx + vy * vy;

        if (speedSq > 0.8 || p.shape === 'spark') {
          // Sharp vector line spark along velocity vector
          const sparkLen = Math.min(14, Math.max(3, Math.sqrt(speedSq) * 1.8));
          ctx.strokeStyle = p.color;
          ctx.lineWidth = Math.max(1, p.size * 0.85);
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x - (vx / Math.sqrt(speedSq || 1)) * sparkLen, p.y - (vy / Math.sqrt(speedSq || 1)) * sparkLen);
          ctx.stroke();
        } else {
          // Sharp 4-pointed TRON diamond light-dot
          const sz = Math.max(1.2, p.size);
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y - sz);
          ctx.lineTo(p.x + sz, p.y);
          ctx.lineTo(p.x, p.y + sz);
          ctx.lineTo(p.x - sz, p.y);
          ctx.closePath();
          ctx.fill();
        }
      });
      ctx.restore();
      ctx.globalAlpha = 1;

      // 11. Floating Score Texts
      floatingTextsRef.current.forEach((ft) => {
        ctx.save();
        ctx.globalAlpha = ft.life / ft.maxLife;
        ctx.fillStyle = ft.color;
        ctx.font = `bold ${ft.fontSize}px font-mono, sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText(ft.text, ft.x, ft.y);
        ctx.restore();
      });

      // 12. Big Screen Announcement Banners (High Performance Vector Text Rendering)
      for (let i = bigBannersRef.current.length - 1; i >= 0; i--) {
        const b = bigBannersRef.current[i];
        b.life--;

        if (b.life <= 0) {
          bigBannersRef.current.splice(i, 1);
          continue;
        }

        const progress = 1 - b.life / b.maxLife;
        let alpha = 1;
        if (progress < 0.12) {
          alpha = progress / 0.12;
        } else if (progress > 0.8) {
          alpha = (1 - progress) / 0.2;
        }

        const bannerH = 100;
        const centerY = height / 2;

        // Banner fade out logic if player ship is under/near it
        let shipDistAlpha = 1;
        const ship = shipRef.current;
        if (ship && ship.alive) {
            const distY = Math.abs(ship.y - centerY);
            if (distY < bannerH / 2 + 60) {
                shipDistAlpha = Math.max(0.15, (distY - (bannerH / 2)) / 60);
            }
        }

        const scale = 1.12 - Math.sin(progress * Math.PI) * 0.12;

        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(1, alpha * shipDistAlpha));

        ctx.fillStyle = 'rgba(5, 8, 18, 0.88)';
        ctx.fillRect(0, centerY - bannerH / 2, width, bannerH);

        ctx.fillStyle = b.color;
        ctx.fillRect(0, centerY - bannerH / 2 - 2, width, 4);
        ctx.fillRect(0, centerY + bannerH / 2 - 2, width, 4);

        ctx.translate(width / 2, centerY);
        ctx.scale(scale, scale);

        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Performant vector stroke outline + fill instead of heavy canvas shadowBlur!
        ctx.strokeStyle = b.glowColor;
        ctx.lineWidth = 6;
        ctx.font = `900 ${Math.min(46, width * 0.055)}px font-mono, sans-serif`;
        ctx.strokeText(b.title, 0, b.subtitle ? -14 : 0);

        ctx.fillStyle = b.color;
        ctx.fillText(b.title, 0, b.subtitle ? -14 : 0);

        if (b.subtitle) {
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
          ctx.lineWidth = 3;
          ctx.font = `bold ${Math.min(16, width * 0.028)}px font-mono, sans-serif`;
          ctx.strokeText(b.subtitle, 0, 22);

          ctx.fillStyle = '#ffffff';
          ctx.fillText(b.subtitle, 0, 22);
        }

        ctx.restore();
      }

      // 12.5. Arcade Combo HUD Meter
      if (state.comboCount >= 2 && state.comboTimer > 0) {
        ctx.save();
        const hasBoss = ufosRef.current.some((u) => u.isBoss);
        const comboX = width / 2;
        const comboY = hasBoss ? 105 : 62;

        let multiplier = 1;
        let comboColor = '#00f0ff';
        let comboLabel = 'COMBO';

        if (state.comboCount >= 20) {
          multiplier = 5;
          comboColor = '#ff2200';
          comboLabel = '👑 ULTRA COMBO MAX';
        } else if (state.comboCount >= 15) {
          multiplier = 4;
          comboColor = '#ff00ff';
          comboLabel = '💥 MEGA COMBO';
        } else if (state.comboCount >= 10) {
          multiplier = 3;
          comboColor = '#ffd700';
          comboLabel = '⚡ SUPER COMBO';
        } else if (state.comboCount >= 5) {
          multiplier = 2;
          comboColor = '#00ffcc';
          comboLabel = '🔥 COMBO';
        }

        const pulse = 1 + Math.sin(Date.now() * 0.012) * 0.04;
        ctx.translate(comboX, comboY);
        ctx.scale(pulse, pulse);

        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = '900 20px font-mono, sans-serif';

        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 5;
        ctx.strokeText(`${state.comboCount} HITS • ${comboLabel} x${multiplier}!`, 0, -14);

        ctx.fillStyle = comboColor;
        ctx.fillText(`${state.comboCount} HITS • ${comboLabel} x${multiplier}!`, 0, -14);

        const barW = 160;
        const barH = 6;
        const barX = -barW / 2;
        const barY = 4;

        ctx.fillStyle = 'rgba(5, 8, 20, 0.85)';
        ctx.fillRect(barX, barY, barW, barH);

        const timerRatio = Math.max(0, state.comboTimer / 160);
        ctx.fillStyle = comboColor;
        ctx.fillRect(barX, barY, barW * timerRatio, barH);

        ctx.strokeStyle = comboColor;
        ctx.lineWidth = 1.2;
        ctx.strokeRect(barX, barY, barW, barH);

        ctx.restore();
      }

      // 13. Dedicated Boss Health Bar UI
      const triadCores = ufosRef.current.filter(u => u.type === 'triad_core');
      const activeBoss = triadCores.length > 0 ? triadCores[0] : ufosRef.current.find((u) => u.isBoss);
      if (activeBoss) {
        ctx.save();
        const barW = Math.min(480, width * 0.65);
        const barH = 14;
        const barX = (width - barW) / 2;
        const barY = 32;

        let bossBarAlpha = 1;
        const ship = shipRef.current;
        if (ship && ship.alive) {
           const distY = Math.abs(ship.y - barY);
           if (distY < 80) {
              bossBarAlpha = Math.max(0.15, distY / 80);
           }
        }
        ctx.globalAlpha = bossBarAlpha;

        const isTriad = triadCores.length > 0;
        let totalHealth = activeBoss.health;
        let totalMaxHealth = activeBoss.maxHealth;
        let bossTitle = '';
        let titleColor = '#ff0055';
        let barColor = 'rgba(225, 29, 72, 0.8)';
        let isOverheated = false;

        if (isTriad) {
           totalHealth = triadCores.reduce((sum, c) => sum + c.health, 0);
           totalMaxHealth = triadCores.reduce((sum, c) => sum + (c.maxHealth || 1), 0);
           const phaseText = triadCores.length === 1 ? 'FINAL CORE BERSERK' : `${triadCores.length} CORES ACTIVE`;
           bossTitle = `⚠️ TRIAD PROTOCOL (${phaseText}) ⚠️`;
           titleColor = triadCores.length === 1 ? '#ff0055' : '#00ffff';
           barColor = triadCores.length === 1 ? 'rgba(255, 0, 85, 0.9)' : 'rgba(0, 255, 255, 0.8)';
        } else {
           isOverheated = activeBoss.bossState === 'cooldown';
           const phaseLabel = activeBoss.bossPhase === 2 ? 'PHASE 2 - OVERDRIVE' : 'PHASE 1 - TACTICAL';
           const name = activeBoss.type === 'core_severance' ? 'CORE SEVERANCE MAINFRAME' : 'DREADNOUGHT MOTHERSHIP';
           bossTitle = `⚠️ ${name} (${phaseLabel}) ⚠️`;
           if (isOverheated) {
              titleColor = '#ffffff';
              barColor = '#ffffff';
           } else if (activeBoss.bossPhase === 2) {
              titleColor = activeBoss.type === 'core_severance' ? '#ff0055' : '#ff0055';
              barColor = 'rgba(255, 0, 85, 0.95)';
           } else {
              titleColor = activeBoss.type === 'core_severance' ? '#A371F7' : '#ff0055';
              barColor = activeBoss.type === 'core_severance' ? 'rgba(163, 113, 247, 0.9)' : 'rgba(225, 29, 72, 0.8)';
           }
        }

        // Container Panel Frame
        ctx.fillStyle = 'rgba(6, 9, 20, 0.94)';
        ctx.beginPath();
        ctx.roundRect(barX - 16, barY - 22, barW + 32, barH + 48, 10);
        ctx.fill();

        ctx.strokeStyle = barColor;
        ctx.lineWidth = 1.8;
        ctx.shadowBlur = isOverheated ? 20 : 15;
        ctx.shadowColor = titleColor;
        ctx.stroke();

        // Boss Title
        ctx.font = 'bold 12px font-mono, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = titleColor;
        ctx.shadowBlur = 12;
        ctx.shadowColor = titleColor;
        ctx.fillText(bossTitle, width / 2, barY - 10);

        // Bar Background
        ctx.fillStyle = 'rgba(20, 5, 12, 0.95)';
        ctx.fillRect(barX, barY, barW, barH);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 1;
        ctx.strokeRect(barX, barY, barW, barH);

        // Fill Level Gradient
        const hpRatio = Math.max(0, totalHealth / totalMaxHealth);
        const barGrad = ctx.createLinearGradient(barX, 0, barX + barW, 0);
        if (isOverheated) {
          barGrad.addColorStop(0, '#ffffff');
          barGrad.addColorStop(0.5, '#ffff00');
          barGrad.addColorStop(1, '#ff6600');
        } else {
          barGrad.addColorStop(0, '#ff0055');
          barGrad.addColorStop(0.5, '#e11d48');
          barGrad.addColorStop(1, '#ff6600');
        }

        ctx.fillStyle = barGrad;
        ctx.shadowBlur = 18;
        ctx.shadowColor = isOverheated ? '#ffff00' : '#ff0055';
        ctx.fillRect(barX + 1, barY + 1, (barW - 2) * hpRatio, barH - 2);

        // Health Numeric Display
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 10px font-mono, sans-serif';
        ctx.fillText(`${Math.ceil(hpRatio * 100)}% • ${Math.ceil(activeBoss.health)} / ${activeBoss.maxHealth} HP`, width / 2, barY + 7);

        // STATUS BADGE BELOW HEALTH BAR
        let statusText = '🛡️ STATUS: SHIELDED';
        let statusColor = '#00ffff';
        
        if (activeBoss.bossState === 'cooldown') {
           statusText = '🔥 SYSTEM: OVERHEATED - VULNERABLE 🔥';
           statusColor = '#ffff00';
        } else if (activeBoss.bossState === 'laserCharge') {
           statusText = '⚠️ SYSTEM: CHARGING ⚠️';
           statusColor = '#00ffff';
        } else if (activeBoss.bossState === 'laserFire') {
           statusText = '💥 SYSTEM: FIRING LASER 💥';
           statusColor = '#ff0055';
        }

        ctx.font = 'bold 11px font-mono, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = statusColor;
        ctx.shadowBlur = isOverheated ? 15 : 8;
        ctx.shadowColor = statusColor;
        ctx.fillText(statusText, width / 2, barY + 24);

        ctx.restore();
      }

      // 14. IONIZING NEBULA SYSTEM FAILURE HUD GLITCH OVERLAY
      if (isShipInNebulaRef.current) {
        ctx.save();
        // Screen border static scanlines & magenta EMP vignette
        ctx.strokeStyle = `rgba(255, 0, 255, ${0.35 + Math.random() * 0.3})`;
        ctx.lineWidth = 5;
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#ff00ff';
        ctx.strokeRect(6, 6, width - 12, height - 12);

        // System Failure Banner
        const jitterX = (Math.random() - 0.5) * 6;
        const jitterY = (Math.random() - 0.5) * 6;
        const bannerY = 82 + jitterY;

        let glitchAlpha = 1;
        const ship = shipRef.current;
        if (ship && ship.alive) {
           const distY = Math.abs(ship.y - bannerY);
           if (distY < 60) {
              glitchAlpha = Math.max(0.15, distY / 60);
           }
        }

        ctx.save();
        ctx.globalAlpha = glitchAlpha;
        ctx.fillStyle = 'rgba(25, 5, 25, 0.88)';
        ctx.fillRect((width - 480) / 2 + jitterX, bannerY - 14, 480, 28);
        ctx.strokeStyle = '#ff00ff';
        ctx.lineWidth = 1.2;
        ctx.strokeRect((width - 480) / 2 + jitterX, bannerY - 14, 480, 28);

        ctx.font = 'bold 12px font-mono, monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#ff00ff';
        ctx.shadowBlur = 12;
        ctx.shadowColor = '#ff00ff';

        const glitchChars = '⚡%#&!?░▒▓█';
        const randNoise = Array.from({ length: 4 }, () => glitchChars[Math.floor(Math.random() * glitchChars.length)]).join('');
        ctx.fillText(`⚡ SYSTEM FAILURE • IONIZING EMP FIELD ⚡ [${randNoise}]`, width / 2 + jitterX, bannerY);
        ctx.restore();

        // Digital noise horizontal artifacts across screen
        for (let n = 0; n < 4; n++) {
          const ny = Math.random() * height;
          const nx = Math.random() * (width - 120);
          const nw = 30 + Math.random() * 90;
          ctx.fillStyle = Math.random() > 0.5 ? '#ff00ff' : '#ffffff';
          ctx.fillRect(nx, ny, nw, 1.8);
        }

        ctx.restore();
      }

      ctx.restore(); // Restore shake translation

      // CRT Scanlines Shader effect
      if (crtFilter) {
        ctx.save();
        ctx.fillStyle = 'rgba(18, 16, 16, 0.08)';
        for (let y = 0; y < height; y += 4) {
          ctx.fillRect(0, y, width, 2);
        }
        ctx.restore();
      }

      // Keyboard Controls Guide Overlay on game start
      if (controlsHintTimerRef.current > 0) {
        controlsHintTimerRef.current--;
        const timer = controlsHintTimerRef.current;
        const alpha = timer > 60 ? 1 : timer / 60;

        ctx.save();
        ctx.globalAlpha = Math.max(0, alpha);

        const boxW = Math.min(540, width - 30);
        const boxH = 114;
        const boxX = (width - boxW) / 2;
        const boxY = height - 150;

        // Dark backdrop frame
        ctx.fillStyle = 'rgba(13, 17, 23, 0.94)';
        ctx.beginPath();
        ctx.roundRect(boxX, boxY, boxW, boxH, 12);
        ctx.fill();

        ctx.strokeStyle = 'rgba(88, 166, 255, 0.7)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Title
        ctx.font = 'bold 12px font-mono, monospace';
        ctx.fillStyle = '#58A6FF';
        ctx.textAlign = 'center';
        ctx.fillText('⌨️ KEYBOARD CONTROLS & BONUS MILESTONES', width / 2, boxY + 22);

        // Keys Grid
        ctx.font = '11px font-mono, monospace';
        ctx.fillStyle = '#E6EDF3';
        const row1 = 'MOVE: [W]/[▲] Forward  •  [A][D]/[◄][►] Turn  •  [S]/[▼] Reverse';
        const row2 = 'ACTIONS: [SPACE] Fire • [B] EMP • [SHIFT] Warp • [M] Audio Toggle';
        const row3 = '🚀 1UP BONUS: Earn +1 Extra Ship every 50,000 Score Points! (50K, 100K, 150K...)';

        ctx.fillText(row1, width / 2, boxY + 46);
        ctx.fillStyle = '#3FB950';
        ctx.fillText(row2, width / 2, boxY + 68);
        ctx.fillStyle = '#FFD700';
        ctx.fillText(row3, width / 2, boxY + 90);

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(updateAndRender);
    };

    animationFrameId = requestAnimationFrame(updateAndRender);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [
    isPaused,
    controlScheme,
    gameMode,
    crtFilter,
    screenShakeEnabled,
    onScoreUpdate,
    onWaveUpdate,
    onLivesUpdate,
    onEmpCountUpdate,
    onHyperspaceCooldownUpdate,
    onActivePowerupsUpdate,
    onGameOver,
    onStatsRecord,
    onUnlockAchievement
  ]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full block bg-[#0A0C10] cursor-crosshair touch-none select-none"
    />
  );
};
