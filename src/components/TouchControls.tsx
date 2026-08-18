import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Target, Bomb, Zap } from 'lucide-react';

interface TouchControlsProps {
  onFire: () => void;
  onEMP: () => void;
  onHyperspace: () => void;
  empCount: number;
  hyperspaceReady: boolean;
  isPaused: boolean;
  onThrustStart?: () => void;
  onThrustEnd?: () => void;
  onReverseStart?: () => void;
  onReverseEnd?: () => void;
  onTurnLeftStart?: () => void;
  onTurnLeftEnd?: () => void;
  onTurnRightStart?: () => void;
  onTurnRightEnd?: () => void;
}

export const TouchControls: React.FC<TouchControlsProps> = ({
  onFire,
  onEMP,
  onHyperspace,
  empCount,
  hyperspaceReady,
  isPaused,
}) => {
  const joystickBaseRef = useRef<HTMLDivElement>(null);
  const joystickKnobRef = useRef<HTMLDivElement>(null);
  const activePointerIdRef = useRef<number | null>(null);
  const activeTouchIdRef = useRef<number | null>(null);
  const [knobPos, setKnobPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isJoystickActive, setIsJoystickActive] = useState(false);
  const fireIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const dispatchJoystick = useCallback((active: boolean, angle: number, distance: number) => {
    window.dispatchEvent(
      new CustomEvent('asteroids:joystick', {
        detail: { active, angle, distance }
      })
    );
  }, []);

  const handlePointerMove = useCallback((clientX: number, clientY: number) => {
    if (!joystickBaseRef.current) return;
    const rect = joystickBaseRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const baseDiameter = joystickBaseRef.current.clientWidth;
    const knobDiameter = joystickKnobRef.current ? joystickKnobRef.current.offsetWidth : 44;
    const maxRadius = baseDiameter / 2 - knobDiameter / 2;
    const deadzoneRadius = maxRadius * 0.20;

    const dx = clientX - centerX;
    const dy = clientY - centerY;
    const dist = Math.hypot(dx, dy);
    const angle = Math.atan2(dy, dx);

    const clampedDist = Math.min(dist, maxRadius);
    const knobX = Math.cos(angle) * clampedDist;
    const knobY = Math.sin(angle) * clampedDist;

    setKnobPos({ x: knobX, y: knobY });

    if (clampedDist < deadzoneRadius) {
      // Inside deadzone: visual feedback on knob, but zero movement dispatched to ship
      setIsJoystickActive(false);
      dispatchJoystick(false, angle, 0);
    } else {
      setIsJoystickActive(true);
      // Rescale distance smoothly from 0.0 to 1.0 outside deadzone
      const normDist = (clampedDist - deadzoneRadius) / (maxRadius - deadzoneRadius);
      dispatchJoystick(true, angle, normDist);
    }
  }, [dispatchJoystick]);

  const resetJoystickInput = useCallback(() => {
    activePointerIdRef.current = null;
    activeTouchIdRef.current = null;
    setKnobPos({ x: 0, y: 0 });
    setIsJoystickActive(false);
    dispatchJoystick(false, 0, 0);
  }, [dispatchJoystick]);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'touch') return;
    if (isPaused || activePointerIdRef.current !== null) return;
    activePointerIdRef.current = e.pointerId;
    e.currentTarget.setPointerCapture(e.pointerId);
    handlePointerMove(e.clientX, e.clientY);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'touch') return;
    if (isPaused || activePointerIdRef.current !== e.pointerId) return;
    handlePointerMove(e.clientX, e.clientY);
  };

  const onPointerUpOrCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'touch') return;
    if (activePointerIdRef.current === e.pointerId) {
      try { e.currentTarget.releasePointerCapture(e.pointerId); } catch(err) {}
      resetJoystickInput();
    }
  };

  const onLostPointerCapture = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'touch') return;
    if (activePointerIdRef.current === e.pointerId) {
      resetJoystickInput();
    }
  };

  
  const onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (isPaused || activeTouchIdRef.current !== null) return;
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      activeTouchIdRef.current = touch.identifier;
      handlePointerMove(touch.clientX, touch.clientY);
      break;
    }
  };

  const onTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (isPaused || activeTouchIdRef.current === null) return;
    let touchFound = false;
    for (let i = 0; i < e.touches.length; i++) {
      const touch = e.touches[i];
      if (touch.identifier === activeTouchIdRef.current) {
        touchFound = true;
        handlePointerMove(touch.clientX, touch.clientY);
        break;
      }
    }
    if (!touchFound) {
      resetJoystickInput();
    }
  };

  const onTouchEndOrCancel = (e: React.TouchEvent<HTMLDivElement>) => {
    if (activeTouchIdRef.current === null) return;
    let ourTouchEnded = false;
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === activeTouchIdRef.current) {
        ourTouchEnded = true;
        break;
      }
    }
    if (ourTouchEnded) {
      resetJoystickInput();
    }
  };

  const startContinuousFire = () => {
    if (isPaused) return;
    onFire();
    if (fireIntervalRef.current) clearInterval(fireIntervalRef.current);
    fireIntervalRef.current = setInterval(() => {
      onFire();
    }, 120);
  };

  const stopContinuousFire = () => {
    if (fireIntervalRef.current) {
      clearInterval(fireIntervalRef.current);
      fireIntervalRef.current = null;
    }
    const evt = new KeyboardEvent('keyup', { key: ' ' });
    window.dispatchEvent(evt);
  };

  useEffect(() => {
    return () => {
      if (fireIntervalRef.current) clearInterval(fireIntervalRef.current);
    };
  }, []);

  useEffect(() => {
    if (isPaused) {
      if (fireIntervalRef.current) {
        clearInterval(fireIntervalRef.current);
        fireIntervalRef.current = null;
      }
      resetJoystickInput();
    }
  }, [isPaused, resetJoystickInput]);

  useEffect(() => {
    const handleGlobalPointerUpCancel = (e: PointerEvent) => {
      if (activePointerIdRef.current === e.pointerId) {
        resetJoystickInput();
      }
    };

    const handleGlobalBlurHide = () => {
      resetJoystickInput();
    };
    
    const handleVisibilityChange = () => {
      if (document.hidden) {
        resetJoystickInput();
      }
    };

    const handleCustomReset = () => {
      resetJoystickInput();
    };

    window.addEventListener('pointerup', handleGlobalPointerUpCancel, true);
    window.addEventListener('pointercancel', handleGlobalPointerUpCancel, true);
    window.addEventListener('blur', handleGlobalBlurHide);
    window.addEventListener('pagehide', handleGlobalBlurHide);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('asteroids:reset-joystick', handleCustomReset);

    return () => {
      window.removeEventListener('pointerup', handleGlobalPointerUpCancel, true);
      window.removeEventListener('pointercancel', handleGlobalPointerUpCancel, true);
      window.removeEventListener('blur', handleGlobalBlurHide);
      window.removeEventListener('pagehide', handleGlobalBlurHide);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('asteroids:reset-joystick', handleCustomReset);
    };
  }, [resetJoystickInput]);

  return (
    <div className="fixed inset-0 pointer-events-none z-40 select-none overflow-hidden flex justify-between items-end p-4 sm:p-8">
      {/* LEFT SIDE: Virtual Joystick */}
      <div className="pointer-events-auto flex flex-col items-center gap-2 mb-2 sm:mb-4">
        <div
          ref={joystickBaseRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUpOrCancel}
          onPointerCancel={onPointerUpOrCancel}
          onLostPointerCapture={onLostPointerCapture}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEndOrCancel}
          onTouchCancel={onTouchEndOrCancel}
          className={`relative w-28 h-28 sm:w-36 sm:h-36 rounded-full border-2 flex items-center justify-center transition-colors touch-none shadow-2xl ${
            isJoystickActive
              ? 'bg-[#161B22]/90 border-[#00e5ff] shadow-[0_0_25px_rgba(0,229,255,0.5)] scale-105'
              : 'bg-[#0D1117]/80 border-[#38bdf8]/60 shadow-[0_0_15px_rgba(0,0,0,0.5)]'
          }`}
        >
          {/* Directional Guidelines */}
          <div className="absolute inset-0 rounded-full flex items-center justify-center pointer-events-none opacity-30">
            <div className="w-full h-[1px] bg-[#38bdf8]" />
            <div className="h-full w-[1px] bg-[#38bdf8] absolute" />
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border border-dashed border-[#38bdf8]" />
          </div>
          {/* Joystick Knob */}
          <div
            ref={joystickKnobRef}
            className={`absolute w-11 h-11 sm:w-14 sm:h-14 rounded-full border-2 flex items-center justify-center shadow-lg ${
              isJoystickActive
                ? 'bg-gradient-to-br from-[#00e5ff] to-[#1F6FEB] border-[#ffffff] shadow-[0_0_15px_#00e5ff]'
                : 'bg-gradient-to-br from-[#38bdf8] to-[#161B22] border-[#38bdf8]/80'
            }`}
            style={{
              transform: `translate(${knobPos.x}px, ${knobPos.y}px)`
            }}
          >
            <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-white/80 shadow-[0_0_6px_#ffffff]" />
          </div>
        </div>
        <div className="text-[9px] sm:text-[10px] font-mono font-bold text-[#38bdf8] tracking-wider px-2 py-0.5 bg-[#0D1117]/80 rounded border border-[#38bdf8]/30 shadow-sm">
          JOYSTICK STEER / THRUST
        </div>
      </div>

      {/* RIGHT SIDE: Action Buttons */}
      <div className="pointer-events-auto flex flex-col items-end gap-3 mb-2 sm:mb-4">
        {/* Secondary Actions Row (EMP & Hyperspace) */}
        <div className="flex items-center gap-3">
          {/* EMP Bomb Button */}
          <button
            onTouchStart={(e) => { e.preventDefault(); if (!isPaused) onEMP(); }}
            onClick={() => { if (!isPaused) onEMP(); }}
            disabled={empCount <= 0 || isPaused}
            className={`flex flex-col items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-2xl border transition-all active:scale-95 shadow-lg ${
              empCount > 0
                ? 'bg-[#0D1117]/90 border-[#D29922] text-[#D29922] shadow-[0_0_12px_rgba(210,153,34,0.3)]'
                : 'bg-[#161B22]/40 border-[#30363D] text-[#8B949E] opacity-50'
            }`}
            aria-label="EMP Shockwave"
          >
            <Bomb className="w-5 h-5" />
            <span className="text-[8px] font-mono font-bold mt-0.5 text-[#D29922]">EMP {empCount}</span>
          </button>

          {/* Hyperspace Button */}
          <button
            onTouchStart={(e) => { e.preventDefault(); if (!isPaused) onHyperspace(); }}
            onClick={() => { if (!isPaused) onHyperspace(); }}
            disabled={!hyperspaceReady || isPaused}
            className={`flex flex-col items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-2xl border transition-all active:scale-95 shadow-lg ${
              hyperspaceReady
                ? 'bg-[#0D1117]/90 border-[#58A6FF] text-[#58A6FF] shadow-[0_0_12px_rgba(88,166,255,0.3)]'
                : 'bg-[#161B22]/40 border-[#30363D] text-[#8B949E] opacity-50'
            }`}
            aria-label="Hyperspace Jump"
          >
            <Zap className="w-5 h-5" />
            <span className="text-[8px] font-mono font-bold mt-0.5 text-[#58A6FF]">WARP</span>
          </button>
        </div>

        {/* Primary Fire Button */}
        <button
          onTouchStart={(e) => { e.preventDefault(); startContinuousFire(); }}
          onTouchEnd={stopContinuousFire}
          onTouchCancel={stopContinuousFire}
          onMouseDown={(e) => { e.preventDefault(); startContinuousFire(); }}
          onMouseUp={stopContinuousFire}
          onMouseLeave={stopContinuousFire}
          disabled={isPaused}
          className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-[#F85149]/50 to-[#b91c1c]/80 active:from-[#F85149] active:to-[#ef4444] border-2 border-[#ff7b72] rounded-full flex flex-col items-center justify-center text-white shadow-[0_0_25px_rgba(248,81,73,0.4)] active:scale-95 transition-transform"
          aria-label="Fire Weapon"
        >
          <Target className="w-9 h-9 text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.8)]" />
          <span className="text-[10px] font-mono font-extrabold tracking-widest text-white mt-0.5">FIRE</span>
        </button>
      </div>
    </div>
  );
};
