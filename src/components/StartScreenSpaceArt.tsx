import React from 'react';

export const LargeAsteroidSVG = ({ className, style }: { className?: string, style?: React.CSSProperties }) => (
  <svg viewBox="0 0 100 100" className={className} style={style} preserveAspectRatio="xMidYMid meet">
    {/* Base shape with high variance */}
    <polygon points="25,12 55,5 85,25 95,55 75,90 40,95 10,75 5,40" fill="none" stroke="#7dd3fc" strokeWidth="1.2" vectorEffect="non-scaling-stroke"/>
    
    {/* Inner Shell 1 (scale 0.65) */}
    <polygon points="41,29 61,24 80,38 87,57 74,80 51,83 31,70 28,47" fill="none" stroke="#7dd3fc" strokeWidth="0.8" opacity="0.55" vectorEffect="non-scaling-stroke"/>
    
    {/* Polyhedral Facets (Connecting outer to inner) */}
    <polyline points="25,12 41,29" fill="none" stroke="#7dd3fc" strokeWidth="0.6" opacity="0.4" vectorEffect="non-scaling-stroke"/>
    <polyline points="55,5 61,24" fill="none" stroke="#7dd3fc" strokeWidth="0.6" opacity="0.4" vectorEffect="non-scaling-stroke"/>
    <polyline points="85,25 80,38" fill="none" stroke="#7dd3fc" strokeWidth="0.6" opacity="0.4" vectorEffect="non-scaling-stroke"/>
    <polyline points="95,55 87,57" fill="none" stroke="#7dd3fc" strokeWidth="0.6" opacity="0.4" vectorEffect="non-scaling-stroke"/>
    <polyline points="75,90 74,80" fill="none" stroke="#7dd3fc" strokeWidth="0.6" opacity="0.4" vectorEffect="non-scaling-stroke"/>
    <polyline points="40,95 51,83" fill="none" stroke="#7dd3fc" strokeWidth="0.6" opacity="0.4" vectorEffect="non-scaling-stroke"/>
    <polyline points="10,75 31,70" fill="none" stroke="#7dd3fc" strokeWidth="0.6" opacity="0.4" vectorEffect="non-scaling-stroke"/>
    <polyline points="5,40 28,47" fill="none" stroke="#7dd3fc" strokeWidth="0.6" opacity="0.4" vectorEffect="non-scaling-stroke"/>
    
    {/* Circuit Traces / Veins */}
    <polyline points="41,29 50,50 74,80" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeOpacity="0.85" vectorEffect="non-scaling-stroke"/>
    <polyline points="80,38 65,45 31,70" fill="none" stroke="#38bdf8" strokeWidth="1" strokeOpacity="0.6" vectorEffect="non-scaling-stroke"/>
    
    {/* Craters / Nodes */}
    <circle cx="50" cy="50" r="2" fill="#38bdf8" />
    <circle cx="65" cy="45" r="1.5" fill="#38bdf8" />
    <circle cx="30" cy="30" r="4" fill="none" stroke="#7dd3fc" strokeWidth="0.5" vectorEffect="non-scaling-stroke"/>
    <circle cx="70" cy="70" r="6" fill="none" stroke="#7dd3fc" strokeWidth="0.5" vectorEffect="non-scaling-stroke"/>
  </svg>
);

