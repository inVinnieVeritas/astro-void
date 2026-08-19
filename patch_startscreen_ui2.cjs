const fs = require('fs');
let code = fs.readFileSync('src/components/StartScreen.tsx', 'utf8');

// The boss mode buttons block
const bossModesBlock = `            {/* Boss Rush (Wave 5) */}
            <button type="button"
              tabIndex={-1}
              onClick={() => onChangeGameMode('boss_rush')}
              onMouseEnter={() => { setHoveredMode('boss_rush'); playHoverSound(); }}
              onMouseLeave={() => setHoveredMode(null)}
              className={\`p-3.5 sm:p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer \${
                shouldShowStrongModeState('boss_rush')
                  ? isModeSelected('boss_rush')
                    ? 'bg-[#F85149]/20 border-[#F85149] text-[#E6EDF3] shadow-[0_0_20px_rgba(248,81,73,0.25)] scale-[1.02] opacity-100 ring-1 ring-[#F85149]/50'
                    : 'bg-[#F85149]/10 border-[#F85149] text-[#E6EDF3] shadow-[0_0_15px_rgba(248,81,73,0.15)] scale-[1.01] opacity-90 lg:opacity-100'
                  : 'bg-[#161B22]/50 border-[#21262D] text-[#484F58] opacity-50'
              }\`}
            >
              <div className={\`font-mono font-bold text-sm sm:text-base flex items-center justify-between \${
                shouldShowStrongModeState('boss_rush') ? 'text-[#F85149]' : 'text-[#6E7681]'
              }\`}>
                WAVE 5 BOSS
                {shouldShowStrongModeState('boss_rush') && <div className="w-2.5 h-2.5 rounded-full bg-[#F85149] shadow-[0_0_10px_#F85149]" />}
              </div>
              <div className={\`text-[11px] font-mono mt-1.5 leading-snug \${
                shouldShowStrongModeState('boss_rush') ? 'text-[#C9D1D9]' : 'text-[#484F58]'
              }\`}>
                Start at Wave 5 vs Dreadnought • Practice • Rewards Disabled
              </div>
            </button>
            
            {/* Wave 10 Boss */}
            <button type="button"
              tabIndex={-1}
              onClick={() => onChangeGameMode('wave_10_boss')}
              onMouseEnter={() => { setHoveredMode('wave_10_boss'); playHoverSound(); }}
              onMouseLeave={() => setHoveredMode(null)}
              className={\`p-3.5 sm:p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer \${
                shouldShowStrongModeState('wave_10_boss')
                  ? isModeSelected('wave_10_boss')
                    ? 'bg-[#A371F7]/20 border-[#A371F7] text-[#E6EDF3] shadow-[0_0_20px_rgba(163,113,247,0.25)] scale-[1.02] opacity-100 ring-1 ring-[#A371F7]/50'
                    : 'bg-[#A371F7]/10 border-[#A371F7] text-[#E6EDF3] shadow-[0_0_15px_rgba(163,113,247,0.15)] scale-[1.01] opacity-90 lg:opacity-100'
                  : 'bg-[#161B22]/50 border-[#21262D] text-[#484F58] opacity-50'
              }\`}
            >
              <div className={\`font-mono font-bold text-sm sm:text-base flex items-center justify-between \${
                shouldShowStrongModeState('wave_10_boss') ? 'text-[#A371F7]' : 'text-[#6E7681]'
              }\`}>
                CORE SEVERANCE
                {shouldShowStrongModeState('wave_10_boss') && <div className="w-2.5 h-2.5 rounded-full bg-[#A371F7] shadow-[0_0_10px_#A371F7]" />}
              </div>
              <div className={\`text-[11px] font-mono mt-1.5 leading-snug \${
                shouldShowStrongModeState('wave_10_boss') ? 'text-[#C9D1D9]' : 'text-[#484F58]'
              }\`}>
                Start at Wave 10 vs Core Severance • Practice • Rewards Disabled
              </div>
            </button>

            {/* Wave 15 Boss - THE GRID ARCHITECT */}
            <button type="button"
              tabIndex={-1}
              onClick={() => onChangeGameMode('wave_15_boss')}
              onMouseEnter={() => { setHoveredMode('wave_15_boss'); playHoverSound(); }}
              onMouseLeave={() => setHoveredMode(null)}
              className={\`p-3.5 sm:p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer \${
                shouldShowStrongModeState('wave_15_boss')
                  ? isModeSelected('wave_15_boss')
                    ? 'bg-gradient-to-r from-[#00ffff]/20 to-[#ff00ff]/20 border-[#00ffff] text-[#E6EDF3] shadow-[0_0_20px_rgba(0,255,255,0.3)] scale-[1.02] opacity-100 ring-1 ring-[#00ffff]/50'
                    : 'bg-[#00ffff]/10 border-[#00ffff] text-[#E6EDF3] shadow-[0_0_15px_rgba(0,255,255,0.15)] scale-[1.01] opacity-90 lg:opacity-100'
                  : 'bg-[#161B22]/50 border-[#21262D] text-[#484F58] opacity-50'
              }\`}
            >
              <div className={\`font-mono font-bold text-sm sm:text-base flex items-center justify-between \${
                shouldShowStrongModeState('wave_15_boss') ? 'text-[#00ffff]' : 'text-[#6E7681]'
              }\`}>
                THE GRID ARCHITECT
                {shouldShowStrongModeState('wave_15_boss') && <div className="w-2.5 h-2.5 rounded-full bg-[#00ffff] shadow-[0_0_10px_#ff00ff]" />}
              </div>
              <div className={\`text-[11px] font-mono mt-1.5 leading-snug \${
                shouldShowStrongModeState('wave_15_boss') ? 'text-[#C9D1D9]' : 'text-[#484F58]'
              }\`}>
                Start at Wave 15 vs Grid Architect • Practice • Rewards Disabled
              </div>
            </button>`;

