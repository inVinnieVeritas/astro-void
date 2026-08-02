import React, { useEffect } from 'react';
import { Trophy, RotateCcw, Award } from 'lucide-react';

interface GameOverModalProps {
  score: number;
  highScore: number;
  isNewHighScore: boolean;
  wave: number;
  asteroidsDestroyed: number;
  accuracy: number;
  onRestart: () => void;
  onOpenLeaderboard: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  score,
  highScore,
  isNewHighScore,
  wave,
  asteroidsDestroyed,
  accuracy,
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
  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm select-none animate-fade-in">
      <div className="bg-[#161B22] border-2 border-[#F85149] rounded-xl max-w-md w-full p-6 text-center shadow-2xl">
        {/* Game Over Header */}
        <div className="text-3xl font-extrabold text-[#F85149] tracking-widest font-mono mb-0.5">
          GAME OVER
        </div>
        <div className="text-[11px] font-mono text-[#8B949E] tracking-wider uppercase mb-5">
          COMMAND VESSEL DESTROYED
        </div>

        {/* New High Score Celebratory Banner */}
        {isNewHighScore && (
          <div className="mb-5 py-2 px-3 bg-[#D29922]/15 border border-[#D29922]/60 rounded-lg text-[#D29922] font-mono font-bold text-xs flex items-center justify-center gap-2">
            <Trophy className="w-4 h-4 text-[#D29922]" />
            <span>NEW HIGH SCORE RECORD!</span>
          </div>
        )}

        {/* Final Score display */}
        <div className="bg-[#0D1117] border border-[#30363D] rounded-lg p-3.5 mb-5">
          <div className="text-[10px] font-mono font-bold text-[#8B949E] tracking-wider uppercase">FINAL SCORE</div>
          <div className="text-3xl font-black text-[#E6EDF3] font-mono tracking-wider mt-0.5">
            {score.toLocaleString()}
          </div>
          <div className="text-xs font-mono text-[#D29922] mt-1.5 font-medium">
            Best Record: {highScore.toLocaleString()}
          </div>
        </div>

        {/* Match Statistics */}
        <div className="grid grid-cols-3 gap-2 mb-5 font-mono">
          <div className="bg-[#0D1117] p-2 rounded-lg border border-[#30363D]">
            <div className="text-[10px] text-[#8B949E] font-semibold uppercase">WAVE</div>
            <div className="text-sm font-bold text-[#58A6FF] mt-0.5">{wave}</div>
          </div>
          <div className="bg-[#0D1117] p-2 rounded-lg border border-[#30363D]">
            <div className="text-[10px] text-[#8B949E] font-semibold uppercase">DESTROYED</div>
            <div className="text-sm font-bold text-[#E6EDF3] mt-0.5">{asteroidsDestroyed}</div>
          </div>
          <div className="bg-[#0D1117] p-2 rounded-lg border border-[#30363D]">
            <div className="text-[10px] text-[#8B949E] font-semibold uppercase">ACCURACY</div>
            <div className="text-sm font-bold text-[#3FB950] mt-0.5">{accuracy}%</div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-2.5 font-mono">
          <button
            onClick={onRestart}
            className="w-full py-3 bg-[#238636] hover:bg-[#2ea043] active:scale-98 text-white font-extrabold text-sm rounded-lg transition-all border border-[#2ea043]/50 flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>PLAY AGAIN</span>
          </button>

          <button
            onClick={onOpenLeaderboard}
            className="w-full py-2 bg-[#21262D] hover:bg-[#30363D] border border-[#30363D] text-[#E6EDF3] font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-2"
          >
            <Trophy className="w-3.5 h-3.5 text-[#D29922]" />
            <span>VIEW LEADERBOARD</span>
          </button>
        </div>

        <div className="text-[10px] font-mono text-[#8B949E] mt-4">
          Press <kbd className="px-1 py-0.5 bg-[#21262D] rounded text-[#E6EDF3] border border-[#30363D]">SPACE</kbd> or <kbd className="px-1 py-0.5 bg-[#21262D] rounded text-[#E6EDF3] border border-[#30363D]">ENTER</kbd> to restart
        </div>
      </div>
    </div>
  );
};