export const NormalAsteroidSVG = ({ className, style }: { className?: string, style?: React.CSSProperties }) => (
  <svg viewBox="0 0 100 100" className={className} style={style} preserveAspectRatio="xMidYMid meet">
    {/* Outer Polygon */}
    <polygon points="80,50 68,72 40,82 15,65 20,38 45,15 75,25" fill="none" stroke="#7dd3fc" strokeWidth="1.2" vectorEffect="non-scaling-stroke"/>
    
    {/* Inner Shell (0.65 scale) */}
    <polygon points="69.5,50 61.7,64.3 43.5,70.8 27.25,59.75 30.5,42.2 46.75,27.25 66.25,33.75" fill="none" stroke="#7dd3fc" strokeWidth="0.8" opacity="0.65" vectorEffect="non-scaling-stroke"/>
    
    {/* Polyhedral Facets connecting outer to inner */}
    <polyline points="80,50 61.7,64.3" stroke="#7dd3fc" strokeWidth="0.6" opacity="0.4" />
    <polyline points="68,72 43.5,70.8" stroke="#7dd3fc" strokeWidth="0.6" opacity="0.4" />
    <polyline points="40,82 27.25,59.75" stroke="#7dd3fc" strokeWidth="0.6" opacity="0.4" />
    <polyline points="15,65 30.5,42.2" stroke="#7dd3fc" strokeWidth="0.6" opacity="0.4" />
    <polyline points="20,38 46.75,27.25" stroke="#7dd3fc" strokeWidth="0.6" opacity="0.4" />
    <polyline points="45,15 66.25,33.75" stroke="#7dd3fc" strokeWidth="0.6" opacity="0.4" />
    <polyline points="75,25 69.5,50" stroke="#7dd3fc" strokeWidth="0.6" opacity="0.4" />
    
    {/* Radial Struts to center hub */}
    <polyline points="50,50 80,50" stroke="#7dd3fc" strokeWidth="0.6" opacity="0.4" />
    <polyline points="50,50 15,65" stroke="#7dd3fc" strokeWidth="0.6" opacity="0.4" />
    
    {/* TRON Circuit Board Traces & Nodes */}
    <circle cx="65" cy="40" r="2.5" fill="#38bdf8" />
    <circle cx="50" cy="50" r="1.5" fill="#38bdf8" />
    <polyline points="75,25 65,40 50,50" fill="none" stroke="#38bdf8" strokeWidth="1.2" />
    
    <circle cx="35" cy="70" r="2" fill="#38bdf8" />
    <polyline points="27.25,59.75 35,70" fill="none" stroke="#38bdf8" strokeWidth="1" />
  </svg>
);

export const SpecialAsteroidSVG = ({ className, style }: { className?: string, style?: React.CSSProperties }) => (
  <svg viewBox="0 0 100 100" className={className} style={style} preserveAspectRatio="xMidYMid meet">
    {/* Golden / Magma Special Asteroid type */}
    <polygon points="50,15 85,35 75,70 50,85 15,65 25,30" fill="rgba(25, 20, 2, 0.82)" stroke="#ffd700" strokeWidth="2" vectorEffect="non-scaling-stroke" className="drop-shadow-[0_0_8px_rgba(255,215,0,0.6)]"/>
    
    {/* Inner Shell (0.5 scale) */}
    <polygon points="50,32.5 67.5,42.5 62.5,60 50,67.5 32.5,57.5 37.5,40" fill="none" stroke="#ffd700" strokeWidth="1" opacity="0.8" vectorEffect="non-scaling-stroke"/>
    
    {/* Connecting struts */}
    <polyline points="50,15 50,32.5" stroke="#ffd700" strokeWidth="1" opacity="0.5" />
    <polyline points="85,35 67.5,42.5" stroke="#ffd700" strokeWidth="1" opacity="0.5" />
    <polyline points="75,70 62.5,60" stroke="#ffd700" strokeWidth="1" opacity="0.5" />
    <polyline points="50,85 50,67.5" stroke="#ffd700" strokeWidth="1" opacity="0.5" />
    <polyline points="15,65 32.5,57.5" stroke="#ffd700" strokeWidth="1" opacity="0.5" />
    <polyline points="25,30 37.5,40" stroke="#ffd700" strokeWidth="1" opacity="0.5" />
    
    {/* Mineral veins / cracks in center */}
    <polyline points="37.5,40 50,50 67.5,42.5" fill="none" stroke="#fbbf24" strokeWidth="1.5" />
    <polyline points="50,50 62.5,60" fill="none" stroke="#fbbf24" strokeWidth="1.5" />
    <circle cx="50" cy="50" r="3" fill="#fbbf24" />
  </svg>
);

