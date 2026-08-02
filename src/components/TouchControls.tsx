import React, { useRef, useEffect } from 'react';
import { ArrowUp, RotateCcw, RotateCw, Bomb, Zap, Target } from 'lucide-react';

interface TouchControlsProps {
  onThrustStart: () => void;
  onThrustEnd: () => void;
  onReverseStart: () => void;
  onReverseEnd: () => void;
  onTurnLeftStart: () => void;
  onTurnLeftEnd: () => void;
  onTurnRightStart: () => void;
  onTurnRightEnd: () => void;
  onFire: () => void;
  onEMP: () => void;
  onHyperspace: () => void;
  empCount: number;
  hyperspaceReady: boolean;
}

export const TouchControls: React.FC<TouchControlsProps> = ({
  onThrustStart,
  onThrustEnd,
  onReverseStart,
  onReverseEnd,
  onTurnLeftStart,
  onTurnLeftEnd,
  onTurnRightStart,
  onTurnRightEnd,
  onFire,
  onEMP,
  onHyperspace,
  empCount,
  hyperspaceReady,
}) => {
  return (
    <div className="md:hidden absolute bottom-4 left-0 right-0 p-4 flex justify-between items-end pointer-events-none z-30 select-none">
      {/* Direction & Movement Cluster */}
      <div className="flex flex-col gap-2 pointer-events-auto">
        <div className="flex gap-2 justify-center">
          <button
            onTouchStart={(e) => { e.preventDefault(); onThrustStart(); }}
            onTouchEnd={(e) => { e.preventDefault(); onThrustEnd(); }}
            onMouseDown={onThrustStart}
            onMouseUp={onThrustEnd}
            className="w-14 h-14 bg-[#1F6FEB]/30 active:bg-[#1F6FEB]/70 border border-[#1F6FEB] rounded-xl flex items-center justify-center text-[#E6EDF3] shadow-md backdrop-blur-md transition-all active:scale-95"
            aria-label="Thrust"
          >
            <ArrowUp className="w-7 h-7 text-[#58A6FF]" />
          </button>
        </div>
        <div className="flex gap-2">
          <button
            onTouchStart={(e) => { e.preventDefault(); onTurnLeftStart(); }}
            onTouchEnd={(e) => { e.preventDefault(); onTurnLeftEnd(); }}
            onMouseDown={onTurnLeftStart}
            onMouseUp={onTurnLeftEnd}
            className="w-12 h-12 bg-[#161B22]/80 active:bg-[#21262D] border border-[#30363D] rounded-xl flex items-center justify-center text-[#E6EDF3] backdrop-blur-md active:scale-95 transition-all"
            aria-label="Rotate Left"
          >
            <RotateCcw className="w-5 h-5 text-[#8B949E]" />
          </button>
          <button
            onTouchStart={(e) => { e.preventDefault(); onReverseStart(); }}
            onTouchEnd={(e) => { e.preventDefault(); onReverseEnd(); }}
            onMouseDown={onReverseStart}
            onMouseUp={onReverseEnd}
            className="w-12 h-12 bg-[#161B22]/80 active:bg-[#21262D] border border-[#30363D] rounded-xl flex items-center justify-center text-[#E6EDF3] backdrop-blur-md active:scale-95 transition-all"
            aria-label="Reverse"
          >
            <ArrowUp className="w-5 h-5 text-[#8B949E] rotate-180" />
          </button>
          <button
            onTouchStart={(e) => { e.preventDefault(); onTurnRightStart(); }}
            onTouchEnd={(e) => { e.preventDefault(); onTurnRightEnd(); }}
            onMouseDown={onTurnRightStart}
            onMouseUp={onTurnRightEnd}
            className="w-12 h-12 bg-[#161B22]/80 active:bg-[#21262D] border border-[#30363D] rounded-xl flex items-center justify-center text-[#E6EDF3] backdrop-blur-md active:scale-95 transition-all"
            aria-label="Rotate Right"
          >
            <RotateCw className="w-5 h-5 text-[#8B949E]" />
          </button>
        </div>
      </div>

      {/* Special Actions & Fire Cluster */}
      <div className="flex flex-col items-end gap-2.5 pointer-events-auto">
        <div className="flex items-center gap-2">
          {/* EMP Bomb Button */}
          <button
            onClick={onEMP}
            disabled={empCount <= 0}
            className={`w-11 h-11 rounded-xl border flex items-center justify-center text-white backdrop-blur-md active:scale-95 transition-all ${
              empCount > 0
                ? 'bg-[#161B22] border-[#D29922] active:bg-[#D29922]/20'
                : 'bg-[#0D1117] border-[#30363D] opacity-40'
            }`}
            aria-label="EMP Bomb"
          >
            <Bomb className="w-5 h-5 text-[#D29922]" />
          </button>

          {/* Hyperspace Button */}
          <button
            onClick={onHyperspace}
            disabled={!hyperspaceReady}
            className={`w-11 h-11 rounded-xl border flex items-center justify-center text-white backdrop-blur-md active:scale-95 transition-all ${
              hyperspaceReady
                ? 'bg-[#161B22] border-[#58A6FF] active:bg-[#58A6FF]/20'
                : 'bg-[#0D1117] border-[#30363D] opacity-40'
            }`}
            aria-label="Hyperspace Jump"
          >
            <Zap className="w-5 h-5 text-[#58A6FF]" />
          </button>
        </div>

        {/* Primary Fire Button */}
        <button
          onTouchStart={(e) => { e.preventDefault(); onFire(); }}
          onClick={onFire}
          className="w-16 h-16 bg-[#F85149]/40 active:bg-[#F85149]/80 border-2 border-[#F85149] rounded-full flex items-center justify-center text-white backdrop-blur-md active:scale-95 transition-all"
          aria-label="Fire Lasers"
        >
          <Target className="w-8 h-8 text-[#E6EDF3]" />
        </button>
      </div>
    </div>
  );
};
