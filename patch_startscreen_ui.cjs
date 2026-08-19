const fs = require('fs');
let code = fs.readFileSync('src/components/StartScreen.tsx', 'utf8');

// Replace the end of the mode grid and insert the new stuff
const target = `              </div>
            </button>
          </div>
        </div>

        {/* Primary Action Button - Most Prominent */}`;

const bossTestCheck = `  const showBossTest = new URLSearchParams(window.location.search).get('bossTest') === '1';`;

code = code.replace(
  "  const shouldShowStrongModeState = (mode: GameMode) =>",
  bossTestCheck + "\n\n  const shouldShowStrongModeState = (mode: GameMode) =>"
);

// We need to cut out the boss buttons from the main grid. Let's do a more precise replacement.
