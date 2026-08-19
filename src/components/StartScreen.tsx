import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Trophy, 
  Settings, 
  Award, 
  Volume2, 
  VolumeX, 
  Radio, 
  HelpCircle, 
  BookOpen, 
  X, 
  Shield, 
  Zap, 
  Crosshair, 
  Flame, 
  Sparkles,
  Info,
  Target
} from 'lucide-react';
import { GameMode, Difficulty, ControlScheme } from '../types';
import { soundEngine } from '../audio/soundEngine';
import { CodexModal } from './CodexModal';
import { Maximize, Minimize } from 'lucide-react';
import { 
  LargeAsteroidSVG, 
  NormalAsteroidSVG, 
  SpecialAsteroidSVG, 
  GameEnemyShipSVG, 
  PlayerShipVariantSVG,
  GameBossDreadnoughtSVG
} from './StartScreenSpaceArt';

const MODE_SUMMARIES: Record<GameMode, string> = {
  classic: 'STANDARD ARCADE',
  survival: 'ONE-LIFE ENDURANCE',
  zen: 'INVINCIBLE PRACTICE',
  boss_rush: 'WAVE 5 DREADNOUGHT',
  wave_10_boss: 'WAVE 10 CORE SEVERANCE',
  wave_15_boss: 'WAVE 15 GRID ARCHITECT',
};

