const fs = require('fs');
let code = fs.readFileSync('src/components/StartScreen.tsx', 'utf8');

const regex = /\{\/\* Boss Rush \(Wave 5\) \*\/\}[\s\S]*?Start at Wave 15 vs Grid Architect • Practice • Rewards Disabled\s+<\/div>\s+<\/button>/;

const diffSection = `        </div>
        </div>

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
              $&
            </div>
          </div>
        )}
`;

// Wait, the regex captures just the buttons. So I need to replace them with diffSection (which puts them inside showBossTest).
// But before $&, I added '</div></div>' to close the previous grid and section!
// The original code was:
//           </div>
//         </div>
//         {/* Primary Action Button - Most Prominent */}
// Which means my replacement should replace the buttons, and then close the original div structure, then add the boss stuff, and leave the original </div></div> below it?
// Let's do this carefully.
