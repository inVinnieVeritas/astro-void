const fs = require('fs');
let code = fs.readFileSync('src/components/StartScreen.tsx', 'utf-8');

const target = `            {/* Wave 10 Boss */}
            <button
              type="button"
              tabIndex={-1}
              onClick={() => onChangeGameMode('wave_10_boss')}
              className={\`p-3.5 sm:p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer \${
                gameMode === 'wave_10_boss'
                  ? 'bg-[#A371F7]/20 border-[#A371F7] text-[#E6EDF3] shadow-[0_0_20px_rgba(163,113,247,0.25)] scale-[1.02] opacity-100 ring-1 ring-[#A371F7]/50'
                  : 'bg-[#161B22]/50 border-[#21262D] text-[#484F58] opacity-50 hover:opacity-80 hover:border-[#30363D] hover:text-[#8B949E]'
              }\`}
            >
              <div className={\`font-mono font-bold text-sm sm:text-base flex items-center justify-between \${
                gameMode === 'wave_10_boss' ? 'text-[#A371F7]' : 'text-[#6E7681]'
              }\`}>
                CORE SEVERANCE
                {gameMode === 'wave_10_boss' && <div className="w-2.5 h-2.5 rounded-full bg-[#A371F7] shadow-[0_0_10px_#A371F7]" />}
              </div>
              <div className={\`text-[11px] font-mono mt-1.5 leading-snug \${
                gameMode === 'wave_10_boss' ? 'text-[#C9D1D9]' : 'text-[#484F58]'
              }\`}>
                Start at Wave 10 vs AI Mainframe Core
              </div>
            </button>
          </div>
        </div>`;

const repl = target.replace('          </div>\n        </div>', `
            {/* Wave 15 Boss */}
            <button
              type="button"
              tabIndex={-1}
              onClick={() => onChangeGameMode('wave_15_boss')}
              className={\`p-3.5 sm:p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer \${
                gameMode === 'wave_15_boss'
                  ? 'bg-[#00ffff]/20 border-[#00ffff] text-[#E6EDF3] shadow-[0_0_20px_rgba(0,255,255,0.25)] scale-[1.02] opacity-100 ring-1 ring-[#00ffff]/50'
                  : 'bg-[#161B22]/50 border-[#21262D] text-[#484F58] opacity-50 hover:opacity-80 hover:border-[#30363D] hover:text-[#8B949E]'
              }\`}
            >
              <div className={\`font-mono font-bold text-sm sm:text-base flex items-center justify-between \${
                gameMode === 'wave_15_boss' ? 'text-[#00ffff]' : 'text-[#6E7681]'
              }\`}>
                TRIAD PROTOCOL
                {gameMode === 'wave_15_boss' && <div className="w-2.5 h-2.5 rounded-full bg-[#00ffff] shadow-[0_0_10px_#00ffff]" />}
              </div>
              <div className={\`text-[11px] font-mono mt-1.5 leading-snug \${
                gameMode === 'wave_15_boss' ? 'text-[#C9D1D9]' : 'text-[#484F58]'
              }\`}>
                Start at Wave 15 vs Triad Cores
              </div>
            </button>
          </div>
        </div>`);

if (code.includes(target)) {
  code = code.replace(target, repl);
  
  // also need to change the grid layout to support 6 items!
  code = code.replace('className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4"', 'className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4"');
  
  fs.writeFileSync('src/components/StartScreen.tsx', code);
  console.log('StartScreen.tsx patched');
} else {
  console.log('target not found');
}