interface StartScreenProps {
  highScore: number;
  gameMode: GameMode;
  difficulty: Difficulty;
  onChangeDifficulty: (difficulty: Difficulty) => void;
  onChangeGameMode: (mode: GameMode) => void;
  controlScheme: ControlScheme;
  onChangeControlScheme: (scheme: ControlScheme) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onStartGame: (mode: GameMode) => void;
  onOpenLeaderboard: () => void;
  onOpenAchievements: () => void;
  onOpenChallenges: () => void;
  onOpenSettings: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({
  onStartGame,
  gameMode,
  onChangeGameMode,
  highScore,
  onOpenLeaderboard,
  onOpenAchievements,
  onOpenChallenges,
  onOpenSettings,
  isMuted,
  onToggleMute,
  isFullscreen,
  onToggleFullscreen,
  isPaused,
  difficulty,
  onChangeDifficulty
}) => {
  const showBossTest = new URLSearchParams(window.location.search).get('bossTest') === '1';
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [showCodex, setShowCodex] = useState(false);
  const [hoveredMode, setHoveredMode] = useState<GameMode | null>(null);

  const lastHoverTime = React.useRef<number>(0);
  const playHoverSound = React.useCallback(() => {
    if (window.matchMedia && window.matchMedia('(hover: none)').matches) return;
    const now = performance.now();
    if (now - lastHoverTime.current > 50) {
      soundEngine.playSound('ui_hover');
      lastHoverTime.current = now;
    }
  }, []);


  const isModeSelected = (mode: GameMode) => gameMode === mode;
  const isModeHovered = (mode: GameMode) => hoveredMode === mode;

  const shouldShowStrongModeState = (mode: GameMode) =>
    hoveredMode !== null
      ? hoveredMode === mode
      : gameMode === mode;


  // Unlock AudioContext on first legitimate user interaction
  useEffect(() => {
    const unlockAudio = () => {
      soundEngine.ensureContext();
      window.removeEventListener('pointerdown', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
    };

    window.addEventListener('pointerdown', unlockAudio, { once: true });
    window.addEventListener('keydown', unlockAudio, { once: true });

    return () => {
      window.removeEventListener('pointerdown', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
    };
  }, []);

  // Allow SPACE or ENTER to trigger Start Game (if modals aren't open)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      if (showHowToPlay || showCodex) {
        if (e.key === 'Escape') {
          setShowHowToPlay(false);
          setShowCodex(false);
        }
        return;
      }
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        onStartGame(gameMode);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onStartGame, gameMode, showHowToPlay, showCodex]);

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#07090E]/85 backdrop-blur-md p-4 sm:p-6 overflow-y-auto">
        {/* Decorative Outer Space Grid */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          {/* Starfield */}
          <svg className="absolute inset-0 w-full h-full opacity-70">
            {[...Array(120)].map((_, i) => (
              <circle 
                key={i}
                cx={`${(i * 71) % 100}%`} 
                cy={`${(i * 97) % 100}%`} 
                r={i % 3 === 0 ? 1.5 : i % 5 === 0 ? 1 : 0.5} 
                fill={i % 4 === 0 ? "#58A6FF" : "#FFFFFF"}
                opacity={0.15 + (i % 5) * 0.15}
              />
            ))}
          </svg>
  
          {/* CSS Background Grid */}
          <div 
            className="absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage: `
                linear-gradient(to right, #00A0FF 1px, transparent 1px),
                linear-gradient(to bottom, #00A0FF 1px, transparent 1px)
              `,
              backgroundSize: '48px 48px'
            }}
          />

          {/* ATMOSPHERIC NEBULA / DARK MATTER */}
          {/* Teal/Cyan haze on top-left */}
          <div className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] bg-[#00A0FF]/15 blur-[120px] rounded-full mix-blend-screen" />
          {/* Violet/Magenta haze on bottom-right */}
          <div className="absolute -bottom-[20%] -right-[10%] w-[80vw] h-[80vw] bg-[#A371F7]/15 blur-[140px] rounded-full mix-blend-screen" />
          
          {/* DARK MATTER / VOID ANOMALY (Lower-right / Right) */}
          {/* Faint cyan/magenta fringe */}
          <div className="absolute bottom-[-10%] -right-[20%] w-[90vw] h-[75vw] bg-gradient-to-r from-[#4C1D95]/25 to-[#00A0FF]/5 blur-[120px] rounded-[60%_40%_50%_70%] mix-blend-multiply" />
          {/* Deep blue-black / purple interior with violet halo */}
          <div className="absolute bottom-[0%] -right-[15%] w-[80vw] h-[60vw] bg-gradient-to-br from-[#160B2E]/90 via-[#0B0618]/95 to-[#4C1D95]/35 blur-[100px] rounded-[40%_60%_70%_50%] rotate-6 mix-blend-multiply" />
          {/* Near-black centre */}
          <div className="absolute bottom-[5%] -right-[10%] w-[60vw] h-[45vw] bg-[#020207] blur-[100px] rounded-[50%_70%_40%_60%] -rotate-6 mix-blend-multiply opacity-95" />

          {/* DEEP BACKGROUND DREADNOUGHT BOSS */}
          {/* Placed inside the void region, emerging from darkness */}
          <div className="absolute bottom-[2%] md:bottom-[5%] -right-[12%] md:-right-[8%] w-[280px] h-[280px] md:w-[520px] md:h-[520px] opacity-[0.20] -rotate-12 hidden sm:block">
             <GameBossDreadnoughtSVG className="w-full h-full" />
          </div>

          {/* APPROVED OUTER ASSETS */}
          
          {/* NEAR: Large Asteroid (Desktop & Tablet & Mobile) */}
          <div className="absolute top-0 left-0 -translate-x-[35%] -translate-y-[20%] w-[220px] h-[220px] md:w-[360px] md:h-[360px] opacity-[0.38] rotate-[75deg]">
            <LargeAsteroidSVG className="w-full h-full" />
          </div>

          {/* MID-DISTANCE: 1 Normal Asteroid (Tablet & Desktop only) */}
          <div className="absolute bottom-0 left-0 -translate-x-[20%] translate-y-[15%] w-[160px] h-[160px] md:w-[240px] md:h-[240px] opacity-[0.28] -rotate-45 hidden sm:block">
            <NormalAsteroidSVG className="w-full h-full" />
          </div>
          
          {/* FAR DISTANCE: Smaller Normal Asteroid (Desktop only) */}
          <div className="absolute bottom-[25%] left-[4%] w-[80px] h-[80px] md:w-[100px] md:h-[100px] opacity-[0.12] rotate-[110deg] hidden lg:block">
            <NormalAsteroidSVG className="w-full h-full" />
          </div>

          {/* NEAR/MID: Game Enemy Ship 1 (Desktop & Tablet & Mobile) */}
          <div className="absolute -top-[2%] right-0 translate-x-[35%] md:translate-x-[25%] w-[250px] h-[125px] md:w-[380px] md:h-[190px] opacity-[0.20] rotate-[155deg]">
            <GameEnemyShipSVG className="w-full h-full" />
          </div>

          {/* FAR DISTANCE: Game Enemy Ship 2 (Desktop only) */}
          <div className="absolute bottom-[2%] right-0 translate-x-[20%] w-[150px] h-[75px] md:w-[220px] md:h-[110px] opacity-[0.14] -rotate-12 hidden lg:block">
            <GameEnemyShipSVG className="w-full h-full" />
          </div>

          {/* FAR DISTANCE: Player Ship (Tablet & Desktop) */}
          <div className="absolute top-[35%] left-[2%] w-[60px] h-[60px] md:w-[80px] md:h-[80px] opacity-[0.18] rotate-[65deg] hidden sm:block">
            <PlayerShipVariantSVG className="w-full h-full" />
          </div>

          {/* FAR DISTANCE: Special Asteroid (Desktop only) */}
          <div className="absolute top-[25%] right-[2%] w-[70px] h-[70px] md:w-[90px] md:h-[90px] opacity-[0.15] rotate-45 hidden lg:block">
            <SpecialAsteroidSVG className="w-full h-full" />
          </div>
          
        </div>

      {/* Main Responsive Glass Card - Now a Cockpit Viewport */}
      <div className="relative z-10 w-full max-w-[840px] bg-[#0D1117]/80 border border-[#30363D] rounded-2xl sm:rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.8)] p-6 sm:p-8 md:p-10 text-[#E6EDF3] flex flex-col items-center text-center my-auto transition-all overflow-hidden">
        
        {/* INTERNAL COCKPIT SCENE (Z-0) */}
        <div className="absolute inset-0 z-0 pointer-events-none bg-[#080B10]">
          {/* Starfield */}
          <svg className="absolute inset-0 w-full h-full opacity-60">
            {[...Array(80)].map((_, i) => (
              <circle 
                key={i}
                cx={`${(i * 83) % 100}%`} 
                cy={`${(i * 137) % 100}%`} 
                r={i % 3 === 0 ? 1.5 : i % 5 === 0 ? 1 : 0.5} 
                fill={i % 5 === 0 ? "#58A6FF" : "#FFFFFF"}
                opacity={0.25 + (i % 5) * 0.15}
              />
            ))}
          </svg>

          {/* Inner Grid */}
          <div 
            className="absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage: `
                linear-gradient(to right, #00A0FF 1px, transparent 1px),
                linear-gradient(to bottom, #00A0FF 1px, transparent 1px)
              `,
              backgroundSize: '48px 48px'
            }}
          />

          {/* Large Left Asteroid */}
          <div className="absolute top-[15%] left-[-2%] w-[400px] h-[400px] opacity-[0.55] -rotate-[15deg]">
            <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
              <polygon points="15,25 35,5 75,10 95,45 80,85 45,95 10,75 5,45" fill="none" stroke="#00A0FF" strokeWidth="1" vectorEffect="non-scaling-stroke"/>
              <polyline points="15,25 45,50 75,10" fill="none" stroke="#00A0FF" strokeWidth="0.5" vectorEffect="non-scaling-stroke"/>
              <polyline points="45,50 95,45" fill="none" stroke="#00A0FF" strokeWidth="0.5" vectorEffect="non-scaling-stroke"/>
              <polyline points="45,50 80,85" fill="none" stroke="#00A0FF" strokeWidth="0.5" vectorEffect="non-scaling-stroke"/>
              <polyline points="45,50 10,75" fill="none" stroke="#00A0FF" strokeWidth="0.5" vectorEffect="non-scaling-stroke"/>
              <circle cx="35" cy="35" r="8" fill="none" stroke="#00A0FF" strokeWidth="0.5" vectorEffect="non-scaling-stroke"/>
              <circle cx="65" cy="65" r="12" fill="none" stroke="#00A0FF" strokeWidth="0.5" vectorEffect="non-scaling-stroke"/>
            </svg>
          </div>

          {/* Medium Asteroid (Mid-Right/Lower) */}
          <div className="absolute bottom-[10%] right-[3%] w-[250px] h-[250px] opacity-[0.50] rotate-[35deg] hidden sm:block">
            <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
              <polygon points="20,20 60,10 90,40 70,85 30,90 10,60" fill="none" stroke="#00A0FF" strokeWidth="1.2" vectorEffect="non-scaling-stroke"/>
              <polyline points="20,20 50,55 90,40" fill="none" stroke="#00A0FF" strokeWidth="0.6" vectorEffect="non-scaling-stroke"/>
              <polyline points="50,55 70,85" fill="none" stroke="#00A0FF" strokeWidth="0.6" vectorEffect="non-scaling-stroke"/>
              <polyline points="50,55 10,60" fill="none" stroke="#00A0FF" strokeWidth="0.6" vectorEffect="non-scaling-stroke"/>
              <circle cx="45" cy="70" r="10" fill="none" stroke="#00A0FF" strokeWidth="0.5" vectorEffect="non-scaling-stroke"/>
            </svg>
          </div>

          {/* Smaller Asteroid (Upper Mid) */}
          <div className="absolute top-[15%] left-[45%] w-[120px] h-[120px] opacity-[0.40] rotate-[75deg] hidden lg:block">
            <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
              <polygon points="30,10 70,20 85,60 60,90 20,80 10,40" fill="none" stroke="#00A0FF" strokeWidth="1.5" vectorEffect="non-scaling-stroke"/>
              <polyline points="30,10 50,50 85,60" fill="none" stroke="#00A0FF" strokeWidth="0.5" vectorEffect="non-scaling-stroke"/>
              <polyline points="50,50 60,90" fill="none" stroke="#00A0FF" strokeWidth="0.5" vectorEffect="non-scaling-stroke"/>
              <polyline points="50,50 10,40" fill="none" stroke="#00A0FF" strokeWidth="0.5" vectorEffect="non-scaling-stroke"/>
            </svg>
          </div>

          {/* Enemy 1: Mothership/Boss (Upper Right) */}
          <div className="absolute top-[8%] right-[10%] w-[240px] h-[240px] opacity-[0.60] rotate-[15deg] hidden sm:block">
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_10px_rgba(255,0,85,0.5)]" preserveAspectRatio="xMidYMid meet">
              <polygon points="50,10 85,30 85,70 50,90 15,70 15,30" fill="none" stroke="#ff0055" strokeWidth="2" vectorEffect="non-scaling-stroke"/>
              <polygon points="50,25 70,40 70,60 50,75 30,60 30,40" fill="none" stroke="#ff0055" strokeWidth="1" vectorEffect="non-scaling-stroke"/>
              <circle cx="50" cy="50" r="8" fill="none" stroke="#ff0055" strokeWidth="2" vectorEffect="non-scaling-stroke" />
              <line x1="50" y1="10" x2="50" y2="25" stroke="#ff0055" strokeWidth="1" vectorEffect="non-scaling-stroke"/>
              <line x1="85" y1="30" x2="70" y2="40" stroke="#ff0055" strokeWidth="1" vectorEffect="non-scaling-stroke"/>
              <line x1="85" y1="70" x2="70" y2="60" stroke="#ff0055" strokeWidth="1" vectorEffect="non-scaling-stroke"/>
              <line x1="50" y1="90" x2="50" y2="75" stroke="#ff0055" strokeWidth="1" vectorEffect="non-scaling-stroke"/>
              <line x1="15" y1="70" x2="30" y2="60" stroke="#ff0055" strokeWidth="1" vectorEffect="non-scaling-stroke"/>
              <line x1="15" y1="30" x2="30" y2="40" stroke="#ff0055" strokeWidth="1" vectorEffect="non-scaling-stroke"/>
            </svg>
          </div>

          {/* Enemy 2: Hunter (Right Middle) */}
          <div className="absolute top-[40%] right-[8%] w-[100px] h-[100px] opacity-[0.65] -rotate-[40deg] hidden md:block">
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_8px_rgba(255,153,0,0.6)]" preserveAspectRatio="xMidYMid meet">
               <polygon points="50,10 90,80 50,65 10,80" fill="none" stroke="#FF9900" strokeWidth="2.5" vectorEffect="non-scaling-stroke"/>
               <polyline points="50,10 50,65" fill="none" stroke="#FF9900" strokeWidth="1.5" vectorEffect="non-scaling-stroke"/>
               <circle cx="50" cy="55" r="5" fill="none" stroke="#FF9900" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
            </svg>
          </div>

          {/* Enemy 3: Swarmer (Distant Left) */}
          <div className="absolute top-[30%] left-[25%] w-[60px] h-[60px] opacity-[0.50] rotate-[55deg] hidden lg:block">
            <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
               <polygon points="50,15 85,50 50,85 15,50" fill="none" stroke="#00FF66" strokeWidth="2" vectorEffect="non-scaling-stroke"/>
               <circle cx="50" cy="50" r="10" fill="none" stroke="#00FF66" strokeWidth="1" vectorEffect="non-scaling-stroke" />
               <line x1="50" y1="15" x2="50" y2="85" stroke="#00FF66" strokeWidth="1" vectorEffect="non-scaling-stroke"/>
               <line x1="15" y1="50" x2="85" y2="50" stroke="#00FF66" strokeWidth="1" vectorEffect="non-scaling-stroke"/>
            </svg>
          </div>

          {/* Vector Debris Fragments */}
          <div className="absolute top-[35%] left-[30%] w-[20px] h-[20px] opacity-[0.40] rotate-[110deg]">
            <svg viewBox="0 0 100 100" className="w-full h-full"><polyline points="10,10 40,30 20,60" fill="none" stroke="#00A0FF" strokeWidth="1.5"/></svg>
          </div>
          <div className="absolute top-[65%] right-[15%] w-[15px] h-[15px] opacity-[0.45] rotate-[45deg]">
            <svg viewBox="0 0 100 100" className="w-full h-full"><polygon points="20,20 80,40 50,80" fill="none" stroke="#FF9900" strokeWidth="1.5"/></svg>
          </div>
          <div className="absolute top-[20%] right-[40%] w-[25px] h-[25px] opacity-[0.35] rotate-[-30deg]">
            <svg viewBox="0 0 100 100" className="w-full h-full"><polyline points="50,10 80,50 10,90" fill="none" stroke="#00A0FF" strokeWidth="1"/></svg>
          </div>

          {/* Player Ship (Right-middle, flying into combat) */}
          <div className="absolute bottom-[18%] right-[22%] w-[85px] h-[85px] opacity-[0.70] -rotate-[18deg] hidden sm:block">
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_15px_rgba(0,240,255,0.8)]" preserveAspectRatio="xMidYMid meet">
              <polygon points="50,10 90,90 50,75 10,90" fill="none" stroke="#00F0FF" strokeWidth="3" vectorEffect="non-scaling-stroke"/>
              <polyline points="50,10 50,75" fill="none" stroke="#00F0FF" strokeWidth="1.5" vectorEffect="non-scaling-stroke"/>
              {/* Thrust trail */}
              <polygon points="35,85 65,85 50,110" fill="none" stroke="#00A0FF" strokeWidth="2" vectorEffect="non-scaling-stroke"/>
              <polygon points="42,85 58,85 50,100" fill="#00A0FF" opacity="0.6"/>
            </svg>
          </div>

          {/* Mobile Fallback Objects: 1 Asteroid, 1 Enemy Ship */}
          <div className="absolute top-[5%] right-[2%] w-[120px] h-[120px] opacity-[0.60] rotate-[15deg] sm:hidden">
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_10px_rgba(255,0,85,0.5)]" preserveAspectRatio="xMidYMid meet">
              <polygon points="50,10 85,30 85,70 50,90 15,70 15,30" fill="none" stroke="#ff0055" strokeWidth="2" vectorEffect="non-scaling-stroke"/>
              <circle cx="50" cy="50" r="15" fill="none" stroke="#ff0055" strokeWidth="1" vectorEffect="non-scaling-stroke" />
            </svg>
          </div>
          
          {/* Readability Gradients/Masks */}
          {/* Lighter Center Mask for Title and Mission Cards */}
          <div className="absolute inset-0 opacity-70" style={{ backgroundImage: 'radial-gradient(ellipse at center, #080B10 35%, transparent 80%)' }} />
          {/* Lower/Lighter Bottom Mask for Buttons */}
          <div className="absolute bottom-0 left-0 right-0 h-[35%] bg-gradient-to-t from-[#080B10] via-[#080B10]/70 to-transparent opacity-85" />
        </div>

        {/* UI CONTENT (Z-10) */}
        <div className="relative z-10 w-full flex flex-col items-center">
        
        {/* Retro Header Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1F6FEB]/15 border border-[#1F6FEB]/40 text-[#58A6FF] text-xs font-mono font-bold tracking-widest uppercase mb-4 shadow-sm">
          <Radio className="w-3.5 h-3.5 animate-pulse text-[#58A6FF]" />
          SYSTEM READY • HIGH SCORE: {highScore.toLocaleString()}
        </div>

        {/* Main Title - Prominent Custom Vector Logo */}
        <div className="relative w-full max-w-[266px] sm:max-w-[399px] md:max-w-[532px] mx-auto mb-2 select-none group">
          {/* Subtle flicker/power-on effect wrapper */}
          <div className="animate-[powerOn_0.3s_ease-out_1]">
            <svg viewBox="0 0 600 120" className="w-full h-auto drop-shadow-[0_0_20px_rgba(56,189,248,0.35)] sm:drop-shadow-[0_0_35px_rgba(56,189,248,0.5)] overflow-visible">
              <defs>
                <linearGradient id="astroGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#00f0ff" />
                  <stop offset="50%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
                <linearGradient id="voidGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
                {/* Thin scanline pattern for inner clipping */}
                <pattern id="scanlines" width="4" height="4" patternUnits="userSpaceOnUse">
                  <rect width="4" height="2" fill="currentColor" fillOpacity="0.1" />
                </pattern>
              </defs>

              <style>
                {`
                  @keyframes powerOn {
                    0% { opacity: 0; filter: brightness(3) blur(10px); }
                    30% { opacity: 0.5; filter: brightness(1) blur(0px); }
                    40% { opacity: 0; }
                    50% { opacity: 1; filter: brightness(2) blur(4px); }
                    60% { opacity: 0.2; }
                    100% { opacity: 1; filter: brightness(1) blur(0px); }
                  }
                  @keyframes typeOn {
                    0% { clip-path: inset(0 100% 0 0); }
                    100% { clip-path: inset(0 0 0 0); }
                  }
                  @keyframes cursorBlink {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0; }
                  }
                  .title-fill { fill: url(#astroGrad); }
                  .title-fill-void { fill: url(#voidGrad); }
                  .title-stroke { fill: none; stroke: url(#astroGrad); stroke-width: 1.5; opacity: 0.8; }
                  .title-stroke-void { fill: none; stroke: url(#voidGrad); stroke-width: 1.5; opacity: 0.8; }
                  
                  /* Faint offset background layer for 3D/Neon pop */
                  .title-glow-bg { fill: none; stroke: #38bdf8; stroke-width: 6; opacity: 0.15; filter: blur(4px); transform: translate(2px, 2px); }
                  .title-glow-bg-void { fill: none; stroke: #ec4899; stroke-width: 6; opacity: 0.15; filter: blur(4px); transform: translate(2px, 2px); }
                `}
              </style>

              <g transform="translate(10, 85)">
                {/* A (ASTRO) - Custom extended left leg, notched crossbar */}
                <g transform="translate(0, 0)">
                  <path d="M 35,-80 L 60,0 L 45,0 L 38,-22 L 20,-22 L 10,0 L -5,0 L 20,-80 Z M 25,-40 L 33,-40 L 29,-58 Z" className="title-fill" />
                  <path d="M 35,-80 L 60,0 L 45,0 L 38,-22 L 20,-22 L 10,0 L -5,0 L 20,-80 Z M 25,-40 L 33,-40 L 29,-58 Z" className="title-stroke" />
                  {/* Decorative notch line */}
                  <line x1="-8" y1="-10" x2="15" y2="-10" stroke="#00f0ff" strokeWidth="2" opacity="0.6" />
                </g>
                
                {/* S - Crisp geometric */}
                <g transform="translate(65, 0)">
                  <path d="M 40,-80 L 0,-80 L 0,-35 L 30,-35 L 30,-15 L -5,-15 L -5,0 L 45,0 L 45,-50 L 15,-50 L 15,-65 L 40,-65 Z" className="title-fill" />
                  <path d="M 40,-80 L 0,-80 L 0,-35 L 30,-35 L 30,-15 L -5,-15 L -5,0 L 45,0 L 45,-50 L 15,-50 L 15,-65 L 40,-65 Z" className="title-stroke" />
                </g>

                {/* T - Standard geometric */}
                <g transform="translate(115, 0)">
                  <path d="M -5,-80 L 45,-80 L 45,-65 L 28,-65 L 28,0 L 12,0 L 12,-65 L -5,-65 Z" className="title-fill" />
                  <path d="M -5,-80 L 45,-80 L 45,-65 L 28,-65 L 28,0 L 12,0 L 12,-65 L -5,-65 Z" className="title-stroke" />
                </g>

                {/* R - Extended heavy right leg */}
                <g transform="translate(165, 0)">
                  <path d="M 0,-80 L 35,-80 C 45,-80 50,-75 50,-60 C 50,-48 44,-42 35,-40 L 55,0 L 35,0 L 20,-40 L 15,-40 L 15,0 L 0,0 Z M 15,-55 L 32,-55 C 34,-55 35,-56 35,-60 C 35,-64 34,-65 32,-65 L 15,-65 Z" className="title-fill" />
                  <path d="M 0,-80 L 35,-80 C 45,-80 50,-75 50,-60 C 50,-48 44,-42 35,-40 L 55,0 L 35,0 L 20,-40 L 15,-40 L 15,0 L 0,0 Z M 15,-55 L 32,-55 C 34,-55 35,-56 35,-60 C 35,-64 34,-65 32,-65 L 15,-65 Z" className="title-stroke" />
                </g>

                {/* O - Standard geometric for ASTRO */}
                <g transform="translate(230, 0)">
                  <path d="M 25,-80 C 45,-80 55,-70 55,-40 C 55,-10 45,0 25,0 C 5,0 -5,-10 -5,-40 C -5,-70 5,-80 25,-80 Z M 25,-65 C 13,-65 10,-55 10,-40 C 10,-25 13,-15 25,-15 C 37,-15 40,-25 40,-40 C 40,-55 37,-65 25,-65 Z" className="title-fill" />
                  <path d="M 25,-80 C 45,-80 55,-70 55,-40 C 55,-10 45,0 25,0 C 5,0 -5,-10 -5,-40 C -5,-70 5,-80 25,-80 Z" className="title-stroke" />
                  <path d="M 25,-65 C 13,-65 10,-55 10,-40 C 10,-25 13,-15 25,-15 C 37,-15 40,-25 40,-40 C 40,-55 37,-65 25,-65 Z" className="title-stroke" />
                </g>

                {/* V (VOID) - Custom broken left segment */}
                <g transform="translate(320, 0)">
                  {/* Left broken segment */}
                  <polygon points="0,-80 16,-80 19,-60 3,-60" className="title-fill-void" />
                  <polygon points="5,-50 20,-50 28,0 12,0" className="title-fill-void" />
                  {/* Right continuous segment */}
                  <polygon points="50,-80 34,-80 22,0 38,0" className="title-fill-void" />
                  
                  {/* Outline overlay */}
                  <path d="M 0,-80 L 16,-80 L 19,-60 L 3,-60 Z M 5,-50 L 20,-50 L 28,0 L 12,0 Z M 50,-80 L 34,-80 L 22,0 L 38,0 Z" className="title-stroke-void" />
                </g>

                {/* O (VOID) - Clean Custom Geometric */}
                <g transform="translate(385, 0)">
                  <path d="M 25,-80 C 45,-80 55,-70 55,-40 C 55,-10 45,0 25,0 C 5,0 -5,-10 -5,-40 C -5,-70 5,-80 25,-80 Z M 25,-65 C 13,-65 10,-55 10,-40 C 10,-25 13,-15 25,-15 C 37,-15 40,-25 40,-40 C 40,-55 37,-65 25,-65 Z" className="title-fill-void" />
                  <path d="M 25,-80 C 45,-80 55,-70 55,-40 C 55,-10 45,0 25,0 C 5,0 -5,-10 -5,-40 C -5,-70 5,-80 25,-80 Z" className="title-stroke-void" />
                  <path d="M 25,-65 C 13,-65 10,-55 10,-40 C 10,-25 13,-15 25,-15 C 37,-15 40,-25 40,-40 C 40,-55 37,-65 25,-65 Z" className="title-stroke-void" />
                </g>

                {/* I - Standard geometric */}
                <g transform="translate(453, 0)">
                  <rect x="0" y="-80" width="15" height="80" className="title-fill-void" />
                  <rect x="0" y="-80" width="15" height="80" className="title-stroke-void" />
                </g>

                {/* D - Standard geometric */}
                <g transform="translate(482, 0)">
                  <path d="M 0,-80 L 25,-80 C 45,-80 50,-70 50,-40 C 50,-10 45,0 25,0 L 0,0 Z M 15,-65 L 15,-15 L 25,-15 C 33,-15 35,-20 35,-40 C 35,-60 33,-65 25,-65 Z" className="title-fill-void" />
                  <path d="M 0,-80 L 25,-80 C 45,-80 50,-70 50,-40 C 50,-10 45,0 25,0 L 0,0 Z M 15,-65 L 15,-15 L 25,-15 C 33,-15 35,-20 35,-40 C 35,-60 33,-65 25,-65 Z" className="title-stroke-void" />
                </g>

                {/* Glitch Overlay Lines - spans the whole logo, but masked down visually */}
                <line x1="-20" y1="-25" x2="570" y2="-25" stroke="#ffffff" strokeWidth="1" opacity="0.2" strokeDasharray="15 30 5 10" />
                <line x1="-20" y1="-50" x2="570" y2="-50" stroke="#00f0ff" strokeWidth="0.5" opacity="0.3" strokeDasharray="50 100 20 10" />
              </g>
            </svg>
          </div>
        </div>
        <div className="flex items-center justify-center mb-10 sm:mb-12 w-full select-none opacity-85">
          <div className="font-mono text-[13px] sm:text-[15px] md:text-[16px] tracking-wide uppercase text-[#8B949E] font-bold motion-safe:animate-[typeOn_800ms_steps(35,end)_forwards] whitespace-nowrap overflow-hidden">
            <span className="opacity-70 mr-2 sm:mr-3">&gt;</span>
            <span>DEEP SPACE INTERCEPTOR</span>
            <span className="mx-2 sm:mx-3 opacity-60">//</span>
            <span className="text-[#58A6FF] opacity-100">ONLINE<span className="animate-[cursorBlink_1s_step-end_infinite]">_</span></span>
          </div>
        </div>        {/* Mode Selector - 3 Modes with Active vs Dimmed Styling */}
        <div className="w-full mb-6 sm:mb-8">
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-xs font-mono font-bold text-[#8B949E] uppercase tracking-wider">
              SELECT MISSION MODE
            </span>
            <span className="text-[11px] font-mono text-[#58A6FF]/80">
              {MODE_SUMMARIES[hoveredMode ?? gameMode]}
            </span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {/* Classic */}
            <button type="button"
              tabIndex={-1}
              onClick={() => onChangeGameMode('classic')}
              onMouseEnter={() => { setHoveredMode('classic'); playHoverSound(); }}
              onMouseLeave={() => setHoveredMode(null)}
              className={`p-3.5 sm:p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                shouldShowStrongModeState('classic')
                  ? isModeSelected('classic')
                    ? 'bg-[#1F6FEB]/20 border-[#58A6FF] text-[#E6EDF3] shadow-[0_0_20px_rgba(88,166,255,0.25)] scale-[1.02] opacity-100 ring-1 ring-[#58A6FF]/50'
                    : 'bg-[#1F6FEB]/10 border-[#58A6FF] text-[#E6EDF3] shadow-[0_0_15px_rgba(88,166,255,0.15)] scale-[1.01] opacity-90 lg:opacity-100'
                  : 'bg-[#161B22]/50 border-[#21262D] text-[#484F58] opacity-50'
              }`}
            >
              <div className={`font-mono font-bold text-sm sm:text-base flex items-center justify-between ${
                shouldShowStrongModeState('classic') ? 'text-[#58A6FF]' : 'text-[#6E7681]'
              }`}>
                CLASSIC
                {shouldShowStrongModeState('classic') && <div className="w-2.5 h-2.5 rounded-full bg-[#58A6FF] shadow-[0_0_10px_#58A6FF]" />}
              </div>
              <div className={`text-[11px] font-mono mt-1.5 leading-snug ${
                shouldShowStrongModeState('classic') ? 'text-[#C9D1D9]' : 'text-[#484F58]'
              }`}>
                3 Lives • Progressive Waves • Powerups & UFOs
              </div>
            </button>

            {/* Survival */}
            <button type="button"
              tabIndex={-1}
              onClick={() => onChangeGameMode('survival')}
              onMouseEnter={() => { setHoveredMode('survival'); playHoverSound(); }}
              onMouseLeave={() => setHoveredMode(null)}
              className={`p-3.5 sm:p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                shouldShowStrongModeState('survival')
                  ? isModeSelected('survival')
                    ? 'bg-[#D29922]/20 border-[#D29922] text-[#E6EDF3] shadow-[0_0_20px_rgba(210,153,34,0.25)] scale-[1.02] opacity-100 ring-1 ring-[#D29922]/50'
                    : 'bg-[#D29922]/10 border-[#D29922] text-[#E6EDF3] shadow-[0_0_15px_rgba(210,153,34,0.15)] scale-[1.01] opacity-90 lg:opacity-100'
                  : 'bg-[#161B22]/50 border-[#21262D] text-[#484F58] opacity-50'
              }`}
            >
              <div className={`font-mono font-bold text-sm sm:text-base flex items-center justify-between ${
                shouldShowStrongModeState('survival') ? 'text-[#D29922]' : 'text-[#6E7681]'
              }`}>
                SURVIVAL
                {shouldShowStrongModeState('survival') && <div className="w-2.5 h-2.5 rounded-full bg-[#D29922] shadow-[0_0_10px_#D29922]" />}
              </div>
              <div className={`text-[11px] font-mono mt-1.5 leading-snug ${
                shouldShowStrongModeState('survival') ? 'text-[#C9D1D9]' : 'text-[#484F58]'
              }`}>
                1 Ship • No Extra Lives • Endless Wave Progression
              </div>
            </button>

            {/* Zen Void */}
            <button type="button"
              tabIndex={-1}
              onClick={() => onChangeGameMode('zen')}
              onMouseEnter={() => { setHoveredMode('zen'); playHoverSound(); }}
              onMouseLeave={() => setHoveredMode(null)}
              className={`p-3.5 sm:p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                shouldShowStrongModeState('zen')
                  ? isModeSelected('zen')
                    ? 'bg-[#3FB950]/20 border-[#3FB950] text-[#E6EDF3] shadow-[0_0_20px_rgba(63,185,80,0.25)] scale-[1.02] opacity-100 ring-1 ring-[#3FB950]/50'
                    : 'bg-[#3FB950]/10 border-[#3FB950] text-[#E6EDF3] shadow-[0_0_15px_rgba(63,185,80,0.15)] scale-[1.01] opacity-90 lg:opacity-100'
                  : 'bg-[#161B22]/50 border-[#21262D] text-[#484F58] opacity-50'
              }`}
            >
              <div className={`font-mono font-bold text-sm sm:text-base flex items-center justify-between ${
                shouldShowStrongModeState('zen') ? 'text-[#3FB950]' : 'text-[#6E7681]'
              }`}>
                ZEN VOID
                {shouldShowStrongModeState('zen') && <div className="w-2.5 h-2.5 rounded-full bg-[#3FB950] shadow-[0_0_10px_#3FB950]" />}
              </div>
              <div className={`text-[11px] font-mono mt-1.5 leading-snug ${
                shouldShowStrongModeState('zen') ? 'text-[#C9D1D9]' : 'text-[#484F58]'
              }`}>
                Invincible Flight • Practice Mode • Rewards Disabled
              </div>
            </button>
          </div>
        </div>

        {/* Threat Level */}
        <div className="w-full mb-6 sm:mb-8">
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-xs font-mono font-bold text-[#8B949E] uppercase tracking-wider">
              THREAT LEVEL
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* EASY */}
            <button type="button"
              tabIndex={-1}
              onClick={() => onChangeDifficulty('easy')}
              onMouseEnter={playHoverSound}
              className={`p-3 sm:p-4 rounded-xl border text-center transition-all duration-200 cursor-pointer ${
                difficulty === 'easy'
                  ? 'bg-[#3FB950]/20 border-[#3FB950] text-[#E6EDF3] shadow-[0_0_15px_rgba(63,185,80,0.2)] scale-[1.02] ring-1 ring-[#3FB950]/50'
                  : 'bg-[#161B22]/50 border-[#21262D] text-[#8B949E] hover:border-[#3FB950]/50 hover:text-[#C9D1D9]'
              }`}
            >
              <div className={`font-mono font-bold text-sm sm:text-base ${difficulty === 'easy' ? 'text-[#3FB950]' : ''}`}>EASY</div>
            </button>
            {/* NORMAL */}
            <button type="button"
              tabIndex={-1}
              onClick={() => onChangeDifficulty('normal')}
              onMouseEnter={playHoverSound}
              className={`p-3 sm:p-4 rounded-xl border text-center transition-all duration-200 cursor-pointer ${
                difficulty === 'normal'
                  ? 'bg-[#58A6FF]/20 border-[#58A6FF] text-[#E6EDF3] shadow-[0_0_15px_rgba(88,166,255,0.2)] scale-[1.02] ring-1 ring-[#58A6FF]/50'
                  : 'bg-[#161B22]/50 border-[#21262D] text-[#8B949E] hover:border-[#58A6FF]/50 hover:text-[#C9D1D9]'
              }`}
            >
              <div className={`font-mono font-bold text-sm sm:text-base ${difficulty === 'normal' ? 'text-[#58A6FF]' : ''}`}>NORMAL</div>
            </button>
            {/* HARD */}
            <button type="button"
              tabIndex={-1}
              onClick={() => onChangeDifficulty('hard')}
              onMouseEnter={playHoverSound}
              className={`p-3 sm:p-4 rounded-xl border text-center transition-all duration-200 cursor-pointer ${
                difficulty === 'hard'
                  ? 'bg-[#F85149]/20 border-[#F85149] text-[#E6EDF3] shadow-[0_0_15px_rgba(248,81,73,0.2)] scale-[1.02] ring-1 ring-[#F85149]/50'
                  : 'bg-[#161B22]/50 border-[#21262D] text-[#8B949E] hover:border-[#F85149]/50 hover:text-[#C9D1D9]'
              }`}
            >
              <div className={`font-mono font-bold text-sm sm:text-base ${difficulty === 'hard' ? 'text-[#F85149]' : ''}`}>HARD</div>
            </button>
          </div>
        </div>

        {/* DEV / BOSS TEST */}
        {showBossTest && (
          <div className="w-full mb-6 sm:mb-8">
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="text-xs font-mono font-bold text-[#F85149] uppercase tracking-wider">
                DEV / BOSS TEST
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {/* Boss Rush (Wave 5) */}
            <button type="button"
              tabIndex={-1}
              onClick={() => onChangeGameMode('boss_rush')}
              onMouseEnter={() => { setHoveredMode('boss_rush'); playHoverSound(); }}
              onMouseLeave={() => setHoveredMode(null)}
              className={`p-3.5 sm:p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                shouldShowStrongModeState('boss_rush')
                  ? isModeSelected('boss_rush')
                    ? 'bg-[#F85149]/20 border-[#F85149] text-[#E6EDF3] shadow-[0_0_20px_rgba(248,81,73,0.25)] scale-[1.02] opacity-100 ring-1 ring-[#F85149]/50'
                    : 'bg-[#F85149]/10 border-[#F85149] text-[#E6EDF3] shadow-[0_0_15px_rgba(248,81,73,0.15)] scale-[1.01] opacity-90 lg:opacity-100'
                  : 'bg-[#161B22]/50 border-[#21262D] text-[#484F58] opacity-50'
              }`}
            >
              <div className={`font-mono font-bold text-sm sm:text-base flex items-center justify-between ${
                shouldShowStrongModeState('boss_rush') ? 'text-[#F85149]' : 'text-[#6E7681]'
              }`}>
                WAVE 5 BOSS
                {shouldShowStrongModeState('boss_rush') && <div className="w-2.5 h-2.5 rounded-full bg-[#F85149] shadow-[0_0_10px_#F85149]" />}
              </div>
              <div className={`text-[11px] font-mono mt-1.5 leading-snug ${
                shouldShowStrongModeState('boss_rush') ? 'text-[#C9D1D9]' : 'text-[#484F58]'
              }`}>
                Start at Wave 5 vs Dreadnought • Practice • Rewards Disabled
              </div>
            </button>
            
            {/* Wave 10 Boss */}
            <button type="button"
              tabIndex={-1}
              onClick={() => onChangeGameMode('wave_10_boss')}
              onMouseEnter={() => { setHoveredMode('wave_10_boss'); playHoverSound(); }}
              onMouseLeave={() => setHoveredMode(null)}
              className={`p-3.5 sm:p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                shouldShowStrongModeState('wave_10_boss')
                  ? isModeSelected('wave_10_boss')
                    ? 'bg-[#A371F7]/20 border-[#A371F7] text-[#E6EDF3] shadow-[0_0_20px_rgba(163,113,247,0.25)] scale-[1.02] opacity-100 ring-1 ring-[#A371F7]/50'
                    : 'bg-[#A371F7]/10 border-[#A371F7] text-[#E6EDF3] shadow-[0_0_15px_rgba(163,113,247,0.15)] scale-[1.01] opacity-90 lg:opacity-100'
                  : 'bg-[#161B22]/50 border-[#21262D] text-[#484F58] opacity-50'
              }`}
            >
              <div className={`font-mono font-bold text-sm sm:text-base flex items-center justify-between ${
                shouldShowStrongModeState('wave_10_boss') ? 'text-[#A371F7]' : 'text-[#6E7681]'
              }`}>
                CORE SEVERANCE
                {shouldShowStrongModeState('wave_10_boss') && <div className="w-2.5 h-2.5 rounded-full bg-[#A371F7] shadow-[0_0_10px_#A371F7]" />}
              </div>
              <div className={`text-[11px] font-mono mt-1.5 leading-snug ${
                shouldShowStrongModeState('wave_10_boss') ? 'text-[#C9D1D9]' : 'text-[#484F58]'
              }`}>
                Start at Wave 10 vs Core Severance • Practice • Rewards Disabled
              </div>
            </button>

            {/* Wave 15 Boss - THE GRID ARCHITECT */}
            <button type="button"
              tabIndex={-1}
              onClick={() => onChangeGameMode('wave_15_boss')}
              onMouseEnter={() => { setHoveredMode('wave_15_boss'); playHoverSound(); }}
              onMouseLeave={() => setHoveredMode(null)}
              className={`p-3.5 sm:p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                shouldShowStrongModeState('wave_15_boss')
                  ? isModeSelected('wave_15_boss')
                    ? 'bg-gradient-to-r from-[#00ffff]/20 to-[#ff00ff]/20 border-[#00ffff] text-[#E6EDF3] shadow-[0_0_20px_rgba(0,255,255,0.3)] scale-[1.02] opacity-100 ring-1 ring-[#00ffff]/50'
                    : 'bg-[#00ffff]/10 border-[#00ffff] text-[#E6EDF3] shadow-[0_0_15px_rgba(0,255,255,0.15)] scale-[1.01] opacity-90 lg:opacity-100'
                  : 'bg-[#161B22]/50 border-[#21262D] text-[#484F58] opacity-50'
              }`}
            >
              <div className={`font-mono font-bold text-sm sm:text-base flex items-center justify-between ${
                shouldShowStrongModeState('wave_15_boss') ? 'text-[#00ffff]' : 'text-[#6E7681]'
              }`}>
                THE GRID ARCHITECT
                {shouldShowStrongModeState('wave_15_boss') && <div className="w-2.5 h-2.5 rounded-full bg-[#00ffff] shadow-[0_0_10px_#ff00ff]" />}
              </div>
              <div className={`text-[11px] font-mono mt-1.5 leading-snug ${
                shouldShowStrongModeState('wave_15_boss') ? 'text-[#C9D1D9]' : 'text-[#484F58]'
              }`}>
                Start at Wave 15 vs Grid Architect • Practice • Rewards Disabled
              </div>
            </button>
            </div>
          </div>
        )}

        {/* Primary Action Button - Most Prominent */}
        <button onMouseEnter={playHoverSound} type="button"
          tabIndex={-1}
          onClick={() => onStartGame(gameMode)}
          className="w-full sm:w-auto min-w-[280px] sm:min-w-[340px] py-4 sm:py-5 px-8 sm:px-10 rounded-2xl bg-gradient-to-r from-[#238636] via-[#2EA043] to-[#3FB950] hover:from-[#2EA043] hover:to-[#4ade80] text-[#FFFFFF] font-mono font-extrabold text-xl sm:text-2xl tracking-widest uppercase shadow-[0_0_35px_rgba(46,160,67,0.5)] hover:shadow-[0_0_50px_rgba(46,160,67,0.7)] transition-all transform hover:scale-[1.03] active:scale-[0.98] flex items-center justify-center gap-3 my-2 cursor-pointer"
        >
          <Play className="w-6 h-6 sm:w-7 sm:h-7 fill-current text-white" />
          LAUNCH MISSION
        </button>

        <div className="text-xs font-mono text-[#8B949E] mb-6 sm:mb-8">
          PRESS <kbd className="px-2 py-0.5 bg-[#161B22] border border-[#30363D] rounded text-[#58A6FF] font-bold">SPACE</kbd> OR <kbd className="px-2 py-0.5 bg-[#161B22] border border-[#30363D] rounded text-[#58A6FF] font-bold">ENTER</kbd> TO LAUNCH
        </div>

        {/* Bottom Toolbar & Settings */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 w-full pt-5 border-t border-[#30363D]">
          {/* How to Play Modal Trigger */}
          <button onMouseEnter={playHoverSound} type="button"
            tabIndex={-1}
            onClick={() => setShowHowToPlay(true)}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#161B22] border border-[#30363D] text-[#8B949E] hover:text-[#38BDF8] hover:border-[#38BDF8]/50 text-xs font-mono transition-all cursor-pointer"
          >
            <HelpCircle className="w-4 h-4 text-[#38BDF8]" />
            HOW TO PLAY
          </button>

          {/* Codex Modal Trigger */}
          <button onMouseEnter={playHoverSound} type="button"
            tabIndex={-1}
            onClick={() => setShowCodex(true)}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#161B22] border border-[#30363D] text-[#8B949E] hover:text-[#EC4899] hover:border-[#EC4899]/50 text-xs font-mono transition-all cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-[#EC4899]" />
            INTEL / CODEX
          </button>

          <button onMouseEnter={playHoverSound} type="button"
            tabIndex={-1}
            onClick={onOpenLeaderboard}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#161B22] border border-[#30363D] text-[#8B949E] hover:text-[#D29922] hover:border-[#D29922]/50 text-xs font-mono transition-all cursor-pointer"
          >
            <Trophy className="w-4 h-4 text-[#D29922]" />
            HIGH SCORES
          </button>

          <button onMouseEnter={playHoverSound} type="button"
            tabIndex={-1}
            onClick={onOpenAchievements}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#161B22] border border-[#30363D] text-[#8B949E] hover:text-[#A371F7] hover:border-[#A371F7]/50 text-xs font-mono transition-all cursor-pointer"
          >
            <Award className="w-4 h-4 text-[#A371F7]" />
            ACHIEVEMENTS
          </button>

          <button onMouseEnter={playHoverSound} type="button"
            tabIndex={-1}
            onClick={onOpenChallenges}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#161B22] border border-[#30363D] text-[#8B949E] hover:text-[#38BDF8] hover:border-[#38BDF8]/50 text-xs font-mono transition-all cursor-pointer"
          >
            <Target className="w-4 h-4 text-[#38BDF8]" />
            CHALLENGES
          </button>

          <button onMouseEnter={playHoverSound} type="button"
            tabIndex={-1}
            onClick={onOpenSettings}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#161B22] border border-[#30363D] text-[#8B949E] hover:text-[#58A6FF] hover:border-[#58A6FF]/50 text-xs font-mono transition-all cursor-pointer"
          >
            <Settings className="w-4 h-4 text-[#58A6FF]" />
            SETTINGS
          </button>

          <button onMouseEnter={playHoverSound} type="button"
            tabIndex={-1}
            onClick={onToggleMute}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#161B22] border border-[#30363D] text-[#8B949E] hover:text-[#E6EDF3] text-xs font-mono transition-all cursor-pointer"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-[#F85149]" /> : <Volume2 className="w-4 h-4 text-[#3FB950]" />}
          </button>

          <button onMouseEnter={playHoverSound} type="button"
            tabIndex={-1}
            onClick={(e) => {
              e.currentTarget.blur();
              onToggleFullscreen();
            }}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#161B22] border border-[#30363D] text-[#8B949E] hover:text-[#E6EDF3] hover:border-[#E6EDF3]/50 text-xs font-mono transition-all cursor-pointer"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            {isFullscreen ? <Minimize className="w-4 h-4 text-[#E6EDF3]" /> : <Maximize className="w-4 h-4 text-[#E6EDF3]" />}
            FULLSCREEN
          </button>
        </div>
        </div>
      </div>

      {/* MODAL 1: HOW TO PLAY / CONTROLS OVERLAY */}
      {showHowToPlay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#030508]/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-xl bg-[#0D1117] border border-[#30363D] rounded-2xl shadow-2xl p-6 md:p-8 text-[#E6EDF3] font-mono">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-[#30363D]">
              <div className="flex items-center gap-2 text-[#38BDF8] font-bold text-lg tracking-wider">
                <HelpCircle className="w-5 h-5" />
                PILOT FLIGHT CONTROLS
              </div>
              <button onMouseEnter={playHoverSound} type="button"
                onClick={() => setShowHowToPlay(false)}
                className="p-1.5 rounded-lg text-[#8B949E] hover:text-white hover:bg-[#161B22] transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Controls Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs mb-6">
              <div className="bg-[#161B22] p-3 rounded-xl border border-[#30363D] flex items-center justify-between">
                <div>
                  <div className="text-[#58A6FF] font-bold text-sm">W A S D / 🠄🠅🠆🠇</div>
                  <div className="text-[11px] text-[#8B949E] mt-0.5">Thrust & Steering Rotations</div>
                </div>
              </div>

              <div className="bg-[#161B22] p-3 rounded-xl border border-[#30363D] flex items-center justify-between">
                <div>
                  <div className="text-[#38BDF8] font-bold text-sm">SPACE / Click</div>
                  <div className="text-[11px] text-[#8B949E] mt-0.5">Primary Plasma Cannon</div>
                </div>
              </div>

              <div className="bg-[#161B22] p-3 rounded-xl border border-[#30363D] flex items-center justify-between">
                <div>
                  <div className="text-[#D29922] font-bold text-sm">E / B Key</div>
                  <div className="text-[11px] text-[#8B949E] mt-0.5">EMP Shockwave Screen Cleanser</div>
                </div>
              </div>

              <div className="bg-[#161B22] p-3 rounded-xl border border-[#30363D] flex items-center justify-between">
                <div>
                  <div className="text-[#A371F7] font-bold text-sm">R / SHIFT Key</div>
                  <div className="text-[11px] text-[#8B949E] mt-0.5">Emergency Hyperspace Warp</div>
                </div>
              </div>

              <div className="bg-[#161B22] p-3 rounded-xl border border-[#30363D] flex items-center justify-between">
                <div>
                  <div className="text-[#3FB950] font-bold text-sm">P / ESC</div>
                  <div className="text-[11px] text-[#8B949E] mt-0.5">Tactical Game Pause</div>
                </div>
              </div>

              <div className="bg-[#161B22] p-3 rounded-xl border border-[#30363D] flex items-center justify-between">
                <div>
                  <div className="text-[#F85149] font-bold text-sm">M Key</div>
                  <div className="text-[11px] text-[#8B949E] mt-0.5">Toggle Audio Synth Sound</div>
                </div>
              </div>
            </div>

            {/* Mobile / Touch info */}
            <div className="p-3 bg-[#161B22]/60 rounded-xl border border-[#30363D] text-[11px] text-[#8B949E] mb-6 flex items-center gap-2">
              <Info className="w-4 h-4 text-[#58A6FF] shrink-0" />
              <span>Touchscreens automatically display responsive virtual thrust pedals, joystick pads, and fire buttons.</span>
            </div>

            <button onMouseEnter={playHoverSound} type="button"
              onClick={() => setShowHowToPlay(false)}
              className="w-full py-3 rounded-xl bg-[#238636] hover:bg-[#2EA043] text-white font-bold text-sm tracking-wider uppercase transition-all cursor-pointer"
            >
              CLOSE CONTROLS
            </button>
          </div>
        </div>
      )}

      {/* MODAL 2: INTEL / CODEX OVERLAY */}
      <CodexModal isOpen={showCodex} onClose={() => setShowCodex(false)} />
    </div>
  );
};