export const GameEnemyShipSVG = ({ className, style }: { className?: string, style?: React.CSSProperties }) => (
  <svg viewBox="0 0 100 100" className={className} style={style} preserveAspectRatio="xMidYMid meet">
    {/* Hunter Interceptor: Forward-swept stealth wing ship */}
    <polygon points="95.5,50 64,41.25 46.5,18.5 36,34.25 22,25.5 27.25,43 18.5,50 27.25,57 22,74.5 36,65.75 46.5,81.5 64,58.75" fill="#0f172a" stroke="#FF9900" strokeWidth="1.5" vectorEffect="non-scaling-stroke" className="drop-shadow-[0_0_8px_rgba(255,153,0,0.6)]"/>
    
    {/* Internal Vector Panel Lines */}
    <polyline points="74.5,50 39.5,39.5" fill="none" stroke="#ffb733" strokeWidth="0.8" opacity="0.8"/>
    <polyline points="74.5,50 39.5,60.5" fill="none" stroke="#ffb733" strokeWidth="0.8" opacity="0.8"/>
    <polyline points="46.5,50 29,32.5" fill="none" stroke="#ffb733" strokeWidth="0.8" opacity="0.8"/>
    <polyline points="46.5,50 29,67.5" fill="none" stroke="#ffb733" strokeWidth="0.8" opacity="0.8"/>
    
    {/* Angled Cockpit Visor Line */}
    <polygon points="72.75,44.75 58.75,42.3 58.75,57.7 72.75,55.25" fill="#261200" stroke="#FFCC00" strokeWidth="1.2" opacity="0.95"/>
    
    {/* Boosted Engine Thruster Glow */}
    <ellipse cx="20.25" cy="50" rx="14" ry="5.25" fill="#ffffff" className="drop-shadow-[0_0_12px_rgba(255,51,0,0.9)]" />
    <ellipse cx="23.75" cy="50" rx="7" ry="2.8" fill="#ffff00" className="drop-shadow-[0_0_5px_rgba(255,255,255,0.9)]" />
  </svg>
);

export const PlayerShipVariantSVG = ({ className, style }: { className?: string, style?: React.CSSProperties }) => (
  <svg viewBox="0 0 100 100" className={className} style={style} preserveAspectRatio="xMidYMid meet">
    <polygon points="50,10 85,85 50,70 15,85" fill="none" stroke="#00F0FF" strokeWidth="2" vectorEffect="non-scaling-stroke" className="drop-shadow-[0_0_10px_rgba(0,240,255,0.6)]"/>
    <polygon points="50,35 58,55 50,65 42,55" fill="none" stroke="#00F0FF" strokeWidth="1.2" vectorEffect="non-scaling-stroke"/>
    <line x1="50" y1="10" x2="50" y2="35" stroke="#00F0FF" strokeWidth="1.5" opacity="0.8"/>
    <line x1="50" y1="65" x2="50" y2="70" stroke="#00F0FF" strokeWidth="1.5" opacity="0.8"/>
    <polyline points="35,65 50,55 65,65" fill="none" stroke="#00F0FF" strokeWidth="1" opacity="0.6"/>
    <line x1="25" y1="65" x2="15" y2="85" stroke="#00F0FF" strokeWidth="1" opacity="0.5"/>
    <line x1="75" y1="65" x2="85" y2="85" stroke="#00F0FF" strokeWidth="1" opacity="0.5"/>
    <line x1="22" y1="71" x2="32" y2="76" stroke="#00F0FF" strokeWidth="1" opacity="0.5"/>
    <line x1="78" y1="71" x2="68" y2="76" stroke="#00F0FF" strokeWidth="1" opacity="0.5"/>
    <rect x="42" y="74" width="6" height="4" fill="none" stroke="#00F0FF" strokeWidth="1"/>
    <rect x="52" y="74" width="6" height="4" fill="none" stroke="#00F0FF" strokeWidth="1"/>
    <polygon points="42,78 48,78 45,95" fill="#00A0FF" opacity="0.6"/>
    <polygon points="52,78 58,78 55,95" fill="#00A0FF" opacity="0.6"/>
  </svg>
);

