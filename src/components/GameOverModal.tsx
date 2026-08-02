import React, { useEffect } from 'react';
import { Trophy, RotateCcw, Award } from 'lucide-react';

interface GameOverModalProps {
  score: number;
  highScore: number;
  isNewHighScore: boolean;
  wave: number;
  asteroidsDestroyed: number;
  ufosDestroyed: number;
  accuracy: number;
  maxCombo: number;
  bossDamageDealt: number;
  onRestart: () => void;
  onOpenLeaderboard: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  score,
  highScore,
  isNewHighScore,
  wave,
  asteroidsDestroyed,
  ufosDestroyed,
  accuracy,
  maxCombo,
  bossDamageDealt,
  onRestart,
  onOpenLeaderboard
}) => {
  // Support keyboard restart without using mouse
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === ' ' ||
        e.key === 'Enter' ||
        e.key === 'w' ||
        e.key === 'W' ||
        e.key === 'ArrowUp'
      ) {
        e.preventDefault();
        onRestart();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onRestart]);

  // Motivational messaging & best moment highlight
  let motivationalTitle = "MISSION TERMINATED";
  let motivationalSub = "Command vessel destroyed. Review your combat telemetry below.";
  let badgeColor = "border-[#30363D] bg-[#0D1117] text-[#8B949E]";

  if (isNewHighScore) {
    motivationalTitle = "🌟 LEGENDARY NEW HIGH SCORE!";
    motivationalSub = "Absolute mastery of the void! Your name is etched in elite piloting history.";
    badgeColor = "border-[#D29922]/60 bg-[#D29922]/15 text-[#D29922]";
  } else if (wave % 5 === 4) {
    motivationalTitle = `🔥 SO CLOSE TO WAVE ${wave + 1} (BOSS)!`;
    motivationalSub = `You were just 1 sector away from confronting the Dreadnought Boss. Push further next run!`;
    badgeColor = "border-[#F85149]/60 bg-[#F85149]/15 text-[#F85149]";
  } else if (bossDamageDealt > 0) {
    motivationalTitle = "💥 DREADNOUGHT VETERAN";
    motivationalSub = `You landed heavy strikes dealing ${bossDamageDealt.toLocaleString()} DMG against the Dreadnought Core!`;
    badgeColor = "border-[#58A6FF]/60 bg-[#58A6FF]/15 text-[#58A6FF]";
  } else if (maxCombo >= 8) {
    motivationalTitle = `⚡ COMBO VIRTUOSO (${maxCombo}x STREAK)`;
    motivationalSub = `Exceptional target chaining and reflexes displayed across the sector.`;
    badgeColor = "border-[#3FB950]/60 bg-[#3FB950]/15 text-[#3FB950]";
  }

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm select-none animate-fade-in">
      <div className="bg-[#161B22] border-2 border-[#F85149] rounded-xl max-w-lg w-full p-6 text-center shadow-2xl font-mono">
        {/* Game Over Header */}
        <div className="text-3xl font-extrabold text-[#F85149] tracking-widest mb-0.5">
          GAME OVER
        </div>
        <div className="text-[11px] text-[#8B949E] tracking-wider uppercase mb-4">
          VESSEL INTEGRITY COLLAPSED
        </div>

        {/* Motivational Banner */}
        <div className={`mb-4 py-2.5 px-3.5 border rounded-lg text-xs font-bold flex items-center justify-center gap-2.5 ${badgeColor}`}>
          <Award className="w-4 h-4 shrink-0" />
          <div className="text-left">
            <div className="tracking-wide">{motivationalTitle}</div>
            <div className="text-[10px] opacity-80 font-normal mt-0.5">{motivationalSub}</div>
          </div>
        </div>

        {/* Final Score display */}
        <div className="bg-[#0D1117] border border-[#30363D] rounded-lg p-3.5 mb-4">
          <div className="text-[10px] font-bold text-[#8B949E] tracking-wider uppercase">FINAL SCORE</div>
          <div className="text-3xl font-black text-[#E6EDF3] tracking-wider mt-0.5">
            {score.toLocaleString()}
          </div>
          <div className="text-xs text-[#D29922] mt-1 font-medium">
            Personal Best: {highScore.toLocaleString()}
          </div>
        </div>

        {/* Match Statistics Grid */}
        <div className="grid grid-cols-3 gap-2 mb-5">
          <div className="bg-[#0D1117] p-2.5 rounded-lg border border-[#30363D]">
            <div className="text-[9px] text-[#8B949E] font-semibold uppercase">WAVE</div>
            <div className="text-sm font-bold text-[#58A6FF] mt-0.5">{wave}</div>
          </div>
          <div className="bg-[#0D1117] p-2.5 rounded-lg border border-[#30363D]">
            <div className="text-[9px] text-[#8B949E] font-semibold uppercase">MAX COMBO</div>
            <div className="text-sm font-bold text-[#3FB950] mt-0.5">{maxCombo}x</div>
          </div>
          <div className="bg-[#0D1117] p-2.5 rounded-lg border border-[#30363D]">
            <div className="text-[9px] text-[#8B949E] font-semibold uppercase">ACCURACY</div>
            <div className="text-sm font-bold text-[#38bdf8] mt-0.5">{accuracy}%</div>
          </div>
          <div className="bg-[#0D1117] p-2.5 rounded-lg border border-[#30363D]">
            <div className="text-[9px] text-[#8B949E] font-semibold uppercase">ASTEROIDS</div>
            <div className="text-sm font-bold text-[#E6EDF3] mt-0.5">{asteroidsDestroyed}</div>
          </div>
          <div className="bg-[#0D1117] p-2.5 rounded-lg border border-[#30363D]">
            <div className="text-[9px] text-[#8B949E] font-semibold uppercase">UFOS DESTROYED</div>
            <div className="text-sm font-bold text-[#a855f7] mt-0.5">{ufosDestroyed}</div>
          </div>
          <div className="bg-[#0D1117] p-2.5 rounded-lg border border-[#30363D]">
            <div className="text-[9px] text-[#8B949E] font-semibold uppercase">BOSS DAMAGE</div>
            <div className="text-sm font-bold text-[#ff0055] mt-0.5">{bossDamageDealt > 0 ? bossDamageDealt.toLocaleString() : '0'}</div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-2.5">
          <button
            onClick={onRestart}
            className="w-full py-3 bg-[#238636] hover:bg-[#2ea043] active:scale-98 text-white font-extrabold text-sm rounded-lg transition-all border border-[#2ea043]/50 flex items-center justify-center gap-2 shadow-lg shadow-[#238636]/20"
          >
            <RotateCcw className="w-4 h-4" />
            <span>PLAY AGAIN</span>
          </button>

          <button
            onClick={onOpenLeaderboard}
            className="w-full py-2.5 bg-[#21262D] hover:bg-[#30363D] border border-[#30363D] text-[#E6EDF3] font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-2"
          >
            <Trophy className="w-3.5 h-3.5 text-[#D29922]" />
            <span>VIEW LEADERBOARD</span>
          </button>
        </div>

        <div className="text-[10px] text-[#8B949E] mt-4">
          Press <kbd className="px-1.5 py-0.5 bg-[#21262D] rounded text-[#E6EDF3] border border-[#30363D]">SPACE</kbd> or <kbd className="px-1.5 py-0.5 bg-[#21262D] rounded text-[#E6EDF3] border border-[#30363D]">ENTER</kbd> to launch new run
        </div>
      </div>
    </div>
  );
};
