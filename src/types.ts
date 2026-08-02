export type GameMode = 'classic' | 'survival' | 'zen' | 'boss_rush' | 'wave_10_boss' | 'wave_15_boss';
export type ControlScheme = 'classic' | 'mouse' | 'dual_stick';

export type AsteroidType = 'normal' | 'ore' | 'molten' | 'volatile' | 'triple' | 'shield' | 'explosive' | 'crystal' | 'golden' | 'magma' | 'cryo' | 'magnetic' | 'hive' | 'phantom' | 'planetoid' | 'moon';
export type PowerUpType = 'triple' | 'shield' | 'golden' | 'emp' | 'laser' | 'drone' | 'magnet' | 'nuke' | 'timewarp' | 'repulsor';

export interface Asteroid {
  id: string;
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  angle: number;
  rotation: number;
  type: AsteroidType;
  vertices: { x: number; y: number }[];
  innerShells?: { scale: number; verts: { x: number; y: number }[] }[];
  polyFacets?: { x1: number; y1: number; x2: number; y2: number }[];
  circuitTraces?: { path: { x: number; y: number }[]; color?: string }[];
  circuitNodes?: { x: number; y: number; size: number }[];
  craters: { x: number; y: number; size: number }[];
  veins?: { x1: number; y1: number; x2: number; y2: number; color?: string }[];
  hatches?: { x1: number; y1: number; x2: number; y2: number }[];
  glow: number;
  health?: number;
  hitTimer?: number;
  phaseTimer?: number;
  isPhasedOut?: boolean;
  parentPlanetoidId?: string;
  orbitRadius?: number;
  orbitAngle?: number;
  orbitSpeed?: number;
  beingConsumed?: boolean;
  consumeScale?: number;
  consumeRotation?: number;
  consumeTargetX?: number;
  consumeTargetY?: number;
  cachedCanvas?: HTMLCanvasElement;
  cachedCanvasHit?: HTMLCanvasElement;
}

export interface Bullet {
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number;
  speed: number;
  life: number;
  maxLife: number;
  size: number;
  isLaser?: boolean;
  isMine?: boolean;
  color?: string;
  isPlayer: boolean;
}

export interface UFO {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  speed: number;
  shootTimer: number;
  type: 'scout' | 'mothership' | 'hunter' | 'swarmer' | 'dreadnought' | 'supply' | 'mine' | 'core_severance' | 'shield_node' | 'triad_core';
  health: number;
  maxHealth: number;
  angle: number;
  chargeTimer?: number;
  isChargingBeam?: boolean;
  behaviorTimer?: number;
  pulseTimer?: number;
  baseY?: number;
  sineOffset?: number;
  burstTimer?: number;
  isBursting?: boolean;
  orbitAngle?: number;
  orbitRadius?: number;
  swarmCenterX?: number;
  swarmCenterY?: number;
  beingConsumed?: boolean;
  consumeScale?: number;
  consumeRotation?: number;
  consumeTargetX?: number;
  consumeTargetY?: number;
  isBoss?: boolean;
  bossPhase?: 1 | 2;
  bossState?: 'burst' | 'laserCharge' | 'laserFire' | 'cooldown' | 'mines';
  bossStateTimer?: number;
  laserTargetAngle?: number;
  laserTargetX?: number;
  laserTargetY?: number;
  laserChargeProgress?: number;
  laserFiringTimer?: number;
  shieldAngle?: number;
  gridSweepTelegraph?: number;
  gridSweepFiring?: number;
  gridSweepAngle?: number;
  overheatTimer?: number;
  isMinion?: boolean;
  minionSpawnTimer?: number;
  nextMinionInterval?: number;
  hasDroppedOverheatPowerup?: boolean;
}

export interface Collectible {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  size: number;
  type: PowerUpType;
  pulse: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  shape?: 'circle' | 'square' | 'spark';
}

export interface FloatingText {
  id: string;
  x: number;
  y: number;
  text: string;
  color: string;
  life: number;
  maxLife: number;
  fontSize: number;
}

export interface Shockwave {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  life: number;
  color: string;
}

export interface BigBanner {
  id: string;
  title: string;
  subtitle?: string;
  color: string;
  glowColor: string;
  life: number;
  maxLife: number;
}

export interface Drone {
  angle: number;
  orbitRadius: number;
  shootCooldown: number;
}

export interface HighScoreRecord {
  id: string;
  score: number;
  wave: number;
  date: string;
  mode: GameMode;
  pilotName?: string;
  isGlobal?: boolean;
}

export interface BlackHole {
  id: string;
  x: number;
  y: number;
  vx?: number;
  vy?: number;
  radius: number;
  pullRadius: number;
  rotation: number;
  swirlSpeed: number;
  health: number;
  maxHealth: number;
  pulse: number;
}

export interface IonizingNebula {
  id: string;
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  rotation: number;
  rotSpeed: number;
  outerVertices: { x: number; y: number }[];
  innerNodes: { x: number; y: number }[];
  meshConnections: [number, number][];
  internalArcs: { path: { x: number; y: number }[]; life: number; color: string }[];
  flicker: number;
  health: number;
  maxHealth: number;
  damageFlash: number;
}

export interface PlasmaCoreNode {
  id: string;
  x: number;
  y: number;
  radius: number;
  health: number;
  maxHealth: number;
  damageFlash: number;
  color: string;
  label: string;
  isSlingshotting: boolean;
  vx: number;
  vy: number;
}

export interface BinaryPlasmaCore {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  orbitRadius: number;
  orbitAngle: number;
  orbitSpeed: number;
  core1: PlasmaCoreNode | null;
  core2: PlasmaCoreNode | null;
}

export interface LifetimeStats {
  gamesPlayed: number;
  asteroidsDestroyed: number;
  ufosDestroyed: number;
  shotsFired: number;
  shotsHit: number;
  highestScore: number;
  highestWave: number;
  bombsUsed: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
}