export const GameBossDreadnoughtSVG = ({ className, style }: { className?: string, style?: React.CSSProperties }) => (
  <svg viewBox="-50 -50 100 100" className={className} style={style} preserveAspectRatio="xMidYMid meet">
    <g>
      {/* Outer Heavy Armor Shell (Simplified, thicker stroke) */}
      <polygon 
        points="
          -22,-37.4 22,-37.4 37.4,-33 46.2,-15.4 41.8,13.2 26.4,28.6 13.2,35.2 -13.2,35.2 -26.4,28.6 -41.8,13.2 -46.2,-15.4 -37.4,-33
        "
        fill="#0f172a" 
        stroke="#e11d48" 
        strokeWidth="2.5" 
        vectorEffect="non-scaling-stroke"
        className="drop-shadow-[0_0_6px_rgba(225,29,72,0.4)]"
      />

      {/* Inner Layered Armor Plates (Simplified colors) */}
      <polygon 
        points="
          -15.4,-30.8 -33,-26.4 -37.4,-11 -28.6,15.4 -13.2,19.8
        "
        fill="#1e1b4b" 
        stroke="#b91c1c" 
        strokeWidth="1.5" 
        vectorEffect="non-scaling-stroke"
      />
      <polygon 
        points="
          15.4,-30.8 33,-26.4 37.4,-11 28.6,15.4 13.2,19.8
        "
        fill="#1e1b4b" 
        stroke="#b91c1c" 
        strokeWidth="1.5" 
        vectorEffect="non-scaling-stroke"
      />

      {/* Core Lens/Eye (Simplified, less bright, no reticle, stronger central read) */}
      <circle cx="0" cy="0" r="18.48" stroke="#9f1239" fill="#020617" strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
      <circle cx="0" cy="0" r="13.2" stroke="#e11d48" fill="none" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
      <circle cx="0" cy="0" r="6" fill="#be123c" className="drop-shadow-[0_0_6px_rgba(190,18,60,0.6)]" />
    </g>
  </svg>
);

/**
 * SVG assets modeled directly from the game's canvas rendering logic.
 * These are designed for ambient background usage (e.g. at 25-50% opacity).
 */
export const StartScreenSpaceArt: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#07090E] p-8 font-mono text-[#8B949E]">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-[#58A6FF] mb-2 tracking-widest">
          ASTRO VOID // ASSET GALLERY
        </h1>
        <p className="mb-12 text-sm tracking-wide">
          Decorative Vector Assets - Modeled from AsteroidsCanvas.tsx
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          
          {/* ASSET: Large Asteroid */}
          <div className="flex flex-col items-center">
            <h2 className="mb-4 text-xs tracking-widest uppercase border-b border-[#30363D] pb-2 w-full text-center">
              LARGE ASTEROID
            </h2>
            <div className="w-[300px] h-[300px] relative border border-[#30363D] rounded-xl flex items-center justify-center bg-[#0D1117] overflow-hidden">
               <LargeAsteroidSVG className="w-[80%] h-[80%] opacity-100" />
            </div>
          </div>

          {/* ASSET: Normal Game Asteroid */}
          <div className="flex flex-col items-center">
            <h2 className="mb-4 text-xs tracking-widest uppercase border-b border-[#30363D] pb-2 w-full text-center">
              NORMAL GAME ASTEROID
            </h2>
            <div className="w-[300px] h-[300px] relative border border-[#30363D] rounded-xl flex items-center justify-center bg-[#0D1117] overflow-hidden">
               <NormalAsteroidSVG className="w-[70%] h-[70%] opacity-100" />
            </div>
          </div>

          {/* ASSET: Special Game Asteroid */}
          <div className="flex flex-col items-center">
            <h2 className="mb-4 text-xs tracking-widest uppercase border-b border-[#30363D] pb-2 w-full text-center">
              SPECIAL GAME ASTEROID
            </h2>
            <div className="w-[300px] h-[300px] relative border border-[#30363D] rounded-xl flex items-center justify-center bg-[#0D1117] overflow-hidden">
               <SpecialAsteroidSVG className="w-[60%] h-[60%] opacity-100" />
            </div>
          </div>

          {/* ASSET: Game Enemy Ship */}
          <div className="flex flex-col items-center col-span-1 md:col-span-2">
            <h2 className="mb-4 text-xs tracking-widest uppercase border-b border-[#30363D] pb-2 w-full text-center">
              GAME ENEMY SHIP
            </h2>
            <div className="w-[600px] h-[300px] relative border border-[#30363D] rounded-xl flex items-center justify-center bg-[#0D1117] overflow-hidden max-w-full">
               <GameEnemyShipSVG className="w-[70%] h-[70%] opacity-100" />
            </div>
          </div>

          {/* ASSET: Player Ship Variant */}
          <div className="flex flex-col items-center">
            <h2 className="mb-4 text-xs tracking-widest uppercase border-b border-[#30363D] pb-2 w-full text-center">
              PLAYER SHIP VARIANT
            </h2>
            <div className="w-[300px] h-[300px] relative border border-[#30363D] rounded-xl flex items-center justify-center bg-[#0D1117] overflow-hidden">
               <PlayerShipVariantSVG className="w-[50%] h-[50%] opacity-100" />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

