const fs = require('fs');
let code = fs.readFileSync('src/components/AsteroidsCanvas.tsx', 'utf-8');

code = code.replace(
  'const eyeRad = isVulnerable ? rad * 0.45 + eyePulse * 15 : rad * 0.35 + eyePulse * 5;',
  'const eyeRad = isVulnerable ? rad * 0.65 + eyePulse * 20 : rad * 0.55 + eyePulse * 8;'
);

fs.writeFileSync('src/components/AsteroidsCanvas.tsx', code);
