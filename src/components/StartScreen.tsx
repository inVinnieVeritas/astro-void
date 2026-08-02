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
  Info
} from 'lucide-react';
import { GameMode, ControlScheme } from '../types';
import { CodexModal } from './CodexModal';

interface StartScreenProps {
  highScore: number;
  gameMode: GameMode;
  onChangeGameMode: (mode: GameMode) => void;
  controlScheme: ControlScheme;
  onChangeControlScheme: (scheme: ControlScheme) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onStartGame: () => void;
  onOpenLeaderboard: () => void;
  onOpenAchievements: () => void;
  onOpenSettings: () => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({
  highScore,
  gameMode,
  onChangeGameMode,
  controlScheme,
  onChangeControlScheme,
  isMuted,
  onToggleMute,
  onStartGame,
  onOpenLeaderboard,
  onOpenAchievements,
  onOpenSettings,
}) => {
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [showCodex, setShowCodex] = useState(false);

  // Allow SPACE or ENTER to trigger Start Game (if modals aren't open)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showHowToPlay || showCodex) {
        if (e.key === 'Escape') {
          setShowHowToPlay(false);
          setShowCodex(false);
        }
        return;
      }
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        onStartGame();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onStartGame, showHowToPlay, showCodex]);

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#07090E]/85 backdrop-blur-md p-4 sm:p-6 overflow-y-auto">
      {/* Main Responsive Glass Card */}
      <div className="relative w-full max-w-[840px] bg-[#0D1117]/90 border border-[#30363D] rounded-2xl sm:rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.8)] p-6 sm:p-8 md:p-10 text-[#E6EDF3] flex flex-col items-center text-center my-auto transition-all">
        
        {/* Retro Header Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1F6FEB]/15 border border-[#1F6FEB]/40 text-[#58A6FF] text-xs font-mono font-bold tracking-widest uppercase mb-4 shadow-sm">
          <Radio className="w-3.5 h-3.5 animate-pulse text-[#58A6FF]" />
          SYSTEM READY • HIGH SCORE: {highScore.toLocaleString()}
        </div>

        {/* Main Title - Prominent */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black font-mono tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#38bdf8] via-[#a855f7] to-[#ec4899] drop-shadow-[0_0_35px_rgba(56,189,248,0.5)] mb-2">
          ASTRO VOID
        </h1>
        <p className="text-xs sm:text-sm md:text-base font-mono text-[#8B949E] mb-6 sm:mb-8 tracking-wide">
          NEON VECTOR SPACE FIGHTER
        </p>

        {/* Mode Selector - 3 Modes with Active vs Dimmed Styling */}
        <div className="w-full mb-6 sm:mb-8">
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-xs font-mono font-bold text-[#8B949E] uppercase tracking-wider">
              SELECT MISSION MODE
            </span>
            <span className="text-[11px] font-mono text-[#58A6FF]/80">
              {gameMode === 'classic' ? 'STANDARD ARCADE' : gameMode === 'survival' ? 'SHIELDED ENDLESS' : 'INVINCIBLE PRACTICE'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Classic */}
            <button
              type="button"
              tabIndex={-1}
              onClick={() => onChangeGameMode('classic')}
              className={`p-3.5 sm:p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                gameMode === 'classic'
                  ? 'bg-[#1F6FEB]/20 border-[#58A6FF] text-[#E6EDF3] shadow-[0_0_20px_rgba(88,166,255,0.25)] scale-[1.02] opacity-100 ring-1 ring-[#58A6FF]/50'
                  : 'bg-[#161B22]/50 border-[#21262D] text-[#484F58] opacity-50 hover:opacity-80 hover:border-[#30363D] hover:text-[#8B949E]'
              }`}
            >
              <div className={`font-mono font-bold text-sm sm:text-base flex items-center justify-between ${
                gameMode === 'classic' ? 'text-[#58A6FF]' : 'text-[#6E7681]'
              }`}>
                CLASSIC
                {gameMode === 'classic' && <div className="w-2.5 h-2.5 rounded-full bg-[#58A6FF] shadow-[0_0_10px_#58A6FF]" />}
              </div>
              <div className={`text-[11px] font-mono mt-1.5 leading-snug ${
                gameMode === 'classic' ? 'text-[#C9D1D9]' : 'text-[#484F58]'
              }`}>
                3 Lives • Progressive Waves • Powerups & UFOs
              </div>
            </button>

            {/* Survival */}
            <button
              type="button"
              tabIndex={-1}
              onClick={() => onChangeGameMode('survival')}
              className={`p-3.5 sm:p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                gameMode === 'survival'
                  ? 'bg-[#D29922]/20 border-[#D29922] text-[#E6EDF3] shadow-[0_0_20px_rgba(210,153,34,0.25)] scale-[1.02] opacity-100 ring-1 ring-[#D29922]/50'
                  : 'bg-[#161B22]/50 border-[#21262D] text-[#484F58] opacity-50 hover:opacity-80 hover:border-[#30363D] hover:text-[#8B949E]'
              }`}
            >
              <div className={`font-mono font-bold text-sm sm:text-base flex items-center justify-between ${
                gameMode === 'survival' ? 'text-[#D29922]' : 'text-[#6E7681]'
              }`}>
                SURVIVAL
                {gameMode === 'survival' && <div className="w-2.5 h-2.5 rounded-full bg-[#D29922] shadow-[0_0_10px_#D29922]" />}
              </div>
              <div className={`text-[11px] font-mono mt-1.5 leading-snug ${
                gameMode === 'survival' ? 'text-[#C9D1D9]' : 'text-[#484F58]'
              }`}>
                Hull Shield Power • Endless Swarm Assault
              </div>
            </button>

            {/* Zen Void */}
            <button
              type="button"
              tabIndex={-1}
              onClick={() => onChangeGameMode('zen')}
              className={`p-3.5 sm:p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                gameMode === 'zen'
                  ? 'bg-[#3FB950]/20 border-[#3FB950] text-[#E6EDF3] shadow-[0_0_20px_rgba(63,185,80,0.25)] scale-[1.02] opacity-100 ring-1 ring-[#3FB950]/50'
                  : 'bg-[#161B22]/50 border-[#21262D] text-[#484F58] opacity-50 hover:opacity-80 hover:border-[#30363D] hover:text-[#8B949E]'
              }`}
            >
              <div className={`font-mono font-bold text-sm sm:text-base flex items-center justify-between ${
                gameMode === 'zen' ? 'text-[#3FB950]' : 'text-[#6E7681]'
              }`}>
                ZEN VOID
                {gameMode === 'zen' && <div className="w-2.5 h-2.5 rounded-full bg-[#3FB950] shadow-[0_0_10px_#3FB950]" />}
              </div>
              <div className={`text-[11px] font-mono mt-1.5 leading-snug ${
                gameMode === 'zen' ? 'text-[#C9D1D9]' : 'text-[#484F58]'
              }`}>
                Invincible Flight • Casual Stress-Free Practice
              </div>
            </button>
          </div>
        </div>

        {/* Primary Action Button - Most Prominent */}
        <button
          type="button"
          tabIndex={-1}
          onClick={onStartGame}
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
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowHowToPlay(true)}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#161B22] border border-[#30363D] text-[#8B949E] hover:text-[#38BDF8] hover:border-[#38BDF8]/50 text-xs font-mono transition-all cursor-pointer"
          >
            <HelpCircle className="w-4 h-4 text-[#38BDF8]" />
            HOW TO PLAY
          </button>

          {/* Codex Modal Trigger */}
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowCodex(true)}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#161B22] border border-[#30363D] text-[#8B949E] hover:text-[#EC4899] hover:border-[#EC4899]/50 text-xs font-mono transition-all cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-[#EC4899]" />
            INTEL / CODEX
          </button>

          <button
            type="button"
            tabIndex={-1}
            onClick={onOpenLeaderboard}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#161B22] border border-[#30363D] text-[#8B949E] hover:text-[#D29922] hover:border-[#D29922]/50 text-xs font-mono transition-all cursor-pointer"
          >
            <Trophy className="w-4 h-4 text-[#D29922]" />
            HIGH SCORES
          </button>

          <button
            type="button"
            tabIndex={-1}
            onClick={onOpenAchievements}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#161B22] border border-[#30363D] text-[#8B949E] hover:text-[#A371F7] hover:border-[#A371F7]/50 text-xs font-mono transition-all cursor-pointer"
          >
            <Award className="w-4 h-4 text-[#A371F7]" />
            ACHIEVEMENTS
          </button>

          <button
            type="button"
            tabIndex={-1}
            onClick={onOpenSettings}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#161B22] border border-[#30363D] text-[#8B949E] hover:text-[#58A6FF] hover:border-[#58A6FF]/50 text-xs font-mono transition-all cursor-pointer"
          >
            <Settings className="w-4 h-4 text-[#58A6FF]" />
            SETTINGS
          </button>

          <button
            type="button"
            tabIndex={-1}
            onClick={onToggleMute}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#161B22] border border-[#30363D] text-[#8B949E] hover:text-[#E6EDF3] text-xs font-mono transition-all cursor-pointer"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-[#F85149]" /> : <Volume2 className="w-4 h-4 text-[#3FB950]" />}
          </button>
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
              <button
                type="button"
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

            <button
              type="button"
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
