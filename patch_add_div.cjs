const fs = require('fs');
let code = fs.readFileSync('src/components/StartScreen.tsx', 'utf8');

const target = `            </button>

        </div>

        {/* Threat Level */}`;

const replacement = `            </button>
          </div>
        </div>

        {/* Threat Level */}`;

code = code.replace(target, replacement);

fs.writeFileSync('src/components/StartScreen.tsx', code);