const diffSection = `        </div>

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
              className={\`p-3 sm:p-4 rounded-xl border text-center transition-all duration-200 cursor-pointer \${
                difficulty === 'easy'
                  ? 'bg-[#3FB950]/20 border-[#3FB950] text-[#E6EDF3] shadow-[0_0_15px_rgba(63,185,80,0.2)] scale-[1.02] ring-1 ring-[#3FB950]/50'
                  : 'bg-[#161B22]/50 border-[#21262D] text-[#8B949E] hover:border-[#3FB950]/50 hover:text-[#C9D1D9]'
              }\`}
            >
              <div className={\`font-mono font-bold text-sm sm:text-base \${difficulty === 'easy' ? 'text-[#3FB950]' : ''}\`}>EASY</div>
            </button>
            {/* NORMAL */}
            <button type="button"
              tabIndex={-1}
              onClick={() => onChangeDifficulty('normal')}
              onMouseEnter={playHoverSound}
              className={\`p-3 sm:p-4 rounded-xl border text-center transition-all duration-200 cursor-pointer \${
                difficulty === 'normal'
                  ? 'bg-[#58A6FF]/20 border-[#58A6FF] text-[#E6EDF3] shadow-[0_0_15px_rgba(88,166,255,0.2)] scale-[1.02] ring-1 ring-[#58A6FF]/50'
                  : 'bg-[#161B22]/50 border-[#21262D] text-[#8B949E] hover:border-[#58A6FF]/50 hover:text-[#C9D1D9]'
              }\`}
            >
              <div className={\`font-mono font-bold text-sm sm:text-base \${difficulty === 'normal' ? 'text-[#58A6FF]' : ''}\`}>NORMAL</div>
            </button>
            {/* HARD */}
            <button type="button"
              tabIndex={-1}
              onClick={() => onChangeDifficulty('hard')}
              onMouseEnter={playHoverSound}
              className={\`p-3 sm:p-4 rounded-xl border text-center transition-all duration-200 cursor-pointer \${
                difficulty === 'hard'
                  ? 'bg-[#F85149]/20 border-[#F85149] text-[#E6EDF3] shadow-[0_0_15px_rgba(248,81,73,0.2)] scale-[1.02] ring-1 ring-[#F85149]/50'
                  : 'bg-[#161B22]/50 border-[#21262D] text-[#8B949E] hover:border-[#F85149]/50 hover:text-[#C9D1D9]'
              }\`}
            >
              <div className={\`font-mono font-bold text-sm sm:text-base \${difficulty === 'hard' ? 'text-[#F85149]' : ''}\`}>HARD</div>
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
${bossModesBlock}
            </div>
          </div>
        )}
`;

code = code.replace(bossModesBlock, diffSection);

fs.writeFileSync('src/components/StartScreen.tsx', code);
