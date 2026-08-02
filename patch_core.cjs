const fs = require('fs');
let code = fs.readFileSync('src/components/AsteroidsCanvas.tsx', 'utf-8');

const targetStr = `          const primaryColor = isVulnerable ? '#ff0055' : '#A371F7';
          const accentColor = isVulnerable ? '#ffaa00' : '#00ffff';`;

const replacement = `          const primaryColor = isVulnerable ? '#ffaa00' : '#00ffff'; // TRON cyan and overheat amber
          const accentColor = isVulnerable ? '#ffffff' : '#ff0055';`;

code = code.replace(targetStr, replacement);
fs.writeFileSync('src/components/AsteroidsCanvas.tsx', code);
console.log('Core Severance patched');
