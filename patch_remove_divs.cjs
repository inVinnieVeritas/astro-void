const fs = require('fs');
let code = fs.readFileSync('src/components/StartScreen.tsx', 'utf8');

const target = `        )}

          </div>
        </div>

        {/* Primary Action Button - Most Prominent */}`;

const replacement = `        )}

        {/* Primary Action Button - Most Prominent */}`;

code = code.replace(target, replacement);

fs.writeFileSync('src/components/StartScreen.tsx', code);
