import React from 'react';
import { 
  BookOpen, 
  X, 
  Crosshair, 
  Sparkles, 
  Shield, 
  Zap, 
  Flame, 
  Radio, 
  Disc, 
  Target,
  Clock,
  Compass,
  Bomb
} from 'lucide-react';

interface CodexModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CodexModal: React.FC<CodexModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 md:p-6 bg-[#030508]/85 backdrop-blur-md animate-fadeIn">
      {/* Centered Responsive Container with Ultrawide max-width cap */}
      <div 
        className="relative w-full max-w-3xl max-h-[90vh] bg-[#0D1117]/95 border border-[#30363D] rounded-2xl sm:rounded-3xl shadow-[0_0_60px_rgba(236,72,153,0.15)] p-5 sm:p-7 md:p-9 text-[#E6EDF3] font-mono flex flex-col overflow-hidden my-auto transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-4 sm:pb-5 mb-5 border-b border-[#30363D] shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3 text-[#EC4899] font-bold text-lg sm:text-xl tracking-wider">
            <div className="p-2 rounded-xl bg-[#EC4899]/15 border border-[#EC4899]/30 text-[#EC4899]">
              <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <span>TACTICAL INTEL & HAZARD CODEX</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-[#161B22] border border-[#30363D] text-[#8B949E] hover:text-white hover:border-[#EC4899]/50 hover:bg-[#EC4899]/10 transition-all cursor-pointer"
            aria-label="Close Codex"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto pr-1 sm:pr-2 space-y-6 text-xs sm:text-sm custom-scrollbar">
          
          {/* SECTION 1: HOSTILE FOES (Red/Crimson Glow) */}
          <div>
            <div className="flex items-center gap-2 text-[#FF2A55] font-bold uppercase tracking-wider text-xs sm:text-sm mb-3">
              <Crosshair className="w-4 h-4 text-[#FF2A55]" />
              <span>ALIEN HOSTILE FOES (RED / CRIMSON SPECS)</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Alien Scout */}
              <div className="bg-[#161B22]/90 p-4 rounded-xl border border-[#FF2A55]/40 hover:border-[#FF2A55] transition-all shadow-[0_0_15px_rgba(255,42,85,0.08)]">
                <div className="font-bold text-[#FF2A55] flex items-center justify-between mb-1.5 text-sm">
                  <span className="flex items-center gap-2">
                    <Disc className="w-4 h-4 text-[#FF2A55]" />
                    ALIEN SCOUT
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#FF2A55]/15 border border-[#FF2A55]/30 text-[#FF6688]">
                    FAST PULSE
                  </span>
                </div>
                <p className="text-xs text-[#8B949E] leading-relaxed">
                  Sweeps across space in a wavy sine trajectory. Fires directed plasma bolts every 2.5 seconds directly towards player position.
                </p>
              </div>

              {/* Mothership */}
              <div className="bg-[#161B22]/90 p-4 rounded-xl border border-[#C084FC]/40 hover:border-[#C084FC] transition-all shadow-[0_0_15px_rgba(192,132,252,0.08)]">
                <div className="font-bold text-[#C084FC] flex items-center justify-between mb-1.5 text-sm">
                  <span className="flex items-center gap-2">
                    <Radio className="w-4 h-4 text-[#C084FC]" />
                    MOTHERSHIP
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#C084FC]/15 border border-[#C084FC]/30 text-[#E879F9]">
                    RING BURSTS
                  </span>
                </div>
                <p className="text-xs text-[#8B949E] leading-relaxed">
                  Armored alien command vessel with multi-layer hulls. Discharges expanding 360° omnidirectional plasma ring salvos.
                </p>
              </div>

              {/* Hunter Interceptor */}
              <div className="bg-[#161B22]/90 p-4 rounded-xl border border-[#FF9900]/40 hover:border-[#FF9900] transition-all shadow-[0_0_15px_rgba(255,153,0,0.08)]">
                <div className="font-bold text-[#FF9900] flex items-center justify-between mb-1.5 text-sm">
                  <span className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-[#FF9900]" />
                    HUNTER FIGHTER
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#FF9900]/15 border border-[#FF9900]/30 text-[#FFB733]">
                    STALKER & CHASER
                  </span>
                </div>
                <p className="text-xs text-[#8B949E] leading-relaxed">
                  Forward-swept stealth fighter that locks onto player angle and executes sudden high-velocity thruster bursts with spark trails.
                </p>
              </div>

              {/* Void Swarmers */}
              <div className="bg-[#161B22]/90 p-4 rounded-xl border border-[#00FF66]/40 hover:border-[#00FF66] transition-all shadow-[0_0_15px_rgba(0,255,102,0.08)]">
                <div className="font-bold text-[#00FF66] flex items-center justify-between mb-1.5 text-sm">
                  <span className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-[#00FF66]" />
                    VOID SWARMERS
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#00FF66]/15 border border-[#00FF66]/30 text-[#66FF99]">
                    PACK NEEDLES
                  </span>
                </div>
                <p className="text-xs text-[#8B949E] leading-relaxed">
                  Spawns in tight packs of 3. Insectoid drones with curved pincers that orbit player vectors before darting inward in coordinated strikes.
                </p>
              </div>

              {/* Alien Dreadnought Warship */}
              <div className="bg-[#161B22]/90 p-4 rounded-xl border border-[#E11D48]/50 hover:border-[#E11D48] transition-all shadow-[0_0_20px_rgba(225,29,72,0.12)] md:col-span-2">
                <div className="font-bold text-[#FDA4AF] flex items-center justify-between mb-1.5 text-sm">
                  <span className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-[#E11D48]" />
                    ALIEN DREADNOUGHT WARSHIP
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#E11D48]/20 border border-[#E11D48]/40 text-[#FDA4AF] uppercase font-bold">
                    SUPER BOSS FOE
                  </span>
                </div>
                <p className="text-xs text-[#8B949E] leading-relaxed">
                  Massive heavily shielded dreadnought that charges up energy across 4 seconds before unleashing a devastating, screen-slicing Death Beam.
                </p>
              </div>
            </div>
          </div>

          {/* SECTION 2: SPECIAL WEAPONS & POWERUPS (Cyan/Blue Glow) */}
          <div>
            <div className="flex items-center gap-2 text-[#38BDF8] font-bold uppercase tracking-wider text-xs sm:text-sm mb-3">
              <Sparkles className="w-4 h-4 text-[#38BDF8]" />
              <span>SPECIAL WEAPONS & TACTICAL DROPS (CYAN / BLUE SPECS)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Supernova Nuke */}
              <div className="bg-[#161B22]/90 p-4 rounded-xl border border-[#FF3366]/40 hover:border-[#FF3366] transition-all shadow-[0_0_15px_rgba(255,51,102,0.08)]">
                <div className="font-bold text-[#FF3366] mb-1.5 flex items-center gap-1.5 text-xs sm:text-sm">
                  <Bomb className="w-4 h-4 text-[#FF3366]" />
                  SUPERNOVA NUKE
                </div>
                <p className="text-xs text-[#8B949E] leading-relaxed">
                  Triggers a screen-wide cosmic detonation that instantly clears all space rocks and enemy bolts.
                </p>
              </div>

              {/* Chrono Stasis */}
              <div className="bg-[#161B22]/90 p-4 rounded-xl border border-[#38BDF8]/40 hover:border-[#38BDF8] transition-all shadow-[0_0_15px_rgba(56,189,248,0.08)]">
                <div className="font-bold text-[#38BDF8] mb-1.5 flex items-center gap-1.5 text-xs sm:text-sm">
                  <Clock className="w-4 h-4 text-[#38BDF8]" />
                  CHRONO STASIS
                </div>
                <p className="text-xs text-[#8B949E] leading-relaxed">
                  Distorts space-time velocity, slowing all meteors and alien craft movement by 75% for 8 seconds.
                </p>
              </div>

              {/* Kinetic Repulsor */}
              <div className="bg-[#161B22]/90 p-4 rounded-xl border border-[#39FF14]/40 hover:border-[#39FF14] transition-all shadow-[0_0_15px_rgba(57,255,20,0.08)]">
                <div className="font-bold text-[#39FF14] mb-1.5 flex items-center gap-1.5 text-xs sm:text-sm">
                  <Compass className="w-4 h-4 text-[#39FF14]" />
                  KINETIC REPULSOR
                </div>
                <p className="text-xs text-[#8B949E] leading-relaxed">
                  Projects an outward gravitational pulse field that violently repels incoming asteroids away from ship hull.
                </p>
              </div>

              {/* Additional drops */}
              <div className="bg-[#161B22]/90 p-4 rounded-xl border border-[#A855F7]/40 hover:border-[#A855F7] transition-all shadow-[0_0_15px_rgba(168,85,247,0.08)]">
                <div className="font-bold text-[#A855F7] mb-1.5 flex items-center gap-1.5 text-xs sm:text-sm">
                  <Shield className="w-4 h-4 text-[#A855F7]" />
                  FORCE SHIELD
                </div>
                <p className="text-xs text-[#8B949E] leading-relaxed">
                  Generates an orb barrier absorbing meteor impacts and hostile laser fire.
                </p>
              </div>

              <div className="bg-[#161B22]/90 p-4 rounded-xl border border-[#58A6FF]/40 hover:border-[#58A6FF] transition-all shadow-[0_0_15px_rgba(88,166,255,0.08)]">
                <div className="font-bold text-[#58A6FF] mb-1.5 flex items-center gap-1.5 text-xs sm:text-sm">
                  <Zap className="w-4 h-4 text-[#58A6FF]" />
                  PLASMA LASER
                </div>
                <p className="text-xs text-[#8B949E] leading-relaxed">
                  Fires a continuous high-energy beam piercing cleanly through dense asteroid fields.
                </p>
              </div>

              <div className="bg-[#161B22]/90 p-4 rounded-xl border border-[#D29922]/40 hover:border-[#D29922] transition-all shadow-[0_0_15px_rgba(210,153,34,0.08)]">
                <div className="font-bold text-[#D29922] mb-1.5 flex items-center gap-1.5 text-xs sm:text-sm">
                  <Radio className="w-4 h-4 text-[#D29922]" />
                  EMP BOMB
                </div>
                <p className="text-xs text-[#8B949E] leading-relaxed">
                  Emits an electromagnetic pulse disabling alien weapons and shattering target meteors.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Action Button */}
        <div className="pt-4 sm:pt-5 mt-4 border-t border-[#30363D] shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#238636] to-[#2EA043] hover:from-[#2EA043] hover:to-[#3FB950] text-white font-extrabold text-sm tracking-wider uppercase shadow-[0_0_20px_rgba(46,160,67,0.4)] transition-all cursor-pointer"
          >
            ACKNOWLEDGE & CLOSE CODEX
          </button>
        </div>

      </div>
    </div>
  );
};
