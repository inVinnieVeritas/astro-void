import React from 'react';
import { Volume2, VolumeX, Pause, Play, Settings, Trophy, Award, Zap, Shield, Sparkles, Target, Bomb, Maximize, Minimize } from 'lucide-react';
import { GameMode } from '../types';

interface HUDProps {
  score: number;
  highScore: number;
  wave: number;
  lives: number;
  mode: GameMode;
  empCount: number;
  empRechargeProgress?: number;
  hyperspaceCooldown: number;
  hullPower?: number;
  maxHullPower?: number;
  activePowerups: {
    tripleShot?: number;
    shield?: number;
    golden?: number;
    laser?: number;
    drone?: number;
    magnet?: number;
    timewarp?: number;
    repulsor?: number;
  };
  isPaused: boolean;
  isMuted: boolean;
  isShipNearHUD?: boolean;
  onTogglePause: () => void;
  onToggleMute: () => void;
  onOpenSettings: () => void;
  onOpenLeaderboard: () => void;
  onOpenAchievements: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

export const HUD: React.FC<HUDProps> = ({
  score,
  highScore,
  wave,
  lives,
  mode,
  empCount,
  empRechargeProgress = 1,
  hyperspaceCooldown,
  hullPower = 100,
  maxHullPower = 100,
  activePowerups,
  isPaused,
  isMuted,
  isShipNearHUD = false,
  onTogglePause,
  onToggleMute,
  onOpenSettings,
  onOpenLeaderboard,
  onOpenAchievements,
  isFullscreen,
  onToggleFullscreen
}) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const isFaded = isShipNearHUD || isHovered;

  return (
    <div className="absolute top-0 left-0 w-full p-3 md:p-5 pointer-events-none flex flex-col justify-between h-full z-20 select-none">
      {/* Top Header Row */}
      <div className="flex justify-between items-start gap-3">
        {/* Left Stats Panel */}
        <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`bg-[#0A0F19]/40 backdrop-blur-sm border border-[#30363D]/60 rounded-lg p-3 pointer-events-auto min-w-[170px] shadow-lg transition-all duration-300 ${
            isFaded ? 'opacity-20 hover:opacity-100' : 'opacity-100'
          }`}
        >
          <div className="text-[10px] font-mono font-bold text-[#8B949E] tracking-widest uppercase">SCORE</div>
          <div className="text-2xl md:text-3xl font-extrabold text-[#E6EDF3] tracking-wider font-mono mt-0.5">
            {score.toLocaleString()}
          </div>

          <div className="flex items-center gap-4 mt-2 pt-1 border-t border-[#30363D]">
            <div>
              <div className="text-[10px] font-mono text-[#8B949E]">WAVE</div>
              <div className="text-sm font-mono font-bold text-[#58A6FF]">{wave}</div>
            </div>
            <div>
              <div className="text-[10px] font-mono text-[#8B949E]">MODE</div>
              <div className="text-xs font-mono font-bold text-[#3FB950] uppercase">
                 {mode === 'wave_10_boss' ? 'CORE SEVERANCE' : mode.replace('_', ' ')}
              </div>
            </div>
          </div>

          {/* Reserve Ships Indicator */}
          {mode !== 'zen' && (
            <div className="flex items-center gap-2 mt-2 pt-1.5 border-t border-[#30363D]">
              <div className="flex flex-col">
                <span className="text-[10px] font-mono text-[#8B949E] font-bold">RESERVE SHIPS:</span>
                <span className="text-[9px] font-mono text-[#38bdf8] font-bold">{Math.max(0, lives - 1)} EXTRA ({lives} TOTAL)</span>
              </div>
              <div className="flex gap-1.5 items-center ml-1">
                {Array.from({ length: Math.max(0, lives - 1) }).map((_, i) => (
                  <div key={i} className="flex items-center justify-center p-1.5 bg-[#0D1117] border border-[#30363D] rounded-md shadow-md hover:border-[#38bdf8] transition-colors">
                    <svg className="w-6 h-6 -rotate-90 drop-shadow-[0_0_8px_rgba(56,189,248,0.85)]" viewBox="-22 -27 52 54" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <linearGradient id={`shipGradHUD-${i}`} x1="28" y1="0" x2="-20" y2="0" gradientUnits="userSpaceOnUse">
                          <stop offset="0%" stopColor="#f8fafc" />
                          <stop offset="25%" stopColor="#38bdf8" />
                          <stop offset="65%" stopColor="#0f172a" />
                          <stop offset="100%" stopColor="#020617" />
                        </linearGradient>
                      </defs>
                      {/* Rear Engine Plasma Thruster Nodes */}
                      <circle cx="-16" cy="-8" r="2" fill="#00ffff" />
                      <circle cx="-16" cy="8" r="2" fill="#00ffff" />

                      {/* Main Forward-Swept Wing Starfighter Hull */}
                      <path
                        d="M28 0 L14 -6 L10 -12 L-4 -25 L-8 -12 L-20 -15 L-16 -6 L-18 0 L-16 6 L-20 15 L-8 12 L-4 25 L10 12 L14 6 Z"
                        fill={`url(#shipGradHUD-${i})`}
                        stroke="#00f0ff"
                        strokeWidth="1.8"
                        strokeLinejoin="round"
                      />

                      {/* Cockpit Glass Canopy */}
                      <path
                        d="M16 0 L6 -4 L-2 0 L6 4 Z"
                        fill="#00ffff"
                        stroke="#38bdf8"
                        strokeWidth="1"
                      />
                    </svg>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Vessel Health / Hull Bar */}
          <div className="mt-2 pt-1.5 border-t border-[#30363D]">
            <div className="flex justify-between items-center text-[10px] font-mono mb-1">
              <span className="text-[#8B949E] font-bold">SHIP HULL</span>
              <span
                className={`font-bold font-mono ${
                  hullPower > 50
                    ? 'text-[#3FB950]'
                    : hullPower > 25
                    ? 'text-[#D29922]'
                    : 'text-[#F85149] animate-pulse'
                }`}
              >
                {Math.round(hullPower)}%
                {hullPower < maxHullPower && (
                  <span className="text-[#388BFD] text-[9px] ml-1 font-semibold">+REGEN</span>
                )}
              </span>
            </div>
            <div className="w-full bg-[#161B22] border border-[#30363D] h-2.5 rounded-full overflow-hidden p-[1px] shadow-inner">
              <div
                className={`h-full rounded-full transition-all duration-200 ${
                  hullPower > 50
                    ? 'bg-[#3FB950] shadow-[0_0_8px_rgba(63,185,80,0.6)]'
                    : hullPower > 25
                    ? 'bg-[#D29922] shadow-[0_0_8px_rgba(210,153,34,0.6)]'
                    : 'bg-[#F85149] shadow-[0_0_8px_rgba(248,81,73,0.8)]'
                }`}
                style={{ width: `${Math.max(0, Math.min(100, hullPower))}%` }}
              />
            </div>
          </div>
        </div>

        {/* Center Active Powerups Status Badges */}
        <div className="hidden sm:flex flex-col items-center gap-1.5">
          {activePowerups.golden !== undefined && activePowerups.golden > 0 && (
            <div className="bg-[#161B22]/95 border border-[#D29922] text-[#D29922] text-xs font-mono font-bold px-3 py-1 rounded-md backdrop-blur-md flex items-center gap-2 shadow-md">
              <Sparkles className="w-3.5 h-3.5 text-[#D29922]" />
              <span>GOLDEN CORE ({Math.ceil(activePowerups.golden / 60)}s)</span>
            </div>
          )}
          {activePowerups.shield !== undefined && activePowerups.shield > 0 && (
            <div className="bg-[#161B22]/95 border border-[#58A6FF] text-[#58A6FF] text-xs font-mono font-bold px-3 py-1 rounded-md backdrop-blur-md flex items-center gap-2 shadow-md">
              <Shield className="w-3.5 h-3.5 text-[#58A6FF]" />
              <span>Force Shield ({Math.ceil(activePowerups.shield / 60)}s)</span>
            </div>
          )}
          {activePowerups.tripleShot !== undefined && activePowerups.tripleShot > 0 && (
            <div className="bg-[#161B22]/95 border border-[#3FB950] text-[#3FB950] text-xs font-mono font-bold px-3 py-1 rounded-md backdrop-blur-md flex items-center gap-2 shadow-md">
              <Zap className="w-3.5 h-3.5 text-[#3FB950]" />
              <span>Triple Shot ({Math.ceil(activePowerups.tripleShot / 60)}s)</span>
            </div>
          )}
          {activePowerups.laser !== undefined && activePowerups.laser > 0 && (
            <div className="bg-[#161B22]/95 border border-[#F85149] text-[#F85149] text-xs font-mono font-bold px-3 py-1 rounded-md backdrop-blur-md flex items-center gap-2 shadow-md">
              <Target className="w-3.5 h-3.5 text-[#F85149]" />
              <span>Laser Beam ({Math.ceil(activePowerups.laser / 60)}s)</span>
            </div>
          )}
          {activePowerups.drone !== undefined && activePowerups.drone > 0 && (
            <div className="bg-[#161B22]/95 border border-[#A371F7] text-[#A371F7] text-xs font-mono font-bold px-3 py-1 rounded-md backdrop-blur-md flex items-center gap-2 shadow-md">
              <Sparkles className="w-3.5 h-3.5 text-[#A371F7]" />
              <span>Defense Drone ({Math.ceil(activePowerups.drone / 60)}s)</span>
            </div>
          )}
          {activePowerups.magnet !== undefined && activePowerups.magnet > 0 && (
            <div className="bg-[#161B22]/95 border border-[#00E5FF] text-[#00E5FF] text-xs font-mono font-bold px-3 py-1 rounded-md backdrop-blur-md flex items-center gap-2 shadow-md">
              <Zap className="w-3.5 h-3.5 text-[#00E5FF]" />
              <span>Gravity Magnet ({Math.ceil(activePowerups.magnet / 60)}s)</span>
            </div>
          )}
          {activePowerups.timewarp !== undefined && activePowerups.timewarp > 0 && (
            <div className="bg-[#161B22]/95 border border-[#38bdf8] text-[#38bdf8] text-xs font-mono font-bold px-3 py-1 rounded-md backdrop-blur-md flex items-center gap-2 shadow-md animate-pulse">
              <Sparkles className="w-3.5 h-3.5 text-[#38bdf8]" />
              <span>Chrono Stasis ({Math.ceil(activePowerups.timewarp / 60)}s)</span>
            </div>
          )}
          {activePowerups.repulsor !== undefined && activePowerups.repulsor > 0 && (
            <div className="bg-[#161B22]/95 border border-[#39ff14] text-[#39ff14] text-xs font-mono font-bold px-3 py-1 rounded-md backdrop-blur-md flex items-center gap-2 shadow-md">
              <Shield className="w-3.5 h-3.5 text-[#39ff14]" />
              <span>Kinetic Repulsor ({Math.ceil(activePowerups.repulsor / 60)}s)</span>
            </div>
          )}
        </div>

        {/* Right Actions & High Score Panel */}
        <div className="flex flex-col items-end gap-2 pointer-events-auto">
          {/* Action Toolbar */}
          <div className="flex items-center gap-1.5 bg-[#0D1117]/90 backdrop-blur-md border border-[#30363D] rounded-lg p-1 shadow-md">
            <button
              tabIndex={-1}
              onFocus={(e) => e.currentTarget.blur()}
              onClick={(e) => {
                e.currentTarget.blur();
                onToggleMute();
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-bold rounded transition-all border outline-none ${
                isMuted
                  ? 'bg-[#F85149]/15 border-[#F85149] text-[#F85149]'
                  : 'bg-[#3FB950]/15 border-[#3FB950] text-[#3FB950]'
              }`}
              title="Toggle Audio (Press M Key anytime)"
            >
              {isMuted ? (
                <>
                  <VolumeX className="w-4 h-4 text-[#F85149]" />
                  <span>SOUND OFF [M]</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 text-[#3FB950]" />
                  <span>SOUND ON [M]</span>
                </>
              )}
            </button>
            <button
              tabIndex={-1}
              onFocus={(e) => e.currentTarget.blur()}
              onClick={(e) => {
                e.currentTarget.blur();
                onTogglePause();
              }}
              className="p-1.5 text-[#8B949E] hover:text-[#E6EDF3] hover:bg-[#21262D] rounded transition-colors outline-none"
              title={isPaused ? 'Resume Game (P / Esc)' : 'Pause Game (P / Esc)'}
            >
              {isPaused ? <Play className="w-4 h-4 text-[#58A6FF]" /> : <Pause className="w-4 h-4" />}
            </button>
            <button
              tabIndex={-1}
              onFocus={(e) => e.currentTarget.blur()}
              onClick={(e) => {
                e.currentTarget.blur();
                onOpenLeaderboard();
              }}
              className="p-1.5 text-[#8B949E] hover:text-[#D29922] hover:bg-[#21262D] rounded transition-colors outline-none"
              title="High Scores & Stats"
            >
              <Trophy className="w-4 h-4 text-[#D29922]" />
            </button>
            <button
              onClick={onOpenAchievements}
              className="p-1.5 text-[#8B949E] hover:text-[#A371F7] hover:bg-[#21262D] rounded transition-colors"
              title="Achievements"
            >
              <Award className="w-4 h-4 text-[#A371F7]" />
            </button>
            <button
              onClick={onOpenSettings}
              className="p-1.5 text-[#8B949E] hover:text-[#E6EDF3] hover:bg-[#21262D] rounded transition-colors"
              title="Settings & Controls"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.currentTarget.blur();
                onToggleFullscreen();
              }}
              className="p-1.5 text-[#8B949E] hover:text-[#E6EDF3] hover:bg-[#21262D] rounded transition-colors outline-none"
              title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            >
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </button>
          </div>

          {/* High Score Badge */}
          <div className="bg-[#0D1117]/90 backdrop-blur-md border border-[#30363D] rounded-lg px-3 py-1.5 text-right shadow-md">
            <div className="text-[10px] font-mono font-bold text-[#D29922] tracking-wider">HIGH SCORE</div>
            <div className="text-sm font-bold text-[#E6EDF3] font-mono mt-0.5">{highScore.toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* Bottom Bar: EMP Bomb & Hyperspace Cooldown Prominent Cards */}
      <div className="flex justify-between items-end flex-wrap gap-3">
        {/* EMP & Hyperspace status cards */}
        <div className="flex flex-col sm:flex-row gap-2.5 pointer-events-auto">
          {/* EMP Bomb Card */}
          <div
            onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'e' }))}
            className={`flex flex-col gap-1.5 bg-[#0D1117]/95 backdrop-blur-md border rounded-xl p-2.5 min-w-[200px] transition-all cursor-pointer shadow-lg hover:scale-[1.02] active:scale-[0.98] ${
              empCount > 0
                ? 'border-[#D29922] shadow-[0_0_12px_rgba(210,153,34,0.25)]'
                : 'border-[#30363D]'
            }`}
            title="Click or Press [E] to trigger EMP Shockwave. Clears all bullets & breaks nearby asteroids."
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-lg ${empCount > 0 ? 'bg-[#D29922]/20 text-[#D29922]' : 'bg-[#21262D] text-[#8B949E]'}`}>
                  <Bomb className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] font-mono font-bold text-[#E6EDF3] flex items-center gap-1.5">
                    <span>EMP BOMB</span>
                    <span className="bg-[#D29922]/20 text-[#D29922] text-[9px] px-1 py-0.2 rounded border border-[#D29922]/40 font-mono">KEY [E] / [B]</span>
                  </div>
                  <div className="text-[9px] font-mono text-[#8B949E]">Clears bullets & asteroids</div>
                </div>
              </div>
            </div>

            {/* Charge Indicators & Auto-Recharge Progress Bar */}
            <div className="mt-0.5">
              <div className="flex justify-between items-center text-[10px] font-mono mb-1">
                <div className="flex gap-1 items-center">
                  {[1, 2, 3].map((slot) => (
                    <span
                      key={slot}
                      className={`text-xs ${
                        slot <= empCount ? 'text-[#D29922] filter drop-shadow-[0_0_4px_#D29922]' : 'text-[#30363D]'
                      }`}
                    >
                      ⚡
                    </span>
                  ))}
                  <span className="text-[#E6EDF3] font-bold ml-1 text-[11px]">{empCount} / 3</span>
                </div>
                <span className="text-[#8B949E] text-[9px]">
                  {empCount >= 3 ? 'MAX CHARGED' : `Recharging (${Math.ceil((1 - empRechargeProgress) * 60)}s)`}
                </span>
              </div>

              {/* Recharge fill bar */}
              <div className="w-full bg-[#161B22] border border-[#30363D] h-2 rounded-full overflow-hidden p-[1px]">
                <div
                  className={`h-full rounded-full transition-all duration-150 ${
                    empCount >= 3
                      ? 'bg-[#D29922]'
                      : 'bg-gradient-to-r from-[#388BFD] to-[#D29922] animate-pulse'
                  }`}
                  style={{ width: empCount >= 3 ? '100%' : `${Math.round(empRechargeProgress * 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Hyperspace Warp Status Card */}
          <div
            onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'r' }))}
            className={`flex flex-col gap-1.5 bg-[#0D1117]/95 backdrop-blur-md border rounded-xl p-2.5 min-w-[200px] transition-all cursor-pointer shadow-lg hover:scale-[1.02] active:scale-[0.98] ${
              hyperspaceCooldown <= 0
                ? 'border-[#58A6FF] shadow-[0_0_12px_rgba(88,166,255,0.25)]'
                : 'border-[#30363D]'
            }`}
            title="Click or Press [R] to teleport to a safe random location."
          >
            <div className="flex items-center gap-2">
              <div className={`p-1.5 rounded-lg ${hyperspaceCooldown <= 0 ? 'bg-[#58A6FF]/20 text-[#58A6FF]' : 'bg-[#21262D] text-[#8B949E]'}`}>
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[11px] font-mono font-bold text-[#E6EDF3] flex items-center gap-1.5">
                  <span>HYPERSPACE WARP</span>
                  <span className="bg-[#58A6FF]/20 text-[#58A6FF] text-[9px] px-1 py-0.2 rounded border border-[#58A6FF]/40 font-mono">KEY [R] / SHIFT</span>
                </div>
                <div className="text-[9px] font-mono text-[#8B949E]">Emergency Teleport</div>
              </div>
            </div>

            {/* Cooldown progress bar */}
            <div className="mt-0.5">
              <div className="flex justify-between items-center text-[10px] font-mono mb-1">
                <span className="text-[#8B949E]">STATUS</span>
                <span className={`font-bold ${hyperspaceCooldown <= 0 ? 'text-[#58A6FF] animate-pulse' : 'text-[#8B949E]'}`}>
                  {hyperspaceCooldown <= 0 ? 'READY TO WARP' : `COOLDOWN (${(hyperspaceCooldown / 60).toFixed(1)}s)`}
                </span>
              </div>
              <div className="w-full bg-[#161B22] border border-[#30363D] h-2 rounded-full overflow-hidden p-[1px]">
                <div
                  className={`h-full rounded-full transition-all duration-100 ${
                    hyperspaceCooldown <= 0 ? 'bg-[#58A6FF]' : 'bg-[#30363D]'
                  }`}
                  style={{
                    width: hyperspaceCooldown <= 0 ? '100%' : `${Math.round(((300 - hyperspaceCooldown) / 300) * 100)}%`
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Controls & 1UP Milestone Info */}
        <div className="hidden lg:block text-right bg-[#0D1117]/80 backdrop-blur-sm border border-[#30363D] rounded-xl p-2.5 text-[10px] font-mono text-[#8B949E] max-w-xs shadow-md">
          <div className="text-[#E6EDF3] font-bold mb-0.5 text-[11px]">🚀 STARFIGHTER TACTICS</div>
          <div>• <span className="text-[#38BDF8]">FIRE GUN [SPACE / Click]</span> primary weapons.</div>
          <div>• <span className="text-[#D29922]">EMP BOMB [B]</span> shockwave clears bullets (+1/60s).</div>
          <div>• <span className="text-[#58A6FF]">WARP [Shift]</span> emergency teleport jump.</div>
          <div>• <span className="text-[#3FB950]">SOUND [M]</span> toggle audio on/off anytime.</div>
        </div>
      </div>
    </div>
  );
};
